import { Megaphone, Calendar, AlertCircle, Info, CheckCircle, Clock, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

interface Announcement {
  id: number;
  title: string;
  category: "Penting" | "Info" | "Acara" | "Deadline" | "Sistem";
  date: string;
  content: string;
  imageUrl: string;
  isNew: boolean;
}

interface PengumumanProps {
  announcements: Announcement[];
}

export function Pengumuman({ announcements }: PengumumanProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("Semua");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Penting":
        return <AlertCircle className="w-4 h-4" />;
      case "Info":
        return <Info className="w-4 h-4" />;
      case "Acara":
        return <Calendar className="w-4 h-4" />;
      case "Deadline":
        return <Clock className="w-4 h-4" />;
      case "Sistem":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Penting":
        return "bg-red-100 text-red-700 border-red-200";
      case "Info":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Acara":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Deadline":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Sistem":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const filteredAnnouncements = filterCategory === "Semua"
    ? announcements
    : announcements.filter(a => a.category === filterCategory);

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-gray-800 font-[Poppins] text-[24px]">Pengumuman</h1>
          </div>
          <p className="text-sm text-gray-500 font-[Roboto]">
            Informasi terbaru dan penting seputar program tugas akhir
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-[Roboto]">Filter:</span>
            {["Semua", "Penting", "Deadline", "Acara", "Info", "Sistem"].map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-[Roboto] transition-colors ${
                  filterCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              {/* Image */}
              <div className="relative h-48">
                <ImageWithFallback
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
                {announcement.isNew && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-500 text-white border-0">BARU</Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${getCategoryColor(announcement.category)}`}>
                    {getCategoryIcon(announcement.category)}
                    <span className="font-[Roboto]">{announcement.category}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-[Roboto]">{announcement.date}</span>
                </div>

                <h3 className="text-gray-800 font-[Poppins] mb-2 line-clamp-2">
                  {announcement.title}
                </h3>

                <p className="text-sm text-gray-600 font-[Roboto] line-clamp-3 mb-3">
                  {announcement.content}
                </p>

                <button className="text-sm text-blue-600 hover:text-blue-700 font-[Roboto]">
                  Baca Selengkapnya →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-800 font-[Poppins] mb-2">Tidak Ada Pengumuman</h3>
            <p className="text-sm text-gray-500 font-[Roboto]">
              Tidak ada pengumuman untuk kategori ini saat ini.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
        </footer>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedAnnouncement(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedAnnouncement(null)}
            >
              <div
                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative">
                  <ImageWithFallback
                    src={selectedAnnouncement.imageUrl}
                    alt={selectedAnnouncement.title}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                  {selectedAnnouncement.isNew && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white border-0">BARU</Badge>
                    </div>
                  )}
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm border ${getCategoryColor(selectedAnnouncement.category)}`}>
                      {getCategoryIcon(selectedAnnouncement.category)}
                      <span className="font-[Roboto]">{selectedAnnouncement.category}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-[Roboto]">{selectedAnnouncement.date}</span>
                  </div>

                  <h2 className="text-gray-800 font-[Poppins] text-[22px] mb-4">
                    {selectedAnnouncement.title}
                  </h2>

                  <p className="text-gray-700 font-[Roboto] leading-relaxed whitespace-pre-line">
                    {selectedAnnouncement.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}