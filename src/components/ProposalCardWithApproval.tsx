import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  AlertCircle,
  User,
  Clock,
  MessageSquare,
  X,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface BimbinganEntry {
  id: number;
  ke: number;
  pembimbing: "Pembimbing 1" | "Pembimbing 2";
  beritaAcara: string;
  waktu: string; // ISO atau string biasa
  status: "Menunggu" | "Disetujui";
}

interface Proposal {
  id: number;
  title: string;
  category: string;
  supervisor1: string;
  supervisor2: string;
  laboratory: string;
  status: string;
  isDraft: boolean;
  missingFields?: string[];

  // Tahap: proposal vs tugas akhir (final)
  stage: "proposal" | "final";

  // Approval fields
  supervisor1Approval?: "pending" | "approved" | "rejected";
  supervisor2Approval?: "pending" | "approved" | "rejected";
  adminApproval?: "pending" | "approved" | "rejected";
  supervisor1ApprovalDate?: string;
  supervisor2ApprovalDate?: string;
  adminApprovalDate?: string;
  approvalDeadline?: string;

  // Sumber data bimbingan
  bimbinganLog?: BimbinganEntry[];
  // optional, memudahkan komponen lain jika ingin membaca jumlah approved
  totalBimbinganApproved?: number;
}

interface ProposalCardWithApprovalProps {
  proposal: Proposal;
  onEditProposal: (proposal: Proposal) => void;
  onUpdateProposal?: (proposalId: number, updates: Partial<Proposal>) => void;
}

