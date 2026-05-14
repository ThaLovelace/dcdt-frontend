"use client"

import { useState, useEffect, useRef } from 'react'
import { useApp, AnalysisResponse } from '@/lib/app-context'
import { saveRecord } from '@/lib/history-manager'
import {
  Home, Download, CheckCircle2, AlertTriangle,
  Brain, Activity, Zap,
  ChevronDown, Info, TrendingUp, AlertOctagon,
  User, GraduationCap, Hash,
} from 'lucide-react'

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
  { id: 'K1', domain: 'motor'     as const, nameTH: 'อาการสั่น (Tremor)',                      nameEN: 'Tremor',                    descTH: 'ความไม่ราบรื่นของการเคลื่อนไหวจากการควบคุมกล้ามเนื้อ (Parkinsonian Tremor)',         descEN: 'Movement irregularity due to impaired muscle control (Parkinsonian Tremor)' },
  { id: 'K2', domain: 'motor'     as const, nameTH: 'เคลื่อนไหวช้า (Bradykinesia)',             nameEN: 'Bradykinesia',              descTH: 'ความเร็วเฉลี่ยของปากกาต่ำกว่าเกณฑ์ปกติ',                                              descEN: 'Average pen velocity below normal threshold' },
  { id: 'K3', domain: 'motor'     as const, nameTH: 'เขียนเล็ก/เบา (Micrographia)',            nameEN: 'Micrographia',              descTH: 'ภาวะเขียนตัวเล็กผิดปกติหรือแรงกดปากกาแผ่วเบา',                                      descEN: 'Abnormally small writing or very light pen pressure' },
  { id: 'K4', domain: 'cognitive' as const, nameTH: 'ความลังเล (Hesitation)',                   nameEN: 'Hesitation',                descTH: 'สัดส่วนเวลาที่หยุดคิดเพื่อดึงข้อมูลจากความจำ (%ThinkTime)',                          descEN: 'Memory retrieval deficit assessed via % Think Time' },
  { id: 'K5', domain: 'cognitive' as const, nameTH: 'ความหน่วงก่อนวาดเข็ม (Pre-First Hand Latency)', nameEN: 'Pre-First Hand Latency', descTH: 'ความล่าช้าในการวางแผนก่อนวาดเข็มนาฬิกาเส้นแรก (Executive Dysfunction)', descEN: 'Planning delay before drawing the first clock hand (Executive Dysfunction)' },
]

// ── Education label helper ────────────────────────────────────────────────────
const EDU_LABELS: Record<string, { th: string; en: string }> = {
  '0':  { th: 'ไม่ได้เรียน',        en: 'No Formal Education'   },
  '4':  { th: 'ประถมต้น (ป.4)',      en: 'Primary (Grade 4)'     },
  '6':  { th: 'ประถมปลาย (ป.6)',     en: 'Primary (Grade 6)'     },
  '9':  { th: 'มัธยมต้น (ม.3)',      en: 'Junior High (Grade 9)' },
  '12': { th: 'มัธยมปลาย (ม.6)',     en: 'Senior High (Grade 12)'},
  '14': { th: 'อนุปริญญา',           en: 'Associate Degree'      },
  '16': { th: 'ปริญญาตรี',           en: "Bachelor's Degree"     },
  '18': { th: 'ปริญญาโท/เอก',       en: "Master's / PhD"        },
}

