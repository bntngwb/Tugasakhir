import {
  BookOpen,
  Users,
  ClipboardCheck,
  ChevronRight,
  Bell,
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

  // dari App.tsx, angka realtime sidang
  ajuanSidangCount?: number;
  sidangMenungguCount?: number;
  sidangPerluDinilaiCount?: number;
  sidangRevisiCount?: number;

  // dari App.tsx, angka realtime bimbingan
  bimbinganS1Count?: number;
  bimbinganS2Count?: number;
  bimbinganS3Count?: number;
  ajuanBimbinganCount?: number;
}

export function BerandaDosen({
  announcements,
  onNavigate,
  onAnnouncementClick,
  ajuanSidangCount,
  sidangMenungguCount,
  sidangPerluDinilaiCount,
  sidangRevisiCount,
  bimbinganS1Count,
  bimbinganS2Count,
  bimbinganS3Count,
  ajuanBimbinganCount,
}: BerandaDosenProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // fallback ke 0 kalau belum ada summary
  const ajuanCount = ajuanSidangCount ?? 0;
  const menungguCount = sidangMenungguCount ?? 0;
  const perluDinilaiCount = sidangPerluDinilaiCount ?? 0;
  const revisiCount = sidangRevisiCount ?? 0;

  const s1Count = bimbinganS1Count ?? 0;
  const s2Count = bimbinganS2Count ?? 0;
  const s3Count = bimbinganS3Count ?? 0;
  const ajuanBimbCount = ajuanBimbinganCount ?? 0;

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
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">
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
          <p className="text-gray-500 font-[Roboto]">
            Portal Dosen myITS Thesis
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Menu Utama */}
          <div className="lg:col-span-2 space-y-4">
            {/* Menunggu Persetujuan Anda Section */}
            <div>
              <h2 className="text-gray-800 mb-4 font-[Poppins] text-[16px] font-bold">
                Menunggu Persetujuan Anda
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Ajuan Proposal Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center mb-2">
                      <ClipboardCheck className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-gray-800 mb-1 font-[Poppins]">
                      Ajuan Proposal
                    </h3>
                    <p className="text-sm text-gray-500 font-[Roboto]">
                      5 ajuan baru
                    </p>
                  </div>
                  <button className="absolute bottom-3 right-3 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Ajuan Sidang Card */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Sidang")}
                >
                  <div className="mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center mb-2">
                      <ClipboardCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="text-gray-800 mb-1 font-[Poppins]">
                      Ajuan Sidang
                    </h3>
                    <p className="text-sm text-gray-500 font-[Roboto]">
                      {ajuanCount} ajuan baru
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("Sidang");
                    }}
                    className="absolute bottom-3 right-3 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Ajuan Bimbingan Card */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Bimbingan Aktif")}
                >
                  <div className="mb-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-gray-800 mb-1 font-[Poppins]">
                      Ajuan Bimbingan
                    </h3>
                    <p className="text-sm text-gray-500 font-[Roboto]">
                      {ajuanBimbCount} ajuan baru
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("Bimbingan Aktif");
                    }}
                    className="absolute bottom-3 right-3 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-gray-800 mb-4 font-[Poppins] text-[16px] font-bold">
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
                    <h3 className="text-gray-800 font-[Poppins]">
                      Bimbingan Aktif
                    </h3>
                    <p className="text-xs text-gray-500 font-[Roboto]">
                      Mahasiswa dalam bimbingan
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate("Bimbingan Aktif")}
                  className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200">
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S1</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Mahasiswa:
                    </p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">
                      {s1Count}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200">
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S2</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Mahasiswa:
                    </p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">
                      {s2Count}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200">
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S3</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Mahasiswa:
                    </p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">
                      {s3Count}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidang Card (parent clickable + angka realtime) */}
            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => onNavigate("Sidang")}
            >
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("Sidang");
                  }}
                  className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {/* Status Menunggu */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow duration-200">
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1 text-sm">
                      Status Menunggu
                    </p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Perlu aksi Anda
                    </p>
                    <p className="text-2xl text-green-600 font-[Poppins]">
                      {menungguCount}
                    </p>
                  </div>
                </div>

                {/* Perlu Dinilai */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow duration-200">
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1 text-sm">
                      Perlu Dinilai
                    </p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Belum diberi nilai
                    </p>
                    <p className="text-2xl text-amber-600 font-[Poppins]">
                      {perluDinilaiCount}
                    </p>
                  </div>
                </div>

                {/* Revisi */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow duration-200">
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1 text-sm">
                      Revisi
                    </p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Menunggu verifikasi
                    </p>
                    <p className="text-2xl text-red-600 font-[Poppins]">
                      {revisiCount}
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
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
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
          <p className="text-sm text-gray-500 text-center font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

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
                "Menu Sidang membantu Anda mengelola jadwal sidang mahasiswa. Penilaian Sidang menunjukkan sidang yang perlu dinilai, Sidang Mendatang untuk jadwal sidang dalam waktu dekat, dan Revisi Pending untuk sidang yang memerlukan revisi. Pastikan Anda menyelesaikan penilaian tepat waktu.",
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
