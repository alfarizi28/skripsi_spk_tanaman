import { useState } from 'react'
import { useSpk } from '../store/SpkContext'
import Loading from '../components/Loading'

export default function Perangkingan() {
  const { nilaiAkhir, loading, proses, deleteNilaiAkhir } = useSpk()
  const [busy, setBusy] = useState(false)

  const ranked = [...nilaiAkhir].sort((a, b) => (a.ranking || 0) - (b.ranking || 0))

  async function jalankan() {
    setBusy(true)
    await proses()
    setBusy(false)
  }
  async function hapusPerangkingan() {
    if (!confirm('Hapus semua data perangkingan (nilai akhir)?')) return
    setBusy(true)
    await deleteNilaiAkhir()
    setBusy(false)
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-title">Hasil Akhir</div>
      <div className="card">
        <div className="mb-[18px] flex items-center justify-between">
          <span className="card-title">Tabel Perangkingan</span>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={jalankan} disabled={busy}>
              ⚙ PROSES
            </button>
            <button className="btn btn-danger" onClick={hapusPerangkingan} disabled={busy || ranked.length === 0}>
              🗑 HAPUS PERANGKINGAN
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Nama Alternatif</th><th>Total Weight Evaluation (WE)</th><th>Rank</th></tr>
          </thead>
          <tbody>
            {ranked.length === 0 && (
              <tr><td colSpan={3} className="text-gray-400">
                Belum ada hasil. Klik Proses untuk menghitung.
              </td></tr>
            )}
            {ranked.map((r) => (
              <tr key={r._id} className={r.ranking === 1 ? 'bg-amber-50 font-bold' : ''}>
                <td>{r.alternatif?.alternatif}</td>
                <td>{r.nilai_akhir}</td>
                <td>{r.ranking}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
