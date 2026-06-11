import { api } from '../lib/api'

const data = (r) => r?.data

// Menghitung nilai akhir + ranking semua alternatif. Return { total }.
export const hitungNilaiAkhir = () => api.post('/nilai-akhir/hitung').then(data)

export const getNilaiAkhir = () =>
  api.get('/nilai-akhir/get-nilai-akhir').then(data)

// Versi publik (tanpa token) untuk landing page sebelum login.
export const getNilaiAkhirPublic = () =>
  api.get('/nilai-akhir/public/get-nilai-akhir', { auth: false }).then(data)

export const getNilaiAkhirByAlternatifId = (alternatifId) =>
  api.get(`/nilai-akhir/get-nilai-akhir/alternatif/${alternatifId}`).then(data)

// Menghapus seluruh data nilai akhir.
export const deleteAllNilaiAkhir = () =>
  api.post('/nilai-akhir/delete-nilai-akhir').then(data)
