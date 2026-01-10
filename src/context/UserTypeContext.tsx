import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type UserTypeId, type UserTypeConfig, getUserTypeConfig } from '../config/onboarding-content';

const STORAGE_KEY_USER_TYPE = 'user-type-selection';

// Valid user type IDs for validation
const validUserTypes: UserTypeId[] = ['UT1', 'UT2', 'UT3', 'UT4'];

function loadPersistedUserType(): UserTypeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USER_TYPE);
    if (stored && validUserTypes.includes(stored as UserTypeId)) {
      return stored as UserTypeId;
    }
  } catch {
    // localStorage may not be available
  }
  return 'UT1';
}

function persistUserType(id: UserTypeId): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER_TYPE, id);
  } catch {
    // localStorage may not be available
  }
}

interface UserTypeContextValue {
  userTypeId: UserTypeId;
  config: UserTypeConfig;
  setUserType: (id: UserTypeId) => void;
  resetFlow: () => void;
  flowResetKey: number; // Incremented to trigger flow reset
}

const UserTypeContext = createContext<UserTypeContextValue | null>(null);

interface UserTypeProviderProps {
  children: ReactNode;
  onFlowReset?: () => void;
}

export function UserTypeProvider({ children, onFlowReset }: UserTypeProviderProps) {
  const [userTypeId, setUserTypeId] = useState<UserTypeId>(loadPersistedUserType);
  const [flowResetKey, setFlowResetKey] = useState(0);

  const setUserType = useCallback((id: UserTypeId) => {
    setUserTypeId(id);
    persistUserType(id);
    setFlowResetKey((prev) => prev + 1);
    onFlowReset?.();
  }, [onFlowReset]);

  const resetFlow = useCallback(() => {
    setFlowResetKey((prev) => prev + 1);
    onFlowReset?.();
  }, [onFlowReset]);

  const config = getUserTypeConfig(userTypeId);

  return (
    <UserTypeContext.Provider
      value={{
        userTypeId,
        config,
        setUserType,
        resetFlow,
        flowResetKey,
      }}
    >
      {children}
    </UserTypeContext.Provider>
  );
}

export function useUserType() {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
}
