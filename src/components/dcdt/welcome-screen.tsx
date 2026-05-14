"use client"

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import { fetchHistory, type TestRecord } from '@/lib/history-manager'
import {
  Shield, Activity, Brain, FileText,
  AlertCircle, User, GraduationCap, Hash,
  ClipboardList, Edit3, ChevronRight, X,
  CheckCircle2, AlertTriangle, AlertOctagon,
  Clock, Calendar,
} from 'lucide-react'

// ── Feature pills shown on the left panel ────────────────────────────────────
const FEATURE_ICONS = [
  { icon: Activity, key: 'featureKinematic' as const, color: 'text-blue-500',   bg: 'bg-blue-50'   },
  { icon: Brain,    key: 'featureAI'        as const, color: 'text-violet-500', bg: 'bg-violet-50' },
  { icon: FileText, key: 'featureReport'    as const, color: 'text-teal-500',   bg: 'bg-teal-50'   },
]

// ── Risk badge config ─────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: 'normal' | 'mild' | 'high' }) {
  if (level === 'normal') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
      <CheckCircle2 className="w-3 h-3" /> Normal
    </span>
  )
  if (level === 'mild') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">
      <AlertTriangle className="w-3 h-3" /> Mild Risk
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700">
      <AlertOctagon className="w-3 h-3" /> High Risk
    </span>
  )
}

// ── Education label map ───────────────────────────────────────────────────────
const EDU_LABELS: Record<string, { th: string; en: string }> = {
  '0':  { th: 'ไม่ได้เรียน',        en: 'No Formal Education' },
  '4':  { th: 'ประถมต้น (ป.4)',      en: 'Primary (Grade 4)'   },
  '6':  { th: 'ประถมปลาย (ป.6)',     en: 'Primary (Grade 6)'   },
  '9':  { th: 'มัธยมต้น (ม.3)',      en: 'Junior High (Grade 9)' },
  '12': { th: 'มัธยมปลาย (ม.6)',     en: 'Senior High (Grade 12)' },
  '14': { th: 'อนุปริญญา',           en: 'Associate Degree'   },
  '16': { th: 'ปริญญาตรี',           en: "Bachelor's Degree"  },
  '18': { th: 'ปริญญาโท/เอก',       en: "Master's / PhD"     },
}

