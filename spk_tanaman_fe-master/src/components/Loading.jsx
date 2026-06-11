export default function Loading({ text = 'Memuat data…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-primary" />
      <span className="text-[13px]">{text}</span>
    </div>
  )
}
