import { api } from '../lib/api'

const data = (r) => r?.data

// body: { kode, alternatif }
export const createAlternatif = (body) =>
  api.post('/alternatif/create-alternatif', body).then(data)

export const getAlternatif = () => api.get('/alternatif/get-alternatif').then(data)

export const getAlternatifById = (id) =>
  api.get(`/alternatif/get-alternatif/${id}`).then(data)

export const updateAlternatif = (id, body) =>
  api.post(`/alternatif/update-alternatif/${id}`, body).then(data)

export const deleteAlternatif = (id) =>
  api.post(`/alternatif/delete-alternatif/${id}`).then(data)
