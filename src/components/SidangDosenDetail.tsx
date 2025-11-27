"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  BookOpen,
  MessageSquare,
  AlertCircle,
  Paperclip,
  Plus,
  X,
  CheckCircle2,
} from "lucide-react";
import type { SidangItem } from "./SidangDosen";

type StatusSidang = SidangItem["status"];

interface SidangDosenDetailProps {
  sidang: SidangItem;
  onBack: () => void;
  mode?: "sidang" | "ajuan";
  onStatusChange?: (id: SidangItem["id"], status: StatusSidang) => void;
}

interface RevisionItem {
  id: number;
  note: string;
  fileName?: string;
  createdAt: string;
  examiner?: string; // nama penguji / pembimbing
}

interface ScoreCriterion {
  id: number;
  label: string;
  weight: number; // 0-1
  indicators: string[];
}

const SCORE_CRITERIA: ScoreCriterion[] = [
  {
    id: 1,
    label:
      "Kualitas Naskah (1) Kejelasan latar belakang penelitian, rumusan masalah dan tujuan penelitian",
    weight: 0.25,
    indicators: [
      "Sangat jelas menjelaskan konteks dan urgensi penelitian",
      "Rumusan masalah spesifik dan terukur",
      "Tujuan penelitian konsisten dengan rumusan masalah",
    ],
  },
  {
    id: 2,
    label:
      "Kualitas Naskah (2) Ketepatan pemilihan dasar teori dan metode penelitian yang relevan",
    weight: 0.25,
    indicators: [
      "Landasan teori mutakhir dan relevan",
      "Metode penelitian tepat untuk menjawab rumusan masalah",
      "Alur metodologi dijelaskan secara runtut",
    ],
  },
  {
    id: 3,
    label:
      "Kualitas Naskah (3) Ketepatan teknik pengumpulan data dan analisis yang digunakan",
    weight: 0.25,
    indicators: [
      "Teknik pengumpulan data sesuai jenis penelitian",
      "Instrumen penelitian (kuesioner/panduan wawancara) jelas",
      "Prosedur analisis data dijelaskan dengan baik",
    ],
  },
  {
    id: 4,
    label:
      "Kualitas Presentasi (4) Kemampuan menyampaikan materi, menjawab pertanyaan, dan penguasaan konsep",
    weight: 0.25,
    indicators: [
      "Penyampaian materi runtut dan mudah dipahami",
      "Jawaban terhadap pertanyaan penguji jelas dan meyakinkan",
      "Menunjukkan penguasaan konsep dan metodologi penelitian",
    ],
  },
];

const getGradeIndex = (score: number): string => {
  if (score >= 86) return "A";
  if (score >= 76) return "B";
  if (score >= 66) return "C";
  return "D";
};

