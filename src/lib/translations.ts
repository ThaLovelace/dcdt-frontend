export type Language = 'en' | 'th'

export const translations = {
  en: {
    // Header
    appTitle: 'Digital Clock Drawing Test',
    
    // Practice Screen
    practiceTitle: "Let's get familiar with the screen",
    practiceSubtitle: 'Feel free to draw anything here to get used to the pen. Take all the time you need.',
    clearCanvas: 'Clear',
    iAmFamiliar: "I am familiar, let's start the real test",
    
    // Preparation Screen
    prepTitle: 'Ready for the assessment?',
    prepSubtitle: 'When you press the button, the timer will start and you will see the instructions.',
    startTimerButton: 'Start Timer and Show Instruction',
    
    // Canvas Screen
    canvasInstruction: 'Draw a clock face, add all the numbers, and set the time to 11:10.',
    stylusMode: 'Stylus Only Mode',
    palmRejection: 'Palm Rejection',
    restartTest: 'Restart Test',
    finishSubmit: 'Finish and Submit',
    drawHere: 'Draw your clock here',
    
    // Restart Confirmation Modal
    restartConfirmTitle: 'Restart Test?',
    restartConfirmMessage: 'Are you sure you want to clear the canvas and restart?',
    cancel: 'Cancel',
    confirmRestart: 'Yes, Restart',
    
    // Loading
    analyzing: 'Analyzing your drawing...',
    loadingStep1: 'Analyzing pen pressure...',
    loadingStep2: 'Processing stroke patterns...',
    loadingStep3: 'Running ViT AI model...',
    loadingStep4: 'Generating report...',
    
    // Report - Section 1: Core Result
    aiConfidenceScore: 'AI Confidence Score',
    resultElevatedRisk: 'Result: Elevated Risk Detected',
    resultExpectedRange: 'Result: Expected Range',
    disclaimer: 'This is a preliminary screening tool. Please consult your physician for a comprehensive clinical evaluation.',
    downloadPdfReport: 'Download PDF Report',
    returnHome: 'Return to Home',
    
    // Report - Section 2: Kinematic Biomarkers
    timeDistribution: 'Time Distribution',
    thinkTime: 'Think Time',
    drawTime: 'Draw Time',
    totalTime: 'Total',
    velocityProfile: 'Velocity Profile',
    drawingSpeedOverTime: 'Drawing speed over time',
    
    // Report - Section 3: Rule-Based Assessment
    ruleBasedAssessment: 'Rule-Based Assessment',
    clockFaceIntegrity: 'Clock Face Integrity',
    numberSequence: 'Number Sequence 1-12',
    handPlacement: 'Hand Placement (11:10)',
    spatialPlanningRestarts: 'Spatial Planning Restarts',
    userRestarted: 'User restarted',
    times: 'times',
    passed: 'Pass',
    warning: 'Warning',
  },
  th: {
    // Header
    appTitle: 'แบบทดสอบวาดนาฬิกาดิจิทัล',
    
    // Practice Screen
    practiceTitle: 'มาทำความคุ้นเคยกับหน้าจอกัน',
    practiceSubtitle: 'ลองวาดอะไรก็ได้ที่นี่เพื่อทำความคุ้นเคยกับปากกา ไม่ต้องรีบ',
    clearCanvas: 'ล้าง',
    iAmFamiliar: 'คุ้นเคยแล้ว เริ่มทดสอบจริง',
    
    // Preparation Screen
    prepTitle: 'พร้อมสำหรับการประเมินหรือยัง?',
    prepSubtitle: 'เมื่อคุณกดปุ่ม นาฬิกาจับเวลาจะเริ่มและคุณจะเห็นคำแนะนำ',
    startTimerButton: 'เริ่มจับเวลาและแสดงคำแนะนำ',
    
    // Canvas Screen
    canvasInstruction: 'วาดหน้าปัดนาฬิกา ใส่ตัวเลขทั้งหมด และตั้งเวลาเป็น 11:10',
    stylusMode: 'โหมดปากกาเท่านั้น',
    palmRejection: 'ป้องกันฝ่ามือ',
    restartTest: 'เริ่มใหม่',
    finishSubmit: 'เสร็จสิ้นและส่ง',
    drawHere: 'วาดนาฬิกาของคุณที่นี่',
    
    // Restart Confirmation Modal
    restartConfirmTitle: 'เริ่มใหม่หรือไม่?',
    restartConfirmMessage: 'คุณแน่ใจหรือไม่ว่าต้องการล้างผืนผ้าใบและเริ่มใหม่?',
    cancel: 'ยกเลิก',
    confirmRestart: 'ใช่ เริ่มใหม่',
    
    // Loading
    analyzing: 'กำลังวิเคราะห์ภาพวาดของคุณ...',
    loadingStep1: 'วิเคราะห์แรงกดปากกา...',
    loadingStep2: 'ประมวลผลรูปแบบลายเส้น...',
    loadingStep3: 'รันโมเดล ViT AI...',
    loadingStep4: 'สร้างรายงาน...',
    
    // Report - Section 1: Core Result
    aiConfidenceScore: 'คะแนนความมั่นใจ AI',
    resultElevatedRisk: 'ผลลัพธ์: ตรวจพบความเสี่ยงสูง',
    resultExpectedRange: 'ผลลัพธ์: อยู่ในช่วงปกติ',
    disclaimer: 'นี่คือเครื่องมือคัดกรองเบื้องต้น กรุณาปรึกษาแพทย์เพื่อรับการประเมินทางคลินิกอย่างครบถ้วน',
    downloadPdfReport: 'ดาวน์โหลดรายงาน PDF',
    returnHome: 'กลับหน้าหลัก',
    
    // Report - Section 2: Kinematic Biomarkers
    timeDistribution: 'การกระจายเวลา',
    thinkTime: 'เวลาคิด',
    drawTime: 'เวลาวาด',
    totalTime: 'รวม',
    velocityProfile: 'โปรไฟล์ความเร็ว',
    drawingSpeedOverTime: 'ความเร็วการวาดตามเวลา',
    
    // Report - Section 3: Rule-Based Assessment
    ruleBasedAssessment: 'การประเมินตามกฎเกณฑ์',
    clockFaceIntegrity: 'ความสมบูรณ์ของหน้าปัด',
    numberSequence: 'ลำดับตัวเลข 1-12',
    handPlacement: 'ตำแหน่งเข็ม (11:10)',
    spatialPlanningRestarts: 'การเริ่มวางแผนใหม่',
    userRestarted: 'ผู้ใช้เริ่มใหม่',
    times: 'ครั้ง',
    passed: 'ผ่าน',
    warning: 'เตือน',
  }
} as const

export type TranslationKey = keyof typeof translations.en
