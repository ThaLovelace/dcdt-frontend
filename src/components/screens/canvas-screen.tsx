"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useApp } from "@/lib/app-context"
import { PenTool, Undo2, Trash2, Send } from "lucide-react"

// Define the structure for our stroke data points
interface Point {
  x: number;
  y: number;
  t: number; // timestamp
  p?: number; // pressure (optional)
}

export function CanvasScreen() {
  const { age, education, setCurrentScreen, t } = useApp()
  const [stylusMode] = useState(true)
  
  // Canvas and drawing state references
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPosRef = useRef({ x: 0, y: 0 })
  
  // Array to store the raw coordinate data for K-Series calculation
  const strokeDataRef = useRef<Point[]>([])

  // Initialize canvas settings
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

  useEffect(() => { 
    initCanvas() 
  }, [initCanvas])

  // Clear canvas and reset stroke data
  const handleClear = () => {
    initCanvas()
    strokeDataRef.current = []
  }

  // ─── DATA PACKAGING & SUBMIT ──────────────────────────────────────────────
  const handleSubmit = async () => {
    // 1. Get the drawn image as a Base64 string
    const canvas = canvasRef.current
    const imageBase64 = canvas ? canvas.toDataURL("image/png") : ""

    // 2. Get the captured stroke coordinates (x, y, t)
    const strokeData = strokeDataRef.current

    // 3. Package all data into a JSON payload ready for the FastAPI backend
    const apiPayload = {
      patientInfo: {
        age: age ? parseInt(age, 10) : null,
        education: education, // Will be '<8' or '>=8'
      },
      drawingData: {
        imageBase64: imageBase64,
        strokes: strokeData,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        stylusMode: stylusMode
      }
    }

    // For MVP Testing: Log the payload to the console to verify everything is packed correctly
    console.log("📦 [DATA PACKAGED] Ready to send to API:", apiPayload)

    // TODO: In Phase 2, we will use fetch() to send this payload to the FastAPI endpoint here.

    // 4. Navigate to the loading/processing screen
    setCurrentScreen("loading")
  }
  // ──────────────────────────────────────────────────────────────────────────

  // Basic drawing functions (Placeholder for actual implementation)
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
    const pos = getPos(e)
    lastPosRef.current = pos
    
    // Record starting point
    strokeDataRef.current.push({ x: pos.x, y: pos.y, t: Date.now() })
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

    // Record moving points
    strokeDataRef.current.push({ x: pos.x, y: pos.y, t: Date.now() })
  }

  const stopDrawing = () => setIsDrawing(false)

  return (
    <div className="w-full h-full min-h-[600px] bg-background flex flex-col p-4 animate-in fade-in duration-500">
      
      {/* Top Controls */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <PenTool className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{t('stylusMode')}</p>
            <p className="text-xs font-medium text-gray-500">{t('palmRejection')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{t('canvasInstruction')}</p>
          </div>
        </div>
      </header>

      {/* Canvas Area */}
      <div className="flex-1 min-h-0 relative bg-white rounded-[2rem] border-4 border-dashed border-gray-200 shadow-sm overflow-hidden flex flex-col mb-4">
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

      {/* Bottom Controls */}
      <div className="flex items-center justify-between h-20">
        
        {/* Left Tools (Undo / Clear) */}
        <div className="flex gap-3">
          <button 
            className="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors duration-200 active:scale-95"
            aria-label="Undo"
          >
            <Undo2 className="w-6 h-6 text-gray-600" />
            <span className="text-[10px] font-bold text-gray-500">Undo</span>
          </button>
          
          <button 
            onClick={handleClear}
            className="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-red-200 hover:bg-red-50 transition-colors duration-200 active:scale-95"
            aria-label="Clear canvas"
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
            <span className="text-[10px] font-bold text-gray-500">Clear</span>
          </button>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          className="h-16 px-8 bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95"
        >
          <span className="text-lg font-bold">{t('finishSubmit')}</span>
          <Send className="w-5 h-5" />
        </button>

      </div>
    </div>
  )
}