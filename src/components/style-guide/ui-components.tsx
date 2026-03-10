"use client"

import { useState } from "react"

export function UIComponents() {
  const [stylusMode, setStylusMode] = useState(false)

  return (
    <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">UI Components</h2>
        <span className="ml-auto text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-full">
          Touch-Optimized
        </span>
      </div>

      {/* Buttons Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Button States</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Default State */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground block">Default</span>
            <button 
              className="w-full min-h-[56px] min-w-[56px] px-6 py-3 bg-primary text-primary-foreground font-semibold text-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              Continue
            </button>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-xs font-mono text-muted-foreground">56px height</span>
            </div>
          </div>

          {/* Hover State */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground block">Hover / Focus</span>
            <button 
              className="w-full min-h-[56px] min-w-[56px] px-6 py-3 bg-primary/90 text-primary-foreground font-semibold text-lg rounded-xl shadow-md ring-4 ring-primary/30 transition-all duration-200"
            >
              Continue
            </button>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-xs font-mono text-muted-foreground">+ Focus Ring</span>
            </div>
          </div>

          {/* Disabled State */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground block">Disabled</span>
            <button 
              disabled
              className="w-full min-h-[56px] min-w-[56px] px-6 py-3 bg-muted text-muted-foreground font-semibold text-lg rounded-xl cursor-not-allowed opacity-70"
            >
              Continue
            </button>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-xs font-mono text-muted-foreground">70% opacity</span>
            </div>
          </div>
        </div>

        {/* Touch Target Note */}
        <div className="mt-4 p-3 bg-muted rounded-lg border border-border flex items-start gap-2">
          <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Touch Target:</strong> Minimum 44×44px (WCAG 2.1). All interactive elements exceed this at 56px height for elderly users with reduced motor control.
          </p>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Button Variants</h3>
        <div className="flex flex-wrap gap-3">
          <button className="min-h-[56px] px-6 py-3 bg-primary text-primary-foreground font-semibold text-lg rounded-xl">
            Primary
          </button>
          <button className="min-h-[56px] px-6 py-3 bg-secondary text-secondary-foreground font-semibold text-lg rounded-xl border-2 border-border">
            Secondary
          </button>
          <button className="min-h-[56px] px-6 py-3 bg-destructive text-destructive-foreground font-semibold text-lg rounded-xl">
            Danger
          </button>
          <button className="min-h-[56px] px-6 py-3 bg-[#059669] text-white font-semibold text-lg rounded-xl">
            Success
          </button>
        </div>
      </div>

      {/* Toggle Switch */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Toggle Switch</h3>
        
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">Stylus Only Mode</p>
                <p className="text-sm text-muted-foreground">Disable palm and finger input</p>
              </div>
            </div>
            
            {/* Custom Toggle */}
            <button
              onClick={() => setStylusMode(!stylusMode)}
              className={`relative w-20 h-11 rounded-full transition-colors duration-300 ${
                stylusMode ? 'bg-primary' : 'bg-muted'
              }`}
              aria-checked={stylusMode}
              role="switch"
            >
              <span 
                className={`absolute top-1 w-9 h-9 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  stylusMode ? 'translate-x-10' : 'translate-x-1'
                }`}
              />
              <span className="sr-only">Toggle stylus only mode</span>
            </button>
          </div>
          
          {/* Toggle State Label */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-sm font-medium ${stylusMode ? 'text-primary' : 'text-muted-foreground'}`}>
              {stylusMode ? 'Enabled' : 'Disabled'}
            </span>
            <span className="text-xs text-muted-foreground">• Tap to toggle</span>
          </div>
        </div>

        {/* Toggle Specs */}
        <div className="mt-3 flex gap-3">
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">80×44px</span>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">Touch-friendly</span>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">ARIA role=switch</span>
        </div>
      </div>
    </section>
  )
}
