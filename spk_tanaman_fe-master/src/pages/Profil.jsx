import { useSpk } from '../store/SpkContext'

export default function Profil() {
  const { user } = useSpk()

  return (
    <div>
      <div className="page-title">Profil Saya</div>
      <div className="card mx-auto max-w-[480px]">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl">
            👤
          </div>
          <div className="text-lg font-bold">{user?.name || '-'}</div>
          <div className="text-[13px] text-gray-500">@{user?.username || '-'}</div>
        </div>
        <div className="mb-4">
          <label className="form-label !text-left">Nama</label>
          <input className="form-control" defaultValue={user?.name || ''} readOnly />
        </div>
        <div className="mb-4">
          <label className="form-label !text-left">Username</label>
          <input className="form-control" defaultValue={user?.username || ''} readOnly />
        </div>
        {user?.joined && (
          <div className="mb-4">
            <label className="form-label !text-left">Bergabung</label>
            <input className="form-control" defaultValue={user.joined} readOnly />
          </div>
        )}
      </div>
    </div>
  )
}
