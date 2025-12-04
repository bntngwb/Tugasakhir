import { useState } from "react";
import { ArrowLeft, Plus, X, Save, ChevronDown, ChevronUp, Calendar, Users, Edit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { CustomSelect } from "./ui/CustomSelect";

interface KonfigurasiSidangProps {
  onNavigate?: (page: string) => void;
}

interface MahasiswaSidang {
  id: number;
  nama: string;
  nrp: string;
  judulTA: string;
  pembimbing1: string;
  pembimbing2: string;
  statusDokumen: "Lengkap" | "Belum Lengkap";
  tanggalDaftar: string;
}

interface Sidang {
  id: number;
  namaSidang: string;
  jenisSidang: "Proposal" | "Tugas Akhir";
  periode: string;
  gelombang: number;
  kuota: number;
  status: "Akan Datang" | "Sedang Berjalan" | "Selesai";
  tanggalPendaftaranMulai: string;
  tanggalPendaftaranSelesai: string;
  tanggalSidangMulai: string;
  tanggalSidangSelesai: string;
  jenisPrasyarat: string;
  jenisPenilaian: string;
  peserta: MahasiswaSidang[];
}

export function KonfigurasiSidang({ onNavigate }: KonfigurasiSidangProps) {
  const [viewMode, setViewMode] = useState<"list" | "create" | "detail">("list");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedSidang, setSelectedSidang] = useState<Sidang | null>(null);

  // Mock data sidang
  const [sidangList, setSidangList] = useState<Sidang[]>([
    {
      id: 1,
      namaSidang: "Sidang Proposal Gelombang 1",
      jenisSidang: "Proposal",
      periode: "Semester Gasal 2025/2026",
      gelombang: 1,
      kuota: 50,
      status: "Sedang Berjalan",
      tanggalPendaftaranMulai: "2025-10-01",
      tanggalPendaftaranSelesai: "2025-10-15",
      tanggalSidangMulai: "2025-10-20",
      tanggalSidangSelesai: "2025-10-30",
      jenisPrasyarat: "Konfigurasi Dokumen Proposal",
      jenisPenilaian: "Konfigurasi Sidang Proposal",
      peserta: [
        {
          id: 1,
          nama: "Ahmad Fauzi Ramadhan",
          nrp: "5025201001",
          judulTA: "Implementasi Machine Learning untuk Prediksi Cuaca",
          pembimbing1: "Dr. Ahmad Saikhu, S.Kom., M.T.",
          pembimbing2: "Dr. Retno Wardani, S.Kom., M.Kom.",
          statusDokumen: "Lengkap",
          tanggalDaftar: "2025-10-05"
        },
        {
          id: 2,
          nama: "Siti Aminah Putri",
          nrp: "5025201015",
          judulTA: "Sistem Informasi Manajemen Rumah Sakit Berbasis Web",
          pembimbing1: "Prof. Dr. Bambang Setiawan, M.Sc.",
          pembimbing2: "Dr. Eng. Siti Aminah, S.T., M.T.",
          statusDokumen: "Lengkap",
          tanggalDaftar: "2025-10-06"
        },
        {
          id: 3,
          nama: "Bayu Aditya Pratama",
          nrp: "6025201002",
          judulTA: "Aplikasi Mobile untuk Monitoring Kesehatan",
          pembimbing1: "Ir. Budi Prasetyo, M.Kom., Ph.D.",
          pembimbing2: "Dr. Dewi Kusuma, S.Kom., M.T.",
          statusDokumen: "Belum Lengkap",
          tanggalDaftar: "2025-10-08"
        }
      ]
    },
    {
      id: 2,
      namaSidang: "Sidang Akhir Gelombang 1",
      jenisSidang: "Tugas Akhir",
      periode: "Semester Gasal 2025/2026",
      gelombang: 1,
      kuota: 40,
      status: "Akan Datang",
      tanggalPendaftaranMulai: "2025-11-01",
      tanggalPendaftaranSelesai: "2025-11-15",
      tanggalSidangMulai: "2025-11-20",
      tanggalSidangSelesai: "2025-12-05",
      jenisPrasyarat: "Konfigurasi Dokumen Final",
      jenisPenilaian: "Konfigurasi Sidang Tugas Akhir",
      peserta: []
    },
    {
      id: 3,
      namaSidang: "Sidang Proposal Gelombang 2",
      jenisSidang: "Proposal",
      periode: "Semester Genap 2024/2025",
      gelombang: 2,
      kuota: 45,
      status: "Selesai",
      tanggalPendaftaranMulai: "2025-02-01",
      tanggalPendaftaranSelesai: "2025-02-15",
      tanggalSidangMulai: "2025-02-20",
      tanggalSidangSelesai: "2025-03-05",
      jenisPrasyarat: "Konfigurasi Dokumen Proposal",
      jenisPenilaian: "Konfigurasi Sidang Proposal",
      peserta: [
        {
          id: 4,
          nama: "Dewi Kartika Sari",
          nrp: "5025201020",
          judulTA: "Analisis Sentimen Media Sosial dengan Deep Learning",
          pembimbing1: "Dr. Eko Prasetio, S.Si., M.Kom.",
          pembimbing2: "Dr. Fitri Handayani, S.Kom., M.Sc.",
          statusDokumen: "Lengkap",
          tanggalDaftar: "2025-02-03"
        }
      ]
    }
  ]);

  // Form state
  const [formNamaSidang, setFormNamaSidang] = useState("");
  const [formJenisSidang, setFormJenisSidang] = useState<"Proposal" | "Tugas Akhir">("Proposal");
  const [formPeriode, setFormPeriode] = useState("");
  const [formGelombang, setFormGelombang] = useState(1);
  const [formKuota, setFormKuota] = useState(50);
  const [formTanggalPendaftaranMulai, setFormTanggalPendaftaranMulai] = useState("");
  const [formTanggalPendaftaranSelesai, setFormTanggalPendaftaranSelesai] = useState("");
  const [formTanggalSidangMulai, setFormTanggalSidangMulai] = useState("");
  const [formTanggalSidangSelesai, setFormTanggalSidangSelesai] = useState("");
  const [formJenisPrasyarat, setFormJenisPrasyarat] = useState("");
  const [formJenisPenilaian, setFormJenisPenilaian] = useState("");

  // Mock data from other configurations
  const prasyaratOptions = [
    "Konfigurasi Dokumen Final",
    "Konfigurasi Dokumen Proposal",
    "Konfigurasi Dokumen Final (Lama)"
  ];

  const penilaianOptions = [
    "Konfigurasi Sidang Proposal",
    "Konfigurasi Sidang Tugas Akhir",
    "Konfigurasi Sidang Proposal (Lama)"
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStartCreate = () => {
    setFormNamaSidang("");
    setFormJenisSidang("Proposal");
    setFormPeriode("");
    setFormGelombang(1);
    setFormKuota(50);
    setFormTanggalPendaftaranMulai("");
    setFormTanggalPendaftaranSelesai("");
    setFormTanggalSidangMulai("");
    setFormTanggalSidangSelesai("");
    setFormJenisPrasyarat("");
    setFormJenisPenilaian("");
    setViewMode("create");
  };

  const handleViewDetail = (sidang: Sidang) => {
    setSelectedSidang(sidang);
    setViewMode("detail");
  };

  const handleSave = () => {
    if (!formNamaSidang.trim()) {
      toast.error("Nama sidang harus diisi");
      return;
    }

    if (!formJenisPrasyarat || !formJenisPenilaian) {
      toast.error("Pilih jenis prasyarat dan penilaian");
      return;
    }

    if (!formTanggalPendaftaranMulai || !formTanggalPendaftaranSelesai || !formTanggalSidangMulai || !formTanggalSidangSelesai) {
      toast.error("Semua tanggal harus diisi");
      return;
    }

    // Determine status based on dates
    const today = new Date();
    const pendaftaranMulai = new Date(formTanggalPendaftaranMulai);
    const sidangSelesai = new Date(formTanggalSidangSelesai);
    
    let status: "Akan Datang" | "Sedang Berjalan" | "Selesai" = "Akan Datang";
    if (today > sidangSelesai) {
      status = "Selesai";
    } else if (today >= pendaftaranMulai) {
      status = "Sedang Berjalan";
    }

    const newSidang: Sidang = {
      id: Date.now(),
      namaSidang: formNamaSidang,
      jenisSidang: formJenisSidang,
      periode: formPeriode,
      gelombang: formGelombang,
      kuota: formKuota,
      status,
      tanggalPendaftaranMulai: formTanggalPendaftaranMulai,
      tanggalPendaftaranSelesai: formTanggalPendaftaranSelesai,
      tanggalSidangMulai: formTanggalSidangMulai,
      tanggalSidangSelesai: formTanggalSidangSelesai,
      jenisPrasyarat: formJenisPrasyarat,
      jenisPenilaian: formJenisPenilaian,
      peserta: []
    };

    setSidangList([newSidang, ...sidangList]);
    toast.success("Sidang berhasil ditambahkan");
    setViewMode("list");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Akan Datang":
        return "bg-blue-100 text-blue-700";
      case "Sedang Berjalan":
        return "bg-green-100 text-green-700";
      case "Selesai":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // List View
  if (viewMode === "list") {
    return (
      <div className="p-8 bg-[#f5f5f5] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onNavigate && (
              <button
                onClick={() => onNavigate("Beranda")}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-gray-800 font-[Poppins] mb-1">Konfigurasi Sidang</h1>
              <p className="text-sm text-gray-600 font-[Roboto]">
                Kelola sidang proposal dan tugas akhir
              </p>
            </div>
          </div>
          <button
            onClick={handleStartCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambahkan Sidang
          </button>
        </div>

        {/* Sidang List */}
        <div className="space-y-4">
          {sidangList.map((sidang, index) => {
            const isExpanded = expandedId === sidang.id;

            return (
              <motion.div
                key={sidang.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-800 font-[Poppins]">{sidang.namaSidang}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-[Roboto] ${getStatusColor(sidang.status)}`}>
                          {sidang.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 font-[Roboto]">
                        <div>
                          <span className="text-gray-500">Jenis:</span> {sidang.jenisSidang}
                        </div>
                        <div>
                          <span className="text-gray-500">Periode:</span> {sidang.periode}
                        </div>
                        <div>
                          <span className="text-gray-500">Gelombang:</span> {sidang.gelombang}
                        </div>
                        <div>
                          <span className="text-gray-500">Peserta:</span> {sidang.peserta.length}/{sidang.kuota}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewDetail(sidang)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Lihat Peserta
                      </button>
                      <button
                        onClick={() => toggleExpand(sidang.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Periode Pendaftaran */}
                          <div>
                            <h4 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Periode Pendaftaran
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-[Roboto]">Mulai:</span>
                                <span className="text-gray-800 font-[Roboto]">{formatDate(sidang.tanggalPendaftaranMulai)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-[Roboto]">Selesai:</span>
                                <span className="text-gray-800 font-[Roboto]">{formatDate(sidang.tanggalPendaftaranSelesai)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Periode Sidang */}
                          <div>
                            <h4 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Periode Sidang
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-[Roboto]">Mulai:</span>
                                <span className="text-gray-800 font-[Roboto]">{formatDate(sidang.tanggalSidangMulai)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-[Roboto]">Selesai:</span>
                                <span className="text-gray-800 font-[Roboto]">{formatDate(sidang.tanggalSidangSelesai)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Konfigurasi */}
                          <div className="md:col-span-2">
                            <h4 className="text-gray-800 font-[Poppins] mb-3">Konfigurasi</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <p className="text-xs text-gray-500 font-[Roboto] mb-1">Jenis Prasyarat</p>
                                <p className="text-sm text-gray-800 font-[Roboto]">{sidang.jenisPrasyarat}</p>
                              </div>
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <p className="text-xs text-gray-500 font-[Roboto] mb-1">Jenis Penilaian</p>
                                <p className="text-sm text-gray-800 font-[Roboto]">{sidang.jenisPenilaian}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>
    );
  }

  // Create Form View
  if (viewMode === "create") {
    return (
      <div className="p-8 bg-[#f5f5f5] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("list")}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-800 font-[Poppins] mb-1">Tambah Sidang Baru</h1>
              <p className="text-sm text-gray-600 font-[Roboto]">
                Buat sidang proposal atau tugas akhir
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-gray-800 font-[Poppins] mb-4">Informasi Dasar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Nama Sidang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formNamaSidang}
                    onChange={(e) => setFormNamaSidang(e.target.value)}
                    placeholder="Contoh: Sidang Proposal Gelombang 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Jenis Sidang
                  </label>
                  <select
                    value={formJenisSidang}
                    onChange={(e) => setFormJenisSidang(e.target.value as "Proposal" | "Tugas Akhir")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  >
                    <option value="Proposal">Sidang Proposal</option>
                    <option value="Tugas Akhir">Sidang Tugas Akhir</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Periode Sidang
                  </label>
                  <input
                    type="text"
                    value={formPeriode}
                    onChange={(e) => setFormPeriode(e.target.value)}
                    placeholder="Contoh: Semester Gasal 2025/2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Gelombang
                  </label>
                  <input
                    type="number"
                    value={formGelombang}
                    onChange={(e) => setFormGelombang(Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Kuota Peserta
                  </label>
                  <input
                    type="number"
                    value={formKuota}
                    onChange={(e) => setFormKuota(Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Konfigurasi */}
            <div>
              <h2 className="text-gray-800 font-[Poppins] mb-4">Konfigurasi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Pilih Jenis Prasyarat <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    value={formJenisPrasyarat}
                    onChange={setFormJenisPrasyarat}
                    options={prasyaratOptions.map(opt => ({ value: opt, label: opt }))}
                    placeholder="Pilih Prasyarat"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Pilih Jenis Penilaian <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    value={formJenisPenilaian}
                    onChange={setFormJenisPenilaian}
                    options={penilaianOptions.map(opt => ({ value: opt, label: opt }))}
                    placeholder="Pilih Penilaian"
                  />
                </div>
              </div>
            </div>

            {/* Tanggal Pendaftaran */}
            <div>
              <h2 className="text-gray-800 font-[Poppins] mb-4">Periode Pendaftaran</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTanggalPendaftaranMulai}
                    onChange={(e) => setFormTanggalPendaftaranMulai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTanggalPendaftaranSelesai}
                    onChange={(e) => setFormTanggalPendaftaranSelesai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Tanggal Sidang */}
            <div>
              <h2 className="text-gray-800 font-[Poppins] mb-4">Periode Sidang</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTanggalSidangMulai}
                    onChange={(e) => setFormTanggalSidangMulai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTanggalSidangSelesai}
                    onChange={(e) => setFormTanggalSidangSelesai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setViewMode("list")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan Sidang
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>
    );
  }

  // Detail View (Peserta)
  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedSidang(null);
              setViewMode("list");
            }}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-gray-800 font-[Poppins] mb-1">{selectedSidang?.namaSidang}</h1>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Daftar peserta yang mengikuti sidang
            </p>
          </div>
        </div>
        <button
          onClick={() => toast.info("Fitur penjadwalan akan segera hadir")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Jadwalkan
        </button>
      </div>

      {/* Info Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 font-[Roboto] mb-1">Total Peserta</p>
            <p className="text-2xl text-gray-800 font-[Poppins]">
              {selectedSidang?.peserta.length}/{selectedSidang?.kuota}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-[Roboto] mb-1">Dokumen Lengkap</p>
            <p className="text-2xl text-green-600 font-[Poppins]">
              {selectedSidang?.peserta.filter(p => p.statusDokumen === "Lengkap").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-[Roboto] mb-1">Dokumen Belum Lengkap</p>
            <p className="text-2xl text-red-600 font-[Poppins]">
              {selectedSidang?.peserta.filter(p => p.statusDokumen === "Belum Lengkap").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-[Roboto] mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-[Roboto] ${getStatusColor(selectedSidang?.status || "")}`}>
              {selectedSidang?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Peserta Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {selectedSidang && selectedSidang.peserta.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-[Roboto]">
              Belum ada peserta yang mendaftar sidang ini
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                    Nama / NRP
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                    Judul Tugas Akhir
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                    Pembimbing 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                    Pembimbing 2
                  </th>
                  <th className="px-6 py-3 text-center text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                    Status Dokumen
                  </th>
                  <th className="px-6 py-3 text-center text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                    Tanggal Daftar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedSidang?.peserta.map((peserta, index) => (
                  <tr key={peserta.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800 font-[Roboto]">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-800 font-[Roboto]">{peserta.nama}</p>
                        <p className="text-xs text-gray-500 font-[Roboto]">{peserta.nrp}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-[Roboto] max-w-xs">
                      {peserta.judulTA}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-[Roboto]">
                      {peserta.pembimbing1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-[Roboto]">
                      {peserta.pembimbing2}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-[Roboto] ${
                        peserta.statusDokumen === "Lengkap"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {peserta.statusDokumen}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-[Roboto] text-center">
                      {formatDate(peserta.tanggalDaftar)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 font-[Roboto]">
          © 2021-2025 Institut Teknologi Sepuluh Nopember
        </p>
      </footer>
    </div>
  );
}