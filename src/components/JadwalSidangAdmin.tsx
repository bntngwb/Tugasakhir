import { useState } from "react";
import { Download, Search, FileText, ChevronDown } from "lucide-react";

export function JadwalSidangAdmin() {
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedJenisSidang, setSelectedJenisSidang] = useState("");
  const [selectedNamaSidang, setSelectedNamaSidang] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Mock data for the table
  const sidangData = [
    {
      no: 1,
      judul: "ANALISIS TRANSFORMASI MODEL BISNIS UMKM : STUDI MOTIVASI TENTANG PERILAKU PELAKU UMKM DARI PRODUSEN KE DROPSHIPPER DI PASAR BUAH PANDAAN",
      subJudul: "ANALYSIS OF UMKM BUSINESS MODEL TRANSFORMATION",
      mahasiswa: {
        nama: "Nisa Intan Kamila",
        nrp: "5032211101"
      },
      namaSidang: "Sidang Akhir - Sidang Tugas Akhir - Semester Ganjil 2025 (1)",
      jadwal: {
        tanggal: "2 Desember 2025",
        waktu: "13.00-15.00",
        ruang: "Ruang Koliah (AA-102)"
      },
      coPembimbing: "Dra. Endang Susilowati, M.S. (19610818198603200l)",
      dosenPembimbing: [
        "Utama: Dra. Endang Susilowati, M.S. (19610818198603200l)",
        "Co-Pembimbing: Muhammad Ubaidillah, S.Kom, M.Sc. (2022199411039)"
      ],
      dosenPenguji: [
        "Muhammad Nurif, S.E., M.T. (196906141996021001)",
        "Yuni Setyangingsih, S.K.Pm., M.Sc. (199006032201220024)"
      ]
    }
  ];

  const handleDownloadExcel = () => {
    // Handle Excel download
    console.log("Download Excel");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-gray-800 font-[Poppins] mb-6">Jadwal Sidang</h1>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-700 font-[Roboto]">
            Halaman ini hanya berisi daftar sidang yang telah dijadwalkan. Untuk menjadwalkan sidang baru, silakan klik di halaman{" "}
            <span className="font-semibold">Periode Sidang</span> berikut.
          </p>
        </div>
      </div>

      {/* Filters and Download */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Laboratorium Dropdown */}
          <div>
            <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
              Laboratorium
            </label>
            <div className="relative">
              <select
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Roboto] text-sm appearance-none bg-white"
              >
                <option value="">Semua Laboratorium</option>
                <option value="kcv">KCV</option>
                <option value="mci">MCI</option>
                <option value="rpl">RPL</option>
                <option value="ncc">NCC</option>
                <option value="netics">NETICS</option>
                <option value="alpro">ALPRO</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Jenis Sidang Dropdown */}
          <div>
            <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
              Jenis Sidang
            </label>
            <div className="relative">
              <select
                value={selectedJenisSidang}
                onChange={(e) => setSelectedJenisSidang(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Roboto] text-sm appearance-none bg-white"
              >
                <option value="">Semua jenis sidang</option>
                <option value="proposal">Sidang Proposal</option>
                <option value="akhir">Sidang Akhir</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Pilih Nama Sidang Dropdown */}
          <div>
            <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
              Pilih nama sidang
            </label>
            <div className="relative">
              <select
                value={selectedNamaSidang}
                onChange={(e) => setSelectedNamaSidang(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Roboto] text-sm appearance-none bg-white"
              >
                <option value="">Semua nama sidang</option>
                <option value="sidang1">Sidang Akhir - Semester Ganjil 2025 (1)</option>
                <option value="sidang2">Sidang Proposal - Semester Ganjil 2025 (1)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-[Roboto] text-sm flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-[Roboto]">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 font-[Roboto]">entries</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-600 font-[Roboto] font-semibold">
                  No.
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 font-[Roboto] font-semibold min-w-[300px]">
                  Judul
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 font-[Roboto] font-semibold">
                  Mahasiswa
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 font-[Roboto] font-semibold">
                  Nama Sidang
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 font-[Roboto] font-semibold">
                  Jadwal
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 font-[Roboto] font-semibold">
                  Dosen Pembimbing
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 font-[Roboto] font-semibold">
                  Dosen Penguji
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 font-[Roboto] font-semibold">
                  Berita Acara
                </th>
              </tr>
            </thead>
            <tbody>
              {sidangData.map((item) => (
                <tr key={item.no} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">
                    {item.no}.
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-800 font-[Roboto] font-semibold mb-1">
                        {item.judul}
                      </p>
                      <p className="text-xs text-gray-500 font-[Roboto] italic">
                        {item.subJudul}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {item.mahasiswa.nama}
                      </p>
                      <p className="text-xs text-gray-500 font-[Roboto]">
                        {item.mahasiswa.nrp}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">
                    {item.namaSidang}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-800 font-[Roboto] flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {item.jadwal.tanggal}
                      </p>
                      <p className="text-xs text-gray-500 font-[Roboto]">
                        {item.jadwal.waktu}
                      </p>
                      <p className="text-xs text-gray-500 font-[Roboto] flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.jadwal.ruang}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {item.dosenPembimbing.map((dosen, idx) => (
                        <p key={idx} className="text-xs text-gray-700 font-[Roboto]">
                          • {dosen}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {item.dosenPenguji.map((dosen, idx) => (
                        <p key={idx} className="text-xs text-gray-700 font-[Roboto]">
                          • {dosen}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded flex items-center justify-center transition-colors">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-[Roboto]">
            Showing 1 to {sidangData.length} of {sidangData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-[Roboto] transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-[Roboto]">
              1
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-[Roboto] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 font-[Roboto]">
          © 2021-2025 Institut Teknologi Sepuluh Nopember
        </p>
      </footer>
    </div>
  );
}