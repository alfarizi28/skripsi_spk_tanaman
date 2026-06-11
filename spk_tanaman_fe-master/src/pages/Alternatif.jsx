import { useState } from 'react'
import { useSpk } from '../store/SpkContext'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const EMPTY = { id: null, kode: '', alternatif: '' }

export default function Alternatif() {
  const { alternatif, loading, createAlt, updateAlt, deleteAlt } = useSpk()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  function openTambah() {
    setForm(EMPTY)
    setOpen(true)
  }
  function openEdit(a) {
    setForm({ id: a._id, kode: a.kode, alternatif: a.alternatif })
    setOpen(true)
  }
  async function simpan() {
    const kode = form.kode.trim()
    const nama = form.alternatif.trim()
    if (!kode || !nama) {
      alert('Isi semua field!')
      return
    }
    setSaving(true)
    const ok = form.id
      ? await updateAlt(form.id, { kode, alternatif: nama })
      : await createAlt({ kode, alternatif: nama })
    setSaving(false)
    if (ok) setOpen(false)
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="page-title">Data Alternatif</div>
      <div className="card">
        <div className="mb-[18px] flex items-center justify-between">
          <span className="card-title">Tabel Data Alternatif</span>
          <button className="btn btn-primary" onClick={openTambah}>+ TAMBAH DATA</button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>No</th><th>Kode</th><th>Nama Alternatif</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {alternatif.length === 0 && (
              <tr><td colSpan={4} className="text-gray-400">Belum ada data</td></tr>
            )}
            {alternatif.map((a, i) => (
              <tr key={a._id}>
                <td>{i + 1}</td>
                <td>{a.kode}</td>
                <td>{a.alternatif}</td>
                <td>
                  <div className="flex justify-center gap-1.5">
                    <button className="icon-btn icon-btn-edit" onClick={() => openEdit(a)}>✎</button>
                    <button
                      className="icon-btn icon-btn-del"
                      onClick={() => confirm('Hapus alternatif ini?') && deleteAlt(a._id)}
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
        title={form.id ? 'Edit Data Alternatif' : 'Tambah Data Alternatif'}
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
            placeholder="A1"
            value={form.kode}
            onChange={(e) => setForm({ ...form, kode: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Nama Alternatif</label>
          <input
            className="form-control"
            placeholder="Nama Tanaman"
            value={form.alternatif}
            onChange={(e) => setForm({ ...form, alternatif: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  )
}
