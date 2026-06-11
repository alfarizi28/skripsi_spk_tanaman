import { useState } from 'react'
import { useSpk } from '../store/SpkContext'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const kidOf = (s) => s.kriteria?._id || s.kriteria_id

export default function Penilaian() {
  const { kriteria, subkriteria, alternatif, rawinput, loading, saveRawInputBatch } = useSpk()
  const [alt, setAlt] = useState(null) // alternatif terpilih
  const [pick, setPick] = useState({}) // { [kriteriaId]: subkriteriaId }
  const [saving, setSaving] = useState(false)

  function openUbah(a) {
    setAlt(a)
    const initial = {}
    kriteria.forEach((k) => {
      const existing = rawinput.find(
        (r) => r.alternatif?._id === a._id && r.kriteria?._id === k._id
      )
      const subs = subkriteria.filter((s) => kidOf(s) === k._id)
      initial[k._id] = existing?.subkriteria?._id || subs[0]?._id || ''
    })
    setPick(initial)
  }

  async function simpan() {
    const entries = []
    for (const k of kriteria) {
      const subId = pick[k._id]
      if (!subId) continue
      const sub = subkriteria.find((s) => s._id === subId)
      const existing = rawinput.find(
        (r) => r.alternatif?._id === alt._id && r.kriteria?._id === k._id
      )
      entries.push({
        kriteria_id: k._id,
        subkriteria_id: subId,
        nilai_input: sub ? sub.bobot : 0,
        existingId: existing?._id,
      })
    }
    setSaving(true)
    const ok = await saveRawInputBatch(alt._id, entries)
    setSaving(false)
    if (ok) setAlt(null)
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-title">Input Data Penilaian</div>
      <div className="card">
        <div className="mb-[18px] flex items-center justify-between">
          <span className="card-title">Tabel Data Penilaian</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>No</th><th>Data Alternatif</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {alternatif.length === 0 && (
              <tr><td colSpan={3} className="text-gray-400">Belum ada alternatif</td></tr>
            )}
            {alternatif.map((a, i) => (
              <tr key={a._id}>
                <td>{i + 1}</td>
                <td>{a.alternatif}</td>
                <td>
                  <button className="icon-btn icon-btn-ubah" onClick={() => openUbah(a)}>
                    UBAH
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={alt !== null}
        title={`Data Penilaian ${alt?.alternatif || ''}`}
        onClose={() => setAlt(null)}
        footer={
          <>
            <button className="btn btn-batal" onClick={() => setAlt(null)}>BATAL</button>
            <button className="btn btn-primary" onClick={simpan} disabled={saving}>
              {saving ? 'MENYIMPAN…' : 'SIMPAN'}
            </button>
          </>
        }
      >
        {kriteria.map((k) => {
          const subs = subkriteria.filter((s) => kidOf(s) === k._id)
          return (
            <div className="mb-4" key={k._id}>
              <label className="form-label">{k.parameter}</label>
              <select
                className="form-control"
                value={pick[k._id] || ''}
                onChange={(e) => setPick({ ...pick, [k._id]: e.target.value })}
              >
                {subs.length === 0 && <option value="">(belum ada sub kriteria)</option>}
                {subs.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.sub_kriteria} ({s.bobot})
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </Modal>
    </div>
  )
}
