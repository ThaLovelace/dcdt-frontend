"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Eraser, ArrowRight, X, PenLine, AlertTriangle, User, GraduationCap } from 'lucide-react'

export function PracticeScreen() {
  const { setCurrentScreen, t, age, setAge, education, setEducation } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      setCurrentScreen('canvas')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto p-2 gap-2 overflow-hidden bg-background">

      {/* ── Control Panel ── */}
      <div className="flex flex-col shrink-0 lg:w-64 bg-card rounded-2xl p-4 shadow-sm border border-border gap-4">
        <div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: 'oklch(0.95 0.03 250)', color: 'var(--trust-blue)' }}
          >
            <PenLine className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-primary leading-tight mb-2">
            {t('practiceTitle')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('practiceSubtitle')}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              {t('practiceHintFree')}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              {t('practiceHintClear')}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={initCanvas}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-xl border-2 border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors active:scale-[0.98]"
          >
            <Eraser className="w-4 h-4" />
            {t('clearCanvas')}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-xl text-white text-sm font-bold shadow-md hover:opacity-90 transition-opacity active:scale-[0.98]"
            style={{ backgroundColor: 'var(--trust-blue)' }}
          >
            {t('iAmFamiliar')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Canvas Panel ── */}
      <div className="flex-1 min-h-0 relative bg-white rounded-3xl border-2 border-dashed border-primary/30 shadow-inner overflow-hidden">
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
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            {/* ส่วนคำเตือน */}
            <div className="flex flex-col text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('warningRealTestTitle')}</h2>
              <p className="text-sm text-gray-500 px-2">{t('warningRealTestDesc')}</p>
            </div>

            <div className="w-full h-px bg-gray-100 mb-6" />

            {/* ส่วนกรอกข้อมูล */}
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
                  className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg font-medium outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <GraduationCap className="w-4 h-4 text-blue-500" /> {t('eduLabel')}
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setEducation('<8')}
                    className={`h-14 px-4 rounded-xl border-2 text-left transition-all font-medium ${
                      education === '<8' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t('eduLessThan8')}
                  </button>
                  <button
                    onClick={() => setEducation('>=8')}
                    className={`h-14 px-4 rounded-xl border-2 text-left transition-all font-medium ${
                      education === '>=8' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t('eduMoreThan8')}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleStartRealTest}
                disabled={!age || !education}
                className="w-full h-14 rounded-xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
              >
                {t('startRealTestBtn')}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full h-14 rounded-xl font-semibold text-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {t('backToPracticeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}