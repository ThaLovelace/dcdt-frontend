"use client"

import { useApp } from '@/lib/app-context'
import { Download, Home, CheckCircle2, AlertTriangle } from 'lucide-react'

// Semi-circle Gauge Component
function GaugeChart({ value, size = 240 }: { value: number; size?: number }) {
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius
  const progress = (value / 100) * circumference
  
  // Color based on value: green (low risk) to orange (elevated risk)
  const getColor = (val: number) => {
    if (val < 50) return 'oklch(0.55 0.15 145)' // Soft green
    if (val < 75) return 'oklch(0.65 0.15 85)' // Yellow-orange
    return 'oklch(0.60 0.16 50)' // Alert orange (not red)
  }
  
  return (
    <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
      <svg
        width={size}
        height={size / 2 + strokeWidth}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="oklch(0.92 0 0)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          className="transition-all duration-1000 ease-out"
        />
        {/* Labels */}
        <text x={strokeWidth / 2} y={size / 2 + 28} fontSize="12" fill="oklch(0.5 0 0)" textAnchor="start">0%</text>
        <text x={size - strokeWidth / 2} y={size / 2 + 28} fontSize="12" fill="oklch(0.5 0 0)" textAnchor="end">100%</text>
      </svg>
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-5xl font-bold text-foreground">{value}%</span>
      </div>
    </div>
  )
}

// Donut Chart Component for Time Distribution
function DonutChart({ 
  thinkPercent, 
  totalTime,
  size = 180 
}: { 
  thinkPercent: number
  totalTime: number
  size?: number 
}) {
  const strokeWidth = 24
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const thinkDash = (thinkPercent / 100) * circumference
  const drawDash = ((100 - thinkPercent) / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Draw Time (background) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.45 0.12 250)"
          strokeWidth={strokeWidth}
        />
        {/* Think Time (foreground) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.75 0.12 250)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${thinkDash} ${circumference}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{totalTime}s</span>
        <span className="text-sm text-muted-foreground">Total</span>
      </div>
    </div>
  )
}

// Sparkline/Line Chart Component for Velocity
function VelocityChart({ width = 280, height = 100 }: { width?: number; height?: number }) {
  // Mock velocity data points (normalized 0-1)
  const points = [0.2, 0.35, 0.5, 0.65, 0.4, 0.75, 0.6, 0.85, 0.7, 0.55, 0.8, 0.65, 0.45, 0.3]
  
  const padding = 10
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  const pathData = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * chartWidth
    const y = padding + (1 - p) * chartHeight
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  const areaPath = `${pathData} L ${padding + chartWidth} ${height - padding} L ${padding} ${height - padding} Z`
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Grid lines */}
      {[0, 0.5, 1].map((p) => (
        <line
          key={p}
          x1={padding}
          y1={padding + (1 - p) * chartHeight}
          x2={padding + chartWidth}
          y2={padding + (1 - p) * chartHeight}
          stroke="oklch(0.9 0 0)"
          strokeWidth={1}
        />
      ))}
      {/* Area fill */}
      <path
        d={areaPath}
        fill="oklch(0.45 0.12 250 / 0.1)"
      />
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke="oklch(0.45 0.12 250)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={padding + (i / (points.length - 1)) * chartWidth}
          cy={padding + (1 - p) * chartHeight}
          r={3}
          fill="oklch(0.45 0.12 250)"
        />
      ))}
    </svg>
  )
}

