export function ColorPalette() {
  const colors = [
    {
      name: "Trust Blue",
      role: "Primary Action",
      hex: "#2563EB",
      className: "bg-primary",
      textClass: "text-primary-foreground",
      description: "Buttons, links, focus states"
    },
    {
      name: "Light Gray",
      role: "Background",
      hex: "#F3F4F6",
      className: "bg-[#F3F4F6]",
      textClass: "text-foreground",
      description: "Page background"
    },
    {
      name: "Pure White",
      role: "Canvas",
      hex: "#FFFFFF",
      className: "bg-card",
      textClass: "text-card-foreground",
      description: "Drawing areas, cards"
    },
    {
      name: "Charcoal",
      role: "Text",
      hex: "#1F2937",
      className: "bg-[#1F2937]",
      textClass: "text-white",
      description: "Primary text color"
    }
  ]

  const statusColors = [
    {
      name: "Accessible Green",
      role: "Normal / Success",
      hex: "#059669",
      className: "bg-[#059669]",
      textClass: "text-white",
      wcag: "AA Pass",
      colorBlind: "Deuteranopia Safe"
    },
    {
      name: "Accessible Orange",
      role: "Caution",
      hex: "#D97706",
      className: "bg-[#D97706]",
      textClass: "text-white",
      wcag: "AA Pass",
      colorBlind: "Color-Blind Friendly"
    },
    {
      name: "Accessible Red",
      role: "Risk / Error",
      hex: "#DC2626",
      className: "bg-[#DC2626]",
      textClass: "text-white",
      wcag: "AA Pass",
      colorBlind: "Uses Shape + Icon"
    }
  ]

  return (
    <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">Color Palette</h2>
        <span className="ml-auto text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-full">
          High-Contrast Theme
        </span>
      </div>

      {/* Core Colors */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Core Colors</h3>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <div key={color.name} className="group">
              <div 
                className={`${color.className} h-20 rounded-lg flex items-end p-3 shadow-inner border border-border/20`}
              >
                <span className={`${color.textClass} text-xs font-mono font-medium`}>
                  {color.hex}
                </span>
              </div>
              <div className="mt-2">
                <p className="font-semibold text-foreground text-sm">{color.name}</p>
                <p className="text-xs text-muted-foreground">{color.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Colors */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Status Colors</h3>
        <div className="space-y-3">
          {statusColors.map((color) => (
            <div key={color.name} className="flex items-center gap-3">
              <div 
                className={`${color.className} w-14 h-14 rounded-lg flex items-center justify-center shadow-sm`}
              >
                {color.role === "Normal / Success" && (
                  <svg className={`w-6 h-6 ${color.textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {color.role === "Caution" && (
                  <svg className={`w-6 h-6 ${color.textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {color.role === "Risk / Error" && (
                  <svg className={`w-6 h-6 ${color.textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground text-sm">{color.name}</p>
                  <span className="text-xs font-mono text-muted-foreground">{color.hex}</span>
                </div>
                <p className="text-xs text-muted-foreground">{color.role}</p>
              </div>
              <div className="text-right">
                <span className="inline-block text-xs font-medium text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded">
                  {color.wcag}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{color.colorBlind}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrast Note */}
      <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Accessibility Note:</strong> All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI elements). Status colors include iconography for color-blind users.
        </p>
      </div>
    </section>
  )
}
