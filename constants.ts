
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { AuditCategory } from './types';

export const KRITERIA_5R: AuditCategory[] = [
    {
        name: "Ringkas",
        questions: [
            "Area kerja bebas dari item yang tidak dibutuhkan",
            "Prosedur pembuangan barang tidak terpakai sudah ada",
            "Barang di dekat area kerja sesuai kebutuhan",
            "Tidak ada peralatan rusak di area kerja",
            "Lokasi penyimpanan mudah diakses"
        ]
    },
    {
        name: "Rapih",
        questions: [
            "Barang disimpan sesuai klasifikasi",
            "Layout tempat kerja memiliki batas jelas",
            "Semua penyimpanan berlabel & identitas",
            "Penyimpanan dokumen memudahkan pencarian",
            "Personil taat aturan layout"
        ]
    },
    {
        name: "Resik",
        questions: [
            "Sarana kebersihan tersedia & sesuai jenis",
            "Pembersihan rutin & terjadwal",
            "Area tanggung jawab 5R ditentukan",
            "Alat kerja diperiksa & dibersihkan teratur",
            "Tidak ada tempelan/coretan tidak relevan"
        ]
    },
    {
        name: "Rawat",
        questions: [
            "Standarisasi 5R sudah diterapkan",
            "Eliminasi sumber kotor & penyederhanaan proses",
            "Audit 5R dilakukan secara periodik",
            "Sistem sumbang saran/kaizen berjalan",
            "Evaluasi berkala terhadap standar"
        ]
    },
    {
        name: "Rajin",
        questions: [
            "Sikap kerja positif & disiplin",
            "Aktif memberikan saran perbaikan",
            "Target/Quality Objective dipahami",
            "Activity board menyajikan info kinerja",
            "Penerapan 5R masuk dalam Job Desc"
        ]
    }
];

export const INITIAL_PLACEHOLDERS = [
    "Warehouse RM Technical",
    "FG Herbisida",
    "Office Main",
    "Loading Dock A"
];
