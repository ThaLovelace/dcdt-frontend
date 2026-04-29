"use client"

import { useState } from 'react'
import { useApp, AnalysisResponse } from '@/lib/app-context'
import {
  Home, Download, CheckCircle2, AlertTriangle,
  Brain, Activity, Zap,
  ChevronDown, Info, TrendingUp, AlertOctagon
} from 'lucide-react'

/*
// -----------------------------------------------------------------------------
// V2.0 Type Definitions for Backend Response
// -----------------------------------------------------------------------------
interface AnalysisPayload {
  class_id: string;
  risk_level: string;
  risk_color: string;
  kinematic: {
    K1_rms_cm: number | null;
    K2_velocity_cms: number | null;
    K3_pressure_avg: number | null;
    K3_pressure_decrement: number | null;
    K4_pct_think_time: number | null;
    K5_pfhl_ms: number | null;
    flags: string[];
  };
  domain: {
    k1_triggered: boolean;
    k2_triggered: boolean;
    k3_triggered: boolean;
    k4_triggered: boolean;
    k5_triggered: boolean;
    motor_abnormal: boolean;
    cognitive_abnormal: boolean;
    ai_abnormal: boolean;
  };
  warnings: string[];
  velocity_profile?: number[];
}
*/

// -----------------------------------------------------------------------------
// Clinical Data Configuration
// -----------------------------------------------------------------------------

