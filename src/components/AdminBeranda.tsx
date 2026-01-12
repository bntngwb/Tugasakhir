import { useState } from "react";
import {
  Settings,
  ArrowRight,
  HelpCircle,
  Calendar,
  GraduationCap,
  FileText,
  CheckCircle,
  X,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminBerandaProps {
  onNavigate: (page: string) => void;
}

interface Question {
  id: number;
  name: string;
  nrp: string;
  category: "Teknis" | "Administrasi" | "Bimbingan" | "Sidang" | "Lainnya";
  question: string;
  date: string;
  status: "pending" | "answered";
  answer?: string;
}

export function AdminBeranda({ onNavigate }: AdminBerandaProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");

  // Mock data pertanyaan mahasiswa
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      name: "Ahmad Fauzi Ramadhan",
      nrp: "5025201001",
      category: "Teknis",
      question:
        "Bagaimana cara mengupload file proposal yang ukurannya lebih dari 10MB? Saya sudah coba berkali-kali tapi selalu gagal.",
      date: "4 Des 2025, 10:30",
      status: "pending",
    },
    {
      id: 2,
      name: "Siti Aminah Putri",
      nrp: "5025201015",
      category: "Sidang",
      question:
        "Apakah saya bisa mengajukan reschedule jadwal sidang proposal? Karena ada bentrok dengan kegiatan kampus lain.",
      date: "3 Des 2025, 14:20",
      status: "pending",
    },
    {
      id: 3,
      name: "Bayu Aditya Pratama",
      nrp: "6025201002",
      category: "Bimbingan",
      question:
        "Dosen pembimbing saya tidak merespon email untuk bimbingan. Bagaimana solusinya?",
      date: "2 Des 2025, 09:15",
      status: "pending",
    },
    {
      id: 4,
      name: "Dewi Kartika Sari",
      nrp: "5025201020",
      category: "Administrasi",
      question:
        "Untuk persyaratan sidang TA, apakah wajib sudah mengumpulkan semua berkas atau bisa menyusul?",
      date: "1 Des 2025, 16:45",
      status: "answered",
      answer:
        "Semua berkas persyaratan harus sudah terkumpul minimal 7 hari sebelum jadwal sidang. Silakan cek di menu Sidang untuk detail persyaratan.",
    },
  ]);

  const pendingQuestions = questions.filter((q) => q.status === "pending");

  const openQuestion = (q: Question) => {
    setSelectedQuestion(q);
    setAnswer(q.status === "answered" ? q.answer ?? "" : "");
  };

  const handleSubmitAnswer = () => {
    if (!selectedQuestion) return;
    const trimmed = answer.trim();
    if (!trimmed) return;

    const updated: Question = {
      ...selectedQuestion,
      status: "answered",
      answer: trimmed,
    };

    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setSelectedQuestion(updated);
    setAnswer(updated.answer ?? "");
  };

  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-gray-800 font-[Poppins] mb-2">
          Selamat datang, Bintang Hanoraga
        </h1>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm text-gray-700 font-[Roboto]">
              <span className="font-semibold">Terbaru dari myITS Thesis :</span>
            </p>
            <ul className="text-sm text-gray-700 font-[Roboto] mt-1 list-disc ml-5">
              <li>
                Sesuaikan kehadiran dosen pada sidang, karena pembagi penilaian saat ini berdasarkan dosen yang hadir.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bantu Mahasiswa Section */}
      <div className="mb-8">
        <h2 className="text-gray-800 font-[Poppins] mb-4">Bantu Mahasiswa</h2>
        <div
          onClick={() => pendingQuestions.length > 0 && openQuestion(pendingQuestions[0])}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer relative"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-800 font-[Poppins]">Pertanyaan Mahasiswa</h3>
                {pendingQuestions.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-[Roboto] font-semibold px-2.5 py-1 rounded-full">
                    {pendingQuestions.length} Baru
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 font-[Roboto]">
                {pendingQuestions.length > 0
                  ? `Ada ${pendingQuestions.length} pertanyaan yang menunggu jawaban dari Anda`
                  : "Tidak ada pertanyaan baru dari mahasiswa"}
              </p>
            </div>
            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Konfigurasi Section */}
      <div className="mb-8">
        <h2 className="text-gray-800 font-[Poppins] mb-4">Konfigurasi Sistem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Konfigurasi myITS Thesis */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-gray-800 font-[Poppins] mb-2">Konfigurasi myITS Thesis</h3>
              <p className="text-sm text-gray-600 font-[Roboto] mb-4 flex-grow">
                Atur konfigurasi umum sistem myITS Thesis
              </p>
              <button
                onClick={() => onNavigate("Konfigurasi myITS Thesis")}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors ml-auto"
              >
                <ArrowRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Rubrik Penilaian */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-gray-800 font-[Poppins] mb-2">Rubrik Penilaian</h3>
              <p className="text-sm text-gray-600 font-[Roboto] mb-4 flex-grow">
                Kelola rubrik dan konfigurasi penilaian tugas akhir
              </p>
              <button
                onClick={() => onNavigate("Konfigurasi Nilai")}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors ml-auto"
              >
                <ArrowRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Konfigurasi Sidang */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-gray-800 font-[Poppins] mb-2">Konfigurasi Sidang</h3>
              <p className="text-sm text-gray-600 font-[Roboto] mb-4 flex-grow">
                Atur jadwal, ruangan, dan persyaratan sidang
              </p>
              <button
                onClick={() => onNavigate("Konfigurasi Sidang")}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors ml-auto"
              >
                <ArrowRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Konfigurasi Prasyarat */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-gray-800 font-[Poppins] mb-2">Konfigurasi Prasyarat</h3>
              <p className="text-sm text-gray-600 font-[Roboto] mb-4 flex-grow">
                Tentukan persyaratan untuk mengambil tugas akhir
              </p>
              <button
                onClick={() => onNavigate("Konfigurasi Prasyarat")}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors ml-auto"
              >
                <ArrowRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Data Prodi */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-gray-800 font-[Poppins] mb-2">Data Prodi</h3>
              <p className="text-sm text-gray-600 font-[Roboto] mb-4 flex-grow">
                Kelola data program studi dan laboratorium
              </p>
              <button
                onClick={() => onNavigate("Data Prodi")}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors ml-auto"
              >
                <ArrowRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
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

      {/* Question Detail Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedQuestion(null)}
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
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">Detail Pertanyaan</h2>
                      <p className="text-sm text-gray-600 font-[Roboto]">{selectedQuestion.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Question Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-gray-500 font-[Roboto] mb-1 block">
                      Nama Mahasiswa
                    </label>
                    <p className="text-gray-800 font-[Roboto]">
                      {selectedQuestion.name} - {selectedQuestion.nrp}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 font-[Roboto] mb-1 block">
                      Kategori Pertanyaan
                    </label>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-[Roboto]">
                      {selectedQuestion.category}
                    </span>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 font-[Roboto] mb-1 block">
                      Detail Pertanyaan
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700 font-[Roboto]">{selectedQuestion.question}</p>
                    </div>
                  </div>

                  {selectedQuestion.status === "answered" && (
                    <div>
                      <label className="text-sm text-gray-500 font-[Roboto] mb-1 block">
                        Jawaban Anda
                      </label>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-gray-700 font-[Roboto]">{selectedQuestion.answer}</p>
                      </div>
                    </div>
                  )}

                  {selectedQuestion.status === "pending" && (
                    <div>
                      <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
                        Jawaban
                      </label>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Tulis jawaban untuk mahasiswa..."
                        className="w-full border border-gray-300 rounded-lg p-3 font-[Roboto] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={5}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedQuestion.status === "pending" && (
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto]"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Kirim Jawaban
                    </button>
                  </div>
                )}

                {selectedQuestion.status === "answered" && (
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-[Roboto]"
                    >
                      Tutup
                    </button>
                  </div>
                )}
              </div>

              {/* All Questions List */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h3 className="text-gray-800 font-[Poppins] mb-4">Semua Pertanyaan</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => openQuestion(q)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedQuestion.id === q.id
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "bg-white border border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-[Poppins] text-gray-800">{q.name}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-[Roboto] ${
                            q.status === "pending"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {q.status === "pending" ? "Belum Dijawab" : "Sudah Dijawab"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-[Roboto] truncate">{q.question}</p>
                      <p className="text-xs text-gray-500 font-[Roboto] mt-1">{q.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
