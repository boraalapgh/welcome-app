export type UserTypeId = 'UT1' | 'UT2' | 'UT3' | 'UT4';

export type SetupStep = 'terms' | 'profile' | 'organization' | 'invites';

export interface OnboardingSlide {
  title: string;
  description: string;
  image?: string;
}

export interface UserTypeConfig {
  label: string;
  steps: SetupStep[];
  slides: [OnboardingSlide, OnboardingSlide, OnboardingSlide]; // Exactly 3 slides
}

export const onboardingContent: Record<UserTypeId, UserTypeConfig> = {
  UT1: {
    label: 'Admin – First Time',
    steps: ['terms', 'profile', 'organization', 'invites'],
    slides: [
      {
        title: 'Build Your Learning Empire',
        description: 'Set up your organization and invite your team to create impactful courses together.',
        image: '/onboarding-1.jpg',
      },
      {
        title: 'Manage With Ease',
        description: 'Full administrative control over content, users, and analytics in one powerful dashboard.',
        image: '/onboarding-2.jpg',
      },
      {
        title: 'Scale Your Impact',
        description: 'From onboarding to upskilling, deliver learning experiences that transform your organization.',
        image: '/onboarding-3.jpg',
      },
    ],
  },
  UT2: {
    label: 'Admin – Invited',
    steps: ['terms', 'profile'],
    slides: [
      {
        title: 'Welcome to the Team',
        description: "You've been invited to help manage and grow your organization's learning platform.",
        image: '/onboarding-1.jpg',
      },
      {
        title: 'Collaborate & Create',
        description: 'Work alongside your team to build courses, manage content, and track learner progress.',
        image: '/onboarding-2.jpg',
      },
      {
        title: 'Make an Impact',
        description: 'Your expertise will help shape the learning experience for everyone in your organization.',
        image: '/onboarding-3.jpg',
      },
    ],
  },
  UT3: {
    label: 'Content Owner',
    steps: ['terms', 'profile'],
    slides: [
      {
        title: 'Share Your Expertise',
        description: 'Transform your knowledge into engaging courses that inspire and educate.',
        image: '/onboarding-1.jpg',
      },
      {
        title: 'Create With AI Assistance',
        description: 'Our AI-powered tools help you structure, write, and enhance your course content.',
        image: '/onboarding-2.jpg',
      },
      {
        title: 'Reach Your Audience',
        description: 'Publish your courses and see the impact of your expertise on learners worldwide.',
        image: '/onboarding-3.jpg',
      },
    ],
  },
  UT4: {
    label: 'Learner',
    steps: ['terms', 'profile'],
    slides: [
      {
        title: 'Your Learning Journey Starts Here',
        description: 'Access curated courses designed to help you grow professionally and personally.',
        image: '/onboarding-1.jpg',
      },
      {
        title: 'Learn at Your Own Pace',
        description: 'Flexible learning paths that fit your schedule and adapt to your progress.',
        image: '/onboarding-2.jpg',
      },
      {
        title: 'Track Your Growth',
        description: 'Earn certifications, track achievements, and see your skills develop over time.',
        image: '/onboarding-3.jpg',
      },
    ],
  },
};

export const userTypeIds: UserTypeId[] = ['UT1', 'UT2', 'UT3', 'UT4'];

export const getUserTypeConfig = (userTypeId: UserTypeId): UserTypeConfig => {
  return onboardingContent[userTypeId];
};
