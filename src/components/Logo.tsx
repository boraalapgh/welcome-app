import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import OrbOriginal from '@/components/OrbOriginal';
import { StarsCanvas } from './StarsCanvas';
import { useControls, folder, button } from 'leva';
import { persistLogoValues, persistedLogoValues, clearLogoValues } from '../stores/levaStores';
import { useLevaStores } from './LevaControls';

interface LogoProps {
  isExiting?: boolean;
  className?: string;
}

export interface LogoRef {
  fadeOutOrb: () => void;
}

export const Logo = forwardRef<LogoRef, LogoProps>(function Logo(
  { isExiting = false, className = '' },
  ref
) {
  const { logoStore } = useLevaStores();
  const orbBgRef = useRef<HTMLDivElement>(null);

  // Get persisted values or use defaults
  const p = persistedLogoValues as Record<string, unknown> | null;

  // Build store option - only include if store is available
  const storeOption = logoStore ? { store: logoStore } : {};

  // Default values for the logo
  const defaults = {
    orb: {
      orbSize: 320,
      hue: 270,
      backgroundColor: '#ffffff',
      color1: '#9c43fe',
      color2: '#4cc2e9',
      color3: '#101499',
      hoverIntensity: 0.2,
      rotateOnHover: true,
      forceHoverState: false,
      rotationSpeed: 0.3,
      animationSpeed: 1,
      innerRadius: 0.6,
      noiseScale: 0.65,
    },
    stars: {
      globalScale: 1,
      bobAmplitudeMultiplier: 1,
      bobSpeedMultiplier: 1,
      rotationSpeedMultiplier: 1,
      pulseIntensity: 0.04,
      ambientLightIntensity: 0.6,
      directionalLightIntensity: 0.8,
      tiltAngle: 30,
    },
  };

  // Leva controls for the Orb
  const orbControls = useControls('Logo Orb', {
    size: folder({
      orbSize: { value: (p?.orbSize as number) ?? defaults.orb.orbSize, min: 100, max: 500, step: 10, label: 'Size (px)' },
    }),
    appearance: folder({
      hue: { value: (p?.hue as number) ?? defaults.orb.hue, min: 0, max: 360, step: 1, label: 'Hue' },
      backgroundColor: { value: (p?.backgroundColor as string) ?? defaults.orb.backgroundColor, label: 'Background' },
    }),
    colors: folder({
      color1: { value: (p?.color1 as string) ?? defaults.orb.color1, label: 'Primary' },
      color2: { value: (p?.color2 as string) ?? defaults.orb.color2, label: 'Secondary' },
      color3: { value: (p?.color3 as string) ?? defaults.orb.color3, label: 'Accent' },
    }, { collapsed: true }),
    interaction: folder({
      hoverIntensity: { value: (p?.hoverIntensity as number) ?? defaults.orb.hoverIntensity, min: 0, max: 1, step: 0.05, label: 'Hover Intensity' },
      rotateOnHover: { value: (p?.rotateOnHover as boolean) ?? defaults.orb.rotateOnHover, label: 'Rotate on Hover' },
      forceHoverState: { value: (p?.forceHoverState as boolean) ?? defaults.orb.forceHoverState, label: 'Force Hover' },
      rotationSpeed: { value: (p?.rotationSpeed as number) ?? defaults.orb.rotationSpeed, min: 0, max: 2, step: 0.1, label: 'Rotation Speed' },
    }),
    advanced: folder({
      animationSpeed: { value: (p?.animationSpeed as number) ?? defaults.orb.animationSpeed, min: 0.1, max: 3, step: 0.1, label: 'Animation Speed' },
      innerRadius: { value: (p?.innerRadius as number) ?? defaults.orb.innerRadius, min: 0.2, max: 0.9, step: 0.05, label: 'Inner Radius' },
      noiseScale: { value: (p?.noiseScale as number) ?? defaults.orb.noiseScale, min: 0.1, max: 2, step: 0.05, label: 'Noise Scale' },
    }, { collapsed: true }),
  }, storeOption);

  // Leva controls for Stars
  const starsControls = useControls('Logo Stars', {
    scale: folder({
      globalScale: { value: (p?.globalScale as number) ?? defaults.stars.globalScale, min: 0.5, max: 2, step: 0.1, label: 'Global Scale' },
    }),
    animation: folder({
      bobAmplitudeMultiplier: { value: (p?.bobAmplitudeMultiplier as number) ?? defaults.stars.bobAmplitudeMultiplier, min: 0, max: 3, step: 0.1, label: 'Bob Amplitude' },
      bobSpeedMultiplier: { value: (p?.bobSpeedMultiplier as number) ?? defaults.stars.bobSpeedMultiplier, min: 0, max: 3, step: 0.1, label: 'Bob Speed' },
      rotationSpeedMultiplier: { value: (p?.rotationSpeedMultiplier as number) ?? defaults.stars.rotationSpeedMultiplier, min: 0, max: 3, step: 0.1, label: 'Rotation Speed' },
      pulseIntensity: { value: (p?.pulseIntensity as number) ?? defaults.stars.pulseIntensity, min: 0, max: 0.2, step: 0.01, label: 'Pulse Intensity' },
    }),
    lighting: folder({
      ambientLightIntensity: { value: (p?.ambientLightIntensity as number) ?? defaults.stars.ambientLightIntensity, min: 0, max: 2, step: 0.1, label: 'Ambient Light' },
      directionalLightIntensity: { value: (p?.directionalLightIntensity as number) ?? defaults.stars.directionalLightIntensity, min: 0, max: 2, step: 0.1, label: 'Directional Light' },
      tiltAngle: { value: (p?.tiltAngle as number) ?? defaults.stars.tiltAngle, min: 0, max: 90, step: 5, label: 'Tilt Angle' },
    }, { collapsed: true }),
  }, storeOption);

  // Actions buttons for logo
  useControls('Actions', {
    'Reset Logo': button(() => {
      clearLogoValues();
      window.location.reload();
    }),
    'Copy Values': button(() => {
      const exportData = {
        orb: {
          orbSize: orbControls.orbSize,
          hue: orbControls.hue,
          backgroundColor: orbControls.backgroundColor,
          color1: orbControls.color1,
          color2: orbControls.color2,
          color3: orbControls.color3,
          hoverIntensity: orbControls.hoverIntensity,
          rotateOnHover: orbControls.rotateOnHover,
          forceHoverState: orbControls.forceHoverState,
          rotationSpeed: orbControls.rotationSpeed,
          animationSpeed: orbControls.animationSpeed,
          innerRadius: orbControls.innerRadius,
          noiseScale: orbControls.noiseScale,
        },
        stars: {
          globalScale: starsControls.globalScale,
          bobAmplitudeMultiplier: starsControls.bobAmplitudeMultiplier,
          bobSpeedMultiplier: starsControls.bobSpeedMultiplier,
          rotationSpeedMultiplier: starsControls.rotationSpeedMultiplier,
          pulseIntensity: starsControls.pulseIntensity,
          ambientLightIntensity: starsControls.ambientLightIntensity,
          directionalLightIntensity: starsControls.directionalLightIntensity,
          tiltAngle: starsControls.tiltAngle,
        },
      };
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      console.log('Exported logo values:', exportData);
      alert('Logo values copied to clipboard! Check console for details.');
    }),
  }, storeOption);

  // Persist logo values when they change
  useEffect(() => {
    const allValues = {
      ...orbControls,
      ...starsControls,
    };
    persistLogoValues(allValues);
  }, [orbControls, starsControls]);

  // Expose fadeOutOrb method for parent components
  useImperativeHandle(ref, () => ({
    fadeOutOrb: () => {
      if (orbBgRef.current) {
        orbBgRef.current.style.transition = 'opacity 0.8s ease-out';
        orbBgRef.current.style.opacity = '0';
      }
    },
  }));

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: orbControls.orbSize,
        height: orbControls.orbSize,
      }}
    >
      {/* Orb and white background */}
      <div
        ref={orbBgRef}
        className="absolute inset-0"
        style={{ zIndex: 0 }}
      >
        {/* Blurred white background for soft edges */}
        <div className="absolute inset-[-5%] rounded-full bg-white blur-lg opacity-70 w-[110%] h-[110%]" />
        {/* Orb clipped to circle */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <OrbOriginal
            hue={orbControls.hue}
            hoverIntensity={orbControls.hoverIntensity}
            rotateOnHover={orbControls.rotateOnHover}
            forceHoverState={orbControls.forceHoverState}
            backgroundColor={orbControls.backgroundColor}
            animationSpeed={orbControls.animationSpeed}
            innerRadius={orbControls.innerRadius}
            noiseScale={orbControls.noiseScale}
            rotationSpeed={orbControls.rotationSpeed}
            color1={orbControls.color1}
            color2={orbControls.color2}
            color3={orbControls.color3}
          />
        </div>
      </div>
      {/* Stars */}
      <StarsCanvas
        isExiting={isExiting}
        containerSize={orbControls.orbSize}
        globalScale={starsControls.globalScale}
        bobAmplitudeMultiplier={starsControls.bobAmplitudeMultiplier}
        bobSpeedMultiplier={starsControls.bobSpeedMultiplier}
        rotationSpeedMultiplier={starsControls.rotationSpeedMultiplier}
        tiltAngle={starsControls.tiltAngle}
        pulseIntensity={starsControls.pulseIntensity}
        ambientLightIntensity={starsControls.ambientLightIntensity}
        directionalLightIntensity={starsControls.directionalLightIntensity}
      />
    </div>
  );
});
