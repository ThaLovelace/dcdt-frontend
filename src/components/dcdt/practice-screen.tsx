"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import {
  RotateCcw, ArrowRight, Pen, PenLine, ArrowLeftRight,
  X, AlertTriangle, User, GraduationCap, Clock,
} from 'lucide-react'

interface Point { x: number; y: number }

export function PracticeScreen() {
  const { setCurrentScreen, t, age, setAge, education, setEducation } = useApp()

  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const lastPosRef = useRef<Point>({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn,  setHasDrawn]  = useState(false)
  const [stylusOnly,   setStylusOnly]   = useState(false)
  const [isLeftHanded, setIsLeftHanded] = useState(false)
  const [isModalOpen,       setIsModalOpen]       = useState(false)
  const [showTimerWarning,  setShowTimerWarning]  = useState(false)
  const [showClearModal,    setShowClearModal]    = useState(false)

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const dpr  = window.devicePixelRatio || 1
    canvas.width  = rect.width  * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  useEffect(() => {
    initCanvas()
    const observer = new ResizeObserver(() => { if (hasDrawn) return; initCanvas() })
    if (canvasRef.current?.parentElement) observer.observe(canvasRef.current.parentElement)
    return () => observer.disconnect()
  }, [initCanvas, hasDrawn])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr  = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width  = rect.width  * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    setHasDrawn(false)
  }, [])

  const getPos = (e: React.TouchEvent | React.MouseEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); setIsDrawing(true); setHasDrawn(true); lastPosRef.current = getPos(e)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPosRef.current = pos
  }

  const stopDrawing = () => setIsDrawing(false)

  const handleStartRealTest = () => {
    if (age && education) { setIsModalOpen(false); setShowTimerWarning(true) }
  }

  const handleClearConfirm = () => { clearCanvas(); setShowClearModal(false) }

  // ── Sub-components ────────────────────────────────────────────────────────

  const Toggle = ({ checked, onToggle, label, colorOn }: {
    checked: boolean; onToggle: () => void; label: string; colorOn: string
  }) => (
    <button
      onClick={onToggle} aria-label={label} role="switch" aria-checked={checked}
      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${checked ? colorOn : 'bg-slate-300'}
        ${checked ? 'focus-visible:ring-blue-400' : 'focus-visible:ring-slate-400'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md
        transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  )

  const ToggleRow = ({ icon, iconColor, title, subtitle, checked, onToggle, toggleColor }: {
    icon: React.ReactNode; iconColor: string; title: string; subtitle: string;
    checked: boolean; onToggle: () => void; toggleColor: string
  }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200">
      <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconColor}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.875rem] font-bold text-gray-900 leading-tight whitespace-nowrap truncate">{title}</p>
        <p className="text-xs text-gray-400 leading-tight mt-0.5 whitespace-nowrap truncate">{subtitle}</p>
      </div>
      <Toggle checked={checked} onToggle={onToggle} label={title} colorOn={toggleColor} />
    </div>
  )

  const StylusToggleRow = () => (
    <ToggleRow
      icon={<Pen className="w-4 h-4" strokeWidth={2.5} />} iconColor="bg-blue-50 text-blue-500"
      title={t('stylusMode')} subtitle={t('palmRejection')}
      checked={stylusOnly} onToggle={() => setStylusOnly(!stylusOnly)} toggleColor="bg-blue-600"
    />
  )

  const LeftHandedToggleRow = () => (
    <ToggleRow
      icon={<ArrowLeftRight className="w-4 h-4" strokeWidth={2.5} />} iconColor="bg-violet-50 text-violet-500"
      title={t('leftHandedMode')} subtitle={t('leftHandedDesc')}
      checked={isLeftHanded} onToggle={() => setIsLeftHanded(!isLeftHanded)} toggleColor="bg-violet-500"
    />
  )

  const ActionButtons = ({ stacked }: { stacked: boolean }) => (
    <div className={`flex gap-2.5 ${stacked ? 'flex-col' : 'flex-row'}`}>
      <button
        onClick={() => setShowClearModal(true)} aria-label={t('clearCanvas')}
        className={`flex items-center justify-center gap-2 h-12 px-4 rounded-xl
          border-2 border-slate-200 bg-white text-slate-700
          text-[0.875rem] font-semibold whitespace-nowrap
          hover:bg-slate-50 active:scale-[0.98] transition-all
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
          ${stacked ? 'w-full' : 'flex-1'}`}
      >
        <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={2.5} />
        <span>{t('clearCanvas')}</span>
      </button>

      <button
        onClick={() => setIsModalOpen(true)} aria-label={t('iAmFamiliar')}
        className={`flex items-center justify-center gap-2 h-12 px-4 rounded-xl
          bg-blue-600 hover:bg-blue-700 text-white text-[0.875rem] font-bold whitespace-nowrap
          shadow-sm shadow-blue-600/20 active:scale-[0.98] transition-all
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
          ${stacked ? 'w-full' : 'flex-[2]'}`}
      >
        <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={2.5} />
        <span>{t('iAmFamiliar')}</span>
      </button>
    </div>
  )

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col bg-slate-50 overflow-hidden">

      {/* Mobile instruction bar */}
      <div className="lg:hidden shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-emerald-50 text-emerald-500">
          <PenLine className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider whitespace-nowrap">
              {t('practiceHintFree')}
            </span>
          </div>
          <p className="text-[0.9375rem] font-bold text-gray-900 leading-snug truncate">{t('practiceSubtitle')}</p>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 min-h-0 flex flex-col lg:items-center lg:justify-center lg:p-6">
        <div className={`flex-1 min-h-0 flex flex-col lg:flex-row lg:flex-none lg:items-stretch lg:gap-5 ${isLeftHanded ? 'lg:flex-row-reverse' : ''}`}>

          {/* Desktop sidebar */}
          <div className="hidden lg:flex flex-col justify-between min-w-[320px] w-[320px] xl:w-[360px] shrink-0 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-500 shrink-0">
                    <PenLine className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                    {t('practiceHintFree')}
                  </span>
                </div>
                <span className="text-[10px] font-black tracking-[0.1em] uppercase text-slate-400 mb-1">Practice Mode</span>
                <h1 className="text-[1rem] xl:text-lg font-bold text-gray-900 leading-snug mb-1">{t('practiceTitle')}</h1>
                <p className="text-xs text-gray-400 leading-relaxed">{t('practiceSubtitle')}</p>
              </div>
              <div className="flex flex-col gap-2">
                <StylusToggleRow />
                <LeftHandedToggleRow />
              </div>
            </div>
            <ActionButtons stacked={true} />
          </div>

          {/* Canvas wrapper */}
          <div className="flex-1 min-h-0 flex items-center justify-center lg:flex-none lg:h-full">
            <div
              className="relative bg-white overflow-hidden w-full h-full
                         lg:w-auto lg:h-full lg:max-h-[540px] lg:aspect-square
                         lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-md touch-none select-none"
              style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
            >
              <canvas
                ref={canvasRef} className="w-full h-full cursor-crosshair touch-none block"
                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                aria-label="Practice drawing canvas" role="img"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                  <p className="text-2xl md:text-3xl text-slate-300 font-bold select-none text-center px-6">{t('drawHere')}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile action bar */}
      <div className="lg:hidden shrink-0 flex flex-col gap-3 px-4 pt-3 pb-5 bg-white border-t border-slate-100 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
        <StylusToggleRow />
        <ActionButtons stacked={false} />
      </div>

      {/* Clear confirmation modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6" role="dialog" aria-modal="true" aria-labelledby="clear-modal-title">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 id="clear-modal-title" className="text-xl font-black text-gray-900 mb-2 text-center">{t('restartConfirmTitle')}</h2>
            <p className="text-[0.875rem] text-gray-500 mb-7 text-center px-2 leading-relaxed">{t('restartConfirmMessage')}</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={handleClearConfirm} className="w-full h-12 bg-red-500 text-white text-[0.9375rem] font-bold rounded-xl shadow-sm hover:bg-red-600 active:scale-[0.98] transition-all">
                {t('confirmRestart')}
              </button>
              <button onClick={() => setShowClearModal(false)} className="w-full h-12 bg-white text-slate-600 text-[0.9375rem] font-semibold rounded-xl border-2 border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all">
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data collection modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="px-6 py-5">
              <h2 id="modal-title" className="text-xl font-black text-gray-900 mb-1">{t('warningRealTestTitle')}</h2>
              <p className="text-[0.8125rem] text-gray-400 leading-relaxed mb-5">{t('warningRealTestDesc')}</p>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-gray-700 mb-1.5">
                    <User className="w-3.5 h-3.5 text-blue-500" /> {t('ageLabel')}
                  </label>
                  <input
                    type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder={t('agePlaceholder')}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-gray-700 mb-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" /> {t('eduLabel')}
                  </label>
                  <div className="relative">
                    <select
                      value={education} onChange={(e) => setEducation(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-medium outline-none appearance-none cursor-pointer"
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
              </div>

              <div className="flex flex-col gap-2.5 mt-6">
                <button
                  onClick={handleStartRealTest} disabled={!age || !education}
                  className="w-full h-12 rounded-xl font-bold text-[0.9375rem] bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98]"
                >
                  {t('startRealTestBtn')}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 text-slate-400 hover:text-slate-600 font-semibold text-sm transition-colors"
                >
                  {t('backToPracticeBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer warning modal */}
      {showTimerWarning && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-6" role="dialog" aria-modal="true" aria-labelledby="timer-modal-title">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                <span className="absolute -inset-1 rounded-2xl border-2 border-amber-200 animate-ping opacity-60" />
              </div>
            </div>
            <h2 id="timer-modal-title" className="text-xl font-black text-gray-900 mb-2 text-center tracking-tight">{t('readyToStartTitle')}</h2>
            <p className="text-[0.875rem] text-gray-500 mb-7 text-center leading-relaxed">{t('readyToStartMsg')}</p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { setShowTimerWarning(false); setCurrentScreen('canvas') }}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[0.9375rem] font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all"
              >
                {t('confirmStart')}
              </button>
              <button
                onClick={() => { setShowTimerWarning(false); setIsModalOpen(true) }}
                className="w-full py-3 text-slate-400 hover:text-slate-600 font-semibold text-sm transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}