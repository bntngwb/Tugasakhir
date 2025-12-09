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
  MapPin,
  X,
} from "lucide-react";
import { GuideModal } from "./GuideModal";

interface Sidang {
  id: number;
  nama: string;
  nrp: string;
  jenisSidang: "Sidang Proposal" | "Sidang Akhir";
  periode: "S1" | "S2";
  statusPengerjaan:
    | "Menunggu Sidang"
    | "Dalam Sidang"
    | "Perlu Dinilai"
    | "Pengerjaan Revisi"
    | "Perlu Approval"
    | "Perlu Nilai Permanen"
    | "Selesai";
  statusRole: "Ketua Sidang" | "Penguji" | "Pembimbing";
  tanggal: string; // "12 Januari 2026"
  judul: string;
}

interface SidangDosenProps {
  initialFilter?: "Perlu Dinilai" | "Perlu Approval";
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
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_NAMES_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// "12 Januari 2026" -> Date
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
  // =====================================================
  // FORCE RESET STATUS DENGAN VERSION (tanpa DevTools)
  // Ganti CURRENT_VERSION jika ingin reset semua status.
  // =====================================================
  if (typeof window !== "undefined") {
    const VERSION_KEY = "sidang-status-version";
    const CURRENT_VERSION = "1"; // harus sama dengan di DetailSidang
    const storedVersion = window.sessionStorage.getItem(VERSION_KEY);

    if (storedVersion !== CURRENT_VERSION) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key && key.startsWith("sidang-status-")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
      window.sessionStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  }

