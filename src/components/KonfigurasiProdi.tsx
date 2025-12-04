import { useState } from "react";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface KonfigurasiProdiProps {
  onNavigate?: (page: string) => void;
}

interface PICProdi {
  id: number;
  nama: string;
  gelar: string;
}

export function KonfigurasiProdi({ onNavigate }: KonfigurasiProdiProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [bolehBerkelompok, setBolehBerkelompok] = useState(false);
  const [adaSidangProposal, setAdaSidangProposal] = useState(true);
  const [minPertemuanProposal, setMinPertemuanProposal] = useState(8);
  const [adaSidangKemajuan, setAdaSidangKemajuan] = useState(false);
  const [adaSidangAkhir, setAdaSidangAkhir] = useState(true);
  const [minPertemuanAkhir, setMinPertemuanAkhir] = useState(16);
  const [basisAlokasi, setBasisAlokasi] = useState<"prodi" | "laboratorium">("prodi");
  const [picProdiList, setPicProdiList] = useState<PICProdi[]>([
    {
      id: 1,
      nama: "Muhammad Ubaidillah Al Mustofa",
      gelar: "B.Sc., M.SEI."
    },
    {
      id: 2,
      nama: "Fairuz Zahirah Zihni Hamdan",
      gelar: "S.H., M.H."
    }
  ]);

  const [newPICNama, setNewPICNama] = useState("");
  const [newPICGelar, setNewPICGelar] = useState("");
  const [showAddPIC, setShowAddPIC] = useState(false);

  const handleSaveChanges = () => {
    toast.success("Perubahan berhasil disimpan");
    setIsEditing(false);
  };

  const handleAddPIC = () => {
    if (!newPICNama.trim() || !newPICGelar.trim()) {
      toast.error("Nama dan gelar PIC harus diisi");
      return;
    }

    const newPIC: PICProdi = {
      id: Date.now(),
      nama: newPICNama.trim(),
      gelar: newPICGelar.trim()
    };

    setPicProdiList([...picProdiList, newPIC]);
    setNewPICNama("");
    setNewPICGelar("");
    setShowAddPIC(false);
    toast.success("PIC Prodi berhasil ditambahkan");
  };

  const handleDeletePIC = (id: number) => {
    setPicProdiList(picProdiList.filter(pic => pic.id !== id));
    toast.success("PIC Prodi berhasil dihapus");
  };

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
          <h1 className="text-gray-800 font-[Poppins]">
            Konfigurasi Prodi - S1 Studi Pembangunan
          </h1>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-[Roboto] text-sm"
          >
            Ubah
          </button>
        )}
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="space-y-6">
          {/* Apakah mahasiswa boleh berkelompok */}
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-3 block">
              Apakah mahasiswa boleh berkelompok?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => isEditing && setBolehBerkelompok(false)}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  !bolehBerkelompok
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    !bolehBerkelompok ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {!bolehBerkelompok && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Tidak Boleh</span>
                </div>
              </button>
              <button
                onClick={() => isEditing && setBolehBerkelompok(true)}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  bolehBerkelompok
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    bolehBerkelompok ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {bolehBerkelompok && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Boleh</span>
                </div>
              </button>
            </div>
          </div>

          {/* Apakah ada Sidang Proposal */}
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-3 block">
              Apakah ada Sidang Proposal?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => isEditing && setAdaSidangProposal(true)}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  adaSidangProposal
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    adaSidangProposal ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {adaSidangProposal && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Ada</span>
                </div>
              </button>
              <button
                onClick={() => isEditing && setAdaSidangProposal(false)}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  !adaSidangProposal
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    !adaSidangProposal ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {!adaSidangProposal && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Tidak Ada</span>
                </div>
              </button>
            </div>
          </div>

          {/* Minimum pertemuan Sidang Proposal */}
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-3 block">
              Jumlah akumulatif minimum pertemuan pembimbingan agar bisa Sidang Proposal
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                Jumlah minimum pertemuan bimbingan
              </p>
              <input
                type="number"
                value={minPertemuanProposal}
                onChange={(e) => isEditing && setMinPertemuanProposal(Number(e.target.value))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Apakah ada Sidang Kemajuan */}
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-3 block">
              Apakah ada Sidang Kemajuan?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => isEditing && setAdaSidangKemajuan(true)}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  adaSidangKemajuan
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    adaSidangKemajuan ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {adaSidangKemajuan && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Ada</span>
                </div>
              </button>
              <button
                onClick={() => isEditing && setAdaSidangKemajuan(false)}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  !adaSidangKemajuan
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    !adaSidangKemajuan ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {!adaSidangKemajuan && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Tidak Ada</span>
                </div>
              </button>
            </div>
          </div>

          {/* Apakah ada Sidang Akhir */}
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-3 block">
              Apakah ada Sidang Akhir?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => isEditing && setAdaSidangAkhir(true)}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  adaSidangAkhir
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    adaSidangAkhir ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {adaSidangAkhir && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Ada</span>
                </div>
              </button>
              <button
                onClick={() => isEditing && setAdaSidangAkhir(false)}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  !adaSidangAkhir
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    !adaSidangAkhir ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {!adaSidangAkhir && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Tidak Ada</span>
                </div>
              </button>
            </div>
          </div>

          {/* Minimum pertemuan Sidang Akhir */}
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-3 block">
              Jumlah akumulatif minimum pertemuan pembimbingan agar bisa Sidang Akhir
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                Jumlah minimum pertemuan bimbingan
              </p>
              <input
                type="number"
                value={minPertemuanAkhir}
                onChange={(e) => isEditing && setMinPertemuanAkhir(Number(e.target.value))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Basis penentuan alokasi pembimbing */}
          <div>
            <label className="text-sm text-gray-700 font-[Roboto] mb-3 block">
              Basis penentuan alokasi pembimbing
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => isEditing && setBasisAlokasi("prodi")}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  basisAlokasi === "prodi"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    basisAlokasi === "prodi" ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {basisAlokasi === "prodi" && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Lingkup Prodi</span>
                </div>
              </button>
              <button
                onClick={() => isEditing && setBasisAlokasi("laboratorium")}
                disabled={!isEditing}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                  basisAlokasi === "laboratorium"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                } ${isEditing ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    basisAlokasi === "laboratorium" ? "border-blue-500" : "border-gray-400"
                  }`}>
                    {basisAlokasi === "laboratorium" && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span>Lingkup Laboratorium</span>
                </div>
              </button>
            </div>
          </div>

          {/* Daftar PIC Prodi */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm text-gray-700 font-[Roboto]">
                Daftar PIC Prodi
              </label>
              <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center cursor-help" title="Person In Charge untuk program studi">
                <span className="text-white text-xs">?</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {picProdiList.map((pic, index) => (
                <div
                  key={pic.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                      PIC Prodi {index + 1}
                    </p>
                    <p className="text-sm text-gray-800 font-[Roboto]">
                      {pic.nama}, {pic.gelar}
                    </p>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleDeletePIC(pic.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add PIC Form */}
              {showAddPIC && isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3"
                >
                  <div>
                    <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={newPICNama}
                      onChange={(e) => setNewPICNama(e.target.value)}
                      placeholder="Contoh: Muhammad Ubaidillah Al Mustofa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                      Gelar
                    </label>
                    <input
                      type="text"
                      value={newPICGelar}
                      onChange={(e) => setNewPICGelar(e.target.value)}
                      placeholder="Contoh: B.Sc., M.SEI."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setShowAddPIC(false);
                        setNewPICNama("");
                        setNewPICGelar("");
                      }}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-[Roboto] text-sm"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleAddPIC}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
                    >
                      Tambah
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Add PIC Button */}
              {isEditing && !showAddPIC && (
                <button
                  onClick={() => setShowAddPIC(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-[Roboto] text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah PIC Prodi
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-[Roboto] text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        )}
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
