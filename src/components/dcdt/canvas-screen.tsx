"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { RotateCcw, Send, Pen, Clock } from 'lucide-react'

// ---------------------------------------------------------------------------
// Table 3.1 compliant data point schema
// ---------------------------------------------------------------------------
interface StrokePoint {
  t: number     
  x: number     
  y: number     
  p: number     
  az: number    
  alt: number   
  id: number    
}

interface Point {
  x: number
  y: number
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export function CanvasScreen() {
  const { 
    t, 
    setCurrentScreen, 
    incrementRestartCount, 
    setResultIndex, 
    setAnalysisData,
    age,
    education
  } = useApp()
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [stylusOnly, setStylusOnly] = useState(true)
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

  // ---------------------------------------------------------------------------
  // Coordinate helper — works with both React synthetic events and raw
  // PointerEvent objects (needed for getCoalescedEvents).
  //
  // Fix (audit §1): applies CSS-scale correction so that coordinates are
  // accurate even when the canvas element is scaled by a responsive layout.
  //   scaleX = canvas backing-store width  / CSS display width  / DPR
  //   scaleY = canvas backing-store height / CSS display height / DPR
  // Without this, K1 RMS and K2 velocity are off by the CSS scale factor.
  // ---------------------------------------------------------------------------
  const getCoordinatesFromNative = (
    ev: PointerEvent,
    canvas: HTMLCanvasElement
  ): Point | null => {
    if (stylusOnly && ev.pointerType === 'touch') return null
    const rect   = canvas.getBoundingClientRect()
    const dpr    = window.devicePixelRatio || 1
    const scaleX = canvas.width  / rect.width  / dpr
    const scaleY = canvas.height / rect.height / dpr
    return {
      x: (ev.clientX - rect.left) * scaleX,
      y: (ev.clientY - rect.top)  * scaleY,
    }
  }

  // Thin wrapper for React synthetic events (pointerdown / pointerup)
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return getCoordinatesFromNative(e.nativeEvent as PointerEvent, canvas)
  }

  // ---------------------------------------------------------------------------
  // Build a single StrokePoint from a raw PointerEvent + pre-computed canvas
  // coordinates.  Accepting a raw PointerEvent (instead of a React synthetic
  // event) lets us call this function on coalesced events too.
  // ---------------------------------------------------------------------------
  const buildStrokePoint = (
    ev:             PointerEvent,
    point:          Point,
    currentStrokeId: number
  ): StrokePoint => {
    // Pressure: use the native value when the hardware supports it (> 0 and
    // not the browser default of exactly 0.5 on non-pressure devices).
    const pressure = (typeof ev.pressure === 'number' && ev.pressure > 0)
      ? ev.pressure
      : 0.5

    return {
      t:   ev.timeStamp,                              // per-event high-res timestamp
      x:   point.x,
      y:   point.y,
      p:   pressure,
      az:  (ev as PointerEvent & { azimuthAngle?: number }).azimuthAngle  ?? 0.0,
      alt: (ev as PointerEvent & { altitudeAngle?: number }).altitudeAngle ?? 0.0,
      id:  currentStrokeId,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e)
    if (!point) return
    strokeIdRef.current += 1
    setIsDrawing(true)
    setHasDrawn(true)
    setSubmitError(null)
    lastPointRef.current = point
    strokesRef.current.push(buildStrokePoint(e.nativeEvent as PointerEvent, point, strokeIdRef.current))
  }

  // ---------------------------------------------------------------------------
  // Fix (audit §1 — coalesced events):
  //
  // Browsers batch pointermove events between animation frames.  On a 240 Hz
  // stylus the device may sample at 240 Hz but the browser only delivers one
  // event per 60 Hz frame.  The intermediate samples are stored as "coalesced
  // events" accessible via getCoalescedEvents().
  //
  // Problem without this fix:
  //   • Every point in a fast stroke gets the SAME timeStamp (one per frame).
  //   • np.diff(timestamps) → arrays of zeros → adaptive window falls back to 11.
  //   • K4 T_ink is underestimated → %ThinkTime is inflated → false K4 positives.
  //
  // Fix:
  //   • Iterate getCoalescedEvents() for data capture (accurate timestamps).
  //   • Use only the primary event for drawing (avoids double-painting artefacts).
  // ---------------------------------------------------------------------------
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = getContext()
    if (!ctx) return

    // --- Data capture: use every coalesced sample for kinematic accuracy ---
    const nativeEvent  = e.nativeEvent as PointerEvent
    const coalescedEvents: PointerEvent[] =
      typeof nativeEvent.getCoalescedEvents === 'function'
        ? nativeEvent.getCoalescedEvents()
        : [nativeEvent]