const C_LEVELS = [
  { level: 'C0', titleTH: 'ปกติสมบูรณ์', titleEN: 'Normal', risk: 'none', color: '#059669', ai: 'Normal', motor: 'Normal', cognitive: 'Normal', clinicalTH: 'ปกติสมบูรณ์: ไม่พบความผิดปกติทั้งด้านโครงสร้างรูปวาดและกระบวนการวาด', clinicalEN: 'Fully Normal: No structural or process abnormalities detected.', actionTH: 'แนะนำให้รักษาสุขภาพและตรวจเช็คประจำปี', actionEN: 'Maintain healthy habits and schedule annual screening.' },
  { level: 'C1', titleTH: 'ความเสี่ยงทางกายภาพ', titleEN: 'Physical Risk', risk: 'low', color: '#65a30d', ai: 'Normal', motor: 'Abnormal', cognitive: 'Normal', clinicalTH: 'ความเสี่ยงทางกายภาพ: วาดรูปได้ถูกต้อง แต่พบความผิดปกติของการควบคุมกล้ามเนื้อ (อาการสั่น) โดยไม่มีภาวะความจำเสื่อมร่วมด้วย', clinicalEN: 'Pure Physical Risk: Correct drawing but motor control abnormalities (e.g., tremor) without cognitive impairment.', actionTH: 'อาจบ่งชี้โรคพาร์กินสันระยะเริ่มต้น แนะนำให้ปรึกษาแพทย์', actionEN: 'May indicate early-stage Parkinson\'s. Consult a physician.' },
  { level: 'C2', titleTH: 'สัญญาณเตือนระยะแรกเริ่ม', titleEN: 'Early Cognitive Sign', risk: 'moderate', color: '#ca8a04', ai: 'Normal', motor: 'Normal', cognitive: 'Abnormal', clinicalTH: 'สัญญาณเตือนระยะแรกเริ่ม (Critical): วาดรูปได้ถูกต้อง แต่กระบวนการคิดผิดปกติ — บ่งชี้ภาวะ MCI ที่การตรวจดั้งเดิมอาจมองข้าม', clinicalEN: 'Early Cognitive Sign (Critical Detection): Correct drawing but abnormal cognitive process, suggesting MCI traditional tests may miss.', actionTH: 'กลุ่มเป้าหมายสำคัญ — ควรติดตามผลอย่างใกล้ชิดและส่งพบแพทย์', actionEN: 'Critical Detection group — close follow-up and specialist referral strongly recommended.' },
  { level: 'C3', titleTH: 'ความเสี่ยงผสม', titleEN: 'Mixed Risk', risk: 'moderate', color: '#d97706', ai: 'Normal', motor: 'Abnormal', cognitive: 'Abnormal', clinicalTH: 'ความเสี่ยงผสม: พบความผิดปกติทั้งร่างกายและความคิด แม้รูปวาดยังดูปกติ', clinicalEN: 'Mixed Risk / Non-Dementia: Both motor and cognitive abnormalities despite visually normal drawing.', actionTH: 'จำเป็นต้องส่งต่อแพทย์เพื่อวินิจฉัยแยกโรค', actionEN: 'Specialist referral required for differential diagnosis.' },
  { level: 'C4', titleTH: 'ความผิดปกติทางทักษะ', titleEN: 'Visual Anomaly', risk: 'high', color: '#ea580c', ai: 'Dementia', motor: 'Normal', cognitive: 'Normal', clinicalTH: 'ความผิดปกติทางทักษะ / False Alarm: AI ตรวจพบรูปวาดผิดเพี้ยน แต่กระบวนการคิดและร่างกายปกติ', clinicalEN: 'Visual Anomaly / False Alarm: AI detected drawing anomalies but cognitive and motor processes are normal.', actionTH: 'ใช้ข้อมูลการศึกษาและตัวแปรจลนศาสตร์เพื่อกรอง false positives จาก AI', actionEN: 'Use education and process biomarkers to filter AI false positives.' },
  { level: 'C5', titleTH: 'อัลไซเมอร์ระยะต้น', titleEN: 'Early Alzheimer\'s', risk: 'high', color: '#dc2626', ai: 'Dementia', motor: 'Normal', cognitive: 'Abnormal', clinicalTH: 'อัลไซเมอร์ระยะต้น: รูปวาดผิดเพี้ยนร่วมกับกระบวนการคิดที่ล่าช้า — รูปแบบที่ชัดเจนที่สุดของภาวะสมองเสื่อม', clinicalEN: 'Typical Alzheimer\'s Pattern: Abnormal drawing combined with delayed cognitive process — clearest pattern of dementia.', actionTH: 'แนะนำให้พบแพทย์ผู้เชี่ยวชาญโดยด่วน', actionEN: 'Urgent specialist referral recommended.' },
  { level: 'C6', titleTH: 'ภาวะสมองเสื่อมร่วมกับโรคทางกาย', titleEN: 'Motor-Dominant Dementia', risk: 'critical', color: '#b91c1c', ai: 'Dementia', motor: 'Abnormal', cognitive: 'Normal', clinicalTH: 'ภาวะสมองเสื่อมร่วมกับโรคทางกาย: รูปวาดผิดเพี้ยนและควบคุมกล้ามเนื้อไม่ได้ อาจบ่งชี้ Parkinson\'s Disease Dementia (PDD)', clinicalEN: 'Motor-Dominant Dementia: Abnormal drawing and motor control loss, potentially indicating PDD.', actionTH: 'ควรรีบพบแพทย์เพื่อประเมินเพิ่มเติม', actionEN: 'Seek medical evaluation promptly.' },
  { level: 'C7', titleTH: 'ภาวะถดถอยรุนแรง', titleEN: 'Severe Impairment', risk: 'critical', color: '#7f1d1d', ai: 'Dementia', motor: 'Abnormal', cognitive: 'Abnormal', clinicalTH: 'ภาวะถดถอยรุนแรง: พบความผิดปกติในทุกมิติ — รูปวาด การเคลื่อนไหว และความคิด บ่งชี้ภาวะสมองเสื่อมระยะลุกลาม', clinicalEN: 'Severe / Global Impairment: Abnormalities across all dimensions consistent with advanced dementia.', actionTH: 'ต้องการการดูแลจากแพทย์ผู้เชี่ยวชาญอย่างเร่งด่วน', actionEN: 'Requires urgent specialist care.' },
]

