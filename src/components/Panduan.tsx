import { BookOpen, Home, Lightbulb, FileText, Users, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Panduan() {
  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-gray-800 font-[Poppins] text-[24px]">Panduan Lengkap</h1>
          </div>
          <p className="text-sm text-gray-500 font-[Roboto]">
            Panduan penggunaan lengkap untuk semua fitur myITS Thesis
          </p>
        </div>

        {/* Tabs for different pages */}
        <Tabs defaultValue="beranda" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="beranda" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Beranda</span>
            </TabsTrigger>
            <TabsTrigger value="penawaran" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden md:inline">Penawaran Topik</span>
            </TabsTrigger>
            <TabsTrigger value="tugasakhir" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">Tugas Akhir</span>
            </TabsTrigger>
            <TabsTrigger value="sidang" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Sidang</span>
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">Form Usulan</span>
            </TabsTrigger>
          </TabsList>

          {/* Beranda Guide */}
          <TabsContent value="beranda">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-gray-800 font-[Poppins] text-[20px] mb-6">Panduan Beranda</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Tentang Beranda",
                    description: "Halaman Beranda adalah dashboard utama yang menampilkan ringkasan status tugas akhir Anda. Di sini, Anda dapat melihat proposal aktif, jadwal sidang mendatang, dan reminder penting. Gunakan kartu navigasi untuk mengakses fitur-fitur utama dengan cepat.",
                    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBvdmVydmlld3xlbnwxfHx8fDE3NjM3MTIzODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Reminder & Deadline",
                    description: "Beranda menampilkan reminder untuk deadline penting seperti approval proposal (warna merah untuk deadline <3 hari, kuning untuk menunggu), deadline revisi sidang, dan jadwal sidang mendatang. Pastikan Anda selalu mengecek reminder ini secara berkala.",
                    imageUrl: "https://images.unsplash.com/photo-1506784242126-2a0b0b89c56a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW1pbmRlciUyMGRlYWRsaW5lJTIwYWxlcnR8ZW58MXx8fHwxNzYzNzEyMzg3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Kartu Navigasi Cepat",
                    description: "Gunakan kartu navigasi untuk mengakses fitur dengan cepat: Penawaran Topik untuk mencari topik penelitian, Tugas Akhir untuk kelola proposal, Sidang untuk jadwal sidang, dan Pengumuman untuk info terbaru. Klik kartu untuk navigasi langsung.",
                    imageUrl: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXZpZ2F0aW9uJTIwbWVudSUyMGludGVyZmFjZXxlbnwxfHx8fDE3NjM3MTIzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Status Tugas Akhir",
                    description: "Lihat ringkasan status tugas akhir di kartu 'Tugas Akhir Saya'. Sistem menampilkan jumlah proposal (draft, menunggu approval, disetujui) dan tahap saat ini. Klik 'Lihat Detail' untuk melihat informasi lengkap dan melakukan aksi seperti edit atau submit.",
                    imageUrl: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmVzcyUyMHRyYWNraW5nJTIwc3RhdHVzfGVufDF8fHx8MTc2MzcxMjM5NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  }
                ].map((step, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-[Poppins]">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-[Poppins] mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 font-[Roboto] mb-4">{step.description}</p>
                        <ImageWithFallback
                          src={step.imageUrl}
                          alt={step.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Penawaran Topik Guide */}
          <TabsContent value="penawaran">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-gray-800 font-[Poppins] text-[20px] mb-6">Panduan Penawaran Topik</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Tentang Penawaran Topik",
                    description: "Penawaran Topik adalah fitur untuk melihat topik-topik penelitian yang ditawarkan oleh dosen pembimbing. Anda dapat melihat deskripsi lengkap, kategori penelitian, dan dosen pembimbing untuk setiap topik. Filter berdasarkan kategori atau status untuk menemukan topik yang sesuai.",
                    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHRvcGljJTIwYnJhaW5zdG9ybXxlbnwxfHx8fDE3NjM3MTIzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Mencari Topik yang Sesuai",
                    description: "Gunakan fitur pencarian dan filter untuk menemukan topik yang sesuai dengan minat Anda. Filter berdasarkan kategori (Machine Learning, IoT, Web Development, dll) atau status (Tersedia/Diambil). Klik kartu topik untuk melihat detail lengkap.",
                    imageUrl: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyY2glMjBmaWx0ZXIlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzYzNzEyNDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Melihat Detail Topik",
                    description: "Halaman detail topik menampilkan informasi lengkap: deskripsi penelitian, kategori, dosen pembimbing, pengetahuan minimal yang diperlukan, dan mahasiswa yang berminat. Konsultasikan dengan dosen sebelum memutuskan untuk mengambil topik tersebut.",
                    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMGRldGFpbCUyMGluZm9ybWF0aW9ufGVufDF8fHx8MTc2MzcxMjQwNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Menyatakan Minat pada Topik",
                    description: "Jika tertarik dengan topik tertentu, klik tombol 'Saya Tertarik' untuk mendaftar. Nama Anda akan muncul di daftar mahasiswa yang berminat. Dosen akan menghubungi Anda untuk diskusi lebih lanjut. Anda dapat membatalkan minat kapan saja.",
                    imageUrl: "https://images.unsplash.com/photo-1521791055366-0d553872125f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmVzdCUyMHJlZ2lzdHJhdGlvbiUyMGJ1dHRvbnxlbnwxfHx8fDE3NjM3MTI0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  }
                ].map((step, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-[Poppins]">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-[Poppins] mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 font-[Roboto] mb-4">{step.description}</p>
                        <ImageWithFallback
                          src={step.imageUrl}
                          alt={step.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tugas Akhir Guide */}
          <TabsContent value="tugasakhir">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-gray-800 font-[Poppins] text-[20px] mb-6">Panduan Tugas Akhir</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Tentang Tugas Akhir",
                    description: "Halaman Tugas Akhir adalah pusat manajemen proposal dan proyek tugas akhir Anda. Sistem dibagi menjadi dua tahap: Proposal (tahap awal) dan Final (tugas akhir). Kelola semua proposal, lihat status approval, dan pantau progress Anda di sini.",
                    imageUrl: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVzaXMlMjBwcm9qZWN0JTIwcmVzZWFyY2h8ZW58MXx8fHwxNzYzNzEyNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Buat & Kelola Proposal",
                    description: "Klik 'Buat Proposal Baru' untuk membuat usulan tugas akhir. Isi form lengkap (judul, abstrak, kategori, dosen pembimbing, file proposal). Simpan sebagai draft atau submit langsung. Edit draft kapan saja sebelum disubmit. Proposal yang sudah disubmit tidak bisa diedit.",
                    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGUlMjBkb2N1bWVudCUyMGZvcm18ZW58MXx8fHwxNzYzNzEyNDE0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Proses Persetujuan Transparan",
                    description: "Setelah submit, proposal masuk ke proses persetujuan paralel dari Pembimbing 1, Pembimbing 2, dan Admin dalam waktu 84 jam (3 hari). Lihat status approval real-time dalam layout 3-kolom horizontal. Status: menunggu (kuning), approved (hijau), rejected (merah).",
                    imageUrl: "https://images.unsplash.com/photo-1664575262619-b28fef7a40a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHByb3ZhbCUyMHByb2Nlc3MlMjB3b3JrZmxvd3xlbnwxfHx8fDE3NjM3MTI0MjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Status & Tahapan",
                    description: "Proposal memiliki berbagai status: Draft, Menunggu Approval, Disetujui (bisa daftar sidang), Ditolak, atau Siap Daftar Sidang. Setelah sidang proposal lulus, proposal berpindah ke tahap Final. Pantau progress setiap proposal dengan badge berwarna dan countdown timer deadline.",
                    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0dXMlMjBwcm9ncmVzcyUyMHRyYWNraW5nfGVufDF8fHx8MTc2MzcxMjQyNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  }
                ].map((step, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-[Poppins]">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-[Poppins] mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 font-[Roboto] mb-4">{step.description}</p>
                        <ImageWithFallback
                          src={step.imageUrl}
                          alt={step.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Sidang Guide */}
          <TabsContent value="sidang">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-gray-800 font-[Poppins] text-[20px] mb-6">Panduan Sidang</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Tentang Sidang",
                    description: "Halaman ini menampilkan jadwal sidang yang tersedia dan sidang yang telah Anda daftarkan. Kelola jadwal sidang proposal dan sidang akhir Anda di sini. Sistem akan memberikan reminder untuk sidang mendatang dan deadline revisi.",
                    imageUrl: "https://images.unsplash.com/photo-1697650230856-e5b0f9949feb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWZlbnNlJTIwcHJlc2VudGF0aW9uJTIwbWVldGluZ3xlbnwxfHx8fDE3NjM3MTI0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Memilih & Mendaftar Sidang",
                    description: "Klik 'Memilih Sidang' untuk melihat jadwal sidang yang tersedia. Pastikan proposal Anda berstatus 'Siap Daftar Sidang' sebelum mendaftar. Pilih jadwal yang sesuai, lalu pilih proposal yang akan didaftarkan. Sistem akan mengkonfirmasi pendaftaran Anda.",
                    imageUrl: "https://images.unsplash.com/photo-1617106399900-61a7561d1d2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hlZHVsZSUyMGNhbGVuZGFyJTIwcGxhbm5pbmd8ZW58MXx8fHwxNzYzNzEyNDMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Revisi & Deadline",
                    description: "Setelah sidang dilaksanakan, jika ada revisi yang diperlukan, sistem akan menampilkan status 'Revisi' dengan deadline yang harus dipenuhi. Unggah file revisi sebelum deadline. Sistem memberikan reminder merah untuk deadline dalam 3 hari.",
                    imageUrl: "https://images.unsplash.com/photo-1632152053640-da3a8b3ee812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXZpc2lvbiUyMGRvY3VtZW50cyUyMGNoZWNrbGlzdHxlbnwxfHx8fDE3NjM3MTI0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Sidang Selesai & Lanjut",
                    description: "Setelah sidang selesai dan revisi telah diselesaikan, status berubah menjadi 'Sidang Selesai'. Untuk sidang proposal yang lulus, tugas akhir Anda akan berpindah ke tahap final dan dapat didaftarkan untuk sidang akhir di periode berikutnya.",
                    imageUrl: "https://images.unsplash.com/photo-1629196753813-8b4827ddc7c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwc3VjY2VzcyUyMGNlcmVtb255fGVufDF8fHx8MTc2MzcxMjQzOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  }
                ].map((step, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-[Poppins]">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-[Poppins] mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 font-[Roboto] mb-4">{step.description}</p>
                        <ImageWithFallback
                          src={step.imageUrl}
                          alt={step.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Form Usulan Guide */}
          <TabsContent value="form">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-gray-800 font-[Poppins] text-[20px] mb-6">Panduan Form Usulan Tugas Akhir</h2>
              <div className="space-y-8">
                {[
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
                    imageUrl: "https://images.unsplash.com/photo-1715520530023-cc8a1b2044ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxlJTIwdXBsb2FkJTIwZG9jdW1lbnR8ZW58MXx8fHwxNjM3MTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  },
                  {
                    title: "Submit & Persetujuan",
                    description: "Setelah semua field terisi, klik 'Kumpulkan' untuk mengirim proposal. Proposal akan masuk ke proses persetujuan oleh Pembimbing 1, Pembimbing 2, dan Admin. Anda dapat memantau progress approval dengan deadline 3 hari di halaman Tugas Akhir.",
                    imageUrl: "https://images.unsplash.com/photo-1620632889724-f1ddc7841c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHByb3ZhbCUyMGNoZWNrbGlzdCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzYzNjM5MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  }
                ].map((step, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-[Poppins]">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-[Poppins] mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 font-[Roboto] mb-4">{step.description}</p>
                        <ImageWithFallback
                          src={step.imageUrl}
                          alt={step.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
        </footer>
      </div>
    </main>
  );
}