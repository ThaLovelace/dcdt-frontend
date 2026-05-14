// File: src/lib/translations.ts

export type Language = "th" | "en";

export const translations = {
  th: {
    // General / Headers
    appTitle: "แบบทดสอบวาดนาฬิกาดิจิทัล",
    appName: "ระบบประเมินภาวะรู้คิด dCDT",
    languageToggle: "EN",
    loading: "กำลังโหลด...",

    // Progress Steps
    stepTutorial: "คำแนะนำ",
    stepPractice: "ซ้อมมือ",
    stepCanvas: "ทดสอบจริง",
    stepProcess: "ประมวลผล",
    stepProgressLabel: "ขั้นตอนการทดสอบ",

    // ── Welcome Screen ─────────────────────────────────────────────────────
    welcomeEyebrow: "การประเมินภาวะรู้คิด",
    welcomeTitle: "แบบทดสอบวาดนาฬิกาดิจิทัล",
    welcomeSubtitle: "เครื่องมือคัดกรองเบื้องต้นสำหรับภาวะสมองเสื่อม",
    welcomeFormTitle: "กรอกข้อมูลเพื่อเริ่มต้น",
    welcomeFormSubtitle: "ข้อมูลทั้งหมดจะถูกเก็บในหน่วยความจำชั่วคราวเท่านั้น ไม่มีการส่งข้อมูลส่วนตัวออกไปยังเซิร์ฟเวอร์",
    aliasLabel: "ชื่อเล่น / รหัสผู้ทดสอบ",
    aliasPlaceholder: "เช่น ผู้ทดสอบ-001 หรือชื่อเล่น",
    aliasHint: "ใช้ชื่อเล่นหรือรหัส ไม่ต้องใช้ชื่อจริง",
    ageLabel: "อายุ",
    agePlaceholder: "ระบุอายุ (ปี)",
    eduLabel: "ระดับการศึกษา",
    startAssessmentBtn: "เริ่มการประเมิน →",
    welcomeValidationError: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    privacyNoticeTitle: "นโยบายความเป็นส่วนตัว (PDPA)",
    privacyNoticeBody: "ข้อมูลที่คุณกรอกจะถูกเก็บไว้ในหน่วยความจำของอุปกรณ์ชั่วคราว (Client-Side Memory) เท่านั้น ระบบไม่มีการบันทึกหรือส่งข้อมูลส่วนบุคคลใด ๆ ไปยังเซิร์ฟเวอร์ กรุณาใช้ชื่อเล่นหรือรหัสแทนชื่อจริง เพื่อปกป้องความเป็นส่วนตัวของท่าน",
    privacyBadge: "ไม่มีการบันทึกข้อมูลส่วนตัว",
    featureKinematic: "วิเคราะห์จลนศาสตร์การเขียน",
    featureAI: "ตรวจจับด้วย AI (ViT Model)",
    featureReport: "รายงานผลทันที",

    // Tutorial Screen
    tutorialTitle: "วิธีการทดสอบ",
    tutorialSubtitle: "อ่านขั้นตอนด้านล่างก่อนเริ่มการทดสอบ",
    tutorialStartButton: "เริ่มต้นใช้งาน",
    tutorialStep1Title: "ทำความคุ้นเคย",
    tutorialStep1Body: "ก่อนเริ่มทดสอบ จะมีหน้ากระดานให้คุณลองขีดเขียน เพื่อทำความคุ้นเคยกับปากกาและหน้าจอ",
    tutorialStep2Title: "รับโจทย์ทดสอบ",
    tutorialStep2Body: "ระบบจะแสดงคำสั่งให้วาดภาพนาฬิกา (ระบบจะเริ่มจับเวลาทันทีเมื่อคุณเข้าสู่หน้านี้)",
    tutorialStep3Title: "ลงมือวาด",
    tutorialStep3Body: "วาดภาพนาฬิกาตามคำสั่งที่ได้รับลงในกรอบที่กำหนด เมื่อเสร็จสิ้นให้กดปุ่มส่งผล",
    tutorialStep4Title: "สร้างรายงาน",
    tutorialStep4Body: "ระบบจะประมวลผลภาพวาดของคุณและสร้างรายงานผลการประเมิน",

    // Practice Screen
    practiceTitle: "ซ้อมมือให้คุ้นเคย",
    practiceSubtitle: "ลองขีดเขียนบนกระดานด้านล่างเพื่อให้คุ้นเคยกับน้ำหนักปากกา คุณสามารถใช้เวลาได้เต็มที่",
    clearCanvas: "ลบกระดาน",
    iAmFamiliar: "คุ้นเคยแล้ว เริ่มต้นการทดสอบจริง",
    practiceDrawHere: "ลองวาดอะไรก็ได้ที่นี่",
    practiceHintFree: "วาดได้อย่างอิสระ",
    practiceHintClear: "ลบกระดานได้ตามต้องการ",

    // Canvas Screen
    canvasInstruction: "กรุณาวาดหน้าปัดนาฬิกา ใส่ตัวเลขให้ครบ และตั้งเวลาไว้ที่ 11 นาฬิกา 10 นาที",
    stylusMode: "โหมดปากกาเท่านั้น",
    palmRejection: "ป้องกันการสัมผัสจากมือ",
    leftHandedMode: "โหมดถนัดซ้าย",
    leftHandedDesc: "สลับด้านกระดาน",
    restartTest: "เริ่มใหม่",
    finishSubmit: "วาดเสร็จสิ้น / ส่งผล",
    drawHere: "วาดรูปนาฬิกาที่นี่",

    // Popups & Modals
    askPracticeTitle: "คุณพร้อมหรือยัง?",
    askPracticeDesc: "คุณต้องการทดลองวาดก่อนเริ่มการทดสอบจริงหรือไม่?",
    goPracticeBtn: "ใช่, ขอทดลองวาดก่อน",
    skipPracticeBtn: "ไม่, ข้ามไปทดสอบจริง",
    preTestModalTitle: "เตรียมพร้อมทดสอบจริง",
    preTestModalDesc: "กรุณายืนยันข้อมูลก่อนเริ่ม",
    warningRealTestTitle: "นี่คือการทดสอบจริง",
    warningRealTestDesc: "เมื่อกดยืนยัน เวลาจะเริ่มเดินทันที",
    eduLessThan8: "ต่ำกว่า 8 ปี",
    eduMoreThan8: "ตั้งแต่ 8 ปีขึ้นไป",
    startRealTestBtn: "เริ่มการทดสอบจริง",
    backToPracticeBtn: "กลับไปซ้อมมือ",

    // Restart Modal
    restartConfirmTitle: "ต้องการเริ่มใหม่หรือไม่?",
    restartConfirmMessage: "คุณแน่ใจหรือไม่ว่าต้องการล้างกระดานและเริ่มทำแบบทดสอบใหม่?",
    cancel: "ยกเลิก",
    confirmRestart: "ใช่ เริ่มใหม่",

    // Loading Screen
    analyzing: "กำลังวิเคราะห์ภาพวาดของคุณ...",
    loadingStep1: "วิเคราะห์แรงกดปากกา...",
    loadingStep2: "ประมวลผลรูปแบบลายเส้น...",
    loadingStep3: "รันโมเดล ViT AI...",
    loadingStep4: "สร้างรายงาน...",

    // Report Screen
    reportTitle: "ผลการประเมิน",
    reportSubtitle: "ประมวลผลจาก Kinematic Features และ AI",
    reportDemographics: "ข้อมูลผู้ทดสอบ",
    reportAge: "อายุ: {{age}} ปี",
    reportEducation: "การศึกษา: {{education}}",
    aiConfidenceScore: "คะแนนความมั่นใจ AI",
    resultElevatedRisk: "ผลลัพธ์: ตรวจพบความเสี่ยงสูง",
    resultExpectedRange: "ผลลัพธ์: อยู่ในช่วงปกติ",
    disclaimer: "นี่คือเครื่องมือคัดกรองเบื้องต้น กรุณาปรึกษาแพทย์เพื่อรับการประเมินทางคลินิกอย่างครบถ้วน",
    downloadPdfReport: "ดาวน์โหลดรายงาน PDF",
    returnHome: "กลับหน้าหลัก",
    timeDistribution: "การกระจายเวลา",
    thinkTime: "เวลาคิด",
    drawTime: "เวลาวาด",
    totalTime: "รวม",
    velocityProfile: "โปรไฟล์ความเร็ว",
    drawingSpeedOverTime: "ความเร็วการวาดตามเวลา",
    ruleBasedAssessment: "การประเมินตามกฎเกณฑ์",

    // Shared form fields
    eduSelectPlaceholder: "-- เลือกระดับการศึกษา --",
    eduLevel0: "ไม่ได้ศึกษา (0 ปี)",
    eduLevel4: "ประถมศึกษาตอนต้น ป.1-4 (4 ปี)",
    eduLevel6: "ประถมศึกษาตอนปลาย ป.5-6 (6 ปี)",
    eduLevel9: "มัธยมศึกษาตอนต้น (9 ปี)",
    eduLevel12: "มัธยมศึกษาตอนปลาย (12 ปี)",
    eduLevel14: "อนุปริญญา (14 ปี)",
    eduLevel16: "ปริญญาตรี (16 ปี)",
    eduLevel18: "สูงกว่าปริญญาตรี (18+ ปี)",
    readyToStartTitle: "พร้อมเริ่มทำแบบทดสอบ?",
    readyToStartMsg: "เมื่อกด \"ตกลง\" ระบบจะเริ่มจับเวลาทันที โปรดวาดให้ต่อเนื่องจนจบ",
    confirmStart: "ตกลง, เริ่มจับเวลา",

      // Dashboard — State B (profile exists)
      dashboardGreetingLabel:   'ยินดีต้อนรับกลับ',
      dashboardStartBtn:        'เริ่มการประเมินใหม่',
      dashboardStartDesc:       'เริ่มทดสอบการวาดนาฬิกา',
      dashboardHistoryBtn:      'ดูประวัติการทดสอบ',
      dashboardHistoryDesc:     'ดูผลการประเมินครั้งก่อนๆ',
      dashboardEditBtn:         'แก้ไขข้อมูลส่วนตัว',
      dashboardEditDesc:        'เปลี่ยนชื่อแทน อายุ หรือการศึกษา',

      // Dashboard — State A (edit mode)
      dashboardEditProfileTitle: 'แก้ไขข้อมูลส่วนตัว',
      dashboardSaveProfileBtn:   'บันทึกการเปลี่ยนแปลง',

      // Report screen — Subject Info section
      reportSubjectInfoTitle:    'ข้อมูลผู้รับการประเมิน',
  },
  en: {
    // General / Headers
    appTitle: "Digital Clock Drawing Test",
    appName: "dCDT Cognitive Assessment",
    languageToggle: "TH",
    loading: "Loading...",

    // Progress Steps
    stepTutorial: "Tutorial",
    stepPractice: "Practice",
    stepCanvas: "Test",
    stepProcess: "Analysis",
    stepProgressLabel: "Test Progress",

    // ── Welcome Screen ─────────────────────────────────────────────────────
    welcomeEyebrow: "Cognitive Screening Tool",
    welcomeTitle: "Digital Clock Drawing Test",
    welcomeSubtitle: "A validated preliminary screening tool for cognitive impairment.",
    welcomeFormTitle: "Enter your details to begin",
    welcomeFormSubtitle: "All data stays in your device's memory only. No personal information is ever sent to a server.",
    aliasLabel: "Alias / Guest ID",
    aliasPlaceholder: "e.g. Guest-001 or a nickname",
    aliasHint: "Use a nickname or code — no real names needed",
    ageLabel: "Age",
    agePlaceholder: "Enter age (years)",
    eduLabel: "Education Level",
    startAssessmentBtn: "Start Assessment →",
    welcomeValidationError: "Please fill in all fields before continuing.",
    privacyNoticeTitle: "Privacy Notice (PDPA Compliant)",
    privacyNoticeBody: "The information you enter is stored only in your device's temporary client-side memory and is never transmitted to any server or database. Please use a nickname or code instead of your real name to protect your privacy.",
    privacyBadge: "No personal data is stored",
    featureKinematic: "Kinematic writing analysis",
    featureAI: "AI detection (ViT Model)",
    featureReport: "Instant results report",

    // Tutorial Screen
    tutorialTitle: "How to take the test",
    tutorialSubtitle: "Please read the instructions below before starting.",
    tutorialStartButton: "Get Started",
    tutorialStep1Title: "Familiarization",
    tutorialStep1Body: "Before the test, you will have a practice board to get used to the pen and screen.",
    tutorialStep2Title: "Receive Prompt",
    tutorialStep2Body: "The system will display the clock drawing prompt (The timer starts immediately).",
    tutorialStep3Title: "Start Drawing",
    tutorialStep3Body: "Draw the clock as instructed in the designated area. Press submit when done.",
    tutorialStep4Title: "Generate Report",
    tutorialStep4Body: "The system will process your drawing and generate an assessment report.",

    // Practice Screen
    practiceTitle: "Let's get familiar with the screen",
    practiceSubtitle: "Feel free to draw anything here to get used to the pen. Take all the time you need.",
    clearCanvas: "Clear",
    iAmFamiliar: "I am familiar, let's start the real test",
    practiceDrawHere: "Draw anything here",
    practiceHintFree: "Draw freely",
    practiceHintClear: "Clear canvas anytime",

    // Canvas Screen
    canvasInstruction: "Draw a clock face, add all the numbers, and set the time to 11:10.",
    stylusMode: "Stylus Only Mode",
    palmRejection: "Palm Rejection",
    leftHandedMode: "Left-Handed Mode",
    leftHandedDesc: "Swap canvas side",
    restartTest: "Restart Test",
    finishSubmit: "Finish and Submit",
    drawHere: "Draw your clock here",

    // Popups & Modals
    askPracticeTitle: "Are you ready?",
    askPracticeDesc: "Would you like to practice drawing before the real test?",
    goPracticeBtn: "Yes, let's practice",
    skipPracticeBtn: "No, skip to real test",
    preTestModalTitle: "Real Test Approaching",
    preTestModalDesc: "Please confirm your details before starting",
    warningRealTestTitle: "This is the real assessment",
    warningRealTestDesc: "The timer will start immediately upon confirmation.",
    eduLessThan8: "Less than 8 years",
    eduMoreThan8: "8 years or more",
    startRealTestBtn: "Start Real Test",
    backToPracticeBtn: "Back to Practice",

    // Restart Modal
    restartConfirmTitle: "Restart Test?",
    restartConfirmMessage: "Are you sure you want to clear the canvas and restart?",
    cancel: "Cancel",
    confirmRestart: "Yes, Restart",

    // Loading Screen
    analyzing: "Analyzing your drawing...",
    loadingStep1: "Analyzing pen pressure...",
    loadingStep2: "Processing stroke patterns...",
    loadingStep3: "Running ViT AI model...",
    loadingStep4: "Generating report...",

    // Report Screen
    reportTitle: "Assessment Report",
    reportSubtitle: "Processed from Kinematic Features and AI",
    reportDemographics: "Test Subject Info",
    reportAge: "Age: {{age}} years",
    reportEducation: "Education: {{education}}",
    aiConfidenceScore: "AI Confidence Score",
    resultElevatedRisk: "Result: Elevated Risk Detected",
    resultExpectedRange: "Result: Within Expected Range",
    disclaimer: "This is a preliminary screening tool. Please consult a doctor for a full clinical evaluation.",
    downloadPdfReport: "Download PDF Report",
    returnHome: "Return to Home",
    timeDistribution: "Time Distribution",
    thinkTime: "Think Time",
    drawTime: "Draw Time",
    totalTime: "Total",
    velocityProfile: "Velocity Profile",
    drawingSpeedOverTime: "Drawing Speed Over Time",
    ruleBasedAssessment: "Rule-Based Assessment",

    // Shared form fields
    eduSelectPlaceholder: "-- Select Education Level --",
    eduLevel0: "None (0 years)",
    eduLevel4: "Primary School 1-4 (4 years)",
    eduLevel6: "Primary School 5-6 (6 years)",
    eduLevel9: "Middle School (9 years)",
    eduLevel12: "High School (12 years)",
    eduLevel14: "Diploma (14 years)",
    eduLevel16: "Bachelor's Degree (16 years)",
    eduLevel18: "Postgraduate (18+ years)",
    readyToStartTitle: "Ready to start?",
    readyToStartMsg: "When you click \"Confirm\", the timer will start immediately. Please draw continuously.",
    confirmStart: "Confirm & Start Timer",

      // Dashboard — State B (profile exists)
      dashboardGreetingLabel:   'Welcome back',
      dashboardStartBtn:        'Start New Assessment',
      dashboardStartDesc:       'Begin the clock drawing test',
      dashboardHistoryBtn:      'View History',
      dashboardHistoryDesc:     'Browse past assessment records',
      dashboardEditBtn:         'Edit Profile',
      dashboardEditDesc:        'Change alias, age or education',

      // Dashboard — State A (edit mode)
      dashboardEditProfileTitle: 'Edit Your Profile',
      dashboardSaveProfileBtn:   'Save Changes',

      // Report screen — Subject Info section
      reportSubjectInfoTitle:    'Test Subject Info',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

