// File: src/lib/app-context.tsx
// No schema changes required — alias, age, education already exist.
// This file is reproduced verbatim from the original for completeness.
// The only addition is re-exporting Screen so page.tsx can use it.

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
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
  ai_confidence: number;
  processed_image_b64: string | null;
  is_history?: boolean;
}

// "welcome" is the initial/dashboard screen
export type Screen = "welcome" | "tutorial" | "practice" | "canvas" | "loading" | "report";

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
  alias: string;
  setAlias: (alias: string) => void;
  age: string;
  setAge: (age: string) => void;
  education: string;
  setEducation: (education: string) => void;
  resultIndex: number;
  setResultIndex: (index: number) => void;

  // Analysis Data state using the exact V2.0 schema
  analysisData: AnalysisResponse | null;
  setAnalysisData: React.Dispatch<React.SetStateAction<AnalysisResponse | null>>;

  // Raw capture data for Supabase persistence
  rawStrokes: any[];
  setRawStrokes: React.Dispatch<React.SetStateAction<any[]>>;
  originalImageB64: string;
  setOriginalImageB64: React.Dispatch<React.SetStateAction<string>>;
  deviceDPI: number;
  setDeviceDPI: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Default screen is "welcome" (the smart dashboard)
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [language, setLanguage] = useState<Language>("th");
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const [restartCount, setRestartCount] = useState(0);
  const tctStartRef = useRef<number | null>(null);

  // Demographic & Result States
  const [alias, setAlias] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [resultIndex, setResultIndex] = useState<number>(0);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [rawStrokes, setRawStrokes] = useState<any[]>([]);
  const [originalImageB64, setOriginalImageB64] = useState<string>('');
  const [deviceDPI, setDeviceDPI] = useState<number>(96);

  const toggleLanguage = useCallback(() => {
    setIsChangingLanguage(true);
    setTimeout(() => {
      setLanguage((prev) => (prev === "th" ? "en" : "th"));
      setIsChangingLanguage(false);
    }, 300);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const dict = translations[language] as Record<string, string>;
      const raw: string = dict[key] ?? key;
      if (!vars) return raw;
      return raw.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? `{{${k}}}`));
    },
    [language]
  );

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
        alias, setAlias,
        age, setAge,
        education, setEducation,
        resultIndex, setResultIndex,
        analysisData, setAnalysisData,
        rawStrokes, setRawStrokes,
        originalImageB64, setOriginalImageB64,
        deviceDPI, setDeviceDPI,
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