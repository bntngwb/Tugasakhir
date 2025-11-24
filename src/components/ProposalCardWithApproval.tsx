import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, BookOpen, AlertCircle, User, Clock } from "lucide-react";
import { toast } from "sonner@2.0.3";

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
  
  // Approval fields
  supervisor1Approval?: "pending" | "approved" | "rejected";
  supervisor2Approval?: "pending" | "approved" | "rejected";
  adminApproval?: "pending" | "approved" | "rejected";
  supervisor1ApprovalDate?: string;
  supervisor2ApprovalDate?: string;
  adminApprovalDate?: string;
  approvalDeadline?: string;
}

interface ProposalCardWithApprovalProps {
  proposal: Proposal;
  onEditProposal: (proposal: Proposal) => void;
  onUpdateProposal?: (proposalId: number, updates: Partial<Proposal>) => void;
}

export function ProposalCardWithApproval({ proposal, onEditProposal, onUpdateProposal }: ProposalCardWithApprovalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Calculate time left until deadline
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
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3,
      'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7,
      'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    };
    
    const parts = dateStr.split(' ');
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
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Menunggu Persetujuan":
        return "bg-amber-100 text-amber-700";
      case "Siap Daftar Sidang":
        return "bg-green-100 text-green-700";
      case "Tugas Akhir - Dalam Pengerjaan":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const handleProtoApprove = (role: "supervisor1" | "supervisor2" | "admin") => {
    if (!onUpdateProposal) return;

    const today = new Date();
    const updates: Partial<Proposal> = {};

    if (role === "supervisor1") {
      updates.supervisor1Approval = "approved";
      updates.supervisor1ApprovalDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      toast.success("Pembimbing 1 menyetujui proposal");
    } else if (role === "supervisor2") {
      updates.supervisor2Approval = "approved";
      updates.supervisor2ApprovalDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      toast.success("Pembimbing 2 menyetujui proposal");
    } else {
      updates.adminApproval = "approved";
      updates.adminApprovalDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      toast.success("Admin menyetujui proposal");
    }

    // Check if all approved after this update
    const updatedProposal = { ...proposal, ...updates };
    if (
      updatedProposal.supervisor1Approval === "approved" &&
      updatedProposal.supervisor2Approval === "approved" &&
      updatedProposal.adminApproval === "approved"
    ) {
      updates.status = "Siap Daftar Sidang";
      toast.success("Semua persetujuan lengkap! Proposal siap didaftarkan untuk sidang.");
    }

    onUpdateProposal(proposal.id, updates);
  };

  const allApproved = 
    proposal.supervisor1Approval === "approved" &&
    proposal.supervisor2Approval === "approved" &&
    proposal.adminApproval === "approved";

  const approvalCount = [
    proposal.supervisor1Approval === "approved",
    proposal.supervisor2Approval === "approved",
    proposal.adminApproval === "approved"
  ].filter(Boolean).length;

  return (
    <div className="mb-3">
      {/* Warning for incomplete drafts */}
      {proposal.isDraft && proposal.missingFields && proposal.missingFields.length > 0 && (
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
        {/* Header - Always visible */}
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
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-[Roboto] text-gray-800 mb-2 uppercase leading-tight">
                {proposal.title || "Usulan Tanpa Judul"}
              </h3>
              <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                Laboratorium: {proposal.laboratory || "-"}
              </p>
              <p className="text-xs text-gray-600 font-[Roboto]">
                Pembimbing 1: {proposal.supervisor1 || "-"}
              </p>
              <p className="text-xs text-gray-600 font-[Roboto] mb-2">
                Pembimbing 2: {proposal.supervisor2 || "-"}
              </p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-[Roboto] ${getStatusColor(proposal.status)}`}>
                {proposal.status}
              </span>
              
              {/* Approval progress indicator */}
              {proposal.status === "Menunggu Persetujuan" && !allApproved && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center -space-x-1">
                    <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-[Poppins] ${
                      proposal.supervisor1Approval === "approved" ? "bg-green-500 text-white" : "bg-gray-300 text-white"
                    }`}>
                      {proposal.supervisor1Approval === "approved" ? "✓" : "P1"}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-[Poppins] ${
                      proposal.supervisor2Approval === "approved" ? "bg-green-500 text-white" : "bg-gray-300 text-white"
                    }`}>
                      {proposal.supervisor2Approval === "approved" ? "✓" : "P2"}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-[Poppins] ${
                      proposal.adminApproval === "approved" ? "bg-green-500 text-white" : "bg-gray-300 text-white"
                    }`}>
                      {proposal.adminApproval === "approved" ? "✓" : "AD"}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-[Roboto]">
                    {approvalCount}/3 disetujui
                  </span>
                </div>
              )}
            </div>
            
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

        {/* Expanded Approval Section */}
        {isExpanded && proposal.status === "Menunggu Persetujuan" && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <h4 className="text-gray-800 font-[Poppins] mb-2">Status Persetujuan</h4>
            <p className="text-sm text-gray-600 font-[Roboto] mb-4">
              Proposal Anda memerlukan persetujuan dari Pembimbing 1, Pembimbing 2, dan Admin.
            </p>

            {/* Deadline Info */}
            {proposal.approvalDeadline && timeLeft > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-[Poppins] text-red-900 font-semibold">Deadline Persetujuan</p>
                  <p className="text-sm text-red-800 font-[Roboto]">
                    Persetujuan harus selesai sebelum <strong>{proposal.approvalDeadline}</strong>
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

            {/* 3 Column Approval Layout */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Pembimbing 1 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-[Poppins] text-sm text-gray-800 mb-1">Pembimbing 1</h5>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">{proposal.supervisor1 || "Dosen Pembimbing 1"}</p>
                  
                  {proposal.supervisor1Approval === "approved" ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs text-green-700 font-[Roboto]">Disetujui</p>
                      {proposal.supervisor1ApprovalDate && (
                        <p className="text-xs text-gray-500 font-[Roboto] mt-1">{proposal.supervisor1ApprovalDate}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-8 h-8 text-amber-600" />
                      </div>
                      <p className="text-xs text-amber-700 font-[Roboto] mb-2">Menunggu</p>
                      <button
                        onClick={() => handleProtoApprove("supervisor1")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-[Inter] transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="text-[10px] bg-blue-700 px-1.5 py-0.5 rounded">PROTO</span>
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Pembimbing 2 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-[Poppins] text-sm text-gray-800 mb-1">Pembimbing 2</h5>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">{proposal.supervisor2 || "Dosen Pembimbing 2"}</p>
                  
                  {proposal.supervisor2Approval === "approved" ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs text-green-700 font-[Roboto]">Disetujui</p>
                      {proposal.supervisor2ApprovalDate && (
                        <p className="text-xs text-gray-500 font-[Roboto] mt-1">{proposal.supervisor2ApprovalDate}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-8 h-8 text-amber-600" />
                      </div>
                      <p className="text-xs text-amber-700 font-[Roboto] mb-2">Menunggu</p>
                      <button
                        onClick={() => handleProtoApprove("supervisor2")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-[Inter] transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="text-[10px] bg-blue-700 px-1.5 py-0.5 rounded">PROTO</span>
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Admin */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-[Poppins] text-sm text-gray-800 mb-1">Admin</h5>
                  <p className="text-xs text-gray-600 font-[Roboto] mb-3">Administrator</p>
                  
                  {proposal.adminApproval === "approved" ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs text-green-700 font-[Roboto]">Disetujui</p>
                      {proposal.adminApprovalDate && (
                        <p className="text-xs text-gray-500 font-[Roboto] mt-1">{proposal.adminApprovalDate}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-8 h-8 text-amber-600" />
                      </div>
                      <p className="text-xs text-amber-700 font-[Roboto] mb-2">Menunggu</p>
                      <button
                        onClick={() => handleProtoApprove("admin")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-[Inter] transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="text-[10px] bg-blue-700 px-1.5 py-0.5 rounded">PROTO</span>
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-[Poppins] text-gray-700">Progress Persetujuan</p>
                <p className="font-[Poppins] text-gray-800">{approvalCount}/3</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-500"
                  style={{ width: `${(approvalCount / 3) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 font-[Roboto] mt-2">
                {approvalCount === 0 && "Menunggu persetujuan dari semua pihak"}
                {approvalCount === 1 && "1 dari 3 pihak telah menyetujui"}
                {approvalCount === 2 && "2 dari 3 pihak telah menyetujui"}
                {approvalCount === 3 && "Semua pihak telah menyetujui"}
              </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditProposal(proposal);
              }}
              className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-[Inter] transition-colors"
            >
              Edit Proposal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
