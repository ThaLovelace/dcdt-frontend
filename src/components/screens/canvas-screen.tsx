"use client"

import { useState } from "react"

export function CanvasScreen() {
  const [stylusMode, setStylusMode] = useState(true)

  return (
    <div className="w-full h-full min-h-[600px] bg-background flex flex-col p-4">
      {/* Top Controls */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Stylus Only Mode</p>
            <p className="text-xs text-muted-foreground">Palm Rejection</p>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <button
          onClick={() => setStylusMode(!stylusMode)}
          className={`relative w-20 h-11 rounded-full transition-colors duration-300 ${
            stylusMode ? 'bg-primary' : 'bg-muted'
          }`}
          aria-checked={stylusMode}
          role="switch"
          aria-label="Toggle stylus only mode"
        >
          <span 
            className={`absolute top-1 w-9 h-9 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
              stylusMode ? 'translate-x-10' : 'translate-x-1'
            }`}
          >
            {stylusMode ? (
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : null}
          </span>
          <span className="sr-only">Toggle stylus only mode</span>
        </button>
      </header>

      {/* Drawing Canvas */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 bg-card rounded-2xl border-[3px] border-foreground/80 shadow-lg relative overflow-hidden">
          {/* Canvas Instruction Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center opacity-30">
              <svg className="w-16 h-16 mx-auto text-foreground/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <p className="text-lg text-foreground/50 font-medium">
                Draw clock here
              </p>
              <p className="text-sm text-foreground/40 mt-1">
                Set time to 10:11
              </p>
            </div>
          </div>
          
          {/* Sample Drawing Strokes (for demonstration) */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 5" />
          </svg>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="mt-4 flex items-center gap-3">
        {/* Tool Buttons */}
        <div className="flex gap-2">
          <button 
            className="min-w-[64px] min-h-[64px] px-4 py-3 bg-card border-2 border-border rounded-xl flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200 active:scale-95"
            aria-label="Undo last action"
          >
            <svg className="w-7 h-7 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="text-xs font-medium text-muted-foreground">Undo</span>
          </button>
          
          <button 
            className="min-w-[64px] min-h-[64px] px-4 py-3 bg-card border-2 border-border rounded-xl flex flex-col items-center justify-center gap-1 hover:border-destructive/50 hover:bg-destructive/5 transition-colors duration-200 active:scale-95"
            aria-label="Clear canvas"
          >
            <svg className="w-7 h-7 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-xs font-medium text-muted-foreground">Clear</span>
          </button>
        </div>

        {/* Submit Button */}
        <button className="flex-1 min-h-[64px] px-6 py-4 bg-[#059669] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 active:scale-[0.98] flex items-center justify-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Submit Test</span>
        </button>
      </footer>
    </div>
  )
}
