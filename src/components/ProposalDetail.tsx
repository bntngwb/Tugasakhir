import { ArrowLeft, BookOpen, FileText, User, Tag, Calendar } from "lucide-react";

interface Proposal {
  id: number;
  title: string;
  category: string;
  grouped: string;
  abstract: string;
  keywords: string;
  supervisor1: string;
  supervisor2: string;
  file: File | null;
  fileName: string;
  laboratory: string;
  scheduleDate: string;
  scheduleTime: string;
  status: string;
  isDraft: boolean;
  missingFields?: string[];
  stage: "proposal" | "final";

  supervisor1Approval?: "pending" | "approved" | "rejected";
  supervisor2Approval?: "pending" | "approved" | "rejected";
  adminApproval?: "pending" | "approved" | "rejected";
  supervisor1ApprovalDate?: string;
  supervisor2ApprovalDate?: string;
  adminApprovalDate?: string;
  approvalDeadline?: string;
}

interface ProposalDetailProps {
  proposal: Proposal;
  onBack: () => void;
}

export function ProposalDetail({ proposal, onBack }: ProposalDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Menunggu Persetujuan":
        return "bg-amber-100 text-amber-700";
      case "Siap Daftar Sidang":
      case "Siap Daftar Sidang Akhir":
      case "Tugas Akhir Telah Selesai":
        return "bg-green-100 text-green-700";
      case "Tugas Akhir - Dalam Pengerjaan":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const stageLabel =
    proposal.stage === "proposal" ? "Tahap Proposal" : "Tahap Tugas Akhir";

  const stageColor =
    proposal.stage === "proposal"
      ? "bg-purple-100 text-purple-700"
      : "bg-indigo-100 text-indigo-700";

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-[Roboto] text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Tugas Akhir
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <h1 className="text-gray-800 font-[Poppins] text-[20px] leading-snug">
                  {proposal.title || "Usulan Tanpa Judul"}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-[Roboto] ${getStatusColor(
                      proposal.status
                    )}`}
                  >
                    {proposal.status}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-[Roboto] ${stageColor}`}
                  >
                    {stageLabel}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-[Roboto]">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {proposal.category || "-"}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                  {proposal.laboratory || "Laboratorium"}
                </span>
                {proposal.grouped && (
                  <>
                    <span>•</span>
                    <span>Kelompok: {proposal.grouped}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Detail Proposal */}
          <div className="lg:col-span-2 space-y-5">
            {/* Abstrak */}
            <section className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-sm font-[Poppins] text-gray-800 mb-2">
                Abstrak
              </h2>
              <p className="text-sm text-gray-700 font-[Roboto] whitespace-pre-line">
                {proposal.abstract || "-"}
              </p>
            </section>

            {/* Keywords + File */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <div>
                <h2 className="text-sm font-[Poppins] text-gray-800 mb-1">
                  Kata Kunci
                </h2>
                <p className="text-sm text-gray-700 font-[Roboto]">
                  {proposal.keywords || "-"}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-[Poppins] text-gray-800 mb-1">
                  Berkas Proposal
                </h2>
                {proposal.fileName ? (
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-[Roboto]">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{proposal.fileName}</span>
                    <span className="text-xs text-gray-400">
                      (dummy – untuk prototype, belum ada download)
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-[Roboto]">
                    Belum ada berkas terunggah
                  </p>
                )}
              </div>
            </section>

            {/* Jadwal (kalau sudah diisi) */}
            {(proposal.scheduleDate || proposal.scheduleTime) && (
              <section className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-sm font-[Poppins] text-gray-800 mb-2">
                  Informasi Jadwal (Jika Sudah Ditentukan)
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm font-[Roboto] text-gray-700">
                  {proposal.scheduleDate && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {proposal.scheduleDate}
                    </span>
                  )}
                  {proposal.scheduleTime && (
                    <span className="flex items-center gap-2">
                      ⏰ {proposal.scheduleTime}
                    </span>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right: Persetujuan dan meta */}
          <div className="space-y-5">
            {/* Info Pembimbing */}
            <section className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-sm font-[Poppins] text-gray-800 mb-3">
                Dosen Pembimbing
              </h2>
              <div className="space-y-2 text-sm font-[Roboto] text-gray-700">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Pembimbing 1</p>
                    <p>{proposal.supervisor1 || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Pembimbing 2</p>
                    <p>{proposal.supervisor2 || "-"}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Status Persetujuan */}
            <section className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-sm font-[Poppins] text-gray-800 mb-3">
                Status Persetujuan
              </h2>
              <div className="space-y-3 text-xs font-[Roboto] text-gray-700">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">Pembimbing 1</p>
                    <p className="text-gray-500">
                      {proposal.supervisor1 || "Dosen Pembimbing 1"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{proposal.supervisor1Approval || "pending"}</p>
                    {proposal.supervisor1ApprovalDate && (
                      <p className="text-gray-400">
                        {proposal.supervisor1ApprovalDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">Pembimbing 2</p>
                    <p className="text-gray-500">
                      {proposal.supervisor2 || "Dosen Pembimbing 2"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{proposal.supervisor2Approval || "pending"}</p>
                    {proposal.supervisor2ApprovalDate && (
                      <p className="text-gray-400">
                        {proposal.supervisor2ApprovalDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-gray-500">Administrator Prodi</p>
                  </div>
                  <div className="text-right">
                    <p>{proposal.adminApproval || "pending"}</p>
                    {proposal.adminApprovalDate && (
                      <p className="text-gray-400">
                        {proposal.adminApprovalDate}
                      </p>
                    )}
                  </div>
                </div>

                {proposal.approvalDeadline && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-[11px] text-amber-800">
                      Deadline persetujuan:{" "}
                      <span className="font-semibold">
                        {proposal.approvalDeadline}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>
    </main>
  );
}
