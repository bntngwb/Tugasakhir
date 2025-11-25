import { ArrowLeft, Calendar, Clock, MapPin, User, FileText, BookOpen, Upload, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useState } from "react";

interface TakenHearing {
  id: number;
  hearingId: number;
  hearingName: string;
  hearingType: "Proposal" | "Final";
  proposalId: number;
  proposalTitle: string;
  status: "Menunggu Approval Sidang" | "Menunggu Jadwal Sidang" | "Menunggu Sidang" | "Sidang Selesai" | "Revisi" | "Menunggu Approval Revisi";
  
  // Approval sidang fields
  supervisor1Approval?: "pending" | "approved" | "rejected";
  supervisor2Approval?: "pending" | "approved" | "rejected";
  adminApproval?: "pending" | "approved" | "rejected";
  supervisor1ApprovalDate?: string;
  supervisor2ApprovalDate?: string;
  adminApprovalDate?: string;
  approvalDeadline?: string; // Deadline for hearing approval
  
  date?: string;
  time?: string;
  location?: string;
  onlineStatus?: "Online" | "Offline";
  examiner1?: string;
  examiner2?: string;
  examiner3?: string;
  examiner?: string;
  proposalCategory?: string;
  proposalAbstract?: string;
  supervisor1?: string;
  supervisor2?: string;
  
  // Revision approval fields
  examiner1RevisionApproval?: "pending" | "approved" | "rejected";
  examiner2RevisionApproval?: "pending" | "approved" | "rejected";
  examiner3RevisionApproval?: "pending" | "approved" | "rejected";
  examiner1RevisionApprovalDate?: string;
  examiner2RevisionApprovalDate?: string;
  examiner3RevisionApprovalDate?: string;
  revisionApprovalDeadline?: string; // Deadline for revision approval
  
  revisionDeadline?: string;
  revisionNotes?: string;
  revisionNotesExaminer1?: string; // Separate notes from each examiner
  revisionNotesExaminer2?: string;
  revisionNotesExaminer3?: string;
  revisionFile?: File | null;
  revisionFileName?: string;
}

interface MySidangDetailProps {
  hearing: TakenHearing;
  onBack: () => void;
  onCompleteProposalDefense?: (proposalId: number) => void;
  onCompleteFinalDefense?: (proposalId: number) => void;
  onUpdateHearingInfo?: (hearingId: number, info: Partial<TakenHearing>) => void;
  onFinishHearing?: (hearingId: number, notes: string, deadline: string) => void;
  onSubmitRevision?: (hearingId: number, file: File, fileName: string) => void;
}

