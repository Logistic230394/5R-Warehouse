
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { AuditCategory } from './types';

export const KRITERIA_5R: AuditCategory[] = [
    {
        name: "Ringkas",
        questions: [
            {
                text: "Area kerja sudah tidak menyimpan item atau barang yang tidak dibutuhkan",
                descriptions: [
                    "Item / barang di area kerja belum dipilah",
                    "Di area kerja masih ada item / barang yang tidak dibutuhkan",
                    "Area kerja sudah sama sekali tidak menyimpan item / barang yang tidak dibutuhkan lagi",
                    "Area kerja sudah sama sekali tidak menyimpan item / barang yang tidak dibutuhkan lagi dan jumlah item / barang yang dibutuhkan jumlahnya sesuai kebutuhan",
                    "Area kerja sudah sama sekali tidak menyimpan item / barang yang tidak dibutuhkan lagi dan jumlah item / barang yang dibutuhkan jumlahnya sesuai kebutuhan serta semua item / barang dalam keadaan siap pakai"
                ]
            },
            {
                text: "Sudah ada prosedur / tata cara membuang barang-barang yang tidak diperlukan (bernilai dan tidak bernilai)",
                descriptions: [
                    "Belum ada sama sekali prosedur mengeluarkan / membuang item / barang yamg tidak dibutuhkan",
                    "Prosedur / tata cara mengeluarkan / membuang item / barang yang tidak dibutuhkan kurang / tidak jelas",
                    "Sudah ada prosedur / tatacara mengeluarkan / membuang barang yang tidak dibutuhkan",
                    "Sudah ada prosedur / tatacara mengeluarkan / membuang barang yang tidak dibutuhkan dan semua personil area yang bersangkutan telah mengetahui, mengerti, memahami prosedur tersebut",
                    "Sudah ada prosedur / tatacara mengeluarkan / membuang barang yang tidak dibutuhkan dan semua personil area yang bersangkutan telah mengetahui, mengerti, memahami prosedur tersebut serta form-form penerapan sudah ada di area kerja"
                ]
            },
            {
                text: "Item / barang yang dibutuhkan berada di dekat area kerja dan jumlahnya serta item / jenisnya sesuai dengan kebutuhan",
                descriptions: [
                    "Item / barang yang dibutuhkan tidak berada di dekat area kerja serta jumlahnya tidak sesuai kebutuhan",
                    "Item / barang yang dibutuhkan belum didasarkan atas frekuensi pemakaian",
                    "Item / barang yang dibutuhkan telah berada di dekat area kerja dan jumlahnya sesuai kebutuhan namun belum ada daftar ringkas",
                    "Daftar ringkas sudah ada dan lengkap di area kerja",
                    "Daftar ringkas sudah ada dan lengkap di area kerja serta sudah mempertimbangkan frekuensi pemakaian"
                ]
            },
            {
                text: "Tidak ada item / peralatan kerja rusak dibiarkan begitu saja di area kerja",
                descriptions: [
                    "Sebagian besar mesin / peralatan yang berada di area kerja dalam kondisi rusak",
                    "Masih ada sebagian mesin / peralatan yang berada di area kerja dalam kondisi rusak",
                    "Mesin / peralatan kerja yang berada di area kerja siap pakai, namun sebagaian perlu ada perhatian / perlakuan khusus",
                    "Mesin / peralatan kerja yang berada di area kerja siap pakai",
                    "Mesin / peralatan kerja yang berada di area kerja siap pakai serta dalam kondisi optimal"
                ]
            },
            {
                text: "Lokasi penyimpanan sudah ditentukan serta mudah dan cepat untuk mendapatkan dan mengembalikannya",
                descriptions: [
                    "Belum ada penentuan lokasi penyimpanan barang",
                    "Hanya sebagian item / barang yang telah ditentukan lokasi penyimpanannya",
                    "Lokasi penyimpanan sudah ditentukan",
                    "Lokasi penyimpanan sudah ditentukan tetapi kadang-kadang masih sulit untuk mendapatkan dan mengembalikannya",
                    "Lokasi penyimpanan sudah ditentukan serta mudah dan cepat untuk mendapatkan dan mengembalikannya"
                ]
            }
        ]
    },
    {
        name: "Rapih",
        questions: [
            {
                text: "Item / barang / peralatan / dokumen telah disimpan di tempatnya sesuai klasifikasi",
                descriptions: [
                    "Item / barang / dokumen tidak tersimpan rapi serta belum diklasifikasi",
                    "Masih ada sebagian item / barang / dokumen yang belum tersimpan dengan rapi",
                    "Item / barang / dokumen telah tersimpan rapi",
                    "Item / barang / dokumen telah tersimpan rapi sesuai dengan klasifikasinya",
                    "Item / barang / dokumen telah tersimpan rapi sesuai dengan klasifikasinya serta mudah dimengerti / dipahami"
                ]
            },
            {
                text: "Layout / tata letak tempat kerja telah ditentukan dan telah diberi batas yang jelas",
                descriptions: [
                    "Tidak ada lay out / tata letak di tempat kerja",
                    "Sebagian tempat kerja belum ditentukan lay out / tata letaknya",
                    "Lay out / tata letak tempat kerja telah ditentukan namun batasnya tidak tergambar secara jelas / detail",
                    "Lay out / tata letak tempat kerja telah ditentukan dan telah diberi batas yang jelas",
                    "Lay out / tata letak tempat kerja telah ditentukan dan telah diberi batas yang jelas serta telah dipatuhi"
                ]
            },
            {
                text: "Semua item / barang / tempat penyimpanan telah berlabel dan memiliki identitas",
                descriptions: [
                    "Tidak ada label / identitas pada barang / item / tempat simpan / alat angkut",
                    "Sebagian barang / item / tempat simpan / alat angkut, dll belum ada label / identitasnya",
                    "Semua barang / item / tempat simpan / alat angkut, dll telah diberi label / identitas namun konsistensinya belum memadai",
                    "Semua barang / item / tempat simpan / alat angkut, dll telah diberi label / identitas",
                    "Semua barang / item / tempat simpan / alat angkut, dll telah diberi label / identitas serta memberikan kemudahan dalam mendapatkan dan mengembalikannya"
                ]
            },
            {
                text: "Penyimpanan dokumen / peralatan / barang sudah ditentukan dan memudahkan untuk mendapatkannya",
                descriptions: [
                    "Tidak ada ketentuan dalam penyimpanan dokumen / barang / peralatan",
                    "Sebagian penyimpanan dokumen / barang / peralatan belum ditentukan",
                    "Penyimpanan dokumen / barang / peralatan sudah ditentukan",
                    "Penyimpanan dokumen / barang / peralatan sudah ditentukan dan memudahkan setiap orang untuk mendapatkannya",
                    "Penyimpanan dokumen / barang / peralatan sudah ditentukan dan memudahkan setiap orang untuk mendapatkannya serta ada sistem kontrol ( misal max-min, dll)"
                ]
            },
            {
                text: "Semua personil mentaati aturan penyimpanan dan layout yang telah ditetapkan",
                descriptions: [
                    "Semua personil di area kerja tidak mentaati peraturan penyimpanan dan lay out yang telah ditetapkan",
                    "Sebagian personil di area kerja telah mentaati peraturan penyimpanan dan lay out yang telah ditetapkan",
                    "Semua personil di area kerja mentaati peraturan penyimpanan dan lay out yang telah ditentukan namun belum / tidak konsisten",
                    "Semua personil di area kerja telah mengetahui, memahami, dan mentaati aturan penyimpanan dan lay out yang telah ditetapkan",
                    "Semua personil di area kerja telah mengetahui, memahami, dan mentaati aturan penyimpanan dan lay out yang telah ditetapkan serta memberikan kemudahan bagi setiap orang dalam mentaatinya"
                ]
            }
        ]
    },
    {
        name: "Resik",
        questions: [
            {
                text: "Sarana / alat kebersihan sudah tersedia sesuai jenis dan jumlahnya serta penempatannya sesuai ketentuan",
                descriptions: [
                    "Tidak tersedia sarana / alat kebersihan di area kerja",
                    "Tidak semua alat / sarana kebersihan yang dibutuhkan tersedia",
                    "Sarana / alat kebersihan sudah tersedia sesuai jenis dan jumlahnya",
                    "Sarana / alat kebersihan sudah tersedia sesuai jenis dan jumlahnya dan penempatannya sesuai ketentuan",
                    "Sarana / alat kebersihan sudah tersedia sesuai jenis dan jumlahnya dan penempatannya sesuai ketentuan serta dalam kondisi bersih dan siap pakai"
                ]
            },
            {
                text: "Pembersihan area kerja sudah dilakukan secara rutin dan terjadwal sesuai ketentuan",
                descriptions: [
                    "Tidak pernah dilakukan pembersihan area kerja",
                    "Pembersihan area kerja dilakukan kalau ada perintah dari atasan",
                    "Pembersihan area kerja sudah dilakukan secara rutin",
                    "Pembersihan area kerja sudah dilakukan secara rutin, terjadwal",
                    "Pembersihan area kerja sudah dilakukan secara rutin, terjadwal serta sudah ada standar kebersihan dan personil yang bertanggung jawab melakukannya"
                ]
            },
            {
                text: "Area tanggung jawab 5R sudah ditentukan dan pelaksanaannya telah sesuai ketentuan",
                descriptions: [
                    "Tidak ada pembagian area tanggung jawab resik",
                    "Pembagian area tanggung jawab resik belum mencakup semua area kerja",
                    "Pembagian area tanggung jawab resik sudah ditentukan",
                    "Pembagian area tanggung jawab resik sudah ditentukan, pelaksanaannya sesuai ketentuan",
                    "Pembagian area tanggung jawab resik sudah ditentukan, pelaksanaannya sesuai ketentuan serta semua personil terlibat dan kebagian area tanggung jawab"
                ]
            },
            {
                text: "Alat kerja diperiksa dan dibersihkan secara teratur dan tidak kadaluarsa",
                descriptions: [
                    "Alat-alat kerja tidak pernah dibersihkan dan diperiksa",
                    "Alat kerja hanya dibersihkan saja tetapi tidak diperiksa",
                    "Alat kerja dibersihkan dan diperiksa secara teratur",
                    "Alat kerja dibersihkan dan diperiksa secara teratur dan tidak kadaluwarsa",
                    "Alat kerja dibersihkan dan diperiksa secara teratur dan tidak kadaluwarsa serta mudah untuk diakses"
                ]
            },
            {
                text: "Tidak ada tempelan, tulisan dan coretan yang tidak relevan dengan area kerja",
                descriptions: [
                    "Banyak terdapat tempelen / tulisan / coretan yang tidak relevan dengan area kerja",
                    "Pada area kerja masih terdapat tempelan / tulisan / coretan yang tidak relevan dengan area kerja",
                    "Pada area kerja tidak terdapat tempelan, tulisan, coretan yang tidak relevan dengan area kerja",
                    "Pada area kerja tidak terdapat tempelan, tulisan, coretan yang tidak relevan dengan area kerja dan media sosialisasi, program yang ditampilkan ditempatkan sesuai ketentuan",
                    "Pada area kerja tidak terdapat tempelan, tulisan, coretan yang tidak relevan dengan area kerja dan media sosialisasi, program yang ditampilkan ditempatkan sesuai ketentuan serta up to date"
                ]
            }
        ]
    },
    {
        name: "Rawat",
        questions: [
            {
                text: "Standarisasi Ringkas, Rapi, Resik, Rawat dan Rajin sudah diterapkan",
                descriptions: [
                    "Tidak ada standarisasi Ringkas, Rapi, Resik, Rawat, Rajin",
                    "Standarisasi Ringkas, Rapi, Resik, Rawat, Rajin baru ada sebagian dan belum memadai",
                    "Standarisasi Ringkas, Rapi, Resik, Rawat, Rajin sudah diterapkan",
                    "Standarisasi Ringkas, Rapi, Resik, Rawat, Rajin sudah diterapkan dan mencakup semua area kerja",
                    "Standarisasi Ringkas, Rapi, Resik, Rawat, Rajin sudah diterapkan dan mencakup semua area kerja serta selalu dilakukan perbaikan secara berkesinambungan"
                ]
            },
            {
                text: "Eliminasi sumber kotor dan penyederhanaan proses, prosedur sudah dibahas, dilaksanakan dan dimonitor / evaluasi",
                descriptions: [
                    "Tidak pernah ada perubahan eliminasi sumber kotor, penyederhanaan proses dan prosedur",
                    "Eliminasi sumber kotor dan penyederhanaan proses, prosedur hanya dibahas pada saat terjadi kasus-kasus tertentu",
                    "Eliminasi sumber kotor dan penyederhanaan proses, prosedur sudah dibahas, dilaksanakan",
                    "Eliminasi sumber kotor dan penyederhanaan proses, prosedur sudah dibahas, dilaksanakan dan dimonitor/ dievaluasi",
                    "Eliminasi sumber kotor dan penyederhanaan proses, prosedur sudah dibahas, dilaksanakan dan dimonitor/ dievaluasi serta ditindak lanjuti dengan perbaikan perbaikan berkesinambungan"
                ]
            },
            {
                text: "Penerapan visual kontrol, anti salah telah dilaksanakan di semua area",
                descriptions: [
                    "Area bersangkutan belum mengerti / memahami visual kontrol, mekanisme anti salah",
                    "Belum ada penerapan visual kontrol, anti salah",
                    "Sebagian area kerja sudah menerapkan visual kontrol, mekanisme anti salah",
                    "Penerapan visual kontrol, mekanisme anti salah, telah dilaksanakan di semua area",
                    "Penerapan visual kontrol, mekanisme anti salah, telah dilaksanakan di semua area serta selalu dilakukan perbaikan berkesinambungan"
                ]
            },
            {
                text: "Pemerikasaan berkala dan evaluasi / audit penerapan 5R telah dilaksanakan secara periodik",
                descriptions: [
                    "Tidak pernah dilakukan pemeriksaan berkala dan evaluasi / audit penerapan 5R",
                    "Pemeriksaan berkala dan evaluasi / audit penerapan 5R/5S hanya dilakukan jika ada event event tertentu",
                    "Pemeriksaan berkala dan evaluasi / audit penerapan 5R/5S telah dilaksanakan secara periodik",
                    "Berkala dan evaluasi / audit penerapan 5R/5S telah dilaksanakan secara periodik, dilakukan oleh personil yang kompeten",
                    "Pemeriksaan berkala dan evaluasi / audit penerapan 5R/5S telah dilaksanakan secara periodik, dilakukan oleh personil yang kompeten serta temuan temuannya selalu ditindaklanjuti"
                ]
            },
            {
                text: "Sistem sumbang saran / kaizen telah diterapkan di semua area dan semua personil telah melaksanakannya",
                descriptions: [
                    "Belum ada aturan / metode sistem sumbang saran",
                    "Aturan / metode sistem sumbang saran sudah ada tetapi belum dilaksanakan",
                    "Sistem sumbang saran / kaizen telah diterapkan di semua area, semua personil telah melaksanakannya",
                    "Sistem sumbang saran / kaizen telah diterapkan di semua area, semua personil telah melaksanakannya dan sudah ada aturan main lengkap dengan form",
                    "Sistem sumbang saran / kaizen telah diterapkan di semua area, semua personil telah melaksanakannya dan sudah ada aturan main lengkap dengan form serta ada kewajiban bagi setiap personil untuk memberikan sumbang saran untuk periode tertentu"
                ]
            }
        ]
    },
    {
        name: "Rajin",
        questions: [
            {
                text: "Sikap kerja semua personil sudah menunjukan kebiasaan positif (atribut kerja, tepat waktu, dll)",
                descriptions: [
                    "Sebagian besar personil organisasi / area kerja belum mempunyai sikap kerja/ kebiasaan positif dan disiplin",
                    "Sebagian personil organisasi / area kerja belum mempunyai sikap kerja / kebiasaan positif dan disiplin",
                    "Sikap kerja / kebiasaan positif dan disiplin telah terbentuk, tapi masih harus diikuti dengan reward dan punishment",
                    "Setiap personil dalam organisasi / area kerja sudah menunjukkan sikap kerja, kebiasaan positif dan disiplin",
                    "Setiap personil dalam organisasi / area kerja sudah menunjukkan sikap kerja, kebiasaan positif dan disiplin serta mempunyai budaya malu"
                ]
            },
            {
                text: "Semua personil secara aktif dan kreatif memberikan saran-saran pebaikan baik individu maupun kelompok",
                descriptions: [
                    "Personil organisasi / area kerja belum tahu / mengerti tentang sistem sumbang saran dan tidak pernah memberikan saran-saran perbaikan / kaizen",
                    "Personil organisasi / area kerja hampir tidak pernah memberikan saran-saran perbaikan",
                    "Semua personil organisasi / area kerja secara aktif dan kreatif memberikan saran-saran perbaikan / kaizen pada waktu-waktu tertentu",
                    "Semua personil organisasi / area kerja secara aktif dan kreatif memberikan saran-saran perbaikan / kaizen secara rutin baik menyangkut areanya maupun area lain tanpa mengharapkan penghargaan / imbalan",
                    "Semua personil organisasi / area kerja secara aktif dan kreatif memberikan saran-saran perbaikan / kaizen secara rutin baik menyangkut areanya maupun area lain tanpa mengharapkan penghargaan / imbalan"
                ]
            },
            {
                text: "Target / sasaran / quality objective perusahaan / department dan peorangan telah disosialisasikan dan pencapaiannya telah direkan, dimonitor dan dievaluasi, ditindaklanjuti dan disosialisasikan",
                descriptions: [
                    "Belum ada target / sasaran / quality objective",
                    "Target / sasaran / quality objective sudah ada namun tidak pernah dimonitor dan dievaluasi",
                    "Target / sasaran / quality objective sudah ada, sudah disosialisasikan, pencapaiannya telah direkam, dan dimonitor",
                    "Target / sasaran / quality objective sudah ada, sudah disosialisasikan, pencapaiannya telah direkam, dimonitor, dievaluasi, ditindaklanjuti dengan tindakan perbaikan",
                    "Target / sasaran / quality objective sudah ada, sudah disosialisasikan, pencapaiannya telah direkam, dimonitor, dievaluasi, ditindaklanjuti dengan tindakan perbaikan serta pencegahan"
                ]
            },
            {
                text: "Sudah ada activity board yang menyajikan informasi kinerja individu / kelompok / department di area masing-masing",
                descriptions: [
                    "Tidak ada activity board / informasi penerapan 5R di area kerja",
                    "Ada activity board, tapi informasi yang disajikan tidak up to date dan tidak memadai",
                    "Sudah ada activity board yang menyajikan informasi penerapan 5R",
                    "Activity board / papan informasi 5R tersedia di area kerja dan menyajikan informasi informasi yang memadai (kegiatan 5R, hasil kaizen, efisiensi, produktifitas, hasil audit, dll)",
                    "Activity board / papan informasi 5R tersedia di area kerja dan menyajikan informasi informasi yang memadai (kegiatan 5R, hasil kaizen, efisiensi, produktifitas, hasil audit, dll) serta up to date"
                ]
            },
            {
                text: "Kegiatan / penerapan 5R sudah dimasukan ke dalam job desc",
                descriptions: [
                    "Kegiatan / penerapan 5R hanya diadakan untuk kegiatan kebersihan semata bukan untuk membentuk budaya produktif",
                    "Kegiatan / penerapan 5R hanya bersifat parsial",
                    "Kegiatan / penerapan 5R baru terkait dengan sebagian kecil program perusahaan",
                    "Kegiatan / penerapan 5R/5S sudah dimasukkan / dikaitkan dengan program perusahaan lainnya (job desc)",
                    "Kegiatan / penerapan 5R/5S sudah dimasukkan / dikaitkan dengan program perusahaan lainnya (iso / gkm / pa / job description / dll) serta sudah tercantum dalam kebijaksanaan perusahaan"
                ]
            }
        ]
    }
];

export const INITIAL_PLACEHOLDERS = [
    "Warehouse RM Technical",
    "FG Herbisida",
    "Office Main",
    "Loading Dock A"
];

export const AUDITOR_PASSWORDS: Record<string, string> = {
    "Eka Yunita": "11142",
    "Wantoro": "11093",
    "Angga Pratama": "11181",
    "Adin": "11263",
    "Gatot": "11230",
    "Hadijah": "11128",
    "Fadly": "11261",
    "Badai": "15832"
};
