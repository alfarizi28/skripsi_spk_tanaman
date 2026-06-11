import { useState } from 'react'
import { login, register } from '../services/auth'

const BG = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80'

const inputCls =
  'mb-3 w-full rounded-md border-[1.5px] border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-accent'

export default function LoginPage({ onLogin, onBack }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const isRegister = mode === 'register'

  function switchMode(next) {
    setMode(next)
    setError('')
    setInfo('')
    setPassword('')
  }

  async function submit() {
    setError('')
    setInfo('')
    if (isRegister) {
      if (!name.trim() || !username.trim() || !password) {
        setError('Isi nama, username, dan password!')
        return
      }
      if (password.length < 6) {
        setError('Password minimal 6 karakter.')
        return
      }
      setLoading(true)
      try {
        await register({ name: name.trim(), username: username.trim(), password })
        setInfo('Pendaftaran berhasil! Silakan login.')
        setMode('login')
        setName('')
        setPassword('')
      } catch (err) {
        setError(err.message || 'Pendaftaran gagal')
      } finally {
        setLoading(false)
      }
      return
    }

    // login
    if (!username.trim() || !password.trim()) {
      setError('Isi username dan password!')
      return
    }
    setLoading(true)
    try {
      const res = await login({ username: username.trim(), password }, remember)
      onLogin(res?.data || null)
    } catch (err) {
      setError(err.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${BG}')` }}
    >
      <div className="absolute inset-0 bg-black/35" />
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-5 top-5 z-10 rounded-md bg-white/90 px-3.5 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-white"
        >
          ← Kembali
        </button>
      )}
      <div className="relative z-10 w-[340px] overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="bg-accent px-5 py-[18px] text-center text-[15px] font-semibold leading-relaxed text-white">
          SPK Pemilihan Jenis Tanaman Pangan
          <br />
          {isRegister ? 'Daftar Akun Baru' : 'Menggunakan Metode MFEP'}
        </div>
        <div className="px-6 pb-5 pt-6">
          {error && (
            <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-[13px] text-danger">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-3 rounded-md bg-green-50 px-3 py-2 text-[13px] text-primary">
              {info}
            </div>
          )}

          {isRegister && (
            <input
              className={inputCls}
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className={inputCls}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-md border-[1.5px] border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-accent"
              placeholder={isRegister ? 'Password (min. 6 karakter)' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 text-base text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {!isRegister && (
            <div className="mb-[18px] flex items-center gap-2 text-[13px] text-gray-600">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className={`relative h-[18px] w-[34px] rounded-full transition-colors ${
                  remember ? 'bg-accent' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all ${
                    remember ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </button>
              <span>Remember me</span>
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full cursor-pointer rounded-md bg-accent py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-accent-dark disabled:opacity-60 ${
              isRegister ? 'mt-2' : ''
            }`}
          >
            {loading ? 'MEMPROSES…' : isRegister ? 'DAFTAR' : 'LOGIN'}
          </button>

          <div className="mt-4 text-center text-[13px] text-gray-600">
            {isRegister ? (
              <>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-accent hover:underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-accent hover:underline"
                >
                  Daftar
                </button>
              </>
            )}
          </div>
        </div>
        <div className="border-t border-gray-100 py-2.5 text-center text-xs text-gray-400">
          © 2026, made by{' '}
          <a href="#" className="font-semibold text-accent">
            Ahmad Lutfi Farizi
          </a>
        </div>
      </div>
    </div>
  )
}
