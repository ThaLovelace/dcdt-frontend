"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import {
  Home, Download, CheckCircle2, AlertTriangle,
  Brain, Activity, Zap, Eye, EyeOff,
  ChevronDown, Info, TrendingUp
} from 'lucide-react'

// ─── Clinical Data ─────────────────────────────────────────────────────────────

// C0–C7 Classification Matrix — clinical identifiers, NOT translated
const C_LEVELS = [
  {
    level: 'C0', labelKey: 'c0Label' as const, bhi: 92, risk: 'none', color: '#059669',
    ai: 'Normal', motor: 'Normal', cognitive: 'Normal',
    clinicalTH: 'ปกติสมบูรณ์: ไม่พบความผิดปกติทั้งด้านโครงสร้างรูปวาดและกระบวนการวาด',
    clinicalEN: 'Fully Normal: No structural or process abnormalities detected.',
    actionTH: 'แนะนำให้รักษาสุขภาพและตรวจเช็คประจำปี',
    actionEN: 'Maintain healthy habits and schedule annual screening.',
  },
  {
    level: 'C1', labelKey: 'c1Label' as const, bhi: 78, risk: 'low', color: '#65a30d',
    ai: 'Normal', motor: 'Abnormal', cognitive: 'Normal',
    clinicalTH: 'ความเสี่ยงทางกายภาพ: วาดรูปได้ถูกต้อง แต่พบความผิดปกติของการควบคุมกล้ามเนื้อ (อาการสั่น) โดยไม่มีภาวะความจำเสื่อมร่วมด้วย',
    clinicalEN: 'Pure Physical Risk: Correct drawing but motor control abnormalities (e.g., tremor) without cognitive impairment.',
    actionTH: 'อาจบ่งชี้โรคพาร์กินสันระยะเริ่มต้น แนะนำให้ปรึกษาแพทย์',
    actionEN: 'May indicate early-stage Parkinson\'s. Consult a physician.',
  },
  {
    level: 'C2', labelKey: 'c2Label' as const, bhi: 63, risk: 'moderate', color: '#ca8a04',
    ai: 'Normal', motor: 'Normal', cognitive: 'Abnormal',
    clinicalTH: 'สัญญาณเตือนระยะแรกเริ่ม (Critical): วาดรูปได้ถูกต้อง แต่กระบวนการคิดผิดปกติ — บ่งชี้ภาวะ MCI ที่การตรวจดั้งเดิมอาจมองข้าม',
    clinicalEN: 'Early Cognitive Sign (Critical Detection): Correct drawing but abnormal cognitive process, suggesting MCI traditional tests may miss.',
    actionTH: 'กลุ่มเป้าหมายสำคัญ — ควรติดตามผลอย่างใกล้ชิดและส่งพบแพทย์',
    actionEN: 'Critical Detection group — close follow-up and specialist referral strongly recommended.',
  },
  {
    level: 'C3', labelKey: 'c3Label' as const, bhi: 51, risk: 'moderate', color: '#d97706',
    ai: 'Normal', motor: 'Abnormal', cognitive: 'Abnormal',
    clinicalTH: 'ความเสี่ยงผสม: พบความผิดปกติทั้งร่างกายและความคิด แม้รูปวาดยังดูปกติ',
    clinicalEN: 'Mixed Risk / Non-Dementia: Both motor and cognitive abnormalities despite visually normal drawing.',
    actionTH: 'จำเป็นต้องส่งต่อแพทย์เพื่อวินิจฉัยแยกโรค',
    actionEN: 'Specialist referral required for differential diagnosis.',
  },
  {
    level: 'C4', labelKey: 'c4Label' as const, bhi: 38, risk: 'high', color: '#ea580c',
    ai: 'Dementia', motor: 'Normal', cognitive: 'Normal',
    clinicalTH: 'ความผิดปกติทางทักษะ / False Alarm: AI ตรวจพบรูปวาดผิดเพี้ยน แต่กระบวนการคิดและร่างกายปกติ',
    clinicalEN: 'Visual Anomaly / False Alarm: AI detected drawing anomalies but cognitive and motor processes are normal.',
    actionTH: 'ใช้ biomarkers เพื่อกรอง false positives จาก AI',
    actionEN: 'Use process biomarkers to filter AI false positives.',
  },
  {
    level: 'C5', labelKey: 'c5Label' as const, bhi: 24, risk: 'high', color: '#dc2626',
    ai: 'Dementia', motor: 'Normal', cognitive: 'Abnormal',
    clinicalTH: 'อัลไซเมอร์ระยะต้น: รูปวาดผิดเพี้ยนร่วมกับกระบวนการคิดที่ล่าช้า — รูปแบบที่ชัดเจนที่สุดของภาวะสมองเสื่อม',
    clinicalEN: 'Typical Alzheimer\'s Pattern: Abnormal drawing combined with delayed cognitive process — clearest pattern of dementia.',
    actionTH: 'แนะนำให้พบแพทย์ผู้เชี่ยวชาญโดยด่วน',
    actionEN: 'Urgent specialist referral recommended.',
  },
  {
    level: 'C6', labelKey: 'c6Label' as const, bhi: 12, risk: 'critical', color: '#b91c1c',
    ai: 'Dementia', motor: 'Abnormal', cognitive: 'Normal',
    clinicalTH: 'ภาวะสมองเสื่อมร่วมกับโรคทางกาย: รูปวาดผิดเพี้ยนและควบคุมกล้ามเนื้อไม่ได้ อาจบ่งชี้ Parkinson\'s Disease Dementia (PDD)',
    clinicalEN: 'Motor-Dominant Dementia: Abnormal drawing and motor control loss, potentially indicating PDD.',
    actionTH: 'ควรรีบพบแพทย์เพื่อประเมินเพิ่มเติม',
    actionEN: 'Seek medical evaluation promptly.',
  },
  {
    level: 'C7', labelKey: 'c7Label' as const, bhi: 4, risk: 'critical', color: '#7f1d1d',
    ai: 'Dementia', motor: 'Abnormal', cognitive: 'Abnormal',
    clinicalTH: 'ภาวะถดถอยรุนแรง: พบความผิดปกติในทุกมิติ — รูปวาด การเคลื่อนไหว และความคิด บ่งชี้ภาวะสมองเสื่อมระยะลุกลาม',
    clinicalEN: 'Severe / Global Impairment: Abnormalities across all dimensions consistent with advanced dementia.',
    actionTH: 'ต้องการการดูแลจากแพทย์ผู้เชี่ยวชาญอย่างเร่งด่วน',
    actionEN: 'Requires urgent specialist care.',
  },
]

