export function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-2 text-sm text-destructive">
      {message}
      <button type="button" onClick={onRetry} className="rounded-md border px-3 py-1 text-sm">
        Retry
      </button>
    </div>
  )
}
