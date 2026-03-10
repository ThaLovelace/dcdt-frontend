export function IconSet() {
  const icons = [
    {
      name: "Undo",
      description: "Revert last action",
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      )
    },
    {
      name: "Clear",
      description: "Clear canvas / Reset",
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    },
    {
      name: "Checkmark",
      description: "Confirm / Success",
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      name: "Alert",
      description: "Warning / Attention",
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      name: "Help",
      description: "Assistance / Info",
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: "Settings",
      description: "Preferences / Config",
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ]

  return (
    <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-xl font-semibold text-foreground">Icon Set</h2>
        <span className="ml-auto text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-full">
          Medical / Accessible
        </span>
      </div>

      {/* Icon Guidelines */}
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="text-xs font-medium text-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
          Stroke Width: 2px
        </span>
        <span className="text-xs font-medium text-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
          Size: 32×32px
        </span>
        <span className="text-xs font-medium text-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
          Style: Outlined
        </span>
        <span className="text-xs font-medium text-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
          Touch: 44×44px
        </span>
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-3 gap-3">
        {icons.map((icon) => (
          <div 
            key={icon.name}
            className="group p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors duration-200 shadow-sm">
                {icon.svg}
              </div>
              <p className="mt-3 font-semibold text-foreground text-sm">{icon.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{icon.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Icon Usage Note */}
      <div className="mt-5 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs text-foreground">
          <strong>Design Principle:</strong> All icons use consistent 2px stroke weight for visibility. Icons are paired with text labels for accessibility. Touch targets extend beyond visual icon bounds.
        </p>
      </div>
    </section>
  )
}