// K-Series biomarker rules
const K_RULES = [
  {
    id: 'K1', domain: 'motor' as const,
    nameTH: 'อาการสั่น (Tremor)',
    nameEN: 'Tremor',
    descTH: 'ความไม่ราบรื่นของการเคลื่อนไหวจากการควบคุมกล้ามเนื้อ (Parkinsonian Tremor)',
    descEN: 'Movement irregularity due to impaired muscle control (Parkinsonian Tremor)',
    detected: false,
  },
  {
    id: 'K2', domain: 'motor' as const,
    nameTH: 'เคลื่อนไหวช้า (Bradykinesia)',
    nameEN: 'Bradykinesia',
    descTH: 'ความเร็วเฉลี่ยของปากกาต่ำกว่าเกณฑ์ปกติ',
    descEN: 'Average pen velocity below normal threshold',
    detected: true,
  },
  {
    id: 'K3', domain: 'motor' as const,
    nameTH: 'เขียนเล็ก/เบา (Micrographia)',
    nameEN: 'Micrographia',
    descTH: 'ภาวะเขียนตัวเล็กผิดปกติหรือแรงกดปากกาแผ่วเบา',
    descEN: 'Abnormally small writing or very light pen pressure',
    detected: false,
  },
  {
    id: 'K4', domain: 'cognitive' as const,
    nameTH: 'ความลังเล (Hesitation)',
    nameEN: 'Hesitation',
    descTH: 'สัดส่วนเวลาที่หยุดคิดเพื่อดึงข้อมูลจากความจำ (%ThinkTime)',
    descEN: 'Memory retrieval deficit assessed via % Think Time',
    detected: true,
  },
  {
    id: 'K5', domain: 'cognitive' as const,
    nameTH: 'ความหน่วงก่อนวาดเข็ม (Pre-First Hand Latency)',
    nameEN: 'Pre-First Hand Latency',
    descTH: 'ความล่าช้าในการวางแผนก่อนวาดเข็มนาฬิกาเส้นแรก (Executive Dysfunction)',
    descEN: 'Planning delay before drawing the first clock hand (Executive Dysfunction)',
    detected: false,
  },
]

