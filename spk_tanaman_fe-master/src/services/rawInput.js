import { api } from '../lib/api'

const data = (r) => r?.data

// body: { alternatif_id, kriteria_id, subkriteria_id, nilai_input }
export const createRawInput = (body) =>
  api.post('/raw-input/create-rawinput', body).then(data)

export const getRawInput = () => api.get('/raw-input/get-rawinput').then(data)

export const getRawInputById = (id) =>
  api.get(`/raw-input/get-rawinput/${id}`).then(data)

export const updateRawInput = (id, body) =>
  api.post(`/raw-input/update-rawinput/${id}`, body).then(data)

export const deleteRawInput = (id) =>
  api.post(`/raw-input/delete-rawinput/${id}`).then(data)
