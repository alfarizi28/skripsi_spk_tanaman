import { useState } from 'react'
import { useSpk } from '../store/SpkContext'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const EMPTY = { id: null, kriteria_id: '', sub_kriteria: '', bobot: '', deskripsi: '' }

const kidOf = (s) => s.kriteria?._id || s.kriteria_id

export default function SubKriteria() {
  const { kriteria, subkriteria, loading, createSub, updateSub, deleteSub } = useSpk()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  function openTambah(kriteriaId) {
    setForm({ ...EMPTY, kriteria_id: kriteriaId })
    setOpen(true)
  }
  function openEdit(s) {
    setForm({
      id: s._id,
      kriteria_id: kidOf(s),
      sub_kriteria: s.sub_kriteria,
      bobot: s.bobot,
      deskripsi: s.deskripsi || '',
    })
    setOpen(true)
  }
  async function simpan() {
    const sub = form.sub_kriteria.trim()
    const bobot = parseFloat(form.bobot)
    if (!sub || isNaN(bobot)) {
      alert('Isi nama sub kriteria dan bobot!')
      return
    }
    const body = {
      kriteria_id: form.kriteria_id,
      sub_kriteria: sub,
      bobot,
      deskripsi: form.deskripsi.trim(),
    }
    setSaving(true)
    const ok = form.id ? await updateSub(form.id, body) : await createSub(body)
    setSaving(false)
    if (ok) setOpen(false)
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-title">Data Sub Kriteria</div>

      {kriteria.length === 0 && (
        <div className="card text-center text-gray-400">
          Belum ada kriteria. Tambahkan kriteria terlebih dahulu.
        </div>
      )}

      {kriteria.map((k, ki) => {
        const subs = subkriteria.filter((s) => kidOf(s) === k._id)
        return (
          <div className="card" key={k._id}>
            <div className="mb-[18px] flex items-center justify-between">
              <span className="card-title">Tabel {k.parameter} (C{ki + 1})</span>
              <button className="btn btn-outline-green" onClick={() => openTambah(k._id)}>
                + TAMBAH DATA
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>No</th><th>Nama Sub Kriteria</th><th>Bobot</th><th>Deskripsi</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {subs.length === 0 && (
                  <tr><td colSpan={5} className="text-gray-400">Belum ada data</td></tr>
                )}
                {subs.map((s, si) => (
                  <tr key={s._id}>
                    <td>{si + 1}</td>
                    <td>{s.sub_kriteria}</td>
                    <td>{s.bobot}</td>
                    <td>{s.deskripsi || '-'}</td>
                    <td>
                      <div className="flex justify-center gap-1.5">
                        <button className="icon-btn icon-btn-edit" onClick={() => openEdit(s)}>✎</button>
                        <button
                          className="icon-btn icon-btn-del"
                          onClick={() => confirm('Hapus sub kriteria ini?') && deleteSub(s._id)}
                        >🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}

      <Modal
        open={open}
        title={form.id ? 'Edit Sub Kriteria' : 'Tambah Sub Kriteria'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn btn-batal" onClick={() => setOpen(false)}>BATAL</button>
            <button className="btn btn-primary" onClick={simpan} disabled={saving}>
              {saving ? 'MENYIMPAN…' : 'SIMPAN'}
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="form-label">Nama Sub Kriteria</label>
          <input
            className="form-control"
            placeholder="Masukkan Sub Kriteria"
            value={form.sub_kriteria}
            onChange={(e) => setForm({ ...form, sub_kriteria: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Bobot / Nilai</label>
          <input
            className="form-control"
            type="number"
            step="any"
            placeholder="1 - 4"
            value={form.bobot}
            onChange={(e) => setForm({ ...form, bobot: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Deskripsi (opsional)</label>
          <input
            className="form-control"
            placeholder="Keterangan"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  )
}