export function ReportScreen() {
  const { t, setCurrentScreen, restartCount, getTCT, resetRestartCount } = useApp()
  
  const totalTime = getTCT() || 45 // Default to 45s for demo
  const thinkTimePercent = 65
  const aiConfidence = 85 // Simulated AI confidence score
  const isElevatedRisk = aiConfidence >= 70
  
  const handleReturnHome = () => {
    resetRestartCount()
    setCurrentScreen('practice')
  }
  
  // Simulated checklist results
  const checklist = [
    { key: 'clockFaceIntegrity' as const, passed: true },
    { key: 'numberSequence' as const, passed: false },
    { key: 'handPlacement' as const, passed: true },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* ============================================ */}
      {/* SECTION 1: Core Result with Gauge */}
      {/* ============================================ */}
      <section className="bg-card border-b-2 border-border">
        <div className="max-w-4xl mx-auto px-6 py-10 md:py-14">
          <div className="flex flex-col items-center text-center">
            {/* Section Title */}
            <h2 className="text-lg font-medium text-muted-foreground mb-6 tracking-wide uppercase">
              {t('aiConfidenceScore')}
            </h2>
            
            {/* Semi-circle Gauge */}
            <GaugeChart value={aiConfidence} size={280} />
            
            {/* Result Status */}
            <div className={`mt-6 flex items-center gap-3 px-6 py-3 rounded-full ${
              isElevatedRisk 
                ? 'bg-[oklch(0.60_0.14_50)]/15 text-[oklch(0.50_0.14_50)]' 
                : 'bg-[oklch(0.55_0.15_145)]/15 text-[oklch(0.45_0.14_145)]'
            }`}>
              {isElevatedRisk ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
              <span className="text-xl font-semibold">
                {isElevatedRisk ? t('resultElevatedRisk') : t('resultExpectedRange')}
              </span>
            </div>
            
            {/* Disclaimer */}
            <p className="mt-6 text-sm text-muted-foreground max-w-lg leading-relaxed">
              {t('disclaimer')}
            </p>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 h-14 bg-primary text-primary-foreground text-lg font-semibold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
              >
                <Download className="w-5 h-5" />
                {t('downloadPdfReport')}
              </button>
              <button
                onClick={handleReturnHome}
                className="flex-1 flex items-center justify-center gap-2 h-14 bg-secondary text-secondary-foreground text-lg font-medium rounded-xl border-2 border-border hover:bg-muted transition-colors"
              >
                <Home className="w-5 h-5" />
                {t('returnHome')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: Kinematic Biomarkers */}
      {/* ============================================ */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: Time Distribution Donut */}
          <div className="bg-card rounded-2xl border-2 border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {t('timeDistribution')}
            </h3>
            
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <DonutChart 
                  thinkPercent={thinkTimePercent} 
                  totalTime={totalTime}
                  size={180}
                />
                
                {/* Legend */}
                <div className="mt-6 flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[oklch(0.75_0.12_250)]" />
                    <span className="text-sm text-muted-foreground">
                      {t('thinkTime')} ({thinkTimePercent}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[oklch(0.45_0.12_250)]" />
                    <span className="text-sm text-muted-foreground">
                      {t('drawTime')} ({100 - thinkTimePercent}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Velocity Profile */}
          <div className="bg-card rounded-2xl border-2 border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('velocityProfile')}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t('drawingSpeedOverTime')}
            </p>
            
            <div className="flex items-center justify-center">
              <VelocityChart width={280} height={140} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: Rule-Based Assessment Checklist */}
      {/* ============================================ */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-card rounded-2xl border-2 border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            {t('ruleBasedAssessment')}
          </h3>
          
          <div className="space-y-3">
            {/* Checklist Items */}
            {checklist.map((item) => (
              <div 
                key={item.key}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                  item.passed 
                    ? 'bg-[oklch(0.55_0.15_145)]/10 border-[oklch(0.55_0.15_145)]/20' 
                    : 'bg-[oklch(0.60_0.14_50)]/10 border-[oklch(0.60_0.14_50)]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.passed ? 'bg-[oklch(0.55_0.15_145)]' : 'bg-[oklch(0.60_0.14_50)]'
                  }`}>
                    {item.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-base font-medium text-foreground">
                    {t(item.key)}
                  </span>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  item.passed 
                    ? 'bg-[oklch(0.55_0.15_145)]/20 text-[oklch(0.45_0.14_145)]' 
                    : 'bg-[oklch(0.60_0.14_50)]/20 text-[oklch(0.50_0.14_50)]'
                }`}>
                  {item.passed ? t('passed') : t('warning')}
                </span>
              </div>
            ))}
            
            {/* Restart Count Item */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-muted/50 border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20">
                  <span className="text-lg font-bold text-primary">{restartCount}</span>
                </div>
                <span className="text-base font-medium text-foreground">
                  {t('spatialPlanningRestarts')}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {t('userRestarted')}: {restartCount} {t('times')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
