import { useState } from "react";
import { BookOpen, X, Upload, FileText, Trash2 } from "lucide-react";
import { GuideModal } from "./GuideModal";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

interface PengumumanAdminEditProps {
  onNavigate: (page: string) => void;
  announcementId?: number;
}

export function PengumumanAdminEdit({ onNavigate, announcementId }: PengumumanAdminEditProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: announcementId ? "Pengumuman Jadwal Sidang Proposal Periode Januari 2025" : "",
    category: announcementId ? "Penting" : "",
    target: announcementId ? "Mahasiswa" : "",
    content: announcementId
      ? "Jadwal sidang proposal periode Januari 2025 telah tersedia. Silakan cek jadwal masing-masing di menu Sidang. Pastikan Anda sudah mempersiapkan dokumen dan presentasi dengan baik."
      : "",
    isActive: announcementId ? true : true,
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    toast.success(`${newFiles.length} file berhasil ditambahkan`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    toast.success("File berhasil dihapus");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.target || !formData.content) {
      toast.error("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    toast.success(
      announcementId
        ? "Pengumuman berhasil diperbarui"
        : "Pengumuman berhasil dibuat"
    );
    setTimeout(() => {
      onNavigate("Kelola Pengumuman");
    }, 500);
  };

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-gray-800 font-[Poppins] text-[24px]">
                  {announcementId ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
                </h1>
                <p className="text-sm text-gray-500 font-[Roboto] mt-1">
                  {announcementId
                    ? "Perbarui informasi pengumuman"
                    : "Lengkapi formulir di bawah untuk membuat pengumuman baru"}
                </p>
              </div>
              <button
                onClick={() => onNavigate("Kelola Pengumuman")}
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
            <div className="space-y-6">
              {/* Status Toggle */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="font-[Poppins] text-gray-700 mb-3 block">Status Pengumuman</Label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, isActive: true })}
                    className={`px-6 py-2 rounded-lg font-[Roboto] text-sm transition-all ${
                      formData.isActive
                        ? "bg-green-600 text-white border-2 border-green-700"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-green-400"
                    }`}
                  >
                    Aktif
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, isActive: false })}
                    className={`px-6 py-2 rounded-lg font-[Roboto] text-sm transition-all ${
                      !formData.isActive
                        ? "bg-gray-600 text-white border-2 border-gray-700"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    Nonaktif
                  </button>
                </div>
              </div>

              {/* Judul */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-[Poppins] text-gray-800">
                  Judul Pengumuman <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul pengumuman"
                  className="font-[Roboto]"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <Label className="font-[Poppins] text-gray-800">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {["Penting", "Info", "Acara", "Deadline", "Sistem"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setFormData({ ...formData, category })}
                      className={`px-4 py-2 rounded-lg font-[Roboto] text-sm border-2 transition-all ${
                        formData.category === category
                          ? "bg-blue-600 text-white border-blue-700"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Audiens */}
              <div className="space-y-2">
                <Label className="font-[Poppins] text-gray-800">
                  Tujuan Pengumuman <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  {["Semua", "Mahasiswa", "Dosen"].map((target) => (
                    <label
                      key={target}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="target"
                        value={target}
                        checked={formData.target === target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-transparent border-gray-300"
                      />
                      <span className="font-[Roboto] text-gray-700">{target}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Konten */}
              <div className="space-y-2">
                <Label htmlFor="content" className="font-[Poppins] text-gray-800">
                  Isi Pengumuman <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tulis isi pengumuman di sini..."
                  rows={8}
                  className="font-[Roboto]"
                />
                <p className="text-xs text-gray-500 font-[Roboto]">
                  Minimal 50 karakter, maksimal 2000 karakter
                </p>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="font-[Poppins] text-gray-800">
                  Lampiran (Opsional)
                </Label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-[Roboto] mb-2">
                    Tarik dan lepas file di sini
                  </p>
                  <p className="text-sm text-gray-500 font-[Roboto] mb-4">
                    atau klik tombol di bawah untuk memilih file
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors font-[Roboto] text-sm">
                    <FileText className="w-4 h-4" />
                    Pilih File
                    <input
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="text-xs text-gray-500 font-[Roboto] mt-2">
                    Maksimal 10MB per file. Format: PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 font-[Roboto] truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 font-[Roboto]">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => onNavigate("Kelola Pengumuman")}
                className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 font-[Roboto] text-sm transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 font-[Roboto] text-sm transition-colors"
              >
                {announcementId ? "Simpan Perubahan" : "Buat Pengumuman"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-[Roboto]">
                © 2021-2025 Institut Teknologi Sepuluh Nopember
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 px-3 py-1 rounded flex items-center gap-2">
                  <span className="text-white text-xs font-[Roboto] font-semibold">ADVANCING</span>
                  <span className="text-white text-xs font-[Roboto] font-semibold">HUMANITY</span>
                </div>
                <div className="text-blue-600 font-bold text-lg">ITS</div>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title={announcementId ? "Panduan Edit Pengumuman" : "Panduan Buat Pengumuman"}
        steps={[
          {
            title: "Informasi Dasar",
            description: "Isi judul pengumuman yang jelas dan menarik perhatian. Pilih kategori yang sesuai (Penting, Info, Acara, Deadline, atau Sistem) agar pengumuman mudah diidentifikasi. Tentukan target audiens apakah untuk Semua, Mahasiswa saja, atau Dosen saja.",
            imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGUlMjBkb2N1bWVudHxlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Menulis Konten",
            description: "Tulis isi pengumuman dengan jelas dan lengkap. Pastikan informasi yang disampaikan mudah dipahami. Gunakan bahasa yang formal namun tetap komunikatif. Sertakan detail penting seperti tanggal, waktu, lokasi, atau syarat jika diperlukan.",
            imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwbm90ZXN8ZW58MXx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Menambahkan Lampiran",
            description: "Anda dapat menambahkan file lampiran seperti PDF, dokumen Word, atau gambar untuk melengkapi pengumuman. Tarik dan lepas file ke area upload atau klik tombol 'Pilih File'. Maksimal ukuran file adalah 10MB per file.",
            imageUrl: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxlJTIwdXBsb2FkfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Mengatur Status",
            description: "Tentukan status pengumuman: Aktif (akan langsung ditampilkan) atau Nonaktif (disimpan sebagai draft). Anda dapat mengubah status kapan saja dari halaman kelola pengumuman. Pengumuman nonaktif tidak akan terlihat oleh mahasiswa dan dosen.",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2UlMjBzZXR0aW5nc3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]}
      />
    </>
  );
}
