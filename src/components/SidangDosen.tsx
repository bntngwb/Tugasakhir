"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { GuideModal } from "./GuideModal";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { SidangDosenDetail } from "./SidangDosenDetail";

export type Jenjang = "S1" | "S2" | "S3";
export type JenisSidang = "Sidang Proposal" | "Sidang Akhir";

// 🔹 Tambah "Menunggu Sidang"
export type StatusSidang =
  | "Perlu Dinilai"
  | "Revisi"
  | "Selesai"
  | "Menunggu Sidang";

export type Posisi = "Penguji" | "Pembimbing";

export interface SidangItem {
  id: number;
  nama: string;
  nrp: string;
  jenjang: Jenjang;
  jenisSidang: JenisSidang;
  posisi: Posisi;
  tanggalSidang: string | null; // null = menunggu penjadwalan
  status: StatusSidang;

  topicTitle?: string;
  topicCategory?: string;
  topicAbstract?: string;
  supervisor1?: string;
  supervisor2?: string;
  examiner1?: string;
  examiner2?: string;
  examiner3?: string;
  time?: string;
  location?: string;
  revisionDeadline?: string;
  revisionNotes?: string;
}

/**
 * Dummy utama daftar sidang (8 data)
 * Dibagi ke S1, S2, S3 dengan status berbeda
 */
