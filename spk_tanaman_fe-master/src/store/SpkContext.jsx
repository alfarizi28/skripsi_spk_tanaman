import { createContext, useContext, useEffect, useState } from 'react'
import * as kriteriaService from '../services/kriteria'
import * as subkriteriaService from '../services/subkriteria'
import * as alternatifService from '../services/alternatif'
import * as rawInputService from '../services/rawInput'
import * as evaluasiFaktorService from '../services/evaluasiFaktor'
import * as nilaiAkhirService from '../services/nilaiAkhir'
import * as userService from '../services/user'

const SpkContext = createContext(null)

export function SpkProvider({ children }) {
  const [user, setUser] = useState(null)
  const [kriteria, setKriteria] = useState([])
  const [subkriteria, setSubkriteria] = useState([])
  const [alternatif, setAlternatif] = useState([])
  const [rawinput, setRawinput] = useState([])
  const [evaluasi, setEvaluasi] = useState([])
  const [nilaiAkhir, setNilaiAkhir] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ id: 0, msg: '', type: 'success' })

  function showToast(msg, type = 'success') {
    setToast((t) => ({ id: t.id + 1, msg, type }))
  }

  // ===== reload helpers =====
  const reloadKriteria = () => kriteriaService.getKriteria().then((d) => setKriteria(d || []))
  const reloadSubkriteria = () => subkriteriaService.getSubkriteria().then((d) => setSubkriteria(d || []))
  const reloadAlternatif = () => alternatifService.getAlternatif().then((d) => setAlternatif(d || []))
  const reloadRawinput = () => rawInputService.getRawInput().then((d) => setRawinput(d || []))
  const reloadEvaluasi = () => evaluasiFaktorService.getEvaluasi().then((d) => setEvaluasi(d || []))
  const reloadNilaiAkhir = () => nilaiAkhirService.getNilaiAkhir().then((d) => setNilaiAkhir(d || []))

  async function loadAll() {
    try {
      const [k, s, a, r, e, n] = await Promise.all([
        kriteriaService.getKriteria(),
        subkriteriaService.getSubkriteria(),
        alternatifService.getAlternatif(),
        rawInputService.getRawInput(),
        evaluasiFaktorService.getEvaluasi(),
        nilaiAkhirService.getNilaiAkhir(),
      ])
      setKriteria(k || [])
      setSubkriteria(s || [])
      setAlternatif(a || [])
      setRawinput(r || [])
      setEvaluasi(e || [])
      setNilaiAkhir(n || [])
      userService.getProfile().then(setUser).catch(() => {})
    } catch (err) {
      showToast(err.message || 'Gagal memuat data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll() // memuat data awal; setState terjadi async setelah fetch, bukan sinkron
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Jalankan mutasi → reload daftar terkait → toast. Return true bila sukses.
  async function mutate(fn, reloads, successMsg) {
    try {
      await fn()
      await Promise.all(reloads.map((r) => r()))
      if (successMsg) showToast(successMsg)
      return true
    } catch (err) {
      showToast(err.message || 'Terjadi kesalahan', 'error')
      return false
    }
  }

  const value = {
    user,
    kriteria,
    subkriteria,
    alternatif,
    rawinput,
    evaluasi,
    nilaiAkhir,
    loading,
    toast,
    showToast,
    refresh: loadAll,

    // Kriteria — bobot_normalisasi bergantung pada seluruh kriteria,
    // jadi setiap mutasi langsung diikuti normalize().
    createKriteria: (b) =>
      mutate(
        async () => {
          await kriteriaService.createKriteria(b)
          await kriteriaService.normalizeKriteria()
        },
        [reloadKriteria],
        'Data Kriteria Berhasil Ditambahkan.'
      ),
    updateKriteria: (id, b) =>
      mutate(
        async () => {
          await kriteriaService.updateKriteria(id, b)
          await kriteriaService.normalizeKriteria()
        },
        [reloadKriteria],
        'Data Kriteria Berhasil Diubah.'
      ),
    deleteKriteria: (id) =>
      mutate(
        async () => {
          await kriteriaService.deleteKriteria(id)
          await kriteriaService.normalizeKriteria()
        },
        [reloadKriteria, reloadSubkriteria],
        'Data Kriteria Berhasil Dihapus.'
      ),

    // Sub kriteria
    createSub: (b) =>
      mutate(() => subkriteriaService.createSubkriteria(b), [reloadSubkriteria], 'Sub Kriteria Berhasil Ditambahkan.'),
    updateSub: (id, b) =>
      mutate(() => subkriteriaService.updateSubkriteria(id, b), [reloadSubkriteria], 'Sub Kriteria Berhasil Diubah.'),
    deleteSub: (id) =>
      mutate(() => subkriteriaService.deleteSubkriteria(id), [reloadSubkriteria], 'Sub Kriteria Berhasil Dihapus.'),

    // Alternatif
    createAlt: (b) =>
      mutate(() => alternatifService.createAlternatif(b), [reloadAlternatif], 'Data Alternatif Berhasil Ditambahkan.'),
    updateAlt: (id, b) =>
      mutate(() => alternatifService.updateAlternatif(id, b), [reloadAlternatif], 'Data Alternatif Berhasil Diubah.'),
    deleteAlt: (id) =>
      mutate(() => alternatifService.deleteAlternatif(id), [reloadAlternatif, reloadRawinput], 'Data Alternatif Berhasil Dihapus.'),

    // Raw input (penilaian) — upsert banyak baris untuk satu alternatif.
    saveRawInputBatch: (altId, entries) =>
      mutate(
        async () => {
          for (const e of entries) {
            const body = {
              alternatif_id: altId,
              kriteria_id: e.kriteria_id,
              subkriteria_id: e.subkriteria_id,
              nilai_input: e.nilai_input,
            }
            if (e.existingId) await rawInputService.updateRawInput(e.existingId, body)
            else await rawInputService.createRawInput(body)
          }
        },
        [reloadRawinput],
        'Data Penilaian Berhasil Disimpan.'
      ),
    deleteAllRawInput: () =>
      mutate(
        async () => {
          for (const r of rawinput) await rawInputService.deleteRawInput(r._id)
        },
        [reloadRawinput, reloadEvaluasi, reloadNilaiAkhir],
        'Data Penilaian Berhasil Dihapus.'
      ),

    // Proses perhitungan penuh
    proses: () =>
      mutate(
        async () => {
          await kriteriaService.normalizeKriteria()
          await evaluasiFaktorService.hitungEvaluasiFaktor()
          await nilaiAkhirService.hitungNilaiAkhir()
        },
        [reloadKriteria, reloadEvaluasi, reloadNilaiAkhir],
        'Perhitungan berhasil diproses.'
      ),

    // Hapus seluruh data evaluasi faktor.
    deleteEvaluasi: () =>
      mutate(
        () => evaluasiFaktorService.deleteAllEvaluasi(),
        [reloadEvaluasi],
        'Data evaluasi faktor berhasil dihapus.'
      ),

    // Hapus seluruh data nilai akhir (perangkingan).
    deleteNilaiAkhir: () =>
      mutate(
        () => nilaiAkhirService.deleteAllNilaiAkhir(),
        [reloadNilaiAkhir],
        'Data perangkingan berhasil dihapus.'
      ),
  }

  return <SpkContext.Provider value={value}>{children}</SpkContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSpk() {
  const ctx = useContext(SpkContext)
  if (!ctx) throw new Error('useSpk harus dipakai di dalam <SpkProvider>')
  return ctx
}
