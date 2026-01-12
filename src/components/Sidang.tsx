// Sidang.tsx
import { Calendar, Clock, MapPin, BookOpen, ChevronRight, AlertCircle, Plus, Users } from "lucide-react";
import { useState } from "react";
import { GuideModal } from "./GuideModal";

export type HearingType = "Proposal" | "Final";
export type HearingStatus = "Menunggu Sidang" | "Sidang Selesai" | "Revisi";
export type HearingResult =
  | "Lulus"
  | "Lulus Dengan Revisi Minor"
  | "Lulus Dengan Revisi Mayor"
  | "Tidak Lulus"
  | "Perlu Revisi";

export interface TakenHearing {
  id: number;
  hearingId: number;
  hearingName: string;
  hearingType: HearingType;
  proposalId: number;
  proposalTitle: string;
  status: HearingStatus;

  /**
   * Hasil sidang (khususnya relevan ketika status = "Sidang Selesai")
   * Contoh yang wajib didukung:
   * - "Lulus Dengan Revisi Minor" (Proposal)
   * - "Lulus Dengan Revisi Minor" (Final)
   */
  result?: HearingResult;

  date?: string;
  time?: string;
  location?: string;
  onlineStatus?: "Online" | "Offline";
  examiner1?: string;
  examiner2?: string;
  examiner3?: string;
  examiner?: string;
  revisionDeadline?: string;
  revisionNotes?: string;
  revisionFile?: File | null;
  revisionFileName?: string;
}

interface SidangProps {
  onChooseHearing: () => void;
  takenHearings: TakenHearing[];
  onViewHearingDetail: (hearing: TakenHearing) => void;
  onCompleteProposalDefense: (proposalId: number) => void;
}

