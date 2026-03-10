export function Typography() {
  return (
    <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">Typography</h2>
        <span className="ml-auto text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-full">
          Noto Sans
        </span>
      </div>

      {/* Font Family */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Primary Font</span>
          <span className="text-xs font-mono text-muted-foreground">Google Fonts</span>
        </div>
        <p className="text-2xl font-semibold text-foreground">Noto Sans</p>
        <p className="text-sm text-muted-foreground mt-1">Highly legible, rounded sans-serif optimized for screen readability</p>
      </div>

      {/* Type Scale */}
      <div className="space-y-5">
        {/* Heading 1 */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Heading 1 — Large</span>
            <div className="flex gap-2">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">32px</span>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">Bold 700</span>
            </div>
          </div>
          <p className="text-[32px] font-bold text-foreground leading-tight">
            Clock Drawing Test
          </p>
          <p className="text-xs text-muted-foreground mt-2">Used for main screen titles and test names</p>
        </div>

        {/* Heading 2 */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Heading 2</span>
            <div className="flex gap-2">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">24px</span>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">SemiBold 600</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-foreground leading-tight">
            Instructions & Section Titles
          </p>
          <p className="text-xs text-muted-foreground mt-2">Used for section headers and important instructions</p>
        </div>

        {/* Body Text */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Body Text — Minimum</span>
            <div className="flex gap-2">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">18px</span>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">Regular 400</span>
            </div>
          </div>
          <p className="text-lg text-foreground leading-relaxed">
            Please draw a clock showing the time as ten minutes past eleven. Take your time and draw carefully.
          </p>
          <p className="text-xs text-muted-foreground mt-2">Minimum 18px ensures readability for elderly users</p>
        </div>

        {/* Caption */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Caption / Helper</span>
            <div className="flex gap-2">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">16px</span>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">Medium 500</span>
            </div>
          </div>
          <p className="text-base font-medium text-muted-foreground">
            Tap anywhere on the screen to continue
          </p>
          <p className="text-xs text-muted-foreground mt-2">Used for helper text and secondary information</p>
        </div>
      </div>

      {/* Readability Guidelines */}
      <div className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs text-foreground">
          <strong>Design Rationale:</strong> No text smaller than 16px. Line height minimum 1.5 for body text. Maximum line width of 70 characters for optimal reading comprehension.
        </p>
      </div>
    </section>
  )
}
