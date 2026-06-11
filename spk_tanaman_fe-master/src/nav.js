// Definisi menu sidebar + label breadcrumb.
export const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { section: 'INPUT DATA' },
  { id: 'kriteria', label: 'Data Kriteria', icon: '📋' },
  { id: 'sub-kriteria', label: 'Data Sub Kriteria', icon: '📑' },
  { id: 'alternatif', label: 'Data Alternatif', icon: '🌱' },
  { id: 'penilaian', label: 'Data Penilaian', icon: '📝' },
  { section: 'HASIL PERHITUNGAN' },
  { id: 'perhitungan', label: 'Detail Perhitungan', icon: '📊' },
  { id: 'perangkingan', label: 'Perangkingan', icon: '⭐' },
  { section: 'AKUN' },
  { id: 'profil', label: 'Profil Saya', icon: '👤' },
]

export const PAGE_LABELS = Object.fromEntries(
  NAV.filter((n) => n.id).map((n) => [n.id, n.id === 'dashboard' ? 'Beranda' : n.label])
)
