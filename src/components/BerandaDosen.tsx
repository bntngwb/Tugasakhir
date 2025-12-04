import { BookOpen, Users, ClipboardCheck, ChevronRight, Bell } from "lucide-react";
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

export function BerandaDosen({
  announcements,
  onNavigate,
  onAnnouncementClick,
  onOpenBimbinganAjuanTopik,
  onOpenBimbinganApprovalSidang,
  onOpenSidangApprovalRevisi,
}: BerandaDosenProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Summary angka (sementara hardcoded, bisa nanti disinkronkan dengan data real)
  const totalSidang = 6;             // jumlah sidang
  const perluNilai = 1;             // sidang dengan status "Perlu Dinilai"
  const perluApprovalSidang = 1;     // sidang dengan status "Perlu Approval"

  const totalS1 = 3; // mahasiswa S1 dalam bimbingan
  const totalS2 = 2;  // mahasiswa S2
  const totalS3 = 0;  // mahasiswa S3

  const totalAjuanTopik = 3;         // jumlah ajuan topik
  const bimbinganPerluApproval = 2;  // jumlah mahasiswa yang perlu approval sidang di Bimbingan Aktif

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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Menu Utama */}
          <div className="lg:col-span-2 space-y-4">
            {/* Menunggu Persetujuan Anda Section */}
            <div>
              <h2 className="text-gray-800 mb-4 font-[Poppins] text-[16px] font-bold font-normal">
                Menunggu Persetujuan Anda
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Card 1: Ajuan Topik */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => {
                    if (onOpenBimbinganAjuanTopik) {
                      onOpenBimbinganAjuanTopik();
                    } else {
                      onNavigate("Bimbingan Aktif");
                    }
                  }}
                >
                  <div className="mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center mb-2">
                      <ClipboardCheck className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-gray-800 mb-1 font-[Poppins]">Ajuan Topik</h3>
                    <p className="text-sm text-gray-500 font-[Roboto]">
                      {totalAjuanTopik} ajuan topik
                    </p>
                  </div>
                  <button className="absolute bottom-3 right-3 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 2: Approval Sidang (dari Bimbingan Aktif) */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => {
                    if (onOpenBimbinganApprovalSidang) {
                      onOpenBimbinganApprovalSidang();
                    } else {
                      onNavigate("Bimbingan Aktif");
                    }
                  }}
                >
                  <div className="mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center mb-2">
                      <ClipboardCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="text-gray-800 mb-1 font-[Poppins]">Approval Sidang</h3>
                    <p className="text-sm text-gray-500 font-[Roboto]">
                      {bimbinganPerluApproval} mahasiswa perlu approval
                    </p>
                  </div>
                  <button className="absolute bottom-3 right-3 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 3: Approval Revisi (dari Sidang) */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => {
                    if (onOpenSidangApprovalRevisi) {
                      onOpenSidangApprovalRevisi();
                    } else {
                      onNavigate("Sidang");
                    }
                  }}
                >
                  <div className="mb-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-yellow-500" />
                    </div>
                  <h3 className="text-gray-800 mb-1 font-[Poppins]">Approval Revisi</h3>
                    <p className="text-sm text-gray-500 font-[Roboto]">
                      {perluApprovalSidang} sidang perlu approval revisi
                    </p>
                  </div>
                  <button className="absolute bottom-3 right-3 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

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
                <button
                  onClick={() => onNavigate("Bimbingan Aktif")}
                  className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Bimbingan Aktif")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S1</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">Mahasiswa:</p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">{totalS1}</p>
                  </div>
                </div>

                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Bimbingan Aktif")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S2</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">Mahasiswa:</p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">{totalS2}</p>
                  </div>
                </div>

                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Bimbingan Aktif")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">S3</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">Mahasiswa:</p>
                    <p className="text-2xl text-gray-800 font-[Poppins]">{totalS3}</p>
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
                <button
                  onClick={() => onNavigate("Sidang")}
                  className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {/* Jumlah Sidang */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Sidang")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">Jumlah Sidang</p>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">Total:</p>
                    <p className="text-2xl text-green-600 font-[Poppins]">
                      {totalSidang}
                    </p>
                  </div>
                </div>

                {/* Perlu Nilai */}
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onNavigate("Sidang")}
                >
                  <div>
                    <p className="text-gray-800 font-[Poppins] mb-1">Perlu Nilai</p>
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
                    <p className="text-gray-800 font-[Poppins] mb-1">Perlu Approval</p>
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
                        setTimeout(() => onAnnouncementClick(announcement.id), 100);
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
