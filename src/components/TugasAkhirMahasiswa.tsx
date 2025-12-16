import { useState } from "react";
import {
  BookOpen,
  Download,
  Search,
  ChevronDown,
  Eye,
  X,
  Calendar,
  User,
  FileText,
} from "lucide-react";
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
  // Status administratif (Disetujui, Ditolak, dsb) masih disimpan kalau nanti dibutuhkan
  status: string;
  pembimbing: string;
  semester: string;
  statusDetail: string;
  periodeSidang: string;
  jenisSidang: string;
  // Timeline 13 langkah seperti di BimbinganAktifUpdated
  timelineDates?: (string | null)[];
}

// 13 langkah timeline proses (sinkron dengan BimbinganAktifUpdated.tsx)
const TIMELINE_STEPS: { label: string }[] = [
  { label: "Mendaftar proposal TA" }, // 0
  { label: "Proposal TA disetujui" }, // 1
  { label: "Mendaftar sidang proposal TA" }, // 2
  { label: "Daftar sidang proposal TA disetujui" }, // 3
  { label: "Sidang proposal TA selesai" }, // 4
  { label: "Revisi sidang proposal TA disetujui" }, // 5
  { label: "Mendaftar tugas akhir" }, // 6
  { label: "Tugas akhir disetujui" }, // 7
  { label: "Mendaftar sidang tugas akhir" }, // 8
  { label: "Daftar Sidang tugas akhir disetujui" }, // 9
  { label: "Sidang tugas akhir selesai" }, // 10
  { label: "Revisi tugas akhir disetujui" }, // 11
  { label: "Selesai" }, // 12
];

// Cari index step terakhir yang sudah punya tanggal
const getCurrentStepIndex = (student: ThesisStudent): number => {
  if (!student.timelineDates || student.timelineDates.length === 0) return -1;
  let idx = -1;
  const len = Math.min(student.timelineDates.length, TIMELINE_STEPS.length);
  for (let i = 0; i < len; i++) {
    if (student.timelineDates[i]) idx = i;
  }
  return idx;
};

// Status proses (badge + filter) berdasarkan timeline
const getStatusFromTimeline = (student: ThesisStudent): string => {
  const idx = getCurrentStepIndex(student);

  if (idx < 0) {
    return "Proposal";
  }

  if (idx >= 0 && idx <= 1) {
    return "Proposal";
  }

  if (idx >= 2 && idx <= 4) {
    return "Sidang Proposal";
  }

  if (idx === 5) {
    return "Revisi Proposal";
  }

  if (idx >= 6 && idx <= 7) {
    return "Tugas Akhir";
  }

  if (idx >= 8 && idx <= 10) {
    return "Sidang Tugas Akhir";
  }

  if (idx === 11) {
    return "Revisi Tugas Akhir";
  }

  return "Selesai";
};

