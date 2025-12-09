import { useState } from "react";
import { BookOpen, Search, ChevronDown } from "lucide-react";
import { GuideModal } from "./GuideModal";

interface LecturerData {
  id: number;
  nama: string;
  nip: string;
  s1: { ut: number; co: number };
  s2: { ut: number; co: number };
  s3: { ut: number; co: number };
  d4: { ut: number; co: number };
}

export function PembimbinganDosenAdmin() {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("Prodi Reguler");
  const [searchQuery, setSearchQuery] = useState("");

  const lecturers: LecturerData[] = [
    {
      id: 1,
      nama: "Adi Suryani, S.S., M.Ed.(M.), Ph.D.",
      nip: "187901202002122002",
      s1: { ut: 0, co: 0 },
      s2: { ut: 7, co: 0 },
      s3: { ut: 0, co: 0 },
      d4: { ut: 0, co: 0 }
    },
    {
      id: 2,
      nama: "Alif Rohmatul Hidayah, S.I.Kom., M.Med.Kom.",
      nip: "199602031019",
      s1: { ut: 0, co: 2 },
      s2: { ut: 0, co: 0 },
      s3: { ut: 0, co: 0 },
      d4: { ut: 0, co: 0 }
    },
    {
      id: 3,
      nama: "Aurelius Ratu, S.S., M.Hum.",
      nip: "198320181032",
      s1: { ut: 0, co: 1 },
      s2: { ut: 0, co: 0 },
      s3: { ut: 0, co: 0 },
      d4: { ut: 0, co: 0 }
    },
    {
      id: 4,
      nama: "Deli Rahmawati, S.I.P., M.T.",
      nip: "199420191265",
      s1: { ut: 0, co: 13 },
      s2: { ut: 0, co: 0 },
      s3: { ut: 0, co: 0 },
      d4: { ut: 0, co: 0 }
    },
    {
      id: 5,
      nama: "Dr. Ahmad Saikhu, S.Kom., M.Kom.",
      nip: "198520151987",
      s1: { ut: 8, co: 5 },
      s2: { ut: 2, co: 1 },
      s3: { ut: 0, co: 0 },
      d4: { ut: 0, co: 0 }
    },
    {
      id: 6,
      nama: "Prof. Dini Adni Navastara, S.T., M.Sc., Ph.D.",
      nip: "197801151999",
      s1: { ut: 12, co: 8 },
      s2: { ut: 4, co: 2 },
      s3: { ut: 1, co: 0 },
      d4: { ut: 0, co: 0 }
    },
    {
      id: 7,
      nama: "Dr. Retno Wardani, S.Kom., M.T.",
      nip: "198305121990",
      s1: { ut: 6, co: 4 },
      s2: { ut: 1, co: 0 },
      s3: { ut: 0, co: 0 },
      d4: { ut: 0, co: 0 }
    },
    {
      id: 8,
      nama: "Fajar Pradana, S.Kom., M.Kom.",
      nip: "199012201998",
      s1: { ut: 5, co: 3 },
      s2: { ut: 0, co: 1 },
      s3: { ut: 0, co: 0 },
      d4: { ut: 0, co: 0 }
    },
    {
      id: 9,
      nama: "Dr. Rizal Fathoni, S.Kom., M.T.",
      nip: "198709151992",
      s1: { ut: 4, co: 6 },
      s2: { ut: 1, co: 0 },
      s3: { ut: 0, co: 0 },
      d4: { ut: 0, co: 0 }
    }
  ];

  const filteredLecturers = lecturers.filter(lecturer =>
    lecturer.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecturer.nip.includes(searchQuery)
  );

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">Dosen Pembimbing</h1>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-[Poppins]">Panduan Penggunaan</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Detail Pembimbingan Dosen
            </p>
          </div>

          {/* Subtitle */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            <h2 className="text-lg text-gray-800 font-[Poppins] mb-2">Detail Pembimbingan Dosen</h2>
            <p className="text-sm text-gray-600 font-[Roboto]">S1 Studi Pembangunan - Gasal 2025/2026</p>
          </div>

          {/* Tabs */}
          <div className="mb-4">
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setSelectedProgram("Prodi Reguler")}
                className={`px-4 py-2 font-[Roboto] text-sm transition-colors ${
                  selectedProgram === "Prodi Reguler"
                    ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Prodi Reguler
              </button>
              <button
                onClick={() => setSelectedProgram("Prodi Non-Reguler")}
                className={`px-4 py-2 font-[Roboto] text-sm transition-colors ${
                  selectedProgram === "Prodi Non-Reguler"
                    ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Prodi Non-Reguler
              </button>
            </div>
          </div>

          {/* Table Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-[Roboto]">
                10+ data/halaman
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm w-64"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th rowSpan={2} className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 border-r border-gray-200">No.</th>
                    <th rowSpan={2} className="px-4 py-3 text-left text-sm font-[Poppins] text-gray-700 border-r border-gray-200">Nama Dosen</th>
                    <th rowSpan={2} className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-700 border-r border-gray-200">D4</th>
                    <th colSpan={2} className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-700 border-r border-gray-200 bg-blue-50">S1</th>
                    <th colSpan={2} className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-700 border-r border-gray-200 bg-green-50">S2</th>
                    <th colSpan={2} className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-700 bg-purple-50">S3</th>
                  </tr>
                  <tr>
                    <th className="px-3 py-2 text-center text-xs font-[Poppins] text-gray-600 border-r border-gray-200 bg-blue-50">Ut</th>
                    <th className="px-3 py-2 text-center text-xs font-[Poppins] text-gray-600 border-r border-gray-200 bg-blue-50">Co</th>
                    <th className="px-3 py-2 text-center text-xs font-[Poppins] text-gray-600 border-r border-gray-200 bg-green-50">Ut</th>
                    <th className="px-3 py-2 text-center text-xs font-[Poppins] text-gray-600 border-r border-gray-200 bg-green-50">Co</th>
                    <th className="px-3 py-2 text-center text-xs font-[Poppins] text-gray-600 border-r border-gray-200 bg-purple-50">Ut</th>
                    <th className="px-3 py-2 text-center text-xs font-[Poppins] text-gray-600 bg-purple-50">Co</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLecturers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <p className="text-gray-500 font-[Roboto]">Tidak ada data yang ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLecturers.map((lecturer, index) => (
                      <tr key={lecturer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-700 font-[Roboto] border-r border-gray-100">{index + 1}.</td>
                        <td className="px-4 py-3 border-r border-gray-100">
                          <p className="text-sm text-gray-800 font-[Poppins] font-medium">{lecturer.nama}</p>
                          <p className="text-xs text-gray-500 font-[Roboto]">{lecturer.nip}</p>
                        </td>
                        <td className="px-4 py-3 text-center border-r border-gray-100">
                          <span className="text-sm text-gray-700 font-[Roboto]">{lecturer.d4.ut + lecturer.d4.co}</span>
                        </td>
                        <td className="px-3 py-3 text-center border-r border-gray-100 bg-blue-50/50">
                          <span className="text-sm text-gray-800 font-[Roboto] font-medium">{lecturer.s1.ut}</span>
                        </td>
                        <td className="px-3 py-3 text-center border-r border-gray-100 bg-blue-50/50">
                          <span className="text-sm text-gray-800 font-[Roboto] font-medium">{lecturer.s1.co}</span>
                        </td>
                        <td className="px-3 py-3 text-center border-r border-gray-100 bg-green-50/50">
                          <span className="text-sm text-gray-800 font-[Roboto] font-medium">{lecturer.s2.ut}</span>
                        </td>
                        <td className="px-3 py-3 text-center border-r border-gray-100 bg-green-50/50">
                          <span className="text-sm text-gray-800 font-[Roboto] font-medium">{lecturer.s2.co}</span>
                        </td>
                        <td className="px-3 py-3 text-center border-r border-gray-100 bg-purple-50/50">
                          <span className="text-sm text-gray-800 font-[Roboto] font-medium">{lecturer.s3.ut}</span>
                        </td>
                        <td className="px-3 py-3 text-center bg-purple-50/50">
                          <span className="text-sm text-gray-800 font-[Roboto] font-medium">{lecturer.s3.co}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredLecturers.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 font-[Roboto]">
                  Menampilkan halaman 1 dari 1
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
      </main>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title="Panduan Penggunaan - Dosen Pembimbing"
        steps={[
          {
            title: "Database Dosen Pembimbing",
            description: "Halaman ini menampilkan database lengkap dosen pembimbing dengan jumlah mahasiswa bimbingan untuk setiap jenjang (D4, S1, S2, S3). Kolom 'Ut' menunjukkan jumlah sebagai pembimbing utama, sedangkan 'Co' menunjukkan jumlah sebagai co-pembimbing.",
            imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyfGVufDB8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Filter Program Studi",
            description: "Gunakan tab 'Prodi Reguler' dan 'Prodi Non-Reguler' untuk memfilter data dosen berdasarkan program studi yang diampu. Data yang ditampilkan akan disesuaikan dengan tab yang dipilih.",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2UlMjBzZXR0aW5nc3xlbnwxfHx8fDE3Mzc4MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Pencarian Dosen",
            description: "Gunakan kolom pencarian untuk menemukan dosen tertentu berdasarkan nama atau NIP. Hasil pencarian akan ditampilkan secara real-time saat Anda mengetik.",
            imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMG1lZXRpbmd8ZW58MHx8fHwxNzM3ODAwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            title: "Interpretasi Data",
            description: "Warna background membantu membedakan jenjang: Biru untuk S1, Hijau untuk S2, dan Ungu untuk S3. Jumlah total bimbingan dapat dilihat dengan menjumlahkan kolom 'Ut' dan 'Co' untuk setiap jenjang. Informasi ini berguna untuk alokasi pembimbing baru.",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmVzcyUyMHRyYWNraW5nfGVufDF8fHx8MTczNzgwMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]}
      />
    </>
  );
}