const dummySidangData: SidangItem[] = [
  {
    id: 1,
    nama: "Budi Santoso",
    nrp: "5025221034",
    jenjang: "S1",
    jenisSidang: "Sidang Proposal",
    posisi: "Pembimbing",
    tanggalSidang: "Senin, 12 Januari 2026",
    status: "Perlu Dinilai",
    topicTitle:
      "Penerapan Vision Transformer untuk Deteksi Anomali Jaringan Komputer Skala Besar",
    topicCategory: "Keamanan Jaringan",
    topicAbstract:
      "Penelitian ini bertujuan mengimplementasikan Vision Transformer (ViT) untuk mendeteksi pola anomali pada trafik jaringan kampus berskala besar.",
    supervisor1: "Dr. Ahmad Saikhu, S.T., M.T.",
    supervisor2: "—",
    examiner1: "Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.",
    examiner2: "—",
    examiner3: "—",
    time: "-",
    location: "-",
    revisionDeadline: "20 Januari 2026",
    revisionNotes:
      "Perjelas latar belakang dan tambahkan perbandingan dengan metode deteksi intrusi konvensional.",
  },
  {
    id: 2,
    nama: "Siti Rahmawati",
    nrp: "5025222001",
    jenjang: "S1",
    jenisSidang: "Sidang Proposal",
    posisi: "Penguji",
    tanggalSidang: "Rabu, 14 Januari 2026",
    status: "Revisi",
    topicTitle:
      "Perancangan Aplikasi Manajemen Skripsi Berbasis Web untuk Fakultas Teknik",
    topicCategory: "Sistem Informasi",
    topicAbstract:
      "Aplikasi ini dirancang untuk membantu proses manajemen skripsi mulai dari pengajuan judul hingga penjadwalan sidang.",
    supervisor1: "Ir. Rudi Pratama, M.T.",
    supervisor2: "—",
    examiner1: "Dr. Nur Aini Rakhmawati, S.Kom., M.Sc.",
    time: "09.00 – 10.00",
    location: "Ruang Sidang 1",
    revisionDeadline: "25 Januari 2026",
    revisionNotes:
      "Lengkapi studi literatur dan tambahkan diagram arsitektur sistem secara detail.",
  },
  {
    id: 3,
    nama: "Andi Pratama",
    nrp: "5025223002",
    jenjang: "S1",
    jenisSidang: "Sidang Akhir",
    posisi: "Penguji",
    tanggalSidang: "Jumat, 23 Januari 2026",
    status: "Selesai",
    topicTitle:
      "Analisis Kinerja Algoritma Routing pada Jaringan IoT Low-Power",
    topicCategory: "Jaringan Komputer",
    topicAbstract:
      "Penelitian ini mengevaluasi beberapa algoritma routing pada jaringan IoT untuk lingkungan low-power dan lossy network.",
    supervisor1: "Dr. Bambang Setiawan, S.T., M.Eng.",
    supervisor2: "—",
    examiner1: "Dr. Fajar Nugraha, S.T., M.Eng.",
    time: "13.00 – 14.30",
    location: "Ruang Sidang 2",
  },
  // S2
  {
    id: 4,
    nama: "Yoga Saputra",
    nrp: "6025221001",
    jenjang: "S2",
    jenisSidang: "Sidang Proposal",
    posisi: "Pembimbing",
    tanggalSidang: null,
    status: "Menunggu Sidang", // 🔹 belum dijadwalkan
    topicTitle:
      "Penerapan Graph Neural Network untuk Prediksi Hasil Pertandingan Sepak Bola",
    topicCategory: "Machine Learning",
    topicAbstract:
      "Penelitian ini memodelkan kompetisi liga sepak bola sebagai graf untuk memanfaatkan Graph Neural Network.",
    supervisor1: "Dr. Yudi Wibisono, S.Kom., M.Kom.",
    supervisor2: "—",
    examiner1: "Dr. Siti Aminah, S.Si., M.Kom.",
    revisionDeadline: "5 Februari 2026",
    revisionNotes:
      "Tambahkan penjelasan detail mengenai proses konstruksi graf dan pemilihan fitur.",
  },
  {
    id: 5,
    nama: "Nadia Kusuma",
    nrp: "6025221002",
    jenjang: "S2",
    jenisSidang: "Sidang Akhir",
    posisi: "Penguji",
    tanggalSidang: "Senin, 2 Februari 2026",
    status: "Revisi",
    topicTitle:
      "Optimasi Hyperparameter pada Model Transformers untuk Teks Bahasa Indonesia",
    topicCategory: "Natural Language Processing",
    topicAbstract:
      "Penelitian ini mengkaji beberapa skema optimasi hyperparameter pada model Transformers untuk teks Bahasa Indonesia.",
    supervisor1: "Dr. Rony Budiono, S.Kom., M.Kom.",
    examiner1: "Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.",
    time: "10.00 – 11.30",
    location: "Ruang Sidang 3",
    revisionDeadline: "15 Februari 2026",
    revisionNotes:
      "Perbaiki analisis hasil eksperimen dan tambahkan diskusi terkait generalisasi model.",
  },
  {
    id: 6,
    nama: "Dimas Hidayat",
    nrp: "6025221003",
    jenjang: "S2",
    jenisSidang: "Sidang Akhir",
    posisi: "Pembimbing",
    tanggalSidang: "Rabu, 4 Februari 2026",
    status: "Selesai",
    topicTitle:
      "Perbandingan Model CNN dan ViT untuk Klasifikasi Citra Medis",
    topicCategory: "Computer Vision",
    topicAbstract:
      "Penelitian ini membandingkan kinerja CNN dan Vision Transformer pada tugas klasifikasi citra medis.",
    supervisor1: "Dr. Rina Susanti, S.Kom., M.T.",
    examiner1: "Dr. Hariyanto, S.T., M.Eng.",
    time: "13.00 – 14.30",
    location: "Ruang Sidang 4",
  },
  // S3
  {
    id: 7,
    nama: "Farhan Akbar",
    nrp: "7025221001",
    jenjang: "S3",
    jenisSidang: "Sidang Proposal",
    posisi: "Penguji",
    tanggalSidang: null,
    status: "Menunggu Sidang", // 🔹 belum dijadwalkan
    topicTitle:
      "Arsitektur Hybrid ViT-GNN untuk Deteksi Anomali Multimodal pada Infrastruktur Kritis",
    topicCategory: "Keamanan Siber",
    topicAbstract:
      "Disertasi ini mengusulkan arsitektur hybrid ViT-GNN untuk mendeteksi anomali pada data multimodal di infrastruktur kritis.",
    supervisor1: "Prof. Dr. Ir. Amir, M.Eng.",
    examiner1: "Dr. Nur Aini Rakhmawati, S.Kom., M.Sc.",
    revisionDeadline: "10 Maret 2026",
  },
  {
    id: 8,
    nama: "Laila Putri",
    nrp: "7025221002",
    jenjang: "S3",
    jenisSidang: "Sidang Akhir",
    posisi: "Pembimbing",
    tanggalSidang: "Jumat, 13 Maret 2026",
    status: "Selesai",
    topicTitle:
      "Model Steganografi Citra Berbasis Vision Transformer dengan Residual Learning",
    topicCategory: "Keamanan Data",
    topicAbstract:
      "Penelitian ini mengembangkan model steganografi citra berbasis Vision Transformer dengan residual learning untuk meningkatkan PSNR dan keamanan pesan.",
    supervisor1: "Prof. Dr. Ir. Amir, M.Eng.",
    examiner1: "Dr. Yudi Wibisono, S.Kom., M.Kom.",
    time: "09.00 – 11.00",
    location: "Ruang Sidang Utama",
  },
];

