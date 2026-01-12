import { useState } from "react";
import {
  BookOpen,
  Download,
  Search,
  X,
  ChevronDown,
  Pencil,
} from "lucide-react";
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
  nilai: string; // contoh: "81.98 (AB)"
  supervisors: {
    pembimbing1: { nama: string; hadir: boolean | null };
    penguji1: { nama: string; hadir: boolean | null };
    penguji2: { nama: string; hadir: boolean | null };
  };
}

type RoleKey = "pembimbing1" | "penguji1" | "penguji2";
type CriteriaKey = "c1" | "c2" | "c3" | "c4";

interface GradeRoleScores {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
}

interface GradeDetailsPerStudent {
  pembimbing1?: GradeRoleScores;
  penguji1?: GradeRoleScores;
  penguji2?: GradeRoleScores;
  finalNumeric: number;
  finalLetter: string;
}

interface GradeFormState {
  pembimbing1: Record<CriteriaKey, string>;
  penguji1: Record<CriteriaKey, string>;
  penguji2: Record<CriteriaKey, string>;
}

const CRITERIA_CONFIG: { key: CriteriaKey; label: string; weight: number }[] = [
  { key: "c1", label: "Penguasaan Materi", weight: 30 },
  { key: "c2", label: "Metodologi Penelitian", weight: 30 },
  { key: "c3", label: "Penyusunan Laporan", weight: 20 },
  { key: "c4", label: "Presentasi & Tanya Jawab", weight: 20 },
];

const emptyCriteria: Record<CriteriaKey, string> = {
  c1: "",
  c2: "",
  c3: "",
  c4: "",
};

const ACTIVE_ROLES: RoleKey[] = ["pembimbing1", "penguji1", "penguji2"];

// Mapping indeks baru
const getLetterGradeFromScore = (score: number) => {
  if (score >= 86) return "A";
  if (score >= 76) return "AB";
  if (score >= 66) return "B";
  if (score >= 61) return "BC";
  if (score >= 50) return "C";
  return "Tidak Lulus";
};

// Hitung live score + indeks dari form (kalau belum lengkap → null)
const computeAggregateFromForm = (form: GradeFormState) => {
  const lecturerFinals: number[] = [];

  for (const role of ACTIVE_ROLES) {
    const roleForm = form[role];
    let sumWeighted = 0;

    for (const crit of CRITERIA_CONFIG) {
      const raw = roleForm[crit.key];
      if (raw === "" || raw === undefined) {
        return null;
      }
      const num = parseFloat(raw);
      if (isNaN(num) || num < 0 || num > 100) {
        return null;
      }
      sumWeighted += num * crit.weight;
    }

    const finalRoleScore = sumWeighted / 100;
    lecturerFinals.push(finalRoleScore);
  }

  if (lecturerFinals.length === 0) return null;

  const overallScore =
    lecturerFinals.reduce((acc, val) => acc + val, 0) / lecturerFinals.length;

  return {
    overallScore,
    letter: getLetterGradeFromScore(overallScore),
  };
};

