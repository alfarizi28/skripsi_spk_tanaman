import { NAV } from '../nav'

export default function Sidebar({ page, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 z-[100] flex h-screen w-[220px] flex-col overflow-y-auto bg-primary">
      <div className="flex items-center gap-2.5 border-b border-white/15 px-4 py-[18px] text-sm font-bold text-white">
        <span className="text-[22px]">🌿</span>
        <span>SPK - Jenis Tanaman</span>
      </div>
      <nav className="flex-1 py-2">
        {NAV.map((item, i) =>
          item.section ? (
            <div
              key={`s-${i}`}
              className="px-3.5 pb-1 pt-3 text-[11px] font-bold tracking-wide text-white/55"
            >
              {item.section}
            </div>
          ) : (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-2.5 border-l-[3px] px-4 py-2.5 text-left text-[13px] transition ${
                page === item.id
                  ? 'border-white bg-white/[0.18] font-semibold text-white'
                  : 'border-transparent text-white/[0.88] hover:bg-white/10'
              }`}
            >
              <span className="w-[18px] text-center text-base">{item.icon}</span>
              {item.label}
            </button>
          )
        )}
      </nav>
    </aside>
  )
}