const getRiskLevelConfig = (classId: string, lang: string) => {
  if (classId === 'C0') return {
    levelText: lang === 'th' ? 'ระดับปกติ (Normal)' : 'Normal Level',
    descText: lang === 'th' ? 'สุขภาพสมองและกล้ามเนื้ออยู่ในเกณฑ์ดี ไม่พบความเสี่ยงที่มีนัยสำคัญ แนะนำให้รักษาสุขภาพและตรวจเช็คประจำปี' : 'Brain and motor health are in good condition. No significant risk detected.',
    colorBg: 'bg-emerald-50', colorText: 'text-emerald-800', colorBorder: 'border-emerald-200',
    icon: <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
  }
  if (['C1', 'C2', 'C4'].includes(classId)) return {
    levelText: lang === 'th' ? 'ระดับเฝ้าระวัง (Warning)' : 'Mild Risk / Warning',
    descText: lang === 'th' ? 'พบความเสี่ยงระดับเริ่มต้น หรือความผิดปกติเฉพาะส่วน แนะนำให้สังเกตอาการใกล้ชิด' : 'Mild risk or specific anomalies detected. Close monitoring recommended.',
    colorBg: 'bg-amber-50', colorText: 'text-amber-800', colorBorder: 'border-amber-200',
    icon: <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
  }
  return {
    levelText: lang === 'th' ? 'ระดับความเสี่ยงสูง (High Risk)' : 'High Risk',
    descText: lang === 'th' ? 'พบความเสี่ยงสูง รูปวาดมีความผิดเพี้ยนร่วมกับกระบวนการคิดหรือการควบคุมร่างกายที่บกพร่อง แนะนำให้พบแพทย์ผู้เชี่ยวชาญ' : 'High risk detected. Structural anomalies combined with cognitive impairment. Please consult a doctor.',
    colorBg: 'bg-red-50', colorText: 'text-red-800', colorBorder: 'border-red-200',
    icon: <AlertOctagon className="w-12 h-12 text-red-500 mb-3" />
  }
}

// ── Normalise risk_level for storage ─────────────────────────────────────────
function toStoredRiskLevel(raw: string | undefined): 'normal' | 'mild' | 'high' {
  if (raw === 'mild') return 'mild'
  if (raw === 'high') return 'high'
  return 'normal'
}

// -----------------------------------------------------------------------------
// SparkLine
// -----------------------------------------------------------------------------

