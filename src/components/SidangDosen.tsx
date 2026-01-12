import { useState, useEffect } from "react";
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
  MapPin,
  X,
  Lock,
} from "lucide-react";
import { GuideModal } from "./GuideModal";

// ============================================================================
// TYPE DEFINITIONS BARU (Pastikan DetailSidang.tsx nanti menyesuaikan ini)
// ============================================================================
export interface Sidang {
  id: number;
  nama: string;
  nrp: string;
  jenisSidang: "Sidang Proposal" | "Sidang Akhir";
  periode: "S1" | "S2";
  
  // 4 STAGE STATUS
  statusPengerjaan:
    | "Menunggu Sidang"    // Stage 1
    | "Dalam Sidang"       // Stage 2
    | "Pengerjaan Revisi"  // Stage 3
    | "Selesai";           // Stage 4

  // HASIL KEPUTUSAN (Hanya muncul jika status == "Selesai")
  keputusan?: "Lulus" | "Revisi Minor" | "Revisi Mayor" | "Tidak Lulus" | "Gagal"; 
  
  statusRole: "Ketua Sidang" | "Penguji" | "Pembimbing";
  tanggal: string;
  judul: string;

  // KEHADIRAN DOSEN (Bukan Mahasiswa)
  kehadiran?: {
    penguji1: boolean;
    penguji2: boolean;
    pembimbing1: boolean;
    pembimbing2?: boolean;
  };
}

interface SidangDosenProps {
  initialFilter?: "Dalam Sidang" | "Pengerjaan Revisi";
}

interface HearingEvent {
  id: number;
  title: string;
  student: string;
  nrp: string;
  type: "Proposal" | "Tugas Akhir";
  time: string;
  room: string;
  supervisors: string[];
  examiners: string[];
}

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  events: HearingEvent[];
}

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const DAY_NAMES_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Helper Parse Date
const parseTanggalToDate = (tanggal: string): Date | null => {
  const parts = tanggal.trim().split(" ");
  if (parts.length !== 3) return null;
  const [dayStr, monthName, yearStr] = parts;
  const day = Number(dayStr);
  const year = Number(yearStr);
  const monthIndex = MONTH_NAMES_ID.indexOf(monthName);
  if (isNaN(day) || isNaN(year) || monthIndex === -1) return null;
  return new Date(year, monthIndex, day);
};

