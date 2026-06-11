import { PAGE_LABELS } from '../nav'

export default function Topbar({ page, onNavigate, onLogout }) {
  return (
    <div className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="text-[13px] text-gray-500">
        <button
          className="text-primary hover:underline"
          onClick={() => onNavigate('dashboard')}
        >
          Beranda
        </button>
        {page !== 'dashboard' && (
          <span> / {PAGE_LABELS[page] || page}</span>
        )}
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 rounded-md border-[1.5px] border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-gray-800 transition hover:bg-gray-100"
      >
        LOG OUT →
      </button>
    </div>
  )
}
