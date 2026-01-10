// AI Chat Service for Interview Prototype
// Uses AI SDK for streaming responses

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  timestamp: Date;
}

// Configurable model
const AI_MODEL = 'gpt-4o-mini';

// System prompt defining the AI interviewer persona
const SYSTEM_PROMPT = `You are TEACH, a friendly AI assistant helping experts create training lessons for GoodHabitz. Your goal is to gather information about their lesson through a conversational interview.

You should ask questions about:
1. The specific topic they want to teach (clarify scope and focus)
2. Who is the target audience (experience level, role, department)
3. What current behaviors exist in the company related to this topic
4. What desired behaviors should learners exhibit after the lesson
5. Specific learning goals and outcomes they want to achieve

Guidelines:
- Ask ONE question at a time
- Be conversational, warm, and encouraging
- Keep responses concise (2-3 sentences max)
- Acknowledge their answers before asking the next question
- Use their previous answers to inform follow-up questions
- After gathering enough information (usually 4-6 exchanges), summarize what you've learned and confirm you're ready to help create the lesson

Start by acknowledging the topic they provided and asking your first clarifying question.`;

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class AIChatService {
  private apiKey: string | null = null;
  private conversationHistory: OpenAIMessage[] = [];
  private openai: ReturnType<typeof createOpenAI> | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    if (this.apiKey) {
      this.openai = createOpenAI({
        apiKey: this.apiKey,
      });
    }
    this.resetConversation();
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.openai;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    this.openai = createOpenAI({
      apiKey: key,
    });
  }

  resetConversation(): void {
    this.conversationHistory = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createUserMessage(content: string): ChatMessage {
    return {
      id: this.generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    };
  }

  /**
   * Stream a message response with optional reasoning support
   * @param userMessage - The user's message
   * @param onTextChunk - Callback for each text chunk
   * @param onComplete - Callback when streaming is complete
   * @param onError - Callback for errors
   * @param onReasoningChunk - Optional callback for reasoning chunks (for models that support it)
   */
  async streamMessage(
    userMessage: string,
    onTextChunk: (chunk: string, fullText: string) => void,
    onComplete: (finalMessage: ChatMessage) => void,
    onError: (error: Error) => void,
    onReasoningChunk?: (chunk: string, fullReasoning: string) => void
  ): Promise<void> {
    if (!this.openai) {
      onError(new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.'));
      return;
    }

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    let fullText = '';
    let fullReasoning = '';

    try {
      const result = streamText({
        model: this.openai(AI_MODEL),
        messages: this.conversationHistory,
      });

      // Stream the response - handle both text and reasoning if available
      for await (const textPart of result.textStream) {
        fullText += textPart;
        onTextChunk(textPart, fullText);
      }

      // Try to get reasoning from result (available for some models like Claude with extended thinking)
      try {
        const finalResult = await result;
        // Reasoning comes as an array of ReasoningOutput objects
        const reasoningArray = await finalResult.reasoning;
        if (reasoningArray && reasoningArray.length > 0 && onReasoningChunk) {
          // Extract text from reasoning parts
          fullReasoning = reasoningArray
            .map(r => 'text' in r ? String(r.text) : '')
            .filter(Boolean)
            .join('\n');
          if (fullReasoning) {
            onReasoningChunk(fullReasoning, fullReasoning);
          }
        }
      } catch {
        // Reasoning not available for this model - that's fine
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: fullText
      });

      // Create final message
      const finalMessage: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: fullText,
        reasoning: fullReasoning || undefined,
        timestamp: new Date()
      };

      onComplete(finalMessage);
    } catch (error) {
      // Remove user message from history on error
      this.conversationHistory.pop();
      onError(error instanceof Error ? error : new Error('Failed to get AI response'));
    }
  }

  /**
   * Legacy non-streaming method for backwards compatibility
   */
  async sendMessage(userMessage: string): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      this.streamMessage(
        userMessage,
        () => {}, // Ignore chunks for non-streaming
        (message) => resolve(message),
        (error) => reject(error)
      );
    });
  }

  getHistory(): ChatMessage[] {
    return this.conversationHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        id: this.generateId(),
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date()
      }));
  }
}

export const aiChatService = new AIChatService();
export { AIChatService };
