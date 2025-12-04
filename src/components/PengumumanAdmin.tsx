import { useState } from "react";
import { ChevronLeft, Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered } from "lucide-react";

interface PengumumanAdminProps {
  onBack: () => void;
}

export function PengumumanAdmin({ onBack }: PengumumanAdminProps) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tujuan, setTujuan] = useState<"both" | "mahasiswa" | "dosen">("both");
  const [publikasikan, setPublikasikan] = useState(false);

  const handleSimpan = () => {
    // Handle save logic here
    console.log({
      judul,
      deskripsi,
      tujuan,
      publikasikan
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-gray-800 font-[Poppins]">Buat Pengumuman Baru</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Judul Pengumuman */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
            Judul Pengumuman
          </label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Judul Pengumuman"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Roboto] text-sm"
          />
        </div>

        {/* Deskripsi */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
            Deskripsi
          </label>
          
          {/* Toolbar */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2 flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
              <Bold className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
              <Italic className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
              <Underline className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
              <LinkIcon className="w-4 h-4 text-gray-600" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
              <List className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
              <ListOrdered className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Masukkan deskripsi pengumuman disini..."
            className="w-full px-4 py-3 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Roboto] text-sm min-h-[120px] resize-y"
          />
        </div>

        {/* Tujuan */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 font-[Roboto] mb-3">
            Tujuan
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setTujuan("both")}
              className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                tujuan === "both"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              Dosen & Mahasiswa
            </button>
            <button
              onClick={() => setTujuan("mahasiswa")}
              className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                tujuan === "mahasiswa"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              Mahasiswa
            </button>
            <button
              onClick={() => setTujuan("dosen")}
              className={`px-4 py-3 rounded-lg border-2 transition-all font-[Roboto] text-sm ${
                tujuan === "dosen"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              Dosen
            </button>
          </div>
        </div>

        {/* Unggah Berkas */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
            Unggah berkas
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-12 text-center">
            <p className="text-sm text-gray-500 font-[Roboto]">
              Drag & Drop your files or{" "}
              <button className="text-blue-600 hover:text-blue-700 underline">
                Browse
              </button>
            </p>
            <p className="text-xs text-gray-400 font-[Roboto] mt-2">
              Powered by FOINA
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={publikasikan}
              onChange={(e) => setPublikasikan(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 font-[Roboto]">Publikasikan</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-[Roboto] transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSimpan}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-[Roboto] transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
