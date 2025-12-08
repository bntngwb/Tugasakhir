import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Save,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Edit,
  Search,
  Eye,
  Clock,
  MapPin,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { CustomSelect } from "./ui/CustomSelect";

interface KonfigurasiSidangProps {
  onNavigate?: (page: string) => void;
}

interface PrasyaratFile {
  id: number;
  name: string;
  uploaded: boolean;
  fileName?: string;
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

  abstrak: string;
  prasyaratFiles: PrasyaratFile[];

  // Jadwal sidang per mahasiswa
  tanggalSidang?: string; // format: "YYYY-MM-DD"
  jamSidang?: string; // contoh: "08:30 - 10:30"
  ruanganSidang?: string;
  modeSidang?: "Online" | "Offline";
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
  const [viewMode, setViewMode] = useState<
    "list" | "create" | "detail" | "schedule" | "pesertaDetail"
  >("list");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedSidang, setSelectedSidang] = useState<Sidang | null>(null);
  const [selectedPeserta, setSelectedPeserta] =
    useState<MahasiswaSidang | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

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
          tanggalDaftar: "2025-10-05",
          abstrak:
            "Penelitian ini mengembangkan model machine learning untuk memprediksi cuaca harian di kota-kota besar Indonesia dengan memanfaatkan data historis dan variabel meteorologi.",
          prasyaratFiles: [
            {
              id: 1,
              name: "Form Pendaftaran Sidang",
              uploaded: true,
              fileName: "form_pendaftaran_5025201001.pdf",
            },
            {
              id: 2,
              name: "Draft Proposal Lengkap",
              uploaded: true,
              fileName: "proposal_ahmad_fauzi.pdf",
            },
            {
              id: 3,
              name: "Lembar Persetujuan Pembimbing",
              uploaded: true,
              fileName: "lembar_persetujuan_ahmad_fauzi.pdf",
            },
          ],
        },
        {
          id: 2,
          nama: "Siti Aminah Putri",
          nrp: "5025201015",
          judulTA:
            "Sistem Informasi Manajemen Rumah Sakit Berbasis Web di Lingkungan Perkotaan",
          pembimbing1: "Prof. Dr. Bambang Setiawan, M.Sc.",
          pembimbing2: "Dr. Eng. Siti Aminah, S.T., M.T.",
          statusDokumen: "Lengkap",
          tanggalDaftar: "2025-10-06",
          abstrak:
            "Penelitian ini merancang sistem informasi manajemen rumah sakit berbasis web untuk meningkatkan efisiensi pelayanan, pengelolaan rekam medis, serta pelaporan manajerial.",
          prasyaratFiles: [
            {
              id: 1,
              name: "Form Pendaftaran Sidang",
              uploaded: true,
              fileName: "form_pendaftaran_5025201015.pdf",
            },
            {
              id: 2,
              name: "Draft Proposal Lengkap",
              uploaded: true,
              fileName: "proposal_siti_aminah.pdf",
            },
            {
              id: 3,
              name: "Lembar Persetujuan Pembimbing",
              uploaded: true,
              fileName: "lembar_persetujuan_siti_aminah.pdf",
            },
          ],
        },
        {
          id: 3,
          nama: "Bayu Aditya Pratama",
          nrp: "6025201002",
          judulTA: "Aplikasi Mobile untuk Monitoring Kesehatan Berbasis IoT",
          pembimbing1: "Ir. Budi Prasetyo, M.Kom., Ph.D.",
          pembimbing2: "Dr. Dewi Kusuma, S.Kom., M.T.",
          statusDokumen: "Belum Lengkap",
          tanggalDaftar: "2025-10-08",
          abstrak:
            "Penelitian ini mengembangkan aplikasi mobile terintegrasi dengan perangkat IoT untuk memonitor parameter kesehatan dasar secara real-time.",
          prasyaratFiles: [
            {
              id: 1,
              name: "Form Pendaftaran Sidang",
              uploaded: true,
              fileName: "form_pendaftaran_6025201002.pdf",
            },
            {
              id: 2,
              name: "Draft Proposal Lengkap",
              uploaded: false,
            },
            {
              id: 3,
              name: "Lembar Persetujuan Pembimbing",
              uploaded: false,
            },
          ],
        },
      ],
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
      peserta: [],
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
          judulTA:
            "Analisis Sentimen Media Sosial Menggunakan Deep Learning untuk Pemantauan Opini Publik",
          pembimbing1: "Dr. Eko Prasetio, S.Si., M.Kom.",
          pembimbing2: "Dr. Fitri Handayani, S.Kom., M.Sc.",
          statusDokumen: "Lengkap",
          tanggalDaftar: "2025-02-03",
          abstrak:
            "Penelitian ini mengkaji pemanfaatan model deep learning untuk analisis sentimen media sosial dalam konteks pemantauan opini publik secara real-time.",
          prasyaratFiles: [
            {
              id: 1,
              name: "Form Pendaftaran Sidang",
              uploaded: true,
              fileName: "form_pendaftaran_5025201020.pdf",
            },
            {
              id: 2,
              name: "Draft Proposal Lengkap",
              uploaded: true,
              fileName: "proposal_dewi_kartika.pdf",
            },
            {
              id: 3,
              name: "Lembar Persetujuan Pembimbing",
              uploaded: true,
              fileName: "lembar_persetujuan_dewi_kartika.pdf",
            },
          ],
        },
      ],
    },
  ]);

  // Form state
  const [formNamaSidang, setFormNamaSidang] = useState("");
  const [formJenisSidang, setFormJenisSidang] = useState<
    "Proposal" | "Tugas Akhir"
  >("Proposal");
  const [formPeriode, setFormPeriode] = useState("");
  const [formGelombang, setFormGelombang] = useState(1);
  const [formKuota, setFormKuota] = useState(50);
  const [formTanggalPendaftaranMulai, setFormTanggalPendaftaranMulai] =
    useState("");
  const [formTanggalPendaftaranSelesai, setFormTanggalPendaftaranSelesai] =
    useState("");
  const [formTanggalSidangMulai, setFormTanggalSidangMulai] = useState("");
  const [formTanggalSidangSelesai, setFormTanggalSidangSelesai] =
    useState("");
  const [formJenisPrasyarat, setFormJenisPrasyarat] = useState("");
  const [formJenisPenilaian, setFormJenisPenilaian] = useState("");

  // Form jadwal per mahasiswa
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleStartTime, setScheduleStartTime] = useState("");
  const [scheduleEndTime, setScheduleEndTime] = useState("");
  const [scheduleRoom, setScheduleRoom] = useState("");
  const [scheduleMode, setScheduleMode] = useState<"Online" | "Offline">(
    "Offline"
  );

  // Mock data from other configurations
  const prasyaratOptions = [
    "Konfigurasi Dokumen Final",
    "Konfigurasi Dokumen Proposal",
    "Konfigurasi Dokumen Final (Lama)",
  ];

  const penilaianOptions = [
    "Konfigurasi Sidang Proposal",
    "Konfigurasi Sidang Tugas Akhir",
    "Konfigurasi Sidang Proposal (Lama)",
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
    setSearchQuery("");
    setViewMode("detail");
  };

  const handleOpenSchedule = (sidang: Sidang, peserta: MahasiswaSidang) => {
    setSelectedSidang(sidang);
    setSelectedPeserta(peserta);

    setScheduleDate(peserta.tanggalSidang || "");

    if (peserta.jamSidang && peserta.jamSidang.includes(" - ")) {
      const [start, end] = peserta.jamSidang.split(" - ");
      setScheduleStartTime(start || "");
      setScheduleEndTime(end || "");
    } else {
      setScheduleStartTime("");
      setScheduleEndTime("");
    }

    setScheduleRoom(peserta.ruanganSidang || "");
    setScheduleMode(peserta.modeSidang || "Offline");

    setViewMode("schedule");
  };

  const handleOpenPesertaDetail = (
    sidang: Sidang,
    peserta: MahasiswaSidang
  ) => {
    setSelectedSidang(sidang);
    setSelectedPeserta(peserta);
    setViewMode("pesertaDetail");
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

    if (
      !formTanggalPendaftaranMulai ||
      !formTanggalPendaftaranSelesai ||
      !formTanggalSidangMulai ||
      !formTanggalSidangSelesai
    ) {
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
      peserta: [],
    };

    setSidangList([newSidang, ...sidangList]);
    toast.success("Sidang berhasil ditambahkan");
    setViewMode("list");
  };

  const handleSaveSchedule = () => {
    if (!selectedSidang || !selectedPeserta) return;

    if (!scheduleDate || !scheduleStartTime || !scheduleEndTime || !scheduleRoom) {
      toast.error("Mohon lengkapi semua field jadwal sidang");
      return;
    }

    const jamString = `${scheduleStartTime} - ${scheduleEndTime}`;

    const updatedList = sidangList.map((s) => {
      if (s.id !== selectedSidang.id) return s;

      return {
        ...s,
        peserta: s.peserta.map((p) =>
          p.id === selectedPeserta.id
            ? {
                ...p,
                tanggalSidang: scheduleDate,
                jamSidang: jamString,
                ruanganSidang: scheduleRoom,
                modeSidang: scheduleMode,
              }
            : p
        ),
      };
    });

    setSidangList(updatedList);
    const latestSidang =
      updatedList.find((s) => s.id === selectedSidang.id) || null;
    setSelectedSidang(latestSidang);

    toast.success("Jadwal sidang berhasil disimpan");
    setViewMode("detail");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
              <h1 className="text-gray-800 font-[Poppins] mb-1">
                Konfigurasi Sidang
              </h1>
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
                        <h3 className="text-gray-800 font-[Poppins]">
                          {sidang.namaSidang}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-[Roboto] ${getStatusColor(
                            sidang.status
                          )}`}
                        >
                          {sidang.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 font-[Roboto]">
                        <div>
                          <span className="text-gray-500">Jenis:</span>{" "}
                          {sidang.jenisSidang}
                        </div>
                        <div>
                          <span className="text-gray-500">Periode:</span>{" "}
                          {sidang.periode}
                        </div>
                        <div>
                          <span className="text-gray-500">Gelombang:</span>{" "}
                          {sidang.gelombang}
                        </div>
                        <div>
                          <span className="text-gray-500">Peserta:</span>{" "}
                          {sidang.peserta.length}/{sidang.kuota}
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
                                <span className="text-gray-600 font-[Roboto]">
                                  Mulai:
                                </span>
                                <span className="text-gray-800 font-[Roboto]">
                                  {formatDate(
                                    sidang.tanggalPendaftaranMulai
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-[Roboto]">
                                  Selesai:
                                </span>
                                <span className="text-gray-800 font-[Roboto]">
                                  {formatDate(
                                    sidang.tanggalPendaftaranSelesai
                                  )}
                                </span>
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
                                <span className="text-gray-600 font-[Roboto]">
                                  Mulai:
                                </span>
                                <span className="text-gray-800 font-[Roboto]">
                                  {formatDate(sidang.tanggalSidangMulai)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-[Roboto]">
                                  Selesai:
                                </span>
                                <span className="text-gray-800 font-[Roboto]">
                                  {formatDate(sidang.tanggalSidangSelesai)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Konfigurasi */}
                          <div className="md:col-span-2">
                            <h4 className="text-gray-800 font-[Poppins] mb-3">
                              Konfigurasi
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                                  Jenis Prasyarat
                                </p>
                                <p className="text-sm text-gray-800 font-[Roboto]">
                                  {sidang.jenisPrasyarat}
                                </p>
                              </div>
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                                  Jenis Penilaian
                                </p>
                                <p className="text-sm text-gray-800 font-[Roboto]">
                                  {sidang.jenisPenilaian}
                                </p>
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
              <h1 className="text-gray-800 font-[Poppins] mb-1">
                Tambah Sidang Baru
              </h1>
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
              <h2 className="text-gray-800 font-[Poppins] mb-4">
                Informasi Dasar
              </h2>
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
                    onChange={(e) =>
                      setFormJenisSidang(
                        e.target.value as "Proposal" | "Tugas Akhir"
                      )
                    }
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
              <h2 className="text-gray-800 font-[Poppins] mb-4">
                Konfigurasi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Pilih Jenis Prasyarat{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    value={formJenisPrasyarat}
                    onChange={setFormJenisPrasyarat}
                    options={prasyaratOptions.map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                    placeholder="Pilih Prasyarat"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Pilih Jenis Penilaian{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    value={formJenisPenilaian}
                    onChange={setFormJenisPenilaian}
                    options={penilaianOptions.map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                    placeholder="Pilih Penilaian"
                  />
                </div>
              </div>
            </div>

            {/* Tanggal Pendaftaran */}
            <div>
              <h2 className="text-gray-800 font-[Poppins] mb-4">
                Periode Pendaftaran
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formTanggalPendaftaranMulai}
                    onChange={(e) =>
                      setFormTanggalPendaftaranMulai(e.target.value)
                    }
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
                    onChange={(e) =>
                      setFormTanggalPendaftaranSelesai(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Tanggal Sidang */}
            <div>
              <h2 className="text-gray-800 font-[Poppins] mb-4">
                Periode Sidang
              </h2>
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
                    onChange={(e) =>
                      setFormTanggalSidangSelesai(e.target.value)
                    }
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

  // Schedule per Mahasiswa View
  if (viewMode === "schedule" && selectedSidang && selectedPeserta) {
    return (
      <div className="p-8 bg-[#f5f5f5] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("detail")}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-800 font-[Poppins] mb-1">
                Atur Jadwal Sidang
              </h1>
              <p className="text-sm text-gray-600 font-[Roboto]">
                {selectedSidang.namaSidang}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Info Mahasiswa */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-gray-800 font-[Poppins] mb-4">
              Informasi Mahasiswa
            </h2>
            <div className="space-y-2 text-sm font-[Roboto] text-gray-700">
              <p>
                <span className="text-gray-500">Nama:</span>{" "}
                {selectedPeserta.nama}
              </p>
              <p>
                <span className="text-gray-500">NRP:</span>{" "}
                {selectedPeserta.nrp}
              </p>
              <p>
                <span className="text-gray-500">Judul TA:</span>{" "}
                {selectedPeserta.judulTA}
              </p>
            </div>
          </div>

          {/* Form Jadwal */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-gray-800 font-[Poppins] mb-4">
              Jadwal Sidang
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tanggal Sidang */}
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Tanggal Sidang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>

                {/* Mode Sidang */}
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Mode Sidang <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={scheduleMode}
                    onChange={(e) =>
                      setScheduleMode(e.target.value as "Online" | "Offline")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>

              {/* Jam Sidang */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Jam Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={scheduleStartTime}
                    onChange={(e) => setScheduleStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                    Jam Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={scheduleEndTime}
                    onChange={(e) => setScheduleEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>
              </div>

              {/* Ruangan */}
              <div>
                <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                  Ruangan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={scheduleRoom}
                  onChange={(e) => setScheduleRoom(e.target.value)}
                  placeholder="Contoh: Ruang Sidang 101 / Zoom Room 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setViewMode("detail")}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-[Roboto] text-sm transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveSchedule}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-[Roboto] text-sm transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan Jadwal
              </button>
            </div>
          </div>
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

  // Detail Pendaftaran Mahasiswa View
  if (viewMode === "pesertaDetail" && selectedSidang && selectedPeserta) {
    const hasSchedule = !!selectedPeserta.tanggalSidang;

    return (
      <div className="p-8 bg-[#f5f5f5] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("detail")}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-800 font-[Poppins] mb-1">
                Detail Pendaftaran Sidang
              </h1>
              <p className="text-sm text-gray-600 font-[Roboto]">
                {selectedSidang.namaSidang}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Informasi Mahasiswa & TA */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-gray-800 font-[Poppins] mb-4">
              Informasi Mahasiswa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-[Roboto] text-gray-700">
              <div>
                <p className="text-gray-500 mb-1">Nama</p>
                <p className="text-gray-800">{selectedPeserta.nama}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">NRP</p>
                <p className="text-gray-800">{selectedPeserta.nrp}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500 mb-1">Judul Tugas Akhir</p>
                <p className="text-gray-800">{selectedPeserta.judulTA}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Pembimbing 1</p>
                <p className="text-gray-800">{selectedPeserta.pembimbing1}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Pembimbing 2</p>
                <p className="text-gray-800">{selectedPeserta.pembimbing2}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-500 font-[Roboto] mb-1 text-sm">
                Abstrak
              </p>
              <p className="text-sm text-gray-800 font-[Roboto] leading-relaxed">
                {selectedPeserta.abstrak}
              </p>
            </div>
          </div>

          {/* Informasi Sidang (jika sudah dijadwalkan) */}
          {hasSchedule && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-gray-800 font-[Poppins] mb-4">
                Informasi Sidang
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-[Roboto] text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">
                      Tanggal Sidang
                    </p>
                    <p className="text-gray-800">
                      {formatDate(selectedPeserta.tanggalSidang!)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Waktu</p>
                    <p className="text-gray-800">
                      {selectedPeserta.jamSidang || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedPeserta.modeSidang === "Online" ? (
                    <Video className="w-4 h-4 text-gray-500" />
                  ) : (
                    <MapPin className="w-4 h-4 text-gray-500" />
                  )}
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">
                      Lokasi / Ruangan
                    </p>
                    <p className="text-gray-800">
                      {selectedPeserta.ruanganSidang || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs font-[Roboto]">
                    Mode
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-[Roboto] ${
                      selectedPeserta.modeSidang === "Online"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedPeserta.modeSidang || "-"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* File Prasyarat */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-gray-800 font-[Poppins] mb-4">
              File Prasyarat
            </h2>
            {selectedPeserta.prasyaratFiles.length === 0 ? (
              <p className="text-sm text-gray-500 font-[Roboto]">
                Belum ada data file prasyarat.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedPeserta.prasyaratFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between text-sm font-[Roboto]"
                  >
                    <div>
                      <p className="text-gray-800">{file.name}</p>
                      {file.uploaded && file.fileName && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {file.fileName}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs ${
                        file.uploaded
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {file.uploaded ? "Tersedia" : "Belum Ada"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopelumber
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
            <h1 className="text-gray-800 font-[Poppins] mb-1">
              {selectedSidang?.namaSidang}
            </h1>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Daftar peserta yang mengikuti sidang
            </p>
          </div>
        </div>
      </div>

      {/* Info Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 font-[Roboto] mb-1">
              Total Peserta
            </p>
            <p className="text-2xl text-gray-800 font-[Poppins]">
              {selectedSidang?.peserta.length}/{selectedSidang?.kuota}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-[Roboto] mb-1">
              Dokumen Lengkap
            </p>
            <p className="text-2xl text-green-600 font-[Poppins]">
              {selectedSidang?.peserta.filter(
                (p) => p.statusDokumen === "Lengkap"
              ).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-[Roboto] mb-1">
              Dokumen Belum Lengkap
            </p>
            <p className="text-2xl text-red-600 font-[Poppins]">
              {selectedSidang?.peserta.filter(
                (p) => p.statusDokumen === "Belum Lengkap"
              ).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-[Roboto] mb-1">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-[Roboto] ${getStatusColor(
                selectedSidang?.status || ""
              )}`}
            >
              {selectedSidang?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Peserta Table + Search */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {selectedSidang && selectedSidang.peserta.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-[Roboto]">
              Belum ada peserta yang mendaftar sidang ini
            </p>
          </div>
        ) : (
          <>
          <div className="px-6 pt-10 pb-6 border-b border-gray-200">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
    
    {/* Header */}
    <div className="flex-1">
<h2 className="text-gray-800 font-[Poppins] text-sm mb-1 mt-2">
  Daftar Peserta Sidang
</h2>

      <p className="text-xs text-gray-500 font-[Roboto]">
        Cari berdasarkan nama, NRP, judul, atau pembimbing.
      </p>
    </div>

    {/* Search Bar */}
    <div className="w-full md:w-80">
      <div className="relative">
        <Search
          className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari peserta..."
          className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     font-[Roboto] placeholder:text-gray-400"
        />
      </div>
    </div>

  </div>
</div>

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
                      Pembimbing
                    </th>
                    <th className="px-6 py-3 text-center text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                      Tanggal Daftar
                    </th>
                    <th className="px-6 py-3 text-center text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                      Tanggal Sidang
                    </th>
                    <th className="px-6 py-3 text-center text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                      Jadwal
                    </th>
                    <th className="px-6 py-3 text-center text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedSidang?.peserta
                    .filter((p) => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        p.nama.toLowerCase().includes(q) ||
                        p.nrp.toLowerCase().includes(q) ||
                        p.judulTA.toLowerCase().includes(q) ||
                        p.pembimbing1.toLowerCase().includes(q) ||
                        p.pembimbing2.toLowerCase().includes(q)
                      );
                    })
                    .map((peserta, index) => (
                      <tr
                        key={peserta.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 font-[Roboto]">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-800 font-[Roboto]">
                              {peserta.nama}
                            </p>
                            <p className="text-xs text-gray-500 font-[Roboto]">
                              {peserta.nrp}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-[Roboto] max-w-xs">
                          {peserta.judulTA}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-[Roboto]">
                          <p>{peserta.pembimbing1}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {peserta.pembimbing2}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-[Roboto] text-center">
                          {formatDate(peserta.tanggalDaftar)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {peserta.tanggalSidang ? (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-[Roboto] bg-blue-50 text-blue-700">
                              {formatDate(peserta.tanggalSidang)}
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-[Roboto] bg-gray-100 text-gray-500">
                              Belum
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              selectedSidang &&
                              handleOpenSchedule(selectedSidang, peserta)
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-[Roboto] bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            {peserta.tanggalSidang ? (
                              <>
                                <Edit className="w-3.5 h-3.5" />
                                Edit Jadwal
                              </>
                            ) : (
                              <>
                                <Calendar className="w-3.5 h-3.5" />
                                Jadwalkan
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              selectedSidang &&
                              handleOpenPesertaDetail(selectedSidang, peserta)
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-[Roboto] border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Lihat
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 font-[Roboto]">
          © 2021-2025 Institut Teknologi Sepuluh Nopelumber
        </p>
      </footer>
    </div>
  );
}
