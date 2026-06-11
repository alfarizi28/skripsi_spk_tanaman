import { useEffect, useState } from 'react'
import { getNilaiAkhirPublic } from '../services/nilaiAkhir'

// Foto lokal — ganti file di folder public/ dengan nama yang sama untuk mengubah gambar.
const HERO_BG = '/hero.jpg'
const DESA_FOTO = '/desa.jpg'

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'nilai-akhir', label: 'Nilai Akhir' },
]

const FITUR = [
  {
    icon: '🎯',
    title: 'Keputusan Objektif',
    desc: 'Rekomendasi tanaman didasarkan pada perhitungan bobot kriteria, bukan perkiraan semata.',
  },
  {
    icon: '⚡',
    title: 'Proses Cepat',
    desc: 'Perangkingan seluruh alternatif tanaman dihitung otomatis hanya dalam sekali proses.',
  },
  {
    icon: '📊',
    title: 'Metode MFEP',
    desc: 'Menggunakan Multifactor Evaluation Process yang teruji untuk pengambilan keputusan multikriteria.',
  },
  {
    icon: '🌱',
    title: 'Khusus Tanaman Pangan',
    desc: 'Dirancang untuk membantu menentukan jenis tanaman pangan terbaik sesuai kondisi desa.',
  },
  {
    icon: '🔍',
    title: 'Transparan',
    desc: 'Setiap nilai dan peringkat dapat ditelusuri dari kriteria hingga hasil akhirnya.',
  },
  {
    icon: '🖥️',
    title: 'Mudah Diakses',
    desc: 'Hasil perangkingan dapat dilihat publik tanpa login, kapan pun dibutuhkan.',
  },
]

const LANGKAH = [
  { title: 'Tentukan Kriteria', desc: 'Tetapkan kriteria penilaian beserta bobot kepentingannya.' },
  { title: 'Input Alternatif', desc: 'Masukkan jenis tanaman pangan yang akan dibandingkan.' },
  { title: 'Beri Penilaian', desc: 'Isi nilai tiap alternatif terhadap setiap kriteria.' },
  { title: 'Lihat Peringkat', desc: 'Sistem menghitung dan menampilkan tanaman terbaik.' },
]

export default function LandingPage({ onLoginClick }) {
  const [page, setPage] = useState('dashboard')

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6fa]">
      <Navbar page={page} onNavigate={setPage} onLoginClick={onLoginClick} />
      <main className="flex-1">
        {page === 'dashboard' ? (
          <DashboardSection onMulai={() => setPage('nilai-akhir')} />
        ) : (
          <NilaiAkhirSection />
        )}
      </main>
      <footer className="border-t border-gray-200 bg-white py-3.5 text-center text-xs text-gray-500">
        © 2026, made by{' '}
        <a href="#" className="font-semibold text-accent">
          Ahmad Lutfi Farizi
        </a>
      </footer>
    </div>
  )
}

