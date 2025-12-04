import { useState } from "react";
import { BookOpen, Download, Search, Plus, ChevronDown, Eye, EyeOff, X, Calendar, User, FileText } from "lucide-react";
import { GuideModal } from "./GuideModal";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "framer-motion";

interface ThesisStudent {
  id: number;
  nama: string;
  nrp: string;
  judulInd: string;
  judulEng: string;
  laboratorium: string;
  status: string;
  pembimbing: string;
  semester: string;
  statusDetail: string;
  periodeSidang: string;
  jenisSidang: string;
}

export function TugasAkhirMahasiswa() {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState("Semua Laboratorium");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [selectedPembimbing, setSelectedPembimbing] = useState("Semua Dosen Pembimbing");
  const [selectedSemester, setSelectedSemester] = useState("Semua Semester");
  const [searchQuery, setSearchQuery] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ThesisStudent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    no: true,
    mahasiswa: true,
    judul: true,
    laboratorium: true,
    status: true
  });

  const students: ThesisStudent[] = [
    {
      id: 1,
      nama: "Aditia Athanaa Nada Salasila",
      nrp: "5033211035",
      judulInd: "DINAMIKA TRANSISI PEKERJAAN PETANI SALAK DI DESA WEDI VILLAGE, BOJONEGORO : STUDI KASUS PERUBAHAN PROFESI DAN IMPLIKASINYA BAGI PEMBANGUNAN PEDESAAN",
      judulEng: "DYNAMICS TRANSITION OF SALAK FARMERS WORK IN WEDI VILLAGE, BOJONEGORO : A CASE STUDY OF PROFESSION CHANGES AND THEIR IMPLICATIONS FOR RURAL DEVELOPMENT",
      laboratorium: "RPL",
      status: "Disetujui",
      pembimbing: "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
      semester: "Gasal 2024/2025",
      statusDetail: "Disosialisasikan pada 26/08/2024 (468 hari pengerjaan)",
      periodeSidang: "2024-10-01",
      jenisSidang: "Sidang Akhir"
    },
    {
      id: 2,
      nama: "Calisa Risky Adiguna",
      nrp: "5033211004",
      judulInd: "ANALISIS PERAN WANITA DALAM USAHA TANI DI DESA TAMBAKRIGADING KECAMATAN TIKUNG KABUPATEN LAMONGAN",
      judulEng: "ANALYSIS OF THE ROLE OF WOMEN IN FARMING IN TAMBAKRIGADING VILLAGE, TIKUNG DISTRICT, LAMONGAN REGENCY",
      laboratorium: "KCV",
      status: "Disetujui",
      pembimbing: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
      semester: "Gasal 2024/2025",
      statusDetail: "Disosialisasikan pada 22/08/2024 (468 hari pengerjaan)",
      periodeSidang: "2024-10-03",
      jenisSidang: "Sidang Akhir"
    },
    {
      id: 3,
      nama: "Fatimah Hassanah",
      nrp: "5033211023",
      judulInd: "Upaya Peningkatan Kualitas Hidup Melalui Urban Farming (Studi Kasus Kelompok Tani Urban Farming Kota Bayurangga-Prambanan)",
      judulEng: "Efforts to Improve Quality of Life Through Urban Farming (Case Study of the Bayurangga-Prambanan City Urban Farming Farmers Group)",
      laboratorium: "MCI",
      status: "Disetujui",
      pembimbing: "Dr. Retno Wardani, S.Kom., M.T.",
      semester: "Genap 2024/2025",
      statusDetail: "Disosialisasikan pada 20/08/2024 (405 hari pengerjaan)",
      periodeSidang: "2024-10-05",
      jenisSidang: "Sidang Akhir"
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesLab = selectedLab === "Semua Laboratorium" || student.laboratorium === selectedLab;
    const matchesStatus = selectedStatus === "Semua Status" || student.status === selectedStatus;
    const matchesPembimbing = selectedPembimbing === "Semua Dosen Pembimbing" || student.pembimbing === selectedPembimbing;
    const matchesSemester = selectedSemester === "Semua Semester" || student.semester === selectedSemester;
    const matchesSearch = 
      student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nrp.includes(searchQuery) ||
      student.judulInd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.judulEng.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLab && matchesStatus && matchesPembimbing && matchesSemester && matchesSearch;
  });

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column]
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui":
      case "Diterima":
        return "bg-green-100 text-green-700 border-green-200";
      case "Disosialisasikan":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Ditolak":
        return "bg-red-100 text-red-700 border-red-200";
      case "Menunggu":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleViewDetail = (student: ThesisStudent) => {
    // Implement the logic to view the detail of the student's thesis
    toast.success(`Detail tugas akhir ${student.nama} ditampilkan`);
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">Tugas Akhir Mahasiswa</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="font-[Poppins]">Panduan Penggunaan</span>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Database tugas akhir mahasiswa dari program studi Anda
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Lab Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">Laboratorium</label>
                <select
                  value={selectedLab}
                  onChange={(e) => setSelectedLab(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="Semua Laboratorium">Semua Laboratorium</option>
                  <option value="KCV">KCV</option>
                  <option value="MCI">MCI</option>
                  <option value="RPL">RPL</option>
                  <option value="NCC">NCC</option>
                  <option value="NETICS">NETICS</option>
                  <option value="ALPRO">ALPRO</option>
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
                  <option value="Semua Status">Semua Status</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Menunggu">Menunggu</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Pembimbing Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">Pilih Dosen Pembimbing</label>
                <select
                  value={selectedPembimbing}
                  onChange={(e) => setSelectedPembimbing(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="Semua Dosen Pembimbing">Semua Dosen Pembimbing</option>
                  <option value="Dr. Ahmad Saikhu, S.Kom., M.Kom.">Dr. Ahmad Saikhu, S.Kom., M.Kom.</option>
                  <option value="Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.">Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.</option>
                  <option value="Dr. Retno Wardani, S.Kom., M.T.">Dr. Retno Wardani, S.Kom., M.T.</option>
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Semester Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">Semester Ajuan</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="Semua Semester">Semua Semester</option>
                  <option value="Gasal 2024/2025">Gasal 2024/2025</option>
                  <option value="Genap 2024/2025">Genap 2024/2025</option>
                  <option value="Gasal 2023/2024">Gasal 2023/2024</option>
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-[Roboto] text-sm">
                  <Download className="w-4 h-4" />
                  Excel
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowColumnSelector(!showColumnSelector)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Tampilkan
                  </button>
                  {showColumnSelector && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
                      <div className="space-y-2">
                        {Object.entries(visibleColumns).map(([key, value]) => (
                          <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => toggleColumn(key as keyof typeof visibleColumns)}
                              className="w-4 h-4 text-blue-500 rounded"
                            />
                            <span className="text-sm font-[Roboto] text-gray-700 capitalize">
                              {key === "no" ? "No." : key === "mahasiswa" ? "Mahasiswa" : key}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm w-64"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleColumns.no && (
                      <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">No.</th>
                    )}
                    {visibleColumns.mahasiswa && (
                      <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Mahasiswa</th>
                    )}
                    {visibleColumns.judul && (
                      <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Judul</th>
                    )}
                    {visibleColumns.laboratorium && (
                      <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Laboratorium</th>
                    )}
                    {visibleColumns.status && (
                      <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Status</th>
                    )}
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
                        {visibleColumns.no && (
                          <td className="px-4 py-4 text-sm text-gray-700 font-[Roboto]">{index + 1}.</td>
                        )}
                        {visibleColumns.mahasiswa && (
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-800 font-[Poppins] font-medium">{student.nama}</p>
                            <p className="text-xs text-gray-500 font-[Roboto]">{student.nrp}</p>
                          </td>
                        )}
                        {visibleColumns.judul && (
                          <td className="px-4 py-4 max-w-lg">
                            <div className={`inline-block px-2 py-1 rounded text-xs mb-2 font-[Roboto] ${getStatusColor(student.status)}`}>
                              {student.status}
                            </div>
                            <p className="text-sm text-gray-800 font-[Poppins] mb-1">{student.judulInd}</p>
                            <p className="text-xs text-gray-500 font-[Roboto] italic">{student.judulEng}</p>
                          </td>
                        )}
                        {visibleColumns.laboratorium && (
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-[Roboto] border border-blue-200">
                              {student.laboratorium}
                            </span>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-800 font-[Roboto]">{student.statusDetail}</p>
                          </td>
                        )}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleViewDetail(student)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
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
              <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600 font-[Roboto]">10+</p>
                <p className="text-sm text-gray-600 font-[Roboto]">
                  Menampilkan {filteredStudents.length} data
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">
                        Detail Tugas Akhir
                      </h2>
                      <p className="text-sm text-gray-600 font-[Roboto]">
                        Informasi lengkap tugas akhir mahasiswa
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

                {/* Student Info */}
                <div className="bg-gray-50 rounded-lg p-5 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-[Poppins] text-xl">
                      {selectedStudent.nama.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-800 font-[Poppins] font-medium mb-1">
                        {selectedStudent.nama}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 font-[Roboto] mb-2">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {selectedStudent.nrp}
                        </span>
                        <span>•</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border border-blue-200">
                          {selectedStudent.laboratorium}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-[Roboto] border ${getStatusColor(selectedStudent.status)}`}>
                          {selectedStudent.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thesis Details */}
                <div className="space-y-5">
                  {/* Judul Indonesia */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                      Judul (Bahasa Indonesia)
                    </label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 font-[Poppins]">
                        {selectedStudent.judulInd}
                      </p>
                    </div>
                  </div>

                  {/* Judul English */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                      Judul (English)
                    </label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 font-[Poppins] italic">
                        {selectedStudent.judulEng}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Pembimbing */}
                    <div>
                      <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                        Dosen Pembimbing
                      </label>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-800 font-[Roboto]">
                          {selectedStudent.pembimbing}
                        </p>
                      </div>
                    </div>

                    {/* Semester */}
                    <div>
                      <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                        Semester Ajuan
                      </label>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-800 font-[Roboto] flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {selectedStudent.semester}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Detail */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                      Status Detail
                    </label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 font-[Roboto]">
                        {selectedStudent.statusDetail}
                      </p>
                    </div>
                  </div>

                  {/* Period Sidang */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                      Periode Sidang
                    </label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedStudent.periodeSidang}
                      </p>
                    </div>
                  </div>

                  {/* Jenis Sidang */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                      Jenis Sidang
                    </label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedStudent.jenisSidang}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-[Roboto] text-sm"
                  >
                    Tutup
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
        title="Panduan Penggunaan - Tugas Akhir Mahasiswa"
        steps={[
          {
            title: "Database Tugas Akhir",
            description: "Halaman ini menampilkan database lengkap tugas akhir mahasiswa dari program studi Anda. Informasi yang ditampilkan meliputi nama mahasiswa, NRP, judul tugas akhir (dalam Bahasa Indonesia dan Inggris), laboratorium, status, dan detail timeline pengerjaan.",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2UlMjBzZXR0aW5nc3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Filter dan Pencarian",
            description: "Gunakan filter untuk menyaring data berdasarkan laboratorium, status, dosen pembimbing, dan semester ajuan. Kolom pencarian membantu Anda menemukan mahasiswa atau topik tertentu dengan cepat berdasarkan nama, NRP, atau kata kunci dalam judul.",
            imageUrl: "https://images.unsplash.com/photo-1708320254298-109008440fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWx0ZXIlMjBzZWFyY2glMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzYzNjM5MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Export dan Tampilan Kolom",
            description: "Klik tombol 'Excel' untuk mengekspor data ke spreadsheet. Gunakan tombol 'Tampilkan' untuk mengatur kolom mana yang ingin ditampilkan atau disembunyikan. Ini membantu Anda fokus pada informasi yang paling relevan dengan kebutuhan Anda.",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmVzcyUyMHRyYWNraW5nfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Status dan Timeline",
            description: "Status tugas akhir ditandai dengan label berwarna: hijau untuk 'Disetujui', kuning untuk 'Menunggu', dan merah untuk 'Ditolak'. Kolom status detail menampilkan informasi kapan tugas akhir disosialisasikan dan berapa lama waktu pengerjaan yang telah berlalu.",
            imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0JTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]}
      />
    </>
  );
}