interface ToolLoadingProps {
  message?: string
  subMessage?: string
}

export function ToolLoading({
  message = 'Calculating your result...',
  subMessage = 'Comparing data from thousands of combinations',
}: ToolLoadingProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-6 py-10">
      {/* Spinner */}
      <div className="h-9 w-9 animate-spin rounded-full border-[2.5px] border-[var(--bg3)] border-t-[var(--mint)]" />
      <p className="text-[13px] text-[var(--t2)]">{message}</p>
      <p className="text-[12px] text-[var(--t3)]">{subMessage}</p>
    </div>
  )
}