const formatTimelineDate = (
  dateStr: string | null | undefined
): string => {
  if (!dateStr) return "Belum selesai";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateId = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Data awal mahasiswa (timeline dummy supaya status proses bisa dihitung)
const initialStudents: ThesisStudent[] = [
  {
    id: 1,
    nama: "Aditia Athanaa Nada Salasila",
    nrp: "5033211035",
    judulInd:
      "DINAMIKA TRANSISI PEKERJAAN PETANI SALAK DI DESA WEDI VILLAGE, BOJONEGORO : STUDI KASUS PERUBAHAN PROFESI DAN IMPLIKASINYA BAGI PEMBANGUNAN PEDESAAN",
    judulEng:
      "DYNAMICS TRANSITION OF SALAK FARMERS WORK IN WEDI VILLAGE, BOJONEGORO : A CASE STUDY OF PROFESSION CHANGES AND THEIR IMPLICATIONS FOR RURAL DEVELOPMENT",
    laboratorium: "RPL",
    status: "Disetujui",
    pembimbing: "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
    semester: "Gasal 2024/2025",
    statusDetail: "",
    periodeSidang: "2024-10-01",
    jenisSidang: "Sidang Akhir",
    timelineDates: [
      "2023-09-01", // 0
      "2023-09-05", // 1
      "2023-09-10", // 2
      "2023-09-15", // 3
      "2023-09-20", // 4
      "2023-09-25", // 5
      "2024-02-01", // 6
      "2024-02-10", // 7
      "2024-03-01", // 8
      "2024-03-10", // 9
      "2024-04-01", // 10
      "2024-04-15", // 11
      "2024-05-01", // 12 (selesai)
    ],
  },
  {
    id: 2,
    nama: "Calisa Risky Adiguna",
    nrp: "5033211004",
    judulInd:
      "ANALISIS PERAN WANITA DALAM USAHA TANI DI DESA TAMBAKRIGADING KECAMATAN TIKUNG KABUPATEN LAMONGAN",
    judulEng:
      "ANALYSIS OF THE ROLE OF WOMEN IN FARMING IN TAMBAKRIGADING VILLAGE, TIKUNG DISTRICT, LAMONGAN REGENCY",
    laboratorium: "KCV",
    status: "Disetujui",
    pembimbing: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
    semester: "Gasal 2024/2025",
    statusDetail: "",
    periodeSidang: "2024-10-03",
    jenisSidang: "Sidang Akhir",
    timelineDates: [
      "2023-10-01", // 0
      "2023-10-10", // 1
      "2023-11-01", // 2
      "2023-11-10", // 3
      "2023-11-20", // 4
      "2023-12-05", // 5
      "2024-02-10", // 6
      "2024-02-20", // 7
      "2024-03-05", // 8
      "2024-03-15", // 9
      "2024-04-05", // 10 (sidang TA selesai)
      null, // 11
      null, // 12
    ],
  },
  {
    id: 3,
    nama: "Fatimah Hassanah",
    nrp: "5033211023",
    judulInd:
      "Upaya Peningkatan Kualitas Hidup Melalui Urban Farming (Studi Kasus Kelompok Tani Urban Farming Kota Bayurangga-Prambanan)",
    judulEng:
      "Efforts to Improve Quality of Life Through Urban Farming (Case Study of the Bayurangga-Prambanan City Urban Farming Farmers Group)",
    laboratorium: "MCI",
    status: "Disetujui",
    pembimbing: "Dr. Retno Wardani, S.Kom., M.T.",
    semester: "Genap 2024/2025",
    statusDetail: "",
    periodeSidang: "2024-10-05",
    jenisSidang: "Sidang Akhir",
    timelineDates: [
      "2023-11-01", // 0
      "2023-11-08", // 1
      "2023-11-20", // 2
      "2023-11-28", // 3
      "2023-12-05", // 4
      "2023-12-20", // 5
      "2024-03-01", // 6
      null, // 7
      null, // 8
      null, // 9
      null, // 10
      null, // 11
      null, // 12
    ],
  },
];

type VisibleColumns = {
  no: boolean;
  mahasiswa: boolean;
  semester: boolean;
  pembimbing: boolean;
  judul: boolean;
  laboratorium: boolean;
  statusProcess: boolean;
  sidangTerakhir: boolean;
  statusDetail: boolean;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Proposal":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Sidang Proposal":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Revisi Proposal":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Tugas Akhir":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Sidang Tugas Akhir":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Revisi Tugas Akhir":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Selesai":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Badge high-level di atas judul: Selesai / Pengerjaan / Gagal
const getOverallBadgeLabel = (student: ThesisStudent): "Selesai" | "Pengerjaan" | "Gagal" => {
  if (student.status === "Digagalkan oleh Admin") return "Gagal";
  const detailed = getStatusFromTimeline(student);
  if (detailed === "Selesai") return "Selesai";
  return "Pengerjaan";
};

const getOverallBadgeColor = (label: "Selesai" | "Pengerjaan" | "Gagal") => {
  switch (label) {
    case "Selesai":
      return "bg-green-100 text-green-700 border-green-200";
    case "Gagal":
      return "bg-red-100 text-red-700 border-red-200";
    case "Pengerjaan":
    default:
      return "bg-blue-100 text-blue-700 border-blue-200";
  }
};

export function TugasAkhirMahasiswa() {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState("Semua Laboratorium");
  const [selectedStatus, setSelectedStatus] =
    useState("Semua Status");
  const [selectedPembimbing, setSelectedPembimbing] = useState(
    "Semua Dosen Pembimbing"
  );
  const [selectedSemester, setSelectedSemester] =
    useState("Semua Semester");
  const [searchQuery, setSearchQuery] = useState("");
  const [showColumnSelector, setShowColumnSelector] =
    useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<ThesisStudent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] =
    useState(false);

  const [studentList, setStudentList] =
    useState<ThesisStudent[]>(initialStudents);

  const [visibleColumns, setVisibleColumns] =
    useState<VisibleColumns>({
      no: true,
      mahasiswa: true,
      semester: true,
      pembimbing: true,
      judul: true,
      laboratorium: true,
      statusProcess: true,
      sidangTerakhir: true,
      statusDetail: true,
    });

  const visibleColumnCount = Object.values(visibleColumns).filter(
    Boolean
  ).length;

  const columnLabels: Record<keyof VisibleColumns, string> = {
    no: "No.",
    mahasiswa: "Mahasiswa",
    semester: "Semester",
    pembimbing: "Dosen Pembimbing",
    judul: "Judul",
    laboratorium: "Laboratorium",
    statusProcess: "Status Proses",
    sidangTerakhir: "Sidang Terakhir Diikuti",
    statusDetail: "Status Detail",
  };

  const filteredStudents = studentList.filter((student) => {
    const derivedStatus = getStatusFromTimeline(student);

    const matchesLab =
      selectedLab === "Semua Laboratorium" ||
      student.laboratorium === selectedLab;
    const matchesStatus =
      selectedStatus === "Semua Status" ||
      derivedStatus === selectedStatus;
    const matchesPembimbing =
      selectedPembimbing === "Semua Dosen Pembimbing" ||
      student.pembimbing === selectedPembimbing;
    const matchesSemester =
      selectedSemester === "Semua Semester" ||
      student.semester === selectedSemester;
    const matchesSearch =
      student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nrp.includes(searchQuery) ||
      student.judulInd
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.judulEng
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return (
      matchesLab &&
      matchesStatus &&
      matchesPembimbing &&
      matchesSemester &&
      matchesSearch
    );
  });

  const toggleColumn = (column: keyof VisibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleViewDetail = (student: ThesisStudent) => {
    toast.success(`Detail tugas akhir ${student.nama} ditampilkan`);
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleGagalkan = (id: number) => {
    setStudentList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Digagalkan oleh Admin" } : s
      )
    );
    toast.error("Status tugas akhir telah digagalkan oleh admin");
  };

  const getSidangTerakhirText = (student: ThesisStudent) => {
    if (!student.jenisSidang && !student.periodeSidang) return "-";
    const dateText = formatDateId(student.periodeSidang);
    if (!student.jenisSidang) return dateText;
    if (!student.periodeSidang) return student.jenisSidang;
    return `${student.jenisSidang} – ${dateText}`;
  };

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">
                Tugas Akhir Mahasiswa
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="font-[Poppins]">
                    Panduan Penggunaan
                  </span>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Database tugas akhir mahasiswa dari program studi Anda
              beserta status proses berdasarkan timeline proposal
              hingga sidang tugas akhir.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Lab Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                  Laboratorium
                </label>
                <select
                  value={selectedLab}
                  onChange={(e) => setSelectedLab(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="Semua Laboratorium">
                    Semua Laboratorium
                  </option>
                  <option value="KCV">KCV</option>
                  <option value="MCI">MCI</option>
                  <option value="RPL">RPL</option>
                  <option value="NCC">NCC</option>
                  <option value="NETICS">NETICS</option>
                  <option value="ALPRO">ALPRO</option>
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Status Proses Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                  Status Proses
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value)
                  }
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="Semua Status">Semua Status</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Sidang Proposal">
                    Sidang Proposal
                  </option>
                  <option value="Revisi Proposal">
                    Revisi Proposal
                  </option>
                  <option value="Tugas Akhir">Tugas Akhir</option>
                  <option value="Sidang Tugas Akhir">
                    Sidang Tugas Akhir
                  </option>
                  <option value="Revisi Tugas Akhir">
                    Revisi Tugas Akhir
                  </option>
                  <option value="Selesai">Selesai</option>
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Pembimbing Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                  Pilih Dosen Pembimbing
                </label>
                <select
                  value={selectedPembimbing}
                  onChange={(e) =>
                    setSelectedPembimbing(e.target.value)
                  }
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="Semua Dosen Pembimbing">
                    Semua Dosen Pembimbing
                  </option>
                  <option value="Dr. Ahmad Saikhu, S.Kom., M.Kom.">
                    Dr. Ahmad Saikhu, S.Kom., M.Kom.
                  </option>
                  <option value="Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.">
                    Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.
                  </option>
                  <option value="Dr. Retno Wardani, S.Kom., M.T.">
                    Dr. Retno Wardani, S.Kom., M.T.
                  </option>
                </select>
                <ChevronDown className="absolute right-3 bottom-2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Semester Filter */}
              <div className="relative">
                <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                  Semester Ajuan
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) =>
                    setSelectedSemester(e.target.value)
                  }
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                >
                  <option value="Semua Semester">
                    Semua Semester
                  </option>
                  <option value="Gasal 2024/2025">
                    Gasal 2024/2025
                  </option>
                  <option value="Genap 2024/2025">
                    Genap 2024/2025
                  </option>
                  <option value="Gasal 2023/2024">
                    Gasal 2023/2024
                  </option>
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
                    onClick={() =>
                      setShowColumnSelector(!showColumnSelector)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Tampilkan
                  </button>
                  {showColumnSelector && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[220px]">
                      <div className="space-y-2">
                        {(
                          Object.entries(
                            visibleColumns
                          ) as [keyof VisibleColumns, boolean][]
                        ).map(([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => toggleColumn(key)}
                              className="w-4 h-4 text-blue-500 rounded"
                            />
                            <span className="text-sm font-[Roboto] text-gray-700">
                              {columnLabels[key]}
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
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Cari"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm w-64"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {visibleColumns.no && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[60px]">
                      No.
                    </th>
                  )}
                  {visibleColumns.mahasiswa && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[220px]">
                      Mahasiswa
                    </th>
                  )}
                  {visibleColumns.semester && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[150px]">
                      Semester
                    </th>
                  )}
                  {visibleColumns.pembimbing && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[220px]">
                      Dosen Pembimbing
                    </th>
                  )}
                  {visibleColumns.judul && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[380px]">
                      Judul
                    </th>
                  )}
                  {visibleColumns.laboratorium && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[130px]">
                      Laboratorium
                    </th>
                  )}
                  {visibleColumns.statusProcess && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[150px]">
                      Status Proses
                    </th>
                  )}
                  {visibleColumns.sidangTerakhir && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[210px]">
                      Sidang Terakhir Diikuti
                    </th>
                  )}
                  {visibleColumns.statusDetail && (
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 w-[160px]">
                      Status Detail / Timeline
                    </th>
                  )}
                  <th className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-700 w-[140px]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumnCount + 1}
                      className="px-4 py-12 text-center"
                    >
                      <p className="text-gray-500 font-[Roboto]">
                        Tidak ada data yang ditemukan
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => {
                    const derivedStatus =
                      getStatusFromTimeline(student);
                    const overallLabel = getOverallBadgeLabel(student);

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors align-top"
                      >
                        {visibleColumns.no && (
                          <td className="px-4 py-4 text-sm text-gray-700 font-[Roboto]">
                            {index + 1}.
                          </td>
                        )}
                        {visibleColumns.mahasiswa && (
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm text-gray-800 font-[Poppins] font-medium">
                              {student.nama}
                            </p>
                            <p className="text-xs text-gray-500 font-[Roboto]">
                              {student.nrp}
                            </p>
                          </td>
                        )}
                        {visibleColumns.semester && (
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm text-gray-800 font-[Roboto]">
                              {student.semester}
                            </p>
                          </td>
                        )}
                        {visibleColumns.pembimbing && (
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm text-gray-800 font-[Roboto]">
                              {student.pembimbing}
                            </p>
                          </td>
                        )}
                        {visibleColumns.judul && (
                          <td className="px-4 py-4 align-top">
                            <div
                              className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs mb-2 font-[Roboto] border ${getOverallBadgeColor(
                                overallLabel
                              )}`}
                            >
                              <span className="font-semibold">
                                {overallLabel}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 font-[Poppins] mb-1 leading-snug">
                              {student.judulInd}
                            </p>
                            <p className="text-xs text-gray-500 font-[Roboto] italic leading-snug">
                              {student.judulEng}
                            </p>
                          </td>
                        )}
                        {visibleColumns.laboratorium && (
                          <td className="px-4 py-4 align-top">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-[Roboto] border border-blue-200">
                              {student.laboratorium}
                            </span>
                          </td>
                        )}
                        {visibleColumns.statusProcess && (
                          <td className="px-4 py-4 align-top">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-[Roboto] border ${getStatusColor(
                                derivedStatus
                              )}`}
                            >
                              {derivedStatus}
                            </span>
                          </td>
                        )}
                        {visibleColumns.sidangTerakhir && (
                          <td className="px-4 py-4 align-top">
                            <div className="flex items-start gap-2 text-sm text-gray-800 font-[Roboto]">
                              <Calendar className="w-4 h-4 text-gray-500 mt-[2px]" />
                              <span className="leading-snug">
                                {getSidangTerakhirText(student)}
                              </span>
                            </div>
                          </td>
                        )}
                        {visibleColumns.statusDetail && (
                          <td className="px-4 py-4 align-top">
                            <button
                              onClick={() =>
                                handleViewDetail(student)
                              }
                              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-[Roboto]"
                            >
                              Lihat timeline
                            </button>
                          </td>
                        )}
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center justify-center gap-2">
                            {student.status !==
                              "Digagalkan oleh Admin" && (
                              <button
                                onClick={() =>
                                  handleViewDetail(student)
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
                              >
                                Lihat
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleGagalkan(student.id)
                              }
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-[Roboto] text-sm"
                            >
                              Gagalkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

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
                      {selectedStudent.nama
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
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
                      {(() => {
                        const derivedStatus =
                          getStatusFromTimeline(selectedStudent);
                        return (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-[Roboto] border ${getStatusColor(
                                derivedStatus
                              )}`}
                            >
                              {derivedStatus}
                            </span>
                          </div>
                        );
                      })()}
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

                  {/* Timeline Proses */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                      Timeline Proses
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="space-y-4">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const currentIndex = getCurrentStepIndex(
                            selectedStudent
                          );
                          const isActive = currentIndex >= idx;
                          const isNextActive = currentIndex >= idx + 1;
                          const isLast =
                            idx === TIMELINE_STEPS.length - 1;

                          const stepDate =
                            selectedStudent.timelineDates &&
                            selectedStudent.timelineDates[idx];

                          return (
                            <div
                              key={step.label}
                              className="flex items-start gap-3"
                            >
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                    isActive
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-300 text-gray-600"
                                  }`}
                                >
                                  {idx + 1}
                                </div>
                                {!isLast && (
                                  <div
                                    className={`w-px flex-1 mt-1 ${
                                      isNextActive
                                        ? "bg-blue-600"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="pt-1">
                                <p
                                  className={`text-xs font-[Roboto] ${
                                    isActive
                                      ? "text-blue-700 font-semibold"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                <p className="text-[10px] text-gray-500 font-[Roboto] mt-1">
                                  {formatTimelineDate(stepDate ?? null)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Sidang Terakhir */}
                  <div>
                    <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">
                      Sidang Terakhir Diikuti
                    </label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 font-[Roboto] flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 mt-[2px]" />
                        <span>{getSidangTerakhirText(selectedStudent)}</span>
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
            description:
              "Halaman ini menampilkan database lengkap tugas akhir mahasiswa, termasuk informasi pembimbing, semester, dan status proses berdasarkan timeline dari proposal hingga sidang tugas akhir.",
            imageUrl:
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2UlMjBzZXR0aW5nc3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Filter dan Pencarian",
            description:
              "Gunakan filter untuk menyaring data berdasarkan laboratorium, status proses (Proposal, Sidang Proposal, Tugas Akhir, dan seterusnya), dosen pembimbing, serta semester. Kolom pencarian membantu menemukan mahasiswa atau topik tertentu dengan cepat.",
            imageUrl:
              "https://images.unsplash.com/photo-1708320254298-109008440fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWx0ZXIlMjBzZWFyY2glMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzYzNjM5MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Export dan Tampilan Kolom",
            description:
              "Klik tombol 'Excel' untuk mengekspor data ke spreadsheet. Gunakan tombol 'Tampilkan' untuk mengatur kolom tabel yang ingin ditampilkan atau disembunyikan agar tampilan tetap ringkas tanpa perlu geser ke samping.",
            imageUrl:
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmVzcyUyMHRyYWNraW5nfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Status Proses & Timeline",
            description:
              "Status proses diturunkan dari timeline (Proposal, Sidang Proposal, Revisi, Tugas Akhir, Sidang Tugas Akhir, hingga Selesai). Klik 'Lihat timeline' pada kolom Status Detail untuk melihat visual timeline lengkap beserta timestamp setiap tahapan.",
            imageUrl:
              "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0JTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
        ]}
      />
    </>
  );
}
