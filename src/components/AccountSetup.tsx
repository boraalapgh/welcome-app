import { useState, useRef, useEffect, useMemo } from 'react';
import { useControls, folder, button } from 'leva';
import { Image } from 'lucide-react';
import { useUserType } from '../context/UserTypeContext';
import { useTransitions, easingOptions, type EasingType } from '../context/TransitionContext';
import { useLevaStores } from './LevaControls';
import {
  persistedSlideValues,
  persistSlideValues,
  clearSlideValues,
} from '../stores/levaStores';
import { type SetupStep as ConfigSetupStep } from '../config/onboarding-content';

interface AccountSetupProps {
  onComplete: () => void;
}

type SetupStep = 'legal' | 'profile' | 'organization' | 'invite';

// Map config step names to component step names
const configToComponentStep: Record<ConfigSetupStep, SetupStep> = {
  terms: 'legal',
  profile: 'profile',
  organization: 'organization',
  invites: 'invite',
};

export function AccountSetup({ onComplete }: AccountSetupProps) {
  const { config } = useUserType();
  const { pageExitDuration, pageScaleFrom, getPageTransition } = useTransitions();
  const { slidesStore } = useLevaStores();

  // Get persisted values or use defaults
  const p = persistedSlideValues as Record<string, unknown> | null;

  // Build store option - only include if store is available
  const storeOption = slidesStore ? { store: slidesStore } : {};

  // Slide transition controls (same as OnboardingSlides - shared store)
  const slideControls = useControls('Slide Carousel', {
    timing: folder({
      slideDuration: {
        value: (p?.slideDuration as number) ?? 500,
        min: 100,
        max: 1500,
        step: 50,
        label: 'Duration (ms)',
      },
      slideEasing: {
        value: (p?.slideEasing as EasingType) ?? 'ease-out',
        options: easingOptions,
        label: 'Easing',
      },
    }),
    inactive: folder({
      slideScaleInactive: {
        value: (p?.slideScaleInactive as number) ?? 0.9,
        min: 0.5,
        max: 1,
        step: 0.05,
        label: 'Inactive Scale',
      },
      slideOpacityInactive: {
        value: (p?.slideOpacityInactive as number) ?? 0.2,
        min: 0,
        max: 1,
        step: 0.1,
        label: 'Inactive Opacity',
      },
    }),
  }, storeOption);

  // Card animation controls
  const cardControls = useControls('Card Animation', {
    cardTransitionDuration: {
      value: (p?.cardTransitionDuration as number) ?? 500,
      min: 100,
      max: 1500,
      step: 50,
      label: 'Duration (ms)',
    },
    cardEasing: {
      value: (p?.cardEasing as EasingType) ?? 'ease-out',
      options: easingOptions,
      label: 'Easing',
    },
  }, storeOption);

  // Step animation controls (shared with OnboardingSlides)
  const stepControls = useControls('Step Animation', {
    stepTranslateDistance: {
      value: (p?.stepTranslateDistance as number) ?? 16,
      min: 0,
      max: 100,
      step: 4,
      label: 'Translate (px)',
    },
    stepScaleFrom: {
      value: (p?.stepScaleFrom as number) ?? 1,
      min: 0.8,
      max: 1,
      step: 0.02,
      label: 'Scale From',
    },
  }, storeOption);

  // Actions buttons
  useControls('Actions', {
    'Reset Slides': button(() => {
      clearSlideValues();
      window.location.reload();
    }),
    'Copy Values': button(() => {
      // Read current values from store to avoid stale closure
      // getData() returns full metadata, extract .value from each
      const storeData = slidesStore?.getData() as Record<string, { value: unknown }> | undefined;
      const getValue = (key: string, fallback: unknown) => storeData?.[key]?.value ?? fallback;

      const exportData = {
        slideTransitions: {
          carousel: {
            duration: getValue('Slide Carousel.timing.slideDuration', slideControls.slideDuration),
            easing: getValue('Slide Carousel.timing.slideEasing', slideControls.slideEasing),
            scaleInactive: getValue('Slide Carousel.inactive.slideScaleInactive', slideControls.slideScaleInactive),
            opacityInactive: getValue('Slide Carousel.inactive.slideOpacityInactive', slideControls.slideOpacityInactive),
          },
          card: {
            duration: getValue('Card Animation.cardTransitionDuration', cardControls.cardTransitionDuration),
            easing: getValue('Card Animation.cardEasing', cardControls.cardEasing),
          },
          step: {
            translateDistance: getValue('Step Animation.stepTranslateDistance', stepControls.stepTranslateDistance),
            scaleFrom: getValue('Step Animation.stepScaleFrom', stepControls.stepScaleFrom),
          },
        },
      };
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      console.log('Exported slide transition values:', exportData);
      alert('Slide transition values copied to clipboard! Check console for details.');
    }),
  }, storeOption);

  // Persist values on change
  useEffect(() => {
    const values = {
      slideDuration: slideControls.slideDuration,
      slideEasing: slideControls.slideEasing,
      slideScaleInactive: slideControls.slideScaleInactive,
      slideOpacityInactive: slideControls.slideOpacityInactive,
      cardTransitionDuration: cardControls.cardTransitionDuration,
      cardEasing: cardControls.cardEasing,
      stepTranslateDistance: stepControls.stepTranslateDistance,
      stepScaleFrom: stepControls.stepScaleFrom,
    };
    persistSlideValues(values);
  }, [slideControls, cardControls, stepControls]);

  // Build dynamic step order based on user type config
  const stepOrder = useMemo<SetupStep[]>(() => {
    return config.steps.map((s) => configToComponentStep[s]);
  }, [config.steps]);

  const totalSteps = stepOrder.length;

  const [currentStep, setCurrentStep] = useState<SetupStep>(stepOrder[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isStepTransitioning, setIsStepTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'back'>('next');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset to first step when config changes
  useEffect(() => {
    setCurrentStep(stepOrder[0]);
  }, [stepOrder]);

  // Trigger fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Form state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState('Acme Corp');
  const [organizationLogoPreview, setOrganizationLogoPreview] = useState<string | null>(null);
  const [inviteRows, setInviteRows] = useState<Array<{ email: string; role: string }>>(
    Array(5).fill(null).map(() => ({ email: '', role: '' }))
  );
  const orgLogoInputRef = useRef<HTMLInputElement>(null);

  const roleOptions = ['Admin', 'Editor', 'Viewer'];

  const getCurrentStepNumber = () => {
    const index = stepOrder.indexOf(currentStep);
    return index < totalSteps ? index + 1 : totalSteps;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'legal':
        return agreedToTerms;
      case 'profile':
        return firstName.trim().length > 0 && lastName.trim().length > 0;
      case 'organization':
        return organizationName.trim().length > 0;
      case 'invite':
        return true; // Optional step
      default:
        return true;
    }
  };

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setTransitionDirection('next');
      setIsStepTransitioning(true);
      setTimeout(() => {
        setCurrentStep(stepOrder[currentIndex + 1]);
        setIsStepTransitioning(false);
      }, slideControls.slideDuration);
    } else {
      // Last step - complete the setup
      setIsExiting(true);
      setTimeout(onComplete, pageExitDuration);
    }
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setTransitionDirection('back');
      setIsStepTransitioning(true);
      setTimeout(() => {
        setCurrentStep(stepOrder[currentIndex - 1]);
        setIsStepTransitioning(false);
      }, slideControls.slideDuration);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleOrgLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setOrganizationLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const triggerOrgLogoInput = () => {
    orgLogoInputRef.current?.click();
  };

  const updateInviteRow = (index: number, field: 'email' | 'role', value: string) => {
    setInviteRows(prev => prev.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    ));
  };

  const hasAnyInvites = inviteRows.some(row => row.email.trim() !== '');

  return (
    <div
      className="relative z-10 w-full min-h-full flex items-center justify-center p-4 sm:p-6 md:p-16"
      style={{
        transition: getPageTransition(),
        opacity: !isMounted || isExiting ? 0 : 1,
        transform: !isMounted || isExiting ? `scale(${pageScaleFrom})` : 'scale(1)',
      }}
    >
      {/* Main Card - min-height ensures consistent size across steps */}
      <div className="bg-white border border-[#e6e6e6] rounded-3xl w-full max-w-[720px] min-h-[520px] sm:min-h-[690px] p-6 sm:p-10 md:p-16 flex flex-col gap-6 shadow-sm">
        {/* Step Content with Transition */}
        <div
          className="flex flex-col flex-1 gap-6"
          style={{
            transition: `all ${slideControls.slideDuration}ms ${slideControls.slideEasing}`,
            opacity: isStepTransitioning ? 0 : 1,
            transform: isStepTransitioning
              ? `translateX(${transitionDirection === 'next' ? -stepControls.stepTranslateDistance : stepControls.stepTranslateDistance}px) scale(${stepControls.stepScaleFrom})`
              : 'translateX(0) scale(1)',
          }}
        >
        {/* Step 1: Legal Terms */}
        {currentStep === 'legal' && (
          <>
            {/* Header */}
            <div className="flex flex-col gap-0">
              <h1 className="text-xl sm:text-2xl md:text-[25px] font-extrabold text-[#1a1a1a] leading-[1.2]">
                Legal Terms and Conditions
              </h1>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="text-[#1a1a1a] text-sm sm:text-base leading-6 space-y-2">
                <p>
                  <span className="font-bold">AI disclosure:</span>{' '}
                  GoodHabitz Experts uses AI to assist with lesson and content
                  creation. When creating lesson, you are interacting with AI;
                  outputs may be inaccurate and require human review.
                </p>
                <p>
                  <span className="font-bold">License:</span>{' '}
                  You will obtain a license via your employer/company that provided
                  access. Please reach out to them for questions regarding your use
                  of GoodHabitz Experts.
                </p>
                <p>
                  By continuing, you confirm you have read the{' '}
                  <a
                    href="#"
                    className="text-[#5a14bd] underline font-medium hover:opacity-80 transition-opacity"
                  >
                    GoodHabitz Experts User Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="text-[#5a14bd] underline font-medium hover:opacity-80 transition-opacity"
                  >
                    Privacy Notice
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Checkbox Section */}
            <div className="border-t border-[#e6e6e6] pt-4 mt-16">
              <label className="flex items-start gap-2 cursor-pointer group w-fit">
                <div className="flex items-center justify-center w-6 h-6 shrink-0">
                  <button
                    type="button"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`w-[18px] h-[18px] rounded border-2 border-[#5a14bd] flex items-center justify-center transition-all ${
                      agreedToTerms ? 'bg-[#5a14bd]' : 'bg-white group-hover:bg-[#5a14bd]/5'
                    }`}
                    aria-checked={agreedToTerms}
                    role="checkbox"
                  >
                    {agreedToTerms && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="text-white"
                      >
                        <path
                          d="M2.5 6L5 8.5L9.5 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <span className="text-[#1a1a1a] text-sm sm:text-base leading-6 font-medium">
                  I accept the Term and Conditions
                </span>
              </label>
            </div>
          </>
        )}

        {/* Step 2: Profile Setup */}
        {currentStep === 'profile' && (
          <>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl sm:text-2xl md:text-[25px] font-extrabold text-[#1a1a1a] leading-[1.2]">
              Tell us about yourself
              </h1>
              <p className="text-[#4d4d4d] text-sm sm:text-base">
                Let's start with creating your profile
              </p>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center p-2">
              <div className="relative w-[80px] flex flex-col items-center">
                {/* Avatar Circle */}
                <div className="w-[80px] h-[80px] rounded-full bg-[#f3ecfd] flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image size={24} strokeWidth={1.5} className="text-[#1a1a1a]" />
                  )}
                </div>
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#5a14bd] text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-[#4a10a0] transition-colors"
                >
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              {/* First Name + Last Name */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <label className="text-base font-medium text-[#1a1a1a]">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#808080]">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      className="w-full h-12 pl-11 pr-3 rounded-lg border border-[#e6e6e6] focus:border-[#5a14bd] focus:ring-1 focus:ring-[#5a14bd] outline-none transition-all text-base text-[#1a1a1a] placeholder:text-[#666]"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <label className="text-base font-medium text-[#1a1a1a]">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#808080]">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Your last name"
                      className="w-full h-12 pl-11 pr-3 rounded-lg border border-[#e6e6e6] focus:border-[#5a14bd] focus:ring-1 focus:ring-[#5a14bd] outline-none transition-all text-base text-[#1a1a1a] placeholder:text-[#666]"
                    />
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-0.5 w-full sm:w-[284px]">
                <label className="text-base font-medium text-[#1a1a1a]">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Your role in the organization"
                  className="w-full h-12 px-3 rounded-lg border border-[#e6e6e6] focus:border-[#5a14bd] focus:ring-1 focus:ring-[#5a14bd] outline-none transition-all text-base text-[#1a1a1a] placeholder:text-[#666]"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-0.5 w-full">
                <label className="text-base font-medium text-[#1a1a1a]">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="About you"
                  className="w-full min-h-[68px] px-3 py-2 rounded-lg border border-[#e6e6e6] focus:border-[#5a14bd] focus:ring-1 focus:ring-[#5a14bd] outline-none transition-all text-base text-[#1a1a1a] placeholder:text-[#666] resize-y"
                />
              </div>
            </div>
          </>
        )}

        {/* Step 3: Organization */}
        {currentStep === 'organization' && (
          <>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl sm:text-2xl md:text-[25px] font-extrabold text-[#1a1a1a] leading-[1.2]">
                Organization Setup
              </h1>
              <p className="text-[#4d4d4d] text-sm sm:text-base leading-6">
                Let's complete the setup
              </p>
            </div>

            {/* Company Logo Upload Section */}
            <div className="flex items-start gap-6 px-2 py-2">
              {/* Logo Upload */}
              <div className="relative w-[80px] flex flex-col items-center shrink-0">
                {/* Logo Circle */}
                <div className="w-[80px] h-[80px] rounded-full bg-[#f3ecfd] flex items-center justify-center overflow-hidden">
                  {organizationLogoPreview ? (
                    <img
                      src={organizationLogoPreview}
                      alt="Organization logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image size={24} strokeWidth={1.5} className="text-[#1a1a1a]" />
                  )}
                </div>
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={triggerOrgLogoInput}
                  className="absolute top-[67px] left-[7px] bg-[#5a14bd] text-white text-sm font-medium px-2 py-1 rounded-full hover:bg-[#4a10a0] transition-colors leading-[21px]"
                >
                  Upload
                </button>
                <input
                  ref={orgLogoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleOrgLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Company Logo Text */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h2 className="text-lg font-extrabold text-[#1a1a1a] leading-[21.6px]">
                  Company Logo
                </h2>
                <p className="text-xs text-[#4d4d4d] tracking-[0.5px] leading-[18px]">
                  Will be used in the future
                </p>
              </div>
            </div>

            {/* Display Name Input */}
            <div className="flex flex-col gap-0.5 w-full max-w-[480px]">
              <label className="text-base font-medium text-[#1a1a1a] leading-6">
                Display Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full h-12 px-3 rounded-lg border border-[#1a1a1a] focus:border-[#5a14bd] focus:ring-1 focus:ring-[#5a14bd] outline-none transition-all text-base text-[#1a1a1a] placeholder:text-[#666]"
              />
            </div>
          </>
        )}

        {/* Step 4: Invite */}
        {currentStep === 'invite' && (
          <>
            {/* Header with Import CSV button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-2 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-[25px] font-extrabold text-[#1a1a1a] leading-[1.2]">
                  Invite Team Members
                </h1>
                <p className="text-[#4d4d4d] text-sm sm:text-base">
                  Who should have the early access. They will get an email to complete their setup.
                </p>
                
              </div>
              <button
                type="button"
                className="h-9 px-4 rounded-lg border border-[#5a14bd] text-[#5a14bd] text-sm font-extrabold hover:bg-[#5a14bd]/5 transition-colors shrink-0"
              >
                Import CSV
              </button>
            </div>

            {/* Email + Role Grid */}
            <div className="flex flex-col gap-6">
              {/* Column Headers */}
              <div className="grid grid-cols-[1fr_minmax(120px,180px)] gap-6">
                <label className="text-sm font-medium text-[#1a1a1a]">Email</label>
                <label className="text-sm font-medium text-[#1a1a1a]">Role</label>
              </div>

              {/* Input Rows */}
              <div className="flex flex-col gap-4">
                {inviteRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-[1fr_minmax(120px,180px)] gap-6">
                    <input
                      type="email"
                      value={row.email}
                      onChange={(e) => updateInviteRow(index, 'email', e.target.value)}
                      placeholder="Email Address"
                      className="w-full h-12 px-3 rounded-lg border border-[#e6e6e6] focus:border-[#5a14bd] focus:ring-1 focus:ring-[#5a14bd] outline-none transition-all text-base text-[#1a1a1a] placeholder:text-[#666]"
                    />
                    <div className="relative">
                      <select
                        value={row.role}
                        onChange={(e) => updateInviteRow(index, 'role', e.target.value)}
                        className="w-full h-12 px-3 pr-10 rounded-lg border border-[#e6e6e6] focus:border-[#5a14bd] focus:ring-1 focus:ring-[#5a14bd] outline-none transition-all text-base text-[#666] bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Select</option>
                        {roleOptions.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>
                            {roleOption}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1a1a1a]"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        </div>

        {/* Footer - Vertically Centered */}
        <div className="flex  ">

        <div className="flex items-center justify-between gap-4 pt-2 flex-1">
          <div className="flex items-center gap-4">
          {/* Left: Back Button */}
            {stepOrder.indexOf(currentStep) > 0 && (
          <div className="w-12 h-12 flex items-center justify-center">
              <button
                onClick={handleBack}
                className="w-12 h-12 rounded-lg flex items-center justify-center text-[#5a14bd] hover:bg-[#5a14bd]/5 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
          </div>
            )}

          {/* Center: Step Indicator */}
          <p className="text-[#666] text-xs font-semibold tracking-[0.5px] uppercase">
            Step {getCurrentStepNumber()} of {totalSteps}
          </p>
          </div>

          {/* Right: Button(s) */}
          {currentStep === 'invite' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleNext}
                disabled={!hasAnyInvites}
                className={`h-12 px-6 rounded-lg font-extrabold text-base transition-all ${
                  hasAnyInvites
                    ? 'bg-[#5a14bd] text-white hover:bg-[#4a10a0] cursor-pointer'
                    : 'bg-[#e6e6e6] text-[#808080] cursor-not-allowed'
                }`}
              >
                Complete
              </button>
              <button
                onClick={handleNext}
                className="h-12 px-6 rounded-lg font-extrabold text-base border border-[#5a14bd] text-[#5a14bd] hover:bg-[#5a14bd]/5 transition-all"
              >
                Skip
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`h-12 px-6 rounded-lg font-extrabold text-base transition-all ${
                canProceed()
                  ? 'bg-[#5a14bd] text-white hover:bg-[#4a10a0] cursor-pointer'
                  : 'bg-[#e6e6e6] text-[#808080] cursor-not-allowed'
              }`}
            >
              Next
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
