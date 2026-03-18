"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import {
  Home, Download, CheckCircle2, AlertTriangle,
  Brain, Activity, Zap, Eye, EyeOff,
  ChevronDown, Info, TrendingUp
} from 'lucide-react'

// ─── Clinical Data ─────────────────────────────────────────────────────────────

const C_LEVELS = [
  { level: 'C0', labelKey: 'c0Label' as const, bhi: 92, risk: 'none', color: '#059669', ai: 'Normal', motor: 'Normal', cognitive: 'Normal', clinicalTH: 'ปกติสมบูรณ์: ไม่พบความผิดปกติทั้งด้านโครงสร้างรูปวาดและกระบวนการวาด', clinicalEN: 'Fully Normal: No structural or process abnormalities detected.', actionTH: 'แนะนำให้รักษาสุขภาพและตรวจเช็คประจำปี', actionEN: 'Maintain healthy habits and schedule annual screening.' },
  { level: 'C1', labelKey: 'c1Label' as const, bhi: 78, risk: 'low', color: '#65a30d', ai: 'Normal', motor: 'Abnormal', cognitive: 'Normal', clinicalTH: 'ความเสี่ยงทางกายภาพ: วาดรูปได้ถูกต้อง แต่พบความผิดปกติของการควบคุมกล้ามเนื้อ (อาการสั่น) โดยไม่มีภาวะความจำเสื่อมร่วมด้วย', clinicalEN: 'Pure Physical Risk: Correct drawing but motor control abnormalities (e.g., tremor) without cognitive impairment.', actionTH: 'อาจบ่งชี้โรคพาร์กินสันระยะเริ่มต้น แนะนำให้ปรึกษาแพทย์', actionEN: 'May indicate early-stage Parkinson\'s. Consult a physician.' },
  { level: 'C2', labelKey: 'c2Label' as const, bhi: 63, risk: 'moderate', color: '#ca8a04', ai: 'Normal', motor: 'Normal', cognitive: 'Abnormal', clinicalTH: 'สัญญาณเตือนระยะแรกเริ่ม (Critical): วาดรูปได้ถูกต้อง แต่กระบวนการคิดผิดปกติ — บ่งชี้ภาวะ MCI ที่การตรวจดั้งเดิมอาจมองข้าม', clinicalEN: 'Early Cognitive Sign (Critical Detection): Correct drawing but abnormal cognitive process, suggesting MCI traditional tests may miss.', actionTH: 'กลุ่มเป้าหมายสำคัญ — ควรติดตามผลอย่างใกล้ชิดและส่งพบแพทย์', actionEN: 'Critical Detection group — close follow-up and specialist referral strongly recommended.' },
  { level: 'C3', labelKey: 'c3Label' as const, bhi: 51, risk: 'moderate', color: '#d97706', ai: 'Normal', motor: 'Abnormal', cognitive: 'Abnormal', clinicalTH: 'ความเสี่ยงผสม: พบความผิดปกติทั้งร่างกายและความคิด แม้รูปวาดยังดูปกติ', clinicalEN: 'Mixed Risk / Non-Dementia: Both motor and cognitive abnormalities despite visually normal drawing.', actionTH: 'จำเป็นต้องส่งต่อแพทย์เพื่อวินิจฉัยแยกโรค', actionEN: 'Specialist referral required for differential diagnosis.' },
  { level: 'C4', labelKey: 'c4Label' as const, bhi: 38, risk: 'high', color: '#ea580c', ai: 'Dementia', motor: 'Normal', cognitive: 'Normal', clinicalTH: 'ความผิดปกติทางทักษะ / False Alarm: AI ตรวจพบรูปวาดผิดเพี้ยน แต่กระบวนการคิดและร่างกายปกติ', clinicalEN: 'Visual Anomaly / False Alarm: AI detected drawing anomalies but cognitive and motor processes are normal.', actionTH: 'ใช้ biomarkers เพื่อกรอง false positives จาก AI', actionEN: 'Use process biomarkers to filter AI false positives.' },
  { level: 'C5', labelKey: 'c5Label' as const, bhi: 24, risk: 'high', color: '#dc2626', ai: 'Dementia', motor: 'Normal', cognitive: 'Abnormal', clinicalTH: 'อัลไซเมอร์ระยะต้น: รูปวาดผิดเพี้ยนร่วมกับกระบวนการคิดที่ล่าช้า — รูปแบบที่ชัดเจนที่สุดของภาวะสมองเสื่อม', clinicalEN: 'Typical Alzheimer\'s Pattern: Abnormal drawing combined with delayed cognitive process — clearest pattern of dementia.', actionTH: 'แนะนำให้พบแพทย์ผู้เชี่ยวชาญโดยด่วน', actionEN: 'Urgent specialist referral recommended.' },
  { level: 'C6', labelKey: 'c6Label' as const, bhi: 12, risk: 'critical', color: '#b91c1c', ai: 'Dementia', motor: 'Abnormal', cognitive: 'Normal', clinicalTH: 'ภาวะสมองเสื่อมร่วมกับโรคทางกาย: รูปวาดผิดเพี้ยนและควบคุมกล้ามเนื้อไม่ได้ อาจบ่งชี้ Parkinson\'s Disease Dementia (PDD)', clinicalEN: 'Motor-Dominant Dementia: Abnormal drawing and motor control loss, potentially indicating PDD.', actionTH: 'ควรรีบพบแพทย์เพื่อประเมินเพิ่มเติม', actionEN: 'Seek medical evaluation promptly.' },
  { level: 'C7', labelKey: 'c7Label' as const, bhi: 4, risk: 'critical', color: '#7f1d1d', ai: 'Dementia', motor: 'Abnormal', cognitive: 'Abnormal', clinicalTH: 'ภาวะถดถอยรุนแรง: พบความผิดปกติในทุกมิติ — รูปวาด การเคลื่อนไหว และความคิด บ่งชี้ภาวะสมองเสื่อมระยะลุกลาม', clinicalEN: 'Severe / Global Impairment: Abnormalities across all dimensions consistent with advanced dementia.', actionTH: 'ต้องการการดูแลจากแพทย์ผู้เชี่ยวชาญอย่างเร่งด่วน', actionEN: 'Requires urgent specialist care.' },
]