  // DATA MASTER SIDANG (default)
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
      judul:
        "PENERAPAN VISION TRANSFORMER UNTUK DETEKSI ANOMALI JARINGAN KOMPUTER SKALA BESAR",
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
      judul:
        "RANCANG BANGUN SISTEM MONITORING BIMBINGAN TUGAS AKHIR BERBASIS WEB",
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
      judul: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia",
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
      judul: "Analisis Sentimen Media Sosial Menggunakan Deep Learning",
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
      judul:
        "Implementasi Machine Learning untuk Deteksi Penyakit Tanaman",
    },
    {
      id: 6,
      nama: "Rini Susanti",
      nrp: "6025201008",
      jenisSidang: "Sidang Akhir",
      periode: "S2",
      statusPengerjaan: "Menunggu Sidang",
      statusRole: "Penguji",
      tanggal: "25 Januari 2026",
      judul: "Optimasi Algoritma Pencarian dengan Genetic Algorithm",
    },
  ];

  // override status dari DetailSidang via sessionStorage
  const sidangListWithOverride: Sidang[] = sidangList.map((s) => {
    if (typeof window === "undefined") return s;
    const storedStatus = window.sessionStorage.getItem(
      `sidang-status-${s.id}`
    ) as Sidang["statusPengerjaan"] | null;

    return storedStatus ? { ...s, statusPengerjaan: storedStatus } : s;
  });

  // Bangun events kalender dari sidangListWithOverride
  const eventsData: { [key: string]: HearingEvent[] } =
    sidangListWithOverride.reduce((acc, sidang) => {
      const d = parseTanggalToDate(sidang.tanggal);
      if (!d) return acc;

      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const type: "Proposal" | "Tugas Akhir" =
        sidang.jenisSidang.toLowerCase().includes("proposal")
          ? "Proposal"
          : "Tugas Akhir";

      const defaultTime = "09.00 - 11.00 WIB";
      const defaultRoom = "Ruang Sidang 301";

      const supervisors: string[] = [];
      const examiners: string[] = [];

      if (sidang.statusRole === "Pembimbing") {
        supervisors.push("Anda sebagai Pembimbing");
      } else if (sidang.statusRole === "Ketua Sidang") {
        examiners.push("Anda sebagai Ketua Sidang");
      } else if (sidang.statusRole === "Penguji") {
        examiners.push("Anda sebagai Penguji");
      }

      const event: HearingEvent = {
        id: sidang.id,
        title: sidang.judul,
        student: sidang.nama,
        nrp: sidang.nrp,
        type,
        time: defaultTime,
        room: defaultRoom,
        supervisors,
        examiners,
      };

      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {} as { [key: string]: HearingEvent[] });

  // default bulan kalender: pakai tanggal sidang pertama
  const firstDate =
    parseTanggalToDate(sidangListWithOverride[0]?.tanggal ?? "") ??
    new Date();

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJenis, setSelectedJenis] = useState<
    "Semua" | Sidang["jenisSidang"]
  >("Semua");
  const [selectedStatus, setSelectedStatus] = useState<
    | "Semua"
    | "Menunggu Sidang"
    | "Dalam Sidang"
    | "Perlu Dinilai"
    | "Pengerjaan Revisi"
    | "Perlu Approval"
    | "Perlu Nilai Permanen"
    | "Selesai"
  >(initialFilter ?? "Semua");
  const [activeFilter, setActiveFilter] = useState<string | null>(
    initialFilter ?? null
  );

  const [currentDate, setCurrentDate] = useState(firstDate);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // helper: samakan dengan tombol Lihat
  const goToDetailSidang = (sidangId: number) => {
    window.location.hash = `#/dosen/sidang/${sidangId}`;
    setIsDetailModalOpen(false);
  };

  // FILTER LIST SIDANG
  const filteredSidang = sidangListWithOverride.filter((sidang) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sidang.nama.toLowerCase().includes(q) ||
      sidang.nrp.includes(searchQuery) ||
      sidang.judul.toLowerCase().includes(q);
    const matchesJenis =
      selectedJenis === "Semua" || sidang.jenisSidang === selectedJenis;

    let matchesStatus = true;
    if (selectedStatus !== "Semua") {
      if (selectedStatus === "Perlu Dinilai") {
        // filter "Perlu Dinilai" juga menampilkan "Perlu Nilai Permanen"
        matchesStatus =
          sidang.statusPengerjaan === "Perlu Dinilai" ||
          sidang.statusPengerjaan === "Perlu Nilai Permanen";
      } else {
        matchesStatus = sidang.statusPengerjaan === selectedStatus;
      }
    }

    return matchesSearch && matchesJenis && matchesStatus;
  });

  const totalSidang = sidangListWithOverride.length;
  const perluNilai = sidangListWithOverride.filter(
    (s) =>
      s.statusPengerjaan === "Perlu Dinilai" ||
      s.statusPengerjaan === "Perlu Nilai Permanen"
  ).length;
  const perluApproval = sidangListWithOverride.filter(
    (s) => s.statusPengerjaan === "Perlu Approval"
  ).length;

  const handleCardClick = (filter: "Perlu Dinilai" | "Perlu Approval") => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      setSelectedStatus("Semua");
    } else {
      setActiveFilter(filter);
      setSelectedStatus(filter);
    }
  };

  const getStatusColor = (status: Sidang["statusPengerjaan"]) => {
    switch (status) {
      case "Menunggu Sidang":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Dalam Sidang":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Perlu Dinilai":
      case "Perlu Nilai Permanen": // warna sama, tetap masuk cluster "Perlu Dinilai"
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

  const getRoleColor = (role: Sidang["statusRole"]) => {
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

  const getStatusIcon = (status: Sidang["statusPengerjaan"]) => {
    switch (status) {
      case "Menunggu Sidang":
        return <Clock className="w-4 h-4" />;
      case "Dalam Sidang":
        return <Users className="w-4 h-4" />;
      case "Perlu Dinilai":
      case "Perlu Nilai Permanen":
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

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.events.length === 0) return;
    setSelectedDay(day);
    setIsDetailModalOpen(true);
  };

  const getEventTypeColor = (type: HearingEvent["type"]) =>
    type === "Proposal"
      ? "bg-blue-100 text-blue-700 border-blue-300"
      : "bg-green-100 text-green-700 border-green-300";

  const renderSimpleMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const totalCells = 42; // 6 minggu
    const today = new Date();

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-[Poppins] text-lg">
            Jadwal Sidang – {MONTH_NAMES_ID[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousMonth}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm font-[Roboto]"
            >
              Sebelumnya
            </button>
            <button
              onClick={goToNextMonth}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm font-[Roboto]"
            >
              Berikutnya
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-1">
          {DAY_NAMES_ID.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-gray-600 py-1 font-[Poppins]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: totalCells }, (_, i) => {
            const dayNumber = i - firstDayOfWeek + 1;
            const isInCurrentMonth =
              dayNumber >= 1 && dayNumber <= lastDay.getDate();

            const dateKey =
              isInCurrentMonth ? `${year}-${month + 1}-${dayNumber}` : "";
            const events = isInCurrentMonth ? eventsData[dateKey] || [] : [];
            const hasEvents = events.length > 0;

            const isToday =
              isInCurrentMonth &&
              dayNumber === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const baseClasses =
              "aspect-square p-2 border border-gray-200 rounded text-center text-sm font-[Roboto] cursor-pointer";
            const stateClasses = !isInCurrentMonth
              ? "bg-gray-50 text-gray-400 cursor-default"
              : isToday
              ? "bg-blue-50 border-blue-300 text-gray-800"
              : hasEvents
              ? "bg-green-50 border-green-300 text-gray-800"
              : "bg-white text-gray-700";

            const dayObj: CalendarDay = {
              date: dayNumber,
              month,
              year,
              isCurrentMonth: isInCurrentMonth,
              events,
            };

            return (
              <div
                key={i}
                className={`${baseClasses} ${stateClasses}`}
                onClick={() => {
                  if (!isInCurrentMonth || !hasEvents) return;
                  handleDayClick(dayObj);
                }}
              >
                {isInCurrentMonth && (
                  <>
                    <div>{dayNumber}</div>
                    {hasEvents && (
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mx-auto mt-1" />
                    )}
                  </>
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">
              Sidang
            </h1>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-[Poppins]">Panduan Penggunaan</span>
            </button>
          </div>
          <p className="text-gray-500 font-[Roboto]">
            Kelola sidang tugas akhir mahasiswa
          </p>
        </div>

        {/* Kalender */}
        {renderSimpleMonthGrid()}

        {/* Statistik */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border-2 p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">
                  Jumlah Sidang
                </p>
                <p className="text-2xl text-gray-800 font-[Poppins]">
                  {totalSidang}
                </p>
              </div>
            </div>
          </div>

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
                <p className="text-xs text-gray-600 font-[Roboto]">
                  Perlu Dinilai
                </p>
                <p className="text-2xl text-gray-800 font-[Poppins]">
                  {perluNilai}
                </p>
              </div>
            </div>
          </button>

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
                <p className="text-xs text-gray-600 font-[Roboto]">
                  Perlu Approval
                </p>
                <p className="text-2xl text-gray-800 font-[Poppins]">
                  {perluApproval}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Filter bar */}
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
              onChange={(e) =>
                setSelectedJenis(
                  e.target.value as "Semua" | Sidang["jenisSidang"]
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Jenis</option>
              <option value="Sidang Proposal">Sidang Proposal</option>
              <option value="Sidang Akhir">Sidang Akhir</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as
                    | "Semua"
                    | "Menunggu Sidang"
                    | "Dalam Sidang"
                    | "Perlu Dinilai"
                    | "Pengerjaan Revisi"
                    | "Perlu Approval"
                    | "Perlu Nilai Permanen"
                    | "Selesai"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Sidang">Menunggu Sidang</option>
              <option value="Dalam Sidang">Dalam Sidang</option>
              <option value="Perlu Dinilai">Perlu Dinilai</option>
              <option value="Pengerjaan Revisi">Pengerjaan Revisi</option>
              <option value="Perlu Approval">Perlu Approval</option>
              <option value="Perlu Nilai Permanen">
                Perlu Nilai Permanen
              </option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* List sidang */}
        <div className="space-y-4">
          {filteredSidang.map((sidang) => (
            <div
              key={sidang.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-800 font-[Poppins]">
                      {sidang.nama}
                    </h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-[Roboto]">
                      {sidang.periode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-[Roboto] border flex items-center gap-1 ${getStatusColor(
                        sidang.statusPengerjaan
                      )}`}
                    >
                      {getStatusIcon(sidang.statusPengerjaan)}
                      {sidang.statusPengerjaan}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-[Roboto] border ${getRoleColor(
                        sidang.statusRole
                      )}`}
                    >
                      {sidang.statusRole}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 font-[Roboto] mb-1">
                    NRP: {sidang.nrp}
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto] mb-3">
                    {sidang.judul}
                  </p>

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
              <p className="text-gray-500 font-[Roboto]">
                Tidak ada sidang ditemukan
              </p>
            </div>
          )}
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

      {/* Modal detail tanggal kalender */}
      {isDetailModalOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDetailModalOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl text-gray-800 font-[Poppins]">
                      Jadwal Sidang
                    </h2>
                    <p className="text-sm text-gray-600 font-[Roboto]">
                      {selectedDay.date}{" "}
                      {MONTH_NAMES_ID[selectedDay.month]}{" "}
                      {selectedDay.year}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedDay.events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => goToDetailSidang(event.id)}
                    className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-[Roboto] border ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {event.type === "Proposal"
                              ? "Sidang Proposal"
                              : "Sidang Tugas Akhir"}
                          </span>
                        </div>
                        <h3 className="text-gray-800 font-[Poppins] font-medium mb-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 font-[Roboto]">
                          {event.student} - {event.nrp}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-[Roboto]">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-[Roboto]">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{event.room}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-[Roboto] mb-2 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Pembimbing:
                        </p>
                        {event.supervisors.length > 0 ? (
                          <ul className="space-y-1">
                            {event.supervisors.map((supervisor, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-700 font-[Roboto] pl-4"
                              >
                                • {supervisor}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400 font-[Roboto] pl-4">
                            - (belum diatur)
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-[Roboto] mb-2 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Penguji:
                        </p>
                        {event.examiners.length > 0 ? (
                          <ul className="space-y-1">
                            {event.examiners.map((examiner, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-700 font-[Roboto] pl-4"
                              >
                                • {examiner}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400 font-[Roboto] pl-4">
                            - (belum diatur)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 font-[Roboto]">
                      <Eye className="w-4 h-4" />
                      <span>Lihat detail sidang</span>
                    </div>
                  </div>
                ))}
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
          title="Panduan Penggunaan - Sidang"
          steps={[
            {
              title: "Kelola Sidang",
              description:
                "Halaman Sidang menampilkan semua sidang yang Anda kelola sebagai ketua sidang, penguji, atau pembimbing.",
              imageUrl:
                "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
            },
            {
              title: "Lihat Detail Sidang",
              description:
                "Klik tombol 'Lihat' untuk melihat detail sidang dan melakukan penilaian sesuai dengan peran Anda.",
              imageUrl:
                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
            },
            {
              title: "Gunakan Kalender",
              description:
                "Gunakan kalender di bagian atas untuk melihat distribusi jadwal sidang per hari dan klik tanggal bertitik hijau untuk melihat daftar sidang pada hari tersebut.",
              imageUrl:
                "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800",
            },
          ]}
        />
      )}
    </main>
  );
}
