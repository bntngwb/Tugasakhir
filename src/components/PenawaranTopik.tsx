import { Search, ChevronLeft, ChevronRight, BookOpen, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GuideModal } from "./GuideModal";

interface Topic {
  id: number;
  title: string;
  supervisor: string;
  supervisor2?: string;
  category: string;
  status: "Tersedia" | "Diambil";
  description: string;
  minimalKnowledge: string[];
  interestedStudents: string[];
}

const mockTopics: Topic[] = [
  {
    id: 1,
    title: "Implementasi Machine Learning untuk Deteksi Penyakit Tanaman",
    supervisor: "Dr. Ahmad Hidayat, S.T., M.T.",
    supervisor2: "Dr. Rina Wijaya, M.Kom.",
    category: "KCV",
    status: "Tersedia",
    description: "Penelitian ini bertujuan untuk mengembangkan sistem deteksi penyakit tanaman menggunakan teknik machine learning, khususnya deep learning dengan arsitektur CNN. Sistem akan mampu mengidentifikasi berbagai jenis penyakit pada tanaman berdasarkan citra daun.",
    minimalKnowledge: [
      "Pemrograman Python",
      "Dasar Machine Learning",
      "Computer Vision",
      "TensorFlow atau PyTorch"
    ],
    interestedStudents: ["Muhammad Rizki (5025201001)", "Siti Aminah (5025201015)"]
  },
  {
    id: 2,
    title: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
    supervisor: "Prof. Dr. Ir. Siti Nurjanah, M.Kom.",
    category: "MCI",
    status: "Tersedia",
    description: "Pengembangan sistem informasi manajemen perpustakaan yang komprehensif dengan fitur peminjaman, pengembalian, katalog digital, dan analitik penggunaan perpustakaan.",
    minimalKnowledge: [
      "Pemrograman Web (HTML, CSS, JavaScript)",
      "Database Management",
      "Framework Web (React/Vue/Angular)",
      "RESTful API"
    ],
    interestedStudents: []
  },
  {
    id: 3,
    title: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia",
    supervisor: "Dr. Budi Santoso, S.Kom., M.T.",
    supervisor2: "Dr. Lisa Permata, S.T., M.T.",
    category: "RPL",
    status: "Diambil",
    description: "Aplikasi mobile untuk membantu monitoring kesehatan lansia secara real-time dengan fitur tracking vital signs, reminder obat, dan koneksi dengan keluarga dan tenaga medis.",
    minimalKnowledge: [
      "Mobile Programming (Flutter/React Native)",
      "UI/UX Design",
      "Database",
      "API Integration"
    ],
    interestedStudents: ["Ahmad Fauzi (5025201020)"]
  },
  {
    id: 4,
    title: "Analisis Sentimen Media Sosial Menggunakan Deep Learning",
    supervisor: "Dr. Ahmad Hidayat, S.T., M.T.",
    category: "KCV",
    status: "Tersedia",
    description: "Penelitian untuk menganalisis sentimen publik dari data media sosial menggunakan teknik Natural Language Processing dan Deep Learning untuk mendapatkan insight dari opini masyarakat.",
    minimalKnowledge: [
      "Pemrograman Python",
      "Natural Language Processing",
      "Deep Learning",
      "Data Mining"
    ],
    interestedStudents: ["Dewi Kartika (5025201008)"]
  },
  {
    id: 5,
    title: "Pengembangan Sistem E-Commerce dengan Microservices",
    supervisor: "Ir. Dewi Lestari, M.Sc.",
    supervisor2: "Dr. Hendra Wijaya, M.T.",
    category: "NCC",
    status: "Tersedia",
    description: "Membangun platform e-commerce modern dengan arsitektur microservices untuk meningkatkan skalabilitas dan maintainability sistem.",
    minimalKnowledge: [
      "Backend Development",
      "Microservices Architecture",
      "Docker & Kubernetes",
      "Database Design"
    ],
    interestedStudents: []
  },
  {
    id: 6,
    title: "Implementasi Blockchain untuk Supply Chain Management",
    supervisor: "Prof. Dr. Ir. Siti Nurjanah, M.Kom.",
    supervisor2: "Dr. Bambang Susilo, M.Kom.",
    category: "NETICS",
    status: "Diambil",
    description: "Penelitian implementasi teknologi blockchain untuk meningkatkan transparansi dan traceability dalam supply chain management.",
    minimalKnowledge: [
      "Blockchain Technology",
      "Smart Contracts",
      "Distributed Systems",
      "Pemrograman (JavaScript/Solidity)"
    ],
    interestedStudents: ["Andi Wijaya (5025201012)"]
  },
  {
    id: 7,
    title: "Aplikasi IoT untuk Smart Home Automation",
    supervisor: "Dr. Budi Santoso, S.Kom., M.T.",
    category: "NCC",
    status: "Tersedia",
    description: "Pengembangan sistem smart home yang terintegrasi menggunakan IoT devices untuk otomasi rumah, kontrol suhu, pencahayaan, dan keamanan.",
    minimalKnowledge: [
      "Internet of Things (IoT)",
      "Embedded Systems",
      "Mobile/Web Development",
      "Networking"
    ],
    interestedStudents: ["Rini Susanti (5025201025)", "Bayu Aditya (5025201030)"]
  },
  {
    id: 8,
    title: "Sistem Rekomendasi Film Menggunakan Collaborative Filtering",
    supervisor: "Dr. Ahmad Hidayat, S.T., M.T.",
    category: "ALPRO",
    status: "Tersedia",
    description: "Membangun sistem rekomendasi film yang personal menggunakan algoritma collaborative filtering dan content-based filtering untuk memberikan rekomendasi yang akurat kepada pengguna.",
    minimalKnowledge: [
      "Algoritma dan Struktur Data",
      "Machine Learning",
      "Pemrograman Python",
      "Data Analysis"
    ],
    interestedStudents: []
  }
];

