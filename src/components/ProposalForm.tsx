import { ArrowLeft, Upload, X, MessageCircle, Send, BookOpen, AlertCircle, HelpCircle, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner@2.0.3";
import { GuideModal } from "./GuideModal";

interface Proposal {
  id: number;
  title: string;
  category: string;
  grouped: string;
  abstract: string;
  keywords: string;
  supervisor1: string;
  supervisor2: string;
  file: File | null;
  fileName: string;
}

interface ProposalFormProps {
  onBack: () => void;
  onSave: (proposal: any, isDraft: boolean) => void;
  editingProposal?: Proposal | null;
}

export function ProposalForm({ onBack, onSave, editingProposal }: ProposalFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    grouped: "",
    abstract: "",
    keywords: "",
    supervisor1: "",
    supervisor2: "",
    file: null as File | null,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    category: "",
    question: "",
    email: ""
  });

  useEffect(() => {
    if (editingProposal) {
      setFormData({
        title: editingProposal.title || "",
        category: editingProposal.category || "",
        grouped: editingProposal.grouped || "",
        abstract: editingProposal.abstract || "",
        keywords: editingProposal.keywords || "",
        supervisor1: editingProposal.supervisor1 || "",
        supervisor2: editingProposal.supervisor2 || "",
        file: editingProposal.file || null,
      });
    }
  }, [editingProposal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push("Judul");
    if (!formData.category) errors.push("Kategori");
    if (!formData.grouped) errors.push("Berkelompok");
    if (!formData.abstract.trim()) errors.push("Abstrak");
    if (!formData.keywords.trim()) errors.push("Kata Kunci");
    if (!formData.supervisor1) errors.push("Dosen Pembimbing 1");
    if (!formData.file) errors.push("File Proposal");

    return errors;
  };

  const handleSaveDraft = () => {
    const errors = validateForm();
    onSave({ ...formData, missingFields: errors }, true);
    toast.success("Draft berhasil disimpan");
  };

  const handleSaveSubmission = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidation(true);
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setShowValidation(false);
    onSave({ ...formData, missingFields: [] }, false);
    toast.success("Usulan berhasil diajukan");
  };

  const handleSubmitContact = () => {
    if (!contactForm.category || !contactForm.question || !contactForm.email) {
      toast.error("Mohon lengkapi semua field");
      return;
    }
    
    toast.success("Pertanyaan berhasil dikirim ke admin");
    setContactForm({ category: "", question: "", email: "" });
    setIsContactModalOpen(false);
  };

  const categories = [
    "ALPRO - Algoritma dan Pemrograman",
    "RPL - Rekayasa Perangkat Lunak",
    "GIGA - Game dan Interaksi Grafika",
    "MCI - Manajemen dan Cerdas Informasi",
    "KCV - Komputasi Cerdas dan Visi",
    "NCC - Jaringan Cerdas dan Cyber Security",
    "NETICS - Internet Cerdas dan Sistem",
    "PKT - Pengolahan Kode dan Teks"
  ];

  const supervisors = [
    "Dr. Ahmad Hidayat, S.T., M.T.",
    "Prof. Dr. Ir. Siti Nurjanah, M.Kom.",
    "Dr. Budi Santoso, S.Kom., M.T.",
    "Ir. Dewi Lestari, M.Sc.",
    "Dr. Rina Wijaya, M.Kom.",
    "Dr. Lisa Permata, S.T., M.T.",
    "Dr. Hendra Wijaya, M.T.",
    "Dr. Bambang Susilo, M.Kom."
  ];

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6 font-[Roboto] text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Tugas Akhir
        </button>

        {/* Header with Action Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">
                {editingProposal ? "Edit Usulan Tugas Akhir" : "Buat Usulan Tugas Akhir"}
              </h1>
              <p className="text-sm text-gray-500 font-[Roboto] mt-1">
                Lengkapi formulir di bawah untuk mengajukan usulan tugas akhir
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-[Roboto] text-sm transition-colors"
            >
              Hubungi Admin
            </button>
            <button 
              onClick={() => setIsGuideModalOpen(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-[Roboto] text-sm transition-colors"
            >
              Panduan
            </button>
          </div>
        </div>

        {/* Validation Warning */}
        {showValidation && validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-[Roboto] text-red-800 mb-2">
                Mohon lengkapi field berikut sebelum mengajukan usulan:
              </p>
              <ul className="text-sm font-[Roboto] text-red-700 list-disc list-inside">
                {validationErrors.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-800 font-[Poppins]">
                Judul <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Masukkan judul tugas akhir"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="font-[Roboto]"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-800 font-[Poppins]">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="font-[Roboto]">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="font-[Roboto]">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grouped */}
            <div className="space-y-2">
              <Label htmlFor="grouped" className="text-gray-800 font-[Poppins]">
                Berkelompok <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.grouped} onValueChange={(value) => setFormData({ ...formData, grouped: value })}>
                <SelectTrigger className="font-[Roboto]">
                  <SelectValue placeholder="Pilih opsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes" className="font-[Roboto]">Ya</SelectItem>
                  <SelectItem value="no" className="font-[Roboto]">Tidak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Abstract */}
            <div className="space-y-2">
              <Label htmlFor="abstract" className="text-gray-800 font-[Poppins]">
                Abstrak <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="abstract"
                placeholder="Masukkan abstrak tugas akhir"
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                className="font-[Roboto] min-h-[150px]"
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="keywords" className="text-gray-800 font-[Poppins]">
                Kata Kunci <span className="text-red-500">*</span>
              </Label>
              <Input
                id="keywords"
                placeholder="Masukkan kata kunci (pisahkan dengan koma)"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="font-[Roboto]"
              />
              <p className="text-xs text-gray-500 font-[Roboto]">
                Contoh: machine learning, computer vision, deep learning
              </p>
            </div>

            {/* Supervisor 1 */}
            <div className="space-y-2">
              <Label htmlFor="supervisor1" className="text-gray-800 font-[Poppins]">
                Dosen Pembimbing 1 <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.supervisor1} onValueChange={(value) => setFormData({ ...formData, supervisor1: value })}>
                <SelectTrigger className="font-[Roboto]">
                  <SelectValue placeholder="Pilih dosen pembimbing 1" />
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map((supervisor) => (
                    <SelectItem key={supervisor} value={supervisor} className="font-[Roboto]">
                      {supervisor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Supervisor 2 */}
            <div className="space-y-2">
              <Label htmlFor="supervisor2" className="text-gray-800 font-[Poppins]">
                Dosen Pembimbing 2
              </Label>
              <Select value={formData.supervisor2} onValueChange={(value) => setFormData({ ...formData, supervisor2: value })}>
                <SelectTrigger className="font-[Roboto]">
                  <SelectValue placeholder="Pilih dosen pembimbing 2 (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map((supervisor) => (
                    <SelectItem key={supervisor} value={supervisor} className="font-[Roboto]">
                      {supervisor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-gray-800 font-[Poppins]">
                File Proposal <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-[Roboto] mb-1">
                    {formData.file ? formData.file.name : "Klik untuk upload file"}
                  </p>
                  <p className="text-xs text-gray-500 font-[Roboto]">
                    Format: PDF, DOC, DOCX (Maks. 10MB)
                  </p>
                </label>
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
              onClick={handleSaveSubmission}
              className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 font-[Roboto] text-sm transition-colors"
            >
              Simpan Usulan
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
        </footer>

        {/* Contact Admin Modal */}
        <AnimatePresence>
          {isContactModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsContactModalOpen(false);
                  setContactForm({ category: "", question: "", email: "" });
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="font-[Poppins] text-gray-800">Hubungi Admin</h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsContactModalOpen(false);
                      setContactForm({ category: "", question: "", email: "" });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <p className="text-sm text-gray-600 font-[Roboto]">
                    Jika Anda mengalami kesulitan atau memiliki pertanyaan, silakan hubungi admin melalui form di bawah ini.
                  </p>

                  {/* Section 1: Kategori Pertanyaan */}
                  <div className="space-y-2">
                    <Label htmlFor="contact-category" className="text-gray-800 font-[Poppins]">
                      Pertanyaan di Bagian Apa? <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={contactForm.category} 
                      onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                    >
                      <SelectTrigger className="font-[Roboto]">
                        <SelectValue placeholder="Pilih kategori pertanyaan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error-system" className="font-[Roboto]">Error pada Sistem</SelectItem>
                        <SelectItem value="kebingungan" className="font-[Roboto]">Kebingungan Menggunakan Fitur</SelectItem>
                        <SelectItem value="salah-isi-form" className="font-[Roboto]">Salah Mengisi Form</SelectItem>
                        <SelectItem value="pertanyaan-umum" className="font-[Roboto]">Pertanyaan Umum</SelectItem>
                        <SelectItem value="lainnya" className="font-[Roboto]">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Section 2: Pertanyaan */}
                  <div className="space-y-2">
                    <Label htmlFor="contact-question" className="text-gray-800 font-[Poppins]">
                      Tuliskan Pertanyaan Anda <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="contact-question"
                      placeholder="Jelaskan pertanyaan atau masalah yang Anda alami..."
                      value={contactForm.question}
                      onChange={(e) => setContactForm({ ...contactForm, question: e.target.value })}
                      className="font-[Roboto] min-h-[120px]"
                    />
                  </div>

                  {/* Section 3: Email */}
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-gray-800 font-[Poppins]">
                      Email Anda <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="contoh@email.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="font-[Roboto] pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 font-[Roboto]">
                      Admin akan menghubungi Anda melalui email ini
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() => {
                      setIsContactModalOpen(false);
                      setContactForm({ category: "", question: "", email: "" });
                    }}
                    className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 font-[Roboto] text-sm transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitContact}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-[Roboto] text-sm transition-colors"
                  >
                    Kirim Pertanyaan
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guide Modal */}
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          title="Panduan Penggunaan - Form Usulan Tugas Akhir"
          steps={[
            {
              title: "Tentang Form Usulan",
              description: "Form ini digunakan untuk mengajukan proposal tugas akhir. Lengkapi semua field yang diperlukan termasuk judul, abstrak, kategori, dan dosen pembimbing. Anda dapat menyimpan sebagai draft jika belum siap submit, atau langsung submit untuk proses persetujuan.",
              imageUrl: "https://images.unsplash.com/photo-1721379805142-faaa28ab1424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtJTIwZG9jdW1lbnQlMjB3cml0aW5nfGVufDF8fHx8MTc2MzcxMjQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            },
            {
              title: "Pilih Dosen Pembimbing",
              description: "Pilih Dosen Pembimbing 1 (wajib) dan Dosen Pembimbing 2 (opsional) dari dropdown. Pastikan dosen yang dipilih sesuai dengan bidang penelitian Anda. Konsultasikan terlebih dahulu dengan dosen sebelum mengajukan proposal.",
              imageUrl: "https://images.unsplash.com/photo-1758873271761-6cfe9b4f000c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHN1cGVydmlzb3IlMjBtZWV0aW5nfGVufDF8fHx8MTc2MzcxMjQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            },
            {
              title: "Upload File Proposal",
              description: "Unggah file proposal tugas akhir dalam format PDF atau DOCX (maksimal 10MB). File harus berisi outline penelitian, metodologi, dan referensi yang relevan. Pastikan file sudah lengkap sebelum mengumpulkan proposal.",
              imageUrl: "https://images.unsplash.com/photo-1715520530023-cc8a1b2044ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxlJTIwdXBsb2FkJTIwZG9jdW1lbnR8ZW58MXx8fHwxNzYzNzEyNDcwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            },
            {
              title: "Submit & Persetujuan",
              description: "Setelah semua field terisi, klik 'Kumpulkan' untuk mengirim proposal. Proposal akan masuk ke proses persetujuan oleh Pembimbing 1, Pembimbing 2, dan Admin. Anda dapat memantau progress approval dengan deadline 3 hari di halaman Tugas Akhir.",
              imageUrl: "https://images.unsplash.com/photo-1620632889724-f1ddc7841c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHByb3ZhbCUyMGNoZWNrbGlzdCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzYzNjM5MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]}
        />
      </div>
    </main>
  );
}