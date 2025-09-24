import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('gemini-api-key');
      if (storedKey) {
        setApiKeyState(storedKey);
      }
    } catch (error) {
      console.error("Failed to load API key from local storage", error);
    }
  }, []);

  const setApiKey = (key: string | null) => {
    try {
      if (key) {
        localStorage.setItem('gemini-api-key', key);
      } else {
        localStorage.removeItem('gemini-api-key');
      }
      setApiKeyState(key);
    } catch (error) {
      console.error("Failed to save API key to local storage", error);
    }
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <SettingsContext.Provider value={{ apiKey, setApiKey, isSettingsOpen, openSettings, closeSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};