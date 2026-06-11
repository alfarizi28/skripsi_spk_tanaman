// Modal generik: overlay + kartu + header/body/footer.
export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45"
      onClick={onClose}
    >
      <div
        className="w-[480px] max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-[10px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 pb-3.5 pt-[18px]">
          <h3 className="text-base font-bold">{title}</h3>
        </div>
        <div className="px-6 py-[18px]">{children}</div>
        <div className="flex justify-center gap-2.5 px-6 pb-[18px] pt-3">
          {footer}
        </div>
      </div>
    </div>
  )
}