    // Fallback: if getCoalescedEvents returns an empty array, use the primary event
    const eventsToCapture = coalescedEvents.length > 0 ? coalescedEvents : [nativeEvent]

    eventsToCapture.forEach(ev => {
      const point = getCoordinatesFromNative(ev, canvas)
      if (!point) return
      // Each coalesced event has its own timeStamp — this is the key fix
      strokesRef.current.push(buildStrokePoint(ev, point, strokeIdRef.current))
    })

    // --- Rendering: use only the primary (last) event position to draw ---
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
    if (point) {
      strokesRef.current.push(buildStrokePoint(e.nativeEvent as PointerEvent, point, strokeIdRef.current))
    }
    setIsDrawing(false)
    lastPointRef.current = null
  }

  const handlePointerLeave = () => {
    setIsDrawing(false)
    lastPointRef.current = null
  }

  const handleRestartConfirm = () => {
    incrementRestartCount()
    clearCanvas()
    setShowRestartModal(false)
  }

  // ---------------------------------------------------------------------------
  // Submit: send payload to backend (UPDATED FOR DIRECT INTEGER PARSING)
  // ---------------------------------------------------------------------------
  const handleSubmit = async () => {
  if (!hasDrawn || isSubmitting) return;

  setIsSubmitting(true);
  setSubmitError(null);

  // --- FIX: Switch to loading screen immediately to prevent UI freeze ---
  setCurrentScreen('loading');

  const canvas = canvasRef.current;
  const imageB64 = canvas ? canvas.toDataURL('image/png') : "";
  const currentDpi = (window.devicePixelRatio || 1) * 96;

  const payload = {
    strokes: strokesRef.current,
    image_b64: imageB64,
    patient_age: age ? parseInt(age as string, 10) : 0, 
    education_years: education ? parseInt(education as string, 10) : 0,
    device_dpi: currentDpi
  };

  try {
    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    // Store real analysis data into global context
    if (setAnalysisData) {
      setAnalysisData(result);
    }

    if (typeof result?.result_index === 'number') {
      setResultIndex(result.result_index);
    }

    // Clear local stroke buffer after successful submission
    strokesRef.current = [];
    strokeIdRef.current = 0;

    // NOTE: Navigation to 'report' is now handled by LoadingScreen
    // once analysisData is detected in the context.
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ [dCDT] Submission failed:', message);
    setSubmitError(message);
    
    // Return to canvas if an error occurs so the user can see the error message
    setCurrentScreen('canvas'); 
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto p-4 md:p-6 gap-4 overflow-y-auto lg:overflow-hidden bg-slate-50">

      {/* Control Panel (Left / Top) */}
      <div className="flex flex-col shrink-0 lg:w-80 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 gap-4">
        <div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-blue-50 text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-1">
            {t('canvasInstruction')}
          </h1>
        </div>

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
            className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${stylusOnly ? 'bg-blue-500' : 'bg-gray-200'}`}
            role="switch"
            aria-checked={stylusOnly}
            aria-label={t('palmRejection')}
          >
            <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${stylusOnly ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100">
            <p className="text-xs text-red-600 font-medium break-words">{submitError}</p>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => setShowRestartModal(true)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 h-12 w-full rounded-2xl border-2 border-gray-100 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors active:scale-[0.98] disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            {t('restartTest')}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!hasDrawn || isSubmitting}
            className={`flex items-center justify-center gap-2 h-12 w-full rounded-2xl text-white text-sm font-bold shadow-md transition-all active:scale-[0.98] ${
              hasDrawn && !isSubmitting
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 shadow-none text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            {isSubmitting ? t('loading') : t('finishSubmit')}
          </button>
        </div>
      </div>

      {/* Canvas Panel (Right / Bottom) */}
      <div className="flex-1 min-h-[400px] lg:min-h-0 relative bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-4 lg:mb-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-2xl text-gray-300 font-bold select-none text-center px-4">
              {t('drawHere')}
            </p>
          </div>
        )}
      </div>

      {/* Restart Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{t('restartConfirmTitle')}</h2>
            <p className="text-sm text-gray-500 mb-8 text-center px-2">{t('restartConfirmMessage')}</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleRestartConfirm} className="w-full h-12 bg-red-500 text-white text-base font-bold rounded-xl shadow-md hover:bg-red-600 transition-colors">
                {t('confirmRestart')}
              </button>
              <button onClick={() => setShowRestartModal(false)} className="w-full h-12 bg-white text-gray-600 text-base font-semibold rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}