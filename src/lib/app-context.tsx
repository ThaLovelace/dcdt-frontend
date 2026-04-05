// File: src/lib/app-context.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
// Import translations and types from the external file
import { translations, TranslationKey, Language } from "./translations";

export type Screen = "tutorial" | "practice" | "canvas" | "loading" | "report";

interface AppContextType {
  // Navigation & Screen State
  currentScreen: Screen;
  setCurrentScreen: (s: Screen) => void;
  
  // Language Configuration
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: any, vars?: Record<string, string | number>) => string;
  isChangingLanguage: boolean;
  
  // Test Lifecycle Management
  restartCount: number;
  incrementRestartCount: () => void;
  resetRestartCount: () => void;
  
  // Timer Functions
  startTCT: () => void;
  getTCT: () => number;
  
  // Patient Demographics & Assessment Results
  age: string;
  setAge: (age: string) => void;
  education: string;
  setEducation: (education: string) => void;
  resultIndex: number;
  setResultIndex: (index: number) => void;

  analysisData: object | null;
  setAnalysisData: React.Dispatch<React.SetStateAction<object | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // State Initialization
  const [currentScreen, setCurrentScreen] = useState<Screen>("tutorial");
  const [language, setLanguage] = useState<Language>("th");
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  
  const [restartCount, setRestartCount] = useState(0);
  const tctStartRef = useRef<number | null>(null);

  // Demographic & Result States
  const [age, setAge] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [resultIndex, setResultIndex] = useState<number>(0);
  const [analysisData, setAnalysisData] = useState<object | null>(null);

  // Language Handlers
  const toggleLanguage = useCallback(() => {
    setIsChangingLanguage(true);
    // Add a slight delay for smooth UI transition
    setTimeout(() => {
      setLanguage((prev) => (prev === "th" ? "en" : "th"));
      setIsChangingLanguage(false);
    }, 300); 
  }, []);

  // Translation function with dynamic variable replacement
  const t = useCallback(
    (key: any, vars?: Record<string, string | number>): string => {
      const dict = translations[language] as Record<string, string>;
      const raw: string = dict[key] ?? key;
      if (!vars) return raw;
      return raw.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? `{{${k}}}`));
    },
    [language]
  );

  // Utility Functions
  const incrementRestartCount = useCallback(() => setRestartCount((n) => n + 1), []);
  const resetRestartCount = useCallback(() => setRestartCount(0), []);
  
  const startTCT = useCallback(() => { 
    tctStartRef.current = Date.now(); 
  }, []);
  
  const getTCT = useCallback(() => {
    if (tctStartRef.current === null) return 0;
    return Math.round((Date.now() - tctStartRef.current) / 1000);
  }, []);

  return (
    <AppContext.Provider 
      value={{
        language, setLanguage, toggleLanguage, t, isChangingLanguage,
        currentScreen, setCurrentScreen,
        restartCount, incrementRestartCount, resetRestartCount,
        startTCT, getTCT,
        age, setAge,
        education, setEducation,
        resultIndex, setResultIndex,
        analysisData, setAnalysisData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}