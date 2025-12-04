import { ArrowLeft, Calendar, Clock, MapPin, User, FileText, AlertCircle } from "lucide-react";
import { BookOpen } from "lucide-react";

interface HearingEvent {
  id: number;
  title: string;
  student: string;
  nrp: string;
  type: "Proposal" | "Tugas Akhir";
  startTime: string;
  endTime: string;
  room: string;
  supervisors: string[];
  examiners: string[];
  day: number;
  category: string;
}

interface JadwalSidangDetailPageProps {
  event: HearingEvent;
  onBack: () => void;
}

export function JadwalSidangDetailPage({ event, onBack }: JadwalSidangDetailPageProps) {
  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 font-[Roboto]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Sidang
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-gray-800 font-[Poppins] text-xl mb-1">
                  Sidang {event.type} – {event.student}
                </h1>
                <p className="text-sm text-gray-600 font-[Roboto]">
                  NRP {event.nrp} - S1 - Pembimbing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-[Roboto] border border-yellow-200">
                Perlu Dinilai
              </span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Roboto] text-sm">
                Beri Nilai
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-[Roboto] text-sm">
                  <strong>Batas pemberitahuan revisi hingga 20 Januari 2026</strong>
                </p>
                <p className="text-yellow-700 font-[Roboto] text-xs mt-1">
                  Mahasiswa belum mengumpulkan revisi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-[Roboto] text-sm font-medium bg-white">
                Topik Tugas Akhir
              </button>
              <button className="px-6 py-3 text-gray-600 hover:text-gray-800 font-[Roboto] text-sm bg-gray-50">
                Informasi Sidang
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Judul */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 font-[Roboto] mb-2">Judul</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 font-[Poppins] mb-2">
                  PENERAPAN VISION TRANSFORMER UNTUK DETEKSI ANOMALI JARINGAN KOMPUTER SKALA BESAR
                </p>
                <p className="text-gray-600 font-[Roboto] text-sm">
                  Kategori: {event.category}
                </p>
              </div>
            </div>

            {/* Kategori */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 font-[Roboto] mb-2">Kategori</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 font-[Roboto]">
                  Keamanan Jaringan
                </p>
              </div>
            </div>

            {/* Abstrak */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 font-[Roboto] mb-2">Abstrak</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 font-[Roboto] text-sm leading-relaxed">
                  Penelitian ini bertujuan mengimplementasikan Vision Transformer (ViT) untuk mendeteksi pola anomali pada trafik jaringan kampus berskala besar. Penelitian berfokus pada pengembangan model deteksi yang mampu mengidentifikasi serangan cyber, seperti DDoS dan intrusi, dengan akurasi tinggi. Metode yang digunakan mencakup konversi data jaringan menjadi representasi visual dan pelatihan model ViT untuk klasifikasi anomali. Hasil penelitian menunjukkan bahwa pendekatan ini efektif dalam mendeteksi ancaman keamanan jaringan secara real-time.
                </p>
              </div>
            </div>

            {/* Dosen Pembimbing */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 font-[Roboto] mb-2">Dosen Pembimbing 1</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 font-[Roboto]">
                  {event.supervisors[0] || "Dr. Ahmad Saikhu, S.T., M.T."}
                </p>
              </div>
            </div>

            {/* Berkas Proposal */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 font-[Roboto] mb-2">Berkas Proposal yang Dikumpulkan</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-blue-800 font-[Roboto] text-sm">
                      Proposal_5025221034.pdf
                    </p>
                    <p className="text-blue-600 font-[Roboto] text-xs">
                      Dikumpulkan pada 15 Desember 2025
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-[Roboto] text-sm">
                    Unduh
                  </button>
                </div>
              </div>
            </div>

            {/* Informasi Sidang Section */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-gray-800 font-[Poppins] mb-4">Informasi Sidang</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Jenis / Jengang */}
                <div>
                  <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">Jenis / Jengang</label>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-800 font-[Roboto] text-sm">Sidang {event.type} - S1</span>
                  </div>
                </div>

                {/* Waktu */}
                <div>
                  <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">Waktu</label>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-800 font-[Roboto] text-sm">{event.startTime} - {event.endTime}</span>
                  </div>
                </div>

                {/* Ruangan */}
                <div>
                  <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">Ruangan</label>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-800 font-[Roboto] text-sm">{event.room}</span>
                  </div>
                </div>

                {/* Mahasiswa */}
                <div>
                  <label className="text-sm text-gray-600 font-[Roboto] mb-2 block">Mahasiswa</label>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-800 font-[Roboto] text-sm">{event.student} ({event.nrp})</span>
                  </div>
                </div>
              </div>

              {/* Dosen Pembimbing & Penguji */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm text-gray-600 font-[Roboto] mb-3">Dosen Pembimbing</h4>
                  <div className="space-y-2">
                    {event.supervisors.map((supervisor, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800 font-[Roboto] text-sm">{supervisor}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-600 font-[Roboto] mb-3">Dosen Penguji</h4>
                  <div className="space-y-2">
                    {event.examiners.map((examiner, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800 font-[Roboto] text-sm">{examiner}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
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
  );
}