const K_RULES_BASE = [
  { id: 'K1', domain: 'motor' as const, nameTH: 'อาการสั่น (Tremor)', nameEN: 'Tremor', descTH: 'ความไม่ราบรื่นของการเคลื่อนไหวจากการควบคุมกล้ามเนื้อ (Parkinsonian Tremor)', descEN: 'Movement irregularity due to impaired muscle control (Parkinsonian Tremor)' },
  { id: 'K2', domain: 'motor' as const, nameTH: 'เคลื่อนไหวช้า (Bradykinesia)', nameEN: 'Bradykinesia', descTH: 'ความเร็วเฉลี่ยของปากกาต่ำกว่าเกณฑ์ปกติ', descEN: 'Average pen velocity below normal threshold' },
  { id: 'K3', domain: 'motor' as const, nameTH: 'เขียนเล็ก/เบา (Micrographia)', nameEN: 'Micrographia', descTH: 'ภาวะเขียนตัวเล็กผิดปกติหรือแรงกดปากกาแผ่วเบา', descEN: 'Abnormally small writing or very light pen pressure' },
  { id: 'K4', domain: 'cognitive' as const, nameTH: 'ความลังเล (Hesitation)', nameEN: 'Hesitation', descTH: 'สัดส่วนเวลาที่หยุดคิดเพื่อดึงข้อมูลจากความจำ (%ThinkTime)', descEN: 'Memory retrieval deficit assessed via % Think Time' },
  { id: 'K5', domain: 'cognitive' as const, nameTH: 'ความหน่วงก่อนวาดเข็ม (Pre-First Hand Latency)', nameEN: 'Pre-First Hand Latency', descTH: 'ความล่าช้าในการวางแผนก่อนวาดเข็มนาฬิกาเส้นแรก (Executive Dysfunction)', descEN: 'Planning delay before drawing the first clock hand (Executive Dysfunction)' },
]

const getRiskLevelConfig = (classId: string, lang: string) => {
  if (classId === 'C0') {
    return {
      levelText: lang === 'th' ? 'ระดับปกติ (Normal)' : 'Normal Level',
      descText: lang === 'th' ? 'สุขภาพสมองและกล้ามเนื้ออยู่ในเกณฑ์ดี ไม่พบความเสี่ยงที่มีนัยสำคัญ แนะนำให้รักษาสุขภาพและตรวจเช็คประจำปี' : 'Brain and motor health are in good condition. No significant risk detected.',
      colorBg: 'bg-emerald-50',
      colorText: 'text-emerald-800',
      colorBorder: 'border-emerald-200',
      icon: <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-4" />
    }
  }
  
  if (['C1', 'C2', 'C4'].includes(classId)) {
    return {
      levelText: lang === 'th' ? 'ระดับเฝ้าระวัง (Warning)' : 'Mild Risk / Warning',
      descText: lang === 'th' ? 'พบความเสี่ยงระดับเริ่มต้น หรือความผิดปกติเฉพาะส่วน แนะนำให้สังเกตอาการใกล้ชิด' : 'Mild risk or specific anomalies detected. Close monitoring recommended.',
      colorBg: 'bg-amber-50',
      colorText: 'text-amber-800',
      colorBorder: 'border-amber-300',
      icon: <AlertTriangle className="w-14 h-14 text-amber-500 mb-4" />
    }
  }

  return {
    levelText: lang === 'th' ? 'ระดับความเสี่ยงสูง (High Risk)' : 'High Risk',
    descText: lang === 'th' ? 'พบความเสี่ยงสูง รูปวาดมีความผิดเพี้ยนร่วมกับกระบวนการคิดหรือการควบคุมร่างกายที่บกพร่อง แนะนำให้พบแพทย์ผู้เชี่ยวชาญ' : 'High risk detected. Structural anomalies combined with cognitive impairment. Please consult a doctor.',
    colorBg: 'bg-red-50',
    colorText: 'text-red-800',
    colorBorder: 'border-red-300',
    icon: <AlertOctagon className="w-14 h-14 text-red-500 mb-4" />
  }
}

// -----------------------------------------------------------------------------
// Timeline Component
// -----------------------------------------------------------------------------

