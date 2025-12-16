import { Bell, Clock } from "lucide-react";

interface TakenHearing {
  id: number;
  hearingId: number;
  hearingName: string;
  hearingType: "Proposal" | "Final";
  proposalId: number;
  proposalTitle: string;
  status:
    | "Menunggu Approval Sidang"
    | "Menunggu Jadwal Sidang"
    | "Menunggu Sidang"
    | "Sidang Selesai"
    | "Revisi"
    | "Menunggu Approval Revisi";
  approvalDeadline?: string;
  revisionApprovalDeadline?: string;
  revisionFileName?: string;
}

interface SidangReminderCardsProps {
  takenHearings: TakenHearing[];
  onViewHearingDetail: (hearing: TakenHearing) => void;
}

export function SidangReminderCards({
  takenHearings,
  onViewHearingDetail,
}: SidangReminderCardsProps) {
  const waitingApprovalSidang = takenHearings.find(
    (h) => h.status === "Menunggu Approval Sidang"
  );
  const waitingSchedule = takenHearings.find(
    (h) => h.status === "Menunggu Jadwal Sidang"
  );
  const waitingRevisionApproval = takenHearings.find(
    (h) => h.status === "Menunggu Approval Revisi"
  );

  return (
    <>
      {/* Menunggu Approval Sidang Reminder */}
      {waitingApprovalSidang && (
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4 mt-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1 space-y-1.5">
              <h3 className="text-yellow-900 text-sm font-[Poppins] font-medium">
                Menunggu Approval Pendaftaran Sidang
              </h3>
              <p className="text-xs text-yellow-900 font-[Roboto]">
                {waitingApprovalSidang.hearingName}
              </p>
              {waitingApprovalSidang.approvalDeadline && (
                <p className="text-[11px] text-yellow-800 font-[Roboto]">
                  Deadline approval:{" "}
                  <span className="font-medium">
                    {waitingApprovalSidang.approvalDeadline}
                  </span>
                </p>
              )}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-yellow-50 flex items-center justify-center">
                    <span className="text-white text-[10px] font-[Poppins]">
                      P1
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-yellow-50 flex items-center justify-center">
                    <span className="text-white text-[10px] font-[Poppins]">
                      P2
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-yellow-50 flex items-center justify-center">
                    <span className="text-white text-[10px] font-[Poppins]">
                      KL
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-yellow-900 font-[Roboto] leading-snug">
                  Menunggu persetujuan dari Pembimbing 1, Pembimbing 2, dan
                  Kepala Lab
                </span>
              </div>
            </div>
            <button
              onClick={() => onViewHearingDetail(waitingApprovalSidang)}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded-md text-xs font-[Inter] flex-shrink-0 self-center transition-colors"
            >
              Lihat detail
            </button>
          </div>
        </div>
      )}

      {/* Menunggu Jadwal Sidang Reminder */}
      {waitingSchedule && (
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4 mt-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 space-y-1.5">
              <h3 className="text-blue-900 text-sm font-[Poppins] font-medium">
                Menunggu Jadwal Sidang
              </h3>
              <p className="text-xs text-blue-900 font-[Roboto]">
                {waitingSchedule.hearingName}
              </p>
              <p className="text-[11px] text-blue-800 font-[Roboto] leading-snug">
                Admin sedang memproses jadwal sidang Anda. Anda akan mendapat
                notifikasi setelah jadwal ditentukan.
              </p>
            </div>
            <button
              onClick={() => onViewHearingDetail(waitingSchedule)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-md text-xs font-[Inter] flex-shrink-0 self-center transition-colors"
            >
              Lihat detail
            </button>
          </div>
        </div>
      )}

      {/* Menunggu Approval Revisi Reminder */}
      {waitingRevisionApproval && (
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4 mt-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1 space-y-1.5">
              <h3 className="text-yellow-900 text-sm font-[Poppins] font-medium">
                Menunggu Approval Revisi Sidang
              </h3>
              <p className="text-xs text-yellow-900 font-[Roboto]">
                {waitingRevisionApproval.hearingName}
              </p>
              {waitingRevisionApproval.revisionFileName && (
                <p className="text-[11px] text-yellow-800 font-[Roboto]">
                  File:{" "}
                  <span className="font-medium">
                    {waitingRevisionApproval.revisionFileName}
                  </span>
                </p>
              )}
              {waitingRevisionApproval.revisionApprovalDeadline && (
                <p className="text-[11px] text-yellow-800 font-[Roboto]">
                  Deadline approval:{" "}
                  <span className="font-medium">
                    {waitingRevisionApproval.revisionApprovalDeadline}
                  </span>
                </p>
              )}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-yellow-50 flex items-center justify-center">
                    <span className="text-white text-[10px] font-[Poppins]">
                      P1
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-yellow-50 flex items-center justify-center">
                    <span className="text-white text-[10px] font-[Poppins]">
                      P2
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-yellow-50 flex items-center justify-center">
                    <span className="text-white text-[10px] font-[Poppins]">
                      PB1
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-yellow-900 font-[Roboto] leading-snug">
                  Menunggu approval dari Penguji 1, Penguji 2, dan Pembimbing 1
                </span>
              </div>
            </div>
            <button
              onClick={() => onViewHearingDetail(waitingRevisionApproval)}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded-md text-xs font-[Inter] flex-shrink-0 self-center transition-colors"
            >
              Lihat detail
            </button>
          </div>
        </div>
      )}
    </>
  );
}