/**
 * Dummy data untuk Ajuan Sidang (5 data).
 */
const dummyAjuanSidangData: SidangItem[] = [
  {
    id: 101,
    nama: "Rahma Dwi Astuti",
    nrp: "5025221999",
    jenjang: "S1",
    jenisSidang: "Sidang Proposal",
    posisi: "Pembimbing",
    tanggalSidang: null,
    status: "Perlu Dinilai",
    topicTitle:
      "Analisis Sistem Rekomendasi Dosen Pembimbing Berbasis Riwayat Bimbingan",
    topicCategory: "Sistem Rekomendasi",
    topicAbstract:
      "Penelitian ini menganalisis pola historis bimbingan tugas akhir untuk membangun sistem rekomendasi dosen pembimbing yang adil dan sesuai minat.",
    supervisor1: "Dr. Rina Susanti, S.Kom., M.T.",
    supervisor2: "—",
  },
  {
    id: 102,
    nama: "Yoga Saputra",
    nrp: "6025221888",
    jenjang: "S2",
    jenisSidang: "Sidang Akhir",
    posisi: "Penguji",
    tanggalSidang: null,
    status: "Perlu Dinilai",
    topicTitle:
      "Penerapan Graph Neural Network untuk Prediksi Hasil Pertandingan Sepak Bola",
    topicCategory: "Machine Learning",
    topicAbstract:
      "Liga sepak bola dimodelkan sebagai graf untuk memanfaatkan Graph Neural Network dalam memprediksi hasil pertandingan.",
    supervisor1: "Dr. Yudi Wibisono, S.Kom., M.Kom.",
    supervisor2: "—",
  },
  {
    id: 103,
    nama: "Intan Maharani",
    nrp: "5025221777",
    jenjang: "S1",
    jenisSidang: "Sidang Akhir",
    posisi: "Penguji",
    tanggalSidang: null,
    status: "Perlu Dinilai",
    topicTitle:
      "Evaluasi Usability Sistem Manajemen Tugas Akhir Menggunakan SUS dan UEQ",
    topicCategory: "Human Computer Interaction",
    topicAbstract:
      "Penelitian ini mengevaluasi aspek usability dan user experience pada sistem manajemen tugas akhir menggunakan SUS dan UEQ.",
    supervisor1: "Dr. Nur Aini Rakhmawati, S.Kom., M.Sc.",
    supervisor2: "—",
  },
  {
    id: 104,
    nama: "Rizky Fadillah",
    nrp: "6025221666",
    jenjang: "S2",
    jenisSidang: "Sidang Proposal",
    posisi: "Pembimbing",
    tanggalSidang: null,
    status: "Perlu Dinilai",
    topicTitle:
      "Perancangan Arsitektur Microservices untuk Platform Pembelajaran Online",
    topicCategory: "Rekayasa Perangkat Lunak",
    topicAbstract:
      "Penelitian ini merancang arsitektur microservices untuk platform pembelajaran online yang skalabel dan mudah di-maintain.",
    supervisor1: "Dr. Rony Budiono, S.Kom., M.Kom.",
  },
  {
    id: 105,
    nama: "Dewi Lestari",
    nrp: "7025221555",
    jenjang: "S3",
    jenisSidang: "Sidang Proposal",
    posisi: "Penguji",
    tanggalSidang: null,
    status: "Perlu Dinilai",
    topicTitle:
      "Model Prediktif Berbasis Deep Learning untuk Mitigasi Bencana Tsunami",
    topicCategory: "Data Sains",
    topicAbstract:
      "Disertasi ini mengusulkan model prediktif tsunami berbasis deep learning menggunakan data satelit dan oceanographic.",
    supervisor1: "Prof. Dr. Ir. Amir, M.Eng.",
  },
];

interface SidangDosenSummary {
  ajuanCount: number;
  menungguCount: number;
  perluDinilaiCount: number;
  revisiCount: number;
}

