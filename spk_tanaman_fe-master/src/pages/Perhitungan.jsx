import { useState } from 'react'
import { useSpk } from '../store/SpkContext'
import Loading from '../components/Loading'

export default function Perhitungan() {
  const { kriteria, alternatif, rawinput, evaluasi, nilaiAkhir, loading, proses, deleteEvaluasi, deleteNilaiAkhir } = useSpk()
  const [processing, setProcessing] = useState(false)

  async function jalankan() {
    setProcessing(true)
    await proses()
    setProcessing(false)
  }
  async function hapusEvaluasi() {
    if (!confirm('Hapus semua data evaluasi faktor?')) return
    setProcessing(true)
    await deleteEvaluasi()
    setProcessing(false)
  }
  async function hapusPerangkingan() {
    if (!confirm('Hapus semua data perangkingan (nilai akhir)?')) return
    setProcessing(true)
    await deleteNilaiAkhir()
    setProcessing(false)
  }

  if (loading) return <Loading />

  const headers = kriteria.map((k, i) => (
    <th key={k._id} title={k.parameter}>C{i + 1}</th>
  ))

  // pivot: cari nilai untuk (alternatif, kriteria)
  const rawVal = (aId, kId) =>
    rawinput.find((r) => r.alternatif?._id === aId && r.kriteria?._id === kId)?.nilai_input
  const evalVal = (aId, kId) =>
    evaluasi.find((e) => e.alternatif?._id === aId && e.kriteria?._id === kId)?.nilai_evaluasi

  const sudahHitung = evaluasi.length > 0 || nilaiAkhir.length > 0

  return (
    <div>
      <div className="page-title">Detail Perhitungan MFEP</div>

      <div className="mb-5 flex justify-end">
        <button className="btn btn-primary" onClick={jalankan} disabled={processing}>
          {processing ? 'MEMPROSES…' : '⚙ PROSES PERHITUNGAN'}
        </button>
      </div>

      <div className="card">
        <div className="mb-[18px] flex items-center justify-between">
          <span className="card-title">Rating Kecocokan (Nilai Penilaian)</span>
        </div>
        <div className="formula-box">Nilai input setiap alternatif terhadap masing-masing kriteria.</div>
        <table className="data-table">
          <thead><tr><th>No</th><th>Nama Alternatif</th>{headers}</tr></thead>
          <tbody>
            {alternatif.map((a, ai) => (
              <tr key={a._id}>
                <td>{ai + 1}</td>
                <td>{a.alternatif}</td>
                {kriteria.map((k) => <td key={k._id}>{rawVal(a._id, k._id) ?? '-'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!sudahHitung ? (
        <div className="card text-center text-gray-500">
          Belum ada hasil perhitungan. Klik <strong>Proses Perhitungan</strong> untuk
          menghitung evaluasi faktor &amp; nilai akhir.
        </div>
      ) : (
        <>
          <div className="card">
            <div className="mb-[18px] flex items-center justify-between">
              <span className="card-title">Matriks Factor Evaluation (FE)</span>
              <button
                className="btn btn-danger"
                onClick={hapusEvaluasi}
                disabled={processing || evaluasi.length === 0}
              >
                🗑 HAPUS EVALUASI
              </button>
            </div>
            <div className="formula-box">FE = nilai input ternormalisasi per kriteria.</div>
            <table className="data-table">
              <thead><tr><th>No</th><th>Nama Alternatif</th>{headers}</tr></thead>
              <tbody>
                {alternatif.map((a, ai) => (
                  <tr key={a._id}>
                    <td>{ai + 1}</td>
                    <td>{a.alternatif}</td>
                    {kriteria.map((k) => {
                      const v = evalVal(a._id, k._id)
                      return <td key={k._id}>{v != null ? v : '-'}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="mb-[18px] flex items-center justify-between">
              <span className="card-title">Weight Evaluation (WE) &amp; Total</span>
              <button
                className="btn btn-danger"
                onClick={hapusPerangkingan}
                disabled={processing || nilaiAkhir.length === 0}
              >
                🗑 HAPUS PERANGKINGAN
              </button>
            </div>
            <div className="formula-box">WE = bobot normalisasi (FW) × FE &nbsp;|&nbsp; Total = Σ WE</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th><th>Nama Alternatif</th>{headers}
                  <th>Total (WE)</th><th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {nilaiAkhir.map((row, i) => {
                  const beByKid = Object.fromEntries(
                    (row.bobot_evaluasi || []).map((b) => [b.kriteria?._id, b.nilai_bobot_evaluasi])
                  )
                  return (
                    <tr key={row._id} className={row.ranking === 1 ? 'bg-amber-50 font-bold' : ''}>
                      <td>{i + 1}</td>
                      <td>{row.alternatif?.alternatif}</td>
                      {kriteria.map((k) => {
                        const v = beByKid[k._id]
                        return <td key={k._id}>{v != null ? v : '-'}</td>
                      })}
                      <td>{row.nilai_akhir}</td>
                      <td>{row.ranking}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
