"use client"

export function TutorialScreen() {
  return (
    <div className="w-full h-full min-h-[600px] bg-background flex flex-col p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-[32px] font-bold text-foreground leading-tight">
          Instructions
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Clock Drawing Test
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Animated GIF Placeholder */}
        <div className="w-full max-w-[320px] aspect-square bg-card rounded-2xl border-2 border-dashed border-border flex items-center justify-center mb-8 shadow-sm">
          <div className="text-center p-6">
            {/* Clock Drawing Animation Placeholder */}
            <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-primary/30 relative">
              {/* Clock Face */}
              <div className="absolute inset-2 rounded-full border-2 border-foreground/20">
                {/* Clock Numbers */}
                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground/60">12</span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-sm font-semibold text-foreground/60">3</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground/60">6</span>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-sm font-semibold text-foreground/60">9</span>
                {/* Clock Hands */}
                <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-foreground/60 origin-bottom -translate-x-1/2 -translate-y-full rotate-[-60deg]" />
                <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-foreground origin-bottom -translate-x-1/2 -translate-y-full rotate-[30deg]" />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-foreground rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>
              {/* Hand Drawing Indicator */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Animation showing hand drawing
            </p>
          </div>
        </div>

        {/* Instruction Text */}
        <div className="text-center max-w-md px-4">
          <p className="text-[22px] leading-relaxed text-foreground font-medium">
            Draw a clock face, add all the numbers, and set the time to{" "}
            <span className="text-primary font-bold">10:11</span>.
          </p>
        </div>
      </main>

      {/* Bottom Action */}
      <footer className="mt-6">
        <button className="w-full min-h-[64px] px-8 py-4 bg-primary text-primary-foreground font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 active:scale-[0.98] flex items-center justify-center gap-3">
          <span>Start Drawing</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </footer>
    </div>
  )
}
