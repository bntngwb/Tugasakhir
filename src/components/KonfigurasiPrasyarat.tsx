import { useState } from "react";
import { ArrowLeft, Plus, X, Save, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface KonfigurasiPrasyaratProps {
  onNavigate?: (page: string) => void;
}

interface DokumenPrasyarat {
  id: number;
  jenisDokumen: string;
  optional: boolean;
  keterangan: string;
}

interface KonfigurasiPrasyaratData {
  id: number;
  nama: string;
  tipe: "Proposal" | "Tugas Akhir";
  status: "Aktif" | "Tidak Aktif";
  dokumen: DokumenPrasyarat[];
}

const jenisDokumenOptions = [
  "Bimbingan",
  "Pendukung",
  "Sertifikat TOEFL",
  "Dokumen Final Tugas Akhir",
  "Proposal Tugas Akhir",
  "KRS (Kartu Rencana Studi)",
  "Transkrip Nilai",
  "Bukti Pembayaran UKT",
  "Surat Keterangan Lulus",
  "Lembar Pengesahan",
  "Artikel Jurnal"
];

export function KonfigurasiPrasyarat({ onNavigate }: KonfigurasiPrasyaratProps) {
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingKonfigurasi, setEditingKonfigurasi] = useState<KonfigurasiPrasyaratData | null>(null);

  const [konfigurasiList, setKonfigurasiList] = useState<KonfigurasiPrasyaratData[]>([
    {
      id: 1,
      nama: "Konfigurasi Dokumen Final",
      tipe: "Tugas Akhir",
      status: "Aktif",
      dokumen: [
        {
          id: 1,
          jenisDokumen: "Bimbingan",
          optional: false,
          keterangan: "Unggah Bukti bimbingan diMyITS Thesis"
        },
        {
          id: 2,
          jenisDokumen: "Pendukung",
          optional: false,
          keterangan: "Unggah Sertifikat Lulus SKEM"
        },
        {
          id: 3,
          jenisDokumen: "Sertifikat TOEFL",
          optional: false,
          keterangan: "Unggah Sertifikat TOEFL"
        },
        {
          id: 4,
          jenisDokumen: "Dokumen Final Tugas Akhir",
          optional: false,
          keterangan: "Unggah softfile Full Tugas Akhir"
        },
        {
          id: 5,
          jenisDokumen: "Proposal Tugas Akhir",
          optional: false,
          keterangan: "Unggah softfile Proposal"
        }
      ]
    },
    {
      id: 2,
      nama: "Konfigurasi Dokumen Proposal",
      tipe: "Proposal",
      status: "Aktif",
      dokumen: [
        {
          id: 1,
          jenisDokumen: "Bimbingan",
          optional: false,
          keterangan: "Unggah Bukti bimbingan diMyITS Thesis"
        },
        {
          id: 2,
          jenisDokumen: "KRS (Kartu Rencana Studi)",
          optional: false,
          keterangan: "Unggah KRS semester berjalan"
        },
        {
          id: 3,
          jenisDokumen: "Proposal Tugas Akhir",
          optional: false,
          keterangan: "Unggah softfile Proposal"
        }
      ]
    },
    {
      id: 3,
      nama: "Konfigurasi Dokumen Final (Lama)",
      tipe: "Tugas Akhir",
      status: "Tidak Aktif",
      dokumen: [
        {
          id: 1,
          jenisDokumen: "Bimbingan",
          optional: false,
          keterangan: "Unggah Bukti bimbingan diMyITS Thesis"
        },
        {
          id: 2,
          jenisDokumen: "Transkrip Nilai",
          optional: true,
          keterangan: "Unggah transkrip nilai sementara"
        },
        {
          id: 3,
          jenisDokumen: "Dokumen Final Tugas Akhir",
          optional: false,
          keterangan: "Unggah softfile Full Tugas Akhir"
        }
      ]
    }
  ]);

  // Form state
  const [formNama, setFormNama] = useState("");
  const [formTipe, setFormTipe] = useState<"Proposal" | "Tugas Akhir">("Tugas Akhir");
  const [formStatus, setFormStatus] = useState<"Aktif" | "Tidak Aktif">("Aktif");
  const [formDokumen, setFormDokumen] = useState<DokumenPrasyarat[]>([
    { id: 1, jenisDokumen: "", optional: false, keterangan: "" }
  ]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleStatus = (id: number) => {
    setKonfigurasiList(konfigurasiList.map(k => 
      k.id === id ? { ...k, status: k.status === "Aktif" ? "Tidak Aktif" : "Aktif" } : k
    ));
    toast.success("Status konfigurasi berhasil diubah");
  };

  const handleStartCreate = () => {
    setFormNama("");
    setFormTipe("Tugas Akhir");
    setFormStatus("Aktif");
    setFormDokumen([{ id: 1, jenisDokumen: "", optional: false, keterangan: "" }]);
    setEditingKonfigurasi(null);
    setViewMode("create");
  };

  const handleStartEdit = (konfigurasi: KonfigurasiPrasyaratData) => {
    setFormNama(konfigurasi.nama);
    setFormTipe(konfigurasi.tipe);
    setFormStatus(konfigurasi.status);
    setFormDokumen([...konfigurasi.dokumen]);
    setEditingKonfigurasi(konfigurasi);
    setViewMode("edit");
  };

  const addDokumen = () => {
    const newDokumen: DokumenPrasyarat = {
      id: Date.now(),
      jenisDokumen: "",
      optional: false,
      keterangan: ""
    };
    setFormDokumen([...formDokumen, newDokumen]);
  };

  const removeDokumen = (id: number) => {
    if (formDokumen.length > 1) {
      setFormDokumen(formDokumen.filter(d => d.id !== id));
    } else {
      toast.error("Minimal harus ada satu dokumen");
    }
  };

  const updateDokumen = (
    id: number,
    field: keyof DokumenPrasyarat,
    value: string | boolean
  ) => {
    setFormDokumen(
      formDokumen.map(d => d.id === id ? { ...d, [field]: value } : d)
    );
  };

  const handleSave = () => {
    if (!formNama.trim()) {
      toast.error("Nama konfigurasi harus diisi");
      return;
    }

    // Validate all dokumen have jenisDokumen and keterangan
    const hasEmptyFields = formDokumen.some(d => !d.jenisDokumen || !d.keterangan);
    if (hasEmptyFields) {
      toast.error("Semua jenis dokumen dan keterangan harus diisi");
      return;
    }

    const konfigurasiData: KonfigurasiPrasyaratData = {
      id: editingKonfigurasi ? editingKonfigurasi.id : Date.now(),
      nama: formNama,
      tipe: formTipe,
      status: formStatus,
      dokumen: formDokumen
    };

    if (editingKonfigurasi) {
      setKonfigurasiList(konfigurasiList.map(k => k.id === editingKonfigurasi.id ? konfigurasiData : k));
      toast.success("Konfigurasi prasyarat berhasil diupdate");
    } else {
      setKonfigurasiList([konfigurasiData, ...konfigurasiList]);
      toast.success("Konfigurasi prasyarat berhasil ditambahkan");
    }

    setViewMode("list");
    setEditingKonfigurasi(null);
  };

  // List View
  if (viewMode === "list") {
    return (
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
              <h1 className="text-gray-800 font-[Poppins] mb-1">Konfigurasi Prasyarat</h1>
              <p className="text-sm text-gray-600 font-[Roboto]">
                Kelola dokumen prasyarat untuk sidang tugas akhir
              </p>
            </div>
          </div>
          <button
            onClick={handleStartCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Konfigurasi Prasyarat
          </button>
        </div>

        {/* Konfigurasi List */}
        <div className="space-y-4">
          {konfigurasiList.map((konfigurasi) => {
            const isExpanded = expandedId === konfigurasi.id;

            return (
              <motion.div
                key={konfigurasi.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                initial={false}
                animate={{ height: "auto" }}
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-800 font-[Poppins]">{konfigurasi.nama}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-[Roboto] ${
                            konfigurasi.status === "Aktif"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {konfigurasi.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 font-[Roboto]">
                        <span>Tipe: {konfigurasi.tipe === "Proposal" ? "Sidang Proposal" : "Sidang Tugas Akhir"}</span>
                        <span>•</span>
                        <span>Jumlah Dokumen: {konfigurasi.dokumen.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleStartEdit(konfigurasi)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => toggleExpand(konfigurasi.id)}
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
                        <h4 className="text-gray-800 font-[Poppins] mb-4">Daftar Dokumen Prasyarat</h4>
                        <div className="space-y-3">
                          {konfigurasi.dokumen.map((dokumen) => (
                            <div key={dokumen.id} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">Jenis Dokumen</p>
                                  <p className="text-sm text-gray-800 font-[Roboto]">{dokumen.jenisDokumen}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">Optional</p>
                                  <p className="text-sm text-gray-800 font-[Roboto]">
                                    {dokumen.optional ? "Ya" : "Tidak"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">Keterangan</p>
                                  <p className="text-sm text-gray-800 font-[Roboto]">{dokumen.keterangan}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
                          <button
                            onClick={() => toggleStatus(konfigurasi.id)}
                            className={`px-4 py-2 rounded-lg transition-colors font-[Roboto] text-sm ${
                              konfigurasi.status === "Aktif"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {konfigurasi.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
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
              {viewMode === "create" ? "Tambah Konfigurasi Prasyarat" : "Edit Konfigurasi Prasyarat"}
            </h1>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Atur dokumen yang diperlukan untuk sidang
            </p>
          </div>
        </div>
      </div>

      {/* Form Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-2 block">
              Nama Konfigurasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              placeholder="Contoh: Konfigurasi Dokumen Final"
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

      {/* Dokumen List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-gray-800 font-[Poppins] mb-4">Daftar Dokumen Prasyarat</h2>
        
        <div className="space-y-4">
          {formDokumen.map((dokumen, index) => (
            <div key={dokumen.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-[Roboto]">Jenis Dokumen</span>
                </div>
                {formDokumen.length > 1 && (
                  <button
                    onClick={() => removeDokumen(dokumen.id)}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Jenis Dokumen */}
                <div>
                  <select
                    value={dokumen.jenisDokumen}
                    onChange={(e) => updateDokumen(dokumen.id, "jenisDokumen", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm bg-white"
                  >
                    <option value="">Pilih Jenis Berkas</option>
                    {jenisDokumenOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Optional */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dokumen.optional}
                      onChange={(e) => updateDokumen(dokumen.id, "optional", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-[Roboto]">Optional</span>
                  </label>
                </div>

                {/* Keterangan */}
                <div>
                  <input
                    type="text"
                    value={dokumen.keterangan}
                    onChange={(e) => updateDokumen(dokumen.id, "keterangan", e.target.value)}
                    placeholder="Keterangan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Dokumen Button */}
        <button
          onClick={addDokumen}
          className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-[Roboto] text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Prasyarat Lulus
        </button>
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
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Simpan
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
