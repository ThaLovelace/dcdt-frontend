"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Eraser, ArrowRight, X, PenLine } from 'lucide-react'

export function PracticeScreen() {
  const { setCurrentScreen, t } = useApp()

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ── Drawing state & refs (UNTOUCHED) ─────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Fill white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Style for drawing
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  const clearCanvas = () => {
    initCanvas()
  }

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
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

  const stopDrawing = () => {
    setIsDrawing(false)
  }
  // ── End drawing logic ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto p-2 gap-2 overflow-hidden bg-background">

      {/* ── Left/Top Control Panel ── */}
      <div className="flex flex-col shrink-0 lg:w-64 bg-card rounded-2xl p-4 shadow-sm border border-border gap-4">

        {/* Top: title + description */}
        <div>
          {/* Icon badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: 'oklch(0.95 0.03 250)', color: 'var(--trust-blue)' }}
          >
            <PenLine className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-primary leading-tight mb-2">
            ลองซ้อมมือ
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ลองใช้ปากกาวาดลงบนกระดานด้านล่าง เพื่อทำความคุ้นเคยก่อนเริ่มทดสอบจริง
          </p>

          {/* Hint chips */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              ✏️ วาดอิสระ
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              🔄 ล้างได้ตลอด
            </span>
          </div>
        </div>

        {/* Bottom: action buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={clearCanvas}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-xl border-2 border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors active:scale-[0.98]"
          >
            <Eraser className="w-4 h-4" />
            ล้างกระดาน
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-xl text-white text-sm font-bold shadow-md hover:opacity-90 transition-opacity active:scale-[0.98]"
            style={{ backgroundColor: 'var(--trust-blue)' }}
          >
            ไปหน้าทดสอบจริง
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ── Right/Bottom Canvas Panel ── */}
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

      {/* ── Confirmation Modal (UNTOUCHED) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="ปิด"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-primary mb-4">
              พร้อมทดสอบแล้วใช่ไหม?
            </h2>

            {/* Body */}
            <p className="text-xl text-gray-700 mb-8">
              คุณคุ้นเคยกับการวาดแล้วใช่ไหม?
              <br /><br />
              <span className="text-red-500 font-semibold">
                ⚠️ หากกดตกลง ระบบจะแสดงโจทย์และเริ่มจับเวลาทันที
              </span>
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-16 text-xl font-semibold rounded-2xl border-2 border-foreground bg-white text-foreground hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                ซ้อมต่อ
              </button>
              <button
                onClick={() => setCurrentScreen('canvas')}
                className="flex-1 h-16 text-xl font-bold rounded-2xl bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors active:scale-[0.98]"
              >
                ตกลง เริ่มทดสอบ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}