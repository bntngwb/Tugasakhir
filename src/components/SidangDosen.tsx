import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Users,
  Search,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from "lucide-react";
import { GuideModal } from "./GuideModal";

interface Sidang {
  id: number;
  nama: string;
  nrp: string;
  jenisSidang: string;
  periode: string;
  statusPengerjaan:
    | "Menunggu"
    | "Dalam Sidang"
    | "Perlu Dinilai"
    | "Pengerjaan Revisi"
    | "Perlu Approval"
    | "Selesai";
  statusRole: "Ketua Sidang" | "Penguji" | "Pembimbing";
  tanggal: string;
  judul: string;
}

interface SidangDosenProps {
  initialFilter?: "Perlu Dinilai" | "Perlu Approval";
}

export function SidangDosen({ initialFilter }: SidangDosenProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState(initialFilter ?? "Semua");
  const [activeFilter, setActiveFilter] = useState<string | null>(
    initialFilter ?? null
  );
  // ...lanjut kode kamu yang sudah ada

  // Mock data
  const sidangList: Sidang[] = [
    {
      id: 1,
      nama: "Budi Santoso",
      nrp: "5025221034",
      jenisSidang: "Sidang Proposal",
      periode: "S1",
      statusPengerjaan: "Perlu Dinilai",
      statusRole: "Pembimbing",
      tanggal: "12 Januari 2026",
      judul: "PENERAPAN VISION TRANSFORMER UNTUK DETEKSI ANOMALI JARINGAN KOMPUTER SKALA BESAR"
    },
    {
      id: 2,
      nama: "Andi Pratama",
      nrp: "5025223002",
      jenisSidang: "Sidang Akhir",
      periode: "S1",
      statusPengerjaan: "Perlu Approval",
      statusRole: "Ketua Sidang",
      tanggal: "15 Januari 2026",
      judul: "RANCANG BANGUN SISTEM MONITORING BIMBINGAN TUGAS AKHIR BERBASIS WEB"
    },
    {
      id: 3,
      nama: "Siti Aminah",
      nrp: "5025201015",
      jenisSidang: "Sidang Proposal",
      periode: "S1",
      statusPengerjaan: "Dalam Sidang",
      statusRole: "Penguji",
      tanggal: "10 Januari 2026",
      judul: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia"
    },
    {
      id: 4,
      nama: "Bayu Aditya",
      nrp: "6025201002",
      jenisSidang: "Sidang Akhir",
      periode: "S2",
      statusPengerjaan: "Pengerjaan Revisi",
      statusRole: "Pembimbing",
      tanggal: "20 Januari 2026",
      judul: "Analisis Sentimen Media Sosial Menggunakan Deep Learning"
    },
    {
      id: 5,
      nama: "Dewi Kartika",
      nrp: "5025201020",
      jenisSidang: "Sidang Proposal",
      periode: "S1",
      statusPengerjaan: "Selesai",
      statusRole: "Ketua Sidang",
      tanggal: "5 Januari 2026",
      judul: "Implementasi Machine Learning untuk Deteksi Penyakit Tanaman"
    },
    {
      id: 6,
      nama: "Rini Susanti",
      nrp: "6025201008",
      jenisSidang: "Sidang Akhir",
      periode: "S2",
      statusPengerjaan: "Menunggu",
      statusRole: "Penguji",
      tanggal: "25 Januari 2026",
      judul: "Optimasi Algoritma Pencarian dengan Genetic Algorithm"
    }
  ];

  // Filter
  const filteredSidang = sidangList.filter(sidang => {
    const matchesSearch = sidang.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sidang.nrp.includes(searchQuery) ||
                         sidang.judul.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenis = selectedJenis === "Semua" || sidang.jenisSidang === selectedJenis;
    const matchesStatus = selectedStatus === "Semua" || sidang.statusPengerjaan === selectedStatus;
    return matchesSearch && matchesJenis && matchesStatus;
  });

  const totalSidang = sidangList.length;
  const perluNilai = sidangList.filter(s => s.statusPengerjaan === "Perlu Dinilai").length;
  const perluApproval = sidangList.filter(s => s.statusPengerjaan === "Perlu Approval").length;

  const handleCardClick = (filter: string) => {
    if (activeFilter === filter) {
      // If clicking the same filter, reset
      setActiveFilter(null);
      setSelectedStatus("Semua");
    } else {
      // Apply new filter
      setActiveFilter(filter);
      setSelectedStatus(filter);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Dalam Sidang":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Perlu Dinilai":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Pengerjaan Revisi":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Perlu Approval":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Selesai":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Ketua Sidang":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Penguji":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Pembimbing":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Menunggu":
        return <Clock className="w-4 h-4" />;
      case "Dalam Sidang":
        return <Users className="w-4 h-4" />;
      case "Perlu Dinilai":
        return <AlertCircle className="w-4 h-4" />;
      case "Pengerjaan Revisi":
        return <FileText className="w-4 h-4" />;
      case "Perlu Approval":
        return <AlertCircle className="w-4 h-4" />;
      case "Selesai":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">Sidang</h1>
            <button 
              onClick={() => setIsGuideModalOpen(true)} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-[Poppins]">Panduan Penggunaan</span>
            </button>
          </div>
          <p className="text-gray-500 font-[Roboto]">Kelola sidang tugas akhir mahasiswa</p>
        </div>

        {/* Statistics Cards */}
<div className="grid md:grid-cols-3 gap-4 mb-6">
  {/* Card Jumlah Sidang */}
  <div className="bg-white rounded-lg border-2 p-4 text-left">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
        <Users className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600 font-[Roboto]">Jumlah Sidang</p>
        <p className="text-2xl text-gray-800 font-[Poppins]">{totalSidang}</p>
      </div>
    </div>
  </div>

  {/* Card Perlu Nilai */}
  <button
    onClick={() => handleCardClick("Perlu Dinilai")}
    className={`bg-white rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
      activeFilter === "Perlu Dinilai" 
        ? "border-yellow-500 shadow-md" 
        : "border-gray-200"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600 font-[Roboto]">Perlu Nilai</p>
        <p className="text-2xl text-gray-800 font-[Poppins]">{perluNilai}</p>
      </div>
    </div>
  </button>

  {/* Card Perlu Approval */}
  <button
    onClick={() => handleCardClick("Perlu Approval")}
    className={`bg-white rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
      activeFilter === "Perlu Approval" 
        ? "border-purple-500 shadow-md" 
        : "border-gray-200"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600 font-[Roboto]">Perlu Approval</p>
        <p className="text-2xl text-gray-800 font-[Poppins]">{perluApproval}</p>
      </div>
    </div>
  </button>
</div>


        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, NRP, atau judul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
              />
            </div>

            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Jenis</option>
              <option value="Sidang Proposal">Sidang Proposal</option>
              <option value="Sidang Akhir">Sidang Akhir</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Dalam Sidang">Dalam Sidang</option>
              <option value="Perlu Dinilai">Perlu Dinilai</option>
              <option value="Pengerjaan Revisi">Pengerjaan Revisi</option>
              <option value="Perlu Approval">Perlu Approval</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Sidang List */}
        <div className="space-y-4">
          {filteredSidang.map((sidang) => (
            <div key={sidang.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-800 font-[Poppins]">{sidang.nama}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-[Roboto]">
                      {sidang.periode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-[Roboto] border ${getStatusColor(sidang.statusPengerjaan)} flex items-center gap-1`}>
                      {getStatusIcon(sidang.statusPengerjaan)}
                      {sidang.statusPengerjaan}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-[Roboto] border ${getRoleColor(sidang.statusRole)}`}>
                      {sidang.statusRole}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-[Roboto] mb-1">NRP: {sidang.nrp}</p>
                  <p className="text-sm text-gray-800 font-[Roboto] mb-3">{sidang.judul}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 font-[Roboto]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{sidang.jenisSidang}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{sidang.tanggal}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`#/dosen/sidang/${sidang.id}`}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Lihat
                </a>
              </div>
            </div>
          ))}

          {filteredSidang.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-[Roboto]">Tidak ada sidang ditemukan</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

      {/* Guide Modal */}
      {isGuideModalOpen && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          title="Panduan Penggunaan - Sidang"
          steps={[
            {
              title: "Kelola Sidang",
              description: "Halaman Sidang menampilkan semua sidang tugas akhir yang Anda kelola sebagai ketua sidang, penguji, atau pembimbing.",
              imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800"
            },
            {
              title: "Lihat Detail Sidang",
              description: "Klik tombol 'Lihat' untuk melihat detail sidang dan melakukan penilaian sesuai dengan peran Anda.",
              imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"
            }
          ]}
        />
      )}
    </main>
  );
}