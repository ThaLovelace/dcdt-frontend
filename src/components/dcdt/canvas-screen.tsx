"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { RotateCcw, Send, Pen, Clock } from 'lucide-react'

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

  // Silent TCT timer
  const startTimeRef = useRef(Date.now())

  // ── Canvas init ──────────────────
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
    const observer = new ResizeObserver(() => {
      if (hasDrawn) return 
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

  const handleSubmit = () => {
    if (!hasDrawn) return
    setCurrentScreen('loading')
  }

  return (
    // Mobile scroll logic, min-height to guarantee canvas space
    <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto p-4 md:p-6 gap-4 overflow-y-auto lg:overflow-hidden bg-slate-50">

      {/* ── Control Panel (Left / Top) ── */}
      <div className="flex flex-col shrink-0 lg:w-80 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 gap-4">

        {/* Icon + instruction */}
        <div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-blue-50 text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-1">
            {t('canvasInstruction')}
          </h1>
        </div>

        {/* Stylus toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <Pen className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">{t('stylusMode')}</p>
              <p className="text-xs text-gray-500">{t('palmRejection')}</p>
            </div>
          </div>
          <button
            onClick={() => setStylusOnly(!stylusOnly)}
            className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
              stylusOnly ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={stylusOnly}
            aria-label={t('palmRejection')}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                stylusOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => setShowRestartModal(true)}
            className="flex items-center justify-center gap-2 h-12 w-full rounded-2xl border-2 border-gray-100 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            {t('restartTest')}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!hasDrawn}
            className={`flex items-center justify-center gap-2 h-12 w-full rounded-2xl text-white text-sm font-bold shadow-md transition-all active:scale-[0.98] ${
              hasDrawn
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 shadow-none text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            {t('finishSubmit')}
          </button>
        </div>

      </div>

      {/* ── Canvas Panel (Right / Bottom) ── */}
      {/* Forced min-h-[400px] on mobile */}
      <div className="flex-1 min-h-[400px] lg:min-h-0 relative bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-4 lg:mb-0">
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
            <p className="text-2xl text-gray-300 font-bold select-none text-center px-4">
              {t('drawHere')}
            </p>
          </div>
        )}
      </div>

      {/* ── Restart Confirmation Modal ── */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              {t('restartConfirmTitle')}
            </h2>
            <p className="text-sm text-gray-500 mb-8 text-center px-2">
              {t('restartConfirmMessage')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRestartConfirm}
                className="w-full h-12 bg-red-500 text-white text-base font-bold rounded-xl shadow-md hover:bg-red-600 transition-colors"
              >
                {t('confirmRestart')}
              </button>
              <button
                onClick={() => setShowRestartModal(false)}
                className="w-full h-12 bg-white text-gray-600 text-base font-semibold rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition-colors"
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