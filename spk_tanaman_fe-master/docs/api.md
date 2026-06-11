# SPK Tanaman — API Reference

Base URL: `http://localhost:3000` (set via `VITE_API_URL` di `.env`).

Routes di bawah ini **diverifikasi langsung** terhadap server lokal (status `401` = route ada tapi butuh auth, `404` = route tidak ada). Sumber asli: `tanaman.postman_collection.json` (banyak URL kosong / salah di sana — versi ini sudah dikoreksi).

Auth memakai **Bearer token** dari response `login` (`res.data.token`). Perhatikan: update & delete memakai method **POST**, bukan PUT/DELETE.

## Auth (tanpa token)
| Fungsi | Method | Path |
|--------|--------|------|
| register | POST | `/register` — body `{ name, username, password }` |
| login | POST | `/login` — body `{ username, password }` → `data.token` |
| logout | POST | `/logout` 🔒 |
| nilaiAkhir (publik) | GET | `/nilai-akhir/public/get-nilai-akhir` — perangkingan untuk landing page, tanpa token. Data dikelompokkan per user: `data[] = { user{name,username}, created, nilai_akhir[] }` (tiap item `nilai_akhir` sama dgn baris `/nilai-akhir/get-nilai-akhir`) |

## User
| Fungsi | Method | Path |
|--------|--------|------|
| getProfile | GET | `/user/get-profile` 🔒 |

## Kriteria 🔒
| Fungsi | Method | Path |
|--------|--------|------|
| create | POST | `/kriteria/create-kriteria` — body `{ kode, parameter, bobot }` |
| getAll | GET | `/kriteria/get-kriteria` |
| getById | GET | `/kriteria/get-kriteria/:id` |
| update | POST | `/kriteria/update-kriteria/:id` |
| delete | POST | `/kriteria/delete-kriteria/:id` |
| normalize | POST | `/kriteria/normalize` |

## Subkriteria 🔒
| Fungsi | Method | Path |
|--------|--------|------|
| create | POST | `/sub-kriteria/create-subkriteria` — body `{ kriteria_id, sub_kriteria, bobot, deskripsi? }` |
| getAll | GET | `/sub-kriteria/get-subkriteria` |
| getById | GET | `/sub-kriteria/get-subkriteria/:id` |
| getByKriteria | GET | `/sub-kriteria/get-subkriteria/kriteria/:kriteriaId` |
| update | POST | `/sub-kriteria/update-subkriteria/:id` |
| delete | POST | `/sub-kriteria/delete-subkriteria/:id` |

## Alternatif 🔒
| Fungsi | Method | Path |
|--------|--------|------|
| create | POST | `/alternatif/create-alternatif` — body `{ kode, alternatif }` |
| getAll | GET | `/alternatif/get-alternatif` |
| getById | GET | `/alternatif/get-alternatif/:id` |
| update | POST | `/alternatif/update-alternatif/:id` |
| delete | POST | `/alternatif/delete-alternatif/:id` |

## RawInput 🔒
| Fungsi | Method | Path |
|--------|--------|------|
| create | POST | `/raw-input/create-rawinput` — body `{ alternatif_id, kriteria_id, subkriteria_id, nilai_input }` |
| getAll | GET | `/raw-input/get-rawinput` |
| getById | GET | `/raw-input/get-rawinput/:id` |
| update | POST | `/raw-input/update-rawinput/:id` |
| delete | POST | `/raw-input/delete-rawinput/:id` |

## EvaluasiFaktor 🔒
| Fungsi | Method | Path |
|--------|--------|------|
| hitung | POST | `/evaluasi-faktor/hitung` |
| getAll | GET | `/evaluasi-faktor/get-evaluasi` |
| getByKriteria | GET | `/evaluasi-faktor/get-evaluasi/kriteria/:kriteriaId` |
| deleteAll | POST | `/evaluasi-faktor/delete-evaluasi` — hapus semua evaluasi faktor |

## NilaiAkhir 🔒
| Fungsi | Method | Path |
|--------|--------|------|
| hitung | POST | `/nilai-akhir/hitung` |
| getAll | GET | `/nilai-akhir/get-nilai-akhir` |
| getByAlternatif | GET | `/nilai-akhir/get-nilai-akhir/alternatif/:alternatifId` |
| deleteAll | POST | `/nilai-akhir/delete-nilai-akhir` — hapus semua nilai akhir |

## Alur perhitungan SPK
1. Definisikan **Kriteria** (+ bobot) → `normalize`
2. Definisikan **Subkriteria** per kriteria (+ bobot)
3. Definisikan **Alternatif** (mis. Padi, Jagung)
4. Isi **RawInput** (nilai tiap alternatif × kriteria/subkriteria)
5. `evaluasi-faktor/hitung` → faktor ternormalisasi
6. `nilai-akhir/hitung` → ranking akhir alternatif

## Bentuk response (diverifikasi langsung ke server)

Semua dibungkus envelope `{ success, message, data }`. Service di `src/services/*`
mengembalikan `res.data` (sudah di-unwrap).

```jsonc
// POST /login → data
{ "token": "...", "id": "...", "username": "deniuhuy" }
// GET /user/get-profile → data
{ "id": "...", "name": "deni", "username": "deniuhuy", "joined": "26 May 2026" }

// GET /kriteria/get-kriteria → data[]
{ "_id": "...", "kode": "k1", "parameter": "suhu", "bobot": 3, "bobot_normalisasi": 0.25 }

// GET /sub-kriteria/get-subkriteria → data[]  (kriteria di-populate)
{ "_id": "...", "kriteria": { "_id": "...", "kode": "k1", "parameter": "suhu", "bobot": 3, "bobot_normalisasi": 0.25 },
  "sub_kriteria": "20-25", "deskripsi": "", "bobot": 4 }

// GET /alternatif/get-alternatif → data[]
{ "_id": "...", "kode": "A1", "alternatif": "Padi" }

// GET /raw-input/get-rawinput → data[]  (semua relasi di-populate)
{ "_id": "...", "alternatif": { "_id": "...", "alternatif": "Padi" },
  "kriteria": { "_id": "...", "parameter": "suhu", "bobot_normalisasi": 0.25 },
  "subkriteria": { "_id": "...", "sub_kriteria": "20-25" }, "nilai_input": 4 }

// GET /evaluasi-faktor/get-evaluasi → data[]
{ "_id": "...", "alternatif": {...}, "kriteria": {...}, "nilai_evaluasi": 1 }

// GET /nilai-akhir/get-nilai-akhir → data[]
{ "_id": "...", "ranking": 1, "alternatif": { "_id": "...", "alternatif": "Padi" },
  "bobot_evaluasi": [ { "kriteria": {...}, "nilai_evaluasi_faktor": 1, "nilai_bobot_evaluasi": 0.25 } ],
  "nilai_akhir": 0.25 }

// POST .../hitung & .../normalize → data
{ "total": 1 }
```

Catatan **RawInput = "Penilaian"**: satu baris per (alternatif, kriteria) yang menunjuk
satu subkriteria. Di UI, memilih subkriteria mengisi `subkriteria_id` dan
`nilai_input` = `bobot` subkriteria tsb.
