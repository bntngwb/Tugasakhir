import { useState } from "react";
import { BookOpen, Plus, Edit, Trash2, X, HelpCircle, Mail, AlertCircle, Eye, Search, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { GuideModal } from "./GuideModal";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
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
}

interface PenawaranTopikDosenProps {
  onNavigate: (page: string) => void;
}

export function PenawaranTopikDosen({ onNavigate }: PenawaranTopikDosenProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [topics, setTopics] = useState<TopicOffer[]>([]);
  const [editingTopic, setEditingTopic] = useState<TopicOffer | null>(null);
  const [viewMode, setViewMode] = useState<"manage" | "view">("manage"); // New state for view mode

  // Form states
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
    const newKnowledge = formData.minimalKnowledge.filter((_, i) => i !== index);
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
      supervisor2: formData.supervisor2 === "Tidak Ada" ? "-" : formData.supervisor2,
      minimalKnowledge: formData.minimalKnowledge.filter((k) => k.trim() !== ""),
      status: formData.status,
      isDraft: true,
    };

    if (editingTopic) {
      setTopics(topics.map((t) => (t.id === editingTopic.id ? newTopic : t)));
      toast.success("Draft berhasil diperbarui");
    } else {
      setTopics([...topics, newTopic]);
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
      supervisor2: formData.supervisor2 === "Tidak Ada" ? "-" : formData.supervisor2,
      minimalKnowledge: formData.minimalKnowledge.filter((k) => k.trim() !== ""),
      status: formData.status,
      isDraft: false,
    };

    if (editingTopic) {
      setTopics(topics.map((t) => (t.id === editingTopic.id ? newTopic : t)));
      toast.success("Penawaran topik berhasil diperbarui");
    } else {
      setTopics([...topics, newTopic]);
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
      minimalKnowledge: topic.minimalKnowledge.length > 0 ? topic.minimalKnowledge : [""],
      status: topic.status,
    });
    setShowForm(true);
  };

  const handleDelete = (topicId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus topik ini?")) {
      setTopics(topics.filter((t) => t.id !== topicId));
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

  // If viewing topic list (mahasiswa view)
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

  // If form is showing, render form page
  if (showForm) {
    return (
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto">
          {/* Header with Action Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-gray-800 font-[Poppins] text-[24px]">
                  {editingTopic ? "Edit Penawaran Topik" : "Buat Penawaran Topik Baru"}
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
            {/* Status Toggle (Only shown when editing) */}
            {editingTopic && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="font-[Poppins] text-gray-700 mb-3 block">Status Topik</Label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, status: "Tersedia" })}
                    className={`px-6 py-2 rounded-lg font-[Roboto] text-sm transition-all ${
                      formData.status === "Tersedia"
                        ? "bg-green-600 text-white border-2 border-green-700"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-green-400"
                    }`}
                  >
                    Tersedia
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, status: "Diambil" })}
                    className={`px-6 py-2 rounded-lg font-[Roboto] text-sm transition-all ${
                      formData.status === "Diambil"
                        ? "bg-red-600 text-white border-2 border-red-700"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-red-400"
                    }`}
                  >
                    Sudah Diambil
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Judul */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-[Poppins] text-gray-800">
                  Judul Topik <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul topik tugas akhir"
                  className="font-[Roboto]"
                />
              </div>

              {/* Laboratorium */}
              <div className="space-y-2">
                <Label className="font-[Poppins] text-gray-800">
                  Pilih Laboratorium <span className="text-red-500">*</span>
                </Label>
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
                        onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-transparent border-gray-300"
                      />
                      <span className="font-[Roboto] text-gray-700">{lab.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-[Poppins] text-gray-800">
                  Deskripsi Topik <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan detail topik tugas akhir yang ditawarkan"
                  rows={5}
                  className="font-[Roboto]"
                />
              </div>

              {/* Dosen Pembimbing 1 */}
              <div className="space-y-2">
                <Label htmlFor="supervisor1" className="font-[Poppins] text-gray-800">
                  Dosen Pembimbing 1
                </Label>
                <Input
                  id="supervisor1"
                  value={formData.supervisor1}
                  readOnly
                  className="font-[Roboto] bg-gray-50"
                />
              </div>

              {/* Dosen Pembimbing 2 */}
              <div className="space-y-2">
                <Label htmlFor="supervisor2" className="font-[Poppins] text-gray-800">
                  Dosen Pembimbing 2
                </Label>
                <Select
                  value={formData.supervisor2}
                  onValueChange={(value) => setFormData({ ...formData, supervisor2: value })}
                >
                  <SelectTrigger className="font-[Roboto]">
                    <SelectValue placeholder="Pilih Dosen Pembimbing 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSupervisors.map((supervisor) => (
                      <SelectItem key={supervisor} value={supervisor} className="font-[Roboto]">
                        {supervisor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Minimal Pengetahuan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-[Poppins] text-gray-800">Minimal Pengetahuan</Label>
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
                        onChange={(e) => handleKnowledgeChange(index, e.target.value)}
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
            <p className="text-sm text-gray-500 text-center font-[Roboto]">
              © 2021-2025 Institut Teknologi Sepuluh Nopember
            </p>
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

  // Main list page
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
  onClick={() => onNavigate("View Penawaran Topik Dosen")}
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
            <p className="text-gray-800 font-[Roboto] text-sm">Buat Penawaran Topik</p>
            <p className="text-xs text-gray-500 font-[Roboto]">Buat penawaran topik baru untuk mahasiswa</p>
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
              {topics.map((topic) => (
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
                          {topic.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-[Roboto] mb-2 line-clamp-2">
                        {topic.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-[Roboto]">
                        <span className="px-2 py-1 bg-blue-50 rounded border border-blue-200">
                          {topic.laboratory}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
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
                  </div>
                </div>
              ))}
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
    </main>
  );
}