// ── History Modal ─────────────────────────────────────────────────────────────
function HistoryModal({ onClose, language }: { onClose: () => void; language: string }) {
  const { setAnalysisData, setCurrentScreen } = useApp()
  const [records, setRecords] = useState<TestRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory().then((data) => {
      setRecords(data)
      setLoading(false)
    })
  }, [])

  const lang = language
  const isEn = lang === 'en'

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(new Date(iso))
    } catch {
      return iso
    }
  }

  const handleViewReport = (rec: TestRecord) => {
    const analysisObj = {
      class_id:            rec.class_id ?? 'C0',
      risk_level:          rec.risk_level,
      risk_color:          (rec.risk_color ?? 'green') as 'green' | 'yellow' | 'red',
      kinematic:           (rec.kinematic ?? {}) as any,
      domain:              (rec.domain ?? {}) as any,
      warnings:            rec.warnings ?? [],
      model_version:       '',
      velocity_profile:    rec.velocity_profile ?? [],
      xai_evidence_b64:    rec.xai_evidence_b64 ?? null,
      ai_confidence:       rec.ai_confidence,
      processed_image_b64: rec.processed_image_b64 ?? null,
      is_history:          true,
    }
    setAnalysisData(analysisObj)
    setCurrentScreen('report')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-none">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <ClipboardList className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">
                {isEn ? 'Assessment History' : 'ประวัติการประเมิน'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {isEn ? `${records.length} record(s) stored locally` : `${records.length} ครั้ง · บันทึกในอุปกรณ์นี้`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Record list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <p className="text-sm font-bold text-slate-400">
                {isEn ? 'Loading...' : 'กำลังโหลด...'}
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <ClipboardList className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">
                {isEn ? 'No history yet' : 'ยังไม่มีประวัติการประเมิน'}
              </p>
              <p className="text-xs text-slate-300 mt-1 max-w-[200px] leading-relaxed">
                {isEn ? 'Complete an assessment to see records here.' : 'ผลการประเมินจะปรากฏที่นี่หลังจากทำแบบทดสอบครั้งแรก'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => handleViewReport(rec)}
                  className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[0.875rem] font-black text-gray-900 truncate">{rec.alias}</span>
                      <RiskBadge level={rec.risk_level} />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                      {formatDate(rec.date)} · AI {rec.ai_confidence.toFixed(1)}%
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {isEn ? 'Age' : 'อายุ'} {rec.age} · {EDU_LABELS[rec.education]?.[lang === 'th' ? 'th' : 'en'] ?? rec.education}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PDPA footer note */}
        <div className="flex-none px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-[10px] text-slate-400 leading-relaxed text-center">
            <Shield className="w-3 h-3 inline mr-1 text-emerald-400" />
            {isEn
              ? 'All records are stored only on this device. No data is sent to any server.'
              : 'ข้อมูลทั้งหมดบันทึกเฉพาะในอุปกรณ์นี้ ไม่มีการส่งข้อมูลออกไปยังเซิร์ฟเวอร์ใดๆ'}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main WelcomeScreen / Dashboard ────────────────────────────────────────────
export function WelcomeScreen() {
  const {
    t, language, setLanguage,
    setCurrentScreen,
    alias, setAlias,
    age, setAge,
    education, setEducation,
  } = useApp()

  const hasProfile = alias.trim().length > 0 && age.trim().length > 0 && education.length > 0

  const [touched,        setTouched]        = useState(false)
  const [editing,        setEditing]        = useState(false)
  const [showHistory,    setShowHistory]    = useState(false)

  // ── Profile persistence ────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dcdt_user_profile')
      if (saved) {
        const { alias: a, age: ag, education: ed } = JSON.parse(saved)
        if (a)  setAlias(a)
        if (ag) setAge(ag)
        if (ed) setEducation(ed)
      }
    } catch {
      // localStorage unavailable or corrupt — fail silently
    }
  }, [])

  const isValid = alias.trim().length > 0 && age.trim().length > 0 && education.length > 0

  const handleProfileSubmit = () => {
    setTouched(true)
    if (!isValid) return
    try {
      localStorage.setItem('dcdt_user_profile', JSON.stringify({ alias, age, education }))
    } catch {
      // fail silently
    }
    setEditing(false)
    setTouched(false)
  }

  // ── State B — Active Dashboard ─────────────────────────────────────────────
  if (hasProfile && !editing) {
    return (
      <div className="flex flex-col flex-1 h-full w-full relative">

        {/* ── Main content (ลด padding บน-ล่าง ให้พอดีกับแนวนอน) ── */}
        <div className="flex-1 flex items-center justify-center px-4 py-2 md:px-8 md:py-4">
          
          {/* บีบ max-w-5xl เป็น max-w-4xl และให้ items-center ตรงกลาง */}
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* ── LEFT: Branding + features ── */}
            <div className="flex flex-col gap-5 md:gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.12em] uppercase text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3 md:mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  {t('welcomeEyebrow')}
                </span>
                <h1 className="text-[1.75rem] md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-2 md:mb-3">
                  {t('welcomeTitle')}
                </h1>
                <p className="text-[0.875rem] md:text-[0.9375rem] text-gray-500 leading-relaxed max-w-sm">
                  {t('welcomeSubtitle')}
                </p>
              </div>

              <div className="flex flex-col gap-2 md:gap-2.5">
                {FEATURE_ICONS.map(({ icon: Icon, key, color, bg }) => (
                  <div key={key} className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${bg} ${color} flex-shrink-0`}>
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <span className="text-[0.875rem] md:text-sm font-semibold text-gray-700">{t(key)}</span>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block">
                <PrivacyNotice t={t} />
              </div>
            </div>

            {/* ── RIGHT: Dashboard card ── */}
            <div className="bg-white rounded-[1.5rem] md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-slate-100 bg-gradient-to-br from-blue-50/60 to-white">
                <p className="text-[10px] font-black tracking-[0.1em] uppercase text-slate-400 mb-1">
                  {t('dashboardGreetingLabel')}
                </p>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight truncate">
                  {alias}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] md:text-xs font-semibold text-slate-600 shadow-sm">
                    <User className="w-3 h-3 text-blue-500" />
                    {t('ageLabel')} {age}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] md:text-xs font-semibold text-slate-600 shadow-sm">
                    <GraduationCap className="w-3 h-3 text-blue-500" />
                    {EDU_LABELS[education]?.[language === 'th' ? 'th' : 'en'] ?? education}
                  </span>
                </div>
              </div>

              <div className="px-5 md:px-6 py-4 md:py-5 flex flex-col gap-2.5 md:gap-3">
                <button
                  onClick={() => setCurrentScreen('tutorial')}
                  className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md shadow-blue-600/25 transition-all"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[0.875rem] md:text-[0.9375rem] font-black leading-tight">{t('dashboardStartBtn')}</p>
                    <p className="text-[10px] md:text-[11px] text-blue-200 font-medium mt-0.5">{t('dashboardStartDesc')}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white/70 flex-shrink-0" />
                </button>

                <button
                  onClick={() => setShowHistory(true)}
                  className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 active:scale-[0.98] transition-all"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[0.875rem] md:text-[0.9375rem] font-black text-gray-900 leading-tight">{t('dashboardHistoryBtn')}</p>
                    <p className="text-[10px] md:text-[11px] text-slate-400 font-medium mt-0.5">{t('dashboardHistoryDesc')}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 flex-shrink-0" />
                </button>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <Edit3 className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[0.875rem] md:text-[0.9375rem] font-black text-gray-900 leading-tight">{t('dashboardEditBtn')}</p>
                    <p className="text-[10px] md:text-[11px] text-slate-400 font-medium mt-0.5">{t('dashboardEditDesc')}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 flex-shrink-0" />
                </button>
              </div>

              <div className="lg:hidden px-5 md:px-6 pb-4 md:pb-5">
                <PrivacyNotice t={t} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-none text-center py-2 md:py-3 px-4">
          <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">
            dCDT · Digital Clock Drawing Test · {new Date().getFullYear()}
          </p>
        </footer>

        {showHistory && (
          <HistoryModal onClose={() => setShowHistory(false)} language={language} />
        )}
      </div>
    )
  }

  // ── State A — Profile Setup / Edit Form ───────────────────────────────────
  return (
    <div className="flex flex-col flex-1 h-full w-full relative">

      {/* ── Main content ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 md:px-8 md:py-4">
        
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

          {/* LEFT — Branding */}
          <div className="flex flex-col gap-5 md:gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.12em] uppercase text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3 md:mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {t('welcomeEyebrow')}
              </span>
              <h1 className="text-[1.75rem] md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-2 md:mb-3">
                {t('welcomeTitle')}
              </h1>
              <p className="text-[0.875rem] md:text-[0.9375rem] text-gray-500 leading-relaxed max-w-sm">
                {t('welcomeSubtitle')}
              </p>
            </div>

            <div className="flex flex-col gap-2 md:gap-2.5">
              {FEATURE_ICONS.map(({ icon: Icon, key, color, bg }) => (
                <div key={key} className="flex items-center gap-3 px-4 py-2.5 md:py-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${bg} ${color} flex-shrink-0`}>
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="text-[0.875rem] md:text-sm font-semibold text-gray-700">{t(key)}</span>
                </div>
              ))}
            </div>

            <div className="hidden lg:block">
              <PrivacyNotice t={t} />
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="bg-white rounded-[1.5rem] md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4 border-b border-slate-100">
              <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
                {editing ? t('dashboardEditProfileTitle') : t('welcomeFormTitle')}
              </h2>
              <p className="text-[11px] md:text-xs text-slate-400 mt-1 leading-relaxed">{t('welcomeFormSubtitle')}</p>
            </div>

            <div className="px-5 md:px-6 py-4 md:py-5 flex flex-col gap-3 md:gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-gray-700 mb-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-500" />
                  {t('aliasLabel')}
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder={t('aliasPlaceholder')}
                  maxLength={40}
                  className={`w-full h-11 md:h-12 px-4 rounded-xl border-2 bg-slate-50 focus:bg-white focus:ring-4 transition-all text-[0.9375rem] md:text-base font-medium outline-none
                    ${touched && !alias.trim()
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
                      : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/10'}`}
                />
                <p className="text-[10px] md:text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-300" />
                  {t('aliasHint')}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-gray-700 mb-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  {t('ageLabel')}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t('agePlaceholder')}
                  min={1} max={120}
                  className={`w-full h-11 md:h-12 px-4 rounded-xl border-2 bg-slate-50 focus:bg-white focus:ring-4 transition-all text-[0.9375rem] md:text-base font-medium outline-none
                    ${touched && !age.trim()
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
                      : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/10'}`}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-gray-700 mb-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                  {t('eduLabel')}
                </label>
                <div className="relative">
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className={`w-full h-11 md:h-12 px-4 rounded-xl border-2 bg-slate-50 focus:bg-white focus:ring-4 transition-all text-[0.9375rem] md:text-base font-medium outline-none appearance-none cursor-pointer
                      ${touched && !education
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
                        : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/10'}`}
                  >
                    <option value="" disabled>{t('eduSelectPlaceholder')}</option>
                    <option value="0">{t('eduLevel0')}</option>
                    <option value="4">{t('eduLevel4')}</option>
                    <option value="6">{t('eduLevel6')}</option>
                    <option value="9">{t('eduLevel9')}</option>
                    <option value="12">{t('eduLevel12')}</option>
                    <option value="14">{t('eduLevel14')}</option>
                    <option value="16">{t('eduLevel16')}</option>
                    <option value="18">{t('eduLevel18')}</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {touched && !isValid && (
                <div className="flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-[11px] md:text-xs font-semibold text-red-600">{t('welcomeValidationError')}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-1">
                <button
                  onClick={handleProfileSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-[0.875rem] md:text-[0.9375rem] rounded-xl shadow-md shadow-blue-600/25 transition-all tracking-wide py-3 md:py-3.5"
                >
                  {editing ? t('dashboardSaveProfileBtn') : t('startAssessmentBtn')}
                </button>

                {editing && (
                  <button
                    onClick={() => { setEditing(false); setTouched(false) }}
                    className="w-full py-2.5 md:py-3 text-slate-400 hover:text-slate-600 font-semibold text-[13px] md:text-sm transition-colors"
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:hidden px-5 md:px-6 pb-4 md:pb-5">
              <PrivacyNotice t={t} />
            </div>
          </div>
        </div>
      </div>

      <footer className="flex-none text-center py-2 md:py-3 px-4">
        <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">
          dCDT · Digital Clock Drawing Test · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

// ── Reusable Privacy Notice block ─────────────────────────────────────────────
function PrivacyNotice({ t }: { t: (key: string) => string }) {
  return (
    <div className="rounded-[1rem] md:rounded-2xl border border-slate-200 bg-slate-50 p-3.5 md:p-4">
      <div className="flex items-center gap-2 mb-2 md:mb-2.5">
        <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
        </div>
        <div>
          <p className="text-[0.75rem] md:text-[0.8125rem] font-bold text-gray-800">{t('privacyNoticeTitle')}</p>
          <span className="text-[9px] md:text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
            {t('privacyBadge')}
          </span>
        </div>
      </div>
      <p className="text-[0.6875rem] md:text-[0.75rem] text-gray-500 leading-relaxed">
        {t('privacyNoticeBody')}
      </p>
    </div>
  )
}