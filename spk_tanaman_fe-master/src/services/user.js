import { api } from '../lib/api'

export const getProfile = () => api.get('/user/get-profile').then((r) => r?.data)
