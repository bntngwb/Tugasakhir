import { FileText, ClipboardList, Archive, Video, Megaphone, BookOpen, Users } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: "Mahasiswa" | "Dosen";
}

export function Sidebar({ currentPage, onNavigate, userRole }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-[57px] w-64 bg-white h-[calc(100vh-57px)] border-r border-gray-200 p-4 overflow-y-auto z-30">
      <nav className="space-y-2">
        {/* Beranda - Always shown */}
        <button 
          onClick={() => onNavigate("Beranda")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left ${
            currentPage === "Beranda" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            currentPage === "Beranda" ? "bg-blue-500" : ""
          }`}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="6" r="3" fill={currentPage === "Beranda" ? "white" : "#3B82F6"} />
              <path d="M9 10C6.23858 10 4 12.2386 4 15H14C14 12.2386 11.7614 10 9 10Z" fill={currentPage === "Beranda" ? "white" : "#3B82F6"} />
            </svg>
          </div>
          <span className={`font-[Poppins] ${currentPage === "Beranda" ? "text-gray-800" : "text-gray-700"}`}>Beranda</span>
        </button>
        
        {/* Penawaran Topik - Always shown */}
        <button 
          onClick={() => onNavigate("Penawaran Topik")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left ${
            currentPage === "Penawaran Topik" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-yellow-500" />
          </div>
          <span className={`font-[Poppins] ${currentPage === "Penawaran Topik" ? "text-gray-800" : "text-gray-700"}`}>Penawaran Topik</span>
        </button>
        
        {/* Tugas Akhir - Only for Mahasiswa */}
        {userRole === "Mahasiswa" && (
          <button 
            onClick={() => onNavigate("Tugas Akhir")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left ${
              currentPage === "Tugas Akhir" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-blue-500" />
            </div>
            <span className={`font-[Poppins] ${currentPage === "Tugas Akhir" ? "text-gray-800" : "text-gray-700"}`}>Tugas Akhir</span>
          </button>
        )}

        {/* Bimbingan Aktif - Only for Dosen */}
        {userRole === "Dosen" && (
          <button 
            onClick={() => onNavigate("Bimbingan Aktif")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left ${
              currentPage === "Bimbingan Aktif" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className={`font-[Poppins] ${currentPage === "Bimbingan Aktif" ? "text-gray-800" : "text-gray-700"}`}>Bimbingan Aktif</span>
          </button>
        )}
        
        {/* Arsip - Always shown */}
        <button 
          onClick={() => onNavigate("Arsip")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left font-[Poppins] ${
            currentPage === "Arsip" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <Archive className="w-5 h-5 text-yellow-500" />
          </div>
          <span className={currentPage === "Arsip" ? "text-gray-800" : "text-gray-700"}>Arsip</span>
        </button>
        
        {/* Sidang - Always shown */}
        <button 
          onClick={() => onNavigate("Sidang")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left ${
            currentPage === "Sidang" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <Video className="w-5 h-5 text-blue-500" />
          </div>
          <span className={`font-[Poppins] ${currentPage === "Sidang" ? "text-gray-800" : "text-gray-700"}`}>Sidang</span>
        </button>
        
        {/* Pengumuman - Always shown */}
        <button 
          onClick={() => onNavigate("Pengumuman")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left ${
            currentPage === "Pengumuman" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-yellow-500" />
          </div>
          <span className={`font-[Poppins] ${currentPage === "Pengumuman" ? "text-gray-800" : "text-gray-700"}`}>Pengumuman</span>
        </button>
        
        {/* Panduan - Always shown */}
        <button 
          onClick={() => onNavigate("Panduan")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left font-[Poppins] ${
            currentPage === "Panduan" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-yellow-500" />
          </div>
          <span className={currentPage === "Panduan" ? "text-gray-800" : "text-gray-700"}>Panduan</span>
        </button>
      </nav>
    </aside>
  );
}
