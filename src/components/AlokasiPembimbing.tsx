import { useState } from "react";
import { BookOpen, Download, Search, ChevronDown, ArrowLeft } from "lucide-react";
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
  statusBadge: string;
  submittedDate: string;
}

export function AlokasiPembimbing() {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const [selectedProdi, setSelectedProdi] = useState("S1 Studi Pembangunan");
  const [selectedDosen, setSelectedDosen] = useState("Semua Dosen");

  // DEFAULT FILTER MENAMPILKAN SEMUA
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProposal | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // =============================
  // STUDENTS (12 DATA REALISTIS)
  // =============================
  const [students, setStudents] = useState<StudentProposal[]>([
    {
      id: 1,
      nama: "SHEVA GESTOMEDI",
      nrp: "09311940000008",
      judulInd:
        "Dampak Sosial, Ekonomi, dan Lingkungan dalam Implementasi Wisata Berkelanjutan di Pantai Goa Cina Kabupaten Malang",
      judulEng:
        "Social, Economic, and Environmental Impacts in the Implementation of Sustainable Tourism at Goa Cina Beach",
      supervisor1: "Dr. Tony Hanoraga, SH., M.Hum.",
      supervisor2: undefined,
      statusBadge: "Menunggu Persetujuan Pembimbing 1",
      submittedDate: "21 Nov 2025",
    },
    {
      id: 2,
      nama: "AHMAD FAJAR SIDIQ",
      nrp: "09311940000015",
      judulInd: "Analisis Dampak Pembangunan Infrastruktur terhadap Kesejahteraan Masyarakat Desa",
      judulEng: "Impact of Rural Infrastructure on Community Welfare",
      supervisor1: undefined,
      supervisor2: undefined,
      statusBadge: "Belum Dialokasikan",
      submittedDate: "18 Nov 2025",
    },
    {
      id: 3,
      nama: "SITI NURHALIZA",
      nrp: "09311940000022",
      judulInd: "Strategi Pemberdayaan UMKM dalam Meningkatkan Ekonomi Lokal",
      judulEng: "MSME Empowerment Strategies for Local Economic Growth",
      supervisor1: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
      supervisor2: undefined,
      statusBadge: "Menunggu Persetujuan Pembimbing 1",
      submittedDate: "15 Nov 2025",
    },
    {
      id: 4,
      nama: "BAYU FIRMANSYAH",
      nrp: "09311940000009",
      judulInd: "Evaluasi Kebijakan Pengelolaan Sampah di Perkotaan",
      judulEng: "Policy Evaluation of Urban Waste Management",
      supervisor1: "Dr. Rizal Fathoni, S.Kom., M.T.",
      supervisor2: "Dr. Retno Wardani, S.Kom., M.T.",
      statusBadge: "Menunggu Persetujuan Pembimbing 2",
      submittedDate: "10 Nov 2025",
    },
    {
      id: 5,
      nama: "NUR AINI",
      nrp: "09311940000030",
      judulInd: "Analisis Sistem Transportasi Publik Surabaya",
      judulEng: "Public Transportation System Analysis in Surabaya",
      supervisor1: undefined,
      supervisor2: undefined,
      statusBadge: "Belum Dialokasikan",
      submittedDate: "22 Nov 2025",
    },
    {
      id: 6,
      nama: "MIFTAHUL JANNAH",
      nrp: "09311940000044",
      judulInd: "Studi Kelayakan Pengembangan Destinasi Wisata Alam Baru",
      judulEng: "Feasibility Study of New Natural Tourism Destinations",
      supervisor1: "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
      supervisor2: undefined,
      statusBadge: "Menunggu Persetujuan Pembimbing 1",
      submittedDate: "25 Nov 2025",
    },
    {
      id: 7,
      nama: "ALDI SUHENDRA",
      nrp: "09311940000055",
      judulInd: "Pengaruh Digitalisasi UMKM terhadap Omset Penjualan",
      judulEng: "Impact of MSME Digitalization on Sales Performance",
      supervisor1: undefined,
      supervisor2: undefined,
      statusBadge: "Belum Dialokasikan",
      submittedDate: "27 Nov 2025",
    },
    {
      id: 8,
      nama: "DEWI NUR AZIZAH",
      nrp: "09311940000060",
      judulInd: "Persepsi Masyarakat terhadap Kebijakan Social Safety Net",
      judulEng: "Public Perception of Social Safety Net Policy",
      supervisor1: "Fajar Pradana, S.Kom., M.Kom.",
      supervisor2: undefined,
      statusBadge: "Menunggu Persetujuan Pembimbing 1",
      submittedDate: "19 Nov 2025",
    },
    {
      id: 9,
      nama: "GILANG PERMANA",
      nrp: "09311940000071",
      judulInd: "Kajian Aksesibilitas Penyandang Disabilitas di Ruang Publik",
      judulEng: "Accessibility Study for People with Disabilities in Public Spaces",
      supervisor1: "Dr. Retno Wardani, S.Kom., M.T.",
      supervisor2: undefined,
      statusBadge: "Menunggu Persetujuan Pembimbing 1",
      submittedDate: "13 Nov 2025",
    },
    {
      id: 10,
      nama: "LUTHFI RAMADHAN",
      nrp: "09311940000081",
      judulInd: "Perencanaan Tata Ruang Berbasis Smart City",
      judulEng: "Spatial Planning Based on Smart City Framework",
      supervisor1: undefined,
      supervisor2: undefined,
      statusBadge: "Belum Dialokasikan",
      submittedDate: "26 Nov 2025",
    },
    {
      id: 11,
      nama: "MAULANA IQBAL",
      nrp: "09311940000091",
      judulInd: "Dampak Ekonomi Pariwisata pada Pendapatan Lokal",
      judulEng: "Economic Impact of Tourism on Local Revenue",
      supervisor1: "Dr. Tony Hanoraga, SH., M.Hum.",
      supervisor2: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
      statusBadge: "Menunggu Persetujuan Pembimbing 2",
      submittedDate: "05 Nov 2025",
    },
    {
      id: 12,
      nama: "TIARA RAHMAWATI",
      nrp: "09311940000102",
      judulInd: "Analisis Ketahanan Pangan Tingkat Rumah Tangga",
      judulEng: "Household Food Security Analysis",
      supervisor1: undefined,
      supervisor2: undefined,
      statusBadge: "Belum Dialokasikan",
      submittedDate: "29 Nov 2025",
    },
  ]);

  const dosenList = [
    "Semua Dosen",
    "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
    "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
    "Dr. Retno Wardani, S.Kom., M.T.",
    "Fajar Pradana, S.Kom., M.Kom.",
    "Dr. Rizal Fathoni, S.Kom., M.T.",
    "Dr. Tony Hanoraga, SH., M.Hum.",
  ];

  const [formData, setFormData] = useState({ supervisor1: "", supervisor2: "" });

  // =============================
  // OPEN DETAIL MODAL
  // =============================
  const handleViewDetail = (student: StudentProposal) => {
    setSelectedStudent(student);

    setFormData({
      supervisor1: student.supervisor1 || "",
      supervisor2: student.supervisor2 || "",
    });

    setIsDetailModalOpen(true);
  };

  // =============================
  // SAVE SUPERVISOR LOGIC
  // =============================
  const handleSaveSupervisors = () => {
    if (!formData.supervisor1) {
      toast.error("Pembimbing 1 harus diisi!");
      return;
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent?.id
          ? {
              ...s,
              supervisor1: formData.supervisor1,
              supervisor2: formData.supervisor2,
              statusBadge:
                formData.supervisor1 && !formData.supervisor2
                  ? "Menunggu Persetujuan Pembimbing 1"
                  : formData.supervisor1 && formData.supervisor2
                  ? "Menunggu Persetujuan Pembimbing 2"
                  : "Belum Dialokasikan",
            }
          : s
      )
    );

    toast.success("Perubahan pembimbing berhasil disimpan");
    setIsDetailModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Belum"))
      return "bg-gray-100 text-gray-700 border-gray-200";
    if (status.includes("Menunggu"))
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  // =============================
  // FILTER LOGIC
  // =============================
  const filteredStudents = students.filter((student) => {
    const matchDosen =
      selectedDosen === "Semua Dosen" ||
      student.supervisor1?.includes(selectedDosen) ||
      student.supervisor2?.includes(selectedDosen);

    const matchStatus =
      selectedStatus === "Semua Status" ||
      student.statusBadge === selectedStatus;

    const matchSearch =
      student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nrp.includes(searchQuery) ||
      student.judulInd.toLowerCase().includes(searchQuery.toLowerCase());

    return matchDosen && matchStatus && matchSearch;
  });

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-gray-800 font-[Poppins] text-[24px]">Alokasi Pembimbing</h1>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded"
            >
              <BookOpen className="w-4 h-4" /> Panduan
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

              {/* Prodi */}
              <div>
                <label className="text-xs text-gray-600">Program Studi</label>
                <select
                  value={selectedProdi}
                  onChange={(e) => setSelectedProdi(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option>S1 Studi Pembangunan</option>
                  <option>S2 Studi Pembangunan</option>
                  <option>S3 Studi Pembangunan</option>
                </select>
              </div>

              {/* Dosen */}
              <div>
                <label className="text-xs text-gray-600">Dosen Kandidat</label>
                <select
                  value={selectedDosen}
                  onChange={(e) => setSelectedDosen(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {dosenList.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-gray-600">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Semua Status">Semua Status</option>
                  <option value="Belum Dialokasikan">Belum Dialokasikan</option>
                  <option value="Menunggu Persetujuan Pembimbing 1">
                    Menunggu Persetujuan Pembimbing 1
                  </option>
                  <option value="Menunggu Persetujuan Pembimbing 2">
                    Menunggu Persetujuan Pembimbing 2
                  </option>
                </select>
              </div>

            </div>

            <button className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Excel
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">No.</th>
                  <th className="px-4 py-3 text-left">Mahasiswa</th>
                  <th className="px-4 py-3 text-left">Judul Usulan</th>
                  <th className="px-4 py-3 text-left">Dosen</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, i) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-4">{i + 1}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{s.nama}</p>
                        <p className="text-xs text-gray-500">{s.nrp}</p>
                      </td>
                      <td className="px-4 py-4 max-w-lg">
                        <span
                          className={`inline-block px-2 py-1 text-xs border rounded ${getStatusColor(
                            s.statusBadge
                          )}`}
                        >
                          {s.statusBadge}
                        </span>
                        <p className="mt-2">{s.judulInd}</p>
                        <p className="text-xs text-gray-500 italic">{s.judulEng}</p>
                      </td>
                      <td className="px-4 py-4">
                        {s.supervisor1 ? <p>{s.supervisor1}</p> : <p className="text-gray-400">-</p>}
                        {s.supervisor2 && (
                          <p className="text-gray-600 mt-1">{s.supervisor2}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleViewDetail(s)}
                          className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50"
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* ===============================
          DETAIL MODAL
      =============================== */}
      <AnimatePresence>
        {isDetailModalOpen && selectedStudent && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsDetailModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              {/* Header */}
              <h2 className="text-xl font-[Poppins] mb-4">Detail Usulan Tugas Akhir</h2>

              {/* Mahasiswa */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="font-medium">{selectedStudent.nama}</p>
                <p className="text-sm text-gray-600">{selectedStudent.nrp}</p>
              </div>

              {/* Judul */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 block mb-2">Judul</label>
                <div className="border p-4 rounded">
                  <p className="font-medium">{selectedStudent.judulInd}</p>
                  <p className="text-sm italic text-gray-600">{selectedStudent.judulEng}</p>
                </div>
              </div>

              {/* Pembimbing */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                <h3 className="text-sm font-medium mb-4">Ubah Pembimbing</h3>

                {/* Pembimbing 1 */}
                <label className="text-sm text-gray-700 block mb-2">
                  Pembimbing 1 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.supervisor1}
                  onChange={(e) => setFormData({ ...formData, supervisor1: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                >
                  {!formData.supervisor1 && <option value="">Pilih Pembimbing 1</option>}
                  {dosenList
                    .filter((d) => d !== "Semua Dosen")
                    .map((dosen) => (
                      <option key={dosen} value={dosen}>
                        {dosen}
                      </option>
                    ))}
                </select>

                {/* Pembimbing 2 */}
                <label className="text-sm text-gray-700 block mb-2">Pembimbing 2</label>
                <select
                  value={formData.supervisor2}
                  onChange={(e) => setFormData({ ...formData, supervisor2: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {!formData.supervisor2 && <option value="">Pilih Pembimbing 2 (Opsional)</option>}
                  {dosenList
                    .filter((d) => d !== "Semua Dosen")
                    .map((dosen) => (
                      <option key={dosen} value={dosen}>
                        {dosen}
                      </option>
                    ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveSupervisors}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Simpan Perubahan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