export function SidangDosen({ initialFilter }: SidangDosenProps) {
  // DEBUGGER: Cek console browser Anda. Jika teks ini muncul, file baru sudah termuat.
  console.log("LOG: SidangDosen Component Loaded - Version 5 (Final Clean)");

  // =====================================================
  // LOGIKA RESET SESSION STORAGE
  // =====================================================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const VERSION_KEY = "sidang-logic-v5-clean"; // Ganti key lagi biar pasti reset
      const CURRENT_VERSION = "5"; 
      const storedVersion = window.sessionStorage.getItem(VERSION_KEY);

      if (storedVersion !== CURRENT_VERSION) {
        console.log("LOG: Resetting Session Storage for SidangDosen...");
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          if (key && (key.startsWith("sidang-status-") || key.startsWith("sidang-keputusan-"))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
        window.sessionStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      }
    }
  }, []);

  // =====================================================
  // DATA MASTER (MOCK)
  // =====================================================
  const sidangList: Sidang[] = [
    {
      id: 1,
      nama: "Budi Santoso",
      nrp: "5025221034",
      jenisSidang: "Sidang Proposal",
      periode: "S1",
      statusPengerjaan: "Menunggu Sidang", 
      statusRole: "Pembimbing",
      tanggal: "20 Januari 2026",
      judul: "PENERAPAN VISION TRANSFORMER UNTUK DETEKSI ANOMALI",
      kehadiran: { penguji1: false, penguji2: false, pembimbing1: true },
    },
    {
      id: 2,
      nama: "Andi Pratama",
      nrp: "5025223002",
      jenisSidang: "Sidang Akhir",
      periode: "S1",
      statusPengerjaan: "Dalam Sidang",
      statusRole: "Ketua Sidang",
      tanggal: "13 Januari 2026",
      judul: "RANCANG BANGUN SISTEM MONITORING BIMBINGAN",
      kehadiran: { penguji1: true, penguji2: true, pembimbing1: true },
    },
    {
      id: 3,
      nama: "Siti Aminah",
      nrp: "5025201015",
      jenisSidang: "Sidang Proposal",
      periode: "S1",
      statusPengerjaan: "Pengerjaan Revisi",
      statusRole: "Penguji",
      tanggal: "10 Januari 2026",
      judul: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia",
      kehadiran: { penguji1: true, penguji2: true, pembimbing1: true },
    },
    {
      id: 4,
      nama: "Bayu Aditya",
      nrp: "6025201002",
      jenisSidang: "Sidang Akhir",
      periode: "S2",
      statusPengerjaan: "Selesai",
      keputusan: "Revisi Minor", 
      statusRole: "Pembimbing",
      tanggal: "05 Januari 2026",
      judul: "Analisis Sentimen Media Sosial Menggunakan Deep Learning",
      kehadiran: { penguji1: true, penguji2: true, pembimbing1: true, pembimbing2: true },
    },
    {
      id: 5,
      nama: "Dewi Kartika",
      nrp: "5025201020",
      jenisSidang: "Sidang Proposal",
      periode: "S1",
      statusPengerjaan: "Selesai",
      keputusan: "Lulus",
      statusRole: "Ketua Sidang",
      tanggal: "02 Januari 2026",
      judul: "Implementasi Machine Learning untuk Deteksi Penyakit",
      kehadiran: { penguji1: true, penguji2: true, pembimbing1: true },
    },
    {
      id: 6,
      nama: "Rini Susanti",
      nrp: "6025201008",
      jenisSidang: "Sidang Akhir",
      periode: "S2",
      statusPengerjaan: "Dalam Sidang",
      statusRole: "Penguji",
      tanggal: "13 Januari 2026",
      judul: "Optimasi Algoritma Pencarian dengan Genetic Algorithm",
      kehadiran: { penguji1: true, penguji2: true, pembimbing1: true },
    },
  ];

  // =====================================================
  // LOGIKA OVERRIDE (Mengambil data dari SessionStorage jika ada)
  // =====================================================
  const sidangListWithOverride: Sidang[] = sidangList.map((s) => {
    if (typeof window === "undefined") return s;
    
    const storedStatus = window.sessionStorage.getItem(`sidang-status-${s.id}`) as Sidang["statusPengerjaan"] | null;
    const storedKeputusan = window.sessionStorage.getItem(`sidang-keputusan-${s.id}`) as Sidang["keputusan"] | null;

    let finalStatus = s.statusPengerjaan;
    let finalKeputusan = s.keputusan;

    if (storedStatus) finalStatus = storedStatus;
    if (storedKeputusan) finalKeputusan = storedKeputusan;

    return { ...s, statusPengerjaan: finalStatus, keputusan: finalKeputusan };
  });

  // =====================================================
  // LOGIKA KALENDER
  // =====================================================
  const eventsData: { [key: string]: HearingEvent[] } =
    sidangListWithOverride.reduce((acc, sidang) => {
      const d = parseTanggalToDate(sidang.tanggal);
      if (!d) return acc;

      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const type: "Proposal" | "Tugas Akhir" =
        sidang.jenisSidang.toLowerCase().includes("proposal")
          ? "Proposal"
          : "Tugas Akhir";

      const supervisors: string[] = [];
      const examiners: string[] = [];

      if (sidang.statusRole === "Pembimbing") supervisors.push("Anda sebagai Pembimbing");
      else if (sidang.statusRole === "Ketua Sidang") examiners.push("Anda sebagai Ketua Sidang");
      else if (sidang.statusRole === "Penguji") examiners.push("Anda sebagai Penguji");

      const event: HearingEvent = {
        id: sidang.id,
        title: sidang.judul,
        student: sidang.nama,
        nrp: sidang.nrp,
        type,
        time: "09.00 - 11.00 WIB",
        room: "Ruang Sidang 301",
        supervisors,
        examiners,
      };

      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {} as { [key: string]: HearingEvent[] });

  // Default date
  const defaultCalendarDate = new Date(2026, 0, 13);

  // States
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJenis, setSelectedJenis] = useState<"Semua" | Sidang["jenisSidang"]>("Semua");
  
  const [selectedStatus, setSelectedStatus] = useState<"Semua" | Sidang["statusPengerjaan"]>(initialFilter ?? "Semua");
  const [activeFilter, setActiveFilter] = useState<string | null>(initialFilter ?? null);

  const [currentDate, setCurrentDate] = useState(defaultCalendarDate);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const goToDetailSidang = (sidangId: number) => {
    // Navigasi ke detail
    window.location.hash = `#/dosen/sidang/${sidangId}`;
    setIsDetailModalOpen(false);
  };

  // Filter
  const filteredSidang = sidangListWithOverride.filter((sidang) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sidang.nama.toLowerCase().includes(q) ||
      sidang.nrp.includes(searchQuery) ||
      sidang.judul.toLowerCase().includes(q);
    
    const matchesJenis = selectedJenis === "Semua" || sidang.jenisSidang === selectedJenis;
    const matchesStatus = selectedStatus === "Semua" || sidang.statusPengerjaan === selectedStatus;

    return matchesSearch && matchesJenis && matchesStatus;
  });

  // Statistik
  const totalSidang = sidangListWithOverride.length;
  const countDalamSidang = sidangListWithOverride.filter(
    (s) => s.statusPengerjaan === "Dalam Sidang"
  ).length;
  const countRevisi = sidangListWithOverride.filter(
    (s) => s.statusPengerjaan === "Pengerjaan Revisi"
  ).length;

  const handleCardClick = (filter: "Dalam Sidang" | "Pengerjaan Revisi") => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      setSelectedStatus("Semua");
    } else {
      setActiveFilter(filter);
      setSelectedStatus(filter);
    }
  };

  // =====================================================
  // HELPERS VISUAL (BADGE & ICON)
  // =====================================================
  
  const getDisplayStatus = (sidang: Sidang) => {
    if (sidang.statusPengerjaan === "Selesai" && sidang.keputusan) {
      return `Selesai - ${sidang.keputusan}`;
    }
    return sidang.statusPengerjaan;
  };

  const getStatusColor = (sidang: Sidang) => {
    if (sidang.statusPengerjaan === "Selesai") {
      switch (sidang.keputusan) {
        case "Lulus": return "bg-green-100 text-green-700 border-green-200";
        case "Revisi Minor": return "bg-teal-100 text-teal-700 border-teal-200";
        case "Revisi Mayor": return "bg-orange-100 text-orange-700 border-orange-200";
        case "Tidak Lulus":
        case "Gagal": return "bg-red-100 text-red-700 border-red-200";
        default: return "bg-green-100 text-green-700 border-green-200";
      }
    }
    switch (sidang.statusPengerjaan) {
      case "Menunggu Sidang": return "bg-gray-100 text-gray-500 border-gray-200";
      case "Dalam Sidang": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Pengerjaan Revisi": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Sidang["statusPengerjaan"], keputusan?: string) => {
    if (status === "Selesai") {
      if (keputusan === "Tidak Lulus" || keputusan === "Gagal") return <X className="w-4 h-4" />;
      return <CheckCircle2 className="w-4 h-4" />;
    }
    switch (status) {
      case "Menunggu Sidang": return <Clock className="w-4 h-4" />;
      case "Dalam Sidang": return <FileText className="w-4 h-4" />;
      case "Pengerjaan Revisi": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: Sidang["statusRole"]) => {
    switch (role) {
      case "Ketua Sidang": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Penguji": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Pembimbing": return "bg-green-50 text-green-700 border-green-200";
    }
  };

  // Navigasi Kalender
  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleDayClick = (day: CalendarDay) => {
    if (day.events.length === 0) return;
    setSelectedDay(day);
    setIsDetailModalOpen(true);
  };
  const getEventTypeColor = (type: HearingEvent["type"]) =>
    type === "Proposal" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-green-100 text-green-700 border-green-300";

  // Render Grid Kalender
  const renderSimpleMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const totalCells = 42;
    const today = defaultCalendarDate;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-[Poppins] text-lg">
            Jadwal Sidang – {MONTH_NAMES_ID[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button onClick={goToPreviousMonth} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm font-[Roboto]">Sebelumnya</button>
            <button onClick={goToNextMonth} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm font-[Roboto]">Berikutnya</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-1">
          {DAY_NAMES_ID.map((day) => (
            <div key={day} className="text-center text-xs text-gray-600 py-1 font-[Poppins]">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: totalCells }, (_, i) => {
            const dayNumber = i - firstDayOfWeek + 1;
            const isInCurrentMonth = dayNumber >= 1 && dayNumber <= lastDay.getDate();
            const dateKey = isInCurrentMonth ? `${year}-${month + 1}-${dayNumber}` : "";
            const events = isInCurrentMonth ? eventsData[dateKey] || [] : [];
            const hasEvents = events.length > 0;
            const isToday = isInCurrentMonth && dayNumber === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            return (
              <div
                key={i}
                className={`aspect-square p-2 border border-gray-200 rounded text-center text-sm font-[Roboto] cursor-pointer
                  ${!isInCurrentMonth ? "bg-gray-50 text-gray-400 cursor-default" : isToday ? "bg-blue-50 border-blue-300 text-gray-800" : hasEvents ? "bg-green-50 border-green-300 text-gray-800" : "bg-white text-gray-700"}`}
                onClick={() => isInCurrentMonth && hasEvents && handleDayClick({ date: dayNumber, month, year, isCurrentMonth: true, events })}
              >
                {isInCurrentMonth && (
                  <><div>{dayNumber}</div>{hasEvents && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mx-auto mt-1" />}</>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">Sidang Tugas Akhir</h1>
            <button onClick={() => setIsGuideModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
              <BookOpen className="w-4 h-4" /><span className="font-[Poppins]">Panduan</span>
            </button>
          </div>
          <p className="text-gray-500 font-[Roboto]">Kelola penilaian, revisi, dan keputusan sidang</p>
        </div>

        {renderSimpleMonthGrid()}

        {/* Statistik */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">Total Jadwal</p>
                <p className="text-2xl text-gray-800 font-[Poppins]">{totalSidang}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCardClick("Dalam Sidang")}
            className={`bg-white rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
              activeFilter === "Dalam Sidang" ? "border-yellow-500 shadow-md" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">Berjalan (Isi Nilai)</p>
                <p className="text-2xl text-gray-800 font-[Poppins]">{countDalamSidang}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleCardClick("Pengerjaan Revisi")}
            className={`bg-white rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
              activeFilter === "Pengerjaan Revisi" ? "border-blue-500 shadow-md" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">Revisi (Perlu ACC)</p>
                <p className="text-2xl text-gray-800 font-[Poppins]">{countRevisi}</p>
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
                placeholder="Cari nama, NRP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
              />
            </div>
            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Jenis</option>
              <option value="Sidang Proposal">Sidang Proposal</option>
              <option value="Sidang Akhir">Sidang Akhir</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Sidang">Menunggu Sidang</option>
              <option value="Dalam Sidang">Dalam Sidang</option>
              <option value="Pengerjaan Revisi">Pengerjaan Revisi</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* List Sidang */}
        <div className="space-y-4">
          {filteredSidang.map((sidang) => {
            const isLocked = sidang.statusPengerjaan === "Menunggu Sidang";

            return (
              <div key={sidang.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-800 font-[Poppins]">{sidang.nama}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-[Roboto]">{sidang.periode}</span>
                      
                      {/* STATUS CHIP UTAMA */}
                      <span className={`px-2 py-0.5 rounded text-xs font-[Roboto] border flex items-center gap-1 ${getStatusColor(sidang)}`}>
                        {getStatusIcon(sidang.statusPengerjaan, sidang.keputusan)}
                        {getDisplayStatus(sidang)}
                      </span>
                      
                      {/* ROLE CHIP */}
                      <span className={`px-2 py-0.5 rounded text-xs font-[Roboto] border ${getRoleColor(sidang.statusRole)}`}>
                        {sidang.statusRole}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 font-[Roboto] mb-1">NRP: {sidang.nrp}</p>
                    <p className="text-sm text-gray-800 font-[Roboto] mb-3">{sidang.judul}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-600 font-[Roboto]">
                      <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>{sidang.jenisSidang}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{sidang.tanggal}</span></div>
                    </div>
                  </div>

                  {/* Tombol Lihat Logic */}
                  {isLocked ? (
                    <button disabled className="ml-4 px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed font-[Roboto] text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Belum Dimulai
                    </button>
                  ) : (
                    <a
                      href={`#/dosen/sidang/${sidang.id}`}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredSidang.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-[Roboto]">Tidak ada sidang ditemukan</p>
            </div>
          )}
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
        </footer>
      </div>

      {/* Modal Kalender */}
      {isDetailModalOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDetailModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl text-gray-800 font-[Poppins]">Jadwal Sidang</h2>
                    <p className="text-sm text-gray-600 font-[Roboto]">{selectedDay.date} {MONTH_NAMES_ID[selectedDay.month]} {selectedDay.year}</p>
                  </div>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {selectedDay.events.map((event) => {
                  const sidangAsli = sidangListWithOverride.find(s => s.id === event.id);
                  const locked = sidangAsli?.statusPengerjaan === "Menunggu Sidang";

                  return (
                    <div 
                      key={event.id} 
                      onClick={() => !locked && goToDetailSidang(event.id)} 
                      className={`border rounded-lg p-5 transition-colors ${
                        locked ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-[Roboto] border ${getEventTypeColor(event.type)}`}>{event.type}</span>
                          <h3 className="text-gray-800 font-[Poppins] font-medium mt-2 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 font-[Roboto]">{event.student} - {event.nrp}</p>
                        </div>
                        {locked && <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm text-gray-600 font-[Roboto]">
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span>{event.time}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span>{event.room}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {isGuideModalOpen && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          title="Panduan Alur Sidang"
          steps={[
            {
              title: "1. Menunggu Sidang",
              description: "Tombol 'Lihat' NON-AKTIF. Dosen menunggu hingga jadwal sidang tiba.",
              imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800",
            },
            {
              title: "2. Dalam Sidang",
              description: "Dosen Penguji/Pembimbing wajib mengisi Nilai & Revisi. Klik 'Simpan Sementara' untuk lanjut ke tahap Revisi.",
              imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
            },
            {
              title: "3. Pengerjaan Revisi",
              description: "Mahasiswa upload revisi. Dosen ACC & 'Simpan Permanen'. Status berubah menunggu hasil Ketua Sidang.",
              imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
            },
            {
              title: "4. Selesai",
              description: "Ketua Sidang menentukan Hasil Kelulusan & Kehadiran Dosen (Penguji/Pembimbing), lalu Simpan Permanen.",
              imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            },
          ]}
        />
      )}
    </main>
  );
}