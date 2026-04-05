"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Eraser, ArrowRight, X, PenLine, AlertTriangle, User, GraduationCap, Clock } from 'lucide-react'

export function PracticeScreen() {
  const { setCurrentScreen, t, age, setAge, education, setEducation } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showTimerWarning, setShowTimerWarning] = useState(false)

  // ── Drawing state & refs ──────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  useEffect(() => { initCanvas() }, [initCanvas])

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    lastPosRef.current = getPos(e)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPosRef.current = pos
  }

  const stopDrawing = () => setIsDrawing(false)
  // ── End drawing logic ─────────────────────────────────────────────────────────

  const handleStartRealTest = () => {
    if (age && education) {
      setIsModalOpen(false)
      setShowTimerWarning(true)
    }
  }

  return (
    // Added overflow-y-auto on mobile to allow scrolling, keeping overflow-hidden on desktop
    <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto p-4 md:p-6 gap-4 overflow-y-auto lg:overflow-hidden bg-slate-50">

      {/* ── Control Panel ── */}
      <div className="flex flex-col shrink-0 lg:w-80 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 gap-4">
        <div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-blue-50 text-blue-500">
            <PenLine className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
            {t('practiceTitle')}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t('practiceSubtitle')}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
              {t('practiceHintFree')}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
              {t('practiceHintClear')}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <button
            onClick={initCanvas}
            className="flex items-center justify-center gap-2 h-12 w-full rounded-2xl border-2 border-gray-100 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors active:scale-[0.98]"
          >
            <Eraser className="w-4 h-4" />
            {t('clearCanvas')}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 h-12 w-full rounded-2xl bg-blue-500 text-white text-sm font-bold shadow-md hover:bg-blue-600 transition-colors active:scale-[0.98]"
          >
            {t('iAmFamiliar')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Canvas Panel ── */}
      {/* Forced min-h-[400px] on mobile so it doesn't get squished */}
      <div className="flex-1 min-h-[400px] lg:min-h-0 relative bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-4 lg:mb-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* ── Confirmation Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 md:p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto scrollbar-hide">
            <button
              title={t('cancel')}
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            {/* Warning Section */}
            <div className="flex flex-col text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('warningRealTestTitle')}</h2>
              <p className="text-sm text-gray-500 px-2">{t('warningRealTestDesc')}</p>
            </div>

            <div className="w-full h-px bg-gray-100 mb-6" />

            {/* Data Collection Section */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 text-blue-500" /> {t('ageLabel')}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t('agePlaceholder')}
                  className="w-full h-14 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg font-medium outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <GraduationCap className="w-4 h-4 text-blue-500" /> {t('eduLabel')}
                </label>
                <div className="relative">
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full h-14 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-medium outline-none appearance-none cursor-pointer"
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
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleStartRealTest}
                disabled={!age || !education}
                className="w-full h-14 rounded-2xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
              >
                {t('startRealTestBtn')}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full h-14 rounded-2xl font-semibold text-lg text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {t('backToPracticeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Modal */}
      {showTimerWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4 text-center">{t('readyToStartTitle')}</h2>
            <p className="text-gray-600 mb-8 text-center leading-relaxed">{t('readyToStartMsg')}</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowTimerWarning(false); setCurrentScreen('canvas'); }}
                className="w-full h-16 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
              >
                {t('confirmStart')}
              </button>
              <button 
                onClick={() => { setShowTimerWarning(false); setIsModalOpen(true); }}
                className="w-full h-14 text-gray-400 font-bold text-base hover:text-gray-600"
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