import { api, setToken, clearToken } from '../lib/api'

// Catatan: register/login tidak butuh Bearer token (auth: false).
export function register({ name, username, password }) {
  return api.post('/register', { name, username, password }, { auth: false })
}

export async function login({ username, password }, remember = false) {
  const res = await api.post('/login', { username, password }, { auth: false })
  // Backend membungkus token di res.data.token (lihat script test Postman).
  const token = res?.data?.token
  if (token) setToken(token, remember)
  return res
}

export async function logout() {
  try {
    return await api.post('/logout')
  } finally {
    clearToken()
  }
}