const K_RULES = [
  { id: 'K1', domain: 'motor' as const, nameTH: 'อาการสั่น (Tremor)', nameEN: 'Tremor', descTH: 'ความไม่ราบรื่นของการเคลื่อนไหวจากการควบคุมกล้ามเนื้อ (Parkinsonian Tremor)', descEN: 'Movement irregularity due to impaired muscle control (Parkinsonian Tremor)', detected: false },
  { id: 'K2', domain: 'motor' as const, nameTH: 'เคลื่อนไหวช้า (Bradykinesia)', nameEN: 'Bradykinesia', descTH: 'ความเร็วเฉลี่ยของปากกาต่ำกว่าเกณฑ์ปกติ', descEN: 'Average pen velocity below normal threshold', detected: true },
  { id: 'K3', domain: 'motor' as const, nameTH: 'เขียนเล็ก/เบา (Micrographia)', nameEN: 'Micrographia', descTH: 'ภาวะเขียนตัวเล็กผิดปกติหรือแรงกดปากกาแผ่วเบา', descEN: 'Abnormally small writing or very light pen pressure', detected: false },
  { id: 'K4', domain: 'cognitive' as const, nameTH: 'ความลังเล (Hesitation)', nameEN: 'Hesitation', descTH: 'สัดส่วนเวลาที่หยุดคิดเพื่อดึงข้อมูลจากความจำ (%ThinkTime)', descEN: 'Memory retrieval deficit assessed via % Think Time', detected: true },
  { id: 'K5', domain: 'cognitive' as const, nameTH: 'ความหน่วงก่อนวาดเข็ม (Pre-First Hand Latency)', nameEN: 'Pre-First Hand Latency', descTH: 'ความล่าช้าในการวางแผนก่อนวาดเข็มนาฬิกาเส้นแรก (Executive Dysfunction)', descEN: 'Planning delay before drawing the first clock hand (Executive Dysfunction)', detected: false },
]

