import { useState } from 'react'
import { useSpk } from '../store/SpkContext'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const EMPTY = { id: null, kode: '', parameter: '', bobot: '' }

export default function Kriteria() {
  const { kriteria, loading, createKriteria, updateKriteria, deleteKriteria } = useSpk()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  function openTambah() {
    setForm(EMPTY)
    setOpen(true)
  }
  function openEdit(k) {
    setForm({ id: k._id, kode: k.kode, parameter: k.parameter, bobot: k.bobot })
    setOpen(true)
  }
  async function simpan() {
    const kode = form.kode.trim()
    const parameter = form.parameter.trim()
    const bobot = parseFloat(form.bobot)
    if (!kode || !parameter || isNaN(bobot)) {
      alert('Isi semua field!')
      return
    }
    setSaving(true)
    const ok = form.id
      ? await updateKriteria(form.id, { kode, parameter, bobot })
      : await createKriteria({ kode, parameter, bobot })
    setSaving(false)
    if (ok) setOpen(false)
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-title">Data Kriteria</div>
      <div className="card">
        <div className="mb-[18px] flex items-center justify-between">
          <span className="card-title">Tabel Data Kriteria</span>
          <button className="btn btn-primary" onClick={openTambah}>
            + TAMBAH DATA
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Kode</th>
              <th>Nama Kriteria</th>
              <th>Bobot (FW)</th>
              <th>Bobot Normalisasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kriteria.length === 0 && (
              <tr><td colSpan={6} className="text-gray-400">Belum ada data</td></tr>
            )}
            {kriteria.map((k, i) => (
              <tr key={k._id}>
                <td>{i + 1}</td>
                <td>{k.kode}</td>
                <td>{k.parameter}</td>
                <td>{k.bobot}</td>
                <td>{k.bobot_normalisasi ?? '-'}</td>
                <td>
                  <div className="flex justify-center gap-1.5">
                    <button className="icon-btn icon-btn-edit" onClick={() => openEdit(k)}>✎</button>
                    <button
                      className="icon-btn icon-btn-del"
                      onClick={() => confirm('Hapus kriteria ini?') && deleteKriteria(k._id)}
                    >🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={form.id ? 'Edit Data Kriteria' : 'Tambah Data Kriteria'}
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
          <label className="form-label">Kode</label>
          <input
            className="form-control"
            placeholder="k1"
            value={form.kode}
            onChange={(e) => setForm({ ...form, kode: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Nama Kriteria</label>
          <input
            className="form-control"
            placeholder="Nama Kriteria"
            value={form.parameter}
            onChange={(e) => setForm({ ...form, parameter: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Bobot (FW)</label>
          <input
            className="form-control"
            type="number"
            step="any"
            min="0"
            placeholder="0"
            value={form.bobot}
            onChange={(e) => setForm({ ...form, bobot: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  )
}
