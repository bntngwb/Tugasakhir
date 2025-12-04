import { useState } from "react";
import { ArrowLeft, Plus, ChevronDown, ChevronUp, Edit, Trash2, Save, X, Eye, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { CustomSelect } from "./ui/CustomSelect";

interface KonfigurasiNilaiProps {
  onNavigate?: (page: string) => void;
}

interface BobotKomponen {
  id: number;
  nama: string;
  bobot: string;
  keterangan: string;
}

interface KonfigurasiRubrik {
  id: number;
  nama: string;
  tipe: "Proposal" | "Tugas Akhir";
  periode: string;
  status: "Aktif" | "Tidak Aktif";
  komponenPembimbing: BobotKomponen[];
  komponenPenguji: BobotKomponen[];
}

export function KonfigurasiNilai({ onNavigate }: KonfigurasiNilaiProps) {
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingRubrik, setEditingRubrik] = useState<KonfigurasiRubrik | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewRubrik, setPreviewRubrik] = useState<KonfigurasiRubrik | null>(null);

  const [rubrikList, setRubrikList] = useState<KonfigurasiRubrik[]>([
    {
      id: 1,
      nama: "Konfigurasi Sidang Proposal",
      tipe: "Proposal",
      periode: "Semester Gasal 2025/2026",
      status: "Aktif",
      komponenPembimbing: [
        {
          id: 1,
          nama: "Penilaian Pembimbing 1",
          bobot: "30",
          keterangan: "Bobot penilaian dari pembimbing utama"
        },
        {
          id: 2,
          nama: "Penilaian Pembimbing 2",
          bobot: "20",
          keterangan: "Bobot penilaian dari pembimbing kedua"
        }
      ],
      komponenPenguji: [
        {
          id: 1,
          nama: "Penilaian Penguji 1",
          bobot: "25",
          keterangan: "Bobot penilaian dari penguji pertama"
        },
        {
          id: 2,
          nama: "Penilaian Penguji 2",
          bobot: "25",
          keterangan: "Bobot penilaian dari penguji kedua"
        }
      ]
    },
    {
      id: 2,
      nama: "Konfigurasi Sidang Tugas Akhir",
      tipe: "Tugas Akhir",
      periode: "Semester Gasal 2025/2026",
      status: "Aktif",
      komponenPembimbing: [
        {
          id: 1,
          nama: "Penilaian Pembimbing 1",
          bobot: "25",
          keterangan: "Bobot penilaian dari pembimbing utama"
        },
        {
          id: 2,
          nama: "Penilaian Pembimbing 2",
          bobot: "15",
          keterangan: "Bobot penilaian dari pembimbing kedua"
        }
      ],
      komponenPenguji: [
        {
          id: 1,
          nama: "Penilaian Penguji 1",
          bobot: "20",
          keterangan: "Bobot penilaian dari penguji pertama"
        },
        {
          id: 2,
          nama: "Penilaian Penguji 2",
          bobot: "20",
          keterangan: "Bobot penilaian dari penguji kedua"
        },
        {
          id: 3,
          nama: "Penilaian Penguji 3",
          bobot: "20",
          keterangan: "Bobot penilaian dari penguji ketiga"
        }
      ]
    },
    {
      id: 3,
      nama: "Konfigurasi Sidang Proposal (Lama)",
      tipe: "Proposal",
      periode: "Semester Genap 2024/2025",
      status: "Tidak Aktif",
      komponenPembimbing: [
        {
          id: 1,
          nama: "Penilaian Pembimbing 1",
          bobot: "35",
          keterangan: "Bobot penilaian dari pembimbing utama"
        },
        {
          id: 2,
          nama: "Penilaian Pembimbing 2",
          bobot: "25",
          keterangan: "Bobot penilaian dari pembimbing kedua"
        }
      ],
      komponenPenguji: [
        {
          id: 1,
          nama: "Penilaian Penguji 1",
          bobot: "20",
          keterangan: "Bobot penilaian dari penguji pertama"
        },
        {
          id: 2,
          nama: "Penilaian Penguji 2",
          bobot: "20",
          keterangan: "Bobot penilaian dari penguji kedua"
        }
      ]
    }
  ]);

  // Form state for creating/editing
  const [formNama, setFormNama] = useState("");
  const [formTipe, setFormTipe] = useState<"Proposal" | "Tugas Akhir">("Proposal");
  const [formPeriode, setFormPeriode] = useState("");
  const [formStatus, setFormStatus] = useState<"Aktif" | "Tidak Aktif">("Aktif");
  const [formKomponenPembimbing, setFormKomponenPembimbing] = useState<BobotKomponen[]>([
    { id: 1, nama: "", bobot: "0", keterangan: "" }
  ]);
  const [formKomponenPenguji, setFormKomponenPenguji] = useState<BobotKomponen[]>([
    { id: 1, nama: "", bobot: "0", keterangan: "" }
  ]);

  const calculateTotalBobot = (komponen: BobotKomponen[]) => {
    return komponen.reduce((total, item) => total + parseFloat(item.bobot || "0"), 0);
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleStatus = (id: number) => {
    setRubrikList(rubrikList.map(r => 
      r.id === id ? { ...r, status: r.status === "Aktif" ? "Tidak Aktif" : "Aktif" } : r
    ));
    toast.success("Status rubrik berhasil diubah");
  };

  const handleStartCreate = () => {
    setFormNama("");
    setFormTipe("Proposal");
    setFormPeriode("");
    setFormStatus("Aktif");
    setFormKomponenPembimbing([{ id: 1, nama: "", bobot: "0", keterangan: "" }]);
    setFormKomponenPenguji([{ id: 1, nama: "", bobot: "0", keterangan: "" }]);
    setEditingRubrik(null);
    setViewMode("create");
  };

  const handleStartEdit = (rubrik: KonfigurasiRubrik) => {
    setFormNama(rubrik.nama);
    setFormTipe(rubrik.tipe);
    setFormPeriode(rubrik.periode);
    setFormStatus(rubrik.status);
    setFormKomponenPembimbing([...rubrik.komponenPembimbing]);
    setFormKomponenPenguji([...rubrik.komponenPenguji]);
    setEditingRubrik(rubrik);
    setViewMode("edit");
  };

  const addKomponen = (type: "pembimbing" | "penguji") => {
    const newKomponen: BobotKomponen = {
      id: Date.now(),
      nama: "",
      bobot: "0",
      keterangan: ""
    };

    if (type === "pembimbing") {
      setFormKomponenPembimbing([...formKomponenPembimbing, newKomponen]);
    } else {
      setFormKomponenPenguji([...formKomponenPenguji, newKomponen]);
    }
  };

  const removeKomponen = (type: "pembimbing" | "penguji", id: number) => {
    if (type === "pembimbing") {
      setFormKomponenPembimbing(formKomponenPembimbing.filter(k => k.id !== id));
    } else {
      setFormKomponenPenguji(formKomponenPenguji.filter(k => k.id !== id));
    }
  };

  const updateKomponen = (
    type: "pembimbing" | "penguji",
    id: number,
    field: keyof BobotKomponen,
    value: string
  ) => {
    if (type === "pembimbing") {
      setFormKomponenPembimbing(
        formKomponenPembimbing.map(k => k.id === id ? { ...k, [field]: value } : k)
      );
    } else {
      setFormKomponenPenguji(
        formKomponenPenguji.map(k => k.id === id ? { ...k, [field]: value } : k)
      );
    }
  };

  const handleSave = () => {
    const totalPembimbing = calculateTotalBobot(formKomponenPembimbing);
    const totalPenguji = calculateTotalBobot(formKomponenPenguji);
    const totalKeseluruhan = totalPembimbing + totalPenguji;

    if (!formNama.trim()) {
      toast.error("Nama rubrik harus diisi");
      return;
    }

    if (totalKeseluruhan !== 100) {
      toast.error(`Total bobot harus 100%. Saat ini: ${totalKeseluruhan}%`);
      return;
    }

    const rubrikData: KonfigurasiRubrik = {
      id: editingRubrik ? editingRubrik.id : Date.now(),
      nama: formNama,
      tipe: formTipe,
      periode: formPeriode,
      status: formStatus,
      komponenPembimbing: formKomponenPembimbing,
      komponenPenguji: formKomponenPenguji
    };

    if (editingRubrik) {
      setRubrikList(rubrikList.map(r => r.id === editingRubrik.id ? rubrikData : r));
      toast.success("Rubrik penilaian berhasil diupdate");
    } else {
      setRubrikList([rubrikData, ...rubrikList]);
      toast.success("Rubrik penilaian berhasil ditambahkan");
    }

    setViewMode("list");
    setEditingRubrik(null);
  };

  const openPreview = (rubrik: KonfigurasiRubrik) => {
    setPreviewRubrik(rubrik);
    setShowPreview(true);
  };

  const totalPembimbing = calculateTotalBobot(formKomponenPembimbing);
  const totalPenguji = calculateTotalBobot(formKomponenPenguji);
  const totalKeseluruhan = totalPembimbing + totalPenguji;

  // List View
  if (viewMode === "list") {
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
                <h1 className="text-gray-800 font-[Poppins] mb-1">Rubrik Penilaian</h1>
                <p className="text-sm text-gray-600 font-[Roboto]">
                  Kelola rubrik dan konfigurasi penilaian untuk sidang tugas akhir
                </p>
              </div>
            </div>
            <button
              onClick={handleStartCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambahkan Rubrik
            </button>
          </div>

          {/* Rubrik List */}
          <div className="space-y-4">
            {rubrikList.map((rubrik) => {
              const isExpanded = expandedId === rubrik.id;
              const totalPembimbing = calculateTotalBobot(rubrik.komponenPembimbing);
              const totalPenguji = calculateTotalBobot(rubrik.komponenPenguji);
              const totalKeseluruhan = totalPembimbing + totalPenguji;

              return (
                <motion.div
                  key={rubrik.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  initial={false}
                  animate={{ height: "auto" }}
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-gray-800 font-[Poppins]">{rubrik.nama}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-[Roboto] ${
                              rubrik.status === "Aktif"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {rubrik.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 font-[Roboto]">
                          <span>Tipe: {rubrik.tipe === "Proposal" ? "Sidang Proposal" : "Sidang Tugas Akhir"}</span>
                          <span>•</span>
                          <span>Periode: {rubrik.periode}</span>
                          {totalKeseluruhan === 100 && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-semibold">Total Bobot: 100%</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => openPreview(rubrik)}
                          className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-[Roboto] text-sm flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Lihat
                        </button>
                        <button
                          onClick={() => handleStartEdit(rubrik)}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleExpand(rubrik.id)}
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

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-gray-200 p-6 bg-gray-50">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Komponen Pembimbing */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-gray-800 font-[Poppins]">Komponen Pembimbing</h4>
                                <span className="text-sm text-gray-600 font-[Roboto]">
                                  Total: <span className="font-semibold">{totalPembimbing}%</span>
                                </span>
                              </div>
                              <div className="space-y-3">
                                {rubrik.komponenPembimbing.map((komponen) => (
                                  <div key={komponen.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-800 font-[Roboto] mb-1">
                                          {komponen.nama}
                                        </p>
                                        {komponen.keterangan && (
                                          <p className="text-xs text-gray-500 font-[Roboto]">
                                            {komponen.keterangan}
                                          </p>
                                        )}
                                      </div>
                                      <span className="text-sm text-gray-800 font-[Roboto] font-semibold ml-4">
                                        {komponen.bobot}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Komponen Penguji */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-gray-800 font-[Poppins]">Komponen Penguji</h4>
                                <span className="text-sm text-gray-600 font-[Roboto]">
                                  Total: <span className="font-semibold">{totalPenguji}%</span>
                                </span>
                              </div>
                              <div className="space-y-3">
                                {rubrik.komponenPenguji.map((komponen) => (
                                  <div key={komponen.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-800 font-[Roboto] mb-1">
                                          {komponen.nama}
                                        </p>
                                        {komponen.keterangan && (
                                          <p className="text-xs text-gray-500 font-[Roboto]">
                                            {komponen.keterangan}
                                          </p>
                                        )}
                                      </div>
                                      <span className="text-sm text-gray-800 font-[Roboto] font-semibold ml-4">
                                        {komponen.bobot}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => toggleStatus(rubrik.id)}
                              className={`px-4 py-2 rounded-lg transition-colors font-[Roboto] text-sm ${
                                rubrik.status === "Aktif"
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              {rubrik.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-[Roboto]">
              © 2021-2025 Institut Teknologi Sepuluh Nopember
            </p>
          </footer>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && previewRubrik && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowPreview(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">
                        Preview Form Penilaian
                      </h2>
                      <p className="text-sm text-gray-600 font-[Roboto] mt-1">
                        Tampilan yang akan dilihat oleh dosen saat melakukan penilaian
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-gray-800 font-[Poppins] mb-4">
                      {previewRubrik.nama}
                    </h3>

                    <div className="mb-6">
                      <h4 className="text-sm text-gray-700 font-[Poppins] mb-3">
                        Penilaian Pembimbing
                      </h4>
                      <div className="space-y-3">
                        {previewRubrik.komponenPembimbing.map((komponen) => (
                          <div key={komponen.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 font-[Roboto]">
                                  {komponen.nama}
                                </p>
                                {komponen.keterangan && (
                                  <p className="text-xs text-gray-500 font-[Roboto] mt-1">
                                    {komponen.keterangan}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <input
                                  type="number"
                                  placeholder="0-100"
                                  disabled
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-[Roboto] text-sm text-center"
                                />
                                <span className="text-sm text-gray-600 font-[Roboto] min-w-[60px]">
                                  Bobot: {komponen.bobot}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm text-gray-700 font-[Poppins] mb-3">
                        Penilaian Penguji
                      </h4>
                      <div className="space-y-3">
                        {previewRubrik.komponenPenguji.map((komponen) => (
                          <div key={komponen.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 font-[Roboto]">
                                  {komponen.nama}
                                </p>
                                {komponen.keterangan && (
                                  <p className="text-xs text-gray-500 font-[Roboto] mt-1">
                                    {komponen.keterangan}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <input
                                  type="number"
                                  placeholder="0-100"
                                  disabled
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-[Roboto] text-sm text-center"
                                />
                                <span className="text-sm text-gray-600 font-[Roboto] min-w-[60px]">
                                  Bobot: {komponen.bobot}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-300">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-800 font-[Poppins]">Nilai Akhir</p>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value="0"
                            disabled
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-[Roboto] font-semibold text-center"
                          />
                          <span className="text-sm text-gray-600 font-[Roboto]">/ 100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-6">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-[Roboto]"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Create/Edit Form View
  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode("list")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-gray-800 font-[Poppins] mb-1">
              {viewMode === "create" ? "Tambah Rubrik Penilaian" : "Edit Rubrik Penilaian"}
            </h1>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Kelola komponen dan bobot penilaian untuk sidang
            </p>
          </div>
        </div>
      </div>

      {/* Form Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
              Nama Rubrik <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              placeholder="Contoh: Konfigurasi Sidang Proposal"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
              Tipe Sidang
            </label>
            <select
              value={formTipe}
              onChange={(e) => setFormTipe(e.target.value as "Proposal" | "Tugas Akhir")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Proposal">Sidang Proposal</option>
              <option value="Tugas Akhir">Sidang Tugas Akhir</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
              Periode
            </label>
            <input
              type="text"
              value={formPeriode}
              onChange={(e) => setFormPeriode(e.target.value)}
              placeholder="Contoh: Semester Gasal 2025/2026"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
              Status
            </label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as "Aktif" | "Tidak Aktif")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert Total Bobot */}
      {totalKeseluruhan !== 100 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-800 font-[Roboto] font-semibold mb-1">
                Perhatian: Total bobot belum 100%
              </p>
              <p className="text-sm text-gray-700 font-[Roboto]">
                Total bobot saat ini: <span className="font-semibold">{totalKeseluruhan}%</span>. 
                Pastikan total bobot pembimbing dan penguji adalah 100% sebelum menyimpan.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Komponen Pembimbing */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-800 font-[Poppins]">Komponen Pembimbing</h2>
              <p className="text-sm text-gray-600 font-[Roboto] mt-1">
                Total: <span className={`font-semibold ${totalPembimbing > 100 ? "text-red-600" : "text-gray-800"}`}>
                  {totalPembimbing}%
                </span>
              </p>
            </div>
            <button
              onClick={() => addKomponen("pembimbing")}
              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          <div className="space-y-3">
            {formKomponenPembimbing.map((komponen, index) => (
              <div key={komponen.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm text-gray-700 font-[Poppins]">
                    Komponen #{index + 1}
                  </h3>
                  {formKomponenPembimbing.length > 1 && (
                    <button
                      onClick={() => removeKomponen("pembimbing", komponen.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                      Nama Komponen
                    </label>
                    <input
                      type="text"
                      value={komponen.nama}
                      onChange={(e) => updateKomponen("pembimbing", komponen.id, "nama", e.target.value)}
                      placeholder="Contoh: Penilaian Pembimbing 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                      Bobot (%)
                    </label>
                    <input
                      type="number"
                      value={komponen.bobot}
                      onChange={(e) => updateKomponen("pembimbing", komponen.id, "bobot", e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                      Keterangan
                    </label>
                    <textarea
                      value={komponen.keterangan}
                      onChange={(e) => updateKomponen("pembimbing", komponen.id, "keterangan", e.target.value)}
                      placeholder="Deskripsi komponen penilaian"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Komponen Penguji */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-800 font-[Poppins]">Komponen Penguji</h2>
              <p className="text-sm text-gray-600 font-[Roboto] mt-1">
                Total: <span className={`font-semibold ${totalPenguji > 100 ? "text-red-600" : "text-gray-800"}`}>
                  {totalPenguji}%
                </span>
              </p>
            </div>
            <button
              onClick={() => addKomponen("penguji")}
              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          <div className="space-y-3">
            {formKomponenPenguji.map((komponen, index) => (
              <div key={komponen.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm text-gray-700 font-[Poppins]">
                    Komponen #{index + 1}
                  </h3>
                  {formKomponenPenguji.length > 1 && (
                    <button
                      onClick={() => removeKomponen("penguji", komponen.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                      Nama Komponen
                    </label>
                    <input
                      type="text"
                      value={komponen.nama}
                      onChange={(e) => updateKomponen("penguji", komponen.id, "nama", e.target.value)}
                      placeholder="Contoh: Penilaian Penguji 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                      Bobot (%)
                    </label>
                    <input
                      type="number"
                      value={komponen.bobot}
                      onChange={(e) => updateKomponen("penguji", komponen.id, "bobot", e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                      Keterangan
                    </label>
                    <textarea
                      value={komponen.keterangan}
                      onChange={(e) => updateKomponen("penguji", komponen.id, "keterangan", e.target.value)}
                      placeholder="Deskripsi komponen penilaian"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-gray-800 font-[Poppins] mb-4">Ringkasan Bobot Penilaian</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 font-[Roboto] mb-1">Total Bobot Pembimbing</p>
            <p className={`text-2xl font-[Poppins] ${totalPembimbing > 100 ? "text-red-600" : "text-gray-800"}`}>
              {totalPembimbing}%
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 font-[Roboto] mb-1">Total Bobot Penguji</p>
            <p className={`text-2xl font-[Poppins] ${totalPenguji > 100 ? "text-red-600" : "text-gray-800"}`}>
              {totalPenguji}%
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 font-[Roboto] mb-1">Total Keseluruhan</p>
            <p className={`text-2xl font-[Poppins] ${totalKeseluruhan !== 100 ? "text-red-600" : "text-green-600"}`}>
              {totalKeseluruhan}%
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setViewMode("list")}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          disabled={totalKeseluruhan !== 100}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Simpan Rubrik
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 font-[Roboto]">
          © 2021-2025 Institut Teknologi Sepuluh Nopember
        </p>
      </footer>
    </div>
  );
}