import { api } from '../lib/api'

const data = (r) => r?.data

// body: { kriteria_id, sub_kriteria, bobot, deskripsi? }
export const createSubkriteria = (body) =>
  api.post('/sub-kriteria/create-subkriteria', body).then(data)

export const getSubkriteria = () =>
  api.get('/sub-kriteria/get-subkriteria').then(data)

export const getSubkriteriaById = (id) =>
  api.get(`/sub-kriteria/get-subkriteria/${id}`).then(data)

export const getSubkriteriaByKriteriaId = (kriteriaId) =>
  api.get(`/sub-kriteria/get-subkriteria/kriteria/${kriteriaId}`).then(data)

export const updateSubkriteria = (id, body) =>
  api.post(`/sub-kriteria/update-subkriteria/${id}`, body).then(data)

export const deleteSubkriteria = (id) =>
  api.post(`/sub-kriteria/delete-subkriteria/${id}`).then(data)
