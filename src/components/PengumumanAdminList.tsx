import { useState } from "react";
import { BookOpen, Edit, Trash2, Plus, Search, Power, PowerOff } from "lucide-react";
import { GuideModal } from "./GuideModal";
import { toast } from "sonner@2.0.3";

interface Announcement {
  id: number;
  title: string;
  category: "Penting" | "Info" | "Acara" | "Deadline" | "Sistem";
  target: "Semua" | "Mahasiswa" | "Dosen";
  content: string;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
}

interface PengumumanAdminListProps {
  onNavigate: (page: string, announcementId?: number) => void;
}

export function PengumumanAdminList({ onNavigate }: PengumumanAdminListProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Pengumuman Jadwal Sidang Proposal Periode Januari 2025",
      category: "Penting",
      target: "Mahasiswa",
      content: "Jadwal sidang proposal periode Januari 2025 telah tersedia...",
      isActive: true,
      createdDate: "20 Nov 2024",
      createdBy: "Admin Sistem"
    },
    {
      id: 2,
      title: "Penutupan Sistem untuk Maintenance",
      category: "Sistem",
      target: "Semua",
      content: "Sistem akan ditutup sementara pada tanggal 25 November 2024...",
      isActive: true,
      createdDate: "18 Nov 2024",
      createdBy: "Admin TI"
    },
    {
      id: 3,
      title: "Workshop Penulisan Jurnal Ilmiah",
      category: "Acara",
      target: "Dosen",
      content: "Akan diadakan workshop penulisan jurnal ilmiah internasional...",
      isActive: false,
      createdDate: "15 Nov 2024",
      createdBy: "Admin Akademik"
    },
    {
      id: 4,
      title: "Deadline Pengumpulan Laporan Akhir",
      category: "Deadline",
      target: "Mahasiswa",
      content: "Batas akhir pengumpulan laporan tugas akhir adalah 30 November 2024...",
      isActive: true,
      createdDate: "12 Nov 2024",
      createdBy: "Admin Sistem"
    },
    {
      id: 5,
      title: "Info Beasiswa S2 Luar Negeri",
      category: "Info",
      target: "Mahasiswa",
      content: "Tersedia beasiswa S2 luar negeri untuk lulusan terbaik...",
      isActive: false,
      createdDate: "10 Nov 2024",
      createdBy: "Admin Akademik"
    }
  ]);

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = (id: number) => {
    setAnnouncements(announcements.map(announcement =>
      announcement.id === id
        ? { ...announcement, isActive: !announcement.isActive }
        : announcement
    ));
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      toast.success(
        announcement.isActive
          ? "Pengumuman berhasil dinonaktifkan"
          : "Pengumuman berhasil diaktifkan"
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast.success("Pengumuman berhasil dihapus");
    }
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

  const getTargetColor = (target: string) => {
    switch (target) {
      case "Semua":
        return "bg-green-100 text-green-700 border-green-200";
      case "Mahasiswa":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Dosen":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">Kelola Pengumuman</h1>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-[Poppins]">Panduan Penggunaan</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Kelola dan atur pengumuman untuk mahasiswa dan dosen
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pengumuman..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={() => onNavigate("Buat Pengumuman Baru")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
            >
              <Plus className="w-4 h-4" />
              Buat Pengumuman
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-[Roboto]">Total Pengumuman</p>
                  <p className="text-2xl text-gray-800 font-[Poppins]">{announcements.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Power className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-[Roboto]">Aktif</p>
                  <p className="text-2xl text-gray-800 font-[Poppins]">
                    {announcements.filter(a => a.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <PowerOff className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-[Roboto]">Nonaktif</p>
                  <p className="text-2xl text-gray-800 font-[Poppins]">
                    {announcements.filter(a => !a.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-[Roboto]">
                  {searchQuery ? "Tidak ada pengumuman yang cocok" : "Belum ada pengumuman"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-gray-800 font-[Poppins] font-medium">
                            {announcement.title}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-[Roboto] flex items-center gap-1 ${announcement.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {announcement.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                            {announcement.isActive ? "Aktif" : "Nonaktif"}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-[Roboto] border ${getCategoryColor(announcement.category)}`}>
                            {announcement.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-[Roboto] border ${getTargetColor(announcement.target)}`}>
                            {announcement.target}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 font-[Roboto] mb-2 line-clamp-2">
                          {announcement.content}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-gray-500 font-[Roboto]">
                          <span>Dibuat: {announcement.createdDate}</span>
                          <span>•</span>
                          <span>Oleh: {announcement.createdBy}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleActive(announcement.id)}
                          className={`p-2 rounded-lg border transition-colors ${
                            announcement.isActive
                              ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={announcement.isActive ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {announcement.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onNavigate("Edit Pengumuman", announcement.id)}
                          className="p-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="p-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title="Panduan Penggunaan - Kelola Pengumuman"
        steps={[
          {
            title: "Daftar Pengumuman",
            description: "Halaman ini menampilkan semua pengumuman yang telah dibuat. Setiap pengumuman menampilkan judul, kategori, target audiens, status (aktif/nonaktif), dan informasi pembuat. Gunakan kolom pencarian untuk menemukan pengumuman dengan cepat.",
            imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnQlMjBib2FyZHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Membuat Pengumuman Baru",
            description: "Klik tombol 'Buat Pengumuman' untuk membuat pengumuman baru. Isi formulir dengan judul, kategori, target audiens, konten, dan lampiran jika diperlukan. Pengumuman baru akan otomatis berstatus aktif setelah dibuat.",
            imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGUlMjBkb2N1bWVudHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Mengelola Status Pengumuman",
            description: "Gunakan tombol toggle (ikon power) untuk mengaktifkan atau menonaktifkan pengumuman. Pengumuman yang nonaktif tidak akan ditampilkan kepada mahasiswa dan dosen. Tombol edit memungkinkan Anda mengubah konten pengumuman, sedangkan tombol hapus akan menghapus pengumuman secara permanen.",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2UlMjBzZXR0aW5nc3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Kategori dan Target Audiens",
            description: "Setiap pengumuman memiliki kategori (Penting, Info, Acara, Deadline, Sistem) dan target audiens (Semua, Mahasiswa, Dosen). Pastikan memilih kategori dan target yang tepat agar pengumuman sampai ke penerima yang sesuai dengan prioritas yang benar.",
            imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZ3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]}
      />
    </>
  );
}