// Simulated result — Sprint 2 wires real AI output
const RESULT_INDEX = 1
const RESULT = C_LEVELS[RESULT_INDEX]
const TIMELINE = [0.1, 0.45, 0.6, 0.8, 0.55, 0.9, 0.7, 0.85, 0.6, 0.4, 0.75, 0.5, 0.3, 0.2]

// Derived K-series domain results (OR logic)
const motorAbnormal = K_RULES.filter(k => k.domain === 'motor').some(k => k.detected)
const cognitiveAbnormal = K_RULES.filter(k => k.domain === 'cognitive').some(k => k.detected)

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-4">
      <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">{label}</h2>
      {sub && <span className="text-xs text-slate-400/70">{sub}</span>}
    </div>
  )
}

function StatusPill({ pass, passLabel, failLabel }: { pass: boolean; passLabel: string; failLabel: string }) {
  return pass ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" /> {passLabel}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <AlertTriangle className="w-3 h-3" /> {failLabel}
    </span>
  )
}

function BHIArc({ value, color }: { value: number; color: string }) {
  // Semi-circle arc gauge
  const r = 56
  const cx = 70, cy = 70
  const startAngle = Math.PI          // 180° — left
  const endAngle = 0                  // 0° — right
  const totalArc = Math.PI            // half circle
  const valueArc = (value / 100) * totalArc

  const toXY = (angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  })

  const trackStart = toXY(startAngle)
  const trackEnd = toXY(endAngle)
  const valueEnd = toXY(startAngle - valueArc)

  const trackPath = `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`
  const valuePath = `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${valueArc > Math.PI / 2 ? 1 : 0} 1 ${valueEnd.x} ${valueEnd.y}`

  return (
    <div className="relative w-36 h-20 mx-auto">
      <svg viewBox="0 0 140 80" className="w-full h-full">
        {/* Track */}
        <path d={trackPath} fill="none" stroke="#e2e8f0" strokeWidth={10} strokeLinecap="round" />
        {/* Value arc */}
        <path d={valuePath} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}60)` }} />
        {/* Score */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">{value}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#94a3b8">/ 100</text>
        {/* Min/Max labels */}
        <text x="8" y="76" fontSize="8" fill="#94a3b8">0</text>
        <text x="120" y="76" fontSize="8" fill="#94a3b8">100</text>
      </svg>
    </div>
  )
}

function SparkLine({ points }: { points: number[] }) {
  const W = 200, H = 48, pad = 4
  const chartW = W - pad * 2
  const chartH = H - pad * 2
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + (i / (points.length - 1)) * chartW} ${pad + (1 - p) * chartH}`)
    .join(' ')
  const area = `${path} L ${pad + chartW} ${pad + chartH} L ${pad} ${pad + chartH} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--trust-blue)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--trust-blue)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke="var(--trust-blue)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i}
          cx={pad + (i / (points.length - 1)) * chartW}
          cy={pad + (1 - p) * chartH}
          r={2} fill="var(--trust-blue)" />
      ))}
    </svg>
  )
}

function AIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute border-2 border-red-400/80 bg-red-400/10 rounded"
        style={{ top: '18%', left: '55%', width: '22%', height: '18%' }}>
        <span className="absolute -top-5 left-0 text-[10px] font-bold text-red-600 bg-white/95 px-1.5 py-0.5 rounded shadow-sm border border-red-200">
          ตัวเลขเบี่ยง
        </span>
      </div>
      <div className="absolute border-2 border-amber-400/80 bg-amber-400/10 rounded-full"
        style={{ top: '38%', left: '38%', width: '24%', height: '24%' }}>
        <span className="absolute -bottom-5 left-0 text-[10px] font-bold text-amber-700 bg-white/95 px-1.5 py-0.5 rounded shadow-sm border border-amber-200">
          เข็มนาฬิกา
        </span>
      </div>
    </div>
  )
}

function KRuleRow({ rule, lang }: { rule: typeof K_RULES[0]; lang: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-xl border transition-colors ${rule.detected ? 'border-amber-200 bg-amber-50/60' : 'border-slate-100 bg-slate-50/60'}`}>
      <button
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
        onClick={() => setOpen(v => !v)}
      >
        {/* K-ID badge */}
        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black ${
          rule.detected ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {rule.id}
        </span>
        {/* Name */}
        <span className="flex-1 text-sm font-semibold text-slate-700">
          {lang === 'th' ? rule.nameTH : rule.nameEN}
        </span>
        {/* Status */}
        {rule.detected
          ? <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex-shrink-0">ตรวจพบ</span>
          : <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">ปกติ</span>
        }
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0">
          <p className="text-xs text-slate-500 leading-relaxed pl-11">
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

  // BHI thresholds per clinical spec
  const bhiStatus = RESULT.bhi >= 80
    ? { label: lang === 'th' ? 'สุขภาพสมองดี' : 'Good Brain Health', color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200' }
    : RESULT.bhi >= 50
    ? { label: lang === 'th' ? 'พบความเสี่ยงระดับเริ่มต้น' : 'Mild Risk Detected', color: '#ca8a04', bg: 'bg-amber-50', border: 'border-amber-200' }
    : { label: lang === 'th' ? 'พบความเสี่ยงสูง' : 'High Risk Detected', color: '#dc2626', bg: 'bg-red-50', border: 'border-red-200' }

  const motorRules = K_RULES.filter(k => k.domain === 'motor')
  const cognitiveRules = K_RULES.filter(k => k.domain === 'cognitive')

  return (
    <div className="w-full bg-slate-50/80">
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">

        {/* ══ Page Header ══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          {/* Left: title */}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {lang === 'th' ? 'รายงานผลการประเมิน' : 'Assessment Report'}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-400">dCDT</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'th' ? 'ผลการวิเคราะห์ภาวะรู้คิด' : 'Cognitive Assessment Results'}
            </h1>
          </div>

          {/* Right: action buttons — same row as title */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('downloadPdfReport')}</span>
              <span className="sm:hidden">{lang === 'th' ? 'PDF' : 'PDF'}</span>
            </button>
            <button
              onClick={handleReturnHome}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-all active:scale-[0.97]"
              style={{ backgroundColor: 'var(--trust-blue)' }}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('returnHome')}</span>
              <span className="sm:hidden">{lang === 'th' ? 'หน้าหลัก' : 'Home'}</span>
            </button>
          </div>
        </div>

        {/* ══ Main Grid: 2-col on desktop ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ── LEFT COLUMN (sticky summary) ──────────────────────────── lg:4 */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* BHI + Clinical Classification — single left-column card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <SectionHeader label="Brain Health Index" sub="BHI" />
              <BHIArc value={RESULT.bhi} color={riskColor} />
              <div className={`mt-4 rounded-xl px-4 py-3 border ${bhiStatus.bg} ${bhiStatus.border}`}>
                <p className="text-sm font-bold" style={{ color: bhiStatus.color }}>{bhiStatus.label}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {RESULT.bhi >= 80
                    ? (lang === 'th' ? 'ไม่พบความเสี่ยงที่มีนัยสำคัญ แนะนำให้รักษาสุขภาพและตรวจเช็คประจำปี' : 'No significant risk. Maintain health and schedule annual check-ups.')
                    : RESULT.bhi >= 50
                    ? (lang === 'th' ? 'พบความผิดปกติบางประการ แนะนำให้ฝึกกิจกรรมบริหารสมองและสังเกตอาการอย่างใกล้ชิด' : 'Some irregularities detected. Brain exercises recommended; monitor closely.')
                    : (lang === 'th' ? 'รูปวาดมีความผิดเพี้ยนสูงหรือมีกระบวนการคิดที่บกพร่องชัดเจน แนะนำให้พบแพทย์โดยเร็ว' : 'Significant anomalies detected. Please consult a physician promptly.')}
                </p>
              </div>

              {/* Score breakdown weights */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: lang === 'th' ? 'โครงสร้าง' : 'Structure', pct: '60%', note: lang === 'th' ? 'น้ำหนัก AI' : 'AI weight' },
                  { label: lang === 'th' ? 'กายภาพ' : 'Motor', pct: '20%', note: 'K1–K3' },
                  { label: lang === 'th' ? 'ความคิด' : 'Cognitive', pct: '20%', note: 'K4–K5' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <p className="text-[10px] text-slate-500 leading-tight">{s.label}</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{s.pct}</p>
                    <p className="text-[9px] text-slate-400">{s.note}</p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-5 border-t border-slate-100" />

              {/* Clinical Classification — flows directly below BHI */}
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                {lang === 'th' ? 'ผลการจำแนกทางคลินิก' : 'Clinical Classification'}
              </p>

              <div
                className="rounded-xl p-4 mb-3 border-l-4"
                style={{ borderLeftColor: riskColor, backgroundColor: `${riskColor}08` }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl font-black" style={{ color: riskColor }}>{RESULT.level}</span>
                  <span className="text-sm font-bold text-slate-700">{t(RESULT.labelKey)}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'th' ? RESULT.clinicalTH : RESULT.clinicalEN}
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-600">{lang === 'th' ? 'ข้อแนะนำ: ' : 'Action: '}</span>
                  {lang === 'th' ? RESULT.actionTH : RESULT.actionEN}
                </p>
              </div>

              {/* C0–C7 mini reference grid */}
              <div className="mt-4 grid grid-cols-4 gap-1">
                {C_LEVELS.map(c => (
                  <div
                    key={c.level}
                    className={`rounded-lg py-1.5 text-center border transition-all ${c.level === RESULT.level ? 'border-2 scale-105 shadow-sm' : 'border opacity-40'}`}
                    style={{
                      borderColor: c.level === RESULT.level ? c.color : '#e2e8f0',
                      backgroundColor: c.level === RESULT.level ? `${c.color}15` : '#f8fafc',
                    }}
                  >
                    <p className="text-[11px] font-black" style={{ color: c.color }}>{c.level}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <SectionHeader label={lang === 'th' ? 'เวลาที่ใช้ทั้งหมด' : 'Total Completion Time'} />

              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-slate-900 leading-none">{totalTime}</span>
                <span className="text-lg font-semibold text-slate-400 mb-1">s</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {lang === 'th'
                  ? 'เวลาตั้งแต่เริ่มอ่านคำสั่งจนวาดเข็มนาฬิกาเสร็จสิ้น'
                  : 'Time from reading instructions to completing the clock hands'}
              </p>

              {/* Think vs Ink bar */}
              <div className="w-full h-3 rounded-full overflow-hidden bg-slate-100 mb-2 flex">
                <div className="h-full rounded-l-full" style={{ width: '65%', backgroundColor: '#93c5fd' }} />
                <div className="h-full rounded-r-full flex-1" style={{ backgroundColor: 'var(--trust-blue)' }} />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#93c5fd' }} />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {lang === 'th' ? 'เวลาที่ใช้คิด' : 'Thinking Time'}
                    </p>
                    <p className="text-[10px] text-slate-400">65% · {thinkSec}s</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--trust-blue)' }} />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {lang === 'th' ? 'เวลาที่ใช้ลากเส้น' : 'Inking Time'}
                    </p>
                    <p className="text-[10px] text-slate-400">35% · {inkSec}s</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 italic">
                {lang === 'th'
                  ? '* สัดส่วนเวลาที่หยุดคิดสูงอาจบ่งชี้ปัญหาการดึงข้อมูลจากความจำ (K4)'
                  : '* High thinking time ratio may indicate memory retrieval deficit (K4)'}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-slate-400">{lang === 'th' ? 'รีสตาร์ท' : 'Restarts'}</p>
                  <p className="text-lg font-bold text-slate-700">{restartCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">{lang === 'th' ? 'เส้นวาด' : 'Strokes'}</p>
                  <p className="text-lg font-bold text-slate-700">{TIMELINE.length}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ──────────────────────────────────────── lg:8 */}
          <div className="lg:col-span-8 flex flex-col gap-5">

            {/* ── Pillar A: Structural + Drawing (merged) ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      {lang === 'th' ? 'โครงสร้าง (Structural)' : 'Structural Analysis'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {lang === 'th' ? 'Vision Transformer (ViT) Model' : 'Vision Transformer (ViT) Model'}
                    </p>
                  </div>
                </div>
                <StatusPill
                  pass={RESULT.ai === 'Normal'}
                  passLabel={lang === 'th' ? 'ปกติ' : 'Normal'}
                  failLabel={lang === 'th' ? 'ผิดปกติ' : 'Dementia'}
                />
              </div>

              {/* AI stats row */}
              <div className="grid grid-cols-2 gap-3 px-5 pt-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] text-slate-400 mb-1">{lang === 'th' ? 'ผลการทำนาย' : 'Prediction'}</p>
                  <p className="text-base font-bold text-slate-800">{RESULT.ai}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] text-slate-400 mb-1">{lang === 'th' ? 'ความมั่นใจของโมเดล' : 'Model Confidence'}</p>
                  <p className="text-base font-bold text-slate-800">87%</p>
                </div>
              </div>

              {/* Square drawing box — compact, with AI overlay toggle inside */}
              <div className="px-5 pt-3 pb-5">
                <div className="relative w-full max-w-xs mx-auto">
                  {/* Toggle sits on top-right corner of the square */}
                  <button
                    onClick={() => setShowAIOverlay(v => !v)}
                    className={`absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      showAIOverlay
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white/90 text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                    aria-pressed={showAIOverlay}
                  >
                    {showAIOverlay ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {lang === 'th' ? 'AI' : 'AI'}
                  </button>

                  {/* Perfect square */}
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <div className="absolute inset-3 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-full h-full opacity-[0.15]">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                        {[12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
                          const a = (i * 30 - 90) * Math.PI / 180
                          return <text key={n} x={100 + 72 * Math.cos(a)} y={100 + 72 * Math.sin(a)}
                            textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="600" fill="#1a1a1a">{n}</text>
                        })}
                        <line x1="100" y1="100" x2="65"  y2="55"  stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round"/>
                        <line x1="100" y1="100" x2="148" y2="62"  stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="100" cy="100" r="4" fill="#1a1a1a"/>
                      </svg>
                      <p className="absolute bottom-2 text-[10px] text-slate-300">
                        {lang === 'th' ? 'ภาพตัวอย่าง' : 'Sample image'}
                      </p>
                    </div>
                    {showAIOverlay && <div className="absolute inset-3"><AIOverlay /></div>}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 italic text-center">
                  {lang === 'th'
                    ? '* GradCAM แสดงบริเวณที่ ViT ให้ความสำคัญในการวินิจฉัย'
                    : '* GradCAM highlights regions ViT focused on during diagnosis'}
                </p>
              </div>
            </div>

            {/* ── Pillar B: Motor Domain (K1–K3) ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      {lang === 'th' ? 'การควบคุมร่างกาย (Motor Domain)' : 'Physical Control (Motor Domain)'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {lang === 'th' ? 'OR Logic: K1, K2, K3 — พบความผิดปกติ 1 ข้อ = ผิดปกติ' : 'OR Logic: K1, K2, K3 — any positive = Abnormal'}
                    </p>
                  </div>
                </div>
                <StatusPill
                  pass={!motorAbnormal}
                  passLabel={lang === 'th' ? 'ปกติ' : 'Normal'}
                  failLabel={lang === 'th' ? 'ผิดปกติ' : 'Abnormal'}
                />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {motorRules.map(rule => (
                  <KRuleRow key={rule.id} rule={rule} lang={lang} />
                ))}
              </div>
            </div>

            {/* ── Pillar C: Cognitive Domain (K4–K5) ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      {lang === 'th' ? 'กระบวนการทางความคิด (Cognitive Domain)' : 'Cognitive Process Domain'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {lang === 'th' ? 'OR Logic: K4, K5 — พบความผิดปกติ 1 ข้อ = ผิดปกติ' : 'OR Logic: K4, K5 — any positive = Abnormal'}
                    </p>
                  </div>
                </div>
                <StatusPill
                  pass={!cognitiveAbnormal}
                  passLabel={lang === 'th' ? 'ปกติ' : 'Normal'}
                  failLabel={lang === 'th' ? 'ผิดปกติ' : 'Abnormal'}
                />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {cognitiveRules.map(rule => (
                  <KRuleRow key={rule.id} rule={rule} lang={lang} />
                ))}
              </div>

              {/* %ThinkTime callout */}
              <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-violet-50/60 border border-violet-100">
                <Info className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-violet-700 leading-relaxed">
                  <span className="font-bold">%ThinkTime = {Math.round((thinkSec / totalTime) * 100)}%</span>
                  {' — '}
                  {lang === 'th'
                    ? 'สัดส่วนเวลาที่หยุดคิดเพื่อดึงข้อมูลจากความจำ ค่าสูงบ่งชี้ภาวะ Memory Retrieval Deficit (K4)'
                    : 'Proportion of time paused to retrieve information from memory. High values indicate Memory Retrieval Deficit (K4)'}
                </p>
              </div>
            </div>

            {/* ── Stroke Timeline ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-700">
                    {lang === 'th' ? 'ลำดับและความเร็วของการลากเส้น' : 'Stroke Order & Velocity Profile'}
                  </h2>
                </div>
                <span className="text-xs text-slate-400">{TIMELINE.length} strokes</span>
              </div>

              <SparkLine points={TIMELINE} />

              <div className="flex justify-between mt-1 mb-4">
                <span className="text-xs text-slate-400">{lang === 'th' ? 'เริ่มต้น' : 'Start'}</span>
                <span className="text-xs text-slate-400">{lang === 'th' ? 'สิ้นสุด' : 'End'}</span>
              </div>

              {/* Detailed time stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: lang === 'th' ? 'เวลารวม' : 'Total Time',
                    value: `${totalTime}s`,
                    sub: lang === 'th' ? 'ทั้งหมด' : 'overall',
                  },
                  {
                    label: lang === 'th' ? 'เวลาที่ใช้คิด' : 'Thinking Time',
                    value: `${thinkSec}s`,
                    sub: `65%`,
                  },
                  {
                    label: lang === 'th' ? 'เวลาที่ใช้ลากเส้น' : 'Inking Time',
                    value: `${inkSec}s`,
                    sub: `35%`,
                  },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 leading-tight mb-1">{s.label}</p>
                    <p className="text-lg font-bold text-slate-800">{s.value}</p>
                    <p className="text-[10px] text-slate-400">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══ Footer Disclaimer ════════════════════════════════════════════════ */}
        <div className="mt-6 pb-8 flex items-start gap-2 px-1">
          <Info className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <span className="font-semibold">{lang === 'th' ? 'ข้อจำกัดความรับผิดชอบ: ' : 'Disclaimer: '}</span>
            {t('disclaimer')}
          </p>
        </div>

      </div>
    </div>
  )
}