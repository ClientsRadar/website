export function Header() {
  return (
    <header className="text-center mb-12">
      {/* Logo placeholder */}
      <div className="flex justify-start mb-8">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-primary rounded"></div>
        </div>
      </div>

      {/* Main heading */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
        Discover Untapped Website Leads in Seconds!
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
        Clients Radar helps you spot low-competition, spam-heavy websites across any niche — instantly.
      </p>

      {/* Tagline space */}
      <div className="h-6"></div>
    </header>
  )
}
