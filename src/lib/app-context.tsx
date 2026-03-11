"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

export type Language = "th" | "en";
export type Screen = "tutorial" | "practice" | "canvas" | "loading" | "report";

const translations = {
  th: {
    appTitle: "แบบทดสอบวาดนาฬิกาดิจิทัล",
    appName: "ระบบประเมินภาวะรู้คิด dCDT",
    languageToggle: "EN",
    stepTutorial: "คำแนะนำ",
    stepPractice: "ซ้อมมือ",
    stepCanvas: "ทดสอบจริง",
    stepProcess: "ประมวลผล",
    stepProgressLabel: "ขั้นตอนการทดสอบ",
    tutorialTitle: "วิธีการทดสอบ",
    tutorialSubtitle: "อ่านขั้นตอนด้านล่างก่อนเริ่มการทดสอบ",
    tutorialStartButton: "เริ่มต้นใช้งาน",
    tutorialStep1Title: "ทำความคุ้นเคย",
    tutorialStep1Body: "ก่อนเริ่มทดสอบ จะมีหน้ากระดานให้คุณลองขีดเขียน เพื่อทำความคุ้นเคยกับปากกาและหน้าจอ",
    tutorialStep2Title: "รับโจทย์ทดสอบ",
    tutorialStep2Body: "ระบบจะแสดงคำสั่งให้วาดภาพนาฬิกา (ระบบจะเริ่มจับเวลาทันทีเมื่อคุณเข้าสู่หน้านี้)",
    tutorialStep3Title: "ลงมือวาด",
    tutorialStep3Body: "วาดภาพนาฬิกาตามคำสั่งให้ครบถ้วนและชัดเจนที่สุด จากนั้นกดปุ่มส่งผลทดสอบ",
    tutorialStep4Title: "ประมวลผล",
    tutorialStep4Body: "รอระบบวิเคราะห์ผลการวาดของคุณเพียงครู่เดียว",
    tutorialModalTitle: "เลือกขั้นตอนต่อไป",
    tutorialModalBody: "คุณต้องการซ้อมวาดเพื่อสร้างความคุ้นเคยก่อน หรือพร้อมที่จะเข้าสู่แบบทดสอบจริง?",
    tutorialModalWarning: "⚠️ คำเตือน: หากเลือกทำแบบทดสอบ ระบบจะแสดงคำสั่งและเริ่มจับเวลาทันที",
    tutorialModalPracticeBtn: "ซ้อมวาดก่อน",
    tutorialModalStartBtn: "พร้อมทำแบบทดสอบจริง",
    practiceTitle: "ลองซ้อมมือ",
    practiceSubtitle: "ลองใช้ปากกาวาดลงบนกระดานด้านล่าง เพื่อทำความคุ้นเคยก่อนเริ่มทดสอบจริง",
    practiceHintFree: "✏️ วาดอิสระ",
    practiceHintClear: "🔄 ล้างได้ตลอด",
    clearCanvas: "ล้างกระดาน",
    iAmFamiliar: "ไปหน้าทดสอบจริง",
    practiceModalTitle: "พร้อมทดสอบแล้วใช่ไหม?",
    practiceModalBody: "คุณคุ้นเคยกับการวาดแล้วใช่ไหม?",
    practiceModalWarning: "⚠️ หากกดตกลง ระบบจะแสดงโจทย์และเริ่มจับเวลาทันที",
    practiceModalContinueBtn: "ซ้อมต่อ",
    practiceModalStartBtn: "ตกลง เริ่มทดสอบ",
    prepTitle: "พร้อมสำหรับการประเมินหรือยัง?",
    prepSubtitle: "เมื่อคุณกดปุ่ม นาฬิกาจับเวลาจะเริ่มและคุณจะเห็นคำแนะนำ",
    startTimerButton: "เริ่มจับเวลาและแสดงคำแนะนำ",
    canvasInstruction: "วาดหน้าปัดนาฬิกา ใส่ตัวเลขทั้งหมด และตั้งเวลาเป็น 11:10",
    stylusMode: "โหมดปากกาเท่านั้น",
    palmRejection: "ป้องกันฝ่ามือ",
    restartTest: "เริ่มใหม่",
    finishSubmit: "เสร็จสิ้นและส่ง",
    drawHere: "วาดนาฬิกาของคุณที่นี่",
    restartConfirmTitle: "เริ่มใหม่หรือไม่?",
    restartConfirmMessage: "คุณแน่ใจหรือไม่ว่าต้องการล้างผืนผ้าใบและเริ่มใหม่?",
    cancel: "ยกเลิก",
    confirmRestart: "ใช่ เริ่มใหม่",
    analyzing: "กำลังวิเคราะห์ภาพวาดของคุณ...",
    loadingStep1: "วิเคราะห์แรงกดปากกา...",
    loadingStep2: "ประมวลผลรูปแบบลายเส้น...",
    loadingStep3: "รันโมเดล ViT AI...",
    loadingStep4: "สร้างรายงาน...",
    reportClassificationLevel: "ระดับการจำแนก",
    reportBHILabel: "ดัชนีสุขภาพสมอง (BHI)",
    reportBHIAbbrev: "Brain Health Index",
    reportTCTLabel: "TCT",
    reportRestartLabel: "รีสตาร์ท",
    disclaimer: "นี่คือเครื่องมือคัดกรองเบื้องต้น กรุณาปรึกษาแพทย์เพื่อรับการประเมินทางคลินิกอย่างครบถ้วน",
    downloadPdfReport: "ดาวน์โหลดรายงาน PDF",
    returnHome: "กลับหน้าหลัก",
    reportSectionDrawing: "ภาพวาดของผู้ทำแบบทดสอบ",
    reportAIToggleLabel: "แสดงผล AI",
    reportAIToggleAria: "แสดงผลการวิเคราะห์โดย AI",
    reportImagePlaceholder: "ภาพตัวอย่าง — Sprint 2 จะแสดงภาพจริง",
    reportAINumberAnomaly: "ตัวเลขเบี่ยง",
    reportAIHandAnomaly: "เข็มนาฬิกา",
    reportSectionPillars: "การวิเคราะห์แยกตามมิติ",
    pillarAIVisionLabel: "AI Vision",
    pillarAIVisionSub: "ความมั่นใจของโมเดล",
    pillarAIVisionDetail: "ตรวจจับโครงสร้างนาฬิกาได้ถูกต้อง",
    pillarMotorLabel: "Motor Control",
    pillarMotorSub: "การตรวจจับอาการสั่น",
    pillarMotorDetail: "ไม่พบรูปแบบอาการสั่นที่มีนัยสำคัญ",
    pillarMotorValue: "ต่ำ",
    pillarCognitiveLabel: "Cognitive",
    pillarCognitiveSub: "เวลาลังเล",
    pillarCognitiveDetail: "พบการหยุดชั่วคราวบริเวณตัวเลข 10-11",
    ruleBasedAssessment: "การประเมินตามกฎเกณฑ์",
    clockFaceIntegrity: "ความสมบูรณ์ของหน้าปัด",
    numberSequence: "ลำดับตัวเลข 1–12",
    handPlacement: "ตำแหน่งเข็มนาฬิกา (11:10)",
    spatialPlanningRestarts: "การเริ่มวางแผนใหม่",
    userRestarted: "ผู้ใช้เริ่มใหม่",
    times: "ครั้ง",
    passed: "ผ่าน",
    warning: "เตือน",
    reportSectionTimeline: "ลำดับและความเร็วของการลาก",
    timelineStart: "เริ่มต้น",
    timelineEnd: "สิ้นสุด",
    thinkTime: "เวลาคิด",
    drawTime: "เวลาวาด",
    timeDistribution: "การกระจายเวลา",
    totalTime: "รวม",
    velocityProfile: "โปรไฟล์ความเร็ว",
    drawingSpeedOverTime: "ความเร็วการวาดตามเวลา",
    reportSectionCMatrix: "ตารางอ้างอิงการจำแนก C0–C7",
    c0Label: "ปกติสมบูรณ์",
    c1Label: "บกพร่องเล็กน้อย",
    c2Label: "บกพร่องระดับกลาง",
    c3Label: "ผิดปกติระดับกลาง",
    c4Label: "ผิดปกติชัดเจน",
    c5Label: "บกพร่องรุนแรง",
    c6Label: "รุนแรงมาก",
    c7Label: "วิกฤต",
    aiConfidenceScore: "คะแนนความมั่นใจ AI",
    resultElevatedRisk: "ผลลัพธ์: ตรวจพบความเสี่ยงสูง",
    resultExpectedRange: "ผลลัพธ์: อยู่ในช่วงปกติ",
    loading: "กำลังโหลด...",
    close: "ปิด",
    confirm: "ยืนยัน",
    back: "กลับ",
    next: "ถัดไป",
  },
  en: {
    appTitle: "Digital Clock Drawing Test",
    appName: "dCDT Cognitive Assessment System",
    languageToggle: "TH",
    stepTutorial: "Instructions",
    stepPractice: "Practice",
    stepCanvas: "Test",
    stepProcess: "Results",
    stepProgressLabel: "Test Progress",
    tutorialTitle: "How the Test Works",
    tutorialSubtitle: "Please read the steps below before starting",
    tutorialStartButton: "Get Started",
    tutorialStep1Title: "Get Familiar",
    tutorialStep1Body: "Before the test begins, you will have a canvas to try drawing so you can get used to the pen and screen.",
    tutorialStep2Title: "Receive the Task",
    tutorialStep2Body: "The system will show you instructions to draw a clock. The timer starts as soon as you enter that screen.",
    tutorialStep3Title: "Start Drawing",
    tutorialStep3Body: "Draw the clock as completely and clearly as possible, then press the submit button.",
    tutorialStep4Title: "Processing",
    tutorialStep4Body: "Wait a moment while the system analyzes your drawing.",
    tutorialModalTitle: "Choose Your Next Step",
    tutorialModalBody: "Would you like to practice drawing first, or are you ready to take the real test?",
    tutorialModalWarning: "⚠️ Warning: If you choose to start the test, instructions will appear and the timer will start immediately.",
    tutorialModalPracticeBtn: "Practice First",
    tutorialModalStartBtn: "I'm Ready for the Real Test",
    practiceTitle: "Practice Drawing",
    practiceSubtitle: "Try drawing on the canvas below to get comfortable before the real test.",
    practiceHintFree: "✏️ Draw freely",
    practiceHintClear: "🔄 Clear anytime",
    clearCanvas: "Clear Canvas",
    iAmFamiliar: "Go to Real Test",
    practiceModalTitle: "Ready for the Test?",
    practiceModalBody: "Are you comfortable with drawing?",
    practiceModalWarning: "⚠️ If you confirm, the task will appear and the timer will start immediately.",
    practiceModalContinueBtn: "Keep Practicing",
    practiceModalStartBtn: "OK, Start Test",
    prepTitle: "Ready for the Assessment?",
    prepSubtitle: "When you press the button, the timer will start and you will see the instructions.",
    startTimerButton: "Start Timer and Show Instructions",
    canvasInstruction: "Draw a clock face, add all the numbers, and set the time to 11:10.",
    stylusMode: "Stylus Only Mode",
    palmRejection: "Palm Rejection",
    restartTest: "Restart Test",
    finishSubmit: "Finish and Submit",
    drawHere: "Draw your clock here",
    restartConfirmTitle: "Restart Test?",
    restartConfirmMessage: "Are you sure you want to clear the canvas and restart?",
    cancel: "Cancel",
    confirmRestart: "Yes, Restart",
    analyzing: "Analyzing your drawing...",
    loadingStep1: "Analyzing pen pressure...",
    loadingStep2: "Processing stroke patterns...",
    loadingStep3: "Running ViT AI model...",
    loadingStep4: "Generating report...",
    reportClassificationLevel: "Classification Level",
    reportBHILabel: "Brain Health Index (BHI)",
    reportBHIAbbrev: "Brain Health Index",
    reportTCTLabel: "TCT",
    reportRestartLabel: "Restarts",
    disclaimer: "This is a preliminary screening tool. Please consult your physician for a comprehensive clinical evaluation.",
    downloadPdfReport: "Download PDF Report",
    returnHome: "Return to Home",
    reportSectionDrawing: "Patient Drawing",
    reportAIToggleLabel: "Show AI Analysis",
    reportAIToggleAria: "Toggle AI analysis overlay",
    reportImagePlaceholder: "Sample image — Sprint 2 will show real drawing",
    reportAINumberAnomaly: "Number misplaced",
    reportAIHandAnomaly: "Clock hands",
    reportSectionPillars: "Multi-Dimensional Analysis",
    pillarAIVisionLabel: "AI Vision",
    pillarAIVisionSub: "Model confidence",
    pillarAIVisionDetail: "Clock structure correctly detected",
    pillarMotorLabel: "Motor Control",
    pillarMotorSub: "Tremor detection",
    pillarMotorDetail: "No significant tremor pattern detected",
    pillarMotorValue: "Low",
    pillarCognitiveLabel: "Cognitive",
    pillarCognitiveSub: "Hesitation time",
    pillarCognitiveDetail: "Brief pauses near numbers 10–11 detected",
    ruleBasedAssessment: "Rule-Based Assessment",
    clockFaceIntegrity: "Clock Face Integrity",
    numberSequence: "Number Sequence 1–12",
    handPlacement: "Hand Placement (11:10)",
    spatialPlanningRestarts: "Spatial Planning Restarts",
    userRestarted: "User restarted",
    times: "times",
    passed: "Pass",
    warning: "Warning",
    reportSectionTimeline: "Stroke Order & Speed",
    timelineStart: "Start",
    timelineEnd: "End",
    thinkTime: "Think Time",
    drawTime: "Draw Time",
    timeDistribution: "Time Distribution",
    totalTime: "Total",
    velocityProfile: "Velocity Profile",
    drawingSpeedOverTime: "Drawing speed over time",
    reportSectionCMatrix: "C0–C7 Classification Reference",
    c0Label: "Fully Normal",
    c1Label: "Mild Impairment",
    c2Label: "Moderate Impairment",
    c3Label: "Moderate Anomaly",
    c4Label: "Clear Anomaly",
    c5Label: "Severe Impairment",
    c6Label: "Very Severe",
    c7Label: "Critical",
    aiConfidenceScore: "AI Confidence Score",
    resultElevatedRisk: "Result: Elevated Risk Detected",
    resultExpectedRange: "Result: Expected Range",
    loading: "Loading...",
    close: "Close",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
  },
} as const;