export function ProposalCardWithApproval({
  proposal,
  onEditProposal,
  onUpdateProposal,
}: ProposalCardWithApprovalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Modal Bimbingan
  const [isBimbinganModalOpen, setIsBimbinganModalOpen] = useState(false);
  const [newPembimbing, setNewPembimbing] = useState<
    "Pembimbing 1" | "Pembimbing 2"
  >("Pembimbing 1");
  const [newBeritaAcara, setNewBeritaAcara] = useState("");

  const bimbinganLog = proposal.bimbinganLog || [];
  const approvedBimbinganCount = bimbinganLog.filter(
    (b) => b.status === "Disetujui"
  ).length;

  // Hitung waktu tersisa sampai deadline approval
  useEffect(() => {
    if (proposal.approvalDeadline && proposal.status === "Menunggu Persetujuan") {
      const calculateTimeLeft = () => {
        const deadline = parseIndonesianDate(proposal.approvalDeadline!);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        return Math.max(0, Math.floor(diff / 1000)); // seconds
      };

      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [proposal.approvalDeadline, proposal.status]);

  const parseIndonesianDate = (dateStr: string): Date => {
    const months: { [key: string]: number } = {
      Januari: 0,
      Februari: 1,
      Maret: 2,
      April: 3,
      Mei: 4,
      Juni: 5,
      Juli: 6,
      Agustus: 7,
      September: 8,
      Oktober: 9,
      November: 10,
      Desember: 11,
    };

    const parts = dateStr.split(" ");
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      return new Date(year, month, day, 23, 59, 59);
    }
    return new Date();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const formatDateTime = (dateTimeStr: string): string => {
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return dateTimeStr;
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Menunggu Persetujuan":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Siap Daftar Sidang":
        return "bg-green-50 text-green-700 border-green-200";
      case "Siap Daftar Sidang Akhir":
        return "bg-green-50 text-green-700 border-green-200";
      case "Tugas Akhir - Dalam Pengerjaan":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // PROTO approve P1 / P2 (simulasi di sisi mahasiswa)
  const handleProtoApprove = (role: "supervisor1" | "supervisor2") => {
    if (!onUpdateProposal) return;

    const today = new Date();
    const updates: Partial<Proposal> = {};

    if (role === "supervisor1") {
      updates.supervisor1Approval = "approved";
      updates.supervisor1ApprovalDate = today.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      toast.success("Pembimbing 1 menyetujui usulan (PROTO)");
    } else if (role === "supervisor2") {
      updates.supervisor2Approval = "approved";
      updates.supervisor2ApprovalDate = today.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      toast.success("Pembimbing 2 menyetujui usulan (PROTO)");
    }

    const updatedProposal = { ...proposal, ...updates };
    const allApproved =
      updatedProposal.supervisor1Approval === "approved" &&
      updatedProposal.supervisor2Approval === "approved";

    if (allApproved) {
      updates.status =
        proposal.stage === "final"
          ? "Siap Daftar Sidang Akhir"
          : "Siap Daftar Sidang";

      toast.success(
        proposal.stage === "final"
          ? "Semua persetujuan lengkap! Tugas akhir siap didaftarkan untuk sidang akhir."
          : "Semua persetujuan lengkap! Siap didaftarkan untuk sidang."
      );
    }

    onUpdateProposal(proposal.id, updates);
  };

  // TAMBAH BIMBINGAN BARU (mahasiswa mengajukan bimbingan)
  const handleAddBimbingan = () => {
    if (!onUpdateProposal) {
      toast.error("Fungsi update proposal belum tersedia");
      return;
    }

    const trimmed = newBeritaAcara.trim();
    if (!trimmed) {
      toast.error("Berita acara tidak boleh kosong");
      return;
    }

    const currentLog = proposal.bimbinganLog || [];
    const newEntry: BimbinganEntry = {
      id: Date.now(),
      ke: currentLog.length + 1,
      pembimbing: newPembimbing,
      beritaAcara: trimmed,
      waktu: new Date().toISOString(),
      status: "Menunggu", // tetap menunggu approval dosen, tapi tanpa fitur approve di sisi mahasiswa
    };

    const updatedLog = [...currentLog, newEntry];
    const approvedCount = updatedLog.filter(
      (b) => b.status === "Disetujui"
    ).length;

    onUpdateProposal(proposal.id, {
      bimbinganLog: updatedLog,
      totalBimbinganApproved: approvedCount,
    });

    setNewBeritaAcara("");
    toast.success("Bimbingan baru berhasil diajukan");
  };

  const allApproved =
    proposal.supervisor1Approval === "approved" &&
    proposal.supervisor2Approval === "approved";

  const approvalCount = [
    proposal.supervisor1Approval === "approved",
    proposal.supervisor2Approval === "approved",
  ].filter(Boolean).length;

  return (
    <div className="mb-3">
      {/* Warning untuk draft belum lengkap */}
      {proposal.isDraft &&
        proposal.missingFields &&
        proposal.missingFields.length > 0 && (
          <div className="bg-red-50/50 border border-red-200 rounded-lg p-3 mb-2 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-[Roboto] text-red-800 mb-1">
                Draft belum lengkap. Mohon lengkapi:
              </p>
              <ul className="text-xs font-[Roboto] text-red-700 list-disc list-inside">
                {proposal.missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div
          onClick={() => {
            if (proposal.status === "Menunggu Persetujuan") {
              setIsExpanded(!isExpanded);
            } else {
              onEditProposal(proposal);
            }
          }}
          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-start justify-between gap-3">
            {/* Left: icon + info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-[Poppins] text-gray-900 mb-1 leading-snug">
                  {proposal.title || "Usulan Tanpa Judul"}
                </h3>
                <p className="text-xs text-gray-600 font-[Roboto]">
                  Laboratorium: {proposal.laboratory || "-"}
                </p>
                <p className="text-xs text-gray-600 font-[Roboto]">
                  Pembimbing 1: {proposal.supervisor1 || "-"}
                </p>
                <p className="text-xs text-gray-600 font-[Roboto] mb-2">
                  Pembimbing 2: {proposal.supervisor2 || "-"}
                </p>

                {/* Button tambah bimbingan + total */}
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBimbinganModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-[Roboto] text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Tambah bimbingan</span>
                  </button>
                  <span className="text-[10px] text-gray-500 font-[Roboto]">
                    Total bimbingan disetujui:{" "}
                    <span className="font-semibold">
                      {approvedBimbinganCount}x
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: stage (Tugas Akhir) + status sebagai badge seukuran button */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-[Roboto] border ${getStatusColor(
                  proposal.status
                )}`}
              >
                {proposal.status}
              </span>

              {proposal.status === "Menunggu Persetujuan" ? (
                isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform" />
                )
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
              )}
            </div>
          </div>

          {/* Indikator progress approval */}
          {proposal.status === "Menunggu Persetujuan" && !allApproved && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center -space-x-1">
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-[Poppins] ${
                    proposal.supervisor1Approval === "approved"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-white"
                  }`}
                >
                  {proposal.supervisor1Approval === "approved" ? "✓" : "P1"}
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-[Poppins] ${
                    proposal.supervisor2Approval === "approved"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-white"
                  }`}
                >
                  {proposal.supervisor2Approval === "approved" ? "✓" : "P2"}
                </div>
              </div>
              <span className="text-xs text-gray-600 font-[Roboto]">
                {approvalCount}/2 persetujuan pembimbing
              </span>
            </div>
          )}
        </div>

        {/* Expanded Approval Section */}
        {isExpanded && proposal.status === "Menunggu Persetujuan" && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <h4 className="text-gray-800 font-[Poppins] mb-2">
              Status Persetujuan
            </h4>
            <p className="text-sm text-gray-600 font-[Roboto] mb-4">
              Usulan tugas akhir Anda memerlukan persetujuan dari Pembimbing 1
              dan Pembimbing 2.
            </p>

            {/* Deadline Info (24 jam diatur dari nilai approvalDeadline yang dikirim parent) */}
            {proposal.approvalDeadline && timeLeft > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-[Poppins] text-red-900 font-semibold">
                    Deadline Persetujuan
                  </p>
                  <p className="text-sm text-red-800 font-[Roboto]">
                    Persetujuan harus selesai sebelum{" "}
                    <strong>{proposal.approvalDeadline}</strong>
                  </p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-red-300">
                  <div className="font-mono text-lg font-bold text-red-900">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-xs text-red-600 font-[Roboto] text-center">
                    {Math.floor(timeLeft / 3600)}h tersisa
                  </p>
                </div>
              </div>
            )}

            {/* 2 Kolom Approval (P1 & P2) */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Pembimbing 1 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-[Poppins] text-sm text-gray-800 mb-1">
                    Pembimbing 1
                  </h5>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">
                    {proposal.supervisor1 || "Dosen Pembimbing 1"}
                  </p>

                  {proposal.supervisor1Approval === "approved" ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-green-700 font-[Roboto]">
                        Disetujui
                      </p>
                      {proposal.supervisor1ApprovalDate && (
                        <p className="text-xs text-gray-500 font-[Roboto] mt-1">
                          {proposal.supervisor1ApprovalDate}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-8 h-8 text-amber-600" />
                      </div>
                      <p className="text-xs text-amber-700 font-[Roboto] mb-2">
                        Menunggu
                      </p>
                      <button
                        onClick={() => handleProtoApprove("supervisor1")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-[Inter] transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="text-[10px] bg-blue-700 px-1.5 py-0.5 rounded">
                          PROTO
                        </span>
                        Simulasi Approve
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Pembimbing 2 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-[Poppins] text-sm text-gray-800 mb-1">
                    Pembimbing 2
                  </h5>
                </div>
                <p className="text-xs text-gray-600 font-[Roboto] mb-3 text-center">
                  {proposal.supervisor2 || "Dosen Pembimbing 2"}
                </p>

                {proposal.supervisor2Approval === "approved" ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-green-700 font-[Roboto] text-center">
                      Disetujui
                    </p>
                    {proposal.supervisor2ApprovalDate && (
                      <p className="text-xs text-gray-500 font-[Roboto] mt-1 text-center">
                        {proposal.supervisor2ApprovalDate}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-8 h-8 text-amber-600" />
                    </div>
                    <p className="text-xs text-amber-700 font-[Roboto] mb-2 text-center">
                      Menunggu
                    </p>
                    <button
                      onClick={() => handleProtoApprove("supervisor2")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-[Inter] transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="text-[10px] bg-blue-700 px-1.5 py-0.5 rounded">
                        PROTO
                      </span>
                      Simulasi Approve
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-[Poppins] text-gray-700">
                  Progress Persetujuan
                </p>
                <p className="font-[Poppins] text-gray-800">{approvalCount}/2</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-500"
                  style={{ width: `${(approvalCount / 2) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 font-[Roboto] mt-2">
                {approvalCount === 0 &&
                  "Menunggu persetujuan dari kedua pembimbing"}
                {approvalCount === 1 &&
                  "1 dari 2 pembimbing telah menyetujui"}
                {approvalCount === 2 && "Semua pembimbing telah menyetujui"}
              </p>
            </div>

            {/* Edit / Detail Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditProposal(proposal);
              }}
              className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-[Inter] transition-colors"
            >
              {proposal.isDraft ? "Edit Tugas Akhir" : "Lihat Detail Tugas Akhir"}
            </button>
          </div>
        )}
      </div>

      {/* Modal Tambah & Riwayat Bimbingan (mahasiswa) */}
      {isBimbinganModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsBimbinganModalOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-height-[90vh] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl text-gray-800 font-[Poppins]">
                      Bimbingan Tugas Akhir
                    </h2>
                    <p className="text-sm text-gray-600 font-[Roboto]">
                      Riwayat bimbingan Tugas Akhir
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBimbinganModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* List Bimbingan */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                {bimbinganLog.length > 0 ? (
                  <div className="space-y-3">
                    {bimbinganLog
                      .slice()
                      .sort((a, b) => a.ke - b.ke)
                      .map((log) => (
                        <div
                          key={log.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-[Roboto] font-semibold text-gray-800">
                                Bimbingan ke-{log.ke}
                              </span>
                              <span className="text-[10px] text-gray-500 font-[Roboto]">
                                {log.pembimbing}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-[Roboto] border ${
                                  log.status === "Disetujui"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-orange-50 text-orange-700 border-orange-200"
                                }`}
                              >
                                {log.status === "Disetujui"
                                  ? "Disetujui dosen"
                                  : "Dikirim ke dosen"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 font-[Roboto] mb-1">
                              {log.beritaAcara}
                            </p>
                            <p className="text-[10px] text-gray-500 font-[Roboto] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDateTime(log.waktu)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-[Roboto]">
                      Belum ada riwayat bimbingan. Tambahkan bimbingan baru
                      melalui form di bawah.
                    </p>
                  </div>
                )}
              </div>

              {/* Form Tambah Bimbingan Baru */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-gray-800 font-[Poppins] mb-3">
                  Tambah Bimbingan Baru
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="md:col-span-1">
                    <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                      Pembimbing
                    </p>
                    <select
                      value={newPembimbing}
                      onChange={(e) =>
                        setNewPembimbing(
                          e.target.value as "Pembimbing 1" | "Pembimbing 2"
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-[Roboto] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pembimbing 1">Pembimbing 1</option>
                      <option value="Pembimbing 2">Pembimbing 2</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                      Berita acara
                    </p>
                    <textarea
                      value={newBeritaAcara}
                      onChange={(e) => setNewBeritaAcara(e.target.value)}
                      rows={3}
                      placeholder="Tuliskan ringkasan hasil bimbingan, kesepakatan, atau tugas yang diberikan..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-[Roboto] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 font-[Roboto] mb-3">
                  Tanggal dan waktu akan tercatat otomatis saat bimbingan
                  disimpan.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddBimbingan}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-[Roboto] flex items-center gap-2"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Simpan Bimbingan
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => setIsBimbinganModalOpen(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-[Roboto]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
