import { useState } from "react";
import {
  BookOpen,
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Video,
} from "lucide-react";
import { GuideModal } from "./GuideModal";
import { motion, AnimatePresence } from "motion/react";

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

export function JadwalSidangAdminCalendar() {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  // set default tanggal "sekarang" ke 14 Desember 2025
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 14));
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Data sidang
  const eventsData: { [key: string]: HearingEvent[] } = {
    "2025-12-5": [
      {
        id: 1,
        title: "Implementasi Machine Learning untuk Deteksi Penyakit Tanaman",
        student: "Ahmad Fauzi Ramadhan",
        nrp: "5025201001",
        type: "Proposal",
        time: "09:00 - 11:00",
        room: "Ruang Sidang 301",
        supervisors: [
          "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
          "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
        ],
        examiners: ["Dr. Retno Wardani, S.Kom., M.T."],
      },
      {
        id: 2,
        title: "Sistem Rekomendasi Berbasis Collaborative Filtering",
        student: "Siti Aminah Putri",
        nrp: "5025201015",
        type: "Proposal",
        time: "13:00 - 15:00",
        room: "Ruang Sidang 302",
        supervisors: ["Fajar Pradana, S.Kom., M.Kom."],
        examiners: ["Dr. Rizal Fathoni, S.Kom., M.T."],
      },
      {
        id: 17,
        title: "Optimasi Routing dengan Algoritma Genetika",
        student: "Dimas Prasetyo",
        nrp: "5025201090",
        type: "Tugas Akhir",
        time: "15:30 - 17:30",
        room: "Ruang Sidang 101",
        supervisors: ["Dr. Retno Wardani, S.Kom., M.T."],
        examiners: [
          "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
          "Fajar Pradana, S.Kom., M.Kom.",
        ],
      },
    ],
    "2025-12-7": [
      {
        id: 7,
        title: "Pengembangan Aplikasi E-Learning Berbasis Gamifikasi",
        student: "Andi Wijaya",
        nrp: "5025201045",
        type: "Tugas Akhir",
        time: "09:00 - 11:00",
        room: "Ruang Sidang 102",
        supervisors: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
        examiners: [
          "Fajar Pradana, S.Kom., M.Kom.",
          "Dr. Retno Wardani, S.Kom., M.T.",
        ],
      },
    ],
    "2025-12-10": [
      {
        id: 3,
        title: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia",
        student: "Bayu Aditya Pratama",
        nrp: "6025201002",
        type: "Tugas Akhir",
        time: "10:00 - 12:00",
        room: "Ruang Sidang 201",
        supervisors: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
        examiners: [
          "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
          "Dr. Retno Wardani, S.Kom., M.T.",
        ],
      },
      {
        id: 8,
        title: "Implementasi IoT untuk Smart Home Automation",
        student: "Lina Marlina",
        nrp: "5025201050",
        type: "Proposal",
        time: "14:00 - 16:00",
        room: "Ruang Sidang 303",
        supervisors: ["Dr. Rizal Fathoni, S.Kom., M.T."],
        examiners: ["Fajar Pradana, S.Kom., M.Kom."],
      },
    ],
    "2025-12-12": [
      {
        id: 9,
        title: "Sistem Deteksi Fraud Menggunakan Deep Learning",
        student: "Budi Santoso",
        nrp: "5025201055",
        type: "Proposal",
        time: "08:30 - 10:30",
        room: "Ruang Sidang 201",
        supervisors: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."],
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
      },
      {
        id: 10,
        title: "Platform E-Commerce dengan Fitur AR",
        student: "Rina Wati",
        nrp: "5025201060",
        type: "Tugas Akhir",
        time: "13:00 - 15:00",
        room: "Ruang Sidang 102",
        supervisors: [
          "Fajar Pradana, S.Kom., M.Kom.",
          "Dr. Retno Wardani, S.Kom., M.T.",
        ],
        examiners: ["Dr. Rizal Fathoni, S.Kom., M.T."],
      },
    ],
    "2025-12-14": [
      {
        id: 18,
        title: "Chatbot Customer Service dengan NLP",
        student: "Nadia Putri",
        nrp: "5025201095",
        type: "Proposal",
        time: "10:00 - 12:00",
        room: "Ruang Sidang 202",
        supervisors: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
        examiners: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."],
      },
      {
        id: 19,
        title: "Aplikasi Fitness Tracker Berbasis AI",
        student: "Rizki Maulana",
        nrp: "5025201100",
        type: "Tugas Akhir",
        time: "13:30 - 15:30",
        room: "Ruang Sidang 301",
        supervisors: ["Dr. Retno Wardani, S.Kom., M.T."],
        examiners: [
          "Dr. Rizal Fathoni, S.Kom., M.T.",
          "Fajar Pradana, S.Kom., M.Kom.",
        ],
      },
      {
        id: 20,
        title: "Smart Agriculture dengan Sensor IoT",
        student: "Eko Prasetyo",
        nrp: "6025201025",
        type: "Proposal",
        time: "16:00 - 18:00",
        room: "Ruang Sidang 303",
        supervisors: ["Fajar Pradana, S.Kom., M.Kom."],
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
      },
    ],
    "2025-12-15": [
      {
        id: 4,
        title: "Analisis Sentimen Media Sosial Menggunakan Deep Learning",
        student: "Dewi Kartika Sari",
        nrp: "5025201020",
        type: "Tugas Akhir",
        time: "08:30 - 10:30",
        room: "Ruang Sidang 101",
        supervisors: [
          "Fajar Pradana, S.Kom., M.Kom.",
          "Dr. Rizal Fathoni, S.Kom., M.T.",
        ],
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
      },
      {
        id: 5,
        title: "Optimasi Algoritma Pencarian dengan Genetic Algorithm",
        student: "Rini Susanti",
        nrp: "6025201008",
        type: "Proposal",
        time: "14:00 - 16:00",
        room: "Ruang Sidang 303",
        supervisors: ["Dr. Retno Wardani, S.Kom., M.T."],
        examiners: ["Fajar Pradana, S.Kom., M.Kom."],
      },
    ],
    "2025-12-17": [
      {
        id: 21,
        title: "Sistem Parkir Otomatis dengan Computer Vision",
        student: "Adi Nugroho",
        nrp: "5025201105",
        type: "Tugas Akhir",
        time: "09:00 - 11:00",
        room: "Ruang Sidang 201",
        supervisors: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."],
        examiners: [
          "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
          "Dr. Retno Wardani, S.Kom., M.T.",
        ],
      },
    ],
    "2025-12-18": [
      {
        id: 11,
        title: "Chatbot Pelayanan Publik Menggunakan NLP",
        student: "Hendra Kurniawan",
        nrp: "5025201065",
        type: "Proposal",
        time: "09:00 - 11:00",
        room: "Ruang Sidang 301",
        supervisors: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
        examiners: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."],
      },
      {
        id: 12,
        title: "Aplikasi Manajemen Proyek Berbasis Cloud",
        student: "Maya Sari",
        nrp: "5025201070",
        type: "Tugas Akhir",
        time: "13:30 - 15:30",
        room: "Ruang Sidang 202",
        supervisors: ["Dr. Rizal Fathoni, S.Kom., M.T."],
        examiners: [
          "Dr. Retno Wardani, S.Kom., M.T.",
          "Fajar Pradana, S.Kom., M.Kom.",
        ],
      },
    ],
    "2025-12-20": [
      {
        id: 6,
        title: "Blockchain untuk Sistem Voting Digital",
        student: "Muhammad Iqbal",
        nrp: "5025201030",
        type: "Proposal",
        time: "11:00 - 13:00",
        room: "Ruang Sidang 202",
        supervisors: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
        examiners: [
          "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
        ],
      },
      {
        id: 13,
        title: "Sistem Parkir Pintar Berbasis Computer Vision",
        student: "Tono Sugiarto",
        nrp: "5025201075",
        type: "Tugas Akhir",
        time: "14:00 - 16:00",
        room: "Ruang Sidang 101",
        supervisors: [
          "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
          "Dr. Retno Wardani, S.Kom., M.T.",
        ],
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."],
      },
    ],
    "2025-12-21": [
      {
        id: 22,
        title: "Deteksi Penyakit Kulit dengan CNN",
        student: "Fika Anggraini",
        nrp: "5025201110",
        type: "Proposal",
        time: "10:30 - 12:30",
        room: "Ruang Sidang 102",
        supervisors: ["Dr. Retno Wardani, S.Kom., M.T."],
        examiners: ["Fajar Pradana, S.Kom., M.Kom."],
      },
    ],
    "2025-12-22": [
      {
        id: 14,
        title: "Prediksi Harga Saham Menggunakan LSTM",
        student: "Joko Widodo",
        nrp: "6025201015",
        type: "Proposal",
        time: "10:00 - 12:00",
        room: "Ruang Sidang 302",
        supervisors: ["Fajar Pradana, S.Kom., M.Kom."],
        examiners: ["Dr. Rizal Fathoni, S.Kom., M.T."],
      },
    ],
    "2025-12-24": [
      {
        id: 23,
        title: "Virtual Reality untuk Terapi PTSD",
        student: "Sarah Nabila",
        nrp: "5025201115",
        type: "Tugas Akhir",
        time: "09:00 - 11:00",
        room: "Ruang Sidang 201",
        supervisors: [
          "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
          "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
        ],
        examiners: ["Dr. Retno Wardani, S.Kom., M.T."],
      },
    ],
    "2025-12-27": [
      {
        id: 15,
        title: "Augmented Reality untuk Pembelajaran Anatomi",
        student: "Wulan Dari",
        nrp: "5025201080",
        type: "Tugas Akhir",
        time: "09:30 - 11:30",
        room: "Ruang Sidang 201",
        supervisors: [
          "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
          "Dr. Retno Wardani, S.Kom., M.T.",
        ],
        examiners: ["Fajar Pradana, S.Kom., M.Kom."],
      },
      {
        id: 16,
        title: "Sistem Rekomendasi Wisata Berbasis Content-Based Filtering",
        student: "Putri Ayu",
        nrp: "5025201085",
        type: "Proposal",
        time: "13:00 - 15:00",
        room: "Ruang Sidang 303",
        supervisors: ["Dr. Rizal Fathoni, S.Kom., M.T."],
        examiners: [
          "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
        ],
      },
    ],
  };

  const monthNames = [
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

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

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
    if (day.events.length > 0) {
      setSelectedDay(day);
      setIsDetailModalOpen(true);
    }
  };

  const getEventTypeColor = (type: string) => {
    return type === "Proposal"
      ? "bg-blue-100 text-blue-700 border-blue-300"
      : "bg-green-100 text-green-700 border-green-300";
  };

  // ====== Calendar bulanan sederhana + dot hijau ======
  const renderSimpleMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const totalCells = 42;
    const today = currentDate; // "tanggal sekarang" = state currentDate

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        {/* Header Month + Nav */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-[Poppins] text-lg">
            {monthNames[month]} {year}
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

        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-gray-600 py-1 font-[Poppins]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: totalCells }, (_, i) => {
            const dayNumber = i - firstDayOfWeek + 1;
            const isInCurrentMonth =
              dayNumber >= 1 && dayNumber <= lastDay.getDate();

            const dateKey =
              isInCurrentMonth
                ? `${year}-${month + 1}-${dayNumber}`
                : "";
            const events = isInCurrentMonth
              ? eventsData[dateKey] || []
              : [];
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

            return (
              <div
                key={i}
                className={`${baseClasses} ${stateClasses}`}
                onClick={() => {
                  if (!isInCurrentMonth || !hasEvents) return;
                  const day: CalendarDay = {
                    date: dayNumber,
                    month,
                    year,
                    isCurrentMonth: true,
                    events,
                  };
                  handleDayClick(day);
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

  // ====== Upcoming Defenses: hanya H+1 dari currentDate ======
  const todayLike = currentDate;
  const nextDay = new Date(
    todayLike.getFullYear(),
    todayLike.getMonth(),
    todayLike.getDate() + 1
  );

  const upcomingEvents = Object.entries(eventsData)
    .flatMap(([dateKey, events]) => {
      const [y, m, d] = dateKey.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return events.map((event) => ({
        ...event,
        dateObj,
        dateLabel: `${d} ${monthNames[m - 1]} ${y}`,
      }));
    })
    .filter(
      (e) =>
        e.dateObj.getFullYear() === nextDay.getFullYear() &&
        e.dateObj.getMonth() === nextDay.getMonth() &&
        e.dateObj.getDate() === nextDay.getDate()
    )
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">
                Jadwal Sidang
              </h1>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-[Poppins]">Panduan Penggunaan</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Lihat dan kelola jadwal sidang mahasiswa dalam format kalender
            </p>
          </div>

          {/* Calendar View */}
          {renderSimpleMonthGrid()}

          {/* Upcoming Defenses (UI sama seperti DefenseSchedule) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-gray-800 font-[Poppins] text-[16px]">
                Upcoming Defenses
              </h2>
              <p className="text-sm text-gray-500 font-[Roboto] mt-1">
                Menampilkan sidang pada{" "}
                {`${nextDay.getDate()} ${
                  monthNames[nextDay.getMonth()]
                } ${nextDay.getFullYear()}`}
              </p>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="p-6 text-sm text-gray-500 font-[Roboto]">
                Tidak ada sidang terjadwal untuk H+1.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {upcomingEvents.map((defense) => {
                  const typeLabel =
                    defense.type === "Proposal"
                      ? "Proposal Defense"
                      : "Final Defense";
                  const statusLabel = "Scheduled"; // bisa dihubungkan ke status riil nanti
                  const mode = "Offline"; // default, karena belum ada field mode
                  const location = defense.room;

                  return (
                    <div
                      key={`${defense.id}-${defense.dateObj.toISOString()}`}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-[Roboto] ${
                                typeLabel === "Proposal Defense"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {typeLabel}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-[Roboto] ${
                                statusLabel === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {statusLabel}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 mb-1 font-[Roboto]">
                            Mahasiswa:{" "}
                            <span className="text-gray-800">
                              {defense.student} ({defense.nrp})
                            </span>
                          </div>

                          <h3 className="text-gray-800 mb-3 font-[Poppins]">
                            {defense.title}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-[Roboto]">
                            <div className="flex items-center gap-2 text-gray-600">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{defense.dateLabel}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{defense.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              {mode === "Online" ? (
                                <Video className="w-4 h-4" />
                              ) : (
                                <MapPin className="w-4 h-4" />
                              )}
                              <span>{location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-[Roboto] ${
                                  mode === "Online"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {mode}
                              </span>
                            </div>
                          </div>

<div className="mt-4 pt-4 border-t border-gray-200">
  <div className="flex items-center gap-2 text-sm text-gray-600 font-[Roboto]">
    <Users className="w-4 h-4" />
    <span>Penguji:</span>
    <span className="text-gray-800">
      {defense.examiners.join(", ")}
    </span>
  </div>
</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-[Roboto]">
                © 2021-2025 Institut Teknologi Sepuluh Nopember
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsDetailModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">
                        Jadwal Sidang
                      </h2>
                      <p className="text-sm text-gray-600 font-[Roboto]">
                        {selectedDay.date} {monthNames[selectedDay.month]}{" "}
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

                {/* Events List */}
                <div className="space-y-4">
                  {selectedDay.events.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors"
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
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-[Roboto] mb-2 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Penguji:
                          </p>
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title="Panduan Penggunaan - Jadwal Sidang (Kalender)"
        steps={[
          {
            title: "Tampilan Kalender Bulanan",
            description:
              "Halaman ini menampilkan jadwal sidang dalam format kalender bulanan yang ringkas. Tanggal yang memiliki jadwal sidang ditandai dengan titik hijau.",
            imageUrl:
              "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHNjaGVkdWxlfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Navigasi Kalender",
            description:
              "Gunakan tombol 'Sebelumnya' dan 'Berikutnya' untuk berpindah antar bulan. Anda dapat melihat jadwal beberapa bulan ke depan untuk perencanaan sidang.",
            imageUrl:
              "https://images.unsplash.com/photo-1611224885990-ab7363d1f2b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMG5hdmlnYXRpb258ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Melihat Detail Sidang",
            description:
              "Klik pada tanggal yang memiliki titik hijau untuk melihat daftar sidang pada hari tersebut, termasuk mahasiswa, judul, waktu, ruangan, pembimbing, dan penguji.",
            imageUrl:
              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnQlMjBib2FyZHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
        ]}
      />
    </>
  );
}
