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
import { translations, Language } from "./translations";

// V2.0 Type Definitions for Backend Response
export interface KinematicResult {
  K1_rms_cm: number | null;
  K2_velocity_cms: number | null;
  K3_pressure_avg: number | null;
  K3_pressure_decrement: number | null;
  K4_pct_think_time: number | null;
  K5_pfhl_ms: number | null;
  flags: string[];
}

export interface DomainResult {
  motor_abnormal: boolean;
  cognitive_abnormal: boolean;
  ai_abnormal: boolean;
  k1_triggered: boolean;
  k2_triggered: boolean;
  k3_triggered: boolean;
  k4_triggered: boolean;
  k5_triggered: boolean;
}

export interface AnalysisResponse {
  class_id: string;
  risk_level: 'normal' | 'mild' | 'high';
  risk_color: 'green' | 'yellow' | 'red';
  kinematic: KinematicResult;
  domain: DomainResult;
  warnings: string[];
  model_version: string;
  velocity_profile: number[];
  xai_evidence_b64: string | null;
  // --- New Fields ---
  ai_confidence: number;            // Confidence score 0-100
  processed_image_b64: string | null; // Centered input image
}

export type Screen = "tutorial" | "practice" | "canvas" | "loading" | "report";

interface AppContextType {
  // Navigation & Screen State
  currentScreen: Screen;
  setCurrentScreen: (s: Screen) => void;
  
  // Language Configuration
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
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

  // Analysis Data state using the exact V2.0 schema
  analysisData: AnalysisResponse | null;
  setAnalysisData: React.Dispatch<React.SetStateAction<AnalysisResponse | null>>;
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
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);

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
    (key: string, vars?: Record<string, string | number>): string => {
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