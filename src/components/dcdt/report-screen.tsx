"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Home, Download, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Activity, Brain, Zap } from 'lucide-react'

// ─── C0–C7 Classification Matrix ─────────────────────────────────────────────

const C_LEVELS = [
  { level: 'C0', label: 'ปกติสมบูรณ์',       bhi: 92, risk: 'none',     color: '#16a34a' },
  { level: 'C1', label: 'บกพร่องเล็กน้อย',    bhi: 78, risk: 'low',      color: '#65a30d' },
  { level: 'C2', label: 'บกพร่องระดับกลาง',   bhi: 63, risk: 'moderate', color: '#ca8a04' },
  { level: 'C3', label: 'ผิดปกติระดับกลาง',   bhi: 51, risk: 'moderate', color: '#d97706' },
  { level: 'C4', label: 'ผิดปกติชัดเจน',      bhi: 38, risk: 'high',     color: '#ea580c' },
  { level: 'C5', label: 'บกพร่องรุนแรง',      bhi: 24, risk: 'high',     color: '#dc2626' },
  { level: 'C6', label: 'รุนแรงมาก',          bhi: 12, risk: 'critical', color: '#b91c1c' },
  { level: 'C7', label: 'วิกฤต',             bhi: 4,  risk: 'critical', color: '#7f1d1d' },
]

// Simulated result — Sprint 2 will wire real AI output
const RESULT_INDEX = 1 // C1 for demo
const RESULT      = C_LEVELS[RESULT_INDEX]

// Pillar data
const PILLARS = [
  {
    icon: Brain,
    label: 'AI Vision',
    sublabel: 'ความมั่นใจของโมเดล',
    value: '87%',
    status: 'pass' as const,
    detail: 'ตรวจจับโครงสร้างนาฬิกาได้ถูกต้อง',
  },
  {
    icon: Activity,
    label: 'Motor Control',
    sublabel: 'การตรวจจับอาการสั่น',
    value: 'ต่ำ',
    status: 'pass' as const,
    detail: 'ไม่พบรูปแบบอาการสั่นที่มีนัยสำคัญ',
  },
  {
    icon: Zap,
    label: 'Cognitive',
    sublabel: 'เวลาลังเล',
    value: '1.2s',
    status: 'warn' as const,
    detail: 'พบการหยุดชั่วคราวบริเวณตัวเลข 10-11',
  },
]

// Rule-based checklist
const CHECKLIST = [
  { label: 'ความสมบูรณ์ของหน้าปัด',     status: 'pass' as const },
  { label: 'ลำดับตัวเลข 1–12',          status: 'warn' as const },
  { label: 'ตำแหน่งเข็มนาฬิกา (11:10)', status: 'pass' as const },
]

// Simulated stroke timeline (normalised 0–1 velocity)
const TIMELINE = [0.1, 0.45, 0.6, 0.8, 0.55, 0.9, 0.7, 0.85, 0.6, 0.4, 0.75, 0.5, 0.3, 0.2]

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Circular BHI gauge rendered with SVG */
function BHIGauge({ value, color }: { value: number; color: string }) {
  const r  = 52
  const cx = 64
  const cy = 64
  const circ = 2 * Math.PI * r
  const dash  = (value / 100) * circ

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.92 0 0)" strokeWidth={12} />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground leading-none">{value}</span>
        <span className="text-xs text-muted-foreground mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

/** Horizontal sparkline for stroke timeline */
function Timeline({ points }: { points: number[] }) {
  const w = 100
  const h = 32
  const pad = 2
  const chartW = w - pad * 2
  const chartH = h - pad * 2
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + (i / (points.length - 1)) * chartW} ${pad + (1 - p) * chartH}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <path d={path} fill="none" stroke="var(--trust-blue)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={pad + (i / (points.length - 1)) * chartW}
          cy={pad + (1 - p) * chartH}
          r={1.5}
          fill="var(--trust-blue)"
        />
      ))}
    </svg>
  )
}

