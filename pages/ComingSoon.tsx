
const ComingSoonStandalone = () => {

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-primary/25 to-accent/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-accent/25 to-primary/20 blur-3xl" />

      <header className="container mx-auto flex items-center justify-between py-6">
        <a href="/" className="font-semibold text-lg tracking-tight text-foreground">
          <span className="text-primary">wazifa</span>
          <span className="text-accent">ME</span>
        </a>
        <nav aria-label="primary" className="text-sm text-muted-foreground">
          Coming Soon
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 py-24">
          <div className="mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-tr from-primary to-accent bg-clip-text text-transparent">Employer Dashboard</span> — Coming Soon
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We’re crafting a smart, elegant employer dashboard to make hiring in Egypt & beyond effortless and professional.
            </p>

            <ul className="mx-auto mt-2 flex max-w-xl flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                {/* Briefcase icon (inline SVG) */}
                <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M3 13h18" />
                </svg>
                Curated opportunities
              </li>
              <li className="flex items-center gap-2">
               
                <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3v4M3 5h4" />
                  <path d="M19 11v4M17 13h4" />
                  <path d="M11 5l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
                </svg>
                Smart matching
              </li>
              <li className="flex items-center gap-2">
               
                <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
                  <path d="M10.3 21a1.7 1.7 0 0 0 3.4 0" />
                </svg>
                Instant alerts
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 pb-12 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} WazifaME · All rights reserved
      </footer>
    </div>
  );
};

export default ComingSoonStandalone;