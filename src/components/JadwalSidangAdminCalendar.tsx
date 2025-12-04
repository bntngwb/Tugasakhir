import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock events data
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
        supervisors: ["Dr. Ahmad Saikhu, S.Kom., M.Kom.", "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."],
        examiners: ["Dr. Retno Wardani, S.Kom., M.T."]
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
        examiners: ["Dr. Rizal Fathoni, S.Kom., M.T."]
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
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom.", "Fajar Pradana, S.Kom., M.Kom."]
      }
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
        examiners: ["Fajar Pradana, S.Kom., M.Kom.", "Dr. Retno Wardani, S.Kom., M.T."]
      }
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
        examiners: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.", "Dr. Retno Wardani, S.Kom., M.T."]
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
        examiners: ["Fajar Pradana, S.Kom., M.Kom."]
      }
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
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."]
      },
      {
        id: 10,
        title: "Platform E-Commerce dengan Fitur AR",
        student: "Rina Wati",
        nrp: "5025201060",
        type: "Tugas Akhir",
        time: "13:00 - 15:00",
        room: "Ruang Sidang 102",
        supervisors: ["Fajar Pradana, S.Kom., M.Kom.", "Dr. Retno Wardani, S.Kom., M.T."],
        examiners: ["Dr. Rizal Fathoni, S.Kom., M.T."]
      }
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
        examiners: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."]
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
        examiners: ["Dr. Rizal Fathoni, S.Kom., M.T.", "Fajar Pradana, S.Kom., M.Kom."]
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
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."]
      }
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
        supervisors: ["Fajar Pradana, S.Kom., M.Kom.", "Dr. Rizal Fathoni, S.Kom., M.T."],
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."]
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
        examiners: ["Fajar Pradana, S.Kom., M.Kom."]
      }
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
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom.", "Dr. Retno Wardani, S.Kom., M.T."]
      }
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
        examiners: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."]
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
        examiners: ["Dr. Retno Wardani, S.Kom., M.T.", "Fajar Pradana, S.Kom., M.Kom."]
      }
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
        examiners: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."]
      },
      {
        id: 13,
        title: "Sistem Parkir Pintar Berbasis Computer Vision",
        student: "Tono Sugiarto",
        nrp: "5025201075",
        type: "Tugas Akhir",
        time: "14:00 - 16:00",
        room: "Ruang Sidang 101",
        supervisors: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.", "Dr. Retno Wardani, S.Kom., M.T."],
        examiners: ["Dr. Ahmad Saikhu, S.Kom., M.Kom."]
      }
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
        examiners: ["Fajar Pradana, S.Kom., M.Kom."]
      }
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
        examiners: ["Dr. Rizal Fathoni, S.Kom., M.T."]
      }
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
        supervisors: ["Dr. Ahmad Saikhu, S.Kom., M.Kom.", "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."],
        examiners: ["Dr. Retno Wardani, S.Kom., M.T."]
      }
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
        supervisors: ["Dr. Ahmad Saikhu, S.Kom., M.Kom.", "Dr. Retno Wardani, S.Kom., M.T."],
        examiners: ["Fajar Pradana, S.Kom., M.Kom."]
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
        examiners: ["Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D."]
      }
    ]
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.events.length > 0) {
      setSelectedDay(day);
      setIsDetailModalOpen(true);
    }
  };

  const isToday = (day: CalendarDay) => {
    const today = new Date();
    return day.date === today.getDate() &&
           day.month === today.getMonth() &&
           day.year === today.getFullYear();
  };

  const getEventTypeColor = (type: string) => {
    return type === "Proposal"
      ? "bg-blue-100 text-blue-700 border-blue-300"
      : "bg-green-100 text-green-700 border-green-300";
  };

  const renderCalendarDays = () => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get starting day (Sunday = 0)
    const startingDayOfWeek = firstDay.getDay();

    // Get days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = prevMonthLastDay - i;
      const dateKey = `${year}-${month}-${date}`;
      days.push({
        date,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
        events: eventsData[dateKey] || []
      });
    }

    // Get days from current month
    for (let date = 1; date <= lastDay.getDate(); date++) {
      const dateKey = `${year}-${month + 1}-${date}`;
      days.push({
        date,
        month,
        year,
        isCurrentMonth: true,
        events: eventsData[dateKey] || []
      });
    }

    // Get days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let date = 1; date <= remainingDays; date++) {
      const dateKey = `${year}-${month + 2}-${date}`;
      days.push({
        date,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
        events: eventsData[dateKey] || []
      });
    }

    return (
      <div className="grid grid-cols-7 gap-0 border-l border-t border-gray-200">
        {days.map((day, index) => {
          const isToday =
            day.date === today.getDate() &&
            day.month === today.getMonth() &&
            day.year === today.getFullYear();

          return (
            <div
              key={index}
              className={`min-h-[140px] border-r border-b border-gray-200 p-2 ${
                day.isCurrentMonth ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50/30 transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-[Roboto] ${
                    isToday
                      ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-semibold"
                      : day.isCurrentMonth
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {day.date}
                </span>
                {day.events.length > 0 && (
                  <span className="text-xs text-blue-600 font-[Roboto] font-medium">
                    {day.events.length} sidang
                  </span>
                )}
              </div>

              {/* Event blocks */}
              <div className="space-y-1">
                {day.events.slice(0, 2).map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedDay(day);
                      setIsDetailModalOpen(true);
                    }}
                    className={`${
                      event.type === "Proposal"
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "bg-green-50 border-l-4 border-green-500"
                    } p-2 rounded cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className={`text-xs font-[Poppins] font-semibold truncate mb-1 ${
                      event.type === "Proposal" ? "text-blue-700" : "text-green-700"
                    }`}>
                      {event.student}
                    </div>
                    <div className="truncate text-gray-600 text-[10px] font-[Roboto] mb-1.5">
                      {event.title}
                    </div>
                    <div className="space-y-0.5 text-[10px] font-[Roboto] text-gray-500">
                      <div className="truncate">
                        👤 {event.examiners[0] || "-"}
                      </div>
                      {event.examiners[1] && (
                        <div className="truncate">
                          👤 {event.examiners[1]}
                        </div>
                      )}
                      <div className="truncate">📍 {event.room}</div>
                    </div>
                  </motion.div>
                ))}
                {day.events.length > 2 && (
                  <button
                    onClick={() => {
                      setSelectedDay(day);
                      setIsDetailModalOpen(true);
                    }}
                    className="w-full text-xs text-blue-600 hover:text-blue-700 font-[Roboto] font-medium text-left pl-1"
                  >
                    +{day.events.length - 2} sidang lainnya
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">Jadwal Sidang</h1>
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

          {/* Calendar Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl text-gray-800 font-[Poppins]">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors font-[Roboto] text-sm"
                >
                  Hari Ini
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Day Names */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-[Poppins] font-medium text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            {renderCalendarDays()}
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-[Poppins] text-gray-700 mb-3">Keterangan:</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-sm font-[Roboto] text-gray-700">Sidang Proposal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm font-[Roboto] text-gray-700">Sidang Tugas Akhir</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-[Roboto] text-gray-700">Hari Ini</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-[Roboto]">
                © 2021-2025 Institut Teknologi Sepuluh Nopember
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 px-3 py-1 rounded flex items-center gap-2">
                  <span className="text-white text-xs font-[Roboto] font-semibold">ADVANCING</span>
                  <span className="text-white text-xs font-[Roboto] font-semibold">HUMANITY</span>
                </div>
                <div className="text-blue-600 font-bold text-lg">ITS</div>
              </div>
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
                        {selectedDay.date} {monthNames[selectedDay.month]} {selectedDay.year}
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
                              {event.type}
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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
                              <li key={idx} className="text-sm text-gray-700 font-[Roboto] pl-4">
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
                              <li key={idx} className="text-sm text-gray-700 font-[Roboto] pl-4">
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
            title: "Tampilan Kalender",
            description: "Halaman ini menampilkan jadwal sidang dalam format kalender bulanan yang mudah dibaca. Setiap tanggal yang memiliki jadwal sidang ditandai dengan angka merah yang menunjukkan jumlah sidang. Hari ini ditandai dengan lingkaran biru pada tanggal.",
            imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHNjaGVkdWxlfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Navigasi Kalender",
            description: "Gunakan tombol panah kiri dan kanan untuk berpindah antar bulan. Klik tombol 'Hari Ini' untuk langsung kembali ke bulan dan tanggal saat ini. Anda dapat melihat jadwal sidang beberapa bulan ke depan untuk perencanaan yang lebih baik.",
            imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMG5hdmlnYXRpb258ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Melihat Detail Sidang",
            description: "Klik pada tanggal yang memiliki jadwal sidang untuk melihat detail lengkap. Pop-up akan muncul menampilkan informasi setiap sidang termasuk judul, mahasiswa, waktu, ruangan, dosen pembimbing, dan penguji. Label berwarna membedakan antara Sidang Proposal (biru) dan Sidang Tugas Akhir (hijau).",
            imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnQlMjBib2FyZHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Legenda dan Kode Warna",
            description: "Perhatikan legenda di bawah kalender untuk memahami kode warna. Biru muda menandakan Sidang Proposal, hijau muda untuk Sidang Tugas Akhir, dan lingkaran biru untuk hari ini. Gunakan informasi visual ini untuk dengan cepat mengidentifikasi jenis dan jadwal sidang.",
            imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0JTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]}
      />
    </>
  );
}