"use client"

export function ReportScreen() {
  return (
    <div className="w-full h-full min-h-[600px] bg-background flex flex-col p-4">
      {/* Disclaimer Banner */}
      <header className="mb-4">
        <div className="bg-[#D97706]/10 border-2 border-[#D97706] rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D97706] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-[#D97706] text-base">Important Disclaimer</p>
            <p className="text-sm text-foreground/80 mt-0.5 leading-relaxed">
              This is a preliminary screening tool, not a medical diagnosis. Results should be reviewed by a qualified healthcare professional.
            </p>
          </div>
        </div>
      </header>

      {/* Report Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Smart Report</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Clock Drawing Test Results</p>
      </div>

      {/* Main Results */}
      <main className="flex-1 flex flex-col gap-4">
        {/* Risk Level Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-start gap-4">
            {/* Risk Icon - Color Blind Friendly with Shape */}
            <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/10 border-2 border-[#DC2626] flex items-center justify-center shrink-0">
              <svg className="w-9 h-9 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Risk Level</p>
              <p className="text-2xl font-bold text-[#DC2626] mt-1 flex items-center gap-2">
                Elevated Risk
                <span className="text-sm font-normal text-foreground/60 bg-[#DC2626]/10 px-2 py-0.5 rounded-full">
                  Requires Review
                </span>
              </p>
            </div>
          </div>
          
          {/* AI Confidence Score */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">AI Confidence Score</span>
              <span className="text-lg font-bold text-primary">85%</span>
            </div>
            {/* Progress Bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: '85%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on analysis of drawing patterns, timing, and spatial accuracy
            </p>
          </div>
        </div>

        {/* Drawing Velocity Profile Chart */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Drawing Analysis</p>
              <p className="text-lg font-bold text-foreground">Velocity Profile</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Time Series
            </span>
          </div>
          
          {/* Simplified Line Chart Placeholder */}
          <div className="h-32 relative bg-muted/30 rounded-xl border border-border/50 overflow-hidden">
            {/* Y-Axis Labels */}
            <div className="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-xs text-muted-foreground">
              <span>High</span>
              <span>Low</span>
            </div>
            
            {/* Chart Line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
              {/* Grid Lines */}
              <line x1="40" y1="25" x2="380" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4" />
              <line x1="40" y1="50" x2="380" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4" />
              <line x1="40" y1="75" x2="380" y2="75" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4" />
              
              {/* Main Line Path */}
              <path 
                d="M40,70 Q80,30 120,55 T200,35 T280,60 T360,40" 
                fill="none" 
                stroke="#2563EB" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Highlight Area */}
              <path 
                d="M40,70 Q80,30 120,55 T200,35 T280,60 T360,40 L360,85 L40,85 Z" 
                fill="#2563EB"
                fillOpacity="0.1"
              />
              
              {/* Data Points */}
              <circle cx="40" cy="70" r="4" fill="#2563EB" />
              <circle cx="120" cy="55" r="4" fill="#2563EB" />
              <circle cx="200" cy="35" r="4" fill="#2563EB" />
              <circle cx="280" cy="60" r="4" fill="#2563EB" />
              <circle cx="360" cy="40" r="4" fill="#2563EB" />
            </svg>
            
            {/* X-Axis Labels */}
            <div className="absolute bottom-1 left-10 right-2 flex justify-between text-xs text-muted-foreground">
              <span>Start</span>
              <span>End</span>
            </div>
          </div>
          
          {/* Chart Legend */}
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Drawing Speed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-primary/30" />
              <span className="text-xs text-muted-foreground">Expected Range</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <footer className="mt-4">
        <button className="w-full min-h-[64px] px-6 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 active:scale-[0.98] flex items-center justify-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Return to Dashboard</span>
        </button>
      </footer>
    </div>
  )
}