export function RekapitulasiNilai() {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    "Gasal 2025/2026 (Aktif)"
  );
  const [selectedJenis, setSelectedJenis] = useState("Sidang Proposal");
  const [searchQuery, setSearchQuery] = useState("");
  
  // FIXED: Menggunakan State untuk data siswa agar bisa di-update
  const [studentsData, setStudentsData] = useState<Student[]>([
    {
      id: 1,
      nrp: "5033221024",
      nama: "AINA NUR NABIBAH",
      lab: "Studi Pembangunan",
      judulTA:
        "Motivasi Yang Melatarbelakangi Peran Masyarakat Dalam Pengembangan Wisata Bahari Di Taman Hiburan Pantai Kenjeran Surabaya",
      judulTAEn:
        "Motivation Background The Role Of The Community In The Development Of Marital Tourism In The Kenjeran Beach Amusement Park, Surabaya",
      periodeSidang: "Seminar Proposal - Gasal 2025 (I)",
      jenisSidang: "Sidang Proposal",
      hasil: "Diterima dengan revisi minor",
      nilai: "81.98 (AB)",
      supervisors: {
        pembimbing1: { nama: "Drs. Zainul Muhibbin, M.Fil.I", hadir: true },
        penguji1: {
          nama: "Drs. Mohammad Saifulloh, M.Fil.I",
          hadir: true,
        },
        penguji2: {
          nama: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
          hadir: true,
        },
      },
    },
    {
      id: 2,
      nrp: "5033221061",
      nama: "AISYI IZZAN FIRDAUS",
      lab: "Studi Pembangunan",
      judulTA:
        "IMPLEMENTASI KEBIJAKAN INFRASTRUKTUR HALTE TRANSPORTASI DARAT DI KOTA SURABAYA BERBASIS TRANSIT ORIENTED DEVELOPMENT (TOD)",
      judulTAEn:
        "IMPLEMENTATION OF LAND TRANSPORTATION STOP INFRASTRUCTURE POLICY IN SURABAYA CITY BASED ON TRANSIT ORIENTED DEVELOPMENT",
      periodeSidang: "Seminar Proposal - Gasal 2025 (I)",
      jenisSidang: "Sidang Proposal",
      hasil: "Diterima dengan revisi mayor",
      nilai: "81.03 (AB)",
      supervisors: {
        pembimbing1: {
          nama: "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
          hadir: null,
        },
        penguji1: {
          nama: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
          hadir: null,
        },
        penguji2: {
          nama: "Drs. Zainul Muhibbin, M.Fil.I",
          hadir: null,
        },
      },
    },
    {
      id: 3,
      nrp: "5033221099",
      nama: "BUDI SANTOSO",
      lab: "Rekayasa Perangkat Lunak",
      judulTA:
        "PENGEMBANGAN SISTEM INFORMASI MANAJEMEN RISIKO PADA PROYEK KONSTRUKSI BERBASIS WEB",
      judulTAEn:
        "DEVELOPMENT OF WEB-BASED RISK MANAGEMENT INFORMATION SYSTEM IN CONSTRUCTION PROJECTS",
      periodeSidang: "Seminar Proposal - Gasal 2025 (I)",
      jenisSidang: "Sidang Proposal",
      hasil: "Diterima",
      nilai: "85.50 (A)",
      supervisors: {
        pembimbing1: { nama: "Rully Soelaiman, S.Kom., M.Kom.", hadir: true },
        penguji1: { nama: "Fatimah S.T., M.T.", hadir: true },
        penguji2: { nama: "Bagus Jati Santoso, S.Kom., Ph.D.", hadir: true },
      },
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal hasil & kehadiran
  const [modalData, setModalData] = useState({
    hasil: "",
    supervisorAttendance: {
      pembimbing1: null as boolean | null,
      penguji1: null as boolean | null,
      penguji2: null as boolean | null,
    },
  });

  // ====== State untuk Edit Nilai ======
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeModalStudent, setGradeModalStudent] = useState<Student | null>(
    null
  );
  const [gradeForm, setGradeForm] = useState<GradeFormState>({
    pembimbing1: { ...emptyCriteria },
    penguji1: { ...emptyCriteria },
    penguji2: { ...emptyCriteria },
  });
  const [gradeDetails, setGradeDetails] = useState<
    Record<number, GradeDetailsPerStudent>
  >({});
  const [nilaiOverrides, setNilaiOverrides] = useState<Record<number, string>>(
    {}
  );

  const filteredStudents = studentsData.filter(
    (student) =>
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
        penguji1: student.supervisors.penguji1.hadir,
        penguji2: student.supervisors.penguji2.hadir,
      },
    });
    setIsModalOpen(true);
  };

  // FIXED: Logic untuk update state data siswa saat "Simpan" ditekan
  const handleSubmitAttendance = () => {
    if (!modalData.hasil) {
      toast.error("Mohon pilih hasil akhir sidang!");
      return;
    }

    const allFilled =
      modalData.supervisorAttendance.pembimbing1 !== null &&
      modalData.supervisorAttendance.penguji1 !== null &&
      modalData.supervisorAttendance.penguji2 !== null;

    if (!allFilled) {
      toast.error("Mohon tentukan kehadiran semua dosen!");
      return;
    }

    if (selectedStudent) {
      setStudentsData((prevStudents) =>
        prevStudents.map((s) => {
          if (s.id === selectedStudent.id) {
            return {
              ...s,
              hasil: modalData.hasil,
              supervisors: {
                pembimbing1: {
                  ...s.supervisors.pembimbing1,
                  hadir: modalData.supervisorAttendance.pembimbing1,
                },
                penguji1: {
                  ...s.supervisors.penguji1,
                  hadir: modalData.supervisorAttendance.penguji1,
                },
                penguji2: {
                  ...s.supervisors.penguji2,
                  hadir: modalData.supervisorAttendance.penguji2,
                },
              },
            };
          }
          return s;
        })
      );
    }

    toast.success("Kelulusan sidang dan kehadiran dosen berhasil disimpan");
    setIsModalOpen(false);
  };

  const handleScoreChange = (
    role: RoleKey,
    key: CriteriaKey,
    value: string
  ) => {
    if (value === "") {
      setGradeForm((prev) => ({
        ...prev,
        [role]: {
          ...prev[role],
          [key]: "",
        },
      }));
      return;
    }

    const numericOnly = value.replace(/[^0-9]/g, "");
    let num = parseInt(numericOnly, 10);
    if (isNaN(num)) {
      num = 0;
    }
    if (num < 0) num = 0;
    if (num > 100) num = 100;
    const normalized = num.toString();

    setGradeForm((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: normalized,
      },
    }));
  };


  const openGradeModal = (student: Student) => {
    setGradeModalStudent(student);

    const existing = gradeDetails[student.id];

    if (existing) {
      setGradeForm({
        pembimbing1: existing.pembimbing1
          ? {
              c1: existing.pembimbing1.c1.toString(),
              c2: existing.pembimbing1.c2.toString(),
              c3: existing.pembimbing1.c3.toString(),
              c4: existing.pembimbing1.c4.toString(),
            }
          : { ...emptyCriteria },
        penguji1: existing.penguji1
          ? {
              c1: existing.penguji1.c1.toString(),
              c2: existing.penguji1.c2.toString(),
              c3: existing.penguji1.c3.toString(),
              c4: existing.penguji1.c4.toString(),
            }
          : { ...emptyCriteria },
        penguji2: existing.penguji2
          ? {
              c1: existing.penguji2.c1.toString(),
              c2: existing.penguji2.c2.toString(),
              c3: existing.penguji2.c3.toString(),
              c4: existing.penguji2.c4.toString(),
            }
          : { ...emptyCriteria },
      });
    } else {
      const rawNilai = nilaiOverrides[student.id] ?? student.nilai;
      const match = rawNilai.match(/[\d.,]+/);
      let baseScore = 80;
      if (match) {
        const parsed = parseFloat(match[0].replace(",", "."));
        if (!isNaN(parsed)) baseScore = parsed;
      }
      const baseString = baseScore.toFixed(0); // integer for form inputs

      setGradeForm({
        pembimbing1: {
          c1: baseString,
          c2: baseString,
          c3: baseString,
          c4: baseString,
        },
        penguji1: {
          c1: baseString,
          c2: baseString,
          c3: baseString,
          c4: baseString,
        },
        penguji2: {
          c1: baseString,
          c2: baseString,
          c3: baseString,
          c4: baseString,
        },
      });
    }

    setIsGradeModalOpen(true);
  };

  const handleSaveGrades = () => {
    if (!gradeModalStudent) return;

    // Validasi
    for (const role of ACTIVE_ROLES) {
      for (const crit of CRITERIA_CONFIG) {
        const raw = gradeForm[role][crit.key];
        if (raw === "" || raw === undefined) {
          toast.error("Mohon lengkapi semua nilai penilaian dosen.");
          return;
        }
        const num = parseInt(raw, 10);
        if (isNaN(num) || num < 0 || num > 100) {
          toast.error("Nilai harus berada pada rentang 0 - 100 (bilangan bulat).");
          return;
        }
      }
    }

    const lecturerScores: {
      role: RoleKey;
      scores: GradeRoleScores;
      final: number;
    }[] = [];

    for (const role of ACTIVE_ROLES) {
      let sumWeighted = 0;
      const roleScores: GradeRoleScores = {
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 0,
      };

      CRITERIA_CONFIG.forEach((crit) => {
        const num = parseFloat(gradeForm[role][crit.key]);
        roleScores[crit.key] = num;
        sumWeighted += num * crit.weight;
      });

      const finalRoleScore = sumWeighted / 100;
      lecturerScores.push({ role, scores: roleScores, final: finalRoleScore });
    }

    const overallScore =
      lecturerScores.reduce((acc, l) => acc + l.final, 0) /
      lecturerScores.length;
    const letter = getLetterGradeFromScore(overallScore);

    setGradeDetails((prev) => ({
      ...prev,
      [gradeModalStudent.id]: {
        pembimbing1: lecturerScores.find((l) => l.role === "pembimbing1")
          ?.scores,
        penguji1: lecturerScores.find((l) => l.role === "penguji1")?.scores,
        penguji2: lecturerScores.find((l) => l.role === "penguji2")?.scores,
        finalNumeric: overallScore,
        finalLetter: letter,
      },
    }));

    // FIXED: Update nilai di tabel utama juga (agar konsisten dengan logic state siswa)
    // Update display override
    setNilaiOverrides((prev) => ({
      ...prev,
      [gradeModalStudent.id]: `${overallScore.toFixed(2)} (${letter})`,
    }));

    // Optional: Update actual data siswa if needed for persistence
    setStudentsData(prev => prev.map(s => {
        if(s.id === gradeModalStudent.id) {
            return { ...s, nilai: `${overallScore.toFixed(2)} (${letter})` }
        }
        return s;
    }));

    toast.success("Nilai sidang berhasil disimpan");
    setIsGradeModalOpen(false);
    setGradeModalStudent(null);
  };

  const renderLecturerSection = (
    roleKey: RoleKey,
    title: string,
    name: string
  ) => (
    <div
      key={roleKey}
      className="border border-gray-200 rounded-lg overflow-hidden mb-5"
    >
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-sm font-[Poppins] text-gray-800">{name}</p>
          <p className="text-xs font-[Roboto] text-gray-500">{title}</p>
        </div>
      </div>
      <div className="p-4">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-[Poppins] text-gray-700">
                Kriteria
              </th>
              <th className="px-3 py-2 text-center text-xs font-[Poppins] text-gray-700">
                Bobot (%)
              </th>
              <th className="px-3 py-2 text-center text-xs font-[Poppins] text-gray-700">
                Nilai (0-100)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {CRITERIA_CONFIG.map((crit) => (
              <tr key={crit.key}>
                <td className="px-3 py-2 text-xs text-gray-800 font-[Roboto]">
                  {crit.label}
                </td>
                <td className="px-3 py-2 text-center text-xs text-gray-700 font-[Roboto]">
                  {crit.weight}%
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeForm[roleKey][crit.key] ?? ""}
                    onChange={(e) =>
                      handleScoreChange(
                        roleKey,
                        crit.key,
                        e.target.value === "" ? "" : e.target.value
                      )
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right font-[Roboto] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const liveAggregate = computeAggregateFromForm(gradeForm);
  const liveScore = liveAggregate?.overallScore;
  const liveLetter = liveAggregate?.letter;

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">
                Rekapitulasi Nilai Sidang
              </h1>
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
                <label className="text-sm text-gray-700 font-[Roboto]">
                  Semester Sidang
                </label>
                <div className="relative">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                  >
                    <option value="Gasal 2025/2026 (Aktif)">
                      Gasal 2025/2026 (Aktif)
                    </option>
                    <option value="Genap 2024/2025">Genap 2024/2025</option>
                    <option value="Gasal 2024/2025">Gasal 2024/2025</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Jenis Sidang Filter */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-[Roboto]">
                  Jenis Sidang
                </label>
                <div className="relative">
                  <select
                    value={selectedJenis}
                    onChange={(e) => setSelectedJenis(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
                  >
                    <option value="Sidang Proposal">Sidang Proposal</option>
                    <option value="Sidang Tugas Akhir">
                      Sidang Tugas Akhir
                    </option>
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
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                      Mahasiswa
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                      Judul
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                      Periode Sidang
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                      Hasil dan Kehadiran Sidang
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                      Nilai
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <p className="text-gray-500 font-[Roboto]">
                          Tidak ada data yang ditemukan
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm text-gray-700 font-[Roboto]">
                          {index + 1}.
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-gray-800 font-[Poppins] font-medium">
                              {student.nama}
                            </p>
                            <p className="text-xs text-gray-500 font-[Roboto]">
                              {student.nrp}
                            </p>
                            <p className="text-xs text-gray-500 font-[Roboto]">
                              Lab : {student.lab}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-md">
                          <div
                            className={`inline-block px-2 py-1 rounded text-xs mb-2 font-[Roboto] ${getHasilColor(
                              student.hasil
                            )}`}
                          >
                            {student.hasil}
                          </div>
                          <p className="text-sm text-gray-800 font-[Poppins] mb-1">
                            {student.judulTA}
                          </p>
                          <p className="text-xs text-gray-500 font-[Roboto] italic">
                            {student.judulTAEn}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 font-[Roboto]">
                          {student.periodeSidang}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => openAttendanceModal(student)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm text-gray-700"
                          >
                            Hasil & Kehadiran
                          </button>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 font-[Poppins] font-medium">
                          {nilaiOverrides[student.id] ?? student.nilai}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => openGradeModal(student)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm text-gray-700"
                          >
                            <Pencil className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
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
                      onClick={() =>
                        setModalData({ ...modalData, hasil: "Diterima" })
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        modalData.hasil === "Diterima"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            modalData.hasil === "Diterima"
                              ? "border-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {modalData.hasil === "Diterima" && (
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">
                          Diterima
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        setModalData({
                          ...modalData,
                          hasil: "Diterima dengan revisi minor",
                        })
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        modalData.hasil === "Diterima dengan revisi minor"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            modalData.hasil === "Diterima dengan revisi minor"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {modalData.hasil ===
                            "Diterima dengan revisi minor" && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">
                          Diterima dengan revisi minor
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        setModalData({
                          ...modalData,
                          hasil: "Diterima dengan revisi mayor",
                        })
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        modalData.hasil === "Diterima dengan revisi mayor"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            modalData.hasil ===
                            "Diterima dengan revisi mayor"
                              ? "border-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {modalData.hasil ===
                            "Diterima dengan revisi mayor" && (
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">
                          Diterima dengan revisi mayor
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        setModalData({ ...modalData, hasil: "Ditolak" })
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        modalData.hasil === "Ditolak"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            modalData.hasil === "Ditolak"
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {modalData.hasil === "Ditolak" && (
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">
                          Ditolak
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 font-[Roboto]">
                    <strong>
                      Tentukan kehadiran dosen pada sidang ini.
                    </strong>{" "}
                    Kehadiran akan mempengaruhi perhitungan nilai akhir
                  </p>
                </div>

                {/* Supervisor Attendance Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                          No.
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                          Nama
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700">
                          Jenis Dosen
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-700">
                          Kehadiran
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Pembimbing 1 */}
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          1.
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">
                          {selectedStudent.supervisors.pembimbing1.nama}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          Pembimbing 1
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="pembimbing1"
                                checked={
                                  modalData.supervisorAttendance.pembimbing1 ===
                                  true
                                }
                                onChange={() =>
                                  setModalData({
                                    ...modalData,
                                    supervisorAttendance: {
                                      ...modalData.supervisorAttendance,
                                      pembimbing1: true,
                                    },
                                  })
                                }
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">
                                Hadir
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="pembimbing1"
                                checked={
                                  modalData.supervisorAttendance.pembimbing1 ===
                                  false
                                }
                                onChange={() =>
                                  setModalData({
                                    ...modalData,
                                    supervisorAttendance: {
                                      ...modalData.supervisorAttendance,
                                      pembimbing1: false,
                                    },
                                  })
                                }
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">
                                Tidak hadir
                              </span>
                            </label>
                          </div>
                        </td>
                      </tr>

                      {/* Penguji 1 */}
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          2.
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">
                          {selectedStudent.supervisors.penguji1.nama}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          Penguji 1
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="penguji1"
                                checked={
                                  modalData.supervisorAttendance.penguji1 ===
                                  true
                                }
                                onChange={() =>
                                  setModalData({
                                    ...modalData,
                                    supervisorAttendance: {
                                      ...modalData.supervisorAttendance,
                                      penguji1: true,
                                    },
                                  })
                                }
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">
                                Hadir
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="penguji1"
                                checked={
                                  modalData.supervisorAttendance.penguji1 ===
                                  false
                                }
                                onChange={() =>
                                  setModalData({
                                    ...modalData,
                                    supervisorAttendance: {
                                      ...modalData.supervisorAttendance,
                                      penguji1: false,
                                    },
                                  })
                                }
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">
                                Tidak hadir
                              </span>
                            </label>
                          </div>
                        </td>
                      </tr>

                      {/* Penguji 2 */}
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          3.
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">
                          {selectedStudent.supervisors.penguji2.nama}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto]">
                          Penguji 2
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="penguji2"
                                checked={
                                  modalData.supervisorAttendance.penguji2 ===
                                  true
                                }
                                onChange={() =>
                                  setModalData({
                                    ...modalData,
                                    supervisorAttendance: {
                                      ...modalData.supervisorAttendance,
                                      penguji2: true,
                                    },
                                  })
                                }
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">
                                Hadir
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="penguji2"
                                checked={
                                  modalData.supervisorAttendance.penguji2 ===
                                  false
                                }
                                onChange={() =>
                                  setModalData({
                                    ...modalData,
                                    supervisorAttendance: {
                                      ...modalData.supervisorAttendance,
                                      penguji2: false,
                                    },
                                  })
                                }
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm font-[Roboto] text-gray-700">
                                Tidak hadir
                              </span>
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

      {/* Grade Modal */}
      <AnimatePresence>
        {isGradeModalOpen && gradeModalStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setIsGradeModalOpen(false);
                setGradeModalStudent(null);
              }}
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl text-gray-800 font-[Poppins]">
                    Edit Nilai Sidang
                  </h2>
                  <button
                    onClick={() => {
                      setIsGradeModalOpen(false);
                      setGradeModalStudent(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Student Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-800 font-[Poppins]">
                    {gradeModalStudent.nama}{" "}
                    <span className="text-gray-500 font-[Roboto]">
                      ({gradeModalStudent.nrp})
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 font-[Roboto]">
                    {gradeModalStudent.judulTA}
                  </p>
                </div>

                <p className="text-sm text-gray-600 font-[Roboto] mb-4">
                  Atur nilai per dosen berdasarkan 4 kriteria penilaian dengan
                  bobot masing-masing. Pemberi nilai adalah{" "}
                  <strong>Penguji 1, Penguji 2, dan Pembimbing 1</strong>. Nilai
                  akhir akan dihitung otomatis dari rata-rata berbobot seluruh
                  dosen.
                </p>

                {/* Live score & index */}
                <div className="flex justify-end mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                    <span className="text-xs text-gray-500 font-[Roboto]">
                      Nilai akhir sementara
                    </span>
                    <span className="text-sm font-[Poppins] text-gray-900">
                      {liveScore !== undefined
                        ? liveScore.toFixed(2)
                        : "--"}
                    </span>
                    <span className="text-xs font-[Poppins] text-gray-700">
                      {liveLetter ?? ""}
                    </span>
                  </div>
                </div>

                {/* Lecturer Sections */}
                {renderLecturerSection(
                  "pembimbing1",
                  "Pembimbing 1",
                  gradeModalStudent.supervisors.pembimbing1.nama
                )}
                {renderLecturerSection(
                  "penguji1",
                  "Penguji 1",
                  gradeModalStudent.supervisors.penguji1.nama
                )}
                {renderLecturerSection(
                  "penguji2",
                  "Penguji 2",
                  gradeModalStudent.supervisors.penguji2.nama
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end mt-2">
                  <button
                    onClick={() => {
                      setIsGradeModalOpen(false);
                      setGradeModalStudent(null);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-[Roboto] text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveGrades}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
                  >
                    Simpan Nilai
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
            description:
              "Halaman ini menampilkan rekapitulasi nilai sidang mahasiswa. Gunakan filter semester dan jenis sidang untuk melihat data yang spesifik. Anda dapat mencari mahasiswa berdasarkan nama, NRP, atau judul tugas akhir menggunakan kolom pencarian.",
            imageUrl:
              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnQlMjBib2FyZHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Hasil dan Kehadiran Sidang",
            description:
              "Klik tombol 'Hasil & Kehadiran' untuk mencatat hasil sidang dan kehadiran dosen. Pilih salah satu dari 4 opsi hasil: Diterima, Diterima dengan revisi minor, Diterima dengan revisi mayor, atau Ditolak. Tentukan juga kehadiran setiap dosen penguji dan pembimbing.",
            imageUrl:
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2UlMjBzZXR0aW5nc3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Download Excel",
            description:
              "Gunakan tombol 'Download Excel' untuk mengekspor data rekapitulasi nilai ke dalam format spreadsheet. File Excel akan berisi semua informasi sidang termasuk nama mahasiswa, judul, hasil sidang, dan nilai akhir.",
            imageUrl:
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmVzcyUyMHRyYWNraW5nfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Interpretasi Nilai",
            description:
              "Nilai ditampilkan dalam format angka dan indeks huruf (A, AB, B, BC, C, Tidak Lulus) berdasarkan rentang 0-100. Pastikan semua nilai sudah dicatat dengan benar sebelum periode sidang berakhir.",
            imageUrl:
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwZGVzayUyMGxhcHRvcHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
        ]}
      />
    </>
  );
}