export function Sidang({ onChooseHearing, takenHearings, onViewHearingDetail, onCompleteProposalDefense }: SidangProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const getStatusColor = (status: HearingStatus) => {
    switch (status) {
      case "Menunggu Sidang":
        return "bg-amber-100 text-amber-700";
      case "Sidang Selesai":
        return "bg-green-100 text-green-700";
      case "Revisi":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusLabel = (hearing: TakenHearing) => {
    if (hearing.status === "Sidang Selesai" && hearing.result) {
      return `${hearing.status} • ${hearing.result}`;
    }
    return hearing.status;
  };

  // Parse Indonesian date format
  const parseIndonesianDate = (dateStr: string) => {
    const months: { [key: string]: number } = {
      januari: 0,
      februari: 1,
      maret: 2,
      april: 3,
      mei: 4,
      juni: 5,
      juli: 6,
      agustus: 7,
      september: 8,
      oktober: 9,
      november: 10,
      desember: 11,
    };

    const parts = dateStr.toLowerCase().split(" ");
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    return new Date(dateStr);
  };

  // Check for upcoming revision deadlines
  const upcomingRevisionDeadlines = takenHearings.filter((hearing) => {
    if (!hearing.revisionDeadline || hearing.status !== "Revisi" || hearing.revisionFile) return false;

    const deadline = parseIndonesianDate(hearing.revisionDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  });

  const [showDetail, setShowDetail] = useState<TakenHearing | null>(null);

  return (
    <>
      <main className="flex-1 p-6 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-800 font-[Poppins] text-[24px]">Sidang</h1>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-[Poppins]">Panduan Penggunaan</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 font-[Roboto]">Kelola jadwal dan informasi sidang Anda</p>
          </div>

          {/* SECTION: Memilih Sidang (CTA) */}
          <div className="bg-white rounded-lg border border-dashed border-blue-300 p-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-gray-800 font-[Poppins] text-[16px] mb-1">Memilih & Mendaftar Sidang</h2>
              <p className="text-xs text-gray-500 font-[Roboto]">
                Pilih jadwal sidang proposal atau sidang akhir yang tersedia sesuai status tugas akhir Anda.
              </p>
            </div>
            <button
              onClick={onChooseHearing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-[Inter] hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Memilih Sidang
            </button>
          </div>

          {/* Revision Deadline Reminder */}
          {upcomingRevisionDeadlines.length > 0 && (
            <div className="bg-red-50 rounded-lg border border-red-300 p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-red-900 font-[Poppins] mb-2 font-semibold">Peringatan: Deadline Revisi</h3>
                  {upcomingRevisionDeadlines.map((hearing) => {
                    const deadline = parseIndonesianDate(hearing.revisionDeadline!);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    deadline.setHours(0, 0, 0, 0);
                    const diffTime = deadline.getTime() - today.getTime();
                    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return (
                      <div key={hearing.id} className="mb-2 last:mb-0">
                        <p className="text-sm text-red-800 font-[Roboto]">
                          <strong>{hearing.hearingName}</strong> - Deadline: <strong>{hearing.revisionDeadline}</strong>
                        </p>
                        <p className="text-xs text-red-700 font-[Roboto]">
                          {daysLeft === 0
                            ? "Deadline hari ini!"
                            : daysLeft === 1
                              ? "Tersisa 1 hari lagi"
                              : `Tersisa ${daysLeft} hari lagi`}{" "}
                          - Harap segera kumpulkan file revisi.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Hearing Reminder */}
          {(() => {
            const upcomingHearings = takenHearings.filter((hearing) => {
              if (!hearing.date || hearing.status !== "Menunggu Sidang") return false;

              // Parse the hearing date
              const hearingDate = parseIndonesianDate(hearing.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              hearingDate.setHours(0, 0, 0, 0);

              const diffTime = hearingDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              // Show if hearing is within next 7 days or today
              return diffDays >= 0 && diffDays <= 7;
            });

            if (upcomingHearings.length === 0) return null;

            return (
              <div className="bg-yellow-50 rounded-lg border border-yellow-300 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-yellow-900 font-[Poppins] mb-3 font-semibold">Menunggu Sidang: Jadwal Mendatang</h3>

                    {upcomingHearings.map((hearing) => {
                      const hearingDate = parseIndonesianDate(hearing.date!);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      hearingDate.setHours(0, 0, 0, 0);

                      const diffTime = hearingDate.getTime() - today.getTime();
                      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                      return (
                        <div key={hearing.id} className="bg-white rounded-lg p-4 mb-3 last:mb-0 border border-yellow-100">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-sm text-gray-800 font-[Poppins] mb-2">{hearing.hearingName}</h4>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-5 h-5 text-gray-500" />
                                  <span className="text-lg text-gray-800 font-[Poppins] font-semibold">{hearing.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-700 font-[Roboto]">{hearing.time || "-"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-700 font-[Roboto]">{hearing.location || "-"}</span>
                                </div>
                                {(hearing.examiner1 || hearing.examiner2 || hearing.examiner3) && (
                                  <div className="flex items-start gap-2 mt-2">
                                    <Users className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <div className="text-xs text-gray-600 font-[Roboto]">
                                      <p className="mb-0.5">Dosen Penguji:</p>
                                      <ul className="list-disc list-inside space-y-0.5">
                                        {hearing.examiner1 && <li>{hearing.examiner1}</li>}
                                        {hearing.examiner2 && <li>{hearing.examiner2}</li>}
                                        {hearing.examiner3 && <li>{hearing.examiner3}</li>}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-base font-[Poppins] font-semibold whitespace-nowrap shadow-md">
                                {daysUntil === 0 ? "Hari Ini!" : daysUntil === 1 ? "Besok" : `${daysUntil} Hari Lagi!`}
                              </div>
                              <button
                                onClick={() => onViewHearingDetail(hearing)}
                                className="text-xs text-yellow-600 hover:text-yellow-700 font-[Roboto] hover:underline"
                              >
                                Lihat Detail →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* My Hearings Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-gray-800 font-[Poppins] text-[18px] mb-4">Sidang Saya</h2>

            {takenHearings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-[Roboto]">Belum ada sidang yang diambil</p>
                <p className="text-xs text-gray-400 font-[Roboto] mt-1">Pilih jadwal sidang untuk memulai</p>
              </div>
            ) : (
              <div className="space-y-3">
                {takenHearings.map((hearing) => (
                  <div
                    key={hearing.id}
                    onClick={() => onViewHearingDetail(hearing)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-[Roboto] text-gray-800 mb-1">{hearing.hearingName}</h3>
                        <p className="text-xs text-gray-600 font-[Roboto] mb-2">Topik: {hearing.proposalTitle}</p>
                        {hearing.date && hearing.time && (
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span className="font-[Roboto]">{hearing.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span className="font-[Roboto]">{hearing.time}</span>
                            </div>
                          </div>
                        )}
                        <span className={`inline-block px-2 py-1 rounded text-xs font-[Roboto] ${getStatusColor(hearing.status)}`}>
                          {getStatusLabel(hearing)}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
          </footer>
        </div>
      </main>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title="Panduan Penggunaan - Sidang"
        steps={[
          {
            title: "Tentang Sidang",
            description:
              "Halaman ini menampilkan jadwal sidang yang tersedia dan sidang yang telah Anda daftarkan. Kelola jadwal sidang proposal dan sidang akhir Anda di sini. Sistem akan memberikan reminder untuk sidang mendatang dan deadline revisi.",
            imageUrl:
              "https://images.unsplash.com/photo-1697650230856-e5b0f9949feb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWZlbnNlJTIwcHJlc2VudGF0aW9uJTIwbWVldGluZ3xlbnwxfHx8fDE3NjM3MTI0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Memilih & Mendaftar Sidang",
            description:
              "Klik 'Memilih Sidang' untuk melihat jadwal sidang yang tersedia. Pastikan proposal Anda berstatus 'Siap Daftar Sidang' sebelum mendaftar. Pilih jadwal yang sesuai, lalu pilih proposal yang akan didaftarkan. Sistem akan mengkonfirmasi pendaftaran Anda.",
            imageUrl:
              "https://images.unsplash.com/photo-1617106399900-61a7561d1d2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hlZHVsZSUyMGNhbGVuZGFyJTIwcGxhbm5pbmd8ZW58MXx8fHwxNzYzNzEyNDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Revisi & Deadline",
            description:
              "Setelah sidang dilaksanakan, jika ada revisi yang diperlukan, sistem akan menampilkan status 'Revisi' dengan deadline yang harus dipenuhi. Unggah file revisi sebelum deadline. Sistem memberikan reminder merah untuk deadline dalam 3 hari.",
            imageUrl:
              "https://images.unsplash.com/photo-1632152053640-da3a8b3ee812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXZpc2lvbiUyMGRvY3VtZW50cyUyMGNoZWNrbGlzdHxlbnwxfHx8fDE3NjM3MTI0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Sidang Selesai & Lanjut",
            description:
              "Setelah sidang selesai dan revisi telah diselesaikan, status berubah menjadi 'Sidang Selesai'. Untuk sidang proposal yang lulus, tugas akhir Anda akan berpindah ke tahap final dan dapat didaftarkan untuk sidang akhir di periode berikutnya.",
            imageUrl:
              "https://images.unsplash.com/photo-1629196753813-8b4827ddc7c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwc3VjY2VzcyUyMGNlcmVtb255fGVufDF8fHx8MTc2MzcxMjQzOXww&ixlib=rb-4.1.0&q=80&w=1080",
          },
        ]}
      />
    </>
  );
}