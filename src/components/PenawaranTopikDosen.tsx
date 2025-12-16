import { useState } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  ArrowLeft,
  MessageSquare,
  Users,
  CheckCircle,
} from "lucide-react";
import { GuideModal } from "./GuideModal";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PenawaranTopik } from "./PenawaranTopik";

interface TopicApplicant {
  id: number;
  name: string;
  nrp: string;
  gpa: string;
  appliedAt: string;
  status: "pending" | "approved" | "rejected";

  // Form yang dikumpulkan mahasiswa
  abstract: string;
  proposalFileName: string;
  proposalFileUrl: string;
}

interface TopicOffer {
  id: number;
  title: string;
  laboratory: string;
  description: string;
  supervisor1: string;
  supervisor2: string;
  minimalKnowledge: string[];
  status: "Tersedia" | "Diambil";
  isDraft: boolean;
  applicants?: TopicApplicant[];
  chosenStudentNrp?: string;
}

interface PenawaranTopikDosenProps {
  onNavigate: (page: string) => void;
}

export function PenawaranTopikDosen({ onNavigate }: PenawaranTopikDosenProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Contoh data penawaran topik
  const [topics, setTopics] = useState<TopicOffer[]>([
    {
      id: 1,
      title:
        "Graph Neural Network untuk Prediksi Hasil Pertandingan Sepak Bola",
      laboratory: "KCV",
      description:
        "Topik ini berfokus pada pemodelan hubungan antar tim sepak bola menggunakan Graph Neural Network (GNN) untuk memprediksi hasil pertandingan liga Eropa.",
      supervisor1: "Bintang Hanoraga, S.Kom., M.Kom.",
      supervisor2: "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
      minimalKnowledge: [
        "Dasar machine learning",
        "Python (PyTorch / TensorFlow)",
        "Statistik dasar",
      ],
      status: "Tersedia",
      isDraft: false,
      applicants: [
        {
          id: 101,
          name: "Ahmad Fauzi Ramadhan",
          nrp: "5025201001",
          gpa: "3.72",
          appliedAt: "5 Des 2025, 09:30",
          status: "pending",
          abstract:
            "Penelitian ini bertujuan membangun model Graph Neural Network (GNN) untuk memprediksi hasil pertandingan liga sepak bola Eropa dengan memanfaatkan struktur graf antar tim berdasarkan riwayat pertemuan, performa terkini, dan faktor kandang/tandang.",
          proposalFileName:
            "Proposal_Ahmad_Fauzi_Ramadhan_GNN_Prediksi_Pertandingan.pdf",
          proposalFileUrl: "#",
        },
        {
          id: 102,
          name: "Siti Aminah Putri",
          nrp: "5025201015",
          gpa: "3.85",
          appliedAt: "5 Des 2025, 11:10",
          status: "pending",
          abstract:
            "Penelitian ini mengusulkan arsitektur GNN dengan pembandingan terhadap model baseline klasik seperti Random Forest dan XGBoost untuk prediksi hasil pertandingan sepak bola, serta mengevaluasi kontribusi fitur rolling statistik dan edge features.",
          proposalFileName:
            "Proposal_Siti_Aminah_Putri_GNN_Football_Prediction.pdf",
          proposalFileUrl: "#",
        },
      ],
    },
    {
      id: 2,
      title:
        "Perancangan Sistem Rekomendasi Topik Tugas Akhir Berbasis Profil Mahasiswa",
      laboratory: "MCI",
      description:
        "Membangun sistem rekomendasi yang membantu mahasiswa menemukan topik tugas akhir yang sesuai minat, riwayat akademik, dan pengalaman organisasi.",
      supervisor1: "Bintang Hanoraga, S.Kom., M.Kom.",
      supervisor2: "Tidak Ada",
      minimalKnowledge: [
        "Dasar data mining",
        "SQL / basis data",
        "Web development dasar",
      ],
      status: "Tersedia",
      isDraft: false,
      applicants: [],
    },
  ]);

  const [editingTopic, setEditingTopic] = useState<TopicOffer | null>(null);
  const [viewMode, setViewMode] = useState<"manage" | "view">("manage");

  const [selectedTopicForApplications, setSelectedTopicForApplications] =
    useState<TopicOffer | null>(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
    null
  );

  const [formData, setFormData] = useState({
    title: "",
    laboratory: "",
    description: "",
    supervisor1: "Bintang Hanoraga, S.Kom., M.Kom.",
    supervisor2: "",
    minimalKnowledge: [""],
    status: "Tersedia" as "Tersedia" | "Diambil",
  });

  const laboratories = [
    { value: "KCV", label: "KCV - Komputasi Cerdas dan Visi" },
    { value: "MCI", label: "MCI - Manajemen dan Cerdas Informasi" },
    { value: "RPL", label: "RPL - Rekayasa Perangkat Lunak" },
    { value: "NCC", label: "NCC - Jaringan Cerdas dan Cyber Security" },
    { value: "NETICS", label: "NETICS - Internet Cerdas dan Sistem" },
    { value: "ALPRO", label: "ALPRO - Algoritma dan Pemrograman" },
  ];

  const availableSupervisors = [
    "Tidak Ada",
    "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
    "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
    "Dr. Retno Wardani, S.Kom., M.T.",
    "Fajar Pradana, S.Kom., M.Kom.",
    "Dr. Rizal Fathoni, S.Kom., M.T.",
  ];

  const handleAddKnowledge = () => {
    if (formData.minimalKnowledge.length < 4) {
      setFormData({
        ...formData,
        minimalKnowledge: [...formData.minimalKnowledge, ""],
      });
    }
  };

  const handleRemoveKnowledge = (index: number) => {
    const newKnowledge = formData.minimalKnowledge.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      minimalKnowledge: newKnowledge.length > 0 ? newKnowledge : [""],
    });
  };

  const handleKnowledgeChange = (index: number, value: string) => {
    const newKnowledge = [...formData.minimalKnowledge];
    newKnowledge[index] = value;
    setFormData({
      ...formData,
      minimalKnowledge: newKnowledge,
    });
  };

  const handleSaveDraft = () => {
    const newTopic: TopicOffer = {
      id: editingTopic ? editingTopic.id : Date.now(),
      title: formData.title,
      laboratory: formData.laboratory,
      description: formData.description,
      supervisor1: formData.supervisor1,
      supervisor2:
        formData.supervisor2 === "Tidak Ada" ? "-" : formData.supervisor2,
      minimalKnowledge: formData.minimalKnowledge.filter(
        (k) => k.trim() !== ""
      ),
      status: editingTopic?.status ?? "Tersedia",
      isDraft: true,
      applicants: editingTopic?.applicants ?? [],
      chosenStudentNrp: editingTopic?.chosenStudentNrp,
    };

    if (editingTopic) {
      setTopics((prev) =>
        prev.map((t) => (t.id === editingTopic.id ? newTopic : t))
      );
      toast.success("Draft berhasil diperbarui");
    } else {
      setTopics((prev) => [...prev, newTopic]);
      toast.success("Draft berhasil disimpan");
    }

    resetForm();
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.laboratory || !formData.description) {
      toast.error("Mohon lengkapi data yang wajib diisi!");
      return;
    }

    const newTopic: TopicOffer = {
      id: editingTopic ? editingTopic.id : Date.now(),
      title: formData.title,
      laboratory: formData.laboratory,
      description: formData.description,
      supervisor1: formData.supervisor1,
      supervisor2:
        formData.supervisor2 === "Tidak Ada" ? "-" : formData.supervisor2,
      minimalKnowledge: formData.minimalKnowledge.filter(
        (k) => k.trim() !== ""
      ),
      status: editingTopic?.status ?? "Tersedia",
      isDraft: false,
      applicants: editingTopic?.applicants ?? [],
      chosenStudentNrp: editingTopic?.chosenStudentNrp,
    };

    if (editingTopic) {
      setTopics((prev) =>
        prev.map((t) => (t.id === editingTopic.id ? newTopic : t))
      );
      toast.success("Penawaran topik berhasil diperbarui");
    } else {
      setTopics((prev) => [...prev, newTopic]);
      toast.success("Penawaran topik berhasil dibuat");
    }

    resetForm();
  };

  const handleEdit = (topic: TopicOffer) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title,
      laboratory: topic.laboratory,
      description: topic.description,
      supervisor1: topic.supervisor1,
      supervisor2: topic.supervisor2 === "-" ? "Tidak Ada" : topic.supervisor2,
      minimalKnowledge:
        topic.minimalKnowledge.length > 0 ? topic.minimalKnowledge : [""],
      status: topic.status,
    });
    setShowForm(true);
  };

  const handleDelete = (topicId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus topik ini?")) {
      setTopics((prev) => prev.filter((t) => t.id !== topicId));
      toast.success("Topik berhasil dihapus");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      laboratory: "",
      description: "",
      supervisor1: "Bintang Hanoraga, S.Kom., M.Kom.",
      supervisor2: "",
      minimalKnowledge: [""],
      status: "Tersedia",
    });
    setEditingTopic(null);
    setShowForm(false);
  };

  // === Ajuan Mahasiswa ===
  const handleOpenApplicants = (topic: TopicOffer) => {
    setSelectedTopicForApplications(topic);
    if (topic.applicants && topic.applicants.length > 0) {
      const firstPending =
        topic.applicants.find((a) => a.status === "pending") ??
        topic.applicants[0];
      setSelectedApplicantId(firstPending.id);
    } else {
      setSelectedApplicantId(null);
    }
  };

  const handleCloseApplicants = () => {
    setSelectedTopicForApplications(null);
    setSelectedApplicantId(null);
  };

  const handleApproveApplicant = (topicId: number, applicantId: number) => {
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== topicId) return t;
        const updatedApplicants = (t.applicants ?? []).map((a) => ({
          ...a,
          status:
            a.id === applicantId
              ? "approved"
              : a.status === "pending"
              ? "rejected"
              : a.status,
        }));
        const approved = updatedApplicants.find((a) => a.id === applicantId);
        return {
          ...t,
          status: "Diambil",
          chosenStudentNrp: approved?.nrp,
          applicants: updatedApplicants,
        };
      });

      const updatedTopic = updated.find((t) => t.id === topicId) || null;
      setSelectedTopicForApplications(updatedTopic);

      return updated;
    });

    toast.success("Topik berhasil dialokasikan ke mahasiswa terpilih");
  };

  const selectedApplicant =
    selectedTopicForApplications &&
    selectedApplicantId &&
    selectedTopicForApplications.applicants?.find(
      (a) => a.id === selectedApplicantId
    );

  // === Mode Mahasiswa (lihat penawaran) ===
  if (viewMode === "view") {
    return (
      <div className="flex-1">
        <button
          onClick={() => setViewMode("manage")}
          className="m-6 mb-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 font-[Roboto] text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kelola Topik
        </button>
        <PenawaranTopik />
      </div>
    );
  }

  // === Halaman Form ===
  if (showForm) {
    return (
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto">
          {/* Header with Action Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-gray-800 font-[Poppins] text-[24px]">
                  {editingTopic
                    ? "Edit Penawaran Topik"
                    : "Buat Penawaran Topik Baru"}
                </h1>
                <p className="text-sm text-gray-500 font-[Roboto] mt-1">
                  Lengkapi formulir di bawah untuk membuat penawaran topik
                </p>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-[Roboto] text-sm transition-colors"
              >
                Panduan
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* Status Topik dihapus dari form (sesuai permintaan) */}

            <div className="space-y-6">
              {/* Judul */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="font-[Poppins] text-gray-800"
                >
                  Judul Topik <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Masukkan judul topik tugas akhir"
                  className="font-[Roboto]"
                />
              </div>

              {/* Laboratorium */}
              <div className="space-y-2">
                <label className="font-[Poppins] text-gray-800">
                  Pilih Laboratorium <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {laboratories.map((lab) => (
                    <label
                      key={lab.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="laboratory"
                        value={lab.value}
                        checked={formData.laboratory === lab.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            laboratory: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-transparent border-gray-300"
                      />
                      <span className="font-[Roboto] text-gray-700">
                        {lab.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="font-[Poppins] text-gray-800"
                >
                  Deskripsi Topik <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Jelaskan detail topik tugas akhir yang ditawarkan"
                  rows={5}
                  className="font-[Roboto]"
                />
              </div>

              {/* Dosen Pembimbing 1 */}
              <div className="space-y-2">
                <label
                  htmlFor="supervisor1"
                  className="font-[Poppins] text-gray-800"
                >
                  Dosen Pembimbing 1
                </label>
                <Input
                  id="supervisor1"
                  value={formData.supervisor1}
                  readOnly
                  className="font-[Roboto] bg-gray-50"
                />
              </div>

              {/* Dosen Pembimbing 2 */}
              <div className="space-y-2">
                <label
                  htmlFor="supervisor2"
                  className="font-[Poppins] text-gray-800"
                >
                  Dosen Pembimbing 2
                </label>
                <Select
                  value={formData.supervisor2}
                  onValueChange={(value) =>
                    setFormData({ ...formData, supervisor2: value })
                  }
                >
                  <SelectTrigger className="font-[Roboto]">
                    <SelectValue placeholder="Pilih Dosen Pembimbing 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSupervisors.map((supervisor) => (
                      <SelectItem
                        key={supervisor}
                        value={supervisor}
                        className="font-[Roboto]"
                      >
                        {supervisor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Minimal Pengetahuan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-[Poppins] text-gray-800">
                    Minimal Pengetahuan
                  </label>
                  {formData.minimalKnowledge.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddKnowledge}
                      className="text-sm text-blue-600 hover:text-blue-700 font-[Roboto]"
                    >
                      + Tambah Poin
                    </button>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  {formData.minimalKnowledge.map((knowledge, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={knowledge}
                        onChange={(e) =>
                          handleKnowledgeChange(index, e.target.value)
                        }
                        placeholder={`Poin ${index + 1}`}
                        className="font-[Roboto]"
                      />
                      {formData.minimalKnowledge.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveKnowledge(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={handleSaveDraft}
                className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 font-[Roboto] text-sm transition-colors"
              >
                Simpan Draf
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 font-[Roboto] text-sm transition-colors"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-[Roboto]">
                © 2021-2025 Institut Teknologi Sepuluh Nopember
              </p>
            </div>
          </footer>

          {/* Guide Modal */}
          {isGuideModalOpen && (
            <GuideModal
              isOpen={isGuideModalOpen}
              onClose={() => setIsGuideModalOpen(false)}
              title="Panduan Penggunaan - Penawaran Topik Dosen"
              steps={[
                {
                  title: "Membuat Penawaran Topik",
                  description:
                    "Klik tombol 'Buat Penawaran Topik' untuk membuka form pembuatan topik baru. Isi semua field yang diperlukan seperti judul, laboratorium, deskripsi, dan minimal pengetahuan. Anda dapat menyimpan sebagai draft atau langsung submit untuk dipublikasikan.",
                  imageUrl:
                    "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwbm90ZXN8ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
                },
                {
                  title: "Mengelola Topik yang Sudah Dibuat",
                  description:
                    "Semua topik yang telah dibuat akan muncul di daftar penawaran topik. Anda dapat mengedit atau menghapus topik dengan tombol yang tersedia. Status topik dapat diubah dari 'Tersedia' menjadi 'Diambil' ketika mahasiswa sudah mengambil topik tersebut.",
                  imageUrl:
                    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0JTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
                },
                {
                  title: "Field Minimal Pengetahuan",
                  description:
                    "Field minimal pengetahuan dapat diisi hingga 4 poin untuk menjelaskan prasyarat pengetahuan yang harus dimiliki mahasiswa. Gunakan tombol '+ Tambah Poin' untuk menambah field baru dan tombol X untuk menghapus poin yang tidak diperlukan.",
                  imageUrl:
                    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmd8ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
                },
                {
                  title: "Draft vs Submit",
                  description:
                    "Simpan sebagai draft jika topik masih dalam tahap persiapan dan belum siap dipublikasikan. Gunakan submit ketika topik sudah final dan siap ditawarkan kepada mahasiswa. Topik yang di-draft dapat diedit kapan saja sebelum di-submit.",
                  imageUrl:
                    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMGFwcHJvdmFsfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
                },
              ]}
            />
          )}
        </div>
      </main>
    );
  }

  // === Halaman Utama Kelola Topik ===
  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">
            Penawaran Topik
          </h1>
          <p className="text-gray-500 font-[Roboto] text-sm mt-1">
            Kelola penawaran topik tugas akhir untuk mahasiswa
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Panduan Penggunaan
          </button>
          <button
            onClick={() => setViewMode("view")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-[Roboto] text-sm"
          >
            <Eye className="w-4 h-4" />
            Lihat Penawaran Topik
          </button>
        </div>

        {/* Buat Penawaran Topik Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors mb-4"
        >
          <div className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-left">
            <p className="text-gray-800 font-[Roboto] text-sm">
              Buat Penawaran Topik
            </p>
            <p className="text-xs text-gray-500 font-[Roboto]">
              Buat penawaran topik baru untuk mahasiswa
            </p>
          </div>
        </button>

        {/* Topics List Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-gray-800 font-[Poppins] font-bold mb-4">
            Daftar Penawaran Topik Saya
          </h2>

          {topics.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-[Roboto]">
                Belum ada penawaran topik yang dibuat
              </p>
              <p className="text-sm text-gray-400 font-[Roboto] mt-1">
                Klik tombol "Buat Penawaran Topik" untuk memulai
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topics.map((topic) => {
                const applicants = topic.applicants ?? [];
                const pendingCount = applicants.filter(
                  (a) => a.status === "pending"
                ).length;

                return (
                  <div
                    key={topic.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-gray-800 font-[Poppins] font-medium">
                            {topic.title}
                          </h3>
                          {topic.isDraft && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-[Roboto] border border-yellow-200">
                              Draft
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-xs rounded font-[Roboto] border ${
                              topic.status === "Tersedia"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {topic.status === "Diambil" &&
                            topic.chosenStudentNrp
                              ? `Diambil (${topic.chosenStudentNrp})`
                              : topic.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-[Roboto] mb-2 line-clamp-2">
                          {topic.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-[Roboto] mb-3">
                          <span className="px-2 py-1 bg-blue-50 rounded border border-blue-200">
                            {topic.laboratory}
                          </span>
                        </div>

                        {/* Ajuan Mahasiswa */}
                        {applicants.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleOpenApplicants(topic)}
                            className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm text-gray-800 font-[Poppins]">
                                    Ajuan Mahasiswa
                                  </p>
                                  {pendingCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-[Roboto] font-semibold px-2.5 py-1 rounded-full">
                                      {pendingCount} Baru
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 font-[Roboto]">
                                  {applicants.length === 1
                                    ? "Ada 1 mahasiswa yang mengajukan topik ini"
                                    : `Ada ${applicants.length} mahasiswa yang mengajukan topik ini`}
                                </p>
                              </div>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Aksi / Status Diambil */}
                      {topic.status === "Diambil" ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-[Roboto]">
                            <CheckCircle className="w-3 h-3" />
                            Topik Diambil
                          </span>
                          {topic.chosenStudentNrp && (
                            <span className="text-[11px] text-gray-500 font-[Roboto]">
                              NRP {topic.chosenStudentNrp}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEdit(topic)}
                            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 transition-colors font-[Roboto]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(topic.id)}
                            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded border border-red-200 transition-colors font-[Roboto]"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

      {/* Guide Modal */}
      {isGuideModalOpen && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          title="Panduan Penggunaan - Penawaran Topik Dosen"
          steps={[
            {
              title: "Membuat Penawaran Topik",
              description:
                "Klik tombol 'Buat Penawaran Topik' untuk membuka form pembuatan topik baru. Isi semua field yang diperlukan seperti judul, laboratorium, deskripsi, dan minimal pengetahuan. Anda dapat menyimpan sebagai draft atau langsung submit untuk dipublikasikan.",
              imageUrl:
                "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwbm90ZXN8ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
              title: "Mengelola Topik yang Sudah Dibuat",
              description:
                "Semua topik yang telah dibuat akan muncul di daftar penawaran topik. Anda dapat mengedit atau menghapus topik dengan tombol yang tersedia. Status topik dapat diubah dari 'Tersedia' menjadi 'Diambil' ketika mahasiswa sudah mengambil topik tersebut.",
              imageUrl:
                "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXN0JTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
              title: "Field Minimal Pengetahuan",
              description:
                "Field minimal pengetahuan dapat diisi hingga 4 poin untuk menjelaskan prasyarat pengetahuan yang harus dimiliki mahasiswa. Gunakan tombol '+ Tambah Poin' untuk menambah field baru dan tombol X untuk menghapus poin yang tidak diperlukan.",
              imageUrl:
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmd8ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            {
              title: "Draft vs Submit",
              description:
                "Simpan sebagai draft jika topik masih dalam tahap persiapan dan belum siap dipublikasikan. Gunakan submit ketika topik sudah final dan siap ditawarkan kepada mahasiswa. Topik yang di-draft dapat diedit kapan saja sebelum di-submit.",
              imageUrl:
                "https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMGFwcHJvdmFsfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
            },
          ]}
        />
      )}

      {/* Modal Ajuan Mahasiswa */}
      <AnimatePresence>
        {selectedTopicForApplications && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseApplicants}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-gray-800 font-[Poppins] text-lg">
                        Ajuan Mahasiswa
                      </h2>
                      <p className="text-xs text-gray-600 font-[Roboto]">
                        {selectedTopicForApplications.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseApplicants}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col md:flex-row">
                  {/* List Mahasiswa */}
                  <div className="w-full md:w-5/12 border-r border-gray-200 p-4 bg-gray-50">
                    <h3 className="text-sm font-[Poppins] text-gray-800 mb-3">
                      Daftar Mahasiswa Pengaju
                    </h3>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                      {(selectedTopicForApplications.applicants ?? []).map(
                        (app) => {
                          const isActive = app.id === selectedApplicantId;
                          return (
                            <button
                              key={app.id}
                              onClick={() => setSelectedApplicantId(app.id)}
                              className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                                isActive
                                  ? "bg-blue-50 border-blue-400"
                                  : "bg-white border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-[Poppins] text-gray-800 text-[13px]">
                                  {app.name}
                                </p>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-[Roboto] ${
                                    app.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : app.status === "approved"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {app.status === "pending"
                                    ? "Menunggu"
                                    : app.status === "approved"
                                    ? "Disetujui"
                                    : "Ditolak"}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-600 font-[Roboto]">
                                {app.nrp} • IPK {app.gpa}
                              </p>
                              <p className="text-[10px] text-gray-400 font-[Roboto] mt-1">
                                {app.appliedAt}
                              </p>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Detail Mahasiswa */}
                  <div className="w-full md:w-7/12 p-6">
                    {selectedApplicant ? (
                      <>
                        <h3 className="text-sm font-[Poppins] text-gray-800 mb-3">
                          Detail Ajuan Mahasiswa
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                              Nama & NRP
                            </p>
                            <p className="text-sm text-gray-800 font-[Roboto]">
                              {selectedApplicant.name} —{" "}
                              {selectedApplicant.nrp}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                              IPK
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[11px] text-green-700 font-[Roboto]">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              IPK {selectedApplicant.gpa}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                              Abstrak Proposal
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                              <p className="text-sm text-gray-800 font-[Roboto] whitespace-pre-line">
                                {selectedApplicant.abstract}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                              File Proposal
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm text-gray-800 font-[Roboto]">
                                  {selectedApplicant.proposalFileName}
                                </p>
                                <p className="text-[11px] text-gray-500 font-[Roboto]">
                                  PDF • Diunggah bersama ajuan topik
                                </p>
                              </div>
                              <a
                                href={selectedApplicant.proposalFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-[Roboto]"
                              >
                                Lihat
                              </a>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                              Waktu Pengajuan
                            </p>
                            <p className="text-sm text-gray-700 font-[Roboto]">
                              {selectedApplicant.appliedAt}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between gap-3">
                          <p className="text-[11px] text-gray-500 font-[Roboto]">
                            Jika Anda menyetujui mahasiswa ini, status topik
                            akan berubah menjadi{" "}
                            <span className="font-semibold text-gray-700">
                              “Diambil (NRP Mahasiswa)”
                            </span>{" "}
                            dan ajuan lain otomatis ditandai ditolak.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleCloseApplicants}
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm"
                            >
                              Tutup
                            </button>
                            <button
                              disabled={
                                selectedApplicant.status !== "pending" ||
                                selectedTopicForApplications.status ===
                                  "Diambil"
                              }
                              onClick={() =>
                                handleApproveApplicant(
                                  selectedTopicForApplications.id,
                                  selectedApplicant.id
                                )
                              }
                              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm font-medium shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              Setujui Mahasiswa Ini
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-gray-500 font-[Roboto]">
                          Pilih salah satu mahasiswa di sebelah kiri untuk
                          melihat detail ajuan.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
