import { useState } from "react";
import {
  BookOpen,
  Users,
  Search,
  ChevronDown,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Check,
  ChevronUp,
  MessageSquare,
  FileCheck,
  Gavel,
  Filter,
} from "lucide-react";
import { GuideModal } from "./GuideModal";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface BimbinganEntry {
  id: number;
  ke: number;
  beritaAcara: string;
  waktu: string; // ISO atau string biasa
  status: "Menunggu" | "Disetujui";
}

// Tambahan interface untuk history kegagalan timeline
interface FailedHistory {
  stepIndex: number;
  date: string;
  note: string;
}

interface Student {
  id: number;
  nrp: string;
  nama: string;
  angkatan: string;
  jenjang: string;
  judulTA: string;
  abstrak: string;
  lab: string;
  pembimbing1: string;
  pembimbing2: string;
  tahap: "Proposal" | "Tugas Akhir";
  progress: number;
  status:
    | "Proposal"
    | "Sidang Proposal"
    | "Revisi Proposal"
    | "Tugas Akhir"
    | "Sidang Tugas Akhir"
    | "Revisi Tugas Akhir"
    | "Selesai";
  jumlahBimbingan: number;
  needsApproval: boolean;
  timelineDates?: (string | null)[];
  failedHistory?: FailedHistory[]; // New: Untuk skenario gagal
  bimbinganLog?: BimbinganEntry[];
}

interface TopicProposal {
  id: number;
  nama: string;
  nrp: string;
  angkatan: string;
  judul: string;
  abstrak: string;
  tanggalAjuan: string;
}

interface BimbinganAktifProps {
  initialView?: "default" | "ajuanTopik" | "approval";
}

// 13 langkah timeline proses bimbingan
const TIMELINE_STEPS: { label: string }[] = [
  { label: "Mendaftar proposal TA" }, // 0
  { label: "Proposal TA disetujui" }, // 1 (Approval TA)
  { label: "Mendaftar sidang proposal TA" }, // 2
  { label: "Daftar sidang proposal TA disetujui" }, // 3 (Approval Sidang)
  { label: "Sidang proposal TA selesai" }, // 4
  { label: "Revisi sidang proposal TA disetujui" }, // 5 (Approval Revisi)
  { label: "Mendaftar tugas akhir" }, // 6
  { label: "Tugas akhir disetujui" }, // 7 (Approval TA)
  { label: "Mendaftar sidang tugas akhir" }, // 8
  { label: "Daftar Sidang tugas akhir disetujui" }, // 9 (Approval Sidang)
  { label: "Sidang tugas akhir selesai" }, // 10
  { label: "Revisi tugas akhir disetujui" }, // 11 (Approval Revisi)
  { label: "Selesai" }, // 12
];

// UPDATED: Pasangan approval mencakup TA, Sidang, dan Revisi
const APPROVAL_PAIRS = [
  { beforeIndex: 0, approvalIndex: 1, type: "TA" }, // Proposal TA
  { beforeIndex: 2, approvalIndex: 3, type: "Sidang" }, // Sidang Prop
  { beforeIndex: 4, approvalIndex: 5, type: "Revisi" }, // Revisi Prop (NEW)
  { beforeIndex: 6, approvalIndex: 7, type: "TA" }, // Tugas Akhir
  { beforeIndex: 8, approvalIndex: 9, type: "Sidang" }, // Sidang TA
  { beforeIndex: 10, approvalIndex: 11, type: "Revisi" }, // Revisi TA (NEW)
];

// Helper: cari index step terakhir yang punya tanggal (dianggap sudah selesai)
const getCurrentStepIndex = (student: Student): number => {
  if (!student.timelineDates || student.timelineDates.length === 0) return -1;
  let idx = -1;
  const len = Math.min(student.timelineDates.length, TIMELINE_STEPS.length);
  for (let i = 0; i < len; i++) {
    if (student.timelineDates[i]) idx = i;
  }
  return idx;
};

// Hidden state "perlu approval" dari timeline
const hasHiddenApprovalState = (student: Student): boolean => {
  const dates = student.timelineDates || [];
  return APPROVAL_PAIRS.some(({ beforeIndex, approvalIndex }) => {
    // Jika step 'before' sudah ada tanggal, tapi step 'approval' belum
    return !!dates[beforeIndex] && !dates[approvalIndex];
  });
};

// Helper: Mendapatkan tipe approval yang sedang pending (TA, Sidang, atau Revisi)
const getPendingApprovalType = (
  student: Student
): "TA" | "Sidang" | "Revisi" | null => {
  const dates = student.timelineDates || [];
  const pair = APPROVAL_PAIRS.find(({ beforeIndex, approvalIndex }) => {
    return !!dates[beforeIndex] && !dates[approvalIndex];
  });
  return pair ? (pair.type as "TA" | "Sidang" | "Revisi") : null;
};

// Progress bar berdasarkan posisi di timeline
const getTimelineProgress = (student: Student): number => {
  const idx = getCurrentStepIndex(student);
  if (idx < 0) return 0;
  const progress = ((idx + 1) / TIMELINE_STEPS.length) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
};

