import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { GuideModal } from "./GuideModal";

interface HearingEvent {
  id: number;
  title: string;
  student: string;
  nrp: string;
  type: "Proposal" | "Tugas Akhir";
  startTime: string;
  endTime: string;
  room: string;
  supervisors: string[];
  examiners: string[];
  day: number; // 0-6 (Sun-Sat)
  category: string;
}

interface JadwalSidangWeeklyCalendarProps {
  onViewDetail: (event: HearingEvent) => void;
}

export function JadwalSidangWeeklyCalendar({ onViewDetail }: JadwalSidangWeeklyCalendarProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Time slots from 07:00 to 18:00
  const timeSlots = [
    "07.00", "08.00", "09.00", "10.00", "11.00", "12.00",
    "13.00", "14.00", "15.00", "16.00", "17.00", "18.00"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Sample events
  const events: HearingEvent[] = [
    {
      id: 1,
      title: "Rekayasa Kebutuhan",
      student: "Ahmad Fauzi",
      nrp: "5025201001",
      type: "Proposal",
      startTime: "07:00",
      endTime: "08:50",
      room: "Ruang 301",
      supervisors: ["Dr. Ahmad Saikhu"],
      examiners: ["Dr. Retno Wardani"],
      day: 3, // Wednesday
      category: "Rekayasa Kebutuhan"
    },
    {
      id: 2,
      title: "Aplikasi Teknologi Digital",
      student: "Siti Aminah",
      nrp: "5025201015",
      type: "Tugas Akhir",
      startTime: "07:00",
      endTime: "09:50",
      room: "Ruang 302",
      supervisors: ["Prof. Dini"],
      examiners: ["Fajar Pradana"],
      day: 4, // Thursday
      category: "Aplikasi Teknologi Digital"
    },
    {
      id: 3,
      title: "Arsitektur Perangkat Lunak",
      student: "Bayu Aditya",
      nrp: "6025201002",
      type: "Proposal",
      startTime: "10:00",
      endTime: "12:00",
      room: "Ruang 201",
      supervisors: ["Dr. Ahmad Saikhu"],
      examiners: ["Dr. Rizal Fathoni"],
      day: 3, // Wednesday
      category: "Arsitektur Perangkat Lunak"
    },
    {
      id: 4,
      title: "Kewirausahaan Berbasis Teknologi",
      student: "Dewi Kartika",
      nrp: "5025201020",
      type: "Tugas Akhir",
      startTime: "11:00",
      endTime: "12:00",
      room: "Ruang 303",
      supervisors: ["Fajar Pradana"],
      examiners: ["Dr. Ahmad Saikhu"],
      day: 4, // Thursday
      category: "Kewirausahaan Berbasis Teknologi"
    },
    {
      id: 5,
      title: "Juma'at Prayer",
      student: "",
      nrp: "",
      type: "Proposal",
      startTime: "11:15",
      endTime: "12:30",
      room: "",
      supervisors: [],
      examiners: [],
      day: 5, // Friday
      category: "Juma'at Prayer"
    },
    {
      id: 6,
      title: "Kecerdasan Komputasional",
      student: "Muhammad Iqbal",
      nrp: "5025201030",
      type: "Proposal",
      startTime: "13:30",
      endTime: "15:20",
      room: "Ruang 202",
      supervisors: ["Dr. Ahmad Saikhu"],
      examiners: ["Prof. Dini"],
      day: 2, // Tuesday
      category: "Kecerdasan Komputasional"
    },
    {
      id: 7,
      title: "Komputasi Berbasis Jaringan",
      student: "Rini Susanti",
      nrp: "6025201008",
      type: "Tugas Akhir",
      startTime: "14:00",
      endTime: "16:00",
      room: "Ruang 101",
      supervisors: ["Dr. Retno Wardani"],
      examiners: ["Fajar Pradana"],
      day: 3, // Wednesday
      category: "Komputasi Berbasis Jaringan"
    },
    {
      id: 8,
      title: "Etika Profesi",
      student: "Andi Wijaya",
      nrp: "5025201045",
      type: "Proposal",
      startTime: "13:30",
      endTime: "16:20",
      room: "Ruang 304",
      supervisors: ["Dr. Rizal Fathoni"],
      examiners: ["Dr. Ahmad Saikhu"],
      day: 5, // Friday
      category: "Etika Profesi"
    }
  ];

  // Get start and end of week
  const getWeekDays = (date: Date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr);
      day.setDate(first + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  // Get events for a specific day and time
  const getEventsForDayAndTime = (dayIndex: number, timeSlot: string) => {
    return events.filter(event => {
      if (event.day !== dayIndex) return false;
      
      const slotHour = parseInt(timeSlot.split(".")[0]);
      const startHour = parseInt(event.startTime.split(":")[0]);
      const endHour = parseInt(event.endTime.split(":")[0]);
      const endMinute = parseInt(event.endTime.split(":")[1]);
      
      return slotHour >= startHour && (slotHour < endHour || (slotHour === endHour && endMinute > 0));
    });
  };

  const calculateEventHeight = (event: HearingEvent) => {
    const [startHour, startMin] = event.startTime.split(":").map(Number);
    const [endHour, endMin] = event.endTime.split(":").map(Number);
    const durationHours = (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60;
    return `${durationHours * 60}px`; // 60px per hour
  };

  const calculateEventTop = (event: HearingEvent) => {
    const [startHour, startMin] = event.startTime.split(":").map(Number);
    const baseTime = 7; // Start from 07:00
    const offset = ((startHour + startMin / 60) - baseTime) * 60;
    return `${offset}px`;
  };

  const getEventColor = (category: string) => {
    if (category === "Juma'at Prayer") return "bg-purple-500/80";
    const colors = [
      "bg-blue-600/90",
      "bg-cyan-600/90",
      "bg-teal-600/90",
      "bg-green-600/90",
      "bg-indigo-600/90"
    ];
    return colors[Math.abs(category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length];
  };

  return (
    <>
      <main className="flex-1 p-6 bg-[#2d2d2d]">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-white font-[Poppins] text-[24px]">
                {monthNames[currentWeek.getMonth()]} {currentWeek.getFullYear()}
              </h1>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-[Poppins]">Panduan Penggunaan</span>
              </button>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="bg-[#3a3a3a] rounded-lg border border-gray-700 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={goToToday}
                  className="px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded hover:bg-gray-600 transition-colors font-[Roboto] text-sm"
                >
                  Today
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousWeek}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-300" />
                </button>
                <button
                  onClick={goToNextWeek}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Weekly Calendar Grid */}
          <div className="bg-[#2d2d2d] rounded-lg overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b border-gray-700">
              <div className="p-3 text-white font-[Poppins] text-xs bg-[#3a3a3a]">all-day</div>
              {weekDays.map((day, index) => (
                <div key={index} className="p-3 text-center bg-[#3a3a3a] border-l border-gray-700">
                  <div className="text-gray-400 font-[Poppins] text-xs">{dayNames[day.getDay()]} {day.getDate()}</div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-8">
              {/* Time Labels Column */}
              <div className="bg-[#3a3a3a]">
                {timeSlots.map((time, index) => (
                  <div key={time} className="h-[60px] border-b border-gray-700 px-2 py-1">
                    <span className="text-gray-400 font-[Roboto] text-xs">{time}</span>
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="relative border-l border-gray-700">
                  {timeSlots.map((time, timeIndex) => (
                    <div
                      key={timeIndex}
                      className="h-[60px] border-b border-gray-700 hover:bg-gray-800/20 transition-colors"
                    />
                  ))}

                  {/* Events Layer */}
                  <div className="absolute inset-0 pointer-events-none">
                    {events
                      .filter(event => event.day === day.getDay())
                      .map(event => {
                        const isRenderedHere = events
                          .filter(e => e.day === day.getDay() && e.startTime === event.startTime)
                          .indexOf(event) === 0;
                        
                        if (!isRenderedHere) return null;

                        return (
                          <div
                            key={event.id}
                            className={`absolute left-1 right-1 ${getEventColor(event.category)} rounded p-2 cursor-pointer pointer-events-auto hover:opacity-90 transition-opacity border-l-4 border-white/30`}
                            style={{
                              top: calculateEventTop(event),
                              height: calculateEventHeight(event)
                            }}
                            onClick={() => onViewDetail(event)}
                          >
                            <div className="flex items-start gap-1.5">
                              <CalendarIcon className="w-3 h-3 text-white/90 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-[Poppins] text-xs font-medium truncate">
                                  {event.category}
                                </p>
                                <p className="text-white/80 font-[Roboto] text-[10px] mt-0.5">
                                  ⏰ {event.startTime}-{event.endTime}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 font-[Roboto]">
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

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title="Panduan Penggunaan - Jadwal Sidang (Kalender Mingguan)"
        steps={[
          {
            title: "Tampilan Kalender Mingguan",
            description: "Halaman ini menampilkan jadwal sidang dalam format kalender mingguan dengan slot waktu dari jam 07:00 hingga 18:00. Setiap blok berwarna menunjukkan satu sesi sidang dengan kategori dan waktu yang jelas.",
            imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHNjaGVkdWxlfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Navigasi Mingguan",
            description: "Gunakan tombol panah untuk berpindah antar minggu. Klik tombol 'Today' untuk kembali ke minggu ini. Anda dapat melihat jadwal beberapa minggu ke depan untuk perencanaan.",
            imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMG5hdmlnYXRpb258ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Melihat Detail Sidang",
            description: "Klik pada blok sidang untuk melihat detail lengkap termasuk informasi mahasiswa, judul, ruangan, dosen pembimbing, dan penguji. Warna blok menunjukkan kategori sidang yang berbeda.",
            imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnQlMjBib2FyZHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Interpretasi Slot Waktu",
            description: "Setiap blok sidang menempati slot waktu sesuai durasi sidang. Tinggi blok proporsional dengan durasi sidang. Blok dapat saling tumpang tindih jika ada jadwal paralel di ruangan berbeda.",
            imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0JTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]}
      />
    </>
  );
}