interface PenawaranTopikProps {
  onTopicSelect?: (topic: Topic) => void;
}

export function PenawaranTopik({ onTopicSelect }: PenawaranTopikProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [selectedSupervisor, setSelectedSupervisor] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const itemsPerPage = 5;

  // Get unique categories and supervisors
  const categories = ["Semua", ...Array.from(new Set(mockTopics.map(t => t.category)))];
  const supervisors = ["Semua", ...Array.from(new Set(mockTopics.map(t => t.supervisor)))];

  // Filter topics
  const filteredTopics = mockTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.supervisor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || topic.category === selectedCategory;
    const matchesStatus = selectedStatus === "Semua" || topic.status === selectedStatus;
    const matchesSupervisor = selectedSupervisor === "Semua" || topic.supervisor === selectedSupervisor;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSupervisor;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTopics = filteredTopics.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800 font-[Poppins] text-[24px] font-bold font-normal">Penawaran Topik Tugas Akhir</h1>
            <button 
              onClick={() => setIsGuideModalOpen(true)} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-[Poppins]">Panduan Penggunaan</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 font-[Roboto]">
            Pilih topik tugas akhir yang sesuai dengan minat Anda
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari topik atau dosen pembimbing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters */}
          <div className="w-52 space-y-3">
            {/* Status Filter */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h3 className="font-[Poppins] text-gray-800 mb-2 text-sm">Status</h3>
              <div className="space-y-1.5">
                {["Semua", "Tersedia", "Diambil"].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === status}
                      onChange={() => setSelectedStatus(status)}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-transparent border-gray-300"
                    />
                    <span className="text-sm text-gray-700 font-[Roboto]">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h3 className="font-[Poppins] text-gray-800 mb-2 text-sm">Kategori</h3>
              <div className="space-y-1.5">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-transparent border-gray-300"
                    />
                    <span className="text-sm text-gray-700 font-[Roboto]">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins] w-12">No</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">Judul Topik</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">Dosen Pembimbing</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">Kategori</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">Status</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-700 font-[Poppins]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTopics.map((topic, index) => (
                      <tr key={topic.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          {topic.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          {topic.supervisor}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          {topic.category}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-[Roboto] ${
                            topic.status === "Tersedia" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {topic.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            className={`px-3 py-1 rounded text-xs font-[Roboto] ${
                              topic.status === "Tersedia"
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={topic.status === "Diambil"}
                            onClick={() => onTopicSelect && onTopicSelect(topic)}
                          >
                            {topic.status === "Tersedia" ? "Pilih" : "Tidak Tersedia"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600 font-[Roboto]">
                  Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredTopics.length)} dari {filteredTopics.length} topik
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded text-sm font-[Roboto] ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
        </footer>
      </div>
    </main>

    {/* Guide Modal */}
    <GuideModal
      isOpen={isGuideModalOpen}
      onClose={() => setIsGuideModalOpen(false)}
      title="Panduan Penggunaan - Penawaran Topik"
      steps={[
        {
          title: "Tentang Penawaran Topik",
          description: "Halaman ini menampilkan daftar topik tugas akhir yang ditawarkan oleh dosen pembimbing. Anda dapat mencari dan memilih topik yang sesuai dengan minat dan kemampuan Anda. Sistem ini membantu Anda menemukan topik yang tepat dengan mudah.",
          imageUrl: "https://images.unsplash.com/photo-1596444433591-b172e84a4755?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGxpYnJhcnklMjBzZWFyY2h8ZW58MXx8fHwxNzYzNjM5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Cari & Filter Topik",
          description: "Gunakan kolom pencarian untuk mencari topik berdasarkan judul atau nama dosen pembimbing. Anda juga dapat menggunakan filter Status (Tersedia/Diambil) dan Kategori di sidebar kiri untuk menyaring topik sesuai kriteria yang Anda inginkan.",
          imageUrl: "https://images.unsplash.com/photo-1708320254298-109008440fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWx0ZXIlMjBzZWFyY2glMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzYzNjM5MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Lihat Detail Topik",
          description: "Klik pada topik untuk melihat informasi lengkap termasuk deskripsi penelitian, pengetahuan minimal yang diperlukan, dosen pembimbing, dan daftar mahasiswa yang berminat. Pelajari dengan seksama sebelum memilih topik.",
          imageUrl: "https://images.unsplash.com/photo-1664188613064-7eea761238f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVzaXMlMjByZXNlYXJjaCUyMHRvcGljc3xlbnwxfHx8fDE3NjM2MzkxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Pilih Topik & Status",
          description: "Klik tombol 'Pilih' pada topik yang tersedia (status hijau) untuk memilih topik tersebut. Topik dengan status 'Diambil' (merah) sudah diambil mahasiswa lain dan tidak dapat dipilih. Pastikan Anda memilih topik yang sesuai dengan kemampuan Anda.",
          imageUrl: "https://images.unsplash.com/photo-1620632889724-f1ddc7841c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHByb3ZhbCUyMGNoZWNrbGlzdCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzYzNjM5MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Tips Memilih Topik",
          description: "Pelajari deskripsi dan pengetahuan minimal yang diperlukan sebelum memilih topik. Pastikan topik sesuai dengan minat dan kemampuan Anda. Konsultasikan dengan dosen pembimbing jika ada pertanyaan. Pilih topik yang Anda minati agar proses pengerjaan lebih menyenangkan.",
          imageUrl: "https://images.unsplash.com/photo-1646759967491-1f291f471134?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHdvcmtzcGFjZSUyMGRlc2t8ZW58MXx8fHwxNzYzNjM5MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ]}
    />
    </>
  );
}