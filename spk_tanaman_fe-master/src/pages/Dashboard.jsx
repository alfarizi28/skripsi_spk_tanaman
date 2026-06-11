import { useSpk } from '../store/SpkContext'

function StatCard({ icon, color, val, label }) {
  return (
    <div className="flex items-center gap-3.5 rounded-lg border border-gray-200 bg-white px-5 py-[18px]">
      <div className={`flex h-[46px] w-[46px] items-center justify-center rounded-[10px] text-[22px] ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-[22px] font-bold">{val}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { kriteria, subkriteria, alternatif, nilaiAkhir, user } = useSpk()

  return (
    <div>
      <div className="mb-6 rounded-[10px] bg-gradient-to-br from-primary to-primary-mid px-7 py-6 text-white">
        <h2 className="mb-1.5 text-lg font-bold">
          🌾 Selamat Datang, {user?.name || 'Admin'}!
        </h2>
        <p className="text-[13px] opacity-85">
          Sistem Pendukung Keputusan Penentuan Jenis Tanaman Pangan menggunakan
          Metode MFEP (Multifactor Evaluation Process)
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="📋" color="bg-green-50" val={kriteria.length} label="Data Kriteria" />
        <StatCard icon="📑" color="bg-amber-50" val={subkriteria.length} label="Data Sub Kriteria" />
        <StatCard icon="🌱" color="bg-blue-50" val={alternatif.length} label="Data Alternatif" />
        <StatCard icon="⭐" color="bg-red-50" val={nilaiAkhir.length} label="Hasil Perangkingan" />
      </div>

      <div className="card">
        <div className="mb-[18px] flex items-center justify-between">
          <span className="card-title">Informasi Metode MFEP</span>
        </div>
        <p className="text-[13px] leading-[1.7] text-gray-600">
          Metode <strong>MFEP (Multifactor Evaluation Process)</strong> adalah
          metode pengambilan keputusan dengan memberikan pertimbangan terhadap
          faktor-faktor yang dianggap penting. Bobot kriteria dinormalisasi
          (Factor Weight), nilai penilaian dievaluasi (Factor Evaluation),
          lalu dihitung Weight Evaluation (WE = FW × FE). Total WE tertinggi
          adalah alternatif terbaik.
        </p>
        <div className="formula-box mt-3.5">
          <strong>Rumus:</strong> &nbsp; WE = FW × FE &nbsp;|&nbsp; ΣWE = Σ(FW ×
          FE)
        </div>
      </div>
    </div>
  )
}