const RESULT_INDEX = 1
const RESULT = C_LEVELS[RESULT_INDEX]

// จำลองข้อมูลความเร็วแบบสมจริง (Real-world scale data, ไม่ใช่ 0-1)
const TIMELINE = [15, 45, 60, 80, 55, 90, 70, 85, 60, 40, 75, 50, 30, 20]

const motorAbnormal = K_RULES.filter(k => k.domain === 'motor').some(k => k.detected)
const cognitiveAbnormal = K_RULES.filter(k => k.domain === 'cognitive').some(k => k.detected)

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">{label}</h2>
      {sub && <span className="text-[11px] font-semibold text-gray-400/70">{sub}</span>}
    </div>
  )
}

function StatusPill({ pass, passLabel, failLabel }: { pass: boolean; passLabel: string; failLabel: string }) {
  return pass ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
      <CheckCircle2 className="w-3.5 h-3.5" /> {passLabel}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
      <AlertTriangle className="w-3.5 h-3.5" /> {failLabel}
    </span>
  )
}

function BHIArc({ value, color }: { value: number; color: string }) {
  const r = 60
  const cx = 70
  const cy = 70
  const pct = Math.max(0, Math.min(100, value)) / 100
  const perimeter = Math.PI * r
  const dashOffset = perimeter * (1 - pct)

  return (
    <div className="relative w-56 mx-auto mt-4 mb-4">
      <svg viewBox="0 0 140 85" className="w-full overflow-visible">
        {/* Track */}
        <path 
          d="M 10 70 A 60 60 0 0 1 130 70" 
          fill="none" 
          stroke="#f3f4f6" 
          strokeWidth={14} 
          strokeLinecap="round" 
        />
        {/* Value arc */}
        <path 
          d="M 10 70 A 60 60 0 0 1 130 70" 
          fill="none" 
          stroke={color} 
          strokeWidth={14} 
          strokeLinecap="round" 
          strokeDasharray={perimeter} 
          strokeDashoffset={dashOffset} 
          style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 4px 8px ${color}30)` }} 
        />
        {/* Score */}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="36" fontWeight="900" fill="#111827">{value}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="700">/ 100</text>
        {/* Min/Max labels */}
        <text x="10" y="86" fontSize="11" fill="#d1d5db" fontWeight="700" textAnchor="middle">0</text>
        <text x="130" y="86" fontSize="11" fill="#d1d5db" fontWeight="700" textAnchor="middle">100</text>
      </svg>
    </div>
  )
}

// ── แก้ไข SparkLine รองรับ Data จริงและไม่บีบเบี้ยว ──
function SparkLine({ points }: { points: number[] }) {
  if (!points || points.length === 0) return null;

  const W = 300, H = 80, pad = 8;
  const chartW = W - pad * 2;
  const chartH = H - pad * 2;

  // Dynamic Normalization: หาค่า Min / Max ของข้อมูลจริง
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1; // ป้องกันการหารด้วย 0

  // ปรับให้ข้อมูลทุกช่วงสเกลกลายเป็น 0 ถึง 1 เพื่อใช้วาดกราฟ
  const normalizedPoints = points.map(p => (p - min) / range);

  const path = normalizedPoints
    .map((p, i) => {
      const x = pad + (i / (normalizedPoints.length - 1)) * chartW;
      const y = pad + (1 - p) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const area = `${path} L ${pad + chartW} ${pad + chartH} L ${pad} ${pad + chartH} Z`;

  return (
    // เอา preserveAspectRatio="none" ออก เพื่อไม่ให้วงกลมถูกบีบเป็นวงรี และปรับให้แสดงผลสมส่วนเสมอ
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[100px] drop-shadow-sm">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {normalizedPoints.map((p, i) => {
        const x = pad + (i / (normalizedPoints.length - 1)) * chartW;
        const y = pad + (1 - p) * chartH;
        return (
          <circle key={i} cx={x} cy={y} r={3.5} fill="#ffffff" stroke="#3b82f6" strokeWidth={2} />
        );
      })}
    </svg>
  )
}

function AIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute border-2 border-red-400/80 bg-red-400/10 rounded-2xl shadow-sm"
        style={{ top: '18%', left: '55%', width: '22%', height: '18%' }}>
        <span className="absolute -top-5 left-0 text-[10px] font-bold text-red-600 bg-white/95 px-2 py-0.5 rounded-lg shadow-sm border border-red-100">
          Digits
        </span>
      </div>
      <div className="absolute border-2 border-amber-400/80 bg-amber-400/10 rounded-full shadow-sm"
        style={{ top: '38%', left: '38%', width: '24%', height: '24%' }}>
        <span className="absolute -bottom-5 left-0 text-[10px] font-bold text-amber-700 bg-white/95 px-2 py-0.5 rounded-lg shadow-sm border border-amber-100">
          Hands
        </span>
      </div>
    </div>
  )
}

function KRuleRow({ rule, lang }: { rule: typeof K_RULES[0]; lang: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-2xl border-2 transition-all duration-200 ${rule.detected ? 'border-amber-200 bg-amber-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}>
      <button
        className="w-full flex items-center gap-4 px-4 py-3.5 text-left outline-none"
        onClick={() => setOpen(v => !v)}
      >
        <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm transition-colors ${
          rule.detected ? 'bg-white text-amber-600 border border-amber-100' : 'bg-gray-50 text-gray-500 border border-gray-200'
        }`}>
          {rule.id}
        </span>
        <span className="flex-1 text-sm md:text-base font-bold text-gray-800">
          {lang === 'th' ? rule.nameTH : rule.nameEN}
        </span>
        {rule.detected
          ? <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full flex-shrink-0">Detected</span>
          : <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex-shrink-0">Normal</span>
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function ReportScreen() {
  const { t, language, setCurrentScreen, restartCount, getTCT, resetRestartCount } = useApp()
  const [showAIOverlay, setShowAIOverlay] = useState(false)

  const totalTime = getTCT() || 45
  const thinkSec = Math.round(totalTime * 0.65)
  const inkSec = Math.round(totalTime * 0.35)
  const riskColor = RESULT.color
  const lang = language

  const handleReturnHome = () => {
    resetRestartCount()
    setCurrentScreen('tutorial')
  }

  const bhiStatus = RESULT.bhi >= 80
    ? { label: lang === 'th' ? 'สุขภาพสมองดี' : 'Good Brain Health', color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200' }
    : RESULT.bhi >= 50
    ? { label: lang === 'th' ? 'พบความเสี่ยงระดับเริ่มต้น' : 'Mild Risk Detected', color: '#ca8a04', bg: 'bg-amber-50', border: 'border-amber-200' }
    : { label: lang === 'th' ? 'พบความเสี่ยงสูง' : 'High Risk Detected', color: '#dc2626', bg: 'bg-red-50', border: 'border-red-200' }

  const motorRules = K_RULES.filter(k => k.domain === 'motor')
  const cognitiveRules = K_RULES.filter(k => k.domain === 'cognitive')

  return (
    <div className="w-full bg-slate-50 min-h-full pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-10">

        {/* ══ Page Header ══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {lang === 'th' ? 'รายงานผลการประเมิน' : 'Assessment Report'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="text-xs font-bold text-gray-400">dCDT</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              {lang === 'th' ? 'ผลการวิเคราะห์ภาวะรู้คิด' : 'Cognitive Assessment Results'}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 h-12 px-6 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('downloadPdfReport')}</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={handleReturnHome}
              className="flex items-center gap-2 h-12 px-6 rounded-2xl text-white text-sm font-bold shadow-md bg-blue-500 hover:bg-blue-600 transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('returnHome')}</span>
              <span className="sm:hidden">{lang === 'th' ? 'หน้าหลัก' : 'Home'}</span>
            </button>
          </div>
        </div>

        {/* ══ Main Grid ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── lg:4 */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">

            {/* BHI Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
              <SectionHeader label="Brain Health Index" sub="BHI" />
              <BHIArc value={RESULT.bhi} color={riskColor} />
              
              <div className={`mt-6 rounded-2xl p-5 border-2 shadow-sm ${bhiStatus.bg} ${bhiStatus.border}`}>
                <p className="text-base font-bold mb-1.5" style={{ color: bhiStatus.color }}>{bhiStatus.label}</p>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {RESULT.bhi >= 80
                    ? (lang === 'th' ? 'ไม่พบความเสี่ยงที่มีนัยสำคัญ แนะนำให้รักษาสุขภาพและตรวจเช็คประจำปี' : 'No significant risk. Maintain health and schedule annual check-ups.')
                    : RESULT.bhi >= 50
                    ? (lang === 'th' ? 'พบความผิดปกติบางประการ แนะนำให้ฝึกกิจกรรมบริหารสมองและสังเกตอาการอย่างใกล้ชิด' : 'Some irregularities detected. Brain exercises recommended; monitor closely.')
                    : (lang === 'th' ? 'รูปวาดมีความผิดเพี้ยนสูงหรือมีกระบวนการคิดที่บกพร่องชัดเจน แนะนำให้พบแพทย์โดยเร็ว' : 'Significant anomalies detected. Please consult a physician promptly.')}
                </p>
              </div>

              {/* Score weights */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: lang === 'th' ? 'โครงสร้าง' : 'Structure', pct: '60%', note: 'AI Weight' },
                  { label: lang === 'th' ? 'กายภาพ' : 'Motor', pct: '20%', note: 'K1–K3' },
                  { label: lang === 'th' ? 'ความคิด' : 'Cognitive', pct: '20%', note: 'K4–K5' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-2xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{s.label}</p>
                    <p className="text-lg font-black text-gray-900">{s.pct}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{s.note}</p>
                  </div>
                ))}
              </div>

              <div className="my-8 border-t-2 border-gray-100" />

              {/* Clinical Classification */}
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                {lang === 'th' ? 'ผลการจำแนกทางคลินิก' : 'Clinical Classification'}
              </p>

              <div
                className="rounded-2xl p-5 mb-4 border-l-4 shadow-sm"
                style={{ borderLeftColor: riskColor, backgroundColor: `${riskColor}08` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-black" style={{ color: riskColor }}>{RESULT.level}</span>
                  <span className="text-base font-bold text-gray-900">{t(RESULT.labelKey)}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {lang === 'th' ? RESULT.clinicalTH : RESULT.clinicalEN}
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-bold text-gray-900">{lang === 'th' ? 'ข้อแนะนำ: ' : 'Action: '}</span>
                  {lang === 'th' ? RESULT.actionTH : RESULT.actionEN}
                </p>
              </div>

              {/* C0-C7 Grid */}
              <div className="mt-6 grid grid-cols-4 gap-2">
                {C_LEVELS.map(c => (
                  <div
                    key={c.level}
                    className={`rounded-2xl py-2.5 text-center transition-all duration-300 ${c.level === RESULT.level ? 'border-2 shadow-md scale-[1.03]' : 'border border-gray-100 bg-gray-50/50 opacity-50'}`}
                    style={{
                      borderColor: c.level === RESULT.level ? c.color : '#f3f4f6',
                      backgroundColor: c.level === RESULT.level ? `${c.color}15` : '',
                    }}
                  >
                    <p className="text-xs font-black" style={{ color: c.level === RESULT.level ? c.color : '#9ca3af' }}>{c.level}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Stats Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
              <SectionHeader label={lang === 'th' ? 'เวลาที่ใช้ทั้งหมด' : 'Total Completion Time'} />

              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-black text-gray-900 leading-none">{totalTime}</span>
                <span className="text-xl font-bold text-gray-400 mb-1">s</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
                {lang === 'th'
                  ? 'เวลาตั้งแต่เริ่มอ่านคำสั่งจนวาดเข็มนาฬิกาเสร็จสิ้น'
                  : 'Time from reading instructions to completing the clock hands'}
              </p>

              {/* Bar */}
              <div className="w-full h-4 rounded-full overflow-hidden bg-gray-100 mb-4 flex shadow-inner">
                <div className="h-full rounded-l-full" style={{ width: '65%', backgroundColor: '#93c5fd' }} />
                <div className="h-full rounded-r-full flex-1" style={{ backgroundColor: '#3b82f6' }} />
              </div>
              
              <div className="flex gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: '#93c5fd' }} />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {lang === 'th' ? 'เวลาที่ใช้คิด' : 'Thinking Time'}
                    </p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">65% · {thinkSec}s</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: '#3b82f6' }} />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {lang === 'th' ? 'เวลาที่ใช้ลากเส้น' : 'Inking Time'}
                    </p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">35% · {inkSec}s</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t-2 border-gray-100 flex items-center gap-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{lang === 'th' ? 'รีสตาร์ท' : 'Restarts'}</p>
                  <p className="text-2xl font-black text-gray-900">{restartCount}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{lang === 'th' ? 'เส้นวาด' : 'Strokes'}</p>
                  <p className="text-2xl font-black text-gray-900">{TIMELINE.length}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ───────────────────────────────────────── lg:8 */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">

            {/* AI Vision Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b-2 border-gray-50 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                    <Brain className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {lang === 'th' ? 'โครงสร้าง (Structural)' : 'Structural Analysis'}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">Vision Transformer (ViT) Model</p>
                  </div>
                </div>
                <StatusPill
                  pass={RESULT.ai === 'Normal'}
                  passLabel={lang === 'th' ? 'ปกติ' : 'Normal'}
                  failLabel={lang === 'th' ? 'ผิดปกติ' : 'Dementia'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 px-6 pt-6 bg-gray-50/30">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">{lang === 'th' ? 'ผลการทำนาย' : 'Prediction'}</p>
                  <p className="text-xl font-black text-gray-900">{RESULT.ai}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">{lang === 'th' ? 'ความมั่นใจ' : 'Model Confidence'}</p>
                  <p className="text-xl font-black text-gray-900">87%</p>
                </div>
              </div>

              <div className="px-6 py-8 flex-1 bg-gray-50/30">
                <div className="relative w-full max-w-sm mx-auto">
                  <button
                    onClick={() => setShowAIOverlay(v => !v)}
                    className={`absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-300 shadow-sm ${
                      showAIOverlay
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {showAIOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {lang === 'th' ? 'AI Overlay' : 'AI Overlay'}
                  </button>

                  <div className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-gray-100 bg-gray-100/50 shadow-inner">
                    <div className="absolute inset-4 flex items-center justify-center bg-white rounded-[1.5rem] shadow-sm">
                      <svg viewBox="0 0 200 200" className="w-full h-full opacity-[0.25]">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#111827" strokeWidth="4"/>
                        {[12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
                          const a = (i * 30 - 90) * Math.PI / 180
                          return <text key={n} x={100 + 72 * Math.cos(a)} y={100 + 72 * Math.sin(a)}
                            textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="700" fill="#111827">{n}</text>
                        })}
                        <line x1="100" y1="100" x2="65"  y2="55"  stroke="#111827" strokeWidth="6" strokeLinecap="round"/>
                        <line x1="100" y1="100" x2="148" y2="62"  stroke="#111827" strokeWidth="4" strokeLinecap="round"/>
                        <circle cx="100" cy="100" r="6" fill="#111827"/>
                      </svg>
                    </div>
                    {showAIOverlay && <div className="absolute inset-4"><AIOverlay /></div>}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-400 mt-6 text-center">
                  * GradCAM highlights regions the AI focused on during diagnosis
                </p>
              </div>
            </div>

            {/* Motor Domain */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                    <Activity className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {lang === 'th' ? 'การควบคุมร่างกาย (Motor Domain)' : 'Physical Control (Motor)'}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                      {lang === 'th' ? 'OR Logic: K1-K3 — พบความผิดปกติ 1 ข้อ = ผิดปกติ' : 'OR Logic: Any positive K1-K3 = Abnormal'}
                    </p>
                  </div>
                </div>
                <StatusPill pass={!motorAbnormal} passLabel={lang === 'th' ? 'ปกติ' : 'Normal'} failLabel={lang === 'th' ? 'ผิดปกติ' : 'Abnormal'} />
              </div>
              <div className="flex flex-col gap-3">
                {motorRules.map(rule => <KRuleRow key={rule.id} rule={rule} lang={lang} />)}
              </div>
            </div>

            {/* Cognitive Domain */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                    <Zap className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {lang === 'th' ? 'กระบวนการรู้คิด (Cognitive Domain)' : 'Cognitive Process'}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                      {lang === 'th' ? 'OR Logic: K4-K5 — พบความผิดปกติ 1 ข้อ = ผิดปกติ' : 'OR Logic: Any positive K4-K5 = Abnormal'}
                    </p>
                  </div>
                </div>
                <StatusPill pass={!cognitiveAbnormal} passLabel={lang === 'th' ? 'ปกติ' : 'Normal'} failLabel={lang === 'th' ? 'ผิดปกติ' : 'Abnormal'} />
              </div>
              <div className="flex flex-col gap-3">
                {cognitiveRules.map(rule => <KRuleRow key={rule.id} rule={rule} lang={lang} />)}
              </div>
              <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  <span className="font-bold text-gray-900">%ThinkTime = {Math.round((thinkSec / totalTime) * 100)}%</span>
                  {' — '}
                  {lang === 'th'
                    ? 'สัดส่วนเวลาที่หยุดคิดเพื่อดึงข้อมูลจากความจำ ค่าสูงบ่งชี้ภาวะ Memory Retrieval Deficit'
                    : 'Proportion of time paused to retrieve information from memory. High values indicate Memory Retrieval Deficit.'}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-7 h-7 text-blue-500" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {lang === 'th' ? 'ลำดับและความเร็วของการลากเส้น' : 'Velocity Profile'}
                  </h2>
                </div>
                <span className="text-sm font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl shadow-sm">{TIMELINE.length} strokes</span>
              </div>
              
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <SparkLine points={TIMELINE} />
                <div className="flex justify-between mt-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{lang === 'th' ? 'เริ่มต้น' : 'Start'}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{lang === 'th' ? 'สิ้นสุด' : 'End'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: lang === 'th' ? 'เวลารวม' : 'Total Time', value: `${totalTime}s`, sub: lang === 'th' ? 'ทั้งหมด' : 'overall' },
                  { label: lang === 'th' ? 'เวลาที่ใช้คิด' : 'Think Time', value: `${thinkSec}s`, sub: `65%` },
                  { label: lang === 'th' ? 'เวลาลากเส้น' : 'Ink Time', value: `${inkSec}s`, sub: `35%` },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">{s.label}</p>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══ Footer Disclaimer ════════════════════════════════════════════════ */}
        <div className="mt-10 pb-6 flex items-start gap-3 px-4">
          <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            <span className="font-bold text-gray-700">{lang === 'th' ? 'ข้อจำกัดความรับผิดชอบ: ' : 'Disclaimer: '}</span>
            {t('disclaimer')}
          </p>
        </div>

      </div>
    </div>
  )
}