"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { RotateCcw, Send, X, Pen } from 'lucide-react'

interface Point {
  x: number
  y: number
}

export function CanvasScreen() {
  const { t, setCurrentScreen, incrementRestart } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [stylusOnly, setStylusOnly] = useState(true)
  const [showRestartModal, setShowRestartModal] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const lastPointRef = useRef<Point | null>(null)
  
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
  
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [getContext])
  
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }, [getContext])
  
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    
    // Palm rejection: ignore touch events if stylus mode is on
    if (stylusOnly && e.pointerType === 'touch') return null
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
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
    incrementRestart()
    clearCanvas()
    setShowRestartModal(false)
  }
  
  const handleSubmit = () => {
    setCurrentScreen('loading')
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar with Instruction - ONLY shown on this screen */}
      <div className="p-4 md:p-6 bg-card border-b-2 border-border">
        <p className="text-xl md:text-2xl font-semibold text-foreground text-center max-w-3xl mx-auto">
          {t('canvasInstruction')}
        </p>
      </div>
      
      {/* Stylus Toggle Bar */}
      <div className="px-4 py-3 bg-muted/50 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pen className="w-6 h-6 text-primary" strokeWidth={2} />
            <span className="text-lg font-medium text-foreground">{t('stylusMode')}</span>
            <span className="text-sm text-muted-foreground">({t('palmRejection')})</span>
          </div>
          <button
            onClick={() => setStylusOnly(!stylusOnly)}
            className={`relative w-16 h-9 rounded-full transition-colors ${
              stylusOnly ? 'bg-primary' : 'bg-border'
            }`}
            role="switch"
            aria-checked={stylusOnly}
            aria-label={t('palmRejection')}
          >
            <span
              className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform ${
                stylusOnly ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl aspect-square bg-card rounded-3xl p-4 shadow-lg">
          <div className="relative w-full h-full border-4 border-foreground rounded-2xl overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              className="w-full h-full cursor-crosshair touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-2xl text-muted-foreground/50 font-medium">{t('drawHere')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Actions - NO Undo Button */}
      <div className="p-4 md:p-6 bg-card border-t-2 border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Restart Test Button */}
          <button
            onClick={() => setShowRestartModal(true)}
            className="flex items-center gap-2 h-16 px-6 rounded-xl bg-secondary text-secondary-foreground border-2 border-border hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-6 h-6" strokeWidth={2} />
            <span className="text-lg font-medium">{t('restartTest')}</span>
          </button>
          
          {/* Huge Primary Button: Finish and Submit */}
          <button
            onClick={handleSubmit}
            className="flex items-center gap-3 h-20 px-10 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Send className="w-7 h-7" strokeWidth={2} />
            <span className="text-xl font-bold">{t('finishSubmit')}</span>
          </button>
        </div>
      </div>
      
      {/* Restart Confirmation Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {t('restartConfirmTitle')}
              </h2>
              <button
                onClick={() => setShowRestartModal(false)}
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
