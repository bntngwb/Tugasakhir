import { useState } from "react";
import { BookOpen, Download, Search, ChevronDown, ArrowLeft, User, X } from "lucide-react";
import { GuideModal } from "./GuideModal";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface StudentProposal {
  id: number;
  nama: string;
  nrp: string;
  judulInd: string;
  judulEng: string;
  supervisor1?: string;
  supervisor2?: string;
  status: "Belum Dialokasikan" | "Menunggu Persetujuan Dospem 1" | "Menunggu Dospem 2";
  statusBadge: string;
  submittedDate: string;
}

export function AlokasiPembimbing() {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState("S1 Studi Pembangunan");
  const [selectedDosen, setSelectedDosen] = useState("Semua Dosen");
  const [selectedStatus, setSelectedStatus] = useState("Belum Dialokasikan");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProposal | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Form state for modal
  const [formData, setFormData] = useState({
    supervisor1: "",
    supervisor2: ""
  });

  const students: StudentProposal[] = [
    {
      id: 1,
      nama: "SHEVA GESTOMEDI",
      nrp: "09311940000008",
      judulInd: "Dampak Sosial, Ekonomi, dan Lingkungan dalam Implementasi Wisata Berkelanjutan di Pantai Goa Cina Kabupaten Malang",
      judulEng: "Social, Economic, and Environmental Impacts in the Implementation of Sustainable Tourism at Goa Cina Beach, Malang Regency",
      supervisor1: "Dr. Tony Hanoraga, SH., M.Hum. (Kandidat 1)",
      supervisor2: undefined,
      status: "Menunggu Dospem 2",
      statusBadge: "Menunggu Pembimbing 2",
      submittedDate: "21 November 2025 (1 minggu yang lalu)"
    },
    {
      id: 2,
      nama: "AHMAD FAJAR SIDIQ",
      nrp: "09311940000015",
      judulInd: "Analisis Dampak Pembangunan Infrastruktur terhadap Kesejahteraan Masyarakat Desa",
      judulEng: "Analysis of Infrastructure Development Impact on Rural Community Welfare",
      supervisor1: undefined,
      supervisor2: undefined,
      status: "Belum Dialokasikan",
      statusBadge: "Belum Dialokasikan",
      submittedDate: "18 November 2025 (10 hari yang lalu)"
    },
    {
      id: 3,
      nama: "SITI NURHALIZA",
      nrp: "09311940000022",
      judulInd: "Strategi Pemberdayaan UMKM dalam Meningkatkan Ekonomi Lokal",
      judulEng: "Empowerment Strategy of MSMEs in Improving Local Economy",
      supervisor1: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D. (Kandidat 1)",
      supervisor2: undefined,
      status: "Menunggu Persetujuan Dospem 1",
      statusBadge: "Menunggu Persetujuan Pembimbing 1",
      submittedDate: "15 November 2025 (2 minggu yang lalu)"
    }
  ];

  const dosenList = [
    "Semua Dosen",
    "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
    "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
    "Dr. Retno Wardani, S.Kom., M.T.",
    "Fajar Pradana, S.Kom., M.Kom.",
    "Dr. Rizal Fathoni, S.Kom., M.T.",
    "Dr. Tony Hanoraga, SH., M.Hum."
  ];

  const filteredStudents = students.filter(student => {
    const matchesProdi = true; // For now, all match
    const matchesDosen = selectedDosen === "Semua Dosen" || 
                         student.supervisor1?.includes(selectedDosen) || 
                         student.supervisor2?.includes(selectedDosen);
    const matchesStatus = student.statusBadge === selectedStatus || selectedStatus === "Belum Dialokasikan";
    const matchesSearch = student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.nrp.includes(searchQuery) ||
                          student.judulInd.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesProdi && matchesDosen && matchesStatus && matchesSearch;
  });

  const handleViewDetail = (student: StudentProposal) => {
    setSelectedStudent(student);
    setFormData({
      supervisor1: student.supervisor1 || "",
      supervisor2: student.supervisor2 || ""
    });
    setIsDetailModalOpen(true);
  };

  const handleSaveSupervisors = () => {
    if (!formData.supervisor1) {
      toast.error("Pembimbing 1 harus diisi!");
      return;
    }

    toast.success("Perubahan pembimbing berhasil disimpan");
    setIsDetailModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Belum")) {
      return "bg-gray-100 text-gray-700 border-gray-200";
    } else if (status.includes("Menunggu")) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    } else if (status.includes("Disetujui")) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">Alokasi Pembimbing</h1>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-[Poppins]">Panduan Penggunaan</span>
              </button>
            </div>
          </div>

          {/* Tab */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-[Roboto] text-sm font-medium">
                Lingkup Prodi
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Program Studi Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">Program Studi</label>
                <select
                  value={selectedProdi}
                  onChange={(e) => setSelectedProdi(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="S1 Studi Pembangunan">S1 Studi Pembangunan</option>
                  <option value="S2 Studi Pembangunan">S2 Studi Pembangunan</option>
                  <option value="S3 Studi Pembangunan">S3 Studi Pembangunan</option>
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Dosen Kandidat Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">Dosen Kandidat 1</label>
                <select
                  value={selectedDosen}
                  onChange={(e) => setSelectedDosen(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  {dosenList.map(dosen => (
                    <option key={dosen} value={dosen}>{dosen}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="Belum Dialokasikan">Belum Dialokasikan</option>
                  <option value="Menunggu Persetujuan Pembimbing 1">Menunggu Persetujuan Pembimbing 1</option>
                  <option value="Menunggu Pembimbing 2">Menunggu Pembimbing 2</option>
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Download Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-[Roboto] text-sm">
              <Download className="w-4 h-4" />
              Download Excel
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">No.</th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Mahasiswa</th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Judul Usulan</th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Dosen</th>
                    <th className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <p className="text-gray-500 font-[Roboto]">Tidak ada data yang ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-700 font-[Roboto]">{index + 1}.</td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-800 font-[Poppins] font-medium">{student.nama}</p>
                          <p className="text-xs text-gray-500 font-[Roboto]">{student.nrp}</p>
                        </td>
                        <td className="px-4 py-4 max-w-md">
                          <div className={`inline-block px-2 py-1 rounded text-xs mb-2 font-[Roboto] border ${getStatusColor(student.statusBadge)}`}>
                            {student.statusBadge}
                          </div>
                          <p className="text-sm text-gray-800 font-[Poppins] mb-1">{student.judulInd}</p>
                          <p className="text-xs text-gray-500 font-[Roboto] italic">{student.judulEng}</p>
                        </td>
                        <td className="px-4 py-4">
                          {student.supervisor1 && (
                            <p className="text-sm text-gray-800 font-[Roboto] mb-1">{student.supervisor1}</p>
                          )}
                          {student.supervisor2 && (
                            <p className="text-sm text-gray-600 font-[Roboto]">{student.supervisor2}</p>
                          )}
                          {!student.supervisor1 && !student.supervisor2 && (
                            <p className="text-sm text-gray-400 font-[Roboto]">-</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleViewDetail(student)}
                              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm"
                            >
                              Lihat
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredStudents.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 font-[Roboto]">
                  Menampilkan halaman 1 dari 1
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-[Roboto]">
              © 2021-2025 Institut Teknologi Sepuluh Nopember
            </p>
          </footer>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedStudent && (
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
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="text-xl text-gray-800 font-[Poppins]">
                    Detail Usulan Tugas Akhir
                  </h2>
                </div>

                {/* Student Info */}
                <div className="bg-gray-50 rounded-lg p-5 mb-6">
                  <h3 className="text-sm text-gray-600 font-[Roboto] mb-3">Mahasiswa</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-[Poppins]">
                      {selectedStudent.nama.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-gray-800 font-[Poppins] font-medium">{selectedStudent.nama}</p>
                      <p className="text-sm text-gray-600 font-[Roboto]">{selectedStudent.nrp}</p>
                    </div>
                  </div>
                </div>

                {/* Proposal Details */}
                <div className="space-y-5 mb-6">
                  {/* Judul */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">Judul</label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 font-[Poppins] mb-2">{selectedStudent.judulInd}</p>
                      <p className="text-sm text-gray-600 font-[Roboto] italic">{selectedStudent.judulEng}</p>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">Berkelompok</label>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-800 font-[Roboto]">Tidak</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">Diajukan pada</label>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-800 font-[Roboto]">{selectedStudent.submittedDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Bimbingan */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">Keterangan Bimbingan</label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        Saya sudah melakukan bimbingan tugas akhir 16 kali
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rencana Penelitian */}
                <div className="mb-6">
                  <h3 className="text-sm text-gray-700 font-[Poppins] mb-3">Rencana Penelitian</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <p className="text-sm text-gray-700 font-[Roboto] leading-relaxed">
                      Keindahan alam Jawa Timur yang berlomba-lomba dalam mengelola keindahan alam menjadi tempat wisata alam. Banyak daerah di Jawa Timur berlomba-lomba dalam mengelola keindahan alam untuk dijadikan tempat wisata. Salah satu wilayah di kabupaten Malang yang menjadi destinasi wisata yaitu Pantai Goa Cina. Pantai ini cukup populer di Kabupaten Malang karena selain cukup mudah dijangkau, pantai Goa Cina Malang menawarkan panorama yang sangat eksotis, namun bagus pula bagaimana pengelolaan seperti prinsip wisata berkelanjutan. Untuk mengetahui pengimplementasian kebijakan harus diketahui apakah pemerintah daerah setempat menciptakan peluang dan tantangan yang ada serta keuntungan target kebijakan yaitu juga masyarakat sekitar, oleh karena itu penelitian ini akan melakukan evaluasi dengan fokus pada sektor dampak ekonomi, pendapatan lokal, hiiangan budaya lokal. Untuk mengetahui bagaimana implementasi berlangsung metode yang digunakan yaitu melakukan wawancara kepada pihak terkait dengan menggunakan melakukan analisis dengan melakukan wawancara kepada oihak terkait dengan melakukan...
                    </p>
                  </div>
                </div>

                {/* Supervisor Selection */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                  <h3 className="text-sm text-gray-700 font-[Poppins] mb-4">Ubah Pembimbing</h3>
                  
                  <div className="space-y-4">
                    {/* Pembimbing 1 */}
                    <div>
                      <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                        Pembimbing 1 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.supervisor1}
                        onChange={(e) => setFormData({ ...formData, supervisor1: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                      >
                        <option value="">Pilih Dosen Pembimbing 1</option>
                        {dosenList.filter(d => d !== "Semua Dosen").map(dosen => (
                          <option key={dosen} value={dosen}>{dosen}</option>
                        ))}
                      </select>
                    </div>

                    {/* Pembimbing 2 */}
                    <div>
                      <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                        Pembimbing 2
                      </label>
                      <select
                        value={formData.supervisor2}
                        onChange={(e) => setFormData({ ...formData, supervisor2: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                      >
                        <option value="">Pilih Dosen Pembimbing 2 (Opsional)</option>
                        {dosenList.filter(d => d !== "Semua Dosen").map(dosen => (
                          <option key={dosen} value={dosen}>{dosen}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-[Roboto] text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveSupervisors}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
                  >
                    Simpan Perubahan
                  </button>
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
        title="Panduan Penggunaan - Alokasi Pembimbing"
        steps={[
          {
            title: "Alokasi Pembimbing",
            description: "Halaman ini digunakan untuk mengalokasikan dosen pembimbing kepada mahasiswa yang telah mengajukan usulan topik tugas akhir. Anda dapat melihat mahasiswa yang belum memiliki pembimbing, atau yang pembimbingnya perlu diubah.",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2UlMjBzZXR0aW5nc3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Filter dan Pencarian",
            description: "Gunakan filter untuk menyaring berdasarkan program studi, dosen kandidat, dan status alokasi. Status 'Belum Dialokasikan' menunjukkan mahasiswa yang belum memiliki pembimbing sama sekali. 'Menunggu Persetujuan' berarti pembimbing sudah ditunjuk tapi belum menyetujui.",
            imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnQlMjBib2FyZHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Melihat Detail dan Mengubah Pembimbing",
            description: "Klik tombol 'Lihat' untuk melihat detail usulan tugas akhir mahasiswa. Di halaman detail, Anda dapat mengubah atau menambahkan dosen pembimbing 1 dan pembimbing 2. Pembimbing 1 wajib diisi, sedangkan pembimbing 2 opsional.",
            imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMG1lZXRpbmd8ZW58MHx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Menyimpan Perubahan",
            description: "Setelah memilih dosen pembimbing, klik 'Simpan Perubahan' untuk mengalokasikan pembimbing kepada mahasiswa. Sistem akan mengirimkan notifikasi kepada dosen yang ditunjuk untuk memberikan persetujuan. Pastikan memilih dosen yang sesuai dengan bidang keahlian dan ketersediaan kuota bimbingan.",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmVzcyUyMHRyYWNraW5nfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]}
      />
    </>
  );
}