export function SidangDosenDetail({
  sidang,
  onBack,
  mode = "sidang",
  onStatusChange,
}: SidangDosenDetailProps) {
  /**
   * MODE AJUAN SIDANG
   * Hanya menampilkan Header + Topik Tugas Akhir
   */
  if (mode === "ajuan") {
    const proposalFileName = `Proposal_${sidang.nrp}.pdf`;

    return (
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto">
          {/* Tombol Kembali */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-[Roboto] text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ajuan Sidang
          </button>

          {/* Header Ajuan */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-gray-800 font-[Poppins] text-[20px] mb-1">
                    {sidang.jenisSidang} – {sidang.nama}
                  </h1>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    NRP {sidang.nrp} • {sidang.jenjang} • {sidang.posisi}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-800 font-[Roboto]">
                <AlertCircle className="w-3 h-3" />
                <span>Menunggu persetujuan ajuan sidang.</span>
              </div>
            </div>
          </div>

          {/* Section Topik (versi ringkas untuk ajuan) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-800 font-[Poppins] text-[18px]">
                Topik Tugas Akhir
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  Judul
                </p>
                <p className="text-sm text-gray-800 font-[Roboto] uppercase">
                  {sidang.topicTitle ||
                    "Judul topik belum diisi. Gunakan data dummy untuk prototipe."}
                </p>
              </div>

              {sidang.topicCategory && (
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Kategori
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    {sidang.topicCategory}
                  </p>
                </div>
              )}

              {sidang.topicAbstract && (
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Abstrak
                  </p>
                  <p className="text-sm text-gray-700 font-[Roboto] leading-relaxed">
                    {sidang.topicAbstract}
                  </p>
                </div>
              )}

              {(sidang.supervisor1 || sidang.supervisor2) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sidang.supervisor1 && (
                    <div>
                      <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                        Dosen Pembimbing 1
                      </p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {sidang.supervisor1}
                      </p>
                    </div>
                  )}
                  {sidang.supervisor2 && sidang.supervisor2 !== "—" && (
                    <div>
                      <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                        Dosen Pembimbing 2
                      </p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {sidang.supervisor2}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  Berkas Proposal yang Dikumpulkan
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-[Roboto] text-gray-700"
                >
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span>{proposalFileName}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2021-2025 Institut Teknologi Sepuluh Nopember
            </p>
          </footer>
        </div>
      </main>
    );
  }

  /**
   * MODE SIDANG PENUH (default)
   */

  const getStatusColor = (status: StatusSidang) => {
    switch (status) {
      case "Perlu Dinilai":
        return "bg-yellow-100 text-yellow-700";
      case "Revisi":
        return "bg-red-100 text-red-700";
      case "Selesai":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const canAddRevision = sidang.status === "Perlu Dinilai";
  const canGiveScore =
    sidang.status === "Perlu Dinilai" || sidang.status === "Revisi";
  const canPermanentSave = sidang.status === "Revisi";

  // kalau tidak ada revisionDeadline, pakai dummy agar tidak jadi "—"
  const revisionDeadlineLabel =
    sidang.revisionDeadline || "20 Januari 2026";

  // opsi penguji/pembimbing untuk di-select di form revisi
  const examinerOptions = useMemo(() => {
    const opts: string[] = [];
    if (sidang.examiner1) opts.push(sidang.examiner1);
    if (sidang.examiner2 && sidang.examiner2 !== "—") opts.push(sidang.examiner2);
    if (sidang.examiner3 && sidang.examiner3 !== "—") opts.push(sidang.examiner3);
    if (sidang.supervisor1) opts.push(`Pembimbing - ${sidang.supervisor1}`);
    if (sidang.supervisor2 && sidang.supervisor2 !== "—") {
      opts.push(`Pembimbing - ${sidang.supervisor2}`);
    }
    if (opts.length === 0) opts.push("Dosen Penguji / Pembimbing");
    return opts;
  }, [
    sidang.examiner1,
    sidang.examiner2,
    sidang.examiner3,
    sidang.supervisor1,
    sidang.supervisor2,
  ]);

  // Inisialisasi revisi awal (dummy)
  const [revisions, setRevisions] = useState<RevisionItem[]>(() => {
    const initial: RevisionItem[] = [];
    if (sidang.revisionNotes) {
      initial.push({
        id: 1,
        note: sidang.revisionNotes,
        createdAt: revisionDeadlineLabel,
        examiner: examinerOptions[0],
      });
    }
    return initial;
  });

  const [isAddingRevision, setIsAddingRevision] = useState(false);
  const [newRevisionNote, setNewRevisionNote] = useState("");
  const [newRevisionFileName, setNewRevisionFileName] =
    useState<string | null>(null);
  const [newRevisionExaminer, setNewRevisionExaminer] = useState<string>(
    examinerOptions[0]
  );
  const [isRevisionApproved, setIsRevisionApproved] = useState(false);

  // nilai akhir & indeks huruf
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalGrade, setFinalGrade] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setNewRevisionFileName(file ? file.name : null);
  };

  const handleSaveRevision = () => {
    if (!newRevisionNote.trim()) return;

    const newItem: RevisionItem = {
      id: revisions.length + 1,
      note: newRevisionNote.trim(),
      fileName: newRevisionFileName || undefined,
      createdAt: new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      examiner: newRevisionExaminer,
    };

    setRevisions((prev) => [...prev, newItem]);
    setNewRevisionNote("");
    setNewRevisionFileName(null);
    setIsAddingRevision(false);
  };

  const shouldShowRevisionSection =
    sidang.status === "Perlu Dinilai" ||
    sidang.status === "Revisi" ||
    revisions.length > 0;

  // Group revisi per penguji/pembimbing
  const groupedRevisions = useMemo(() => {
    const map = new Map<string, RevisionItem[]>();
    revisions.forEach((rev) => {
      const key = rev.examiner || "Dosen Penguji / Pembimbing";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(rev);
    });
    return Array.from(map.entries());
  }, [revisions]);

  // State modal penilaian
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scores, setScores] = useState<number[]>(SCORE_CRITERIA.map(() => 0));
  const [openIndicatorIndex, setOpenIndicatorIndex] = useState<number | null>(
    null
  );
  const [scoreSaved, setScoreSaved] = useState(false);

  const isAllScoreFilled = scores.every((s) => s > 0);
  const isAllScoreValid = scores.every((s) => s >= 0 && s <= 100);
  const isSaveEnabled = isAllScoreFilled && isAllScoreValid;

  // total nilai akhir (x bobot)
  const totalWeightedScore = useMemo(() => {
    return scores.reduce((acc, val, idx) => {
      const w = SCORE_CRITERIA[idx].weight;
      return acc + val * w;
    }, 0);
  }, [scores]);

  const handleScoreChange = (idx: number, value: string) => {
    let num = Number(value);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 100) num = 100;

    setScores((prev) => {
      const copy = [...prev];
      copy[idx] = num;
      return copy;
    });
  };

  // State modal simpan permanen
  const [isPermanentModalOpen, setIsPermanentModalOpen] = useState(false);
  const [permanentChecked, setPermanentChecked] = useState(false);
  const [permanentSaved, setPermanentSaved] = useState(false);

  // Toast sederhana
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSaveScore = () => {
    if (!isSaveEnabled) return;

    const score = totalWeightedScore;
    const grade = getGradeIndex(score);

    setFinalScore(score);
    setFinalGrade(grade);
    setScoreSaved(true);

    setIsScoreModalOpen(false);
    showToast(
      `Penilaian sidang disimpan. Nilai akhir ${score.toFixed(2)} (${grade}).`
    );
  };

  const handleConfirmPermanent = () => {
    if (!permanentChecked) return;

    // ubah status dari Revisi menjadi Selesai di parent
    if (sidang.status === "Revisi") {
      onStatusChange?.(sidang.id, "Selesai");
    }

    setPermanentSaved(true);
    setIsPermanentModalOpen(false);
    showToast(
      "Nilai sidang telah disimpan permanen dan status diubah menjadi Selesai."
    );
  };

  // Dummy file proposal & file revisi mahasiswa
  const proposalFileName = `Proposal_${sidang.nrp}.pdf`;
  const studentRevisionFileName = `Revisi_${sidang.nrp}.pdf`;

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-4xl mx-auto">
        {/* Tombol Kembali */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-[Roboto] text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Sidang
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-gray-800 font-[Poppins] text-[20px] mb-1">
                  {sidang.jenisSidang} – {sidang.nama}
                </h1>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  NRP {sidang.nrp} • {sidang.jenjang} • {sidang.posisi}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-[Roboto] ${getStatusColor(
                    sidang.status
                  )}`}
                >
                  {sidang.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              {/* Nilai akhir (jika sudah disimpan) */}
              {finalScore !== null && finalGrade && (
                <div className="text-right mb-1">
                  <p className="text-[11px] text-gray-400 font-[Roboto] uppercase tracking-wide">
                    Nilai Akhir
                  </p>
                  <p className="text-sm font-[Poppins] text-gray-800">
                    {finalScore.toFixed(2)} ({finalGrade})
                  </p>
                </div>
              )}

              {/* Chip batas (di header) */}
              {sidang.status === "Perlu Dinilai" && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 font-[Roboto]">
                  <AlertCircle className="w-3 h-3" />
                  <span>
                    Batas penambahan revisi hingga {revisionDeadlineLabel}
                  </span>
                </div>
              )}
              {sidang.status === "Revisi" && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 font-[Roboto]">
                  <AlertCircle className="w-3 h-3" />
                  <span>
                    Batas pengumpulan revisi hingga {revisionDeadlineLabel}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 justify-end">
                {canGiveScore && (
                  <button
                    type="button"
                    onClick={() => {
                      setScoreSaved(false);
                      setIsScoreModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500 text-white text-xs font-[Roboto] hover:bg-blue-600"
                  >
                    Beri Nilai
                  </button>
                )}

                {canPermanentSave && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPermanentModalOpen(true);
                      setPermanentChecked(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-[Roboto] hover:bg-green-600"
                  >
                    Simpan Permanen
                  </button>
                )}
              </div>
            </div>
          </div>

          {permanentSaved && (
            <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-700 font}[Roboto]">
                Nilai sidang telah disimpan permanen. Perubahan lebih lanjut
                tidak dapat dilakukan melalui sistem ini.
              </p>
            </div>
          )}
        </div>

        {/* Section Topik */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-[Poppins] text-[18px]">
              Topik Tugas Akhir
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 font-[Roboto] mb-1">Judul</p>
              <p className="text-sm text-gray-800 font-[Roboto] uppercase">
                {sidang.topicTitle ||
                  "Judul topik belum diisi. Gunakan data dummy untuk prototipe."}
              </p>
            </div>

            {sidang.topicCategory && (
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  Kategori
                </p>
                <p className="text-sm text-gray-800 font-[Roboto]">
                  {sidang.topicCategory}
                </p>
              </div>
            )}

            {sidang.topicAbstract && (
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  Abstrak
                </p>
                <p className="text-sm text-gray-700 font-[Roboto] leading-relaxed">
                  {sidang.topicAbstract}
                </p>
              </div>
            )}

            {(sidang.supervisor1 || sidang.supervisor2) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sidang.supervisor1 && (
                  <div>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                      Dosen Pembimbing 1
                    </p>
                    <p className="text-sm text-gray-800 font-[Roboto]">
                      {sidang.supervisor1}
                    </p>
                  </div>
                )}
                {sidang.supervisor2 && sidang.supervisor2 !== "—" && (
                  <div>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                      Dosen Pembimbing 2
                    </p>
                    <p className="text-sm text-gray-800 font-[Roboto]">
                      {sidang.supervisor2}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* File Proposal (Perlu Dinilai & Revisi) */}
            {(sidang.status === "Perlu Dinilai" ||
              sidang.status === "Revisi") && (
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  Berkas Proposal yang Dikumpulkan
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-[Roboto] text-gray-700"
                >
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span>{proposalFileName}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Informasi Sidang */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-[Poppins] text-[18px]">
              Informasi Sidang
            </h2>
          </div>

          {sidang.tanggalSidang ? (
            <div className="space-y-4">
              {/* Jenis & Jenjang */}
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Jenis / Jenjang
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    {sidang.jenisSidang} • {sidang.jenjang}
                  </p>
                </div>
              </div>

              {/* Posisi Dosen */}
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Posisi Dosen pada Sidang
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    {sidang.posisi}
                  </p>
                </div>
              </div>

              {/* Tanggal */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Tanggal
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    {sidang.tanggalSidang}
                  </p>
                </div>
              </div>

              {/* Waktu */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Waktu
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    {sidang.time || "-"}
                  </p>
                </div>
              </div>

              {/* Lokasi */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Lokasi
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    {sidang.location || "-"}
                  </p>
                </div>
              </div>

              {/* Dosen Penguji */}
              {(sidang.examiner1 ||
                sidang.examiner2 ||
                sidang.examiner3) && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                      Dosen Penguji
                    </p>
                    <div className="space-y-1">
                      {sidang.examiner1 && (
                        <p className="text-sm text-gray-800 font-[Roboto]">
                          1. {sidang.examiner1}
                        </p>
                      )}
                      {sidang.examiner2 && (
                        <p className="text-sm text-gray-800 font-[Roboto]">
                          2. {sidang.examiner2}
                        </p>
                      )}
                      {sidang.examiner3 && (
                        <p className="text-sm text-gray-800 font-[Roboto]">
                          3. {sidang.examiner3}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-yellow-900 font-[Roboto]">
                Informasi jadwal sidang belum ditentukan. Admin atau program
                studi akan mengisi tanggal, waktu, dan ruangan sidang.
              </p>
            </div>
          )}
        </div>

        {/* Section Revisi */}
        {shouldShowRevisionSection && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-800 font-[Poppins] text-[18px]">
                  Catatan Revisi
                </h2>
              </div>

              {canAddRevision && (
                <button
                  type="button"
                  onClick={() => setIsAddingRevision(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-[Roboto] hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Revisi
                </button>
              )}
            </div>

            {/* Card batas revisi di dalam section */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-800 font-[Roboto]">
                <AlertCircle className="w-3 h-3" />
                <span>
                  {sidang.status === "Perlu Dinilai"
                    ? "Batas penambahan revisi"
                    : "Deadline pengumpulan revisi"}{" "}
                  : <span className="font-semibold">{revisionDeadlineLabel}</span>
                </span>
              </div>
            </div>

            {/* File revisi mahasiswa + Approve (status Revisi) */}
            {sidang.status === "Revisi" && (
              <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                        Berkas Revisi Mahasiswa
                      </p>
                      <p className="text-sm text-gray-800 font-[Roboto]">
                        {studentRevisionFileName}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setIsRevisionApproved((prev) => !prev)
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-[Roboto] border transition-colors ${
                      isRevisionApproved
                        ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {isRevisionApproved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Revisi Disetujui</span>
                      </>
                    ) : (
                      <span>Approve Revisi</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Form Tambah Revisi (hanya jika status = Perlu Dinilai) */}
            {canAddRevision && isAddingRevision && (
              <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50/70">
                {/* Pilih penguji/pembimbing */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 font-[Roboto] mb-1">
                    Penguji / Pembimbing
                  </label>
                  <select
                    value={newRevisionExaminer}
                    onChange={(e) => setNewRevisionExaminer(e.target.value)}
                    className="w-full text-sm font-[Roboto] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {examinerOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-xs text-gray-600 font-[Roboto] mb-1">
                    Catatan Revisi
                  </label>
                  <textarea
                    value={newRevisionNote}
                    onChange={(e) => setNewRevisionNote(e.target.value)}
                    rows={3}
                    className="w-full text-sm font-[Roboto] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tuliskan poin-poin revisi yang perlu dikerjakan mahasiswa..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-600 font-[Roboto] mb-1">
                    Unggah Berkas Revisi (opsional)
                  </label>
                  <label className="inline-flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 text-xs font-[Roboto] text-gray-700">
                    <Paperclip className="w-4 h-4" />
                    <span>
                      {newRevisionFileName
                        ? `File: ${newRevisionFileName}`
                        : "Pilih berkas .pdf / .docx / .zip"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingRevision(false);
                      setNewRevisionNote("");
                      setNewRevisionFileName(null);
                    }}
                    className="px-3 py-1.5 rounded-full border border-gray-300 bg-white text-xs font-[Roboto] text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRevision}
                    className="px-3 py-1.5 rounded-full bg-blue-500 text-white text-xs font-[Roboto] hover:bg-blue-600"
                  >
                    Simpan Revisi
                  </button>
                </div>
              </div>
            )}

            {/* Daftar Revisi */}
            {groupedRevisions.length > 0 ? (
              <div className="space-y-4">
                {groupedRevisions.map(([examiner, items]) => (
                  <div
                    key={examiner}
                    className="border border-gray-200 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 font-[Roboto]">
                          Penguji / Pembimbing
                        </p>
                        <p className="text-sm text-gray-800 font-[Poppins]">
                          {examiner}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {items.map((rev) => (
                        <div
                          key={rev.id}
                          className="border border-gray-100 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-[Poppins] text-gray-600">
                              Revisi #{rev.id}
                            </span>
                            <span className="text-[11px] font-[Roboto] text-gray-400">
                              {rev.createdAt}
                            </span>
                          </div>
                          {rev.fileName && (
                            <div className="flex items-center gap-1 mb-2">
                              <Paperclip className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-600 font-[Roboto]">
                                {rev.fileName}
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-gray-800 font-[Roboto] whitespace-pre-line">
                            {rev.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !canAddRevision && (
                <p className="text-sm text-gray-500 font-[Roboto] italic">
                  Belum ada catatan revisi yang tercatat pada sistem.
                </p>
              )
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>

      {/* Modal Penilaian Sidang */}
      {canGiveScore && isScoreModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-[Poppins] text-gray-600 w-8">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-[Poppins] text-gray-600">
                        Kriteria Penilaian
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-[Poppins] text-gray-600 w-24">
                        Nilai
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-[Poppins] text-gray-600 w-16">
                        Bobot
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-[Poppins] text-gray-600 w-24">
                        Nilai x Bobot
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCORE_CRITERIA.map((crit, idx) => {
                      const weighted = scores[idx] * crit.weight;
                      const percent = crit.weight * 100;
                      const isOpen = openIndicatorIndex === idx;

                      return (
                        <tr
                          key={crit.id}
                          className="border-b border-gray-100 align-top"
                        >
                          <td className="px-4 py-3 text-xs text-gray-700 font-[Roboto] align-top">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 font-[Roboto]">
                            <p>{crit.label}</p>
                            <button
                              type="button"
                              onClick={() =>
                                setOpenIndicatorIndex(isOpen ? null : idx)
                              }
                              className="mt-1 text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              ↳ Lihat indikator
                            </button>
                            {isOpen && (
                              <ul className="mt-2 list-disc list-inside text-xs text-gray-600 space-y-1">
                                {crit.indicators.map((ind, i) => (
                                  <li key={i}>{ind}</li>
                                ))}
                              </ul>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={scores[idx]}
                              onChange={(e) =>
                                handleScoreChange(idx, e.target.value)
                              }
                              className="w-16 text-center text-sm font-[Roboto] border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-gray-700 font-[Roboto] align-top">
                            {percent}%
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-gray-700 font-[Roboto] align-top">
                            {weighted.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Total */}
                    <tr className="bg-gray-50">
                      <td></td>
                      <td className="px-4 py-3 text-right text-xs font-[Poppins] text-gray-700">
                        Total Nilai x Bobot
                      </td>
                      <td></td>
                      <td></td>
                      <td className="px-4 py-3 text-center text-sm font-[Poppins] text-gray-800">
                        {totalWeightedScore.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer modal */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsScoreModalOpen(false);
                  setScoreSaved(false);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-[Roboto] text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveScore}
                disabled={!isSaveEnabled}
                className={`px-4 py-2 rounded-lg text-sm font-[Roboto] ${
                  isSaveEnabled
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Simpan Permanen */}
      {canPermanentSave && isPermanentModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-[Poppins] text-gray-800">
                Simpan Nilai Permanen
              </h3>
              <button
                onClick={() => setIsPermanentModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-700 font-[Roboto]">
                Setelah nilai disimpan permanen, Anda tidak dapat lagi mengubah
                penilaian atau menambah catatan revisi melalui sistem ini.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-800 font-[Roboto]">
                  Pastikan seluruh nilai dan catatan revisi sudah sesuai
                  kesepakatan penguji sebelum melanjutkan.
                </p>
              </div>

              <label className="flex items-start gap-2 text-xs text-gray-700 font-[Roboto]">
                <input
                  type="checkbox"
                  checked={permanentChecked}
                  onChange={(e) => setPermanentChecked(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Saya yakin seluruh nilai dan keputusan sidang sudah final dan
                  siap disimpan secara permanen.
                </span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPermanentModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-[Roboto] text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!permanentChecked}
                onClick={handleConfirmPermanent}
                className={`px-4 py-2 rounded-lg text-sm font-[Roboto] ${
                  permanentChecked
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Simpan Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="font-[Roboto]">{toast.message}</span>
          </div>
        </div>
      )}
    </main>
  );
}
