# Prototypes System

This folder contains interactive prototypes displayed in the right panel of `OnboardingSlidesV2.tsx`. Each prototype demonstrates product features during the onboarding flow.

## Architecture

```
prototypes/
├── LessonPrototype.tsx          # Prototype 1: Lesson viewer (slide 0)
├── [Future]Prototype.tsx        # Prototype 2: TBD (slide 1)
├── [Future]Prototype.tsx        # Prototype 3: TBD (slide 2)
├── screens/                     # Screen components for each prototype
│   ├── LessonOverview.tsx
│   ├── QuickDive.tsx
│   ├── DailyDilemma.tsx
│   └── InPractice.tsx
├── modals/                      # Modal components
│   ├── ExpertProfileModal.tsx
│   └── WhatIsInItForMeModal.tsx
└── shared/                      # Reusable components across prototypes
    ├── PhoneFrame.tsx           # Device frame wrapper
    └── SlideNavigation.tsx      # Prev/next + counter
```

## How Prototypes Are Used

Prototypes render in `OnboardingSlidesV2.tsx` based on the current slide:

```tsx
{/* Right Panel - Interactive Prototype Area */}
<div className="flex-1 flex items-center justify-center lg:bg-white">
  {currentSlide === 0 && <LessonPrototype />}
  {currentSlide === 1 && <SecondPrototype />}  // Future
  {currentSlide === 2 && <ThirdPrototype />}   // Future
</div>
```

## Creating a New Prototype

### 1. Main Container Component

Create `[Name]Prototype.tsx` in the prototypes root folder:

```tsx
import { useState } from 'react';
import { PhoneFrame } from './shared/PhoneFrame';

type Screen = 'main' | 'detail' | 'other';
type Modal = 'info' | null;

export function NewPrototype() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [activeModal, setActiveModal] = useState<Modal>(null);

  return (
    <PhoneFrame>
      {/* Screen routing */}
      {currentScreen === 'main' && (
        <MainScreen onNavigate={setCurrentScreen} />
      )}

      {/* Modals */}
      {activeModal === 'info' && (
        <InfoModal onClose={() => setActiveModal(null)} />
      )}
    </PhoneFrame>
  );
}
```

### 2. Screen Components

Place screens in `screens/` folder. Each screen should:
- Accept `onBack` prop for navigation back
- Handle its own internal state (slides, selections, etc.)
- Use consistent styling (see Design Tokens below)

```tsx
interface ScreenProps {
  onBack: () => void;
}

export function MyScreen({ onBack }: ScreenProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-6 bg-white rounded-full p-2 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] z-10"
      >
        <ChevronLeft size={24} className="text-[#5a14bd]" />
      </button>

      {/* Content */}
    </div>
  );
}
```

### 3. Multi-Slide Screens

For screens with multiple slides, use `SlideNavigation`:

```tsx
import { SlideNavigation } from '../shared/SlideNavigation';

export function MultiSlideScreen({ onBack }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [...]; // Your slide data

  return (
    <div className="flex flex-col h-full">
      {/* Content */}

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrev={() => setCurrentSlide(s => s - 1)}
        onNext={() => setCurrentSlide(s => s + 1)}
        variant="dark" // or "light"
      />
    </div>
  );
}
```

### 4. Modal Components

Place modals in `modals/` folder:

```tsx
interface ModalProps {
  onClose: () => void;
}

export function MyModal({ onClose }: ModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-t-3xl w-full p-6">
        <button onClick={onClose}>
          <X size={24} />
        </button>
        {/* Content */}
      </div>
    </div>
  );
}
```

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary purple | `#5a14bd` | Buttons, accents, icons |
| Dark purple | `#2e0a61` | Dark backgrounds |
| Light purple bg | `#f3ecfd` | Cards, highlights |
| Pink accent bg | `#fff5fa` | Badges, tags |
| Text dark | `#1a1a1a` | Headings |
| Text medium | `#4d4d4d` | Body text |
| Text light | `#666` | Secondary text |
| Shadow | `0px 4px 40px rgba(0,0,0,0.16)` | Floating buttons |
| Border radius (cards) | `rounded-xl` (12px) or `rounded-2xl` (16px) |
| Border radius (buttons) | `rounded-full` |

## Figma Assets

Assets are loaded via Figma MCP URLs. To get new assets:

1. Use `mcp__plugin_figma_figma__get_design_context` with the node ID
2. Extract asset URLs from the response
3. Store in a constants object at the top of the main prototype file

```tsx
export const MY_ASSETS = {
  avatar: 'https://www.figma.com/api/mcp/asset/...',
  background: 'https://www.figma.com/api/mcp/asset/...',
};
```

**Note:** Figma asset URLs expire after 7 days. For production, download and host assets locally.

## Shared Components

### PhoneFrame

Wraps prototype in a device frame on desktop:
- Max width: 390px
- Max height: 844px (iPhone 14 Pro dimensions)
- Border radius: 48px
- Only shows frame on `lg:` breakpoint and up

### SlideNavigation

Navigation controls for multi-slide screens:
- Props: `currentSlide`, `totalSlides`, `onPrev`, `onNext`, `variant`, `disabled`
- Variants: `"dark"` (purple buttons) or `"light"` (white buttons)

## History

**January 2025**: Created prototype system for alternative onboarding flow (`OnboardingSlidesV2`).

**Prototype 1 - Lesson Viewer**: Interactive mobile lesson with 4 screens:
- LessonOverview: Main lesson card with activity navigation
- QuickDive: Scrollable article content
- DailyDilemma: A/B choice cards with tilted layout, feedback system
- InPractice: Multi-slide tips with "Here's how to do it" callouts

Plus 2 modals:
- ExpertProfileModal: Expert bio and credentials
- WhatIsInItForMeModal: Benefits explanation

## Checklist for New Prototypes

- [ ] Create main `[Name]Prototype.tsx` with screen/modal state management
- [ ] Wrap content in `<PhoneFrame>` component
- [ ] Create screen components in `screens/` folder
- [ ] Create modal components in `modals/` folder (if needed)
- [ ] Use `SlideNavigation` for multi-slide screens
- [ ] Follow design tokens for consistent styling
- [ ] Export assets constant if using Figma images
- [ ] Wire prototype to correct slide in `OnboardingSlidesV2.tsx`
- [ ] Test all navigation paths (back buttons, modals, slides)
