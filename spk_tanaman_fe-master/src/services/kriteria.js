import { api } from '../lib/api'

const data = (r) => r?.data

// body: { kode, parameter, bobot }
export const createKriteria = (body) =>
  api.post('/kriteria/create-kriteria', body).then(data)

export const getKriteria = () => api.get('/kriteria/get-kriteria').then(data)

export const getKriteriaById = (id) =>
  api.get(`/kriteria/get-kriteria/${id}`).then(data)

export const updateKriteria = (id, body) =>
  api.post(`/kriteria/update-kriteria/${id}`, body).then(data)

export const deleteKriteria = (id) =>
  api.post(`/kriteria/delete-kriteria/${id}`).then(data)

// Hitung ulang bobot_normalisasi seluruh kriteria.
export const normalizeKriteria = () =>
  api.post('/kriteria/normalize').then(data)
