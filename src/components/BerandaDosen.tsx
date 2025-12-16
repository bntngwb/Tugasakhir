import {
  BookOpen,
  Users,
  ClipboardCheck,
  ChevronRight,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Eye,
  X,
} from "lucide-react";
import { GuideModal } from "./GuideModal";
import { useState } from "react";

interface Announcement {
  id: number;
  title: string;
  category: "Penting" | "Info" | "Acara" | "Deadline" | "Sistem";
  date: string;
  content: string;
  imageUrl: string;
  isNew: boolean;
}

interface BerandaDosenProps {
  announcements: Announcement[];
  onNavigate: (page: string) => void;
  onAnnouncementClick?: (announcementId: number) => void;

  // Callback ke App.tsx untuk membuka halaman dengan "mode" tertentu
  onOpenBimbinganAjuanTopik?: () => void;
  onOpenBimbinganApprovalSidang?: () => void;
  onOpenSidangApprovalRevisi?: () => void;
}

/* =========================
   TIPE & DATA UNTUK KALENDER SIDANG
   (disalin dari SidangDosen)
   ========================= */

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

export function BerandaDosen({
  announcements,
  onNavigate,
  onAnnouncementClick,
}: BerandaDosenProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Summary angka (sementara hardcoded, bisa nanti disinkronkan dengan data real)
  const totalSidangSummary = 6; // jumlah sidang (untuk card Sidang)
  const perluNilai = 1; // sidang dengan status "Perlu Dinilai"
  const perluApprovalSidang = 1; // sidang dengan status "Perlu Approval"

  const totalS1 = 3; // mahasiswa S1 dalam bimbingan
  const totalS2 = 2; // mahasiswa S2
  const totalS3 = 0; // mahasiswa S3

  const totalAjuanTopik = 3; // jumlah ajuan topik (masih dipakai untuk logika notifikasi bimbingan)
  const bimbinganPerluApproval = 2; // jumlah mahasiswa yang perlu approval sidang di Bimbingan Aktif

  // Flag notifikasi "Perlu tindakan"
  const hasBimbinganAction = totalAjuanTopik > 0 || bimbinganPerluApproval > 0;
  const hasSidangAction = perluNilai > 0 || perluApprovalSidang > 0;

  /* =========================
     DATA SIDANG UNTUK KALENDER
     ========================= */

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

  const eventsData: { [key: string]: HearingEvent[] } = sidangList.reduce(
    (acc, sidang) => {
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
    },
    {} as { [key: string]: HearingEvent[] }
  );

  // Default "hari ini" = 13 Januari 2026
  const defaultCalendarDate = new Date(2026, 0, 13); // 0 = Januari

  const [currentDate, setCurrentDate] = useState(defaultCalendarDate);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  const goToDetailSidang = (sidangId: number) => {
    // mengikuti pola di SidangDosen.tsx
    window.location.hash = `#/dosen/sidang/${sidangId}`;
    setIsDetailModalOpen(false);
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

    // "Hari ini" dikunci ke 13 Januari 2026
    const today = defaultCalendarDate;

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Penting":
        return "bg-red-100 text-red-700 border-red-200";
      case "Deadline":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Acara":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Info":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Sistem":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-medium font-bold">
              Selamat Datang, Bintang Hanoraga
            </h1>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-[Poppins]">Panduan Penggunaan</span>
            </button>
          </div>
          <p className="text-gray-500 font-[Roboto]">Portal Dosen myITS Thesis</p>
        </div>

        {/* Kalender Sidang di Beranda */}
        {renderSimpleMonthGrid()}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Menu Utama */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-gray-800 mb-4 font-[Poppins] text-[16px] font-bold font-normal">
              Menu Utama
            </h2>

            {/* Bimbingan Aktif Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center">
                    <Users className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-[Poppins]">Bimbingan Aktif</h3>
                    <p className="text-xs text-gray-500 font-[Roboto]">
                      Mahasiswa dalam bimbingan
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasBimbinganAction && (
                    <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-[Roboto] font-semibold">
                      Perlu tindakan
                    </span>
                  )}
                  <button
                    onClick={() => onNavigate("Bimbingan Aktif")}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Bimbingan Aktif")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S1</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Mahasiswa:
                    </p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">
                      {totalS1}
                    </p>
                  </div>
                </div>

                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Bimbingan Aktif")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S2</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Mahasiswa:
                    </p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">
                      {totalS2}
                    </p>
                  </div>
                </div>

                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Bimbingan Aktif")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S3</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Mahasiswa:
                    </p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">
                      {totalS3}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidang Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-[Poppins]">Sidang</h3>
                    <p className="text-xs text-gray-500 font-[Roboto]">
                      Jadwal dan penilaian
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasSidangAction && (
                    <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-[Roboto] font-semibold">
                      Perlu tindakan
                    </span>
                  )}
                  <button
                    onClick={() => onNavigate("Sidang")}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {/* Jumlah Sidang */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Sidang")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">
                      Jumlah Sidang
                    </p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Total:
                    </p>
                    <p className="text-2xl text-green-600 font-[Poppins]">
                      {totalSidangSummary}
                    </p>
                  </div>
                </div>

                {/* Perlu Nilai */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Sidang")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">
                      Perlu Nilai
                    </p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Harus dinilai:
                    </p>
                    <p className="text-2xl text-yellow-600 font-[Poppins]">
                      {perluNilai}
                    </p>
                  </div>
                </div>

                {/* Perlu Approval */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Sidang")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">
                      Perlu Approval
                    </p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Menunggu approval:
                    </p>
                    <p className="text-2xl text-red-600 font-[Poppins]">
                      {perluApprovalSidang}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pengumuman */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-700" />
                  <h3 className="font-[Poppins] text-gray-800">Pengumuman</h3>
                </div>
                <button
                  onClick={() => onNavigate("Pengumuman")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-[Roboto] transition-colors"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-3">
                {announcements.slice(0, 3).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group"
                    onClick={() => {
                      onNavigate("Pengumuman");
                      if (onAnnouncementClick) {
                        setTimeout(
                          () => onAnnouncementClick(announcement.id),
                          100
                        );
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-[Roboto] border ${getCategoryColor(
                              announcement.category
                            )}`}
                          >
                            {announcement.category}
                          </span>
                          {announcement.isNew && (
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </div>
                        <h4 className="text-sm text-gray-800 font-[Poppins] line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {announcement.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-[Roboto] mt-1">
                          {announcement.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
          title="Panduan Penggunaan - Beranda Dosen"
          steps={[
            {
              title: "Selamat Datang di myITS Thesis",
              description:
                "myITS Thesis adalah platform untuk mengelola bimbingan dan sidang mahasiswa. Di sini Anda dapat menerima permintaan bimbingan, menilai sidang, dan memantau progress mahasiswa bimbingan. Gunakan menu utama untuk mengakses fitur-fitur dengan mudah.",
              imageUrl:
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVrJTIwZGVzayUyMGxhcHRvcHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
              title: "Permintaan Bimbingan",
              description:
                "Menu Permintaan Bimbingan menampilkan mahasiswa yang meminta Anda sebagai pembimbing. Terdapat 2 kategori: Proposal Baru (proposal yang baru diajukan) dan Tugas Akhir (request untuk tahap TA). Klik kartu untuk melihat detail dan setujui atau tolak permintaan bimbingan.",
              imageUrl:
                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbWVldGluZ3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
              title: "Sidang dan Penilaian",
              description:
                "Menu Sidang membantu Anda mengelola jadwal sidang mahasiswa. Perlu Nilai menunjukkan sidang yang perlu dinilai, Jumlah Sidang untuk total sidang yang Anda ikuti, dan Perlu Approval untuk sidang yang memerlukan approval revisi. Pastikan Anda menyelesaikan penilaian tepat waktu.",
              imageUrl:
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBtZWV0aW5nfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
              title: "Bimbingan Aktif",
              description:
                "Menu Bimbingan Aktif menampilkan daftar mahasiswa yang sedang Anda bimbing, dikelompokkan berdasarkan jenjang (Sarjana/Magister). Di halaman ini Anda dapat melihat progress setiap mahasiswa, memberikan catatan bimbingan, dan memonitor timeline pengerjaan tugas akhir mereka.",
              imageUrl:
                "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGdyb3VwJTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
            },
          ]}
        />
      )}
    </main>
  );
}
