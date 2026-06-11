import { useEffect, useState } from 'react'
import { useSpk } from '../store/SpkContext'

export default function Toast() {
  const { toast } = useSpk()
  const [dismissedId, setDismissedId] = useState(0)

  useEffect(() => {
    if (!toast.id) return undefined
    const t = setTimeout(() => setDismissedId(toast.id), 3000)
    return () => clearTimeout(t)
  }, [toast.id])

  const show = toast.id !== 0 && toast.id !== dismissedId
  const isError = toast.type === 'error'

  return (
    <div
      className={`fixed right-4 top-4 z-[9999] flex min-w-[260px] items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-[18px] py-3 text-[13px] shadow-lg transition-transform duration-300 ${
        show ? 'translate-x-0' : 'translate-x-[120%]'
      }`}
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[15px] ${
          isError ? 'bg-red-50 text-danger' : 'bg-green-50 text-primary'
        }`}
      >
        {isError ? '✕' : '✓'}
      </div>
      <div>
        <div className="font-bold">{isError ? 'Gagal' : 'Success'}</div>
        <div className="text-xs text-gray-500">{toast.msg}</div>
      </div>
    </div>
  )
}
