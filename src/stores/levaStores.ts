const STORAGE_KEY_LOGO = 'leva-logo-controls';
const STORAGE_KEY_PARTICLES = 'leva-particle-controls';
const STORAGE_KEY_TRANSITIONS = 'leva-transition-controls';
const STORAGE_KEY_SLIDES = 'leva-slide-controls';

// Load persisted values from localStorage
function loadPersistedValues(key: string): Record<string, unknown> | null {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn(`Failed to load persisted Leva values for ${key}:`, e);
  }
  return null;
}

// Save values to localStorage
export function persistLogoValues(values: Record<string, unknown>) {
  try {
    localStorage.setItem(STORAGE_KEY_LOGO, JSON.stringify(values));
  } catch (e) {
    console.warn('Failed to persist logo values:', e);
  }
}

export function persistParticleValues(values: Record<string, unknown>) {
  try {
    localStorage.setItem(STORAGE_KEY_PARTICLES, JSON.stringify(values));
  } catch (e) {
    console.warn('Failed to persist particle values:', e);
  }
}

export function persistTransitionValues(values: Record<string, unknown>) {
  try {
    localStorage.setItem(STORAGE_KEY_TRANSITIONS, JSON.stringify(values));
  } catch (e) {
    console.warn('Failed to persist transition values:', e);
  }
}

export function persistSlideValues(values: Record<string, unknown>) {
  try {
    localStorage.setItem(STORAGE_KEY_SLIDES, JSON.stringify(values));
  } catch (e) {
    console.warn('Failed to persist slide values:', e);
  }
}

// Clear persisted values (for reset)
export function clearPersistedValues() {
  localStorage.removeItem(STORAGE_KEY_LOGO);
  localStorage.removeItem(STORAGE_KEY_PARTICLES);
  localStorage.removeItem(STORAGE_KEY_TRANSITIONS);
  localStorage.removeItem(STORAGE_KEY_SLIDES);
}

export function clearLogoValues() {
  localStorage.removeItem(STORAGE_KEY_LOGO);
}

export function clearParticleValues() {
  localStorage.removeItem(STORAGE_KEY_PARTICLES);
}

export function clearTransitionValues() {
  localStorage.removeItem(STORAGE_KEY_TRANSITIONS);
}

export function clearSlideValues() {
  localStorage.removeItem(STORAGE_KEY_SLIDES);
}

// Get initial values (used by components to initialize their controls)
export const persistedLogoValues = loadPersistedValues(STORAGE_KEY_LOGO);
export const persistedParticleValues = loadPersistedValues(STORAGE_KEY_PARTICLES);
export const persistedTransitionValues = loadPersistedValues(STORAGE_KEY_TRANSITIONS);
export const persistedSlideValues = loadPersistedValues(STORAGE_KEY_SLIDES);
