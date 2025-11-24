import { ArrowLeft, Mail, User, FileText, Upload, X, Paperclip } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface TopicDetailProps {
  topic: {
    id: number;
    title: string;
    supervisor: string;
    supervisor2?: string;
    category: string;
    status: "Tersedia" | "Diambil";
    description: string;
    minimalKnowledge: string[];
    interestedStudents: string[];
  };
  onBack: () => void;
  userRole: "Mahasiswa" | "Dosen";
}

export function TopicDetail({ topic, onBack, userRole }: TopicDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    studentName: "Bintang Wibi Hanoraga",
    studentEmail: "bintang.hanoraga@mahasiswa.its.ac.id",
    studentNRP: "5025201234",
    abstract: "",
    file: null as File | null,
    fileName: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEmailData({ ...emailData, file: file, fileName: file.name });
    }
  };

  const handleSendEmail = () => {
    // Validation
    if (!emailData.abstract.trim()) {
      toast.error("Abstrak proposal harus diisi!");
      return;
    }

    if (!emailData.file) {
      toast.error("File proposal harus dilampirkan!");
      return;
    }

    // Success
    toast.success("Email berhasil dikirim ke dosen pembimbing!");
    setIsModalOpen(false);
    
    // Reset form
    setEmailData({
      ...emailData,
      abstract: "",
      file: null,
      fileName: ""
    });
  };

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-[Roboto] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Penawaran Topik
        </button>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-start justify-between mb-3">
              <h1 className="font-[Poppins] text-[22px] pr-4">
                {topic.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-[Roboto] whitespace-nowrap ${
                topic.status === "Tersedia" 
                  ? "bg-green-500 text-white" 
                  : "bg-red-500 text-white"
              }`}>
                {topic.status}
              </span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-sm font-[Roboto] bg-white/20 backdrop-blur-sm">
              {topic.category}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Deskripsi */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 className="font-[Poppins] text-gray-800">Deskripsi Topik</h3>
              </div>
            <p className="text-sm text-gray-700 font-[Roboto] leading-relaxed pl-3">
                {topic.description}
              </p>
            </div>

            {/* Dosen Pembimbing Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 className="font-[Poppins] text-gray-800">Dosen Pembimbing</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pl-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">Pembimbing 1</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-gray-800 font-[Roboto]">
                      {topic.supervisor}
                    </p>
                  </div>
                </div>
                {topic.supervisor2 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 font-[Roboto] mb-1">Pembimbing 2</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {topic.supervisor2}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Minimal Pengetahuan */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 className="font-[Poppins] text-gray-800">Minimal Pengetahuan</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-2 pl-3">
                {topic.minimalKnowledge.map((knowledge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <p className="text-sm text-gray-700 font-[Roboto]">
                      {knowledge}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mahasiswa yang Berminat */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 className="font-[Poppins] text-gray-800">Mahasiswa yang Berminat</h3>
              </div>
              <div className="pl-3">
                {topic.interestedStudents.length > 0 ? (
                  <div className="space-y-2">
                    {topic.interestedStudents.map((student, index) => (
                      <div key={index} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                        <User className="w-4 h-4 text-blue-600" />
                        <p className="text-sm text-gray-700 font-[Roboto]">
                          {student}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-[Roboto] italic bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                    Belum ada mahasiswa yang berminat
                  </p>
                )}
              </div>
            </div>

            {/* Action Button – hanya untuk Mahasiswa */}
            {userRole === "Mahasiswa" && (
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-[Roboto] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Hubungi Dosen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

      {/* Email Modal */}
      <AnimatePresence>
        {isModalOpen && userRole === "Mahasiswa" && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-[Poppins] text-[20px] mb-2">Hubungi Dosen Pembimbing</h2>
                      <p className="text-sm text-blue-100 font-[Roboto]">Kirim proposal Anda ke dosen pembimbing</p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-5">
                  {/* Topic Info */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-gray-600 font-[Roboto] mb-1">Topik yang Dipilih</p>
                    <p className="text-sm text-gray-800 font-[Poppins]">{topic.title}</p>
                    <p className="text-xs text-gray-600 font-[Roboto] mt-2">Dosen: {topic.supervisor}</p>
                  </div>

                  {/* Student Info (Read-only) */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-[Roboto]">
                        Nama Mahasiswa
                      </label>
                      <input
                        type="text"
                        value={emailData.studentName}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-[Roboto] text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-[Roboto]">
                        NRP
                      </label>
                      <input
                        type="text"
                        value={emailData.studentNRP}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-[Roboto] text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Student Email (Read-only) */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Roboto]">
                      Email Mahasiswa
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={emailData.studentEmail}
                        disabled
                        className="flex-1 bg-transparent text-sm font-[Roboto] text-gray-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* Abstrak */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Roboto]">
                      Abstrak Proposal <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={emailData.abstract}
                      onChange={(e) => setEmailData({ ...emailData, abstract: e.target.value })}
                      placeholder="Tuliskan abstrak proposal Anda di sini..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-[Roboto] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={6}
                    />
                    <p className="text-xs text-gray-500 font-[Roboto] mt-1">
                      Jelaskan secara singkat tentang proposal tugas akhir Anda
                    </p>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Roboto]">
                      File Proposal <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        id="proposal-file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <label
                        htmlFor="proposal-file"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-700 font-[Roboto]">
                          {emailData.fileName ? (
                            <span className="text-blue-600">{emailData.fileName}</span>
                          ) : (
                            <>
                              <span className="text-blue-600 hover:underline">Klik untuk upload</span> atau drag and drop
                            </>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 font-[Roboto]">
                          PDF, DOC, DOCX (max. 10MB)
                        </p>
                      </label>
                    </div>
                    {emailData.fileName && (
                      <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <Paperclip className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-700 font-[Roboto] flex-1">
                          {emailData.fileName}
                        </p>
                        <button
                          onClick={() => setEmailData({ ...emailData, file: null, fileName: "" })}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-[Roboto] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-[Roboto] transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Kirim Email
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
