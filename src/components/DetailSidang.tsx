import { useState } from "react";
import { 
  ArrowLeft, Calendar, MapPin, Users, FileText, Clock, 
  Plus, Check, Upload, Eye, Download, AlertCircle, BookOpen,
  X, Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface Revisi {
  id: number;
  pengirim: string;
  tanggal: string;
  isi: string;
}

interface FileRevisi {
  id: number;
  nama: string;
  tanggalUpload: string;
  size: string;
}

interface DetailSidangProps {
  sidangId: string;
}

interface NilaiItem {
  no: number;
  aspek: string;
  indikator: string;
  nilai: number;
  bobot: string;
  hasil: number;
}

export function DetailSidang({ sidangId }: DetailSidangProps) {
  const [showTambahRevisi, setShowTambahRevisi] = useState(false);
  const [newRevisi, setNewRevisi] = useState("");
  const [selectedPenguji, setSelectedPenguji] = useState("Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.");
  const [revisiFile, setRevisiFile] = useState<File | null>(null);
  const [showFormNilai, setShowFormNilai] = useState(false);
  const [showKeputusanSidang, setShowKeputusanSidang] = useState(false);
  const [hasilSidang, setHasilSidang] = useState("Lulus");
  const [kehadiran, setKehadiran] = useState("Hadir");
  
  const [revisiList, setRevisiList] = useState<Revisi[]>([
    {
      id: 1,
      pengirim: "Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.",
      tanggal: "20 Januari 2026",
      isi: "Perjelas latar belakang dan tambahkan perbandingan dengan metode deteksi intrusi konvensional."
    }
  ]);

  const [nilaiItems, setNilaiItems] = useState<NilaiItem[]>([
    {
      no: 1,
      aspek: "Materi",
      indikator: "Kualitas konten (1) Kesesuaian judul dengan materi dan dengan permasalahan dan dengan permasalahan",
      nilai: 0,
      bobot: "20%",
      hasil: 0
    },
    {
      no: 2,
      aspek: "Materi",
      indikator: "Kualitas konten (2) Ketepatan pemilihan dasar teori dan metode penelitian yang relevan untuk mengkaji rumusan masalah dan mencapai tujuan penelitian",
      nilai: 0,
      bobot: "20%",
      hasil: 0
    },
    {
      no: 3,
      aspek: "Materi",
      indikator: "Kualitas konten (3) Ketepatan merumuskan teknik pengumpulan data dan analisis data untuk menjawab rumusan masalah dan mencapai tujuan penelitian (sistematika penelitian, timeline, dll)",
      nilai: 0,
      bobot: "20%",
      hasil: 0
    },
    {
      no: 4,
      aspek: "Materi",
      indikator: "Kualitas konten (4) Tata tulis terstruktur secara rapi dan sistematis sesuai pedoman penulisan proposal TA di ITS",
      nilai: 0,
      bobot: "10%",
      hasil: 0
    },
    {
      no: 5,
      aspek: "Presentasi",
      indikator: "Kualitas konten (5) Potensi proposal penelitian mengembangkan ide-ide baru untuk membantu menemukan penyelesaian persoalan-persoalan pembangunan",
      nilai: 0,
      bobot: "5%",
      hasil: 0
    },
    {
      no: 6,
      aspek: "Presentasi",
      indikator: "Presentasi & Diskusi (1) Ketepatan dan kualitas (sistematika & estetika) materi presentasi",
      nilai: 0,
      bobot: "10%",
      hasil: 0
    },
    {
      no: 7,
      aspek: "Presentasi",
      indikator: "Presentasi & Diskusi (2) Kemampuan menyampaikan argumentasi (iniasi / menggapai pertanyaan)",
      nilai: 0,
      bobot: "10%",
      hasil: 0
    },
    {
      no: 8,
      aspek: "Presentasi",
      indikator: "Presentasi & Diskusi (3) Sikap dan penampilan selama presentasi",
      nilai: 0,
      bobot: "5%",
      hasil: 0
    }
  ]);

  // Mock data - dalam production akan fetch berdasarkan sidangId
  // Simulasi data berbeda berdasarkan ID
  const getSidangData = (id: string) => {
    const dataMap: Record<string, any> = {
      "1": {
        id: "1",
        nama: "Budi Santoso",
        nrp: "5025221034",
        jenisSidang: "Sidang Proposal",
        periode: "S1",
        statusPengerjaan: "Perlu Dinilai",
        statusRole: "Pembimbing",
        tanggal: "Senin, 12 Januari 2026",
        waktu: "09.00 - 11.00 WIB",
        lokasi: "Ruang Sidang 1 Departemen Informatika",
        judul: "PENERAPAN VISION TRANSFORMER UNTUK DETEKSI ANOMALI JARINGAN KOMPUTER SKALA BESAR",
        kategori: "Keamanan Jaringan",
        abstrak: "Penelitian ini bertujuan mengimplementasikan Vision Transformer (ViT) untuk mendeteksi pola anomali pada traffic jaringan komputer berskala besar.",
        pembimbing1: "Dr. Ahmad Saikhu, S.T., M.T.",
        dosenPenguji: [
          "Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.",
          "Dr. Budi Rahardjo, S.Kom., M.Sc.",
          "Dr. Citra Dewi, S.T., M.T."
        ],
        proposalFile: "Proposal_5025221034.pdf",
        batasRevisi: "20 Januari 2026",
        statusRevisi: "Belum Lewat"
      },
      "2": {
        id: "2",
        nama: "Andi Pratama",
        nrp: "5025223002",
        jenisSidang: "Sidang Akhir",
        periode: "S1",
        statusPengerjaan: "Perlu Approval",
        statusRole: "Ketua Sidang",
        tanggal: "Selasa, 15 Januari 2026",
        waktu: "13.00 - 15.00 WIB",
        lokasi: "Ruang Sidang 2 Departemen Informatika",
        judul: "RANCANG BANGUN SISTEM MONITORING BIMBINGAN TUGAS AKHIR BERBASIS WEB",
        kategori: "Sistem Informasi",
        abstrak: "Penelitian ini mengembangkan sistem monitoring bimbingan tugas akhir berbasis web untuk meningkatkan efisiensi proses bimbingan.",
        pembimbing1: "Dr. Dewi Lestari, S.Kom., M.T.",
        dosenPenguji: [
          "Dr. Eko Prasetyo, S.T., M.Sc.",
          "Dr. Fitri Handayani, S.Kom., M.Comp.Sc.",
          "Dr. Gunawan Wibisono, S.T., M.T."
        ],
        proposalFile: "Proposal_5025223002.pdf",
        batasRevisi: "22 Januari 2026",
        statusRevisi: "Belum Lewat"
      },
      "3": {
        id: "3",
        nama: "Siti Aminah",
        nrp: "5025201015",
        jenisSidang: "Sidang Proposal",
        periode: "S1",
        statusPengerjaan: "Dalam Sidang",
        statusRole: "Penguji",
        tanggal: "Rabu, 10 Januari 2026",
        waktu: "10.00 - 12.00 WIB",
        lokasi: "Ruang Sidang 3 Departemen Informatika",
        judul: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia",
        kategori: "Mobile Computing",
        abstrak: "Aplikasi mobile berbasis Android untuk monitoring kesehatan lansia dengan fitur reminder dan emergency call.",
        pembimbing1: "Dr. Hadi Santoso, S.Kom., M.T.",
        dosenPenguji: [
          "Dr. Indra Gunawan, S.T., M.Sc.",
          "Dr. Joko Purnomo, S.Kom., M.Comp.Sc.",
          "Dr. Kartika Sari, S.T., M.T."
        ],
        proposalFile: "Proposal_5025201015.pdf",
        batasRevisi: "17 Januari 2026",
        statusRevisi: "Belum Lewat"
      }
    };

    return dataMap[id] || dataMap["1"];
  };

  const sidangData = getSidangData(sidangId);

  const fileRevisiList: FileRevisi[] = [
    {
      id: 1,
      nama: "Revisi_Proposal_Budi_v2.pdf",
      tanggalUpload: "18 Januari 2026",
      size: "2.4 MB"
    },
    {
      id: 2,
      nama: "Lampiran_Revisi.docx",
      tanggalUpload: "18 Januari 2026",
      size: "1.1 MB"
    }
  ];

  const handleTambahRevisi = () => {
    if (!newRevisi.trim()) {
      toast.error("Isi revisi tidak boleh kosong");
      return;
    }

    const revisi: Revisi = {
      id: revisiList.length + 1,
      pengirim: selectedPenguji,
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      isi: newRevisi
    };

    setRevisiList([...revisiList, revisi]);
    setNewRevisi("");
    setRevisiFile(null);
    setShowTambahRevisi(false);
    toast.success("Revisi berhasil ditambahkan");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRevisiFile(e.target.files[0]);
    }
  };

  const handleApproveRevisi = () => {
    toast.success("Revisi berhasil disetujui");
  };

  const handleNilaiChange = (index: number, nilai: number) => {
    // Validate range 0-100
    if (nilai < 0) nilai = 0;
    if (nilai > 100) nilai = 100;
    
    const newNilaiItems = [...nilaiItems];
    newNilaiItems[index].nilai = nilai;
    // Calculate hasil based on bobot
    const bobotNum = parseFloat(newNilaiItems[index].bobot) / 100;
    newNilaiItems[index].hasil = nilai * bobotNum;
    setNilaiItems(newNilaiItems);
  };

  const calculateTotalNilai = () => {
    return nilaiItems.reduce((sum, item) => sum + item.hasil, 0).toFixed(2);
  };

  const getGradeFromScore = (score: number) => {
    if (score >= 86 && score <= 100) return "A";
    if (score >= 76 && score < 86) return "AB";
    if (score >= 66 && score < 76) return "B";
    if (score >= 61 && score < 66) return "BC";
    if (score >= 51 && score < 61) return "C";
    if (score >= 41 && score < 51) return "D";
    return "E";
  };

  const handleSimpanNilai = () => {
    toast.success("Nilai berhasil disimpan");
    setShowFormNilai(false);
  };

  const handleSimpanPermanen = () => {
    toast.success("Nilai berhasil disimpan secara permanen");
  };

  const handleSimpanKeputusan = () => {
    toast.success(`Keputusan sidang berhasil disimpan: ${hasilSidang}, Kehadiran: ${kehadiran}`);
    setShowKeputusanSidang(false);
  };

  const renderButtonsByRole = () => {
    if (sidangData.statusRole === "Ketua Sidang") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button 
            onClick={() => setShowKeputusanSidang(true)}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-[Roboto] text-sm"
          >
            Keputusan Sidang
          </button>
          <button 
            onClick={() => setShowFormNilai(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
          >
            Beri Nilai
          </button>
          <button 
            onClick={handleSimpanPermanen}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm"
          >
            Simpan Permanen
          </button>
        </div>
      );
    } else if (sidangData.statusRole === "Penguji" || sidangData.statusRole === "Pembimbing") {
      return (
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setShowFormNilai(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
          >
            Beri Nilai
          </button>
          <button 
            onClick={handleSimpanPermanen}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm"
          >
            Simpan Nilai
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a
            href="#/dosen/sidang"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-[Roboto]"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Sidang
          </a>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl text-gray-800 font-[Poppins]">
                    {sidangData.jenisSidang} – {sidangData.nama}
                  </h1>
                  <p className="text-sm text-gray-600 font-[Roboto]">
                    NRP {sidangData.nrp} • {sidangData.periode} • {sidangData.statusRole}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-[Roboto] border border-yellow-200">
                {sidangData.statusPengerjaan}
              </span>
            </div>

            {renderButtonsByRole()}
          </div>
        </div>

        {/* Topik Tugas Akhir */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-gray-800 font-[Poppins] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Topik Tugas Akhir
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Judul</p>
              <p className="text-sm text-gray-800 font-[Roboto] font-semibold">
                {sidangData.judul}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Kategori</p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.kategori}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Abstrak</p>
              <p className="text-sm text-gray-700 font-[Roboto]">
                {sidangData.abstrak}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Dosen Pembimbing 1</p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.pembimbing1}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Berkas Proposal yang Dikumpulkan</p>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 font-[Roboto] flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  {sidangData.proposalFile}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Sidang */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-gray-800 font-[Poppins] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Informasi Sidang
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Jenis / Jenjang</p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.jenisSidang} • {sidangData.periode}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Posisi Dosen pada Sidang</p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.statusRole}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Tanggal</p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.tanggal}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Waktu</p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.waktu}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Lokasi</p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.lokasi}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">Dosen Penguji</p>
              <div className="space-y-1">
                {sidangData.dosenPenguji.map((dosen, index) => (
                  <p key={index} className="text-sm text-gray-800 font-[Roboto]">
                    {index + 1}. {dosen}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Revisi - ONLY show when status is "Perlu Dinilai" */}
        {sidangData.statusPengerjaan === "Perlu Dinilai" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800 font-[Poppins] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Catatan Revisi
              </h2>
              <button
                onClick={() => setShowTambahRevisi(!showTambahRevisi)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Revisi
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-orange-700 font-[Roboto]">
                <span className="font-semibold">Batas penambahan revisi:</span> {sidangData.batasRevisi}
              </p>
            </div>

            <AnimatePresence>
              {showTambahRevisi && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="mb-3">
                    <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
                      Penguji / Pembimbing
                    </label>
                    <select
                      value={selectedPenguji}
                      onChange={(e) => setSelectedPenguji(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                    >
                      <option value="Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.">Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.</option>
                      <option value="Dr. Budi Rahardjo, S.Kom., M.Sc.">Dr. Budi Rahardjo, S.Kom., M.Sc.</option>
                      <option value="Dr. Citra Dewi, S.T., M.T.">Dr. Citra Dewi, S.T., M.T.</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
                      Catatan Revisi
                    </label>
                    <textarea
                      value={newRevisi}
                      onChange={(e) => setNewRevisi(e.target.value)}
                      placeholder="Tuliskan poin-poin revisi yang perlu dikerjakan mahasiswa..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
                      Unggah Berkas Revisi (opsional)
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
                      <Paperclip className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600 font-[Roboto]">
                        {revisiFile ? revisiFile.name : "Pilih berkas .pdf / .docx / .zip"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.zip"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleTambahRevisi}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
                    >
                      Simpan Revisi
                    </button>
                    <button
                      onClick={() => {
                        setShowTambahRevisi(false);
                        setNewRevisi("");
                        setRevisiFile(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-[Roboto] text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {revisiList.map((revisi) => (
                <div key={revisi.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3 mb-2">
                    <Users className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 font-[Roboto] font-semibold">
                        Pengirim / Pembimbing
                      </p>
                      <p className="text-sm text-gray-700 font-[Roboto]">
                        {revisi.pengirim}
                      </p>
                    </div>
                  </div>
                  <div className="ml-7">
                    <p className="text-xs text-gray-600 font-[Roboto] mb-1">Revisi #{revisi.id}</p>
                    <p className="text-sm text-gray-800 font-[Roboto] mb-2">
                      {revisi.isi}
                    </p>
                    <p className="text-xs text-gray-500 font-[Roboto]">
                      {revisi.tanggal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Revisi - ONLY show when status is "Perlu Approval" */}
        {sidangData.statusPengerjaan === "Perlu Approval" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-800 font-[Poppins] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              File Revisi
            </h2>

            <div className="space-y-3 mb-4">
              {fileRevisiList.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-800 font-[Roboto] font-semibold">
                        {file.nama}
                      </p>
                      <p className="text-xs text-gray-600 font-[Roboto]">
                        {file.tanggalUpload} • {file.size}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleApproveRevisi}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Approve Revisi
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

      {/* Form Nilai Modal */}
      <AnimatePresence>
        {showFormNilai && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFormNilai(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-800 font-[Poppins]">
                  Berikan Penilaian Sidang
                </h2>
                <button
                  onClick={() => setShowFormNilai(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <p className="text-sm text-gray-600 font-[Roboto] mb-4">
                  Masukkan nilai dengan parameter:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-[Roboto] text-gray-700 w-8">No</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-[Roboto] text-gray-700">Aspek Penilaian & Indikator</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-[Roboto] text-gray-700 w-24">Nilai</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-[Roboto] text-gray-700 w-20">Bobot</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-[Roboto] text-gray-700 w-24">Hasil</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nilaiItems.map((item, index) => (
                        <tr key={item.no}>
                          <td className="border border-gray-300 px-3 py-2 text-xs font-[Roboto] text-gray-700 text-center">
                            {item.no}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div>
                              <p className="text-xs font-[Roboto] text-gray-800 font-semibold mb-1">
                                {item.aspek}
                              </p>
                              <p className="text-xs font-[Roboto] text-gray-600">
                                {item.indikator}
                              </p>
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-[Roboto] mt-1">
                                ↓ Lihat indikator
                              </button>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.nilai}
                              onChange={(e) => handleNilaiChange(index, parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm font-[Roboto] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-sm font-[Roboto] text-gray-700">
                            {item.bobot}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-sm font-[Roboto] text-gray-700">
                            {item.hasil.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right text-sm font-[Roboto] font-semibold text-gray-800">
                          Nilai Akhir : {calculateTotalNilai()} ({getGradeFromScore(parseFloat(calculateTotalNilai()))})
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-[Roboto]">
                            Rentang Nilai ⓘ
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowFormNilai(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-[Roboto] text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSimpanNilai}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}