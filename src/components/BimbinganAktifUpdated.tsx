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
} from "lucide-react";
import { GuideModal } from "./GuideModal";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

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
  tahap: string;
  progress: number;
  status: string;
  jumlahBimbingan: number;
  needsApproval: boolean;
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

export function BimbinganAktif({
  initialView = "default",
}: BimbinganAktifProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedJenjang, setSelectedJenjang] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ⬇️ ini yang dihubungkan ke Beranda (ajuanTopik / approval)
  const [expandedAjuan, setExpandedAjuan] = useState(
    initialView === "ajuanTopik"
  );
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicProposal | null>(
    null
  );
  const [showTopicDetailModal, setShowTopicDetailModal] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "approval" | "ready">(
    initialView === "approval" ? "approval" : "all"
  );

  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  // ...lanjutkan kode kamu seperti sebelumnya

  // Mock data for students
  const students: Student[] = [
    {
      id: 1,
      nrp: "5025223002",
      nama: "Andi Pratama",
      angkatan: "2020",
      jenjang: "S1",
      judulTA: "RANCANG BANGUN SISTEM MONITORING BIMBINGAN TUGAS AKHIR BERBASIS WEB",
      abstrak: "Penelitian ini bertujuan untuk merancang dan membangun sistem monitoring bimbingan tugas akhir berbasis web guna memudahkan dosen dan mahasiswa dalam memantau progress bimbingan. Sistem menyediakan fitur pencatatan pertemuan, status tahapan tugas akhir, serta riwayat revisi secara terstruktur.",
      lab: "Laboratorium Rekayasa Perangkat Lunak",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Revisi Proposal",
      progress: 65,
      status: "Dalam Pengerjaan",
      jumlahBimbingan: 8,
      needsApproval: true
    },
    {
      id: 2,
      nrp: "5025201015",
      nama: "Siti Aminah Putri",
      angkatan: "2020",
      jenjang: "S1",
      judulTA: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia",
      abstrak: "Aplikasi mobile yang dirancang untuk memudahkan monitoring kesehatan lansia dengan fitur pengingat minum obat, pencatatan tekanan darah, dan konsultasi online dengan dokter.",
      lab: "Laboratorium Sistem Informasi",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Proposal",
      progress: 40,
      status: "Perlu Revisi",
      jumlahBimbingan: 5,
      needsApproval: true
    },
    {
      id: 3,
      nrp: "6025201002",
      nama: "Bayu Aditya Pratama",
      angkatan: "2020",
      jenjang: "S2",
      judulTA: "Analisis Sentimen Media Sosial Menggunakan Deep Learning",
      abstrak: "Penelitian ini menggunakan teknik deep learning untuk menganalisis sentimen pada media sosial dengan akurasi tinggi menggunakan arsitektur LSTM dan BERT.",
      lab: "Laboratorium Kecerdasan Buatan",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Tugas Akhir",
      progress: 85,
      status: "Siap Sidang",
      jumlahBimbingan: 12,
      needsApproval: false
    },
    {
      id: 4,
      nrp: "5025201020",
      nama: "Dewi Kartika Sari",
      angkatan: "2020",
      jenjang: "S1",
      judulTA: "Implementasi Machine Learning untuk Deteksi Penyakit Tanaman",
      abstrak: "Sistem deteksi penyakit tanaman menggunakan convolutional neural network (CNN) untuk membantu petani dalam diagnosis dini penyakit tanaman.",
      lab: "Laboratorium Kecerdasan Buatan",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Proposal",
      progress: 90,
      status: "Menunggu Sidang",
      jumlahBimbingan: 6,
      needsApproval: false
    },
    {
      id: 5,
      nrp: "6025201008",
      nama: "Rini Susanti",
      angkatan: "2020",
      jenjang: "S2",
      judulTA: "Optimasi Algoritma Pencarian dengan Genetic Algorithm",
      abstrak: "Penelitian optimasi algoritma pencarian menggunakan genetic algorithm untuk meningkatkan efisiensi pencarian pada dataset besar.",
      lab: "Laboratorium Sistem Informasi",
      pembimbing1: "Pembimbing 1 (Anda)",
      pembimbing2: "Pembimbing 2 (Rekan)",
      tahap: "Tugas Akhir",
      progress: 50,
      status: "Dalam Pengerjaan",
      jumlahBimbingan: 9,
      needsApproval: false
    }
  ];

  // Mock data ajuan topik
  const [topicProposals, setTopicProposals] = useState<TopicProposal[]>([
    {
      id: 1,
      nama: "Muhammad Rizki",
      nrp: "5025201030",
      angkatan: "2020",
      judul: "Sistem Informasi Perpustakaan Digital Berbasis Cloud",
      abstrak: "Sistem perpustakaan digital yang menggunakan teknologi cloud computing untuk penyimpanan dan akses buku digital dengan fitur pencarian cerdas.",
      tanggalAjuan: "2024-12-01"
    },
    {
      id: 2,
      nama: "Farah Nabila",
      nrp: "5025201031",
      angkatan: "2020",
      judul: "Aplikasi E-Learning dengan Gamifikasi untuk Meningkatkan Motivasi Belajar",
      abstrak: "Platform e-learning yang menerapkan konsep gamifikasi seperti poin, badge, dan leaderboard untuk meningkatkan motivasi dan engagement siswa.",
      tanggalAjuan: "2024-12-02"
    },
    {
      id: 3,
      nama: "Arif Budiman",
      nrp: "5025201032",
      angkatan: "2020",
      judul: "Chatbot Customer Service Menggunakan Natural Language Processing",
      abstrak: "Chatbot cerdas yang menggunakan NLP dan machine learning untuk memberikan layanan customer service otomatis dengan tingkat akurasi tinggi.",
      tanggalAjuan: "2024-12-03"
    }
  ]);

  // Filter students berdasarkan filterMode
  let filteredStudents = students.filter(student => {
    const matchesJenjang = selectedJenjang === "Semua" || student.jenjang === selectedJenjang;
    const matchesStatus = selectedStatus === "Semua" || student.status === selectedStatus;
    const matchesSearch = student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.nrp.includes(searchQuery) ||
                         student.judulTA.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterMode === "approval") {
      matchesFilter = student.needsApproval;
    } else if (filterMode === "ready") {
      matchesFilter = student.status === "Siap Sidang" || student.status === "Menunggu Sidang";
    }
    
    return matchesJenjang && matchesStatus && matchesSearch && matchesFilter;
  });

  const getTahapColor = (tahap: string) => {
    if (tahap.includes("Proposal")) {
      return "bg-blue-50 border-blue-200 text-blue-700";
    } else if (tahap.includes("Tugas Akhir")) {
      return "bg-green-50 border-green-200 text-green-700";
    } else if (tahap.includes("Revisi")) {
      return "bg-orange-50 border-orange-200 text-orange-700";
    }
    return "bg-gray-50 border-gray-200 text-gray-700";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dalam Pengerjaan":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Perlu Revisi":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Siap Sidang":
        return "bg-green-100 text-green-700 border-green-200";
      case "Menunggu Sidang":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Dalam Pengerjaan":
        return <Clock className="w-4 h-4" />;
      case "Perlu Revisi":
        return <AlertCircle className="w-4 h-4" />;
      case "Siap Sidang":
      case "Menunggu Sidang":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleApproveTopics = () => {
    if (selectedTopics.length === 0) {
      toast.error("Pilih minimal satu topik untuk disetujui");
      return;
    }

    setTopicProposals(topicProposals.filter(t => !selectedTopics.includes(t.id)));
    toast.success(`${selectedTopics.length} topik berhasil disetujui`);
    setSelectedTopics([]);
  };

  const handleApproveSingle = (id: number) => {
    setTopicProposals(topicProposals.filter(t => t.id !== id));
    toast.success("Topik berhasil disetujui");
  };

  const toggleSelectTopic = (id: number) => {
    if (selectedTopics.includes(id)) {
      setSelectedTopics(selectedTopics.filter(t => t !== id));
    } else {
      setSelectedTopics([...selectedTopics, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTopics.length === topicProposals.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topicProposals.map(t => t.id));
    }
  };

  const handleViewTopicDetail = (topic: TopicProposal) => {
    setSelectedTopic(topic);
    setShowTopicDetailModal(true);
  };

  const handleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(s => s !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleBatchApproval = () => {
    if (selectedStudents.length === 0) {
      toast.error("Pilih minimal satu mahasiswa untuk disetujui");
      return;
    }
    toast.success(`${selectedStudents.length} mahasiswa berhasil disetujui`);
    setSelectedStudents([]);
  };

  const handleApproveStudent = (studentId: number) => {
    toast.success("Mahasiswa berhasil disetujui");
    setShowDetailModal(false);
  };

  const needsApprovalCount = students.filter(s => s.needsApproval).length;
  const readyForSidangCount = students.filter(s => s.status === "Siap Sidang" || s.status === "Menunggu Sidang").length;

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">Bimbingan Aktif</h1>
            <button 
              onClick={() => setIsGuideModalOpen(true)} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-[Poppins]">Panduan Penggunaan</span>
            </button>
          </div>
          <p className="text-gray-500 font-[Roboto]">Kelola mahasiswa bimbingan Anda</p>
        </div>

        {/* Ajuan Topik Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-gray-800 font-[Poppins] text-lg">Ajuan Topik</h2>
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
                  <h3 className="text-gray-800 font-[Poppins]">Usulan Topik Menunggu Persetujuan</h3>
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
                        <p className="text-gray-500 font-[Roboto]">Tidak ada usulan topik</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                          <input
                            type="checkbox"
                            checked={selectedTopics.length === topicProposals.length}
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
                                        {topic.nama} • {topic.nrp} • Angkatan {topic.angkatan}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-700 font-[Roboto] mb-3 line-clamp-2">
                                    {topic.abstrak}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-[Roboto]">
                                      Diajukan: {new Date(topic.tanggalAjuan).toLocaleDateString('id-ID')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleViewTopicDetail(topic)}
                                        className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-[Roboto] text-sm flex items-center gap-1"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        Lihat
                                      </button>
                                      <button
                                        onClick={() => handleApproveSingle(topic.id)}
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

        {/* Statistics - dengan onClick untuk filter */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div 
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-default"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">Total Mahasiswa</p>
                <p className="text-2xl text-gray-800 font-[Poppins]">{students.length}</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => {
              if (filterMode === "approval") {
                setFilterMode("all");
                setSelectedStudents([]);
              } else {
                setFilterMode("approval");
                setSelectedStudents([]);
              }
            }}
            className={`rounded-lg border p-4 cursor-pointer transition-all ${
              filterMode === "approval" 
                ? "bg-orange-50 border-orange-300 shadow-md" 
                : "bg-white border-gray-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">Perlu Approval</p>
                <p className="text-2xl text-gray-800 font-[Poppins]">{needsApprovalCount}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              if (filterMode === "ready") {
                setFilterMode("all");
              } else {
                setFilterMode("ready");
              }
            }}
            className={`rounded-lg border p-4 cursor-pointer transition-all ${
              filterMode === "ready" 
                ? "bg-green-50 border-green-300 shadow-md" 
                : "bg-white border-gray-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-[Roboto]">Siap Sidang</p>
                <p className="text-2xl text-gray-800 font-[Poppins]">{readyForSidangCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Approval Button - tampil saat filter approval aktif */}
        {filterMode === "approval" && filteredStudents.length > 0 && (
          <div className="mb-6 flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedStudents.length === filteredStudents.length}
                onChange={handleSelectAllStudents}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-[Roboto]">
                Centang Semua ({filteredStudents.length} mahasiswa)
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
              value={selectedJenjang}
              onChange={(e) => setSelectedJenjang(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Jenjang</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Semua">Semua Status</option>
              <option value="Dalam Pengerjaan">Dalam Pengerjaan</option>
              <option value="Perlu Revisi">Perlu Revisi</option>
              <option value="Siap Sidang">Siap Sidang</option>
              <option value="Menunggu Sidang">Menunggu Sidang</option>
            </select>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Checkbox untuk batch approval */}
                {filterMode === "approval" && (
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
                        <h3 className="text-gray-800 font-[Poppins]">{student.nama}</h3>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-[Roboto]">
                          {student.jenjang}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-[Roboto] border ${getStatusColor(student.status)} flex items-center gap-1`}>
                          {getStatusIcon(student.status)}
                          {student.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-[Roboto] mb-1">NRP: {student.nrp}</p>
                      <p className="text-sm text-gray-800 font-[Roboto] mb-3">{student.judulTA}</p>
                      
                      <div className="flex items-center gap-6">
                        {/* Card Status */}
                        <div className={`px-3 py-2 rounded-lg border ${getTahapColor(student.tahap)} flex items-center gap-2`}>
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-[Roboto]">{student.tahap}</span>
                        </div>
                        
                        {/* Jumlah Bimbingan */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-[Roboto]">
                          <MessageSquare className="w-4 h-4" />
                          <span>Bimbingan: {student.jumlahBimbingan}x</span>
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

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 font-[Roboto]">Progress</span>
                      <span className="text-xs text-gray-800 font-[Roboto] font-semibold">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-[Roboto]">Tidak ada mahasiswa ditemukan</p>
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
                <div className="mb-6">
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-[Roboto] font-semibold ${getTahapColor(selectedStudent.tahap)}`}>
                    {selectedStudent.tahap}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informasi Tugas Akhir
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Nama dan NRP</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedStudent.nama} - {selectedStudent.nrp}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Judul</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedStudent.judulTA}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Abstrak</p>
                      <p className="text-sm text-gray-700 font-[Roboto]">
                        {selectedStudent.abstrak}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Lab</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedStudent.lab}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Pembimbing 1</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedStudent.pembimbing1}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Pembimbing 2</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedStudent.pembimbing2}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timeline Proses
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                    <div className="flex items-center min-w-max">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          1
                        </div>
                        <p className="text-xs text-gray-700 font-[Roboto] mt-2 w-16 text-center">Proposal</p>
                      </div>
                      <div className="w-16 h-0.5 bg-blue-600 mx-2"></div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          2
                        </div>
                        <p className="text-xs text-gray-700 font-[Roboto] mt-2 w-16 text-center">Sidang Proposal</p>
                      </div>
                      <div className="w-16 h-0.5 bg-blue-600 mx-2"></div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          3
                        </div>
                        <p className="text-xs text-blue-700 font-[Roboto] mt-2 font-semibold w-16 text-center">Revisi Proposal</p>
                      </div>
                      <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                          4
                        </div>
                        <p className="text-xs text-gray-500 font-[Roboto] mt-2 w-16 text-center">Pengerjaan TA</p>
                      </div>
                      <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                          5
                        </div>
                        <p className="text-xs text-gray-500 font-[Roboto] mt-2 w-16 text-center">Sidang TA</p>
                      </div>
                      <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                          6
                        </div>
                        <p className="text-xs text-gray-500 font-[Roboto] mt-2 w-16 text-center">Revisi TA</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-[Roboto] mt-4">
                      Status saat ini: <span className="font-semibold text-blue-700">{selectedStudent.tahap}</span>
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-gray-800 font-[Poppins] mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Informasi Sidang Proposal
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-[Roboto]">Tanggal</p>
                        <p className="text-sm text-gray-800 font-[Roboto]">12 Januari 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-[Roboto]">Waktu</p>
                        <p className="text-sm text-gray-800 font-[Roboto]">09.00 - 11.00 WIB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-[Roboto]">Lokasi</p>
                        <p className="text-sm text-gray-800 font-[Roboto]">Ruang Sidang 1 Departemen Informatika</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-blue-800 font-[Poppins] mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Catatan Revisi
                  </h4>
                  <p className="text-sm text-blue-700 font-[Roboto]">
                    Mahasiswa diminta untuk melakukan revisi terhadap naskah proposal dan menyesuaikan bagian metodologi serta penulisan bab hasil dan pembahasan agar sesuai dengan yang diberikan saat sidang.
                  </p>
                </div>

                {/* Section Approval - tampil jika needs approval */}
                {selectedStudent.needsApproval && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="text-orange-800 font-[Poppins] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Persetujuan
                    </h4>
                    <p className="text-sm text-orange-700 font-[Roboto] mb-4">
                      Mahasiswa ini membutuhkan persetujuan Anda untuk melanjutkan ke tahap berikutnya.
                    </p>
                    <button
                      onClick={() => handleApproveStudent(selectedStudent.id)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Setujui Mahasiswa
                    </button>
                  </div>
                )}
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
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Nama dan NRP</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedTopic.nama} - {selectedTopic.nrp}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Angkatan</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedTopic.angkatan}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Judul</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {selectedTopic.judul}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Abstrak</p>
                      <p className="text-sm text-gray-700 font-[Roboto]">
                        {selectedTopic.abstrak}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-[Roboto] mb-1">Tanggal Ajuan</p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {new Date(selectedTopic.tanggalAjuan).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-800 font-[Poppins] mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Catatan
                  </h4>
                  <p className="text-sm text-blue-700 font-[Roboto]">
                    Pastikan untuk memverifikasi kelayakan topik sebelum memberikan persetujuan. Topik harus sesuai dengan bidang keahlian dan memiliki ruang lingkup yang jelas.
                  </p>
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
                    handleApproveSingle(selectedTopic.id);
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

      {/* Guide Modal */}
      {isGuideModalOpen && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          title="Panduan Penggunaan - Bimbingan Aktif"
          steps={[
            {
              title: "Kelola Bimbingan Aktif",
              description: "Halaman Bimbingan Aktif menampilkan semua mahasiswa yang sedang Anda bimbing. Anda dapat melihat progress mahasiswa, status terkini, dan deadline yang harus dipenuhi.",
              imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800"
            },
            {
              title: "Lihat Detail Mahasiswa",
              description: "Klik tombol 'Lihat' pada setiap card mahasiswa untuk melihat informasi lengkap termasuk timeline proses, informasi sidang, dan catatan revisi.",
              imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"
            }
          ]}
        />
      )}
    </main>
  );
}
