import OrbOriginal from '@/components/OrbOriginal';
import { StarsCanvas } from './StarsCanvas';
import { useControls, folder, button } from 'leva';
import { persistedLogoValues, clearLogoValues } from '../stores/levaStores';
import { useLevaStores } from './LevaControls';

export function CompleteLogo() {
  const { logoStore } = useLevaStores();

  // Get persisted values or use defaults
  const p = persistedLogoValues as Record<string, unknown> | null;

  // Build store option - only include if store is available
  const storeOption = logoStore ? { store: logoStore } : {};

  // Shared Leva controls with Welcome (same store)
  const orbControls = useControls('Logo Orb', {
    size: folder({
      orbSize: { value: (p?.orbSize as number) ?? 320, min: 100, max: 500, step: 10, label: 'Size (px)' },
    }),
    appearance: folder({
      hue: { value: (p?.hue as number) ?? 270, min: 0, max: 360, step: 1, label: 'Hue' },
      backgroundColor: { value: (p?.backgroundColor as string) ?? '#ffffff', label: 'Background' },
    }),
    colors: folder({
      color1: { value: (p?.color1 as string) ?? '#9c43fe', label: 'Primary' },
      color2: { value: (p?.color2 as string) ?? '#4cc2e9', label: 'Secondary' },
      color3: { value: (p?.color3 as string) ?? '#101499', label: 'Accent' },
    }, { collapsed: true }),
    interaction: folder({
      hoverIntensity: { value: (p?.hoverIntensity as number) ?? 0.2, min: 0, max: 1, step: 0.05, label: 'Hover Intensity' },
      rotateOnHover: { value: (p?.rotateOnHover as boolean) ?? true, label: 'Rotate on Hover' },
      forceHoverState: { value: (p?.forceHoverState as boolean) ?? false, label: 'Force Hover' },
      rotationSpeed: { value: (p?.rotationSpeed as number) ?? 0.3, min: 0, max: 2, step: 0.1, label: 'Rotation Speed' },
    }),
    advanced: folder({
      animationSpeed: { value: (p?.animationSpeed as number) ?? 1.0, min: 0.1, max: 3, step: 0.1, label: 'Animation Speed' },
      innerRadius: { value: (p?.innerRadius as number) ?? 0.6, min: 0.2, max: 0.9, step: 0.05, label: 'Inner Radius' },
      noiseScale: { value: (p?.noiseScale as number) ?? 0.65, min: 0.1, max: 2, step: 0.05, label: 'Noise Scale' },
    }, { collapsed: true }),
  }, storeOption);

  // Shared Leva controls for Stars (same store as Welcome)
  const starsControls = useControls('Logo Stars', {
    scale: folder({
      globalScale: { value: (p?.globalScale as number) ?? 1.0, min: 0.5, max: 2, step: 0.1, label: 'Global Scale' },
    }),
    animation: folder({
      bobAmplitudeMultiplier: { value: (p?.bobAmplitudeMultiplier as number) ?? 1.0, min: 0, max: 3, step: 0.1, label: 'Bob Amplitude' },
      bobSpeedMultiplier: { value: (p?.bobSpeedMultiplier as number) ?? 1.0, min: 0, max: 3, step: 0.1, label: 'Bob Speed' },
      rotationSpeedMultiplier: { value: (p?.rotationSpeedMultiplier as number) ?? 1.0, min: 0, max: 3, step: 0.1, label: 'Rotation Speed' },
      pulseIntensity: { value: (p?.pulseIntensity as number) ?? 0.04, min: 0, max: 0.2, step: 0.01, label: 'Pulse Intensity' },
    }),
    lighting: folder({
      ambientLightIntensity: { value: (p?.ambientLightIntensity as number) ?? 0.6, min: 0, max: 2, step: 0.1, label: 'Ambient Light' },
      directionalLightIntensity: { value: (p?.directionalLightIntensity as number) ?? 0.8, min: 0, max: 2, step: 0.1, label: 'Directional Light' },
      tiltAngle: { value: (p?.tiltAngle as number) ?? 30, min: 0, max: 90, step: 5, label: 'Tilt Angle' },
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

  return (
    <div
      className="relative z-10 mb-6"
      style={{ width: orbControls.orbSize, height: orbControls.orbSize }}
    >
      {/* Orb and white background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
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
        isExiting={false}
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
}
