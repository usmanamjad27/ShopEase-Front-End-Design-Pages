export default function Loader() {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-3" role="status">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/20 border-t-brand" />
      <span className="text-sm text-muted">Finding your next favorite...</span>
      <span className="sr-only">Loading products</span>
    </div>
  );
}
