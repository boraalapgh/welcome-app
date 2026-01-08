import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import { useControls, folder, button } from 'leva';
import { useDebugControls } from '../context/DebugControlsContext';
import { persistParticleValues, persistedParticleValues, clearParticleValues } from '../stores/levaStores';
import { useLevaStores } from './LevaControls';

export function CelebrationParticles() {
  const [init, setInit] = useState(false);
  const { isEnabled } = useDebugControls();
  const { particlesStore } = useLevaStores();
  const debugMode = isEnabled('particles');

  // Get persisted values or use defaults
  const p = persistedParticleValues as Record<string, unknown> | null;

  // Build store option - only include if store is available
  const storeOption = particlesStore ? { store: particlesStore } : {};

  const controls = useControls('Particles', {
    count: folder({
      particleCount: { value: (p?.particleCount as number) ?? 60, min: 10, max: 200, step: 5, label: 'Count' },
    }),

    size: folder({
      sizeMin: { value: (p?.sizeMin as number) ?? 3, min: 1, max: 20, step: 1, label: 'Min Size' },
      sizeMax: { value: (p?.sizeMax as number) ?? 12, min: 1, max: 30, step: 1, label: 'Max Size' },
    }),

    opacity: folder({
      opacityMin: { value: (p?.opacityMin as number) ?? 0.4, min: 0, max: 1, step: 0.1, label: 'Min Opacity' },
      opacityMax: { value: (p?.opacityMax as number) ?? 0.8, min: 0, max: 1, step: 0.1, label: 'Max Opacity' },
    }),

    movement: folder({
      speedMin: { value: (p?.speedMin as number) ?? 0.5, min: 0, max: 10, step: 0.1, label: 'Min Speed' },
      speedMax: { value: (p?.speedMax as number) ?? 2, min: 0, max: 10, step: 0.1, label: 'Max Speed' },
    }),

    animations: folder({
      rotateSpeed: { value: (p?.rotateSpeed as number) ?? 5, min: 0, max: 30, step: 1, label: 'Rotate Speed' },
      tiltSpeed: { value: (p?.tiltSpeed as number) ?? 15, min: 0, max: 30, step: 1, label: 'Tilt Speed' },
      wobbleEnabled: { value: (p?.wobbleEnabled as boolean) ?? true, label: 'Wobble' },
      wobbleDistance: { value: (p?.wobbleDistance as number) ?? 15, min: 0, max: 50, step: 1, label: 'Wobble Distance' },
      wobbleSpeed: { value: (p?.wobbleSpeed as number) ?? 5, min: 0, max: 20, step: 1, label: 'Wobble Speed' },
    }),

    colors: folder({
      color1: { value: (p?.color1 as string) ?? '#5a14bd', label: 'Purple' },
      color2: { value: (p?.color2 as string) ?? '#00d6a1', label: 'Teal' },
      color3: { value: (p?.color3 as string) ?? '#fac541', label: 'Yellow' },
      color4: { value: (p?.color4 as string) ?? '#ea0004', label: 'Red' },
      color5: { value: (p?.color5 as string) ?? '#9333ea', label: 'Violet' },
    }),
  }, storeOption);

  // Actions buttons for particles
  useControls('Actions', {
    'Reset Particles': button(() => {
      clearParticleValues();
      window.location.reload();
    }),
    'Copy Values': button(() => {
      const exportData = {
        particles: {
          particleCount: controls.particleCount,
          sizeMin: controls.sizeMin,
          sizeMax: controls.sizeMax,
          opacityMin: controls.opacityMin,
          opacityMax: controls.opacityMax,
          speedMin: controls.speedMin,
          speedMax: controls.speedMax,
          rotateSpeed: controls.rotateSpeed,
          tiltSpeed: controls.tiltSpeed,
          wobbleEnabled: controls.wobbleEnabled,
          wobbleDistance: controls.wobbleDistance,
          wobbleSpeed: controls.wobbleSpeed,
          color1: controls.color1,
          color2: controls.color2,
          color3: controls.color3,
          color4: controls.color4,
          color5: controls.color5,
        },
      };
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      console.log('Exported particle values:', exportData);
      alert('Particle values copied to clipboard! Check console for details.');
    }),
  }, storeOption);

  // Persist particle values when they change
  useEffect(() => {
    persistParticleValues(controls);
  }, [controls]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      responsive: [{
        breakpoint: 768,
        options: {
          particles: {
            number: {
              value: Math.round(controls.particleCount * 0.66),
            },
          },
        },
      }],
      particles: {
        number: {
          value: controls.particleCount,
          density: {
            enable: true,
          },
        },
        color: {
          value: [controls.color1, controls.color2, controls.color3, controls.color4, controls.color5],
        },
        shape: {
          type: ['circle'],
        },
        opacity: {
          value: { min: controls.opacityMin, max: controls.opacityMax },
        },
        size: {
          value: { min: controls.sizeMin, max: controls.sizeMax },
        },
        move: {
          enable: true,
          speed: { min: controls.speedMin, max: controls.speedMax },
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'bounce',
          },
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: 'random',
          animation: {
            enable: true,
            speed: controls.rotateSpeed,
          },
        },
        tilt: {
          enable: true,
          value: { min: 0, max: 360 },
          animation: {
            enable: true,
            speed: controls.tiltSpeed,
          },
        },
        wobble: {
          enable: controls.wobbleEnabled,
          distance: controls.wobbleDistance,
          speed: controls.wobbleSpeed,
        },
      },
      detectRetina: true,
    }),
    [controls]
  );

  // Don't render anything if not initialized or debug mode is off
  if (!init || !debugMode) return null;

  return <Particles id="celebration-particles" options={options} />;
}
