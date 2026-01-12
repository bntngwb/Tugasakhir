import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Plus,
  Download,
  AlertCircle,
  BookOpen,
  X,
  Paperclip,
  CheckCircle2,
  Check,
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
  bobot: string; // "20%"
  hasil: number;
}

// TIPE STATUS DISAMAKAN DENGAN SIDANGDOSEN.TSX (4 STAGE)
type StatusPengerjaan =
  | "Menunggu Sidang"
  | "Dalam Sidang"
  | "Pengerjaan Revisi"
  | "Selesai";

type Role = "Ketua Sidang" | "Penguji" | "Pembimbing";

export function DetailSidang({ sidangId }: DetailSidangProps) {
  // STATE UI INTERNAL
  const [showTambahRevisi, setShowTambahRevisi] = useState(false);
  const [newRevisi, setNewRevisi] = useState("");
  const [selectedPenguji, setSelectedPenguji] = useState(
    "Dr. Anny Yuniarti, S.Kom., M.Comp.Sc."
  );
  const [revisiFile, setRevisiFile] = useState<File | null>(null);

  const [showFormNilai, setShowFormNilai] = useState(false);
  const [nilaiMode, setNilaiMode] = useState<"sementara" | "final">(
    "sementara"
  );

  const [showKeputusanSidang, setShowKeputusanSidang] = useState(false);
  const [hasilSidang, setHasilSidang] = useState<
    | ""
    | "Diterima"
    | "Diterima dengan revisi minor"
    | "Diterima dengan revisi mayor"
    | "Ditolak"
  >("");
  const [kehadiran, setKehadiran] = useState<
    "Hadir" | "Tidak Hadir" | "Izin / Sakit"
  >("Hadir");

  // STATE LOGIKA BARU
  const [hasSavedTemporaryScore, setHasSavedTemporaryScore] = useState(false);
  const [hasSavedFinalScore, setHasSavedFinalScore] = useState(false);
  const [hasSavedSidangDecision, setHasSavedSidangDecision] = useState(false);
  
  // Flag ini menentukan apakah di stage "Pengerjaan Revisi" user sudah ACC atau belum
  const [hasApprovedRevision, setHasApprovedRevision] = useState(false);

  const [temporaryScore, setTemporaryScore] = useState<number | null>(null);
  const [temporaryGrade, setTemporaryGrade] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalGrade, setFinalGrade] = useState<string | null>(null);

  const [lastTemporarySaveAt, setLastTemporarySaveAt] = useState<Date | null>(null);

  // DATA MOCK REVISI (Kosongkan awal agar logic "Wajib Tambah Revisi" jalan)
  const [revisiList, setRevisiList] = useState<Revisi[]>([]);

  const [nilaiItems, setNilaiItems] = useState<NilaiItem[]>([
    {
      no: 1,
      aspek: "Materi",
      indikator:
        "Kualitas konten (1) Kesesuaian judul dengan materi dan dengan permasalahan",
      nilai: 0,
      bobot: "20%",
      hasil: 0,
    },
    {
      no: 2,
      aspek: "Materi",
      indikator:
        "Kualitas konten (2) Ketepatan pemilihan dasar teori dan metode penelitian",
      nilai: 0,
      bobot: "20%",
      hasil: 0,
    },
    {
      no: 3,
      aspek: "Materi",
      indikator:
        "Kualitas konten (3) Ketepatan perumusan teknik pengumpulan data dan analisis data",
      nilai: 0,
      bobot: "20%",
      hasil: 0,
    },
    {
      no: 4,
      aspek: "Materi",
      indikator:
        "Kualitas konten (4) Tata tulis terstruktur secara rapi dan sistematis",
      nilai: 0,
      bobot: "10%",
      hasil: 0,
    },
    {
      no: 5,
      aspek: "Materi",
      indikator:
        "Kualitas konten (5) Potensi proposal mengembangkan ide baru untuk pemecahan masalah",
      nilai: 0,
      bobot: "5%",
      hasil: 0,
    },
    {
      no: 6,
      aspek: "Presentasi",
      indikator:
        "Presentasi & Diskusi (1) Ketepatan dan kualitas materi presentasi",
      nilai: 0,
      bobot: "10%",
      hasil: 0,
    },
    {
      no: 7,
      aspek: "Presentasi",
      indikator:
        "Presentasi & Diskusi (2) Kemampuan menyampaikan argumentasi",
      nilai: 0,
      bobot: "10%",
      hasil: 0,
    },
    {
      no: 8,
      aspek: "Presentasi",
      indikator: "Presentasi & Diskusi (3) Sikap dan penampilan",
      nilai: 0,
      bobot: "5%",
      hasil: 0,
    },
  ]);

  const [showSaveNilaiConfirm, setShowSaveNilaiConfirm] = useState(false);

  // =====================================================
  // DATA MASTER: SAMA PERSIS DENGAN SIDANGDOSEN.TSX
  // =====================================================
  const getSidangData = (id: string) => {
    const dataMap: Record<string, any> = {
      "1": {
        id: "1",
        nama: "Budi Santoso",
        nrp: "5025221034",
        jenisSidang: "Sidang Proposal",
        periode: "S1",
        statusPengerjaan: "Menunggu Sidang",
        statusRole: "Pembimbing",
        tanggal: "20 Januari 2026",
        waktu: "09.00 - 11.00 WIB",
        lokasi: "Ruang Sidang 1 Departemen Informatika",
        judul: "PENERAPAN VISION TRANSFORMER UNTUK DETEKSI ANOMALI",
        kategori: "Keamanan Jaringan",
        abstrak: "Penelitian ini bertujuan mengimplementasikan Vision Transformer (ViT)...",
        pembimbing1: "Dr. Ahmad Saikhu, S.T., M.T.",
        dosenPenguji: ["Dr. Anny Yuniarti", "Dr. Budi Rahardjo", "Dr. Citra Dewi"],
        proposalFile: "Proposal_5025221034.pdf",
        batasRevisi: "27 Januari 2026",
      },
      "2": {
        id: "2",
        nama: "Andi Pratama",
        nrp: "5025223002",
        jenisSidang: "Sidang Akhir",
        periode: "S1",
        statusPengerjaan: "Dalam Sidang",
        statusRole: "Ketua Sidang",
        tanggal: "13 Januari 2026",
        waktu: "13.00 - 15.00 WIB",
        lokasi: "Ruang Sidang 2",
        judul: "RANCANG BANGUN SISTEM MONITORING BIMBINGAN",
        kategori: "Sistem Informasi",
        abstrak: "Penelitian ini mengembangkan sistem monitoring bimbingan...",
        pembimbing1: "Dr. Dewi Lestari, S.Kom., M.T.",
        dosenPenguji: ["Dr. Eko Prasetyo", "Dr. Fitri Handayani", "Dr. Gunawan Wibisono"],
        proposalFile: "Proposal_5025223002.pdf",
        batasRevisi: "20 Januari 2026",
      },
      "3": {
        id: "3",
        nama: "Siti Aminah",
        nrp: "5025201015",
        jenisSidang: "Sidang Proposal",
        periode: "S1",
        statusPengerjaan: "Pengerjaan Revisi",
        statusRole: "Penguji",
        tanggal: "10 Januari 2026",
        waktu: "10.00 - 12.00 WIB",
        lokasi: "Ruang Sidang 3",
        judul: "Aplikasi Mobile untuk Monitoring Kesehatan Lansia",
        kategori: "Mobile Computing",
        abstrak: "Aplikasi mobile berbasis Android untuk monitoring kesehatan...",
        pembimbing1: "Dr. Hadi Santoso, S.Kom., M.T.",
        dosenPenguji: ["Dr. Indra Gunawan", "Dr. Joko Purnomo", "Dr. Kartika Sari"],
        proposalFile: "Proposal_5025201015.pdf",
        batasRevisi: "17 Januari 2026",
      },
      "4": {
        id: "4",
        nama: "Bayu Aditya",
        nrp: "6025201002",
        jenisSidang: "Sidang Akhir",
        periode: "S2",
        statusPengerjaan: "Selesai",
        statusRole: "Pembimbing",
        tanggal: "05 Januari 2026",
        waktu: "08.00 - 10.00 WIB",
        lokasi: "Ruang Sidang Pascasarjana 1",
        judul: "Analisis Sentimen Media Sosial Menggunakan Deep Learning",
        kategori: "Artificial Intelligence",
        abstrak: "Penerapan LSTM dan BERT untuk analisis sentimen...",
        pembimbing1: "Prof. Dr. Agus Zainal Arifin",
        dosenPenguji: ["Dr. Eng. Nanik Suciati", "Dr. Diana Purwitasari"],
        proposalFile: "Tesis_6025201002.pdf",
        batasRevisi: "12 Januari 2026",
      },
      "5": {
        id: "5",
        nama: "Dewi Kartika",
        nrp: "5025201020",
        jenisSidang: "Sidang Proposal",
        periode: "S1",
        statusPengerjaan: "Selesai",
        statusRole: "Ketua Sidang",
        tanggal: "02 Januari 2026",
        waktu: "13.00 - 15.00 WIB",
        lokasi: "Ruang Sidang 1",
        judul: "Implementasi Machine Learning untuk Deteksi Penyakit",
        kategori: "Bioinformatics",
        abstrak: "Pengembangan model klasifikasi citra medis menggunakan CNN...",
        pembimbing1: "Dr. Chastine Fatichah",
        dosenPenguji: ["Dr. Rully Soelaiman", "Dr. Yudhi Purwananto"],
        proposalFile: "Proposal_5025201020.pdf",
        batasRevisi: "09 Januari 2026",
      },
      "6": {
        id: "6",
        nama: "Rini Susanti",
        nrp: "6025201008",
        jenisSidang: "Sidang Akhir",
        periode: "S2",
        statusPengerjaan: "Dalam Sidang",
        statusRole: "Penguji",
        tanggal: "13 Januari 2026",
        waktu: "09.00 - 11.00 WIB",
        lokasi: "Ruang Sidang Pascasarjana 2",
        judul: "Optimasi Algoritma Pencarian dengan Genetic Algorithm",
        kategori: "Algorithms",
        abstrak: "Studi perbandingan performa algoritma genetika...",
        pembimbing1: "Dr. Bilqis Amaliah",
        dosenPenguji: ["Dr. Dieky Adzkiya", "Dr. Hari Ginardi"],
        proposalFile: "Tesis_6025201008.pdf",
        batasRevisi: "20 Januari 2026",
      },
    };
    return dataMap[id] || dataMap["1"];
  };

  const sidangData = getSidangData(sidangId);

  // STORAGE INITIALIZATION
  const getInitialStatus = (): StatusPengerjaan => {
    if (typeof window !== "undefined") {
      const stored = window.sessionStorage.getItem(`sidang-status-${sidangId}`);
      if (stored) return stored as StatusPengerjaan;
    }
    return sidangData.statusPengerjaan;
  };

  const [statusPengerjaan, setStatusPengerjaan] = useState<StatusPengerjaan>(getInitialStatus());

  // Helper untuk update status & persist
  const updateStatus = (newStatus: StatusPengerjaan) => {
    setStatusPengerjaan(newStatus);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(`sidang-status-${sidangId}`, newStatus);
    }
  };

  // Mock File Revisi (Muncul saat stage Pengerjaan Revisi)
  const fileRevisiList: FileRevisi[] = [
    {
      id: 1,
      nama: `Revisi_${sidangData.nama.split(" ")[0]}_Final.pdf`,
      tanggalUpload: "18 Januari 2026",
      size: "2.4 MB",
    },
    {
      id: 2,
      nama: "Matrix_Perbaikan.xlsx",
      tanggalUpload: "18 Januari 2026",
      size: "1.1 MB",
    },
  ];

  // LOGIKA: TAMBAH REVISI
  const handleTambahRevisi = () => {
    // Pada tahap Pengerjaan Revisi, tombol non-aktif (UI handled in render)
    // Tapi untuk safety logic:
    if (statusPengerjaan === "Pengerjaan Revisi") {
      toast.error("Tidak dapat menambah revisi pada tahap ini.");
      return;
    }

    if (!newRevisi.trim()) {
      toast.error("Isi revisi tidak boleh kosong");
      return;
    }

    const revisi: Revisi = {
      id: revisiList.length + 1,
      pengirim: selectedPenguji,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      isi: newRevisi,
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

  const handleNilaiChange = (index: number, nilai: number) => {
    if (isNaN(nilai)) nilai = 0;
    if (nilai < 0) nilai = 0;
    if (nilai > 100) nilai = 100;

    const newItems = [...nilaiItems];
    newItems[index].nilai = nilai;

    const bobotNum = parseFloat(newItems[index].bobot) / 100;
    newItems[index].hasil = nilai * bobotNum;

    setNilaiItems(newItems);
  };

  const calculateTotalNilai = () => {
    return nilaiItems.reduce((sum, item) => sum + item.hasil, 0);
  };

  const getGradeFromScore = (score: number) => {
    if (score >= 86 && score <= 100) return "A";
    if (score >= 76 && score < 86) return "AB";
    if (score >= 66 && score < 76) return "B";
    if (score >= 61 && score < 66) return "BC";
    if (score >= 51 && score < 61) return "C";
    if (score >= 0 && score < 51) return "Tidak Lulus";
    return "-";
  };

  // LOGIKA: SIMPAN NILAI
  const confirmSaveNilai = () => {
    const total = parseFloat(calculateTotalNilai().toFixed(2));
    const grade = getGradeFromScore(total);

    if (nilaiMode === "sementara") {
      setTemporaryScore(total);
      setTemporaryGrade(grade);
      setHasSavedTemporaryScore(true);
      setLastTemporarySaveAt(new Date());
      toast.success(`Nilai sementara disimpan (${total.toFixed(2)} – ${grade})`);
      // TIDAK otomatis pindah status, user harus klik tombol "Simpan Sementara" (Kirim Penilaian) di dashboard
    } else {
      setFinalScore(total);
      setFinalGrade(grade);
      setHasSavedFinalScore(true);
      toast.success(`Nilai akhir disimpan (${total.toFixed(2)} – ${grade})`);
    }
    setShowSaveNilaiConfirm(false);
  };

  const handleSimpanNilai = () => {
    setShowFormNilai(false);
    setShowSaveNilaiConfirm(true);
  };

  // LOGIKA: KEPUTUSAN SIDANG (KHUSUS KETUA)
  const handleSimpanKeputusan = () => {
    if (!hasilSidang) {
      toast.error("Silakan pilih hasil sidang terlebih dahulu");
      return;
    }
    
    // Asumsi: Jika sudah simpan keputusan, berarti kehadiran dosen juga sudah divalidasi
    // (sesuai request: isi hasil + kehadiran -> baru simpan permanen)
    setHasSavedSidangDecision(true);
    toast.success("Keputusan sidang & kehadiran berhasil disimpan sementara.");
    setShowKeputusanSidang(false);
  };

  // LOGIKA: PERPINDAHAN STAGE (Action Buttons)

  // 1. DARI "DALAM SIDANG" KE "PENGERJAAN REVISI"
  const handleSimpanSementaraTransisi = () => {
    // Wajib ada revisi
    if (revisiList.length === 0) {
      toast.error("Wajib menambahkan minimal 1 poin revisi sebelum menyimpan sementara.");
      return;
    }
    // Wajib ada nilai sementara
    if (!hasSavedTemporaryScore) {
      toast.error("Wajib menyimpan nilai sementara terlebih dahulu.");
      return;
    }

    updateStatus("Pengerjaan Revisi");
    toast.success("Status diperbarui: Mahasiswa kini dalam tahap Pengerjaan Revisi.");
  };

  // 2. APPROVE REVISI (DI STAGE "PENGERJAAN REVISI")
  const handleApproveRevisi = () => {
    setHasApprovedRevision(true);
    setShowTambahRevisi(false);
    toast.success("Revisi mahasiswa disetujui. Anda dapat melanjutkan ke penilaian akhir.");
    // Tidak pindah status Pengerjaan Revisi -> Selesai secara otomatis di sini
    // User harus klik Simpan Permanen
  };

  // 3. DARI "PENGERJAAN REVISI" KE "SELESAI" (SIMPAN PERMANEN)
  const handleSimpanPermanen = () => {
    const role = sidangData.statusRole as Role;

    // Cek Prasyarat Umum
    if (!hasApprovedRevision) {
      toast.error("Harap setujui (ACC) revisi mahasiswa terlebih dahulu.");
      return;
    }

    // Jika user belum simpan nilai akhir, gunakan nilai sementara sebagai nilai akhir (auto-carry)
    // atau paksa user buka form nilai akhir. Sesuai flow umum, biasanya wajib save final.
    if (!hasSavedFinalScore) {
        // Opsi: Paksa user simpan nilai akhir
        toast.error("Harap simpan Nilai Akhir terlebih dahulu sebelum Simpan Permanen.");
        return;
    }

    // KHUSUS KETUA SIDANG
    if (role === "Ketua Sidang") {
      if (!hasSavedSidangDecision) {
        toast.error("Ketua Sidang wajib mengisi Keputusan Sidang & Kehadiran sebelum Simpan Permanen.");
        return;
      }
      
      // Simpan Keputusan ke Storage agar SidangDosen.tsx bisa baca
      if (typeof window !== "undefined" && hasilSidang) {
        let keputusanMapped = "";
        if (hasilSidang === "Diterima") keputusanMapped = "Lulus";
        else if (hasilSidang === "Diterima dengan revisi minor") keputusanMapped = "Revisi Minor";
        else if (hasilSidang === "Diterima dengan revisi mayor") keputusanMapped = "Revisi Mayor";
        else if (hasilSidang === "Ditolak") keputusanMapped = "Tidak Lulus"; // Mapping 'Ditolak' -> 'Tidak Lulus'
        
        window.sessionStorage.setItem(`sidang-keputusan-${sidangId}`, keputusanMapped);
      }
    }

    // FINALISASI
    updateStatus("Selesai");
    toast.success("Sidang selesai. Data disimpan permanen.");
  };

  // RENDER TOMBOL BERDASARKAN STATUS & ROLE (LOGIKA UI)
  const renderButtonsByRole = () => {
    const role = sidangData.statusRole as Role;

    // STAGE 1: MENUNGGU SIDANG
    // Di SidangDosen tombol Lihat disabled, tapi kalau akses via URL:
    if (statusPengerjaan === "Menunggu Sidang") {
      return (
        <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 font-[Roboto]">
          Sidang belum dimulai. Tombol aksi tidak tersedia.
        </div>
      );
    }

    // STAGE 2: DALAM SIDANG
    if (statusPengerjaan === "Dalam Sidang") {
      // Semua role sama: Wajib revisi & nilai sementara -> Simpan Sementara
      if (role === "Ketua Sidang") {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setShowKeputusanSidang(true)}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-[Roboto] text-sm"
              >
                Keputusan Sidang (Draft)
              </button>
              <div className="flex gap-2">
                 <button
                    onClick={() => {
                        setNilaiMode("sementara");
                        setShowFormNilai(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
                    >
                    Nilai Sementara
                </button>
                <button
                    onClick={handleSimpanSementaraTransisi}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm"
                    title="Simpan Sementara & Lanjut Revisi"
                >
                    Simpan Sementara
                </button>
              </div>
            </div>
          );
      }
      
      // Penguji / Pembimbing
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setNilaiMode("sementara");
              setShowFormNilai(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
          >
            Nilai Sementara
          </button>
          <button
            onClick={handleSimpanSementaraTransisi}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm"
          >
            Simpan Sementara
          </button>
        </div>
      );
    }

    // STAGE 3: PENGERJAAN REVISI
    if (statusPengerjaan === "Pengerjaan Revisi") {
        // Jika belum ACC revisi
        if (!hasApprovedRevision) {
             return (
                <div className="px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800 font-[Roboto]">
                  Mahasiswa telah mengunggah revisi. Silakan cek bagian "File Revisi" di bawah dan klik <b>"Setujui Revisi"</b> untuk melanjutkan ke penilaian akhir.
                </div>
              );
        }

        // Jika sudah ACC revisi -> Tampilkan tombol Finalisasi
        if (role === "Ketua Sidang") {
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setShowKeputusanSidang(true)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-[Roboto] text-sm"
                >
                  Keputusan Sidang
                </button>
                <button
                  onClick={() => {
                    setNilaiMode("final");
                    setShowFormNilai(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
                >
                  Nilai Akhir
                </button>
                <button
                  onClick={handleSimpanPermanen}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm"
                >
                  Simpan Permanen
                </button>
              </div>
            );
        }

        // Penguji / Pembimbing
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setNilaiMode("final");
                  setShowFormNilai(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
              >
                Nilai Akhir
              </button>
              <button
                onClick={handleSimpanPermanen}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-[Roboto] text-sm"
              >
                Simpan Permanen
              </button>
            </div>
        );
    }

    // STAGE 4: SELESAI
    if (statusPengerjaan === "Selesai") {
        return (
            <div className="px-4 py-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800 font-[Roboto]">
              Sidang telah selesai. Semua nilai dan keputusan tersimpan permanen.
            </div>
        );
    }

    return null;
  };

  const totalNilaiNow = parseFloat(calculateTotalNilai().toFixed(2));
  const gradeNow = getGradeFromScore(totalNilaiNow);

  const renderHeaderScorePill = () => {
    if (finalScore !== null && finalGrade) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
          <span className="text-xs text-gray-500 font-[Roboto]">
            Nilai Akhir
          </span>
          <span className="text-sm font-[Poppins] text-gray-900">
            {finalScore.toFixed(2)}
          </span>
          <span className="text-xs font-[Poppins] text-green-700">
            {finalGrade}
          </span>
        </div>
      );
    }

    if (temporaryScore !== null && temporaryGrade) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200">
          <span className="text-xs text-gray-500 font-[Roboto]">
            Nilai Sementara
          </span>
          <span className="text-sm font-[Poppins] text-gray-900">
            {temporaryScore.toFixed(2)}
          </span>
          <span className="text-xs font-[Poppins] text-yellow-700">
            {temporaryGrade}
          </span>
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
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl text-gray-800 font-[Poppins]">
                    {sidangData.jenisSidang} – {sidangData.nama}
                  </h1>
                  <p className="text-sm text-gray-600 font-[Roboto]">
                    NRP {sidangData.nrp} • {sidangData.periode} •{" "}
                    {sidangData.statusRole}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-[Roboto] border border-yellow-200">
                  {statusPengerjaan}
                </span>
                {renderHeaderScorePill()}
                {lastTemporarySaveAt && !finalScore && (
                  <p className="text-[11px] text-gray-500 font-[Roboto]">
                    Nilai sementara terakhir disimpan{" "}
                    {lastTemporarySaveAt.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">{renderButtonsByRole()}</div>
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
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Judul
              </p>
              <p className="text-sm text-gray-800 font-[Roboto] font-semibold">
                {sidangData.judul}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Kategori
              </p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.kategori}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Abstrak
              </p>
              <p className="text-sm text-gray-700 font-[Roboto]">
                {sidangData.abstrak}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Dosen Pembimbing 1
              </p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.pembimbing1}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Berkas Proposal yang Dikumpulkan
              </p>
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
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Jenis / Jenjang
              </p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.jenisSidang} • {sidangData.periode}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Posisi Dosen pada Sidang
              </p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.statusRole}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Tanggal
              </p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.tanggal}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Waktu
              </p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.waktu}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Lokasi
              </p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {sidangData.lokasi}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Dosen Penguji
              </p>
              <div className="space-y-1">
                {sidangData.dosenPenguji.map(
                  (dosen: string, index: number) => (
                    <p
                      key={index}
                      className="text-sm text-gray-800 font-[Roboto]"
                    >
                      {index + 1}. {dosen}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Revisi */}
        {statusPengerjaan !== "Menunggu Sidang" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-800 font-[Poppins] flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Catatan Revisi
                </h2>

                {/* Tombol Tambah Revisi hanya aktif di "Dalam Sidang" atau jika belum final di Pengerjaan Revisi (Logic: Non Aktif di Pengerjaan Revisi) */}
                {statusPengerjaan === "Dalam Sidang" && (
                    <button
                      onClick={() => setShowTambahRevisi((prev) => !prev)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Revisi
                    </button>
                  )}
              </div>

              {statusPengerjaan === "Dalam Sidang" && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <p className="text-sm text-orange-700 font-[Roboto]">
                    <span className="font-semibold">
                      Tahap penilaian dan penyusunan revisi.
                    </span>{" "}
                    Wajib menambahkan minimal 1 catatan revisi dan menyimpan nilai sementara.
                  </p>
                </div>
              )}

              {statusPengerjaan === "Pengerjaan Revisi" && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-700 font-[Roboto]">
                    <span className="font-semibold">Fitur tambah revisi non-aktif.</span>{" "}
                    Mahasiswa sedang/telah mengerjakan revisi. Silakan setujui revisi di bawah.
                  </p>
                </div>
              )}

              {statusPengerjaan === "Selesai" && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-700 font-[Roboto]">
                    <span className="font-semibold">
                      Revisi telah disetujui.
                    </span>{" "}
                    Catatan revisi bersifat arsip dan tidak dapat diubah.
                  </p>
                </div>
              )}

              <AnimatePresence>
                {showTambahRevisi && statusPengerjaan === "Dalam Sidang" && (
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
                          onChange={(e) =>
                            setSelectedPenguji(e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                        >
                          <option value="Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.">
                            Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.
                          </option>
                          <option value="Dr. Budi Rahardjo, S.Kom., M.Sc.">
                            Dr. Budi Rahardjo, S.Kom., M.Sc.
                          </option>
                          <option value="Dr. Citra Dewi, S.T., M.T.">
                            Dr. Citra Dewi, S.T., M.T.
                          </option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm text-gray-700 font-[Roboto] mb-2">
                          Catatan Revisi
                        </label>
                        <textarea
                          value={newRevisi}
                          onChange={(e) =>
                            setNewRevisi(e.target.value)
                          }
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
                            {revisiFile
                              ? revisiFile.name
                              : "Pilih berkas .pdf / .docx / .zip"}
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
                {revisiList.length === 0 ? (
                    <p className="text-sm text-gray-500 italic font-[Roboto]">Belum ada revisi yang ditambahkan.</p>
                ) : (
                    revisiList.map((revisi) => (
                      <div
                        key={revisi.id}
                        className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <Users className="w-4 h-4 text-gray-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 font-[Roboto] font-semibold">
                              Penguji / Pembimbing
                            </p>
                            <p className="text-sm text-gray-700 font-[Roboto]">
                              {revisi.pengirim}
                            </p>
                          </div>
                        </div>
                        <div className="ml-7">
                          <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                            Revisi #{revisi.id}
                          </p>
                          <p className="text-sm text-gray-800 font-[Roboto] mb-2">
                            {revisi.isi}
                          </p>
                          <p className="text-xs text-gray-500 font-[Roboto]">
                            {revisi.tanggal}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

        {/* File Revisi (Hanya muncul di Pengerjaan Revisi & Selesai) */}
        {(statusPengerjaan === "Pengerjaan Revisi" ||
          statusPengerjaan === "Selesai") && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-800 font-[Poppins] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              File Revisi Mahasiswa
            </h2>

            <div className="space-y-3 mb-4">
              {fileRevisiList.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
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

            {/* Tombol Approval Revisi (muncul kalau status Pengerjaan Revisi dan belum ACC) */}
            {statusPengerjaan === "Pengerjaan Revisi" && (
              <button
                onClick={handleApproveRevisi}
                disabled={hasApprovedRevision}
                className={`w-full px-4 py-3 rounded-lg font-[Roboto] flex items-center justify-center gap-2 text-sm ${
                  hasApprovedRevision
                    ? "bg-green-50 text-green-700 border border-green-300 cursor-default"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 ${
                    hasApprovedRevision ? "text-green-600" : "text-gray-500"
                  }`}
                />
                {hasApprovedRevision
                  ? "Revisi sudah disetujui (Siap Finalisasi)"
                  : "Setujui revisi mahasiswa"}
              </button>
            )}

            {hasApprovedRevision && (
              <div className="mt-2 text-xs text-green-700 font-[Roboto] flex items-center gap-1">
                <Check className="w-3 h-3" />
                Revisi sudah disetujui.
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-[Roboto]">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

      {/* Modal Form Nilai */}
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
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl text-gray-800 font-[Poppins]">
                    {nilaiMode === "sementara"
                      ? "Berikan Penilaian Sidang (Nilai Sementara)"
                      : "Berikan Penilaian Sidang (Nilai Akhir)"}
                  </h2>
                  <p className="text-xs text-gray-500 font-[Roboto] mt-1">
                    Input nilai 0–100, hasil dan indeks akan muncul secara
                    otomatis.
                  </p>
                </div>
                <button
                  onClick={() => setShowFormNilai(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Live score */}
              <div className="px-6 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
                  <span className="text-xs text-gray-500 font-[Roboto]">
                    Nilai saat ini
                  </span>
                  <span className="text-sm font-[Poppins] text-gray-900">
                    {isNaN(totalNilaiNow)
                      ? "--"
                      : totalNilaiNow.toFixed(2)}
                  </span>
                  <span className="text-xs font-[Poppins] text-gray-700">
                    {gradeNow}
                  </span>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-[Roboto] text-gray-700 w-8">
                          No
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-xs font-[Roboto] text-gray-700">
                          Aspek Penilaian & Indikator
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-[Roboto] text-gray-700 w-24">
                          Nilai
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-[Roboto] text-gray-700 w-20">
                          Bobot
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs font-[Roboto] text-gray-700 w-24">
                          Hasil
                        </th>
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
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={item.nilai}
                              onChange={(e) =>
                                handleNilaiChange(
                                  index,
                                  parseInt(e.target.value || "0", 10)
                                )
                              }
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
                        <td
                          colSpan={4}
                          className="border border-gray-300 px-3 py-2 text-right text-sm font-[Roboto] font-semibold text-gray-800"
                        >
                          Nilai Akhir :{" "}
                          {isNaN(totalNilaiNow)
                            ? "--"
                            : totalNilaiNow.toFixed(2)}{" "}
                          ({gradeNow})
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

      {/* Modal Konfirmasi Simpan Nilai */}
      <AnimatePresence>
        {showSaveNilaiConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setShowSaveNilaiConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-[Poppins] text-gray-800">
                    Simpan nilai sekarang?
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 font-[Roboto]">
                    Apakah Anda sudah ingin menyimpan nilai?
                  </p>
                  <p className="mt-1 text-xs text-gray-500 font-[Roboto]">
                    {nilaiMode === "sementara" 
                        ? "Nilai akan disimpan sebagai draft sementara." 
                        : "Nilai akan dikunci sebagai nilai akhir."}
                  </p>
                </div>
                <button
                  onClick={() => setShowSaveNilaiConfirm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowSaveNilaiConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-[Roboto] text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmSaveNilai}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-[Roboto] text-white hover:bg-blue-700"
                >
                  Simpan nilai
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Keputusan Sidang (Khusus Ketua) */}
      <AnimatePresence>
        {showKeputusanSidang && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowKeputusanSidang(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-800 font-[Poppins]">
                  Kelulusan & Kehadiran Dosen
                </h2>
                <button
                  onClick={() => setShowKeputusanSidang(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <p className="text-sm text-gray-600 font-[Roboto]">
                  Tentukan hasil akhir sidang dan verifikasi kehadiran seluruh dosen penguji/pembimbing.
                </p>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setHasilSidang("Diterima")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        hasilSidang === "Diterima"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            hasilSidang === "Diterima"
                              ? "border-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {hasilSidang === "Diterima" && (
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">
                          Diterima
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500 font-[Roboto]">
                        Lulus (Sempurna/Tanpa Revisi).
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setHasilSidang("Diterima dengan revisi minor")
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        hasilSidang === "Diterima dengan revisi minor"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            hasilSidang === "Diterima dengan revisi minor"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {hasilSidang === "Diterima dengan revisi minor" && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">
                          Revisi Minor
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500 font-[Roboto]">
                        Revisi ringan.
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setHasilSidang("Diterima dengan revisi mayor")
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        hasilSidang === "Diterima dengan revisi mayor"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-200 hover:border-yellow-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            hasilSidang === "Diterima dengan revisi mayor"
                              ? "border-yellow-500"
                              : "border-gray-300"
                          }`}
                        >
                          {hasilSidang === "Diterima dengan revisi mayor" && (
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">
                          Revisi Mayor
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500 font-[Roboto]">
                        Revisi substansial.
                      </p>
                    </button>

                    <button
                      onClick={() => setHasilSidang("Ditolak")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        hasilSidang === "Ditolak"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            hasilSidang === "Ditolak"
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {hasilSidang === "Ditolak" && (
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </div>
                        <span className="font-[Roboto] text-sm text-gray-700">
                          Tidak Lulus
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500 font-[Roboto]">
                        Mengulang sidang.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-[Roboto]">
                    Status Kehadiran Sidang
                  </p>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                    Pastikan Penguji 1, Penguji 2, dan Pembimbing 1 hadir.
                  </p>
                  <select
                    value={kehadiran}
                    onChange={(e) =>
                      setKehadiran(
                        e.target.value as
                          | "Hadir"
                          | "Tidak Hadir"
                          | "Izin / Sakit"
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Roboto] text-sm"
                  >
                    <option value="Hadir">Lengkap (Semua Dosen Hadir)</option>
                    <option value="Tidak Hadir">Tidak Lengkap</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowKeputusanSidang(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-[Roboto] text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSimpanKeputusan}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm"
                >
                  Simpan Keputusan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}