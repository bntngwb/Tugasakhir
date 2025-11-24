import { Bell, Clock } from "lucide-react";

interface TakenHearing {
  id: number;
  hearingId: number;
  hearingName: string;
  hearingType: "Proposal" | "Final";
  proposalId: number;
  proposalTitle: string;
  status: "Menunggu Approval Sidang" | "Menunggu Jadwal Sidang" | "Menunggu Sidang" | "Sidang Selesai" | "Revisi" | "Menunggu Approval Revisi";
  approvalDeadline?: string;
  revisionApprovalDeadline?: string;
  revisionFileName?: string;
}

interface SidangReminderCardsProps {
  takenHearings: TakenHearing[];
  onViewHearingDetail: (hearing: TakenHearing) => void;
}

export function SidangReminderCards({ takenHearings, onViewHearingDetail }: SidangReminderCardsProps) {
  const waitingApprovalSidang = takenHearings.find(h => h.status === "Menunggu Approval Sidang");
  const waitingSchedule = takenHearings.find(h => h.status === "Menunggu Jadwal Sidang");
  const waitingRevisionApproval = takenHearings.find(h => h.status === "Menunggu Approval Revisi");

  return (
    <>
      {/* Menunggu Approval Sidang Reminder */}
      {waitingApprovalSidang && (
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-300 p-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-yellow-900 mb-2 font-[Poppins] font-semibold">
                Menunggu Approval Pendaftaran Sidang
              </h3>
              <p className="text-sm text-yellow-800 font-[Roboto] mb-1">
                <strong>{waitingApprovalSidang.hearingName}</strong>
              </p>
              {waitingApprovalSidang.approvalDeadline && (
                <p className="text-xs text-yellow-700 font-[Roboto]">
                  Deadline approval: <strong>{waitingApprovalSidang.approvalDeadline}</strong>
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-[Poppins]">P1</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-[Poppins]">P2</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-[Poppins]">AD</span>
                  </div>
                </div>
                <span className="text-xs text-yellow-800 font-[Roboto]">
                  Menunggu persetujuan dari 3 pihak
                </span>
              </div>
            </div>
            <button 
              onClick={() => onViewHearingDetail(waitingApprovalSidang)}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded text-sm flex-shrink-0 font-[Inter] self-center transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      )}

      {/* Menunggu Jadwal Sidang Reminder */}
      {waitingSchedule && (
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-300 p-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-blue-900 mb-2 font-[Poppins] font-semibold">
                Menunggu Jadwal Sidang
              </h3>
              <p className="text-sm text-blue-800 font-[Roboto] mb-1">
                <strong>{waitingSchedule.hearingName}</strong>
              </p>
              <p className="text-xs text-blue-700 font-[Roboto]">
                Admin sedang memproses jadwal sidang Anda. Anda akan mendapat notifikasi setelah jadwal ditentukan.
              </p>
            </div>
            <button 
              onClick={() => onViewHearingDetail(waitingSchedule)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded text-sm flex-shrink-0 font-[Inter] self-center transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      )}

      {/* Menunggu Approval Revisi Reminder */}
      {waitingRevisionApproval && (
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-300 p-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-yellow-900 mb-2 font-[Poppins] font-semibold">
                Menunggu Approval Revisi Sidang
              </h3>
              <p className="text-sm text-yellow-800 font-[Roboto] mb-1">
                <strong>{waitingRevisionApproval.hearingName}</strong>
              </p>
              {waitingRevisionApproval.revisionFileName && (
                <p className="text-xs text-yellow-700 font-[Roboto] mb-1">
                  File: {waitingRevisionApproval.revisionFileName}
                </p>
              )}
              {waitingRevisionApproval.revisionApprovalDeadline && (
                <p className="text-xs text-yellow-700 font-[Roboto]">
                  Deadline approval: <strong>{waitingRevisionApproval.revisionApprovalDeadline}</strong>
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-[Poppins]">P1</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-[Poppins]">P2</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-[Poppins]">P3</span>
                  </div>
                </div>
                <span className="text-xs text-yellow-800 font-[Roboto]">
                  Menunggu approval dari 3 penguji
                </span>
              </div>
            </div>
            <button 
              onClick={() => onViewHearingDetail(waitingRevisionApproval)}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded text-sm flex-shrink-0 font-[Inter] self-center transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      )}
    </>
  );
}
