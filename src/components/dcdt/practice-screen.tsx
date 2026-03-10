"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Eraser } from 'lucide-react'

export function PracticeScreen() {
  const { setCurrentScreen, t } = useApp()
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

  return (
    <div className="flex flex-col h-full bg-background p-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('practiceTitle')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('practiceSubtitle')}
        </p>
      </div>

      {/* Practice Canvas with Clear Button */}
      <div className="flex-1 flex flex-col items-center justify-center mb-6 gap-4">
        <div className="w-full max-w-2xl aspect-square bg-card rounded-2xl border-4 border-foreground/20 shadow-lg overflow-hidden">
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
        
        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="flex items-center justify-center gap-2 h-14 px-8 bg-secondary text-secondary-foreground text-lg font-medium rounded-xl border-2 border-border hover:bg-muted transition-colors"
        >
          <Eraser className="w-6 h-6" />
          {t('clearCanvas')}
        </button>
      </div>

      {/* Primary Action: I am familiar */}
      <div className="max-w-xl mx-auto w-full">
        <button
          onClick={() => setCurrentScreen('preparation')}
          className="w-full h-20 bg-primary text-primary-foreground text-xl md:text-2xl font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          {t('iAmFamiliar')}
        </button>
      </div>
    </div>
  )
}