/** AI highlight overlay on the drawing placeholder */
function AIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Simulated bounding box: number area */}
      <div className="absolute border-2 border-red-400/70 bg-red-400/10 rounded" style={{ top: '18%', left: '55%', width: '22%', height: '18%' }}>
        <span className="absolute -top-4 left-0 text-[10px] font-semibold text-red-500 bg-white px-1 rounded shadow">ตัวเลขเบี่ยง</span>
      </div>
      {/* Simulated highlight: hand placement */}
      <div className="absolute border-2 border-amber-400/70 bg-amber-400/10 rounded-full" style={{ top: '38%', left: '38%', width: '24%', height: '24%' }}>
        <span className="absolute -bottom-4 left-0 text-[10px] font-semibold text-amber-600 bg-white px-1 rounded shadow">เข็มนาฬิกา</span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ReportScreen() {
  const { t, setCurrentScreen, restartCount, getTCT, resetRestartCount } = useApp()
  const [showAIOverlay, setShowAIOverlay] = useState(false)

  const totalTime = getTCT() || 45
  const riskColor = RESULT.color

  const handleReturnHome = () => {
    resetRestartCount()
    setCurrentScreen('tutorial')
  }

  // Risk badge styling
  const riskBadge = () => {
    if (RESULT.risk === 'none')     return { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' }
    if (RESULT.risk === 'low')      return { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-200' }
    if (RESULT.risk === 'moderate') return { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' }
    if (RESULT.risk === 'high')     return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
  }
  const badge = riskBadge()

  return (
    <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto p-4 md:p-6 gap-6 overflow-hidden bg-background">

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — Summary Card
      ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col shrink-0 lg:w-80 bg-card rounded-2xl p-5 shadow-sm border border-border gap-5 overflow-y-auto">

        {/* C-Level status header */}
        <div className={`rounded-xl px-4 py-3 border ${badge.bg} ${badge.border}`}>
          <p className="text-xs font-medium text-muted-foreground mb-0.5">ระดับการจำแนก</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black" style={{ color: riskColor }}>{RESULT.level}</span>
            <span className={`text-base font-semibold ${badge.text}`}>{RESULT.label}</span>
          </div>
        </div>

        {/* BHI Gauge */}
        <div className="text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Brain Health Index</p>
          <BHIGauge value={RESULT.bhi} color={riskColor} />
          <p className="text-xs text-muted-foreground mt-2">ดัชนีสุขภาพสมอง (BHI)</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/60 rounded-xl p-3 text-center border border-border">
            <p className="text-xl font-bold text-foreground">{totalTime}s</p>
            <p className="text-xs text-muted-foreground mt-0.5">TCT</p>
          </div>
          <div className="bg-muted/60 rounded-xl p-3 text-center border border-border">
            <p className="text-xl font-bold text-foreground">{restartCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">รีสตาร์ท</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
          {t('disclaimer')}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-xl border-2 border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            {t('downloadPdfReport')}
          </button>
          <button
            onClick={handleReturnHome}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-xl text-white text-sm font-bold shadow-md hover:opacity-90 transition-opacity active:scale-[0.98]"
            style={{ backgroundColor: 'var(--trust-blue)' }}
          >
            <Home className="w-4 h-4" />
            {t('returnHome')}
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — Analysis Details (scrollable)
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 min-h-0">

        {/* ── Section A: Visual Analysis ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">ภาพวาดของผู้ทำแบบทดสอบ</h2>
            {/* AI overlay toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">แสดงผล AI</span>
              <button
                onClick={() => setShowAIOverlay(v => !v)}
                className={`relative w-10 h-6 rounded-full transition-colors ${showAIOverlay ? 'bg-primary' : 'bg-border'}`}
                role="switch"
                aria-checked={showAIOverlay}
                aria-label="แสดงผลการวิเคราะห์โดย AI"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showAIOverlay ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Drawing placeholder + AI overlay */}
          <div className="relative bg-white mx-5 my-4 rounded-xl overflow-hidden border border-border aspect-square max-h-64 flex items-center justify-center">
            {/* Placeholder clock illustration */}
            <svg viewBox="0 0 200 200" className="w-48 h-48 opacity-20">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
              {[12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
                const a = (i * 30 - 90) * Math.PI / 180
                const x = 100 + 72 * Math.cos(a)
                const y = 100 + 72 * Math.sin(a)
                return <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="600" fill="#1a1a1a">{n}</text>
              })}
              {/* Hour hand ~10 */}
              <line x1="100" y1="100" x2="65" y2="55"  stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round"/>
              {/* Minute hand ~2 */}
              <line x1="100" y1="100" x2="148" y2="62" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="100" cy="100" r="4" fill="#1a1a1a"/>
            </svg>
            <p className="absolute bottom-2 text-xs text-muted-foreground/50">ภาพตัวอย่าง — Sprint 2 จะแสดงภาพจริง</p>
            {showAIOverlay && <AIOverlay />}
          </div>
        </div>

        {/* ── Section B: Pillar Breakdown ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">การวิเคราะห์แยกตามมิติ</h2>
          <div className="flex flex-col gap-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon
              const isPass = pillar.status === 'pass'
              return (
                <div key={pillar.label} className={`flex items-center gap-3 p-3 rounded-xl border ${isPass ? 'bg-green-50/50 border-green-100' : 'bg-amber-50/50 border-amber-100'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPass ? 'bg-green-100' : 'bg-amber-100'}`}>
                    <Icon className={`w-4 h-4 ${isPass ? 'text-green-700' : 'text-amber-700'}`} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">{pillar.label}</span>
                      <span className="text-xs text-muted-foreground">· {pillar.sublabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{pillar.detail}</p>
                  </div>
                  <span className={`text-sm font-bold flex-shrink-0 ${isPass ? 'text-green-700' : 'text-amber-700'}`}>{pillar.value}</span>
                  {isPass
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Rule-based checklist ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">{t('ruleBasedAssessment')}</h2>
          <div className="flex flex-col gap-2">
            {CHECKLIST.map((item) => {
              const isPass = item.status === 'pass'
              return (
                <div key={item.label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  {isPass
                    ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    : <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                  <span className="flex-1 text-sm text-foreground">{item.label}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isPass ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isPass ? t('passed') : t('warning')}
                  </span>
                </div>
              )
            })}
            {/* Restart count row */}
            <div className="flex items-center gap-3 py-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-primary">{restartCount}</span>
              </div>
              <span className="flex-1 text-sm text-foreground">{t('spatialPlanningRestarts')}</span>
              <span className="text-xs text-muted-foreground">{t('userRestarted')}: {restartCount} {t('times')}</span>
            </div>
          </div>
        </div>

        {/* ── Section C: Stroke Timeline ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">ลำดับและความเร็วของการลาก</h2>
            <span className="text-xs text-muted-foreground">{TIMELINE.length} strokes</span>
          </div>
          <Timeline points={TIMELINE} />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">เริ่มต้น</span>
            <span className="text-xs text-muted-foreground">สิ้นสุด</span>
          </div>
          {/* Think/Draw breakdown */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-muted/60 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.75 0.12 250)' }} />
                <span className="text-xs font-medium text-foreground">{t('thinkTime')}</span>
              </div>
              <p className="text-lg font-bold text-foreground">65%</p>
              <p className="text-xs text-muted-foreground">{Math.round(totalTime * 0.65)}s</p>
            </div>
            <div className="bg-muted/60 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--trust-blue)' }} />
                <span className="text-xs font-medium text-foreground">{t('drawTime')}</span>
              </div>
              <p className="text-lg font-bold text-foreground">35%</p>
              <p className="text-xs text-muted-foreground">{Math.round(totalTime * 0.35)}s</p>
            </div>
          </div>
        </div>

        {/* C-Level reference matrix */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">ตารางอ้างอิงการจำแนก C0–C7</h2>
          <div className="grid grid-cols-4 gap-1.5">
            {C_LEVELS.map((c) => (
              <div
                key={c.level}
                className={`rounded-lg p-2 text-center border-2 transition-all ${c.level === RESULT.level ? 'scale-105 shadow-md' : 'opacity-60'}`}
                style={{ borderColor: c.level === RESULT.level ? c.color : 'transparent', backgroundColor: c.level === RESULT.level ? `${c.color}18` : 'oklch(0.97 0 0)' }}
              >
                <p className="text-xs font-bold" style={{ color: c.color }}>{c.level}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5" style={{ fontSize: '10px' }}>{c.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}