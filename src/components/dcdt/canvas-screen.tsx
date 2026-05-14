"use client"

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { RotateCcw, Send, Pen, Clock, ArrowLeftRight } from 'lucide-react'

interface StrokePoint {
  t: number; x: number; y: number; p: number; az: number; alt: number; id: number
}
interface Point { x: number; y: number }

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

// Global interaction restriction styles applied to the entire component
// Prevents accidental text selection, long-press menus, and copy triggers for senior users
const NO_SELECT_STYLE: React.CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
}

export function CanvasScreen() {
  const { t, setCurrentScreen, incrementRestartCount, setResultIndex, setAnalysisData, age, education, setRawStrokes, setOriginalImageB64, setDeviceDPI, startTCT } = useApp()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [stylusOnly, setStylusOnly] = useState(true)
  const [isLeftHanded, setIsLeftHanded] = useState(false)
  const [showRestartModal, setShowRestartModal] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const lastPointRef = useRef<Point | null>(null)
  const strokesRef = useRef<StrokePoint[]>([])
  const strokeIdRef = useRef<number>(0)

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

  // [iOS FIX] useLayoutEffect fires synchronously after DOM mutations but before the
  // browser paints. This means initCanvas() reads the correct final dimensions on
  // first render, preventing the "broken layout until resize" issue in iPad Safari.
  useLayoutEffect(() => {
    initCanvas()

    // Observe the canvas element itself (not just parentElement) so ResizeObserver
    // fires on the first frame when the flex layout settles its final size.
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => {
      // Only reinitialise if the user has not yet drawn — avoids clearing the canvas
      // on incidental viewport shifts (e.g. soft keyboard appearing).
      if (hasDrawn) return
      initCanvas()
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [initCanvas, hasDrawn])

  // [iOS FIX] Dispatch a synthetic resize event after mount so Safari recalculates
  // dynamic viewport units (dvh / -webkit-fill-available) once the toolbar has
  // settled. Runs once, after paint, so it never blocks the first render.
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [])

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
    strokesRef.current = []
    strokeIdRef.current = 0
  }, [])

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

  const getCoordinatesFromNative = (ev: PointerEvent, canvas: HTMLCanvasElement): Point | null => {
    // Stylus-only / palm rejection: block finger touch when stylusOnly is enabled
    if (stylusOnly && ev.pointerType === 'touch') return null
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const scaleX = canvas.width / rect.width / dpr
    const scaleY = canvas.height / rect.height / dpr
    return { x: (ev.clientX - rect.left) * scaleX, y: (ev.clientY - rect.top) * scaleY }
  }

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return getCoordinatesFromNative(e.nativeEvent as PointerEvent, canvas)
  }

  const buildStrokePoint = (ev: PointerEvent, point: Point, currentStrokeId: number): StrokePoint => {
    const pressure = typeof ev.pressure === 'number' && ev.pressure > 0 ? ev.pressure : 0.5
    return {
      t: ev.timeStamp, x: point.x, y: point.y, p: pressure,
      az: (ev as PointerEvent & { azimuthAngle?: number }).azimuthAngle ?? 0.0,
      alt: (ev as PointerEvent & { altitudeAngle?: number }).altitudeAngle ?? 0.0,
      id: currentStrokeId,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e)
    if (!point) return
    strokeIdRef.current += 1
    if (!hasDrawn) startTCT()
    setIsDrawing(true)
    setHasDrawn(true)
    setSubmitError(null)
    lastPointRef.current = point
    strokesRef.current.push(buildStrokePoint(e.nativeEvent as PointerEvent, point, strokeIdRef.current))
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = getContext()
    if (!ctx) return
    const nativeEvent = e.nativeEvent as PointerEvent
    const coalescedEvents: PointerEvent[] = typeof nativeEvent.getCoalescedEvents === 'function'
      ? nativeEvent.getCoalescedEvents() : [nativeEvent]
    const eventsToCapture = coalescedEvents.length > 0 ? coalescedEvents : [nativeEvent]
    eventsToCapture.forEach((ev) => {
      const point = getCoordinatesFromNative(ev, canvas)
      if (!point) return
      strokesRef.current.push(buildStrokePoint(ev, point, strokeIdRef.current))
    })
    const primaryPoint = getCoordinates(e)
    if (primaryPoint && lastPointRef.current) {
      ctx.beginPath()
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
      ctx.lineTo(primaryPoint.x, primaryPoint.y)
      ctx.stroke()
      lastPointRef.current = primaryPoint
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const point = getCoordinates(e)
    if (point) strokesRef.current.push(buildStrokePoint(e.nativeEvent as PointerEvent, point, strokeIdRef.current))
    setIsDrawing(false)
    lastPointRef.current = null
  }

  const handlePointerLeave = () => { setIsDrawing(false); lastPointRef.current = null }

  const handleRestartConfirm = () => { incrementRestartCount(); clearCanvas(); setShowRestartModal(false) }

  const handleSubmit = async () => {
    if (!hasDrawn || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
    const canvas = canvasRef.current
    const imageB64 = canvas ? canvas.toDataURL('image/png') : ''
    const currentDpi = (window.devicePixelRatio || 1) * 96
    setRawStrokes([...strokesRef.current])
    setOriginalImageB64(imageB64)
    setDeviceDPI(currentDpi)
    setCurrentScreen('loading')
    // BUG-01 FIX: canvas.width / canvas.height are the physical pixel dimensions
    // (after DPR scaling applied in initCanvas). The K5 clock-hand segmentation
    // algorithm on the backend uses these to compute the stable canvas centre and
    // threshold_radius — independent of how many strokes the patient has drawn.
    // We divide by dpr to get CSS-pixel (logical) coordinates, which match the
    // x/y values stored in strokesRef (recorded in CSS-pixel space via getCoordinates).
    const dpr = window.devicePixelRatio || 1
    const logicalCanvasWidth  = canvas ? canvas.width  / dpr : 800
    const logicalCanvasHeight = canvas ? canvas.height / dpr : 800

    const payload = {
      strokes: strokesRef.current, image_b64: imageB64,
      patient_age: age ? parseInt(age as string, 10) : 0,
      education_years: education ? parseInt(education as string, 10) : 0,
      device_dpi: currentDpi,
      canvas_width:  logicalCanvasWidth,
      canvas_height: logicalCanvasHeight,
    }
    try {
      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Backend error ${response.status}: ${errorText}`)
      }
      const result = await response.json()
      if (setAnalysisData) setAnalysisData(result)
      if (typeof result?.result_index === 'number') setResultIndex(result.result_index)
      strokesRef.current = []
      strokeIdRef.current = 0
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ [dCDT] Submission failed:', message)
      setSubmitError(message)
      setCurrentScreen('canvas')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Sub-components ───────────────────────────────────────────────────────────

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
      <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.875rem] font-bold text-gray-900 leading-tight whitespace-nowrap truncate">{title}</p>
        <p className="text-xs text-gray-400 leading-tight mt-0.5 whitespace-nowrap truncate">{subtitle}</p>
      </div>
      <Toggle checked={checked} onToggle={onToggle} label={title} colorOn={toggleColor} />
    </div>
  )

  const StylusToggleRow = () => (
    <ToggleRow
      icon={<Pen className="w-4 h-4" strokeWidth={2.5} />}
      iconColor="bg-blue-50 text-blue-500"
      title={t('stylusMode')} subtitle={t('palmRejection')}
      checked={stylusOnly} onToggle={() => setStylusOnly(!stylusOnly)} toggleColor="bg-blue-600"
    />
  )

  const LeftHandedToggleRow = () => (
    <ToggleRow
      icon={<ArrowLeftRight className="w-4 h-4" strokeWidth={2.5} />}
      iconColor="bg-violet-50 text-violet-500"
      title={t('leftHandedMode')} subtitle={t('leftHandedDesc')}
      checked={isLeftHanded} onToggle={() => setIsLeftHanded(!isLeftHanded)} toggleColor="bg-violet-500"
    />
  )

  const ActionButtons = ({ stacked }: { stacked: boolean }) => (
    <div className={`flex gap-2.5 ${stacked ? 'flex-col' : 'flex-row'}`}>
      <button
        onClick={() => setShowRestartModal(true)} disabled={isSubmitting}
        aria-label={t('restartTest')}
        className={`flex items-center justify-center gap-2
          h-12 px-4 rounded-xl border-2 border-slate-200 bg-white text-slate-700
          text-[0.875rem] font-semibold whitespace-nowrap
          hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
          ${stacked ? 'w-full' : 'flex-1'}`}
      >
        <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={2.5} />
        <span>{t('restartTest')}</span>
      </button>

      <button
        onClick={handleSubmit} disabled={!hasDrawn || isSubmitting}
        aria-label={t('finishSubmit')}
        className={`flex items-center justify-center gap-2
          h-12 px-4 rounded-xl text-white text-[0.875rem] font-bold whitespace-nowrap
          shadow-sm active:scale-[0.98] transition-all
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${hasDrawn && !isSubmitting
            ? 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-400 shadow-blue-600/20'
            : 'bg-slate-200 cursor-not-allowed text-slate-400'
          }
          ${stacked ? 'w-full' : 'flex-[2]'}`}
      >
        <Send className="w-4 h-4 shrink-0" strokeWidth={2.5} />
        <span>{isSubmitting ? t('loading') : t('finishSubmit')}</span>
      </button>
    </div>
  )

  return (
    // [iOS FIX] min-h uses both the legacy -webkit-fill-available (set via inline style
    // for Safari < 15.4) and the modern 100dvh Tailwind class. Together they handle
    // Safari's dynamic toolbar shrinking/expanding without layout shifts.
    <div
      className="flex-1 min-h-0 w-full flex flex-col bg-slate-50 overflow-hidden min-h-[100dvh] lg:min-h-0"
      style={{ ...NO_SELECT_STYLE, minHeight: '-webkit-fill-available' } as React.CSSProperties}
    >

      {/* ROW 1 — Mobile instruction bar */}
      <div className="lg:hidden shrink-0 flex items-center gap-3 px-4 py-2 bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        {/* [FIX 1] Reduced py-3 → py-2 to cut vertical gap on mobile instruction bar */}
        <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-blue-50 text-blue-500">
          <Clock className="w-5 h-5" />
        </div>
        <p className="text-[0.9375rem] font-bold text-gray-900 leading-snug">{t('canvasInstruction')}</p>
      </div>

      {/* Main area */}
      {/* [FIX 1] Reduced desktop padding: lg:p-6 → lg:p-3 to bring content closer to the top */}
      <div className="flex-1 min-h-0 flex flex-col lg:items-center lg:justify-center lg:p-3">
        <div className={`flex-1 min-h-0 flex flex-col lg:flex-row lg:flex-none lg:items-stretch lg:gap-5 ${isLeftHanded ? 'lg:flex-row-reverse' : ''}`}>

          {/* Desktop sidebar */}
          {/* [FIX 2] Sidebar height is now driven by the canvas aspect ratio container,
               padding reduced to p-4 to keep internal spacing balanced with larger canvas */}
          <div className="hidden lg:flex flex-col justify-between min-w-[280px] w-[280px] xl:w-[320px] shrink-0 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-blue-50 text-blue-500">
                  <Clock className="w-5 h-5" />
                </div>
                {/* Eyebrow */}
                <span className="text-[10px] font-black tracking-[0.1em] uppercase text-slate-400 mb-1">Instructions</span>
                <h1 className="text-[0.9375rem] xl:text-[1rem] font-bold text-gray-900 leading-snug">{t('canvasInstruction')}</h1>
              </div>
              <div className="flex flex-col gap-2">
                <StylusToggleRow />
                <LeftHandedToggleRow />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {submitError && (
                <p className="text-sm text-red-500 font-medium text-center px-2 leading-snug">{submitError}</p>
              )}
              <ActionButtons stacked={true} />
            </div>
          </div>

          {/* Canvas wrapper */}
          {/* [FIX 2] max-h changed from hardcoded 540px → 80vh for dynamic tablet/iPad sizing.
               aspect-square maintains strict 1:1 ratio; w-auto lets height drive the square. */}
          <div className="flex-1 min-h-0 flex items-center justify-center lg:flex-none lg:h-full">
            <div
              className="relative bg-white overflow-hidden w-full h-full
                         lg:w-auto lg:h-full lg:max-h-[80vh] lg:aspect-square
                         lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-md touch-none"
              // [FIX 4] Canvas wrapper also gets full interaction lock
              style={NO_SELECT_STYLE}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair touch-none block"
                // [FIX 3] Pointer Events used exclusively — correctly distinguishes
                // pointerType === 'pen' vs 'touch', enabling reliable stylus-only / palm rejection
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                aria-label="Drawing canvas for the Clock Drawing Test"
                role="img"
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
        {submitError && <p className="text-sm text-red-500 font-medium text-center leading-snug">{submitError}</p>}
        <ActionButtons stacked={false} />
      </div>

      {/* Restart modal */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6" role="dialog" aria-modal="true" aria-labelledby="restart-modal-title">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 id="restart-modal-title" className="text-xl font-black text-gray-900 mb-2 text-center">{t('restartConfirmTitle')}</h2>
            <p className="text-[0.875rem] text-gray-500 mb-7 text-center px-2 leading-relaxed">{t('restartConfirmMessage')}</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={handleRestartConfirm} className="w-full h-12 bg-red-500 text-white text-[0.9375rem] font-bold rounded-xl shadow-sm hover:bg-red-600 active:scale-[0.98] transition-all">
                {t('confirmRestart')}
              </button>
              <button onClick={() => setShowRestartModal(false)} className="w-full h-12 bg-white text-slate-600 text-[0.9375rem] font-semibold rounded-xl border-2 border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all">
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}