export function MySidangDetail({
  hearing,
  onBack,
  onCompleteProposalDefense,
  onCompleteFinalDefense,
  onUpdateHearingInfo,
  onFinishHearing,
  onSubmitRevision,
}: MySidangDetailProps) {
  const [revisionFile, setRevisionFile] = useState<File | null>(null);
  
  // Parse Indonesian date format
  const parseIndonesianDate = (dateStr: string) => {
    const months: { [key: string]: number } = {
      'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
      'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
    };
    
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    return new Date(dateStr);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu Approval Sidang":
        return "bg-gray-100 text-gray-700";
      case "Menunggu Jadwal Sidang":
        return "bg-gray-100 text-gray-700";
      case "Menunggu Sidang":
        return "bg-amber-100 text-amber-700";
      case "Sidang Selesai":
        return "bg-green-100 text-green-700";
      case "Revisi":
        return "bg-blue-100 text-blue-700";
      case "Menunggu Approval Revisi":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const handleCompleteDefense = () => {
    if (onCompleteProposalDefense) {
      onCompleteProposalDefense(hearing.proposalId);
      toast.success("Sidang proposal selesai. Proposal telah dipindahkan ke Tugas Akhir Saya.");
    }
  };

  // NEW: khusus sidang akhir → ubah status TA jadi “Tugas Akhir Telah Selesai”
  const handleCompleteFinalDefense = () => {
    if (onCompleteFinalDefense) {
      onCompleteFinalDefense(hearing.proposalId);
      toast.success("Sidang akhir selesai. Status tugas akhir diperbarui menjadi 'Tugas Akhir Telah Selesai'.");
    }
  };

  const handleUpdateInfo = () => {
    if (onUpdateHearingInfo) {
      // Auto-fill with sample data
      const today = new Date();
      const defenseDate = new Date(today);
      defenseDate.setDate(today.getDate() + 7); // Defense in 7 days
      
      const autoFilledInfo = {
        date: defenseDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: "13:00 - 15:00 WIB",
        location: "Ruang IF-105",
        onlineStatus: "Offline" as "Online" | "Offline",
        examiner1: "Dr. Ahmad Saikhu, S.T., M.T.",
        examiner2: "Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.",
        examiner3: "Adhatus Solichah Ahmadiyah, S.Kom., M.Sc.",
      };
      
      onUpdateHearingInfo(hearing.id, autoFilledInfo);
      toast.success("Informasi sidang berhasil diperbaharui (AUTO-FILLED)");
    }
  };

  const handleFinishHearing = () => {
    if (onFinishHearing) {
      // Auto-fill with sample data
      const today = new Date();
      const revisionDeadline = new Date(today);
      revisionDeadline.setDate(today.getDate() + 2); // Deadline in 2 days to trigger reminder
      
      const sampleNotes = `Hasil sidang: LULUS dengan REVISI

Catatan perbaikan yang harus diselesaikan:

1. Perbaiki abstrak, tambahkan kontribusi penelitian dengan lebih jelas
2. Lengkapi kajian literatur terkait metode yang digunakan
3. Perbaiki penulisan pada Bab 3 bagian implementasi sistem
4. Tambahkan analisis perbandingan dengan penelitian sebelumnya
5. Perbaiki format daftar pustaka sesuai standar IEEE

Harap kumpulkan dokumen revisi sebelum deadline yang ditentukan.`;

      // Add separate notes for each examiner
      const notesExaminer1 = `Catatan dari Penguji 1:

1. Perbaiki abstrak - kontribusi penelitian belum jelas
2. Tambahkan state of the art pada Bab 2
3. Perbaiki diagram arsitektur sistem pada Bab 3`;

      const notesExaminer2 = `Catatan dari Penguji 2:

1. Lengkapi kajian literatur terkait metode yang digunakan
2. Tambahkan analisis perbandingan dengan penelitian sejenis
3. Perbaiki metodologi penelitian`;

      const notesExaminer3 = `Catatan dari Penguji 3:

1. Perbaiki penulisan pada Bab 3 bagian implementasi sistem
2. Tambahkan hasil pengujian yang lebih detail
3. Perbaiki format daftar pustaka sesuai standar IEEE`;
      
      // Update with all revision notes
      if (onUpdateHearingInfo) {
        onUpdateHearingInfo(hearing.id, {
          status: "Revisi" as const,
          revisionNotes: sampleNotes,
          revisionNotesExaminer1: notesExaminer1,
          revisionNotesExaminer2: notesExaminer2,
          revisionNotesExaminer3: notesExaminer3,
          revisionDeadline: revisionDeadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        });
      }
      
      toast.success("Sidang selesai. Catatan revisi telah ditambahkan (AUTO-FILLED)");
    }
  };

  const handleRevisionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRevisionFile(e.target.files[0]);
    }
  };

  const handleSubmitRevision = () => {
    if (!revisionFile) {
      toast.error("Harap pilih file revisi");
      return;
    }
    if (onSubmitRevision) {
      onSubmitRevision(hearing.id, revisionFile, revisionFile.name);
      toast.success("File revisi berhasil dikumpulkan");
      setRevisionFile(null);
    }
  };

  // Show the prototype button only for Proposal-type hearings that are not yet completed
  const showPrototypeButton = hearing.hearingType === "Proposal" && hearing.status === "Menunggu Sidang" && onCompleteProposalDefense;
  
  // Check if revision deadline is approaching (within 3 days)
  const isDeadlineApproaching = () => {
    if (!hearing.revisionDeadline) return false;
    
    const deadline = parseIndonesianDate(hearing.revisionDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-[Roboto] text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Sidang
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-gray-800 font-[Poppins] text-[20px] mb-2">
                  {hearing.hearingName}
                </h1>
                <span className={`inline-block px-3 py-1 rounded text-sm font-[Roboto] ${getStatusColor(hearing.status)}`}>
                  {hearing.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-[Poppins] text-[18px]">Topik Proposal</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 font-[Roboto] mb-1">Judul</p>
              <p className="text-sm text-gray-800 font-[Roboto] uppercase">
                {hearing.proposalTitle}
              </p>
            </div>

            {hearing.proposalCategory && (
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">Kategori</p>
                <p className="text-sm text-gray-800 font-[Roboto]">
                  {hearing.proposalCategory}
                </p>
              </div>
            )}

            {hearing.proposalAbstract && (
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">Abstrak</p>
                <p className="text-sm text-gray-700 font-[Roboto] leading-relaxed">
                  {hearing.proposalAbstract}
                </p>
              </div>
            )}

            {hearing.supervisor1 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">Dosen Pembimbing 1</p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    {hearing.supervisor1}
                  </p>
                </div>
                {hearing.supervisor2 && hearing.supervisor2 !== "-" && (
                  <div>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-1">Dosen Pembimbing 2</p>
                    <p className="text-sm text-gray-800 font-[Roboto]">
                      {hearing.supervisor2}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Approval System for Sidang Registration - Show only if status is "Menunggu Approval Sidang" */}
        {hearing.status === "Menunggu Approval Sidang" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-800 font-[Poppins] text-[18px] mb-4">Status Persetujuan Pendaftaran Sidang</h2>
            <p className="text-sm text-gray-600 font-[Roboto] mb-2">
              Pendaftaran sidang Anda memerlukan persetujuan dari Pembimbing 1, Pembimbing 2, dan Admin sebelum dapat dilanjutkan.
            </p>
            
            {/* Deadline Info */}
            {hearing.approvalDeadline && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-[Poppins] text-red-900 font-semibold">Deadline Persetujuan</p>
                  <p className="text-sm text-red-800 font-[Roboto]">
                    Persetujuan harus selesai sebelum <strong>{hearing.approvalDeadline}</strong>
                  </p>
                </div>
              </div>
            )}
            
            {/* 3 Column Approval Layout */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Pembimbing 1 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-[Poppins] text-sm text-gray-800 mb-1">Pembimbing 1</h3>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">{hearing.supervisor1 || "Dosen Pembimbing 1"}</p>
                  
                  <div className="flex flex-col items-center gap-2">
                    {hearing.supervisor1Approval === "approved" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-green-700 font-medium">Disetujui</span>
                        {hearing.supervisor1ApprovalDate && (
                          <span className="text-xs text-gray-500 font-[Roboto]">{hearing.supervisor1ApprovalDate}</span>
                        )}
                      </>
                    ) : hearing.supervisor1Approval === "rejected" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-red-700 font-medium">Ditolak</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <span className="text-xs font-[Roboto] text-gray-500">Menunggu</span>
                      </>
                    )}
                  </div>

                  {/* Individual Approve Button for Pembimbing 1 */}
                  {hearing.supervisor1Approval !== "approved" && (
                    <button
                      onClick={() => {
                        if (onUpdateHearingInfo) {
                          const today = new Date();
                          onUpdateHearingInfo(hearing.id, {
                            supervisor1Approval: "approved",
                            supervisor1ApprovalDate: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                          });
                          toast.success("Pembimbing 1 telah menyetujui!");
                        }
                      }}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-[Inter] transition-colors"
                    >
                      <span className="text-xs bg-green-700 px-2 py-0.5 rounded mr-1">PROTO</span>
                      Approve
                    </button>
                  )}
                </div>
              </div>

              {/* Pembimbing 2 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-[Poppins] text-sm text-gray-800 mb-1">Pembimbing 2</h3>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">{hearing.supervisor2 || "Dosen Pembimbing 2"}</p>
                  
                  <div className="flex flex-col items-center gap-2">
                    {hearing.supervisor2Approval === "approved" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-green-700 font-medium">Disetujui</span>
                        {hearing.supervisor2ApprovalDate && (
                          <span className="text-xs text-gray-500 font-[Roboto]">{hearing.supervisor2ApprovalDate}</span>
                        )}
                      </>
                    ) : hearing.supervisor2Approval === "rejected" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-red-700 font-medium">Ditolak</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <span className="text-xs font-[Roboto] text-gray-500">Menunggu</span>
                      </>
                    )}
                  </div>

                  {/* Individual Approve Button for Pembimbing 2 */}
                  {hearing.supervisor2Approval !== "approved" && (
                    <button
                      onClick={() => {
                        if (onUpdateHearingInfo) {
                          const today = new Date();
                          onUpdateHearingInfo(hearing.id, {
                            supervisor2Approval: "approved",
                            supervisor2ApprovalDate: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                          });
                          toast.success("Pembimbing 2 telah menyetujui!");
                        }
                      }}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-[Inter] transition-colors"
                    >
                      <span className="text-xs bg-green-700 px-2 py-0.5 rounded mr-1">PROTO</span>
                      Approve
                    </button>
                  )}
                </div>
              </div>

              {/* Admin */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-[Poppins] text-sm text-gray-800 mb-1">Admin</h3>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">Admin Sidang</p>
                  
                  <div className="flex flex-col items-center gap-2">
                    {hearing.adminApproval === "approved" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-green-700 font-medium">Disetujui</span>
                        {hearing.adminApprovalDate && (
                          <span className="text-xs text-gray-500 font-[Roboto]">{hearing.adminApprovalDate}</span>
                        )}
                      </>
                    ) : hearing.adminApproval === "rejected" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-red-700 font-medium">Ditolak</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <span className="text-xs font-[Roboto] text-gray-500">Menunggu</span>
                      </>
                    )}
                  </div>

                  {/* Individual Approve Button for Admin */}
                  {hearing.adminApproval !== "approved" && (
                    <button
                      onClick={() => {
                        if (onUpdateHearingInfo) {
                          const today = new Date();
                          onUpdateHearingInfo(hearing.id, {
                            adminApproval: "approved",
                            adminApprovalDate: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                            // Auto change status if all approved
                            ...(hearing.supervisor1Approval === "approved" && hearing.supervisor2Approval === "approved" ? {
                              status: "Menunggu Jadwal Sidang"
                            } : {})
                          });
                          toast.success("Admin telah menyetujui!");
                          
                          // Check if all approved
                          if (hearing.supervisor1Approval === "approved" && hearing.supervisor2Approval === "approved") {
                            setTimeout(() => {
                              toast.success("Semua persetujuan selesai! Status berubah menjadi Menunggu Jadwal Sidang.");
                            }, 500);
                          }
                        }
                      }}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-[Inter] transition-colors"
                    >
                      <span className="text-xs bg-green-700 px-2 py-0.5 rounded mr-1">PROTO</span>
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Info when all approved */}
            {hearing.supervisor1Approval === "approved" && 
             hearing.supervisor2Approval === "approved" && 
             hearing.adminApproval === "approved" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-800 font-[Roboto]">
                    ✓ Semua persetujuan telah diterima! Menunggu admin memberikan informasi jadwal sidang.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Input Jadwal Sidang - Show when status is "Menunggu Jadwal Sidang" */}
        {hearing.status === "Menunggu Jadwal Sidang" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-800 font-[Poppins] text-[18px] mb-4">Menunggu Informasi Jadwal Sidang</h2>
            <p className="text-sm text-gray-600 font-[Roboto] mb-6">
              Pendaftaran sidang Anda telah disetujui. Admin akan segera memberikan informasi jadwal sidang, lokasi, dan dosen penguji.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-[Poppins] text-blue-900 font-semibold">Status: Menunggu Admin</p>
              </div>
              <p className="text-sm text-blue-800 font-[Roboto]">
                Admin sedang memproses jadwal sidang Anda. Anda akan mendapat notifikasi setelah jadwal ditentukan.
              </p>
            </div>

            {/* Prototype Button for Admin to Set Hearing Info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-[Poppins] text-gray-800 mb-1">Simulasi Admin: Berikan Info Sidang</h3>
                  <p className="text-xs text-gray-500 font-[Roboto]">
                    Klik tombol untuk simulasi admin memberikan informasi jadwal sidang, lokasi, dan penguji.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onUpdateHearingInfo) {
                      const today = new Date();
                      const defenseDate = new Date(today);
                      defenseDate.setDate(today.getDate() + 7); // Defense in 7 days
                      
                      onUpdateHearingInfo(hearing.id, {
                        date: defenseDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        time: "13:00 - 15:00 WIB",
                        location: "Ruang IF-105",
                        onlineStatus: "Offline" as "Online" | "Offline",
                        examiner1: "Dr. Ahmad Saikhu, S.T., M.T.",
                        examiner2: "Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.",
                        examiner3: "Adhatus Solichah Ahmadiyah, S.Kom., M.Sc.",
                        status: "Menunggu Sidang"
                      });
                      toast.success("Admin telah memberikan informasi jadwal sidang!");
                    }
                  }}
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-[Inter] transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-xs bg-blue-700 px-2 py-0.5 rounded">PROTOTYPE</span>
                  Admin Berikan Info Sidang
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval System for Revision - Show only if status is "Menunggu Approval Revisi" */}
        {hearing.status === "Menunggu Approval Revisi" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-800 font-[Poppins] text-[18px] mb-4">Status Persetujuan Revisi</h2>
            <p className="text-sm text-gray-600 font-[Roboto] mb-2">
              File revisi Anda telah dikumpulkan dan menunggu persetujuan dari ketiga dosen penguji.
            </p>
            
            {/* Deadline Info */}
            {hearing.revisionApprovalDeadline && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-[Poppins] text-red-900 font-semibold">Deadline Approval Revisi</p>
                  <p className="text-sm text-red-800 font-[Roboto]">
                    Approval revisi harus selesai sebelum <strong>{hearing.revisionApprovalDeadline}</strong>
                  </p>
                </div>
              </div>
            )}
            
            {/* File yang Dikumpulkan */}
            {hearing.revisionFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-[Poppins] text-blue-900 mb-1">File Revisi yang Dikumpulkan</p>
                    <p className="text-sm text-blue-800 font-[Roboto]">{hearing.revisionFileName}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 3 Column Approval Layout for Examiners */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Penguji 1 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-[Poppins] text-sm text-gray-800 mb-1">Penguji 1</h3>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">{hearing.examiner1 || "Dosen Penguji 1"}</p>
                  
                  <div className="flex flex-col items-center gap-2">
                    {hearing.examiner1RevisionApproval === "approved" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-green-700 font-medium">Disetujui</span>
                        {hearing.examiner1RevisionApprovalDate && (
                          <span className="text-xs text-gray-500 font-[Roboto]">{hearing.examiner1RevisionApprovalDate}</span>
                        )}
                      </>
                    ) : hearing.examiner1RevisionApproval === "rejected" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-red-700 font-medium">Ditolak</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <span className="text-xs font-[Roboto] text-gray-500">Menunggu</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Penguji 2 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-[Poppins] text-sm text-gray-800 mb-1">Penguji 2</h3>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">{hearing.examiner2 || "Dosen Penguji 2"}</p>
                  
                  <div className="flex flex-col items-center gap-2">
                    {hearing.examiner2RevisionApproval === "approved" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-green-700 font-medium">Disetujui</span>
                        {hearing.examiner2RevisionApprovalDate && (
                          <span className="text-xs text-gray-500 font-[Roboto]">{hearing.examiner2RevisionApprovalDate}</span>
                        )}
                      </>
                    ) : hearing.examiner2RevisionApproval === "rejected" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justifyCenter">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-red-700 font-medium">Ditolak</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <span className="text-xs font-[Roboto] text-gray-500">Menunggu</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Penguji 3 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-[Poppins] text-sm text-gray-800 mb-1">Penguji 3</h3>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">{hearing.examiner3 || "Dosen Penguji 3"}</p>
                  
                  <div className="flex flex-col items-center gap-2">
                    {hearing.examiner3RevisionApproval === "approved" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-green-700 font-medium">Disetujui</span>
                        {hearing.examiner3RevisionApprovalDate && (
                          <span className="text-xs text-gray-500 font-[Roboto]">{hearing.examiner3RevisionApprovalDate}</span>
                        )}
                      </>
                    ) : hearing.examiner3RevisionApproval === "rejected" ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-xs font-[Roboto] text-red-700 font-medium">Ditolak</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <span className="text-xs font-[Roboto] text-gray-500">Menunggu</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Prototype Button to Simulate Revision Approval */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-[Poppins] text-gray-800 mb-1">Simulasi Approval Revisi</h3>
                  <p className="text-xs text-gray-500 font-[Roboto]">
                    Klik tombol untuk simulasi approval revisi dari semua penguji dan ubah status menjadi "Sidang Selesai".
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onUpdateHearingInfo) {
                      const today = new Date();
                      onUpdateHearingInfo(hearing.id, {
                        examiner1RevisionApproval: "approved",
                        examiner2RevisionApproval: "approved",
                        examiner3RevisionApproval: "approved",
                        examiner1RevisionApprovalDate: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        examiner2RevisionApprovalDate: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        examiner3RevisionApprovalDate: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        status: "Sidang Selesai"
                      });
                      
                      // Jika ini sidang proposal → lanjut ke tahap TA
// Jika ini sidang proposal → pindah ke tahap Tugas Akhir
if (hearing.hearingType === "Proposal" && onCompleteProposalDefense) {
  onCompleteProposalDefense(hearing.proposalId);
  toast.success("Semua revisi telah disetujui! Sidang proposal selesai. Proposal telah dipindahkan ke Tugas Akhir Saya.");
}
// Jika ini sidang akhir → tandai Tugas Akhir selesai
else if (hearing.hearingType === "Final" && onCompleteFinalDefense) {
  onCompleteFinalDefense(hearing.proposalId);
  toast.success("Selamat! Sidang akhir selesai dan tugas akhir Anda dinyatakan selesai.");
}
// Fallback
else {
  toast.success("Semua revisi telah disetujui! Sidang telah selesai.");
}
                    }
                  }}
                  className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-[Inter] transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-xs bg-green-700 px-2 py-0.5 rounded">PROTOTYPE</span>
                  Approve Semua Revisi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revision Deadline Warning */}
        {hearing.status === "Revisi" && isDeadlineApproaching() && !hearing.revisionFile && (
          <div className="bg-red-50 rounded-lg border border-red-300 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-900 font-[Poppins] mb-1 font-semibold">Peringatan: Deadline Mendekat!</h3>
                <p className="text-sm text-red-800 font-[Roboto]">
                  Deadline revisi Anda tinggal {(() => {
                    if (!hearing.revisionDeadline) return "0";
                    const deadline = parseIndonesianDate(hearing.revisionDeadline);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    deadline.setHours(0, 0, 0, 0);
                    const diffTime = deadline.getTime() - today.getTime();
                    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return daysLeft === 0 ? "hari ini" : daysLeft === 1 ? "1 hari lagi" : `${daysLeft} hari lagi`;
                  })()} (<strong>{hearing.revisionDeadline}</strong>). Harap segera kumpulkan file revisi Anda.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Session Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex itemsCenter gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-[Poppins] text-[18px]">Informasi Sidang</h2>
          </div>

          {hearing.date ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">Tanggal</p>
                  <p className="text-sm text-gray-800 font-[Roboto]">{hearing.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">Waktu</p>
                  <p className="text-sm text-gray-800 font-[Roboto]">{hearing.time || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">Lokasi</p>
                  <p className="text-sm text-gray-800 font-[Roboto]">{hearing.location || "-"}</p>
                </div>
              </div>

              {hearing.onlineStatus && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-[Roboto] mb-1">Mode Sidang</p>
                    <p className="text-sm text-gray-800 font-[Roboto]">{hearing.onlineStatus}</p>
                  </div>
                </div>
              )}

              {(hearing.examiner1 || hearing.examiner2 || hearing.examiner3) && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-[Roboto] mb-2">Dosen Penguji</p>
                    <div className="space-y-1">
                      {hearing.examiner1 && (
                        <p className="text-sm text-gray-800 font-[Roboto]">1. {hearing.examiner1}</p>
                      )}
                      {hearing.examiner2 && (
                        <p className="text-sm text-gray-800 font-[Roboto]">2. {hearing.examiner2}</p>
                      )}
                      {hearing.examiner3 && (
                        <p className="text-sm text-gray-800 font-[Roboto]">3. {hearing.examiner3}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-yellow-900 font-[Roboto]">
                Informasi sidang akan diumumkan oleh admin. Mohon tunggu pengumuman lebih lanjut.
              </p>
            </div>
          )}
        </div>

        {/* Revision Section - Only show if status is "Revisi" or "Sidang Selesai" with revision notes */}
        {(hearing.status === "Revisi" || (hearing.status === "Sidang Selesai" && hearing.revisionNotes)) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-800 font-[Poppins] text-[18px]">Catatan Revisi dari Penguji</h2>
            </div>

            {/* Deadline Section at the top */}
            {hearing.revisionDeadline && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-[Poppins] text-amber-900 mb-1">Deadline Pengumpulan Revisi</p>
                    <p className="font-[Roboto] text-amber-800">{hearing.revisionDeadline}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3 Separate Sections for Each Examiner's Notes */}
            <div className="space-y-4 mb-6">
              {/* Catatan dari Penguji 1 */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-[Poppins] text-blue-900 text-sm">
                      Catatan dari {hearing.examiner1 || "Dosen Penguji 1"}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-4">
                  {hearing.revisionNotesExaminer1 ? (
                    <p className="text-sm text-gray-800 font-[Roboto] whitespace-pre-line">
                      {hearing.revisionNotesExaminer1}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 font-[Roboto] italic">
                      Belum ada catatan dari penguji 1
                    </p>
                  )}
                </div>
              </div>

              {/* Catatan dari Penguji 2 */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-[Poppins] text-blue-900 text-sm">
                      Catatan dari {hearing.examiner2 || "Dosen Penguji 2"}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-4">
                  {hearing.revisionNotesExaminer2 ? (
                    <p className="text-sm text-gray-800 font-[Roboto] whitespace-pre-line">
                      {hearing.revisionNotesExaminer2}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 font-[Roboto] italic">
                      Belum ada catatan dari penguji 2
                    </p>
                  )}
                </div>
              </div>

              {/* Catatan dari Penguji 3 */}
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-[Poppins] text-blue-900 text-sm">
                      Catatan dari {hearing.examiner3 || "Dosen Penguji 3"}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-4">
                  {hearing.revisionNotesExaminer3 ? (
                    <p className="text-sm text-gray-800 font-[Roboto] whitespace-pre-line">
                      {hearing.revisionNotesExaminer3}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 font-[Roboto] italic">
                      Belum ada catatan dari penguji 3
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* File Upload Section - Only show if status is "Revisi" */}
            {hearing.status === "Revisi" && (
              <>
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-gray-800 font-[Poppins] text-[16px] mb-4">Kumpulkan File Revisi</h3>
                  
                  {hearing.revisionFile ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-800 font-[Roboto]">
                          File revisi telah dikumpulkan: <strong>{hearing.revisionFileName}</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <input
                          type="file"
                          onChange={handleRevisionFileChange}
                          className="w-full text-sm text-gray-500 font-[Roboto]
                            file:mr-4 file:py-2 file:px-4
                            file:rounded file:border-0
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                          accept=".pdf,.doc,.docx"
                        />
                        <p className="text-xs text-gray-500 font-[Roboto] mt-1">
                          Format yang didukung: PDF, DOC, DOCX
                        </p>
                      </div>
                      
                      {revisionFile && (
                        <button
                          onClick={handleSubmitRevision}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-[Inter] transition-colors flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Kumpulkan File Revisi
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Admin Prototype Button - Provide Complete Information */}
        {hearing.status === "Menunggu Sidang" && !hearing.date && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-[Poppins] text-gray-800 mb-1">Simulasi Admin: Berikan Informasi Sidang Lengkap</h3>
                <p className="text-xs text-gray-500 font-[Roboto]">
                  Klik tombol untuk otomatis mengisi informasi sidang (tanggal, waktu, lokasi, penguji, dll) dengan data contoh.
                </p>
              </div>
              <button
                onClick={handleUpdateInfo}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-[Inter] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-xs bg-blue-700 px-2 py-0.5 rounded">PROTOTYPE</span>
                Auto-Fill Info Sidang
              </button>
            </div>
          </div>
        )}

        {/* Show Hearing Info and Prototype Button for Admin to Give Revision */}
        {hearing.status === "Menunggu Sidang" && hearing.date && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-800 font-[Poppins] text-[18px]">Informasi Sidang</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">Tanggal</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-800 font-[Roboto]">{hearing.date}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">Waktu</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-800 font-[Roboto]">{hearing.time || "-"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">Lokasi</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-800 font-[Roboto]">{hearing.location || "-"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">Status Pelaksanaan</p>
                <p className="text-sm text-gray-800 font-[Roboto]">{hearing.onlineStatus || "-"}</p>
              </div>
            </div>

            {hearing.examiner1 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 font-[Roboto] mb-2">Dosen Penguji</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-800 font-[Roboto]">Penguji 1: {hearing.examiner1}</p>
                  </div>
                  {hearing.examiner2 && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-800 font-[Roboto]">Penguji 2: {hearing.examiner2}</p>
                    </div>
                  )}
                  {hearing.examiner3 && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-800 font-[Roboto]">Penguji 3: {hearing.examiner3}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prototype Button for Admin to Give Revision */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-[Poppins] text-gray-800 mb-1">Simulasi Admin: Berikan Revisi Sidang</h3>
                  <p className="text-xs text-gray-500 font-[Roboto]">
                    Klik tombol untuk simulasi admin memberikan catatan revisi dari para penguji setelah sidang.
                  </p>
                </div>
                <button
                  onClick={handleFinishHearing}
                  className="ml-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-[Inter] transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-xs bg-orange-700 px-2 py-0.5 rounded">PROTOTYPE</span>
                  Admin Berikan Revisi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prototype Button */}
        {showPrototypeButton && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-[Poppins] text-gray-800 mb-1">Simulasi Penyelesaian Sidang</h3>
                <p className="text-xs text-gray-500 font-[Roboto]">
                  Untuk keperluan prototipe, gunakan tombol ini untuk menandai sidang proposal sebagai selesai. Proposal akan otomatis dipindahkan ke bagian "Tugas Akhir Saya".
                </p>
              </div>
              <button
                onClick={handleCompleteDefense}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-[Inter] transition-colors flex items-center gap-2"
              >
                <span className="text-xs bg-blue-700 px-2 py-0.5 rounded">PROTOTYPE</span>
                Selesaikan Sidang
              </button>
            </div>
          </div>
        )}

        {/* Sidang Selesai Section */}
        {hearing.status === "Sidang Selesai" && (
          <div className="bg-green-50 rounded-lg border border-green-200 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-green-900 font-[Poppins] text-[18px] mb-2 font-semibold">Sidang Selesai</h2>
                <p className="text-sm text-green-800 font-[Roboto] mb-3">
                  Selamat! Sidang {hearing.hearingType === "Proposal" ? "proposal" : "akhir"} Anda telah selesai dan semua revisi telah disetujui oleh dosen penguji.
                </p>
                
                {hearing.hearingType === "Proposal" && (
                  <div className="bg-white border border-green-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-[Poppins] font-semibold mb-1">Langkah Selanjutnya</h3>
                        <p className="text-sm text-gray-600 font-[Roboto]">
                          Proposal Anda telah dipindahkan ke <strong>Tugas Akhir Saya</strong>. Anda dapat melanjutkan penelitian dan penulisan tugas akhir.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (onBack) {
                          onBack();
                        }
                      }}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-[Inter] transition-colors"
                    >
                      Kembali ke Halaman Sidang
                    </button>
                  </div>
                )}

                {hearing.hearingType === "Final" && (
                  <div className="bg-white border border-green-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-[Poppins] font-semibold mb-1">Selamat!</h3>
                        <p className="text-sm text-gray-600 font-[Roboto]">
                          Anda telah menyelesaikan seluruh proses tugas akhir. Status tugas akhir Anda sekarang adalah <strong>"Tugas Akhir Telah Selesai"</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
        </footer>
      </div>
    </main>
  );
}