function SparkLine({ points }: { points: number[] }) {
  if (!points || points.length === 0) return null
  const W = 300, H = 80, pad = 8
  const chartW = W - pad * 2, chartH = H - pad * 2
  const min = Math.min(...points), max = Math.max(...points), range = max - min || 1
  const normalizedPoints = points.map(p => (p - min) / range)
  const getX = (i: number, len: number) => len === 1 ? pad + chartW / 2 : pad + (i / (len - 1)) * chartW
  const path = normalizedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i, normalizedPoints.length)} ${pad + (1 - p) * chartH}`).join(' ')
  const area = normalizedPoints.length > 1
    ? `${path} L ${pad + chartW} ${pad + chartH} L ${pad} ${pad + chartH} Z` : ''
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[100px]">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={area} fill="url(#spark-fill)" />}
      {normalizedPoints.length > 1 && <path d={path} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}
      {normalizedPoints.map((p, i) => (
        <circle key={i} cx={getX(i, normalizedPoints.length)} cy={pad + (1 - p) * chartH} r={3} fill="#fff" stroke="#3b82f6" strokeWidth={2} />
      ))}
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function SectionHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-5">
      <h2 className="text-lg font-bold text-gray-900">{label}</h2>
      {sub && <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{sub}</span>}
    </div>
  )
}

function StatusPill({ pass, passLabel, failLabel }: { pass: boolean; passLabel: string; failLabel: string }) {
  return pass ? (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
      <CheckCircle2 className="w-3 h-3" /> {passLabel}
    </span>
  ) : (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
      <AlertTriangle className="w-3 h-3" /> {failLabel}
    </span>
  )
}

function KRuleRow({ rule, lang }: { rule: typeof K_RULES_BASE[0] & { detected: boolean }; lang: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-xl border-2 transition-all duration-200 ${rule.detected ? 'border-amber-200 bg-amber-50/40' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
      <button className="w-full flex items-center p-3.5 cursor-pointer focus:outline-none" onClick={() => setOpen(v => !v)}>
        <span className={`flex items-center justify-center w-9 h-9 rounded-lg font-black text-xs mr-3 flex-shrink-0 ${rule.detected ? 'bg-white text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
          {rule.id}
        </span>
        <span className="flex-1 text-[0.875rem] font-bold text-gray-800 text-left">{lang === 'th' ? rule.nameTH : rule.nameEN}</span>
        {rule.detected
          ? <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full flex-shrink-0 mr-2">Detected</span>
          : <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex-shrink-0 mr-2">Normal</span>
        }
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="text-[0.8125rem] text-gray-500 leading-relaxed pl-12">{lang === 'th' ? rule.descTH : rule.descEN}</p>
        </div>
      )}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-7 ${className}`}>
      {children}
    </div>
  )
}

function DomainHeader({ icon, title, subtitle, pass, passLabel, failLabel }: {
  icon: React.ReactNode; title: string; subtitle: string;
  pass: boolean; passLabel: string; failLabel: string
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">{icon}</div>
        <div>
          <h2 className="text-[0.9375rem] font-bold text-gray-900">{title}</h2>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <StatusPill pass={pass} passLabel={passLabel} failLabel={failLabel} />
    </div>
  )
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function ReportScreen() {
  const {
    t, language, setCurrentScreen, getTCT, resetRestartCount,
    analysisData: rawAnalysisData,
    alias, age, education,
    rawStrokes, originalImageB64, deviceDPI,
  } = useApp()

  const analysisData = rawAnalysisData as AnalysisResponse | undefined | null
  const classId  = analysisData?.class_id || 'C0'
  const RESULT   = C_LEVELS.find(c => c.level === classId) || C_LEVELS[0]

  const domain = analysisData?.domain || {
    k1_triggered: false, k2_triggered: false, k3_triggered: false,
    k4_triggered: false, k5_triggered: false,
    motor_abnormal: false, cognitive_abnormal: false, ai_abnormal: false
  }

  const dynamicKRules = K_RULES_BASE.map(rule => ({
    ...rule,
    detected: rule.id === 'K1' ? domain.k1_triggered
      : rule.id === 'K2' ? domain.k2_triggered
      : rule.id === 'K3' ? domain.k3_triggered
      : rule.id === 'K4' ? domain.k4_triggered
      : domain.k5_triggered
  }))

  const motorAbnormal     = domain.motor_abnormal
  const cognitiveAbnormal = domain.cognitive_abnormal
  const totalTime   = getTCT() || 45
  const thinkPercent = analysisData?.kinematic?.K4_pct_think_time || 65
  const inkPercent  = 100 - thinkPercent
  const thinkSec    = Math.round((thinkPercent / 100) * totalTime)
  const inkSec      = totalTime - thinkSec
  const TIMELINE    = analysisData?.velocity_profile || []
  const riskColor   = RESULT.color
  const lang        = language

  const handleReturnHome = () => { resetRestartCount(); setCurrentScreen('welcome') }

  const riskConfig     = getRiskLevelConfig(RESULT.level, lang)
  const motorRules     = dynamicKRules.filter(k => k.domain === 'motor')
  const cognitiveRules = dynamicKRules.filter(k => k.domain === 'cognitive')

  // ── Auto-save to Supabase once on mount (when analysisData is available) ──
  const savedRef = useRef(false)
  useEffect(() => {
    if (savedRef.current) return
    if (!analysisData) return
    // Guard: never re-save a record that was loaded from history
    if ((analysisData as any).is_history) return
    savedRef.current = true
    saveRecord({
      alias:               alias || 'Unknown',
      age:                 parseInt(age || '0', 10),
      education:           parseInt(education || '0', 10),
      class_id:            analysisData.class_id,
      risk_level:          toStoredRiskLevel(analysisData.risk_level),
      risk_color:          analysisData.risk_color,
      ai_confidence:       analysisData.ai_confidence ?? 0,
      device_dpi:          deviceDPI,
      kinematic:           analysisData.kinematic,
      domain:              analysisData.domain,
      warnings:            analysisData.warnings,
      rawStrokes:          rawStrokes,
      processed_image_b64: analysisData.processed_image_b64,
      xai_evidence_b64:    analysisData.xai_evidence_b64,
      original_image_b64:  originalImageB64,
      velocity_profile:    analysisData.velocity_profile || null,
      total_time_seconds:  getTCT() || 0,
    })
  }, [analysisData, alias, age, education, rawStrokes, originalImageB64, deviceDPI])

  return (
    <div className="w-full bg-slate-50 min-h-full pb-12">
      <div className="max-w-7xl mx-auto px-4 py-7 md:px-7 md:py-9">

        {/* Education warning */}
        {analysisData?.warnings?.includes('EDUCATION_BIAS_WARNING') && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 text-sm">
                {lang === 'th' ? '⚠️ ตรวจพบความเสี่ยงอคติจากการศึกษา' : '⚠️ Education Bias Risk Detected'}
              </h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                {lang === 'th'
                  ? 'ผู้ป่วยมีการศึกษาน้อยกว่า 8 ปี การประเมินผลนี้อาจมี False Positive แพทย์ควรพิจารณาปัจจัยแวดล้อมอื่นประกอบ'
                  : 'Patient has < 8 years of education. Results may contain false positives. Clinical correlation required.'}
              </p>
            </div>
          </div>
        )}

        {/* Page header */}
        <div className="flex items-center justify-between mb-7 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.1em] uppercase text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {lang === 'th' ? 'รายงานผลการประเมิน' : 'Assessment Report'} · dCDT
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {lang === 'th' ? 'ผลการวิเคราะห์ภาวะรู้คิด' : 'Cognitive Assessment Results'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('downloadPdfReport')}</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button onClick={handleReturnHome} className="flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('returnHome')}</span>
              <span className="sm:hidden">{lang === 'th' ? 'หน้าหลัก' : 'Home'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* ── Test Subject Info card (NEW) ───────────────────────────────── */}
            <Card>
              <SectionHeader
                label={lang === 'th' ? 'ข้อมูลผู้รับการประเมิน' : 'Test Subject Info'}
                sub="Demographics"
              />
              <div className="flex flex-col gap-3">
                {/* Alias / Nickname */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Hash className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      {lang === 'th' ? 'ชื่อแทน / Alias' : 'Alias / Nickname'}
                    </p>
                    <p className="text-[0.9375rem] font-black text-gray-900 truncate">
                      {alias || '—'}
                    </p>
                  </div>
                </div>

                {/* Age */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      {lang === 'th' ? 'อายุ' : 'Age'}
                    </p>
                    <p className="text-[0.9375rem] font-black text-gray-900">
                      {age ? `${age} ${lang === 'th' ? 'ปี' : 'yrs'}` : '—'}
                    </p>
                  </div>
                </div>

                {/* Education */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 text-teal-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      {lang === 'th' ? 'การศึกษา' : 'Education'}
                    </p>
                    <p className="text-[0.9375rem] font-black text-gray-900 truncate">
                      {EDU_LABELS[education]?.[lang === 'th' ? 'th' : 'en'] ?? (education ? `${education} yrs` : '—')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Risk level card */}
            <Card>
              <SectionHeader label={lang === 'th' ? 'ระดับความเสี่ยง' : 'Risk Level'} sub="Classification" />
              <div className={`rounded-2xl p-6 border-2 flex flex-col items-center text-center ${riskConfig.colorBg} ${riskConfig.colorBorder}`}>
                {riskConfig.icon}
                <h2 className={`text-xl font-black mb-2 ${riskConfig.colorText}`}>{riskConfig.levelText}</h2>
                <p className={`text-[0.8125rem] font-medium leading-relaxed opacity-90 ${riskConfig.colorText}`}>{riskConfig.descText}</p>
              </div>

              <div className="my-6 border-t border-slate-100" />

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                {lang === 'th' ? 'รายละเอียดกลุ่มอาการ (C-Series)' : 'Clinical Details'}
              </p>
              <div className="rounded-xl p-4 mb-3 border-l-4 bg-white border border-slate-100" style={{ borderLeftColor: riskColor }}>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-xl font-black" style={{ color: riskColor }}>{RESULT.level}</span>
                  <span className="text-[0.875rem] font-bold text-gray-900">{lang === 'th' ? RESULT.titleTH : RESULT.titleEN}</span>
                </div>
                <p className="text-[0.8125rem] text-gray-500 leading-relaxed">{lang === 'th' ? RESULT.clinicalTH : RESULT.clinicalEN}</p>
              </div>
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-[0.8125rem] text-gray-500 leading-relaxed">
                  <span className="font-bold text-gray-900">{lang === 'th' ? 'ข้อแนะนำ: ' : 'Action: '}</span>
                  {lang === 'th' ? RESULT.actionTH : RESULT.actionEN}
                </p>
              </div>

              {/* C-level grid */}
              <div className="mt-5 grid grid-cols-4 gap-1.5">
                {C_LEVELS.map(c => (
                  <div
                    key={c.level}
                    className={`rounded-xl py-2 text-center transition-all duration-200 ${c.level === RESULT.level ? 'border-2 shadow-sm scale-[1.04]' : 'border border-slate-100 bg-slate-50/50 opacity-40'}`}
                    style={{
                      borderColor: c.level === RESULT.level ? c.color : undefined,
                      backgroundColor: c.level === RESULT.level ? `${c.color}18` : undefined
                    }}
                  >
                    <p className="text-[10px] font-black" style={{ color: c.level === RESULT.level ? c.color : '#9ca3af' }}>{c.level}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Total time card */}
            <Card>
              <SectionHeader label={lang === 'th' ? 'เวลาที่ใช้ทั้งหมด' : 'Total Completion Time'} />
              <div className="flex items-end gap-1.5 mb-1.5">
                <span className="text-5xl font-black text-gray-900 leading-none">{totalTime}</span>
                <span className="text-xl font-bold text-slate-400 mb-1">s</span>
              </div>
              <p className="text-[0.8125rem] text-slate-400 mb-5 font-medium leading-relaxed">
                {lang === 'th' ? 'เวลาตั้งแต่เริ่มอ่านคำสั่งจนวาดเข็มนาฬิกาเสร็จสิ้น' : 'Time from reading instructions to completing the clock hands'}
              </p>
              <div className="w-full h-3 rounded-full overflow-hidden bg-slate-100 mb-4 flex">
                <div className="h-full rounded-l-full bg-blue-300" style={{ width: `${thinkPercent}%` }} />
                <div className="h-full rounded-r-full flex-1 bg-blue-600" />
              </div>
              <div className="flex gap-5">
                {[
                  { color: 'bg-blue-300', label: lang === 'th' ? 'เวลาที่ใช้คิด' : 'Thinking Time', pct: thinkPercent, sec: thinkSec },
                  { color: 'bg-blue-600', label: lang === 'th' ? 'เวลาลากเส้น'  : 'Inking Time',   pct: inkPercent,   sec: inkSec  },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <div>
                      <p className="text-xs font-bold text-gray-700">{item.label}</p>
                      <p className="text-[10px] font-semibold text-slate-400">{Math.round(item.pct)}% · {item.sec}s</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-8 flex flex-col gap-5">

            {/* AI Analysis card */}
            <Card>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-[0.9375rem] font-bold text-gray-900">{lang === 'th' ? 'ผลการวิเคราะห์โดย AI' : 'AI Analysis'}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ViT-B/16 Engine</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className={`text-[10px] font-black ${(analysisData?.ai_confidence ?? 0) > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {analysisData?.ai_confidence?.toFixed(1)}% {lang === 'th' ? 'ความมั่นใจ' : 'Confidence'}
                      </span>
                    </div>
                  </div>
                </div>
                <StatusPill pass={!domain.ai_abnormal} passLabel={lang === 'th' ? 'ปกติ' : 'Normal'} failLabel={lang === 'th' ? 'ผิดปกติ' : 'Dementia'} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: lang === 'th' ? 'ภาพที่ AI ใช้ประมวลผล' : 'Processed Input',   src: analysisData?.processed_image_b64, alt: 'Centered Input' },
                  { label: lang === 'th' ? 'จุดที่ AI ให้ความสำคัญ' : 'AI Attention Map', src: analysisData?.xai_evidence_b64,   alt: 'AI Heatmap'     },
                ].map(view => (
                  <div key={view.label} className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{view.label}</span>
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                      {view.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={view.src.startsWith('data:') ? view.src : `data:image/png;base64,${view.src}`}
                          className="w-full h-full object-contain" alt={view.alt}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 text-xs italic">No Image</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-center border-t border-slate-100 pt-5">
                <button className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-slate-50 border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all group">
                  <Zap className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[0.875rem] font-bold text-gray-700">
                    {lang === 'th' ? 'ดูวิดีโอลำดับการวาด (Replay)' : 'Replay Drawing Order'}
                  </span>
                </button>
                <p className="text-[10px] font-medium text-slate-400 mt-2.5 text-center max-w-xs leading-relaxed">
                  * {lang === 'th' ? 'ลำดับการวาดช่วยให้แพทย์วินิจฉัยกระบวนการวางแผน (Executive Function) ได้ชัดเจนขึ้น' : 'Replaying the sequence helps clinical observation of executive planning.'}
                </p>
              </div>
            </Card>

            {/* Motor Domain card */}
            <Card>
              <DomainHeader
                icon={<Activity className="w-6 h-6 text-blue-500" />}
                title={lang === 'th' ? 'การควบคุมร่างกาย (Motor Domain)' : 'Physical Control (Motor)'}
                subtitle={lang === 'th' ? 'OR Logic: K1-K3 — พบความผิดปกติ 1 ข้อ = ผิดปกติ' : 'OR Logic: Any positive K1-K3 = Abnormal'}
                pass={!motorAbnormal}
                passLabel={lang === 'th' ? 'ปกติ' : 'Normal'}
                failLabel={lang === 'th' ? 'ผิดปกติ' : 'Abnormal'}
              />
              <div className="flex flex-col gap-2.5">
                {motorRules.map(rule => <KRuleRow key={rule.id} rule={rule} lang={lang} />)}
              </div>
            </Card>

            {/* Cognitive Domain card */}
            <Card>
              <DomainHeader
                icon={<Zap className="w-6 h-6 text-blue-500" />}
                title={lang === 'th' ? 'กระบวนการรู้คิด (Cognitive Domain)' : 'Cognitive Process'}
                subtitle={lang === 'th' ? 'OR Logic: K4-K5 — พบความผิดปกติ 1 ข้อ = ผิดปกติ' : 'OR Logic: Any positive K4-K5 = Abnormal'}
                pass={!cognitiveAbnormal}
                passLabel={lang === 'th' ? 'ปกติ' : 'Normal'}
                failLabel={lang === 'th' ? 'ผิดปกติ' : 'Abnormal'}
              />
              <div className="flex flex-col gap-2.5">
                {cognitiveRules.map(rule => <KRuleRow key={rule.id} rule={rule} lang={lang} />)}
              </div>
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 mt-5">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-[0.8125rem] text-gray-500 leading-relaxed">
                  <span className="font-bold text-gray-900">%ThinkTime = {Math.round(thinkPercent)}%</span>{' — '}
                  {lang === 'th'
                    ? 'สัดส่วนเวลาที่หยุดคิดเพื่อดึงข้อมูลจากความจำ ค่าสูงบ่งชี้ภาวะ Memory Retrieval Deficit'
                    : 'Proportion of time paused to retrieve information from memory. High values indicate Memory Retrieval Deficit.'}
                </p>
              </div>
            </Card>

            {/* Velocity Profile card */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                  <h2 className="text-[0.9375rem] font-bold text-gray-900">
                    {lang === 'th' ? 'ลำดับและความเร็วของการลากเส้น' : 'Velocity Profile'}
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  {TIMELINE.length} strokes
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <SparkLine points={TIMELINE.length > 0 ? TIMELINE : [0, 0]} />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{lang === 'th' ? 'เริ่มต้น' : 'Start'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{lang === 'th' ? 'สิ้นสุด' : 'End'}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { label: lang === 'th' ? 'เวลารวม'  : 'Total Time',  value: `${totalTime}s`, sub: lang === 'th' ? 'ทั้งหมด' : 'overall' },
                  { label: lang === 'th' ? 'เวลาคิด'  : 'Think Time',  value: `${thinkSec}s`,  sub: `${Math.round(thinkPercent)}%` },
                  { label: lang === 'th' ? 'เวลาลากเส้น' : 'Ink Time', value: `${inkSec}s`,    sub: `${Math.round(inkPercent)}%`  },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3.5 text-center border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">{s.label}</p>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="mt-8 flex items-start gap-2.5 px-2">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-[0.8125rem] text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-500">{lang === 'th' ? 'ข้อจำกัดความรับผิดชอบ: ' : 'Disclaimer: '}</span>
            {t('disclaimer')}
          </p>
        </div>

      </div>
    </div>
  )
}