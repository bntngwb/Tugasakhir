import { useState } from "react";
import { BookOpen, Download, Search, X, ChevronDown } from "lucide-react";
import { GuideModal } from "./GuideModal";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface Student {
  id: number;
  nrp: string;
  nama: string;
  lab: string;
  judulTA: string;
  judulTAEn: string;
  periodeSidang: string;
  jenisSidang: string;
  hasil: string;
  nilai: string;
  supervisors: {
    pembimbing1: { nama: string; hadir: boolean | null };
    pembimbing2?: { nama: string; hadir: boolean | null };
    penguji1: { nama: string; hadir: boolean | null };
  };
}

export function RekapitulasiNilai() {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("Gasal 2025/2026 (Aktif)");
  const [selectedJenis, setSelectedJenis] = useState("Sidang Proposal");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form data for modal
  const [modalData, setModalData] = useState({
    hasil: "",
    supervisorAttendance: {
      pembimbing1: null as boolean | null,
      pembimbing2: null as boolean | null,
      penguji1: null as boolean | null,
    }
  });

  const students: Student[] = [
    {
      id: 1,
      nrp: "5033221024",
      nama: "AINA NUR NABIBAH",
      lab: "Studi Pembangunan",
      judulTA: "Motivasi Yang Melatarbelakangi Peran Masyarakat Dalam Pengembangan Wisata Bahari Di Taman Hiburan Pantai Kenjeran Surabaya",
      judulTAEn: "Motivation Background The Role Of The Community In The Development Of Marital Tourism In The Kenjeran Beach Amusement Park, Surabaya",
      periodeSidang: "Seminar Proposal - Gasal 2025 (I)",
      jenisSidang: "Sidang Proposal",
      hasil: "Diterima dengan revisi minor",
      nilai: "81.98 (AB)",
      supervisors: {
        pembimbing1: { nama: "Drs. Zainul Muhibbin, M.Fil.I", hadir: true },
        penguji1: { nama: "Drs. Mohammad Saifulloh, M.Fil.I", hadir: true }
      }
    },
    {
      id: 2,
      nrp: "5033221061",
      nama: "AISYI IZZAN FIRDAUS",
      lab: "Studi Pembangunan",
      judulTA: "IMPLEMENTASI KEBIJAKAN INFRASTRUKTUR HALTE TRANSPORTASI DARAT DI KOTA SURABAYA BERBASIS TRANSIT ORIENTED DEVELOPMENT (TOD)",
      judulTAEn: "IMPLEMENTATION OF LAND TRANSPORTATION STOP INFRASTRUCTURE POLICY IN SURABAYA CITY BASED ON TRANSIT ORIENTED DEVELOPMENT",
      periodeSidang: "Seminar Proposal - Gasal 2025 (I)",
      jenisSidang: "Sidang Proposal",
      hasil: "Diterima dengan revisi mayor",
      nilai: "81.03 (AB)",
      supervisors: {
        pembimbing1: { nama: "Dr. Ahmad Saikhu, S.Kom., M.Kom.", hadir: null },
        penguji1: { nama: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.", hadir: null }
      }
    }
  ];

  const filteredStudents = students.filter(student =>
    (student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nrp.includes(searchQuery) ||
    student.judulTA.toLowerCase().includes(searchQuery.toLowerCase())) &&
    student.jenisSidang === selectedJenis
  );

  const getHasilColor = (hasil: string) => {
    if (hasil.includes("Diterima dengan revisi minor")) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    } else if (hasil.includes("revisi mayor")) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    } else if (hasil.includes("Diterima")) {
      return "bg-green-100 text-green-700 border-green-200";
    } else if (hasil.includes("Ditolak")) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const openAttendanceModal = (student: Student) => {
    setSelectedStudent(student);
    setModalData({
      hasil: student.hasil || "",
      supervisorAttendance: {
        pembimbing1: student.supervisors.pembimbing1.hadir,
        pembimbing2: student.supervisors.pembimbing2?.hadir || null,
        penguji1: student.supervisors.penguji1.hadir,
      }
    });
    setIsModalOpen(true);
  };

  const handleSubmitAttendance = () => {
    if (!modalData.hasil) {
      toast.error("Mohon pilih hasil akhir sidang!");
      return;
    }
    
    // Check if all attendance is filled
    const allFilled = modalData.supervisorAttendance.pembimbing1 !== null &&
                     modalData.supervisorAttendance.penguji1 !== null;
    
    if (!allFilled) {
      toast.error("Mohon tentukan kehadiran semua dosen!");
      return;
    }

    toast.success("Kelulusan sidang dan kehadiran dosen berhasil disimpan");
    setIsModalOpen(false);
  };

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">Rekapitulasi Nilai Sidang</h1>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-[Poppins]">Panduan Penggunaan</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Lihat dan kelola rekapitulasi nilai sidang mahasiswa
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-[Roboto] text-sm">
                <Download className="w-4 h-4" />
                Download Excel
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Semester Filter */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-[Roboto]">Semester Sidang</label>
                <div className="relative">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                  >
                    <option value="Gasal 2025/2026 (Aktif)">Gasal 2025/2026 (Aktif)</option>
                    <option value="Genap 2024/2025">Genap 2024/2025</option>
                    <option value="Gasal 2024/2025">Gasal 2024/2025</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Jenis Sidang Filter */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-[Roboto]">Jenis Sidang</label>
                <div className="relative">
                  <select
                    value={selectedJenis}
                    onChange={(e) => setSelectedJenis(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                  >
                    <option value="Sidang Proposal">Sidang Proposal</option>
                    <option value="Sidang Tugas Akhir">Sidang Tugas Akhir</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">No.</th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Mahasiswa</th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Judul</th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Periode Sidang</th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Hasil dan Kehadiran Sidang</th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <p className="text-gray-500 font-[Roboto]">Tidak ada data yang ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-700 font-[Roboto]">{index + 1}.</td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-gray-800 font-[Poppins] font-medium">{student.nama}</p>
                            <p className="text-xs text-gray-500 font-[Roboto]">{student.nrp}</p>
                            <p className="text-xs text-gray-500 font-[Roboto]">Lab : {student.lab}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-md">
                          <div className={`inline-block px-2 py-1 rounded text-xs mb-2 font-[Roboto] ${getHasilColor(student.hasil)}`}>
                            {student.hasil}
                          </div>
                          <p className="text-sm text-gray-800 font-[Poppins] mb-1">{student.judulTA}</p>
                          <p className="text-xs text-gray-500 font-[Roboto] italic">{student.judulTAEn}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 font-[Roboto]">{student.periodeSidang}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => openAttendanceModal(student)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm text-gray-700"
                          >
                            Hasil & Kehadiran
                          </button>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 font-[Poppins] font-medium">{student.nilai}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredStudents.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600 font-[Roboto]">
                  10+
                </p>
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

      {/* Attendance Modal */}
      <AnimatePresence>
        {isModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-800 font-[Poppins]">
                    Kelulusan Sidang dan Kehadiran Dosen
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 font-[Roboto] mb-6">
                  Tentukan hasil akhir dari sidang mahasiswa yang bersangkutan.
                </p>

                {/* Hasil Options */}
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setModalData({ ...modalData, hasil: "Diterima" })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        modalData.hasil === "Diterima"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          modalData.hasil === "Diterima" ? "border-green-500" : "border-gray-300"
                        }`}>
                          {modalData.hasil === "Diterima" && (
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">Diterima</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setModalData({ ...modalData, hasil: "Diterima dengan revisi minor" })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        modalData.hasil === "Diterima dengan revisi minor"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          modalData.hasil === "Diterima dengan revisi minor" ? "border-blue-500" : "border-gray-300"
                        }`}>
                          {modalData.hasil === "Diterima dengan revisi minor" && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">Diterima dengan revisi minor</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setModalData({ ...modalData, hasil: "Diterima dengan revisi mayor" })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        modalData.hasil === "Diterima dengan revisi mayor"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          modalData.hasil === "Diterima dengan revisi mayor" ? "border-orange-500" : "border-gray-300"
                        }`}>
                          {modalData.hasil === "Diterima dengan revisi mayor" && (
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">Diterima dengan revisi mayor</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setModalData({ ...modalData, hasil: "Ditolak" })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        modalData.hasil === "Ditolak"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          modalData.hasil === "Ditolak" ? "border-red-500" : "border-gray-300"
                        }`}>
                          {modalData.hasil === "Ditolak" && (
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">Ditolak</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 font-[Roboto]">
                    <strong>Tentukan kehadiran dosen pada sidang ini.</strong> Kehadiran akan mempengaruhi perhitungan nilai akhir
                  </p>
                </div>

                {/* Supervisor Attendance Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">No.</th>
                        <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Nama</th>
                        <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">Jenis Dosen</th>
                        <th className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-700">Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">1.</td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">{selectedStudent.supervisors.pembimbing1.nama}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">Pembimbing 1</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="pembimbing1"
                                checked={modalData.supervisorAttendance.pembimbing1 === true}
                                onChange={() => setModalData({
                                  ...modalData,
                                  supervisorAttendance: { ...modalData.supervisorAttendance, pembimbing1: true }
                                })}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">Hadir</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="pembimbing1"
                                checked={modalData.supervisorAttendance.pembimbing1 === false}
                                onChange={() => setModalData({
                                  ...modalData,
                                  supervisorAttendance: { ...modalData.supervisorAttendance, pembimbing1: false }
                                })}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">Tidak hadir</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                      
                      {selectedStudent.supervisors.pembimbing2 && (
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">2.</td>
                          <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">{selectedStudent.supervisors.pembimbing2.nama}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">Pembimbing 2</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="pembimbing2"
                                  checked={modalData.supervisorAttendance.pembimbing2 === true}
                                  onChange={() => setModalData({
                                    ...modalData,
                                    supervisorAttendance: { ...modalData.supervisorAttendance, pembimbing2: true }
                                  })}
                                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm font-[Roboto] text-gray-700">Hadir</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="pembimbing2"
                                  checked={modalData.supervisorAttendance.pembimbing2 === false}
                                  onChange={() => setModalData({
                                    ...modalData,
                                    supervisorAttendance: { ...modalData.supervisorAttendance, pembimbing2: false }
                                  })}
                                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm font-[Roboto] text-gray-700">Tidak hadir</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">{selectedStudent.supervisors.pembimbing2 ? "3." : "2."}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">{selectedStudent.supervisors.penguji1.nama}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">Penguji 1</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="penguji1"
                                checked={modalData.supervisorAttendance.penguji1 === true}
                                onChange={() => setModalData({
                                  ...modalData,
                                  supervisorAttendance: { ...modalData.supervisorAttendance, penguji1: true }
                                })}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">Hadir</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="penguji1"
                                checked={modalData.supervisorAttendance.penguji1 === false}
                                onChange={() => setModalData({
                                  ...modalData,
                                  supervisorAttendance: { ...modalData.supervisorAttendance, penguji1: false }
                                })}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">Tidak hadir</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-[Roboto] text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitAttendance}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
                  >
                    Simpan
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
        title="Panduan Penggunaan - Rekapitulasi Nilai"
        steps={[
          {
            title: "Daftar Nilai Sidang",
            description: "Halaman ini menampilkan rekapitulasi nilai sidang mahasiswa. Gunakan filter semester dan jenis sidang untuk melihat data yang spesifik. Anda dapat mencari mahasiswa berdasarkan nama, NRP, atau judul tugas akhir menggunakan kolom pencarian.",
            imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnQlMjBib2FyZHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Hasil dan Kehadiran Sidang",
            description: "Klik tombol 'Hasil & Kehadiran' untuk mencatat hasil sidang dan kehadiran dosen. Pilih salah satu dari 4 opsi hasil: Diterima, Diterima dengan revisi minor, Diterima dengan revisi mayor, atau Ditolak. Tentukan juga kehadiran setiap dosen penguji dan pembimbing.",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2UlMjBzZXR0aW5nc3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Download Excel",
            description: "Gunakan tombol 'Download Excel' untuk mengekspor data rekapitulasi nilai ke dalam format spreadsheet. File Excel akan berisi semua informasi sidang termasuk nama mahasiswa, judul, hasil sidang, dan nilai akhir.",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmVzcyUyMHRyYWNraW5nfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Interpretasi Nilai",
            description: "Nilai ditampilkan dalam format angka dan huruf (misalnya: 81.98 (AB)). Warna label hasil sidang menunjukkan status: hijau untuk 'Diterima', biru untuk 'revisi minor', oranye untuk 'revisi mayor', dan merah untuk 'Ditolak'. Pastikan semua nilai sudah dicatat dengan benar sebelum periode sidang berakhir.",
            imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwZGVzayUyMGxhcHRvcHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]}
      />
    </>
  );
}