function Navbar({ page, onNavigate, onLoginClick }) {
  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-2 font-bold text-primary">
        <span className="text-xl">🌾</span>
        <span className="text-[15px]">SPK Tanaman Pangan</span>
      </div>
      <div className="flex items-center gap-1.5">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onNavigate(n.id)}
            className={`rounded-md px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              page === n.id
                ? 'bg-green-50 text-primary'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            {n.label}
          </button>
        ))}
        <button
          onClick={onLoginClick}
          className="ml-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Login
        </button>
      </div>
    </nav>
  )
}

function DashboardSection({ onMulai }) {
  return (
    <div>
      <section
        className="relative flex min-h-[360px] flex-col items-center justify-center bg-cover bg-center px-6 py-16 text-center"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-2xl text-white">
          <h1 className="mb-3 text-3xl font-bold leading-tight">
            Sistem Pendukung Keputusan Pemilihan Jenis Tanaman Pangan
          </h1>
          <p className="mb-6 text-sm leading-relaxed opacity-90">
            Menentukan jenis tanaman pangan terbaik menggunakan Metode MFEP
            (Multifactor Evaluation Process) berdasarkan kriteria yang relevan.
          </p>
          <button
            onClick={onMulai}
            className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Lihat Hasil Perangkingan
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pt-10">
        <div className="card">
          <div className="mb-[18px] flex items-center justify-between">
            <span className="card-title">Profil Desa</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <img
              src={DESA_FOTO}
              alt="Pemandangan persawahan Desa Sukamaju"
              className="h-56 w-full rounded-lg object-cover md:h-full"
              loading="lazy"
            />
            <div>
              <p className="text-[13px] leading-[1.7] text-gray-600">
                <strong>Desa Gesang</strong> merupakan desa agraris yang
                sebagian besar penduduknya berprofesi sebagai petani. Dengan
                kondisi tanah yang subur dan sumber air yang memadai, desa ini
                memiliki potensi besar dalam pengembangan tanaman pangan. Sistem
                ini hadir untuk membantu petani dan perangkat desa menentukan
                jenis tanaman pangan yang paling sesuai dengan kondisi wilayah.
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                <div>
                  <dt className="text-gray-400">Kecamatan</dt>
                  <dd className="font-semibold text-gray-700">Tempeh</dd>
                </div>
                <div>
                  <dt className="text-gray-400">Kabupaten</dt>
                  <dd className="font-semibold text-gray-700">Lumajang</dd>
                </div>
                <div>
                  <dt className="text-gray-400">Luas Persawahan</dt>
                  <dd className="font-semibold text-gray-700">±650 Ha</dd>
                </div>
                <div>
                  <dt className="text-gray-400">Jumlah Penduduk</dt>
                  <dd className="font-semibold text-gray-700">±1.360 jiwa</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ProfilStat icon="🌾" val="85%" label="Lahan Pertanian" />
            <ProfilStat icon="👨‍🌾" val="1.250" label="Petani Aktif" />
            <ProfilStat icon="💧" val="2" label="Sumber Irigasi" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Mengapa Menggunakan Sistem Ini?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-500">
            Pengambilan keputusan yang objektif dan terukur untuk menentukan
            jenis tanaman pangan yang paling sesuai dengan kondisi desa.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FITUR.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-gray-200 bg-white px-5 py-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[12px] bg-green-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="mb-1.5 text-[15px] font-bold text-gray-800">{f.title}</h3>
              <p className="text-[13px] leading-[1.7] text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Cara Kerja</h2>
            <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-500">
              Empat langkah sederhana dari data menuju rekomendasi tanaman terbaik.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LANGKAH.map((l, i) => (
              <div key={l.title} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-1.5 text-[14px] font-bold text-gray-800">{l.title}</h3>
                <p className="text-[13px] leading-[1.6] text-gray-500">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-[14px] bg-gradient-to-br from-primary to-primary-mid px-8 py-10 text-center text-white">
          <h2 className="mb-2 text-2xl font-bold">Lihat Rekomendasi Tanaman Terbaik</h2>
          <p className="mx-auto mb-6 max-w-xl text-[13px] leading-relaxed opacity-90">
            Hasil perhitungan perangkingan alternatif tanaman pangan dapat dilihat
            langsung tanpa perlu login.
          </p>
          <button
            onClick={onMulai}
            className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Lihat Hasil Perangkingan
          </button>
        </div>
      </section>
    </div>
  )
}

function ProfilStat({ icon, val, label }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-green-50/40 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-xl">
        {icon}
      </div>
      <div>
        <div className="text-lg font-bold text-gray-800">{val}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

function formatTanggal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function NilaiAkhirSection() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    getNilaiAkhirPublic()
      .then((d) => alive && setGroups(d || []))
      .catch((err) => alive && setError(err.message || 'Gagal memuat data'))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="page-title">Hasil Akhir Perangkingan</div>

      {loading ? (
        <div className="card py-8 text-center text-gray-400">Memuat data…</div>
      ) : error ? (
        <div className="card py-8 text-center text-danger">{error}</div>
      ) : groups.length === 0 ? (
        <div className="card py-8 text-center text-gray-400">Belum ada hasil perangkingan.</div>
      ) : (
        groups.map((g, idx) => <UserRankingCard key={g.user?._id || idx} group={g} />)
      )}
    </div>
  )
}

function UserRankingCard({ group }) {
  const user = group.user || {}
  const ranked = [...(group.nilai_akhir || [])].sort(
    (a, b) => (a.ranking || 0) - (b.ranking || 0)
  )

  return (
    <div className="card">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-lg">
            👤
          </div>
          <div className="text-[14px] font-bold text-gray-800">
            {user.name || 'Pengguna'}
          </div>
        </div>
        {group.created && (
          <span className="text-xs text-gray-400">{formatTanggal(group.created)}</span>
        )}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nama Alternatif</th>
            <th>Total Weight Evaluation (WE)</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {ranked.length === 0 && (
            <tr>
              <td colSpan={3} className="text-gray-400">
                Belum ada hasil perangkingan.
              </td>
            </tr>
          )}
          {ranked.map((r) => (
            <tr key={r._id} className={r.ranking === 1 ? 'bg-amber-50 font-bold' : ''}>
              <td>{r.alternatif?.alternatif}</td>
              <td>{r.nilai_akhir}</td>
              <td>{r.ranking}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