// Status (badge + filter) disesuaikan dengan fase di 13 timeline
const getStatusFromTimeline = (student: Student): Student["status"] => {
  const idx = getCurrentStepIndex(student);

  if (idx < 0) return "Proposal";
  if (idx >= 0 && idx <= 1) return "Proposal";
  if (idx >= 2 && idx <= 4) return "Sidang Proposal";
  if (idx === 5) return "Revisi Proposal";
  if (idx >= 6 && idx <= 7) return "Tugas Akhir";
  if (idx >= 8 && idx <= 10) return "Sidang Tugas Akhir";
  if (idx === 11) return "Revisi Tugas Akhir";
  return "Selesai";
};

// Format tampilan tanggal di bawah bullet
const formatTimelineDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "Belum selesai";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateTimeStr: string): string => {
  const d = new Date(dateTimeStr);
  if (isNaN(d.getTime())) return dateTimeStr;
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Approve hidden-state: mengisi tanggal step approval yang lagi nyangkut
const approveHiddenState = (student: Student): Student => {
  const len = TIMELINE_STEPS.length;
  const dates = student.timelineDates
    ? [...student.timelineDates]
    : new Array(len).fill(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  for (const { beforeIndex, approvalIndex } of APPROVAL_PAIRS) {
    if (beforeIndex < len && approvalIndex < len) {
      if (dates[beforeIndex] && !dates[approvalIndex]) {
        dates[approvalIndex] = todayStr;
        break;
      }
    }
  }

  return {
    ...student,
    timelineDates: dates,
  };
};

const getPendingBimbinganCount = (student: Student): number => {
  if (!student.bimbinganLog) return 0;
  return student.bimbinganLog.filter((b) => b.status === "Menunggu").length;
};

const getApprovedBimbinganCount = (student: Student): number => {
  if (!student.bimbinganLog) return student.jumlahBimbingan;
  return student.bimbinganLog.filter((b) => b.status === "Disetujui").length;
};

export function BimbinganAktif({ initialView = "default" }: BimbinganAktifProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedJenjang, setSelectedJenjang] = useState<
    "Semua" | "S1" | "S2" | "S3"
  >("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  // FILTER BARU: Approval Only
  const [approvalFilter, setApprovalFilter] = useState<
    "Semua" | "Perlu Approval"
  >("Semua");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Modal Approve Bimbingan
  const [selectedBimbinganStudent, setSelectedBimbinganStudent] =
    useState<Student | null>(null);
  const [showBimbinganModal, setShowBimbinganModal] = useState(false);

  // dari beranda
  const [expandedAjuan, setExpandedAjuan] = useState(
    initialView === "ajuanTopik"
  );
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicProposal | null>(
    null
  );
  const [showTopicDetailModal, setShowTopicDetailModal] = useState(false);
  const [filterMode] = useState<"all" | "approval" | "ready">(
    initialView === "approval" ? "approval" : "all"
  );
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // DATA MAHASISWA (UPDATED WITH RICH BIMBINGAN DATA)
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      nrp: "5025223002",
      nama: "Andi Pratama",
      angkatan: "2020",
      jenjang: "S1",
      judulTA:
        "RANCANG BANGUN SISTEM MONITORING BIMBINGAN TUGAS AKHIR BERBASIS WEB",
      abstrak:
        "Penelitian ini bertujuan untuk merancang dan membangun sistem monitoring bimbingan tugas akhir.",
      lab: "Laboratorium Rekayasa Perangkat Lunak",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Proposal",
      status: "Sidang Proposal",
      progress: 40,
      jumlahBimbingan: 4,
      needsApproval: true,
      timelineDates: [
        "2025-01-02",
        "2025-01-05",
        "2025-01-10",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      // DATA BIMBINGAN: 3 Approved, 1 Waiting
      bimbinganLog: [
        {
          id: 101,
          ke: 1,
          beritaAcara: "Diskusi awal penentuan topik dan judul.",
          waktu: "2024-12-01T09:00:00",
          status: "Disetujui",
        },
        {
          id: 102,
          ke: 2,
          beritaAcara: "Review Bab 1 Latar Belakang Masalah.",
          waktu: "2024-12-15T10:00:00",
          status: "Disetujui",
        },
        {
          id: 103,
          ke: 3,
          beritaAcara: "Review Bab 2 Tinjauan Pustaka.",
          waktu: "2024-12-28T13:00:00",
          status: "Disetujui",
        },
        {
          id: 104,
          ke: 4,
          beritaAcara: "Finalisasi Proposal sebelum sidang.",
          waktu: "2025-01-11T09:00:00",
          status: "Menunggu", // PENDING
        },
      ],
    },
    {
      id: 2,
      nrp: "5025201015",
      nama: "Siti Aminah Putri",
      angkatan: "2020",
      jenjang: "S1",
      judulTA: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia",
      abstrak:
        "Aplikasi mobile yang dirancang untuk memudahkan monitoring kesehatan lansia.",
      lab: "Laboratorium Sistem Informasi",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Proposal",
      status: "Proposal",
      progress: 10,
      jumlahBimbingan: 2,
      needsApproval: true,
      timelineDates: [
        "2025-01-03",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      // DATA BIMBINGAN: 1 Approved, 1 Waiting
      bimbinganLog: [
        {
          id: 201,
          ke: 1,
          beritaAcara: "Pengajuan judul dan diskusi fitur aplikasi.",
          waktu: "2025-01-04T14:00:00",
          status: "Disetujui",
        },
        {
          id: 202,
          ke: 2,
          beritaAcara: "Penyusunan kerangka pemikiran Proposal.",
          waktu: "2025-01-12T08:30:00",
          status: "Menunggu", // PENDING
        },
      ],
    },
    {
      id: 3,
      nrp: "6025201002",
      nama: "Bayu Aditya Pratama",
      angkatan: "2020",
      jenjang: "S2",
      judulTA: "Analisis Sentimen Media Sosial Menggunakan Deep Learning",
      abstrak:
        "Penelitian ini menggunakan teknik deep learning untuk menganalisis sentimen.",
      lab: "Laboratorium Kecerdasan Buatan",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Tugas Akhir",
      status: "Revisi Tugas Akhir",
      progress: 90,
      jumlahBimbingan: 10,
      needsApproval: true,
      timelineDates: [
        "2024-09-01",
        "2024-09-10",
        "2024-09-20",
        "2024-09-25",
        "2024-10-01",
        "2024-10-05",
        "2024-10-15",
        "2024-10-25",
        "2024-11-01",
        "2024-11-05",
        "2024-11-10",
        null,
        null,
      ],
      // DATA BIMBINGAN: All Approved (Revisi Approval needed in timeline, not bimbingan log per se, but added one pending log for flavor)
      bimbinganLog: [
        { id: 301, ke: 1, beritaAcara: "Bimbingan 1", waktu: "2024-09-02T10:00:00", status: "Disetujui" },
        { id: 302, ke: 2, beritaAcara: "Bimbingan 2", waktu: "2024-09-15T10:00:00", status: "Disetujui" },
        { id: 303, ke: 3, beritaAcara: "Bimbingan 3", waktu: "2024-10-01T10:00:00", status: "Disetujui" },
        { id: 304, ke: 4, beritaAcara: "Bimbingan 4", waktu: "2024-10-15T10:00:00", status: "Disetujui" },
        { id: 305, ke: 5, beritaAcara: "Bimbingan 5", waktu: "2024-11-01T10:00:00", status: "Disetujui" },
        { id: 306, ke: 6, beritaAcara: "Bimbingan 6", waktu: "2024-11-15T10:00:00", status: "Disetujui" },
        { id: 307, ke: 7, beritaAcara: "Bimbingan 7", waktu: "2024-11-20T10:00:00", status: "Disetujui" },
        { id: 308, ke: 8, beritaAcara: "Bimbingan 8", waktu: "2024-12-01T10:00:00", status: "Disetujui" },
        { id: 309, ke: 9, beritaAcara: "Bimbingan 9", waktu: "2024-12-10T10:00:00", status: "Disetujui" },
        {
          id: 310,
          ke: 10,
          beritaAcara: "Laporan Revisi Final Pasca Sidang.",
          waktu: "2024-12-28T10:00:00",
          status: "Menunggu", // PENDING
        },
      ],
    },
    // SCENARIO BARU: GAGAL TIMELINE
    {
      id: 6,
      nrp: "5025201099",
      nama: "Fajar Santoso (Gagal & Ulang)",
      angkatan: "2020",
      jenjang: "S1",
      judulTA: "Implementasi Blockchain pada Sistem Supply Chain Management",
      abstrak: "Penerapan smart contract untuk transparansi data logistik.",
      lab: "Laboratorium Komputasi Berbasis Jaringan",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Proposal",
      status: "Sidang Proposal",
      progress: 35,
      jumlahBimbingan: 6,
      needsApproval: false,
      failedHistory: [
        {
          stepIndex: 4, // Gagal saat Sidang Proposal
          date: "2024-12-20",
          note: "Tidak lulus sidang proposal, harus mengulang.",
        },
      ],
      timelineDates: [
        "2024-11-01",
        "2024-11-05",
        "2024-11-10",
        "2024-11-15",
        "2025-01-12",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      // DATA BIMBINGAN: Mix of old (before fail) and new (after fail)
      bimbinganLog: [
        {
          id: 601,
          ke: 1,
          beritaAcara: "Penentuan Topik (Lama).",
          waktu: "2024-11-02T10:00:00",
          status: "Disetujui",
        },
        {
          id: 602,
          ke: 2,
          beritaAcara: "Bab 1 & 2 (Lama).",
          waktu: "2024-11-20T10:00:00",
          status: "Disetujui",
        },
        {
          id: 603,
          ke: 3,
          beritaAcara: "Persiapan Sidang (Gagal).",
          waktu: "2024-12-15T10:00:00",
          status: "Disetujui",
        },
        // --- GAGAL SIDANG 20 DESEMBER ---
        {
          id: 604,
          ke: 4,
          beritaAcara: "Evaluasi kegagalan sidang dan perbaikan mayor.",
          waktu: "2024-12-22T10:00:00",
          status: "Disetujui",
        },
        {
          id: 605,
          ke: 5,
          beritaAcara: "Penyusunan ulang Bab 3 & 4.",
          waktu: "2025-01-05T10:00:00",
          status: "Disetujui",
        },
        {
          id: 606,
          ke: 6,
          beritaAcara: "Cek kesiapan sidang ulang.",
          waktu: "2025-01-10T10:00:00",
          status: "Menunggu", // PENDING
        },
      ],
    },
  ]);

  // DATA AJUAN TOPIK
  const [topicProposals, setTopicProposals] = useState<TopicProposal[]>([
    {
      id: 1,
      nama: "Muhammad Rizki",
      nrp: "5025201030",
      angkatan: "2020",
      judul: "Sistem Informasi Perpustakaan Digital Berbasis Cloud",
      abstrak:
        "Sistem perpustakaan digital yang menggunakan teknologi cloud computing.",
      tanggalAjuan: "2024-12-01",
    },
    {
      id: 2,
      nama: "Farah Nabila",
      nrp: "5025201031",
      angkatan: "2020",
      judul: "Aplikasi E-Learning dengan Gamifikasi",
      abstrak: "Platform e-learning yang menerapkan konsep gamifikasi.",
      tanggalAjuan: "2024-12-02",
    },
  ]);

  const createStudentFromTopic = (
    topic: TopicProposal,
    id: number
  ): Student => {
    const len = TIMELINE_STEPS.length;
    return {
      id,
      nrp: topic.nrp,
      nama: topic.nama,
      angkatan: topic.angkatan,
      jenjang: "S1",
      judulTA: topic.judul,
      abstrak: topic.abstrak,
      lab: "Belum ditentukan",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Proposal",
      status: "Proposal",
      progress: 0,
      jumlahBimbingan: 0,
      needsApproval: false,
      timelineDates: [
        new Date().toISOString().slice(0, 10),
        ...new Array(len - 1).fill(null),
      ],
      bimbinganLog: [],
    };
  };

  // --- LOGIC FILTERING UPDATED ---
  let filteredStudents = students.filter((student) => {
    const derivedStatus = getStatusFromTimeline(student);
    const pendingBimbingan = getPendingBimbinganCount(student);
    const needsHiddenApproval = hasHiddenApprovalState(student);

    const matchesJenjang =
      selectedJenjang === "Semua" || student.jenjang === selectedJenjang;
    const matchesStatus =
      selectedStatus === "Semua" || derivedStatus === selectedStatus;
    const matchesSearch =
      student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nrp.includes(searchQuery) ||
      student.judulTA.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter baru: Perlu Approval
    let matchesApproval = true;
    if (approvalFilter === "Perlu Approval") {
      matchesApproval = needsHiddenApproval || pendingBimbingan > 0;
    }

    // Filter legacy mode (opsional)
    let matchesLegacyMode = true;
    if (filterMode === "approval") {
      matchesLegacyMode = needsHiddenApproval;
    }

    return (
      matchesJenjang &&
      matchesStatus &&
      matchesSearch &&
      matchesApproval &&
      matchesLegacyMode
    );
  });

  const getTahapColor = (tahap: Student["tahap"]) => {
    if (tahap === "Proposal")
      return "bg-blue-50 border-blue-200 text-blue-700";
    if (tahap === "Tugas Akhir")
      return "bg-green-50 border-green-200 text-green-700";
    return "bg-gray-50 border-gray-200 text-gray-700";
  };

  const getStatusColor = (status: Student["status"]) => {
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

  const getStatusIcon = (status: Student["status"]) => {
    switch (status) {
      case "Proposal":
      case "Tugas Akhir":
        return <Clock className="w-4 h-4" />;
      case "Sidang Proposal":
      case "Sidang Tugas Akhir":
        return <Calendar className="w-4 h-4" />;
      case "Revisi Proposal":
      case "Revisi Tugas Akhir":
        return <AlertCircle className="w-4 h-4" />;
      case "Selesai":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleOpenBimbinganModal = (student: Student) => {
    setSelectedBimbinganStudent(student);
    setShowBimbinganModal(true);
  };

  // --- APPROVAL LOGIC ---
  const handleApproveTopics = () => {
    if (selectedTopics.length === 0) {
      toast.error("Pilih minimal satu topik untuk disetujui");
      return;
    }
    const topicsToApprove = topicProposals.filter((t) =>
      selectedTopics.includes(t.id)
    );
    const baseId = Date.now();
    const newStudentsFromTopics = topicsToApprove.map((topic, index) =>
      createStudentFromTopic(topic, baseId + index)
    );
    setStudents((prev) => [...newStudentsFromTopics, ...prev]);
    setTopicProposals((prev) =>
      prev.filter((t) => !selectedTopics.includes(t.id))
    );
    toast.success(`${selectedTopics.length} topik berhasil disetujui`);
    setSelectedTopics([]);
  };

  const handleApproveSingle = (id: number) => {
    const topic = topicProposals.find((t) => t.id === id);
    if (!topic) return;
    const newId = Date.now();
    const newStudent = createStudentFromTopic(topic, newId);
    setStudents((prev) => [newStudent, ...prev]);
    setTopicProposals((prev) => prev.filter((t) => t.id !== id));
    toast.success("Topik berhasil disetujui");
  };

  const toggleSelectTopic = (id: number) => {
    if (selectedTopics.includes(id))
      setSelectedTopics(selectedTopics.filter((t) => t !== id));
    else setSelectedTopics([...selectedTopics, id]);
  };

  const toggleSelectAll = () => {
    if (selectedTopics.length === topicProposals.length) setSelectedTopics([]);
    else setSelectedTopics(topicProposals.map((t) => t.id));
  };

  const handleViewTopicDetail = (topic: TopicProposal) => {
    setSelectedTopic(topic);
    setShowTopicDetailModal(true);
  };

  const handleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id))
      setSelectedStudents(selectedStudents.filter((s) => s !== id));
    else setSelectedStudents([...selectedStudents, id]);
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length)
      setSelectedStudents([]);
    else setSelectedStudents(filteredStudents.map((s) => s.id));
  };

  const handleBatchApproval = () => {
    if (selectedStudents.length === 0) {
      toast.error("Pilih minimal satu mahasiswa");
      return;
    }
    const approvedCount = selectedStudents.length;
    setStudents((prev) => {
      const selected = prev.filter((s) => selectedStudents.includes(s.id));
      const others = prev.filter((s) => !selectedStudents.includes(s.id));
      const approvedUpdated = selected.map((s) => approveHiddenState(s));
      return [...approvedUpdated, ...others];
    });
    setSelectedStudents([]);
    toast.success(`${approvedCount} mahasiswa berhasil disetujui`);
  };

  // SINGLE APPROVAL DARI MODAL (UPDATED LOGIC)
  const handleApproveStudent = (studentId: number) => {
    let updatedStudent: Student | null = null;
    setStudents((prev) => {
      const updatedList: Student[] = [];
      prev.forEach((s) => {
        if (s.id === studentId) {
          const updated = approveHiddenState(s);
          updatedStudent = updated;
          updatedList.unshift(updated);
        } else {
          updatedList.push(s);
        }
      });
      return updatedList;
    });
    if (updatedStudent) setSelectedStudent(updatedStudent);
    setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    toast.success("Status mahasiswa berhasil diperbarui ke tahap selanjutnya");
  };

  const handleApproveSingleBimbingan = (
    studentId: number,
    entryId: number
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId || !s.bimbinganLog) return s;
        const updatedLog = s.bimbinganLog.map((b) =>
          b.id === entryId ? { ...b, status: "Disetujui" as const } : b
        );
        const approvedCount = updatedLog.filter(
          (b) => b.status === "Disetujui"
        ).length;
        return {
          ...s,
          bimbinganLog: updatedLog,
          jumlahBimbingan: approvedCount,
        };
      })
    );
    // Update local state di modal bimbingan
    if (
      selectedBimbinganStudent &&
      selectedBimbinganStudent.id === studentId &&
      selectedBimbinganStudent.bimbinganLog
    ) {
      const updatedLog = selectedBimbinganStudent.bimbinganLog.map((b) =>
        b.id === entryId ? { ...b, status: "Disetujui" as const } : b
      );
      const approvedCount = updatedLog.filter(
        (b) => b.status === "Disetujui"
      ).length;
      setSelectedBimbinganStudent({
        ...selectedBimbinganStudent,
        bimbinganLog: updatedLog,
        jumlahBimbingan: approvedCount,
      });
      toast.success("Bimbingan disetujui");
    }
  };

  const handleApproveAllBimbingan = (studentId: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId || !s.bimbinganLog) return s;
        const updatedLog = s.bimbinganLog.map((b) =>
          b.status === "Menunggu"
            ? { ...b, status: "Disetujui" as const }
            : b
        );
        const approvedCount = updatedLog.filter(
          (b) => b.status === "Disetujui"
        ).length;
        return {
          ...s,
          bimbinganLog: updatedLog,
          jumlahBimbingan: approvedCount,
        };
      })
    );

    if (
      selectedBimbinganStudent &&
      selectedBimbinganStudent.id === studentId &&
      selectedBimbinganStudent.bimbinganLog
    ) {
      const updatedLog = selectedBimbinganStudent.bimbinganLog.map((b) =>
        b.status === "Menunggu" ? { ...b, status: "Disetujui" as const } : b
      );
      const approvedCount = updatedLog.filter(
        (b) => b.status === "Disetujui"
      ).length;
      setSelectedBimbinganStudent({
        ...selectedBimbinganStudent,
        bimbinganLog: updatedLog,
        jumlahBimbingan: approvedCount,
      });
      toast.success("Semua bimbingan disetujui");
    }
  };

  const s1Count = students.filter((s) => s.jenjang === "S1").length;
  const s2Count = students.filter((s) => s.jenjang === "S2").length;
  const s3Count = students.filter((s) => s.jenjang === "S3").length;

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">
              Bimbingan Aktif
            </h1>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-[Poppins]">Panduan Penggunaan</span>
            </button>
          </div>
          <p className="text-gray-500 font-[Roboto]">
            Kelola mahasiswa bimbingan Anda
          </p>
        </div>

        {/* Ajuan Topik Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-gray-800 font-[Poppins] text-lg">
                Ajuan Topik
              </h2>
              {topicProposals.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-[Roboto] font-semibold">
                  {topicProposals.length}
                </span>
              )}
            </div>
            {expandedAjuan && selectedTopics.length > 0 && (
              <button
                onClick={handleApproveTopics}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Setujui Terpilih ({selectedTopics.length})
              </button>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedAjuan(!expandedAjuan)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-gray-800 font-[Poppins]">
                    Usulan Topik Menunggu Persetujuan
                  </h3>
                  <p className="text-sm text-gray-600 font-[Roboto]">
                    {topicProposals.length} usulan topik perlu direview
                  </p>
                </div>
              </div>
              {expandedAjuan ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <AnimatePresence>
              {expandedAjuan && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-6 bg-gray-50">
                    {topicProposals.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-[Roboto]">
                          Tidak ada usulan topik
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                          <input
                            type="checkbox"
                            checked={
                              selectedTopics.length === topicProposals.length
                            }
                            onChange={toggleSelectAll}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 font-[Roboto]">
                            Centang Semua
                          </span>
                        </div>
                        <div className="space-y-3">
                          {topicProposals.map((topic) => (
                            <div
                              key={topic.id}
                              className="bg-white border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-start gap-4">
                                <input
                                  type="checkbox"
                                  checked={selectedTopics.includes(topic.id)}
                                  onChange={() => toggleSelectTopic(topic.id)}
                                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="text-gray-800 font-[Poppins] mb-1">
                                        {topic.judul}
                                      </h4>
                                      <p className="text-sm text-gray-600 font-[Roboto]">
                                        {topic.nama} • {topic.nrp} • Angkatan{" "}
                                        {topic.angkatan}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-700 font-[Roboto] mb-3 line-clamp-2">
                                    {topic.abstrak}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-[Roboto]">
                                      Diajukan:{" "}
                                      {new Date(
                                        topic.tanggalAjuan
                                      ).toLocaleDateString("id-ID")}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          handleViewTopicDetail(topic)
                                        }
                                        className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-[Roboto] text-sm flex items-center gap-1"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        Lihat
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleApproveSingle(topic.id)
                                        }
                                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm flex items-center gap-1"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        Approve
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Statistics cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div
            onClick={() =>
              setSelectedJenjang((prev) => (prev === "S1" ? "Semua" : "S1"))
            }
            className={`rounded-lg border p-4 cursor-pointer transition-all ${
              selectedJenjang === "S1"
                ? "bg-blue-50 border-blue-300 shadow-md"
                : "bg-white border-gray-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">
                  Mahasiswa S1
                </p>
                <p className="text-2xl text-gray-800 font-[Poppins]">
                  {s1Count}
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() =>
              setSelectedJenjang((prev) => (prev === "S2" ? "Semua" : "S2"))
            }
            className={`rounded-lg border p-4 cursor-pointer transition-all ${
              selectedJenjang === "S2"
                ? "bg-green-50 border-green-300 shadow-md"
                : "bg-white border-gray-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">
                  Mahasiswa S2
                </p>
                <p className="text-2xl text-gray-800 font-[Poppins]">
                  {s2Count}
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() =>
              setSelectedJenjang((prev) => (prev === "S3" ? "Semua" : "S3"))
            }
            className={`rounded-lg border p-4 cursor-pointer transition-all ${
              selectedJenjang === "S3"
                ? "bg-purple-50 border-purple-300 shadow-md"
                : "bg-white border-gray-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">
                  Mahasiswa S3
                </p>
                <p className="text-2xl text-gray-800 font-[Poppins]">
                  {s3Count}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Approval UI (Muncul jika filter approval aktif) */}
        {approvalFilter === "Perlu Approval" && filteredStudents.length > 0 && (
          <div className="mb-6 flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedStudents.length === filteredStudents.length}
                onChange={handleSelectAllStudents}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-[Roboto]">
                Centang Semua ({filteredStudents.length} mahasiswa perlu
                approval)
              </span>
            </div>
            {selectedStudents.length > 0 && (
              <button
                onClick={handleBatchApproval}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Approve Terpilih ({selectedStudents.length})
              </button>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, NRP, atau judul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Status</option>
              <option value="Proposal">Proposal</option>
              <option value="Sidang Proposal">Sidang Proposal</option>
              <option value="Revisi Proposal">Revisi Proposal</option>
              <option value="Tugas Akhir">Tugas Akhir</option>
              <option value="Sidang Tugas Akhir">Sidang Tugas Akhir</option>
              <option value="Revisi Tugas Akhir">Revisi Tugas Akhir</option>
              <option value="Selesai">Selesai</option>
            </select>

            {/* NEW: Filter Approval */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
              <select
                value={approvalFilter}
                onChange={(e) =>
                  setApprovalFilter(
                    e.target.value as "Semua" | "Perlu Approval"
                  )
                }
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm appearance-none bg-white"
              >
                <option value="Semua">Semua Mahasiswa</option>
                <option value="Perlu Approval">Perlu Approval (Pending)</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const derivedStatus = getStatusFromTimeline(student);
            const progress = getTimelineProgress(student);
            const showHiddenApproval = hasHiddenApprovalState(student);
            const pendingBimbingan = getPendingBimbinganCount(student);
            const approvedBimbingan = getApprovedBimbinganCount(student);

            return (
              <div
                key={student.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {approvalFilter === "Perlu Approval" && (
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-gray-800 font-[Poppins]">
                            {student.nama}
                          </h3>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-[Roboto]">
                            {student.jenjang}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-[Roboto] border ${getStatusColor(
                              derivedStatus
                            )} flex items-center gap-1`}
                          >
                            {getStatusIcon(derivedStatus)}
                            {derivedStatus}
                          </span>
                          {showHiddenApproval && (
                            <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-[Roboto] font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Perlu Approval
                            </span>
                          )}
                          {pendingBimbingan > 0 && (
                            <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-[Roboto] font-semibold">
                              {pendingBimbingan} bimbingan baru
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 font-[Roboto] mb-1">
                          NRP: {student.nrp}
                        </p>
                        <p className="text-sm text-gray-800 font-[Roboto] mb-3">
                          {student.judulTA}
                        </p>

                        <div className="flex items-center gap-6">
                          <div
                            className={`px-3 py-2 rounded-lg border ${getTahapColor(
                              student.tahap
                            )} flex items-center gap-2`}
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-[Roboto]">
                              {student.tahap}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 font-[Roboto]">
                            <button
                              onClick={() => handleOpenBimbinganModal(student)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>
                                Bimbingan:{" "}
                                <span className="font-semibold">
                                  {approvedBimbingan}x
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewDetail(student)}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 font-[Roboto]">
                          Progress
                        </span>
                        <span className="text-xs text-gray-800 font-[Roboto] font-semibold">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-[Roboto]">
                Tidak ada mahasiswa ditemukan
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

      {/* Student Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowDetailModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">
                        {selectedStudent.nama}
                      </h2>
                      <p className="text-sm text-gray-600 font-[Roboto]">
                        NRP: {selectedStudent.nrp} • Posisi Anda: Pembimbing 1
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {(() => {
                  const derivedStatus = getStatusFromTimeline(selectedStudent);
                  const showHiddenApproval =
                    hasHiddenApprovalState(selectedStudent);
                  const approvalType = getPendingApprovalType(selectedStudent);

                  return (
                    <div className="mb-6 flex items-center gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-[Roboto] font-semibold ${getTahapColor(
                          selectedStudent.tahap
                        )}`}
                      >
                        {selectedStudent.tahap}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-[Roboto] font-semibold border ${getStatusColor(
                          derivedStatus
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(derivedStatus)}
                        {derivedStatus}
                      </span>
                      {showHiddenApproval && approvalType && (
                        <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-[Roboto] font-semibold">
                          Menunggu Approval {approvalType}
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* Info TA (Dengan Tombol Approve TA) */}
                <div className="mb-6">
                  <h3 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informasi Tugas Akhir
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    {/* Content Info TA */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                          Judul
                        </p>
                        <p className="text-sm text-gray-800 font-[Roboto]">
                          {selectedStudent.judulTA}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                          Lab
                        </p>
                        <p className="text-sm text-gray-800 font-[Roboto]">
                          {selectedStudent.lab}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                        Abstrak
                      </p>
                      <p className="text-sm text-gray-700 font-[Roboto]">
                        {selectedStudent.abstrak}
                      </p>
                    </div>

                    {/* APPROVAL SECTION: TA */}
                    {hasHiddenApprovalState(selectedStudent) &&
                      getPendingApprovalType(selectedStudent) === "TA" && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-white border border-blue-200 rounded p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                <FileCheck className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800 font-[Poppins]">
                                  Persetujuan Dokumen TA
                                </p>
                                <p className="text-xs text-gray-500 font-[Roboto]">
                                  Mahasiswa mengajukan dokumen untuk disetujui.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleApproveStudent(selectedStudent.id)
                              }
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-[Roboto] flex items-center gap-1 transition-colors"
                            >
                              <Check className="w-4 h-4" /> Setujui TA
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Timeline vertikal 13 langkah + timestamp + failed history */}
                <div className="mb-6">
                  <h3 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timeline Proses
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-4">
                      {TIMELINE_STEPS.map((step, idx) => {
                        const currentIndex =
                          getCurrentStepIndex(selectedStudent);
                        const isActive = currentIndex >= idx;
                        const isNextActive = currentIndex >= idx + 1;
                        const isLast = idx === TIMELINE_STEPS.length - 1;
                        const stepDate =
                          selectedStudent.timelineDates &&
                          selectedStudent.timelineDates[idx];

                        // Check failed history for this step
                        const failedEntry =
                          selectedStudent.failedHistory?.find(
                            (f) => f.stepIndex === idx
                          );

                        return (
                          <div key={step.label} className="relative">
                            {/* RENDER FAILED HISTORY IF EXISTS */}
                            {failedEntry && (
                              <div className="flex items-start gap-3 mb-4 opacity-70 grayscale-[0.5]">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-red-100 text-red-600 border border-red-200">
                                    <X className="w-4 h-4" />
                                  </div>
                                  <div className="w-px flex-1 mt-1 bg-red-300 min-h-[20px]" />
                                </div>
                                <div className="pt-1">
                                  <p className="text-xs font-[Roboto] text-red-700 font-semibold line-through">
                                    {step.label} (Gagal)
                                  </p>
                                  <p className="text-[10px] text-red-500 font-[Roboto] mt-1">
                                    {formatTimelineDate(failedEntry.date)} •{" "}
                                    {failedEntry.note}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* RENDER STANDARD STEP */}
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                    isActive
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-300 text-gray-600"
                                  }`}
                                >
                                  {isActive ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    idx + 1
                                  )}
                                </div>
                                {!isLast && (
                                  <div
                                    className={`w-px flex-1 mt-1 ${
                                      isNextActive
                                        ? "bg-blue-600"
                                        : "bg-gray-300"
                                    } min-h-[20px]`}
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Info Sidang (Dengan Tombol Approve Sidang) */}
                <div className="mb-6">
                  <h3 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                    <Gavel className="w-5 h-5" />
                    Informasi Sidang
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-[Roboto]">
                          Jadwal Sidang
                        </p>
                        <p className="text-sm text-gray-800 font-[Roboto]">
                          12 Januari 2026, 09.00 WIB
                        </p>
                      </div>
                    </div>

                    {/* APPROVAL SECTION: SIDANG */}
                    {hasHiddenApprovalState(selectedStudent) &&
                      getPendingApprovalType(selectedStudent) === "Sidang" && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-white border border-indigo-200 rounded p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
                                <Gavel className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800 font-[Poppins]">
                                  Persetujuan Sidang
                                </p>
                                <p className="text-xs text-gray-500 font-[Roboto]">
                                  Setujui jadwal dan pendaftaran sidang.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleApproveStudent(selectedStudent.id)
                              }
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-[Roboto] flex items-center gap-1 transition-colors"
                            >
                              <Check className="w-4 h-4" /> Approve Sidang
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Catatan Revisi (Dengan Tombol Approve Revisi) */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-blue-800 font-[Poppins] mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Catatan Revisi
                  </h4>
                  <p className="text-sm text-blue-700 font-[Roboto] mb-4">
                    Catatan revisi detail dapat dilihat pada log bimbingan.
                  </p>

                  {/* APPROVAL SECTION: REVISI */}
                  {hasHiddenApprovalState(selectedStudent) &&
                    getPendingApprovalType(selectedStudent) === "Revisi" && (
                      <div className="pt-2 border-t border-blue-200/50">
                        <div className="bg-white border border-orange-200 rounded p-3 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 rounded-full text-orange-600">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 font-[Poppins]">
                                Persetujuan Revisi
                              </p>
                              <p className="text-xs text-gray-500 font-[Roboto]">
                                Konfirmasi bahwa revisi telah selesai.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleApproveStudent(selectedStudent.id)
                            }
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-[Roboto] flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-4 h-4" /> Approve Revisi
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-[Roboto]"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {showTopicDetailModal && selectedTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowTopicDetailModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">
                        Detail Usulan Topik
                      </h2>
                      <p className="text-sm text-gray-600 font-[Roboto]">
                        {selectedTopic.nama} • {selectedTopic.nrp}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTopicDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informasi Topik
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                        Nama dan NRP
                      </p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedTopic.nama} - {selectedTopic.nrp}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                        Judul
                      </p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedTopic.judul}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                        Abstrak
                      </p>
                      <p className="text-sm text-gray-700 font-[Roboto]">
                        {selectedTopic.abstrak}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
                <button
                  onClick={() => setShowTopicDetailModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-[Roboto]"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    handleApproveSingle(selectedTopic!.id);
                    setShowTopicDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bimbingan Approve Modal */}
      <AnimatePresence>
        {showBimbinganModal && selectedBimbinganStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowBimbinganModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">
                        Ajuan & Riwayat Bimbingan
                      </h2>
                      <p className="text-sm text-gray-600 font-[Roboto]">
                        {selectedBimbinganStudent.nama} •{" "}
                        {selectedBimbinganStudent.nrp}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBimbinganModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {(() => {
                  const pendingCount = getPendingBimbinganCount(
                    selectedBimbinganStudent
                  );
                  const approvedCount = getApprovedBimbinganCount(
                    selectedBimbinganStudent
                  );
                  return (
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1.5 rounded-lg text-sm font-[Roboto] bg-gray-100 text-gray-800">
                        Total bimbingan disetujui:{" "}
                        <span className="font-semibold">{approvedCount}x</span>
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-sm font-[Roboto] bg-blue-50 text-blue-800 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Ajuan menunggu:{" "}
                        <span className="font-semibold">{pendingCount}</span>
                      </span>
                      {pendingCount > 0 && (
                        <button
                          onClick={() =>
                            handleApproveAllBimbingan(
                              selectedBimbinganStudent.id
                            )
                          }
                          className="ml-auto px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-[Roboto] flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Approve semua ajuan
                        </button>
                      )}
                    </div>
                  );
                })()}

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  {selectedBimbinganStudent.bimbinganLog &&
                  selectedBimbinganStudent.bimbinganLog.length > 0 ? (
                    <div className="space-y-3">
                      {selectedBimbinganStudent.bimbinganLog
                        .slice()
                        .sort((a, b) => a.ke - b.ke)
                        .map((log) => (
                          <div
                            key={log.id}
                            className="bg-white border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-[Roboto] font-semibold text-gray-800">
                                  Bimbingan ke-{log.ke}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-[Roboto] border ${
                                    log.status === "Disetujui"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-orange-50 text-orange-700 border-orange-200"
                                  }`}
                                >
                                  {log.status === "Disetujui"
                                    ? "Disetujui"
                                    : "Menunggu approval"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 font-[Roboto] mb-1">
                                {log.beritaAcara}
                              </p>
                              <p className="text-[10px] text-gray-500 font-[Roboto] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDateTime(log.waktu)}
                              </p>
                            </div>
                            {log.status === "Menunggu" && (
                              <button
                                onClick={() =>
                                  handleApproveSingleBimbingan(
                                    selectedBimbinganStudent.id,
                                    log.id
                                  )
                                }
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-[Roboto] flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Approve
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-[Roboto]">
                        Belum ada riwayat bimbingan.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
                <button
                  onClick={() => setShowBimbinganModal(false)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-[Roboto]"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guide Modal */}
      {isGuideModalOpen && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          title="Panduan Penggunaan - Bimbingan Aktif"
          steps={[
            {
              title: "Filter Perlu Approval",
              description:
                "Gunakan filter 'Perlu Approval' untuk melihat mahasiswa yang membutuhkan persetujuan TA, Sidang, atau Revisi.",
              imageUrl:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            },
            {
              title: "Setujui Tahapan",
              description:
                "Klik 'Lihat' dan temukan tombol persetujuan pada bagian Informasi Tugas Akhir, Informasi Sidang, atau Revisi sesuai tahap mahasiswa.",
              imageUrl:
                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
            },
          ]}
        />
      )}
    </main>
  );
}