import { api } from '../lib/api'

const data = (r) => r?.data

// Menghitung evaluasi faktor (nilai_input ternormalisasi). Return { total }.
export const hitungEvaluasiFaktor = () =>
  api.post('/evaluasi-faktor/hitung').then(data)

export const getEvaluasi = () =>
  api.get('/evaluasi-faktor/get-evaluasi').then(data)

export const getEvaluasiByKriteriaId = (kriteriaId) =>
  api.get(`/evaluasi-faktor/get-evaluasi/kriteria/${kriteriaId}`).then(data)

// Menghapus seluruh data evaluasi faktor.
export const deleteAllEvaluasi = () =>
  api.post('/evaluasi-faktor/delete-evaluasi').then(data)
