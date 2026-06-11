// Fetch wrapper untuk backend SPK Tanaman.
// Base URL diambil dari VITE_API_URL (lihat .env), fallback ke localhost:3000.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TOKEN_KEY = 'token'

// Token dibaca dari localStorage (remember me) maupun sessionStorage (sesi sekali pakai).
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

// remember = true → localStorage (bertahan setelah browser ditutup)
// remember = false → sessionStorage (hilang saat tab/browser ditutup)
export function setToken(token, remember = false) {
  clearToken()
  if (!token) return
  if (remember) localStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Inti dari semua request.
 * @param {string} path  contoh: '/kriteria/get-kriteria'
 * @param {object} [opts]
 * @param {string} [opts.method='GET']
 * @param {object} [opts.body]    di-stringify jadi JSON
 * @param {boolean} [opts.auth=true]  sisipkan Bearer token
 */
export async function request(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const finalHeaders = { ...headers }
  const init = { method, headers: finalHeaders }

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }

  if (auth) {
    const token = getToken()
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, init)

  // Coba parse JSON; sebagian endpoint mungkin balas kosong.
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message = (data && data.message) || res.statusText || 'Request gagal'
    throw new ApiError(message, res.status, data)
  }

  return data
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}
