export interface HowToStep {
  title: string
  description: string
}

interface ToolHowToProps {
  steps: HowToStep[]
}

export function ToolHowTo({ steps }: ToolHowToProps) {
  return (
    <div>
      <h2 className="mb-4 text-[20px] font-medium text-[var(--t1)] sm:text-[22px]">
        How to use this tool
      </h2>
      <div className="flex flex-col">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex gap-[14px] py-4 ${
              i < steps.length - 1 ? 'border-b border-[var(--border)]' : ''
            }`}
          >
            <div className="mt-[1px] flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px] border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.1)] text-[12px] font-medium text-[var(--mint)]">
              {i + 1}
            </div>
            <div>
              <p className="mb-1 text-[14px] font-medium text-[var(--t1)]">{step.title}</p>
              <p className="text-[13px] leading-[1.6] text-[var(--t2)]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
