import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type UserTypeId, type UserTypeConfig, getUserTypeConfig } from '../config/onboarding-content';

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
  const [userTypeId, setUserTypeId] = useState<UserTypeId>('UT1');
  const [flowResetKey, setFlowResetKey] = useState(0);

  const setUserType = useCallback((id: UserTypeId) => {
    setUserTypeId(id);
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
