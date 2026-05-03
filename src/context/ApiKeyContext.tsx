import React, { createContext, useContext, useState, useCallback } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasApiKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);
const STORAGE_KEY = 'rm_api_key';

export const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKeyState] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || '');

  const setApiKey = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEY, key.trim());
    setApiKeyState(key.trim());
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKeyState('');
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, hasApiKey: !!apiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) throw new Error('useApiKey must be used within ApiKeyProvider');
  return context;
};
