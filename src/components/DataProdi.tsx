import { useState } from "react";
import { ArrowLeft, Users, Building2, Plus, Trash2, ChevronDown, ChevronUp, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface DataProdiProps {
  onNavigate?: (page: string) => void;
}

interface Dosen {
  id: number;
  nama: string;
  nip: string;
  email: string;
}

interface Laboratorium {
  id: number;
  nama: string;
  kode: string;
  anggota: Dosen[];
}

export function DataProdi({ onNavigate }: DataProdiProps) {
  const [expandedLabId, setExpandedLabId] = useState<number | null>(null);
  const [showAddDosenModal, setShowAddDosenModal] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // All available dosen
  const [allDosen] = useState<Dosen[]>([
    { id: 1, nama: "Dr. Ahmad Saikhu, S.Kom., M.T.", nip: "197801152005011001", email: "ahmad.saikhu@its.ac.id" },
    { id: 2, nama: "Dr. Retno Wardani, S.Kom., M.Kom.", nip: "198203122006042002", email: "retno.wardani@its.ac.id" },
    { id: 3, nama: "Prof. Dr. Bambang Setiawan, M.Sc.", nip: "196505201990031001", email: "bambang.setiawan@its.ac.id" },
    { id: 4, nama: "Dr. Eng. Siti Aminah, S.T., M.T.", nip: "197907152008012001", email: "siti.aminah@its.ac.id" },
    { id: 5, nama: "Ir. Budi Prasetyo, M.Kom., Ph.D.", nip: "198106102009121002", email: "budi.prasetyo@its.ac.id" },
    { id: 6, nama: "Dr. Dewi Kusuma, S.Kom., M.T.", nip: "198401252010122001", email: "dewi.kusuma@its.ac.id" },
    { id: 7, nama: "Dr. Eko Prasetio, S.Si., M.Kom.", nip: "197512112003121001", email: "eko.prasetio@its.ac.id" },
    { id: 8, nama: "Dr. Fitri Handayani, S.Kom., M.Sc.", nip: "198209082012092001", email: "fitri.handayani@its.ac.id" },
    { id: 9, nama: "Agus Hermanto, S.Kom., M.T.", nip: "198807152015041001", email: "agus.hermanto@its.ac.id" },
    { id: 10, nama: "Dr. Hendra Wijaya, S.T., M.Kom.", nip: "197603202002121001", email: "hendra.wijaya@its.ac.id" },
    { id: 11, nama: "Indah Permatasari, S.Kom., M.Sc.", nip: "199001102018032001", email: "indah.permata@its.ac.id" },
    { id: 12, nama: "Dr. Joko Santoso, S.Kom., M.T.", nip: "197809152005011002", email: "joko.santoso@its.ac.id" },
    { id: 13, nama: "Prof. Kartika Sari, S.T., Ph.D.", nip: "196802151992032001", email: "kartika.sari@its.ac.id" },
    { id: 14, nama: "Dr. Lukman Hakim, S.Kom., M.Kom.", nip: "198105202009121001", email: "lukman.hakim@its.ac.id" },
    { id: 15, nama: "Maya Angelina, S.Kom., M.T.", nip: "199203152019032001", email: "maya.angelina@its.ac.id" },
  ]);

  const [laboratoriumList, setLaboratoriumList] = useState<Laboratorium[]>([
    {
      id: 1,
      nama: "Laboratorium Rekayasa Perangkat Lunak",
      kode: "RPL",
      anggota: [
        { id: 1, nama: "Dr. Ahmad Saikhu, S.Kom., M.T.", nip: "197801152005011001", email: "ahmad.saikhu@its.ac.id" },
        { id: 2, nama: "Dr. Retno Wardani, S.Kom., M.Kom.", nip: "198203122006042002", email: "retno.wardani@its.ac.id" },
        { id: 9, nama: "Agus Hermanto, S.Kom., M.T.", nip: "198807152015041001", email: "agus.hermanto@its.ac.id" },
      ]
    },
    {
      id: 2,
      nama: "Laboratorium Kecerdasan Buatan",
      kode: "KB",
      anggota: [
        { id: 3, nama: "Prof. Dr. Bambang Setiawan, M.Sc.", nip: "196505201990031001", email: "bambang.setiawan@its.ac.id" },
        { id: 7, nama: "Dr. Eko Prasetio, S.Si., M.Kom.", nip: "197512112003121001", email: "eko.prasetio@its.ac.id" },
        { id: 8, nama: "Dr. Fitri Handayani, S.Kom., M.Sc.", nip: "198209082012092001", email: "fitri.handayani@its.ac.id" },
        { id: 14, nama: "Dr. Lukman Hakim, S.Kom., M.Kom.", nip: "198105202009121001", email: "lukman.hakim@its.ac.id" },
      ]
    },
    {
      id: 3,
      nama: "Laboratorium Jaringan Komputer",
      kode: "JARKOM",
      anggota: [
        { id: 4, nama: "Dr. Eng. Siti Aminah, S.T., M.T.", nip: "197907152008012001", email: "siti.aminah@its.ac.id" },
        { id: 10, nama: "Dr. Hendra Wijaya, S.T., M.Kom.", nip: "197603202002121001", email: "hendra.wijaya@its.ac.id" },
      ]
    },
    {
      id: 4,
      nama: "Laboratorium Sistem Informasi",
      kode: "SI",
      anggota: [
        { id: 5, nama: "Ir. Budi Prasetyo, M.Kom., Ph.D.", nip: "198106102009121002", email: "budi.prasetyo@its.ac.id" },
        { id: 6, nama: "Dr. Dewi Kusuma, S.Kom., M.T.", nip: "198401252010122001", email: "dewi.kusuma@its.ac.id" },
        { id: 11, nama: "Indah Permatasari, S.Kom., M.Sc.", nip: "199001102018032001", email: "indah.permata@its.ac.id" },
      ]
    },
    {
      id: 5,
      nama: "Laboratorium Grafika dan Multimedia",
      kode: "GRAFIKA",
      anggota: [
        { id: 12, nama: "Dr. Joko Santoso, S.Kom., M.T.", nip: "197809152005011002", email: "joko.santoso@its.ac.id" },
        { id: 13, nama: "Prof. Kartika Sari, S.T., Ph.D.", nip: "196802151992032001", email: "kartika.sari@its.ac.id" },
        { id: 15, nama: "Maya Angelina, S.Kom., M.T.", nip: "199203152019032001", email: "maya.angelina@its.ac.id" },
      ]
    },
  ]);

  const totalDosen = allDosen.length;
  const totalLab = laboratoriumList.length;

  const toggleExpand = (labId: number) => {
    setExpandedLabId(expandedLabId === labId ? null : labId);
  };

  const handleOpenAddDosen = (labId: number) => {
    setSelectedLabId(labId);
    setSearchQuery("");
    setShowAddDosenModal(true);
  };

  const handleAddDosen = (dosen: Dosen) => {
    if (!selectedLabId) return;

    const lab = laboratoriumList.find(l => l.id === selectedLabId);
    if (!lab) return;

    // Check if dosen already in lab
    if (lab.anggota.some(a => a.id === dosen.id)) {
      toast.error("Dosen sudah menjadi anggota laboratorium ini");
      return;
    }

    setLaboratoriumList(laboratoriumList.map(l =>
      l.id === selectedLabId
        ? { ...l, anggota: [...l.anggota, dosen] }
        : l
    ));

    toast.success(`${dosen.nama} berhasil ditambahkan ke laboratorium`);
    setShowAddDosenModal(false);
    setSelectedLabId(null);
  };

  const handleRemoveDosen = (labId: number, dosenId: number) => {
    const lab = laboratoriumList.find(l => l.id === labId);
    if (!lab) return;

    const dosen = lab.anggota.find(a => a.id === dosenId);
    if (!dosen) return;

    setLaboratoriumList(laboratoriumList.map(l =>
      l.id === labId
        ? { ...l, anggota: l.anggota.filter(a => a.id !== dosenId) }
        : l
    ));

    toast.success(`${dosen.nama} berhasil dihapus dari laboratorium`);
  };

  // Filter available dosen for selected lab
  const getAvailableDosen = () => {
    if (!selectedLabId) return [];
    
    const lab = laboratoriumList.find(l => l.id === selectedLabId);
    if (!lab) return [];

    // Filter dosen that match search and not already in lab
    return allDosen.filter(d => {
      const isInLab = lab.anggota.some(a => a.id === d.id);
      const matchesSearch = d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           d.nip.includes(searchQuery);
      return !isInLab && (searchQuery === "" || matchesSearch);
    });
  };

  return (
    <>
      <div className="p-8 bg-[#f5f5f5] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onNavigate && (
              <button
                onClick={() => onNavigate("Beranda")}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-gray-800 font-[Poppins] mb-1">Data Program Studi</h1>
              <p className="text-sm text-gray-600 font-[Roboto]">
                S1 Studi Pembangunan - Kelola data dosen dan laboratorium
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Dosen Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-[Roboto] mb-2">Total Dosen</p>
                <h2 className="text-4xl text-gray-800 font-[Poppins] mb-1">{totalDosen}</h2>
                <p className="text-xs text-gray-500 font-[Roboto]">Dosen aktif di program studi</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Total Lab Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-[Roboto] mb-2">Total Laboratorium</p>
                <h2 className="text-4xl text-gray-800 font-[Poppins] mb-1">{totalLab}</h2>
                <p className="text-xs text-gray-500 font-[Roboto]">Laboratorium di program studi</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Laboratorium List */}
        <div className="mb-6">
          <h2 className="text-gray-800 font-[Poppins] mb-4">Daftar Laboratorium</h2>
          <div className="space-y-4">
            {laboratoriumList.map((lab, index) => {
              const isExpanded = expandedLabId === lab.id;

              return (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Lab Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-gray-800 font-[Poppins]">{lab.nama}</h3>
                            <p className="text-sm text-gray-500 font-[Roboto]">Kode: {lab.kode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-[52px]">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-[Roboto]">
                            {lab.anggota.length} Anggota
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleOpenAddDosen(lab.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah Dosen
                        </button>
                        <button
                          onClick={() => toggleExpand(lab.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Member Table */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-gray-200 bg-gray-50">
                          {lab.anggota.length === 0 ? (
                            <div className="p-8 text-center">
                              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-sm text-gray-500 font-[Roboto]">
                                Belum ada anggota di laboratorium ini
                              </p>
                              <button
                                onClick={() => handleOpenAddDosen(lab.id)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
                              >
                                Tambah Dosen Pertama
                              </button>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                                      No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                                      Nama Dosen
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                                      NIP
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                                      Email
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs text-gray-600 font-[Roboto] uppercase tracking-wider">
                                      Aksi
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white">
                                  {lab.anggota.map((dosen, idx) => (
                                    <tr key={dosen.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                      <td className="px-6 py-4 text-sm text-gray-800 font-[Roboto]">
                                        {idx + 1}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-800 font-[Roboto]">
                                        {dosen.nama}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-600 font-[Roboto]">
                                        {dosen.nip}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-600 font-[Roboto]">
                                        {dosen.email}
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <button
                                          onClick={() => handleRemoveDosen(lab.id, dosen.id)}
                                          className="p-2 hover:bg-red-100 rounded-lg transition-colors inline-flex items-center justify-center"
                                          title="Hapus dari laboratorium"
                                        >
                                          <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

      {/* Add Dosen Modal */}
      <AnimatePresence>
        {showAddDosenModal && selectedLabId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setShowAddDosenModal(false);
                setSelectedLabId(null);
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl text-gray-800 font-[Poppins]">
                      Tambah Dosen ke Laboratorium
                    </h2>
                    <p className="text-sm text-gray-600 font-[Roboto] mt-1">
                      {laboratoriumList.find(l => l.id === selectedLabId)?.nama}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddDosenModal(false);
                      setSelectedLabId(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Search Input */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari nama dosen atau NIP..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                    />
                  </div>
                </div>

                {/* Dosen List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {getAvailableDosen().length === 0 ? (
                    <div className="py-8 text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 font-[Roboto]">
                        {searchQuery ? "Tidak ada dosen yang sesuai dengan pencarian" : "Semua dosen sudah menjadi anggota laboratorium ini"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getAvailableDosen().map((dosen) => (
                        <button
                          key={dosen.id}
                          onClick={() => handleAddDosen(dosen)}
                          className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 font-[Roboto] group-hover:text-blue-700">
                                {dosen.nama}
                              </p>
                              <p className="text-xs text-gray-500 font-[Roboto] mt-1">
                                NIP: {dosen.nip}
                              </p>
                              <p className="text-xs text-gray-500 font-[Roboto]">
                                {dosen.email}
                              </p>
                            </div>
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowAddDosenModal(false);
                    setSelectedLabId(null);
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-[Roboto]"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
