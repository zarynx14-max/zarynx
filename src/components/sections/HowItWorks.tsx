const steps = [
  {
    n: '1',
    title: 'Pick your tool',
    desc: 'Browse 22 free gaming tools by category — PC, sensitivity, game-specific, and more.',
  },
  {
    n: '2',
    title: 'Enter your details',
    desc: 'Input your specs, settings, or game info. No account needed, no personal data collected.',
  },
  {
    n: '3',
    title: 'Get instant results',
    desc: 'Use your score, comparison, or recommendation to upgrade your setup and dominate.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg2)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-[var(--t1)]">
            Three steps, zero friction
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-xl border border-[var(--border)] sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`relative bg-[var(--bg)] p-5 ${
                i < steps.length - 1
                  ? 'border-b border-[var(--border)] sm:border-b-0 sm:border-r'
                  : ''
              }`}
            >
              {/* Arrow connector on desktop */}
              {i < steps.length - 1 && (
                <span className="absolute -right-[9px] top-1/2 z-10 hidden -translate-y-1/2 text-[14px] text-[var(--t3)] sm:block">
                  →
                </span>
              )}

              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-[8px] border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.1)] text-[12px] font-medium text-[var(--mint)]">
                {step.n}
              </div>
              <h3 className="mb-2 text-[13px] font-medium text-[var(--t1)]">
                {step.title}
              </h3>
              <p className="text-[12px] leading-[1.55] text-[var(--t2)]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