interface SidangDosenProps {
  onSummaryChange?: (summary: SidangDosenSummary) => void;
}

export function SidangDosen({ onSummaryChange }: SidangDosenProps) {
  const [activeJenjang, setActiveJenjang] = useState<Jenjang>("S1");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState<"all" | JenisSidang>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | StatusSidang>("all");
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const [sidangData, setSidangData] = useState<SidangItem[]>(dummySidangData);
  const [ajuanSidangData, setAjuanSidangData] =
    useState<SidangItem[]>(dummyAjuanSidangData);

  const [selectedSidang, setSelectedSidang] = useState<SidangItem | null>(null);
  const [selectedContext, setSelectedContext] = useState<
    "sidang" | "ajuan" | null
  >(null);
  const [showAjuan, setShowAjuan] = useState(false);

  const filteredSidang = useMemo(() => {
    return sidangData
      .filter((item) => item.jenjang === activeJenjang)
      .filter((item) =>
        searchTerm.trim()
          ? item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nrp.includes(searchTerm.trim())
          : true
      )
      .filter((item) =>
        filterJenis === "all" ? true : item.jenisSidang === filterJenis
      )
      .filter((item) =>
        filterStatus === "all" ? true : item.status === filterStatus
      );
  }, [sidangData, activeJenjang, searchTerm, filterJenis, filterStatus]);

  const statusSummary = useMemo(() => {
    const subset = sidangData.filter((item) => item.jenjang === activeJenjang);
    const perluDinilai = subset.filter(
      (item) => item.status === "Perlu Dinilai"
    ).length;
    const revisi = subset.filter((item) => item.status === "Revisi").length;
    return { perluDinilai, revisi };
  }, [sidangData, activeJenjang]);

  useEffect(() => {
    if (!onSummaryChange) return;

    const ajuanCount = ajuanSidangData.length;
    const perluDinilaiTotal = sidangData.filter(
      (item) => item.status === "Perlu Dinilai"
    ).length;
    const revisiTotal = sidangData.filter(
      (item) => item.status === "Revisi"
    ).length;

    onSummaryChange({
      ajuanCount,
      menungguCount: perluDinilaiTotal + revisiTotal,
      perluDinilaiCount: perluDinilaiTotal,
      revisiCount: revisiTotal,
    });
  }, [ajuanSidangData, sidangData, onSummaryChange]);

  const filteredAjuanSidang = useMemo(
    () => ajuanSidangData.filter((item) => item.jenjang === activeJenjang),
    [ajuanSidangData, activeJenjang]
  );

  const handleSelectSidang = (item: SidangItem) => {
    setSelectedSidang(item);
    setSelectedContext("sidang");
  };

  const handleSelectAjuan = (item: SidangItem) => {
    setSelectedSidang(item);
    setSelectedContext("ajuan");
  };

  const handleApproveAjuan = (item: SidangItem) => {
    // hapus dari list ajuan
    setAjuanSidangData((prev) => prev.filter((p) => p.id !== item.id));

    // tambahkan ke daftar sidang dengan status "Menunggu Sidang"
    setSidangData((prev) => [
      ...prev,
      {
        ...item,
        status: "Menunggu Sidang",
        tanggalSidang: item.tanggalSidang ?? null,
      },
    ]);
  };

  const handleStatusChange = (id: number, status: StatusSidang) => {
    setSidangData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );

    setSelectedSidang((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev
    );
  };

  if (selectedSidang) {
    return (
      <SidangDosenDetail
        sidang={selectedSidang}
        onBack={() => {
          setSelectedSidang(null);
          setSelectedContext(null);
        }}
        mode={selectedContext === "ajuan" ? "ajuan" : "sidang"}
        onStatusChange={handleStatusChange}
      />
    );
  }

  const getJenjangLabel = (jenjang: Jenjang) => {
    if (jenjang === "S1") return "Daftar Sidang S-1";
    if (jenjang === "S2") return "Daftar Sidang S-2";
    return "Daftar Sidang S-3";
  };

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">
              Sidang
            </h1>
            <p className="text-gray-500 font-[Roboto] text-sm mt-1">
              Pantau jadwal dan status sidang mahasiswa bimbingan Anda
            </p>
          </div>

          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-[Poppins]">Panduan Penggunaan</span>
          </button>
        </div>

        {/* Tombol Ajuan Sidang */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={() => setShowAjuan((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 bg-white text-sm font-[Poppins] text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Ajuan Sidang</span>
            {ajuanSidangData.length > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-[Roboto] bg-red-500 text-white">
                {ajuanSidangData.length}
              </span>
            )}
          </button>

          {ajuanSidangData.length > 0 && (
            <p className="flex items-center gap-1 text-xs text-red-600 font-[Roboto]">
              <AlertCircle className="w-3 h-3" />
              <span>
                Terdapat {ajuanSidangData.length} ajuan sidang yang menunggu
                persetujuan Anda.
              </span>
            </p>
          )}
        </div>

        {/* Section Ajuan Sidang */}
        {showAjuan && (
          <AjuanSidangSection
            data={filteredAjuanSidang}
            activeJenjang={activeJenjang}
            onView={handleSelectAjuan}
            onApprove={handleApproveAjuan}
          />
        )}

        {/* Section Daftar Sidang */}
        <SidangTableSection
          title={getJenjangLabel(activeJenjang)}
          data={filteredSidang}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterJenis={filterJenis}
          setFilterJenis={setFilterJenis}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          activeJenjang={activeJenjang}
          setActiveJenjang={setActiveJenjang}
          perluDinilaiCount={statusSummary.perluDinilai}
          revisiCount={statusSummary.revisi}
          onSelectSidang={handleSelectSidang}
        />
      </div>

      {/* Guide Modal */}
      {isGuideModalOpen && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          title="Panduan Penggunaan - Sidang Dosen"
          steps={[
            {
              title: "Gambaran Umum Halaman Sidang",
              description:
                "Halaman ini menampilkan daftar sidang proposal dan sidang akhir untuk mahasiswa bimbingan Anda, lengkap dengan informasi nama, NRP, jenis sidang, posisi Anda, tanggal, dan status.",
              imageUrl:
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "Memilih Jenjang (S-1, S-2, S-3)",
              description:
                "Gunakan tab S-1, S-2, atau S-3 untuk berpindah antar jenjang. Daftar sidang akan otomatis menyesuaikan dengan pilihan Anda.",
              imageUrl:
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "Mencari dan Memfilter Sidang",
              description:
                "Gunakan kolom pencarian untuk mencari mahasiswa berdasarkan nama atau NRP. Atur filter jenis sidang dan status untuk memfokuskan daftar.",
              imageUrl:
                "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "Menindaklanjuti Sidang",
              description:
                "Status 'Perlu Dinilai' menunjukkan sidang yang menunggu penilaian Anda, 'Revisi' berarti mahasiswa sedang memperbaiki, 'Menunggu Sidang' untuk yang belum dijadwalkan, dan 'Selesai' artinya proses sudah tuntas.",
              imageUrl:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
            },
          ]}
        />
      )}
    </main>
  );
}

interface SidangTableSectionProps {
  title: string;
  data: SidangItem[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterJenis: "all" | JenisSidang;
  setFilterJenis: (val: "all" | JenisSidang) => void;
  filterStatus: "all" | StatusSidang;
  setFilterStatus: (val: "all" | StatusSidang) => void;
  activeJenjang: Jenjang;
  setActiveJenjang: (val: Jenjang) => void;
  perluDinilaiCount: number;
  revisiCount: number;
  onSelectSidang: (sidang: SidangItem) => void;
}

function SidangTableSection({
  title,
  data,
  searchTerm,
  setSearchTerm,
  filterJenis,
  setFilterJenis,
  filterStatus,
  setFilterStatus,
  activeJenjang,
  setActiveJenjang,
  perluDinilaiCount,
  revisiCount,
  onSelectSidang,
}: SidangTableSectionProps) {
  const handleQuickFilter = (status: StatusSidang) => {
    if (filterStatus === status) {
      setFilterStatus("all");
    } else {
      setFilterStatus(status);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Judul & deskripsi */}
      <div className="mb-4">
        <h2 className="text-gray-800 font-[Poppins] text-[18px] font-bold">
          {title}
        </h2>
        <p className="text-sm text-gray-600 font-[Roboto]">
          Daftar sidang aktif berdasarkan jadwal dan status terakhir
        </p>
      </div>

      {/* Tabs Jenjang */}
      <div className="mb-4">
        <Tabs
          value={activeJenjang}
          onValueChange={(val) => setActiveJenjang(val as Jenjang)}
        >
          <TabsList>
            <TabsTrigger value="S1">S-1</TabsTrigger>
            <TabsTrigger value="S2">S-2</TabsTrigger>
            <TabsTrigger value="S3">S-3</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau NRP mahasiswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
          />
        </div>
      </div>

      {/* Area merah */}
      <div className="mb-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm font-[Roboto] text-red-800">
              Anda perlu menyelesaikan proses sidang yang masih belum dinilai
              atau masih dalam tahap revisi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Perlu Dinilai */}
            {perluDinilaiCount > 0 && (
              <button
                type="button"
                onClick={() => handleQuickFilter("Perlu Dinilai")}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-[Roboto] border transition-colors ${
                  filterStatus === "Perlu Dinilai"
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-red-700 border-red-300 hover:bg-red-100"
                }`}
              >
                <span>Perlu Dinilai</span>
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-[Roboto] ${
                    filterStatus === "Perlu Dinilai"
                      ? "bg-white text-red-600"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {perluDinilaiCount}
                </span>
              </button>
            )}

            {/* Revisi */}
            {revisiCount > 0 && (
              <button
                type="button"
                onClick={() => handleQuickFilter("Revisi")}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-[Roboto] border transition-colors ${
                  filterStatus === "Revisi"
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-red-700 border-red-300 hover:bg-red-100"
                }`}
              >
                <span>Revisi</span>
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-[Roboto] ${
                    filterStatus === "Revisi"
                      ? "bg-white text-red-600"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {revisiCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Filter className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-sm font-[Poppins] text-gray-700">Filter</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Jenis */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-xs text-gray-500 font-[Roboto]">Jenis:</span>
            <select
              value={filterJenis}
              onChange={(e) =>
                setFilterJenis(e.target.value as "all" | JenisSidang)
              }
              className="bg-transparent border-none text-sm font-[Roboto] text-gray-800 focus:outline-none focus:ring-0"
            >
              <option value="all">Semua Jenis Sidang</option>
              <option value="Sidang Proposal">Sidang Proposal</option>
              <option value="Sidang Akhir">Sidang Akhir</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <span className="text-xs text-gray-500 font-[Roboto]">
              Status:
            </span>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | StatusSidang)
              }
              className="bg-transparent border-none text-sm font-[Roboto] text-gray-800 focus:outline-none focus:ring-0"
            >
              <option value="all">Semua Status</option>
              <option value="Menunggu Sidang">Menunggu Sidang</option>
              <option value="Perlu Dinilai">Perlu Dinilai</option>
              <option value="Revisi">Revisi</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins] w-12">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">
                  Jenis Sidang
                </th>
                <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">
                  Posisi
                </th>
                <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">
                  Tanggal Sidang
                </th>
                <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-gray-500 font-[Roboto]"
                  >
                    Tidak ada data sidang yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                      {index + 1}
                    </td>

                    {/* Nama + NRP */}
                    <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                      <div className="flex flex-col">
                        <span>{item.nama}</span>
                        <span className="text-xs text-gray-400">
                          {item.nrp}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                      {item.jenisSidang}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                      {item.posisi}
                    </td>

                    {/* Tanggal */}
                    <td className="px-4 py-3 text-sm font-[Roboto]">
                      {item.tanggalSidang ? (
                        <span className="text-gray-700">
                          {item.tanggalSidang}
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-[Roboto] bg-blue-50 text-blue-700">
                          Menunggu Penjadwalan
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-[Roboto] ${
                          item.status === "Perlu Dinilai"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "Revisi"
                            ? "bg-red-100 text-red-700"
                            : item.status === "Menunggu Sidang"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onSelectSidang(item)}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-gray-300 bg-white text-sm text-gray-800 hover:bg-gray-50 font-[Roboto]"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Section untuk Ajuan Sidang (pre-approval)
 * dengan Batch Approval + pop-up konfirmasi UI
 */
interface AjuanSidangSectionProps {
  data: SidangItem[];
  activeJenjang: Jenjang;
  onView: (item: SidangItem) => void;
  onApprove: (item: SidangItem) => void;
}

function AjuanSidangSection({
  data,
  activeJenjang,
  onView,
  onApprove,
}: AjuanSidangSectionProps) {
  const getJenjangTitle = (jenjang: Jenjang) => {
    if (jenjang === "S1") return "Ajuan Sidang S-1";
    if (jenjang === "S2") return "Ajuan Sidang S-2";
    return "Ajuan Sidang S-3";
  };

  // Batch approval state
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleBatchMode = () => {
    setBatchMode((prev) => !prev);
    if (batchMode) {
      setSelectedIds([]);
    }
  };

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    // 🔹 Tampilkan popup konfirmasi UI (bukan window.confirm)
    setShowConfirm(true);
  };

  const doApproveSelected = () => {
    data
      .filter((item) => selectedIds.includes(item.id))
      .forEach((item) => onApprove(item));

    setSelectedIds([]);
    setBatchMode(false);
    setShowConfirm(false);
  };

  const allSelectedInPage =
    data.length > 0 && selectedIds.length === data.length;

  const handleToggleSelectAll = () => {
    if (allSelectedInPage) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((d) => d.id));
    }
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-lg border border-blue-200 p-6">
        {/* Header card */}
        <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-gray-800 font-[Poppins] text-[18px] font-bold flex items-center gap-2">
              {getJenjangTitle(activeJenjang)}
            </h2>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Daftar ajuan sidang yang perlu Anda setujui sebelum masuk ke
              Daftar Sidang.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-800 font-[Roboto]">
              <AlertCircle className="w-3 h-3" />
              <span>
                Approve ajuan akan memindahkan data ke Daftar Sidang sesuai
                jenjang.
              </span>
            </div>

            {data.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleBatchMode}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-[Roboto] border transition-colors ${
                    batchMode
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {batchMode ? "Batalkan Batch" : "Batch Approval"}
                </button>

                {batchMode && (
                  <button
                    type="button"
                    disabled={selectedIds.length === 0}
                    onClick={handleApproveSelected}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-[Roboto] border transition-colors ${
                      selectedIds.length === 0
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-green-500 text-white border-green-500 hover:bg-green-600"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Semua
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins] w-12">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">
                    Jenis Sidang
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins] w-48">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-gray-500 font-[Roboto]"
                    >
                      Belum ada ajuan sidang untuk jenjang ini.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => {
                    const checked = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          {index + 1}
                        </td>

                        {/* Nama + NRP */}
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          <div className="flex flex-col">
                            <span>{item.nama}</span>
                            <span className="text-xs text-gray-400">
                              {item.nrp}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          {item.jenisSidang}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Checkbox muncul hanya saat batchMode */}
                            {batchMode && (
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleSelect(item.id)}
                                className="w-4 h-4 accent-blue-600 cursor-pointer"
                              />
                            )}

                            <button
                              type="button"
                              onClick={() => onApprove(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-[Roboto] hover:bg-green-600"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => onView(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 bg-white text-xs font-[Roboto] text-gray-800 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4" />
                              Lihat
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer batch */}
          {batchMode && data.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <label className="flex items-center gap-2 text-xs text-gray-600 font-[Roboto]">
                <input
                  type="checkbox"
                  checked={allSelectedInPage}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span>Pilih semua ajuan di halaman ini</span>
              </label>
              <span className="text-xs text-gray-500 font-[Roboto]">
                {selectedIds.length} ajuan dipilih
              </span>
            </div>
          )}
        </div>
      </div>

{showConfirm && (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-[448px] h-[264px] max-w-[448px] flex flex-col justify-between p-5">
      {/* Header + teks */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-gray-900 font-[Poppins] text-sm font-semibold mb-1">
            Konfirmasi Batch Approval
          </h3>
          <p className="text-xs text-gray-600 font-[Roboto]">
            Anda akan menyetujui{" "}
            <span className="font-semibold">{selectedIds.length} ajuan sidang</span>{" "}
            sekaligus. Setelah disetujui, data akan berpindah ke{" "}
            <span className="font-semibold">Daftar Sidang</span> dengan status{" "}
            <span className="font-semibold">“Menunggu Sidang”</span>.
          </p>
        </div>
      </div>

      {/* Tombol aksi */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 rounded-full text-xs font-[Roboto] border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={doApproveSelected}
          className="px-3 py-1.5 rounded-full text-xs font-[Roboto] bg-green-500 text-white hover:bg-green-600 inline-flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          Yakin, Approve Semua
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