function SparkLine({ points }: { points: number[] }) {
  if (!points || points.length === 0) return null;

  const W = 300, H = 80, pad = 8;
  const chartW = W - pad * 2;
  const chartH = H - pad * 2;

  // Dynamic Normalization: Find Min / Max of actual data
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1; 

  // Normalize points 0 to 1
  const normalizedPoints = points.map(p => (p - min) / range);

  // Safely calculate X coordinate to prevent division by zero
  const getX = (i: number, len: number) => {
    if (len === 1) return pad + chartW / 2; // Center if only 1 point
    return pad + (i / (len - 1)) * chartW;
  };

  const path = normalizedPoints
    .map((p, i) => {
      const x = getX(i, normalizedPoints.length);
      const y = pad + (1 - p) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // If there's only 1 point, we don't draw an area fill
  const area = normalizedPoints.length > 1 
    ? `${path} L ${pad + chartW} ${pad + chartH} L ${pad} ${pad + chartH} Z`
    : "";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[100px] drop-shadow-sm">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={area} fill="url(#spark-fill)" />}
      
      {/* If it's a single point, we don't need a connecting line, just the circle */}
      {normalizedPoints.length > 1 && (
        <path d={path} fill="none" stroke="#3b82f6" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      )}
      
      {normalizedPoints.map((p, i) => {
        const x = getX(i, normalizedPoints.length);
        const y = pad + (1 - p) * chartH;
        return (
          <circle key={i} cx={x} cy={y} r={3.5} fill="#ffffff" stroke="#3b82f6" strokeWidth={2} />
        );
      })}
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function SectionHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="dcdt-section-header mb-4">
      <h2 className="text-xl font-bold text-gray-900">{label}</h2>
      {sub && <span className="text-[11px] font-semibold text-gray-400/70">{sub}</span>}
    </div>
  )
}

function StatusPill({ pass, passLabel, failLabel }: { pass: boolean; passLabel: string; failLabel: string }) {
  return pass ? (
    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
      <CheckCircle2 className="w-3.5 h-3.5" /> {passLabel}
    </span>
  ) : (
    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
      <AlertTriangle className="w-3.5 h-3.5" /> {failLabel}
    </span>
  )
}

function KRuleRow({ rule, lang }: { rule: typeof K_RULES_BASE[0] & { detected: boolean }; lang: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-2xl border-2 transition-all duration-200 ${rule.detected ? 'border-amber-200 bg-amber-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}>
      <button className="w-full flex items-center p-4 cursor-pointer focus:outline-none" onClick={() => setOpen(v => !v)}>
        <span className={`flex items-center justify-center w-10 h-10 rounded-xl font-black mr-4 ${rule.detected ? 'bg-white text-amber-600 border border-amber-100' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
          {rule.id}
        </span>
        <span className="flex-1 text-sm md:text-base font-bold text-gray-800 text-left">
          {lang === 'th' ? rule.nameTH : rule.nameEN}
        </span>
        {rule.detected
          ? <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full flex-shrink-0 mr-3">Detected</span>
          : <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex-shrink-0 mr-3">Normal</span>
        }
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-gray-500 leading-relaxed pl-14">
            {lang === 'th' ? rule.descTH : rule.descEN}
          </p>
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function ReportScreen() {
  const { t, language, setCurrentScreen, getTCT, resetRestartCount, analysisData: rawAnalysisData } = useApp()

  // 1. Cast context data to our updated V2.0 interface
  const analysisData = rawAnalysisData as AnalysisResponse | undefined | null;

  // 2. Extract Class ID and map to Local Configuration
  const classId = analysisData?.class_id || 'C0';
  const RESULT = C_LEVELS.find(c => c.level === classId) || C_LEVELS[0];

  // 3. Extract Triggers
  const domain = analysisData?.domain || {
    k1_triggered: false, k2_triggered: false, k3_triggered: false,
    k4_triggered: false, k5_triggered: false,
    motor_abnormal: false, cognitive_abnormal: false, ai_abnormal: false
  };

  const dynamicKRules = K_RULES_BASE.map(rule => {
    let detected = false;
    if (rule.id === 'K1') detected = domain.k1_triggered;
    if (rule.id === 'K2') detected = domain.k2_triggered;
    if (rule.id === 'K3') detected = domain.k3_triggered;
    if (rule.id === 'K4') detected = domain.k4_triggered;
    if (rule.id === 'K5') detected = domain.k5_triggered;
    return { ...rule, detected };
  });

  const motorAbnormal = domain.motor_abnormal;
  const cognitiveAbnormal = domain.cognitive_abnormal;

  // 4. Handle Timing & Variables
  const totalTime = getTCT() || 45;
  const thinkPercent = analysisData?.kinematic?.K4_pct_think_time || 65;
  const inkPercent = 100 - thinkPercent;
  const thinkSec = Math.round((thinkPercent / 100) * totalTime);
  const inkSec = totalTime - thinkSec;
  const TIMELINE = analysisData?.velocity_profile || [];
  
  const riskColor = RESULT.color;
  const lang = language;

  const handleReturnHome = () => {
    resetRestartCount();
    setCurrentScreen('tutorial');
  }

  const riskConfig = getRiskLevelConfig(RESULT.level, lang);
  const motorRules = dynamicKRules.filter(k => k.domain === 'motor');
  const cognitiveRules = dynamicKRules.filter(k => k.domain === 'cognitive');

  return (
    <div className="w-full bg-slate-50 min-h-full pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-10">

        {/* --- EDUCATION WARNING BANNER --- */}
        {analysisData?.warnings?.includes("EDUCATION_BIAS_WARNING") && (
          <div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-xl flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-800">
                {lang === 'th' ? '⚠️ ตรวจพบความเสี่ยงอคติจากการศึกษา' : '⚠️ Education Bias Risk Detected'}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {lang === 'th' 
                  ? 'ผู้ป่วยมีการศึกษาน้อยกว่า 8 ปี การประเมินผลนี้อาจมี False Positive แพทย์ควรพิจารณาปัจจัยแวดล้อมอื่นประกอบ' 
                  : 'Patient has < 8 years of education. Results may contain false positives. Clinical correlation required.'}
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-500 uppercase tracking-wide text-xs">{lang === 'th' ? 'รายงานผลการประเมิน' : 'Assessment Report'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="text-xs font-bold text-gray-400">dCDT</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              {lang === 'th' ? 'ผลการวิเคราะห์ภาวะรู้คิด' : 'Cognitive Assessment Results'}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => window.print()} className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('downloadPdfReport')}</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button onClick={handleReturnHome} className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-blue-500 text-white text-sm font-semibold shadow-sm hover:bg-blue-600 transition-colors">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('returnHome')}</span>
              <span className="sm:hidden">{lang === 'th' ? 'หน้าหลัก' : 'Home'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
              <SectionHeader label={lang === 'th' ? 'ระดับความเสี่ยง' : 'Risk Level'} sub="Classification" />
              <div className={`mt-4 rounded-[2rem] p-8 border-2 shadow-sm flex flex-col items-center text-center transition-all ${riskConfig.colorBg} ${riskConfig.colorBorder}`}>
                {riskConfig.icon}
                <h2 className={`text-2xl md:text-3xl font-black mb-3 ${riskConfig.colorText}`}>{riskConfig.levelText}</h2>
                <p className={`text-sm md:text-base font-medium leading-relaxed opacity-90 ${riskConfig.colorText}`}>{riskConfig.descText}</p>
              </div>
              <div className="my-8 border-t-2 border-gray-100" />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                {lang === 'th' ? 'รายละเอียดกลุ่มอาการ (C-Series)' : 'Clinical Details'}
              </p>
              <div className="rounded-2xl p-5 mb-4 border-l-4 shadow-sm bg-white" style={{ borderLeftColor: riskColor }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-black" style={{ color: riskColor }}>{RESULT.level}</span>
                  <span className="text-base font-bold text-gray-900">{lang === 'th' ? RESULT.titleTH : RESULT.titleEN}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{lang === 'th' ? RESULT.clinicalTH : RESULT.clinicalEN}</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-bold text-gray-900">{lang === 'th' ? 'ข้อแนะนำ: ' : 'Action: '}</span>
                  {lang === 'th' ? RESULT.actionTH : RESULT.actionEN}
                </p>
              </div>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {C_LEVELS.map(c => (
                  <div key={c.level} className={`rounded-2xl py-2.5 text-center transition-all duration-300 ${c.level === RESULT.level ? 'border-2 shadow-md scale-[1.03]' : 'border border-gray-100 bg-gray-50/50 opacity-50'}`} style={{ borderColor: c.level === RESULT.level ? c.color : '#f3f4f6', backgroundColor: c.level === RESULT.level ? `${c.color}15` : '' }}>
                    <p className="text-xs font-black" style={{ color: c.level === RESULT.level ? c.color : '#9ca3af' }}>{c.level}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
              <SectionHeader label={lang === 'th' ? 'เวลาที่ใช้ทั้งหมด' : 'Total Completion Time'} />
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-black text-gray-900 leading-none">{totalTime}</span>
                <span className="text-xl font-bold text-gray-400 mb-1">s</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
                {lang === 'th' ? 'เวลาตั้งแต่เริ่มอ่านคำสั่งจนวาดเข็มนาฬิกาเสร็จสิ้น' : 'Time from reading instructions to completing the clock hands'}
              </p>
              <div className="w-full h-4 rounded-full overflow-hidden bg-gray-100 mb-4 flex shadow-inner">
                <div className="h-full rounded-l-full bg-blue-300" style={{ width: `${thinkPercent}%` }} />
                <div className="h-full rounded-r-full flex-1 bg-blue-500" />
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shadow-sm bg-blue-300" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{lang === 'th' ? 'เวลาที่ใช้คิด' : 'Thinking Time'}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{Math.round(thinkPercent)}% · {thinkSec}s</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shadow-sm bg-blue-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{lang === 'th' ? 'เวลาที่ใช้ลากเส้น' : 'Inking Time'}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{Math.round(inkPercent)}% · {inkSec}s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            {/* --- 1. AI Structural Analysis Section (Enhanced) --- */}
<div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
  {/* Header with Confidence Gauge */}
  <div className="flex items-center justify-between px-6 py-5 border-b-2 border-gray-50">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50">
        <Brain className="w-7 h-7 text-blue-500" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{lang === 'th' ? 'ผลการวิเคราะห์โดย AI' : 'AI Analysis'}</h2>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ViT-B/16 Engine</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className={`text-xs font-black ${(analysisData?.ai_confidence ?? 0) > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
            {analysisData?.ai_confidence?.toFixed(1)}% {lang === 'th' ? 'ความมั่นใจ' : 'Confidence'}
          </span>
        </div>
      </div>
    </div>
    <StatusPill 
      pass={!domain.ai_abnormal} 
      passLabel={lang === 'th' ? 'ปกติ' : 'Normal'} 
      failLabel={lang === 'th' ? 'ผิดปกติ' : 'Dementia'} 
    />
  </div>

  <div className="p-6 bg-gray-50/30">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* View 1: Centered Input (What AI sees) */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
            {lang === 'th' ? 'ภาพที่ AI ใช้ประมวลผล' : 'Processed Input'}
          </span>
          <div className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-white bg-white shadow-sm ring-1 ring-black/5">
            {analysisData?.processed_image_b64 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={analysisData.processed_image_b64.startsWith('data:')                  ? analysisData.processed_image_b64 
                  : `data:image/png;base64,${analysisData.processed_image_b64}`
                } 
                className="w-full h-full object-contain"
                alt="Centered Input"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 text-xs italic">No Processed Image</div>
            )}
          </div>
        </div>

        {/* View 2: XAI Heatmap (What AI focuses on) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              {lang === 'th' ? 'จุดที่ AI ให้ความสำคัญ' : 'AI Attention Map'}
            </span>
            <Info className="w-3 h-3 text-gray-300 cursor-help" />
          </div>
          <div className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-white bg-white shadow-sm ring-1 ring-black/5">
            {analysisData?.xai_evidence_b64 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={analysisData.xai_evidence_b64.startsWith('data:')                  ? analysisData.xai_evidence_b64 
                  : `data:image/png;base64,${analysisData.xai_evidence_b64}`
                } 
                className="w-full h-full object-contain"
                alt="AI Heatmap"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 text-xs italic">No Attention Map</div>
            )}
          </div>
        </div>

      </div>

      {/* Replay Controls Placeholder */}
      <div className="mt-8 flex flex-col items-center border-t border-gray-100 pt-6">
        <button className="flex items-center gap-3 px-8 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
            <Zap className="w-5 h-5 text-blue-500 fill-blue-50 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-gray-700">
              {lang === 'th' ? 'ดูวิดีโอลำดับการวาด (Replay)' : 'Replay Drawing Order'}
            </span>
        </button>
        <p className="text-[10px] font-medium text-gray-400 mt-3 text-center max-w-xs">
          * {lang === 'th' ? 'ลำดับการวาดช่วยให้แพทย์วินิจฉัยกระบวนการวางแผน (Executive Function) ได้ชัดเจนขึ้น' : 'Replaying the sequence helps clinical observation of executive planning.'}
        </p>
      </div>
    </div>
  </div>

            {/* Motor Domain Card */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50">
                    <Activity className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{lang === 'th' ? 'การควบคุมร่างกาย (Motor Domain)' : 'Physical Control (Motor)'}</h2>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">{lang === 'th' ? 'OR Logic: K1-K3 — พบความผิดปกติ 1 ข้อ = ผิดปกติ' : 'OR Logic: Any positive K1-K3 = Abnormal'}</p>
                  </div>
                </div>
                <StatusPill pass={!motorAbnormal} passLabel={lang === 'th' ? 'ปกติ' : 'Normal'} failLabel={lang === 'th' ? 'ผิดปกติ' : 'Abnormal'} />
              </div>
              <div className="flex flex-col gap-3">
                {motorRules.map(rule => <KRuleRow key={rule.id} rule={rule} lang={lang} />)}
              </div>
            </div>

            {/* Cognitive Domain Card */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50">
                    <Zap className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{lang === 'th' ? 'กระบวนการรู้คิด (Cognitive Domain)' : 'Cognitive Process'}</h2>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">{lang === 'th' ? 'OR Logic: K4-K5 — พบความผิดปกติ 1 ข้อ = ผิดปกติ' : 'OR Logic: Any positive K4-K5 = Abnormal'}</p>
                  </div>
                </div>
                <StatusPill pass={!cognitiveAbnormal} passLabel={lang === 'th' ? 'ปกติ' : 'Normal'} failLabel={lang === 'th' ? 'ผิดปกติ' : 'Abnormal'} />
              </div>
              <div className="flex flex-col gap-3">
                {cognitiveRules.map(rule => <KRuleRow key={rule.id} rule={rule} lang={lang} />)}
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 mt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    <span className="font-bold text-gray-900">%ThinkTime = {Math.round(thinkPercent)}%</span>{' — '}
                    {lang === 'th' ? 'สัดส่วนเวลาที่หยุดคิดเพื่อดึงข้อมูลจากความจำ ค่าสูงบ่งชี้ภาวะ Memory Retrieval Deficit' : 'Proportion of time paused to retrieve information from memory. High values indicate Memory Retrieval Deficit.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50">
                    <TrendingUp className="w-7 h-7 text-blue-500" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {lang === 'th' ? 'ลำดับและความเร็วของการลากเส้น' : 'Velocity Profile'}
                  </h2>
                </div>
                <span className="text-sm font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl shadow-sm">
                  {TIMELINE.length > 0 ? TIMELINE.length : 0} strokes
                </span>
              </div>
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <SparkLine points={TIMELINE.length > 0 ? TIMELINE : [0, 0]} />
                <div className="flex justify-between mt-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{lang === 'th' ? 'เริ่มต้น' : 'Start'}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{lang === 'th' ? 'สิ้นสุด' : 'End'}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: lang === 'th' ? 'เวลารวม' : 'Total Time', value: `${totalTime}s`, sub: lang === 'th' ? 'ทั้งหมด' : 'overall' },
                  { label: lang === 'th' ? 'เวลาที่ใช้คิด' : 'Think Time', value: `${thinkSec}s`, sub: `${Math.round(thinkPercent)}%` },
                  { label: lang === 'th' ? 'เวลาลากเส้น' : 'Ink Time', value: `${inkSec}s`, sub: `${Math.round(inkPercent)}%` },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">{s.label}</p>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-10 pb-6 flex items-start gap-3 px-4">
          <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            <span className="font-bold text-gray-700">{lang === 'th' ? 'ข้อจำกัดความรับผิดชอบ: ' : 'Disclaimer: '}</span>
            {t('disclaimer')}
          </p>
        </div>

      </div>
    </div>
  );
}