export type TranslationKey = keyof typeof translations.th;

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  isChangingLanguage: boolean;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  restartCount: number;
  incrementRestartCount: () => void;
  resetRestartCount: () => void;
  startTCT: () => void;
  getTCT: () => number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function AppProvider({ children, defaultLanguage = "th" }: AppProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dcdt_language") as Language | null;
      if (saved === "th" || saved === "en") return saved;
    }
    return defaultLanguage;
  });
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("tutorial");
  const [restartCount, setRestartCount] = useState(0);
  const tctStartRef = useRef<number | null>(null);

  const setLanguage = useCallback((lang: Language) => {
    setIsChangingLanguage(true);
    setLanguageState(lang);
    try { localStorage.setItem("dcdt_language", lang); } catch {}
    setTimeout(() => setIsChangingLanguage(false), 150);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "th" ? "en" : "th");
  }, [language, setLanguage]);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      const raw: string = translations[language][key] ?? key;
      if (!vars) return raw;
      return raw.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? `{{${k}}}`));
    },
    [language]
  );

  const incrementRestartCount = useCallback(() => setRestartCount((n) => n + 1), []);
  const resetRestartCount = useCallback(() => setRestartCount(0), []);
  const startTCT = useCallback(() => { tctStartRef.current = Date.now(); }, []);
  const getTCT = useCallback(() => {
    if (tctStartRef.current === null) return 0;
    return Math.round((Date.now() - tctStartRef.current) / 1000);
  }, []);

  return (
    <AppContext.Provider value={{
      language, setLanguage, toggleLanguage, t, isChangingLanguage,
      currentScreen, setCurrentScreen,
      restartCount, incrementRestartCount, resetRestartCount,
      startTCT, getTCT,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export { translations };
export type { AppContextValue };
