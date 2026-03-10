"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { RotateCcw, Send, X, Pen, Clock } from 'lucide-react'

interface Point {
  x: number
  y: number
}

export function CanvasScreen() {
  const { t, setCurrentScreen, incrementRestartCount } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [stylusOnly, setStylusOnly] = useState(true)
  const [showRestartModal, setShowRestartModal] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const lastPointRef = useRef<Point | null>(null)

  // Silent TCT timer — records when the test screen mounted
  const startTimeRef = useRef(Date.now())

  // ── Canvas init (devicePixelRatio-aware, no hardcoded size) ──────────────────
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
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
    // Re-init on resize so canvas resolution stays sharp
    const observer = new ResizeObserver(() => {
      if (hasDrawn) return // Don't wipe an in-progress drawing
      initCanvas()
    })
    if (canvasRef.current?.parentElement) {
      observer.observe(canvasRef.current.parentElement)
    }
    return () => observer.disconnect()
  }, [initCanvas, hasDrawn])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
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

  // ── Drawing helpers ──────────────────────────────────────────────────────────
  const getContext = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    return ctx
  }, [])

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    if (stylusOnly && e.pointerType === 'touch') return null

    const rect = canvas.getBoundingClientRect()

    // Return raw offset coordinates because ctx.scale() already handles the devicePixelRatio
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e)
    if (!point) return
    setIsDrawing(true)
    setHasDrawn(true)
    lastPointRef.current = point
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const point = getCoordinates(e)
    if (!point || !lastPointRef.current) return
    const ctx = getContext()
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastPointRef.current = point
  }

  const handlePointerUp = () => {
    setIsDrawing(false)
    lastPointRef.current = null
  }

  const handleRestartConfirm = () => {
    incrementRestartCount()
    clearCanvas()
    setShowRestartModal(false)
  }

  // Disabled if nothing drawn yet
  const handleSubmit = () => {
    if (!hasDrawn) return
    setCurrentScreen('loading')
  }
  // ── End drawing logic ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto p-2 gap-2 overflow-hidden bg-background">

      {/* ── Control Panel (Left / Top) ── */}
      <div className="flex flex-col shrink-0 lg:w-72 bg-card rounded-2xl p-4 shadow-sm border border-border gap-4">

        {/* Icon + instruction */}
        <div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: 'oklch(0.95 0.03 250)', color: 'var(--trust-blue)' }}
          >
            <Clock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-foreground leading-snug mb-1">
            {t('canvasInstruction')}
          </h1>
        </div>

        {/* Stylus toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
          <div className="flex items-center gap-2">
            <Pen className="w-4 h-4 text-primary" strokeWidth={2} />
            <div>
              <p className="text-sm font-medium text-foreground leading-none">{t('stylusMode')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('palmRejection')}</p>
            </div>
          </div>
          <button
            onClick={() => setStylusOnly(!stylusOnly)}
            className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
              stylusOnly ? 'bg-primary' : 'bg-border'
            }`}
            role="switch"
            aria-checked={stylusOnly}
            aria-label={t('palmRejection')}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                stylusOnly ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowRestartModal(true)}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-xl border-2 border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            {t('restartTest')}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!hasDrawn}
            className={`flex items-center justify-center gap-2 h-10 w-full rounded-xl text-white text-sm font-bold shadow-md transition-all active:scale-[0.98] ${
              hasDrawn
                ? 'hover:opacity-90'
                : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ backgroundColor: 'var(--trust-blue)' }}
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            {t('finishSubmit')}
          </button>
        </div>

      </div>

      {/* ── Canvas Panel (Right / Bottom) ── */}
      <div className="flex-1 min-h-0 relative bg-white rounded-2xl border-2 border-border shadow-sm overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-2xl text-muted-foreground/40 font-medium select-none">
              {t('drawHere')}
            </p>
          </div>
        )}
      </div>

      {/* ── Restart Confirmation Modal (UNCHANGED) ── */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {t('restartConfirmTitle')}
              </h2>
              <button
                onClick={() => setShowRestartModal(false)}
                aria-label={t('cancel')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              {t('restartConfirmMessage')}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowRestartModal(false)}
                className="flex-1 h-14 bg-secondary text-secondary-foreground text-lg font-medium rounded-xl border-2 border-border hover:bg-muted transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleRestartConfirm}
                className="flex-1 h-14 bg-destructive text-destructive-foreground text-lg font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                {t('confirmRestart')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}