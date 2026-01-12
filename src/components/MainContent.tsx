import {
  ChevronLeft,
  ChevronRight,
  Megaphone,
  ArrowRight,
  ClipboardList,
  Bell,
  BookOpen,
  X,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GuideModal } from "./GuideModal";
import { SidangReminderCards } from "./SidangReminderCards";

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
}

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

  // Approval sidang fields
  supervisor1Approval?: "pending" | "approved" | "rejected";
  supervisor2Approval?: "pending" | "approved" | "rejected";
  adminApproval?: "pending" | "approved" | "rejected";
  supervisor1ApprovalDate?: string;
  supervisor2ApprovalDate?: string;
  adminApprovalDate?: string;

  date?: string;
  time?: string;
  location?: string;
  onlineStatus?: "Online" | "Offline";
  examiner1?: string;
  examiner2?: string;
  examiner3?: string;

  // Revision approval fields
  examiner1RevisionApproval?: "pending" | "approved" | "rejected";
  examiner2RevisionApproval?: "pending" | "approved" | "rejected";
  examiner3RevisionApproval?: "pending" | "approved" | "rejected";
  examiner1RevisionApprovalDate?: string;
  examiner2RevisionApprovalDate?: string;
  examiner3RevisionApprovalDate?: string;

  revisionDeadline?: string;
  revisionNotes?: string;
  revisionFile?: File | null;
  revisionFileName?: string;
}

interface Announcement {
  id: number;
  title: string;
  category: "Penting" | "Info" | "Acara" | "Deadline" | "Sistem";
  date: string;
  content: string;
  imageUrl: string;
  isNew: boolean;
}

interface MainContentProps {
  onNavigate: (page: string) => void;
  proposals: Proposal[];
  takenHearings: TakenHearing[];
  onEditProposal: (proposal: Proposal) => void;
  onViewHearingDetail: (hearing: TakenHearing) => void;
  announcements: Announcement[];
}

interface Question {
  id: number;
  name: string;
  nrp: string;
  category: "Teknis" | "Administrasi" | "Bimbingan" | "Sidang" | "Lainnya";
  question: string;
  date: string;
  status: "pending" | "answered";
  answer?: string;
}

const TIMELINE_STEPS = [
  { label: "Mendaftar proposal TA" }, // 0
  { label: "Proposal TA disetujui" }, // 1
  { label: "Mendaftar sidang proposal TA" }, // 2
  { label: "Daftar sidang proposal TA disetujui" }, // 3
  { label: "Sidang proposal TA selesai" }, // 4
  { label: "Revisi sidang proposal TA disetujui" }, // 5
  { label: "Mendaftar tugas akhir" }, // 6
  { label: "Tugas akhir disetujui" }, // 7
  { label: "Mendaftar sidang tugas akhir" }, // 8
  { label: "Daftar Sidang tugas akhir disetujui" }, // 9
  { label: "Sidang tugas akhir selesai" }, // 10
  { label: "Revisi tugas akhir disetujui" }, // 11
  { label: "Selesai" }, // 12
];

const PROPOSAL_TIMELINE_STEPS = TIMELINE_STEPS.slice(0, 6);

const MAIN_STUDENT_TIMELINE_DATES: (string | null)[] = [
  "2025-01-02", // Mendaftar proposal TA
  "2025-01-10", // Proposal TA disetujui
  "2025-01-20", // Mendaftar sidang proposal TA
  null, // Daftar sidang proposal TA disetujui
  null, // Sidang proposal TA selesai
  null, // Revisi sidang proposal TA disetujui
];

const formatTimelineDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "Belum selesai";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCurrentTimelineStepIndex = (
  dates: (string | null | undefined)[]
): number => {
  if (!dates || dates.length === 0) return -1;
  let idx = -1;
  const len = Math.min(dates.length, TIMELINE_STEPS.length);
  for (let i = 0; i < len; i++) {
    if (dates[i]) idx = i;
  }
  return idx;
};

export function MainContent({
  onNavigate,
  proposals,
  takenHearings,
  onEditProposal,
  onViewHearingDetail,
  announcements,
}: MainContentProps) {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      name: "Bintang Wibi Hanoraga",
      nrp: "5025221034",
      category: "Teknis",
      question:
        "Bagaimana alur lengkap dari pengajuan proposal hingga sidang proposal di myITS Thesis?",
      date: "1 Des 2025, 09:15",
      status: "answered",
      answer:
        "Alur dimulai dari mendaftar proposal TA, menunggu persetujuan pembimbing, mendaftar sidang proposal, kemudian menunggu penetapan jadwal sidang. Detail alur dapat dilihat pada menu Tugas Akhir dan Sidang.",
    },
  ]);

  const [questionName, setQuestionName] = useState("");
  const [questionNrp, setQuestionNrp] = useState("");
  const [questionCategory, setQuestionCategory] =
    useState<Question["category"]>("Teknis");
  const [questionText, setQuestionText] = useState("");

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentAnnouncementIndex((prev) =>
      prev === 0 ? announcements.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentAnnouncementIndex((prev) =>
      prev === announcements.length - 1 ? 0 : prev + 1
    );
  };

  const handleSubmitQuestion = () => {
    if (!questionName.trim() || !questionNrp.trim() || !questionText.trim()) {
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newQuestion: Question = {
      id: questions.length > 0 ? questions[questions.length - 1].id + 1 : 1,
      name: questionName.trim(),
      nrp: questionNrp.trim(),
      category: questionCategory,
      question: questionText.trim(),
      date: formattedDate,
      status: "pending",
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setQuestionText("");
  };

  const answeredQuestions = questions
    .filter((q) => q.status === "answered")
    .slice()
    .sort((a, b) => b.id - a.id);

  const submittedQuestions = questions
    .filter((q) => q.status === "pending")
    .slice()
    .sort((a, b) => b.id - a.id);

  // Get latest proposal (most recent one)
  const latestProposal =
    proposals.length > 0 ? proposals[proposals.length - 1] : null;

  // Get latest hearing (most recent one)
  const latestHearing =
    takenHearings.length > 0 ? takenHearings[takenHearings.length - 1] : null;

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const currentTimelineIndex = getCurrentTimelineStepIndex(
    MAIN_STUDENT_TIMELINE_DATES
  );

  return (
    <>
      <main className="flex-1 p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-medium font-bold">
              Selamat datang, Bintang Wibi Hanoraga
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsQuestionModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="font-[Poppins]">Ajukan Pertanyaan</span>
              </button>
              <button
                onClick={() => setIsTimelineModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span className="font-[Poppins]">Lihat Timeline</span>
              </button>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-[Poppins]">Panduan Penggunaan</span>
              </button>
            </div>
          </div>

          {/* Pengumuman Terbaru */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800 font-[Poppins]">Pengumuman Terbaru</h2>
              <button
                onClick={() => onNavigate("Pengumuman")}
                className="text-sm text-blue-600 hover:text-blue-700 font-[Roboto] hover:underline"
              >
                Lihat Semua →
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={currentAnnouncementIndex}
                      custom={direction}
                      initial={{
                        x: direction > 0 ? 100 : -100,
                        opacity: 0,
                      }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{
                        x: direction > 0 ? -100 : 100,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <h3 className="text-gray-800 mb-1 font-[Poppins]">
                        {announcements[currentAnnouncementIndex].title}
                      </h3>

                      <p className="text-xs text-gray-400 font-[Roboto]">
                        {announcements[currentAnnouncementIndex].date}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handlePrevious}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Reminder Cards */}
            {(() => {
              const incompleteDraft = proposals.find(
                (p) => p.isDraft && p.missingFields && p.missingFields.length > 0
              );

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

              // Deadline revisi
              const upcomingRevisionDeadlines = takenHearings.filter(
                (hearing) => {
                  if (
                    !hearing.revisionDeadline ||
                    hearing.status !== "Revisi" ||
                    hearing.revisionFile
                  )
                    return false;

                  const deadline = parseIndonesianDate(
                    hearing.revisionDeadline
                  );
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  deadline.setHours(0, 0, 0, 0);

                  const diffTime = deadline.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 3 && diffDays >= 0;
                }
              );

              // --- LOGIC UTAMA (Fixed) ---

              // 1. Cek jika ada yang menunggu approval proposal
              const waitingApproval = proposals.find(
                (p) => p.status === "Menunggu Persetujuan"
              );

              // 2. Cek jika siap daftar sidang, TAPI pastikan BELUM diambil sidangnya
              const readyForDefense = proposals.find((p) => {
                const isStatusReady =
                  p.status === "Siap Daftar Sidang" ||
                  p.status === "Siap Daftar Sidang Akhir";

                // Cek apakah proposal ini sudah masuk ke takenHearings dengan tipe yang sesuai
                const isAlreadyTaken = takenHearings.some((h) => {
                  if (h.proposalId !== p.id) return false;
                  // Jika status 'Siap Daftar Sidang', berarti di takenHearings tipenya 'Proposal'
                  if (
                    p.status === "Siap Daftar Sidang" &&
                    h.hearingType === "Proposal"
                  )
                    return true;
                  // Jika status 'Siap Daftar Sidang Akhir', berarti di takenHearings tipenya 'Final'
                  if (
                    p.status === "Siap Daftar Sidang Akhir" &&
                    h.hearingType === "Final"
                  )
                    return true;
                  return false;
                });

                return isStatusReady && !isAlreadyTaken;
              });

              // 3. Cek jika Tugas Akhir sudah SELESAI total
              const completedFinalTA = takenHearings.find(
                (h) =>
                  h.hearingType === "Final" && h.status === "Sidang Selesai"
              );

              return (
                <>
                  {/* CARD: Selamat Anda Telah Lulus (Priority Highest) */}
                  {completedFinalTA && (
                    <div className="bg-green-50 rounded-lg shadow-sm border border-green-300 p-4 mt-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-green-900 mb-1 font-[Poppins] font-semibold">
                            Selamat! Tugas Akhir Selesai
                          </h3>
                          <p className="text-sm text-green-800 font-[Roboto]">
                            Anda telah menyelesaikan seluruh proses Tugas Akhir
                            dan revisi Sidang Akhir telah disetujui.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARD: Siap Daftar Sidang */}
                  {/* Logic: Status Siap DAN belum ambil sidang DAN belum selesai TA */}
                  {readyForDefense && !waitingApproval && !completedFinalTA && (
                    <div className="bg-green-50 rounded-lg shadow-sm border border-green-300 p-4 mt-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-green-900 mb-1 font-[Poppins] font-semibold">
                            {readyForDefense.status ===
                            "Siap Daftar Sidang Akhir"
                              ? "Siap Daftar Sidang Akhir"
                              : "Siap Daftar Sidang Proposal"}
                          </h3>
                          <p className="text-sm text-green-800 font-[Roboto]">
                            Semua persetujuan sudah lengkap. Anda dapat segera
                            mendaftar sidang.
                          </p>
                        </div>
                        <button
                          onClick={() => onNavigate("Sidang")}
                          className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded text-sm flex-shrink-0 font-[Inter] self-center transition-colors"
                        >
                          Daftar Sidang
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CARD: Waiting for Approval Proposal (Draft -> Proposal) */}
                  {waitingApproval && !completedFinalTA && (
                    <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-300 p-4 mt-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
                          <Bell className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-yellow-900 mb-2 font-[Poppins] font-semibold">
                            Status Persetujuan{" "}
                            {waitingApproval.stage === "final"
                              ? "Tugas Akhir"
                              : "Proposal"}
                          </h3>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center -space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                                <span className="text-white text-xs font-[Poppins]">
                                  P1
                                </span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                                <span className="text-white text-xs font-[Poppins]">
                                  P2
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-yellow-800 font-[Roboto]">
                              Menunggu persetujuan
                            </span>
                          </div>
                          <p className="text-xs text-yellow-700 font-[Roboto]">
                            Dokumen sedang ditinjau oleh Dosen Pembimbing.
                          </p>
                        </div>
                        <button
                          onClick={() => onNavigate("Tugas Akhir")}
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded text-sm flex-shrink-0 font-[Inter] self-center transition-colors"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Incomplete Draft Reminder */}
                  {incompleteDraft && !completedFinalTA && (
                    <div className="bg-red-50 rounded-lg shadow-sm border border-red-300 p-4 mt-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                          <Bell className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-red-900 mb-1 font-[Poppins] font-semibold">
                            Reminder: Form Belum Lengkap
                          </h3>
                          <p className="text-sm text-red-800 font-[Roboto] mb-1">
                            Anda belum mengumpulkan proposal, mohon isi untuk
                            menyelesaikan ajuan topik
                          </p>
                          {incompleteDraft.missingFields &&
                            incompleteDraft.missingFields.length > 0 && (
                              <p className="text-xs text-red-700 font-[Roboto]">
                                Field yang belum lengkap:{" "}
                                {incompleteDraft.missingFields.join(", ")}
                              </p>
                            )}
                        </div>
                        <button
                          onClick={() => onEditProposal(incompleteDraft)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm flex-shrink-0 font-[Inter] self-center transition-colors"
                        >
                          Kumpulkan Berkas
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Revision Deadline Reminder */}
                  {upcomingRevisionDeadlines.length > 0 && !completedFinalTA && (
                    <div className="bg-red-50 rounded-lg shadow-sm border border-red-300 p-4 mt-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                          <Bell className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-red-900 mb-1 font-[Poppins] font-semibold">
                            Reminder: Deadline Revisi Sidang
                          </h3>
                          {upcomingRevisionDeadlines.map((hearing) => {
                            const deadline = parseIndonesianDate(
                              hearing.revisionDeadline!
                            );
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            deadline.setHours(0, 0, 0, 0);
                            const diffTime =
                              deadline.getTime() - today.getTime();
                            const daysLeft = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );

                            return (
                              <div key={hearing.id} className="mb-2 last:mb-0">
                                <p className="text-sm text-red-800 font-[Roboto]">
                                  <strong>{hearing.hearingName}</strong> -
                                  Deadline:{" "}
                                  <strong>{hearing.revisionDeadline}</strong>
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
                        <button
                          onClick={() => {
                            const hearing = upcomingRevisionDeadlines[0];
                            if (hearing) {
                              onViewHearingDetail(hearing);
                            }
                          }}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm flex-shrink-0 font-[Inter] self-center transition-colors"
                        >
                          Kumpulkan Revisi
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sidang Status Reminders (Menunggu Approval Sidang, Revisi, dsb) */}
                  {!completedFinalTA && (
                    <SidangReminderCards
                      takenHearings={takenHearings}
                      onViewHearingDetail={onViewHearingDetail}
                    />
                  )}

                  {/* Upcoming Hearing Reminder */}
                  {(() => {
                    const upcomingHearings = takenHearings.filter((hearing) => {
                      if (
                        !hearing.date ||
                        hearing.status !== "Menunggu Sidang"
                      )
                        return false;

                      const hearingDate = parseIndonesianDate(hearing.date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      hearingDate.setHours(0, 0, 0, 0);

                      const diffTime = hearingDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );

                      return diffDays >= 0 && diffDays <= 7;
                    });

                    if (upcomingHearings.length === 0) return null;

                    const nextHearing = upcomingHearings[0];
                    const hearingDate = parseIndonesianDate(nextHearing.date!);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    hearingDate.setHours(0, 0, 0, 0);
                    const diffTime = hearingDate.getTime() - today.getTime();
                    const daysUntil = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-300 p-4 mt-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-yellow-900 mb-2 font-[Poppins] font-semibold">
                              Menunggu Sidang: Jadwal Mendatang
                            </h3>
                            <p className="text-sm text-yellow-800 font-[Roboto] mb-1">
                              <strong>{nextHearing.hearingName}</strong>
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-yellow-700" />
                              <span className="text-base text-yellow-900 font-[Poppins] font-semibold">
                                {nextHearing.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-700" />
                              <span className="text-sm text-yellow-800 font-[Roboto]">
                                {nextHearing.time || "-"}
                              </span>
                              {nextHearing.location && (
                                <>
                                  <span className="text-yellow-400 mx-1">
                                    •
                                  </span>
                                  <MapPin className="w-4 h-4 text-yellow-700" />
                                  <span className="text-sm text-yellow-800 font-[Roboto]">
                                    {nextHearing.location}
                                  </span>
                                </>
                              )}
                            </div>
                            {upcomingHearings.length > 1 && (
                              <p className="text-xs text-yellow-700 font-[Roboto] mt-2">
                                +{upcomingHearings.length - 1} sidang lainnya
                                minggu ini
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 self-center">
                            <div className="bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-base font-[Poppins] font-semibold whitespace-nowrap shadow-md">
                              {daysUntil === 0
                                ? "Hari Ini!"
                                : daysUntil === 1
                                ? "Besok"
                                : `${daysUntil} Hari Lagi!`}
                            </div>
                            <button
                              onClick={() => onViewHearingDetail(nextHearing)}
                              className="text-sm text-yellow-600 hover:text-yellow-700 font-[Roboto] hover:underline"
                            >
                              Lihat Detail →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              );
            })()}
          </div>

          {/* Menu Pokok */}
          <div>
            <h2 className="text-gray-800 mb-4 font-[Poppins] text-[16px] font-bold font-normal">
              Menu Utama
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Tugas Akhir Card */}
              <div
                onClick={() => onNavigate("Tugas Akhir")}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center mb-3">
                    <ClipboardList className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-gray-800 mb-1 font-[Poppins]">
                    Tugas Akhir
                  </h3>
                  <p className="text-sm text-gray-500 font-[Roboto]">
                    Kelola Tugas Akhir Anda
                  </p>
                </div>
                <button className="absolute bottom-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Tugas Akhir Terkini Card */}
              <div
                onClick={() => {
                  if (latestProposal) {
                    onEditProposal(latestProposal);
                  } else {
                    onNavigate("Tugas Akhir");
                  }
                }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect
                        x="4"
                        y="3"
                        width="12"
                        height="14"
                        rx="1"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <line
                        x1="7"
                        y1="6"
                        x2="13"
                        y2="6"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="7"
                        y1="9"
                        x2="13"
                        y2="9"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="7"
                        y1="12"
                        x2="10"
                        y2="12"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <h3 className="text-gray-800 font-[Poppins]">
                      Tugas Akhir Terkini
                    </h3>
                  </div>
                  {latestProposal ? (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-800 mb-1 font-[Roboto]">
                          {truncateText(latestProposal.title.toUpperCase(), 35)}
                        </p>
                        <p className="text-xs text-gray-500 font-[Roboto]">
                          Laboratorium: {latestProposal.laboratory}
                        </p>
                        <p className="text-xs text-gray-500 font-[Roboto]">
                          Pembimbing 1:{" "}
                          {truncateText(latestProposal.supervisor1, 30)}
                        </p>
                        <p className="text-xs text-gray-500 font-[Roboto]">
                          Pembimbing 2:{" "}
                          {truncateText(latestProposal.supervisor2, 30)}
                        </p>
                      </div>
                      <button className="text-xs text-blue-500 hover:underline bg-blue-50 px-3 py-1.5 rounded font-[Inter]">
                        {latestProposal.status}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 font-[Roboto] italic">
                        Belum ada tugas akhir yang dibuat
                      </p>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sidang Terkini Card */}
              <div
                onClick={() => {
                  if (latestHearing) {
                    onViewHearingDetail(latestHearing);
                  } else {
                    onNavigate("Sidang");
                  }
                }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect
                        x="3"
                        y="5"
                        width="14"
                        height="10"
                        rx="1"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <line
                        x1="3"
                        y1="7"
                        x2="17"
                        y2="7"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                      />
                      <circle cx="6" cy="3" r="1" fill="#3B82F6" />
                      <circle cx="10" cy="3" r="1" fill="#3B82F6" />
                      <circle cx="14" cy="3" r="1" fill="#3B82F6" />
                    </svg>
                    <h3 className="text-gray-800 font-[Poppins]">
                      Sidang Terkini
                    </h3>
                  </div>
                  {latestHearing ? (
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-800 mb-1 font-[Roboto]">
                          Periode Sidang :{" "}
                          {truncateText(latestHearing.hearingName, 35)}
                        </p>
                        <p className="text-xs text-gray-500 font-[Roboto]">
                          Pelaksanaan : Offline
                        </p>
                        <p className="text-xs text-gray-500 font-[Roboto]">
                          Waktu Pelaksanaan :{" "}
                          {latestHearing.date
                            ? latestHearing.date +
                              " " +
                              (latestHearing.time || "")
                            : "-"}
                        </p>
                        <p className="text-xs text-gray-500 font-[Roboto]">
                          Ruangan : {latestHearing.location || "-"}
                        </p>
                      </div>
                      <button className="text-xs text-blue-500 hover:underline bg-blue-50 px-2 py-1 rounded font-[Inter]">
                        {latestHearing.status === "Menunggu Sidang"
                          ? "Dijadwalkan"
                          : "Selesai"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 font-[Roboto] italic">
                        Belum ada sidang yang terdaftar
                      </p>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </main>

      {/* Ajukan Pertanyaan Modal */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsQuestionModalOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">
                        Ajukan Pertanyaan
                      </h2>
                      <p className="text-sm text-gray-600 font-[Roboto]">
                        Tulis pertanyaan Anda terkait tugas akhir, administrasi,
                        atau sidang. Jawaban yang sudah diberikan akan muncul
                        pada riwayat pertanyaan.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form Ajukan Pertanyaan */}
                  <div>
                    <h3 className="text-gray-800 font-[Poppins] mb-3">
                      Form Ajukan Pertanyaan
                    </h3>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitQuestion();
                      }}
                    >
                      <div>
                        <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                          Nama
                        </label>
                        <input
                          type="text"
                          value={questionName}
                          onChange={(e) => setQuestionName(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-[Roboto] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                          NRP
                        </label>
                        <input
                          type="text"
                          value={questionNrp}
                          onChange={(e) => setQuestionNrp(e.target.value)}
                          placeholder="Masukkan NRP"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-[Roboto] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                          Kategori Pertanyaan
                        </label>
                        <select
                          value={questionCategory}
                          onChange={(e) =>
                            setQuestionCategory(
                              e.target.value as Question["category"]
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-[Roboto] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="Teknis">Teknis</option>
                          <option value="Administrasi">Administrasi</option>
                          <option value="Bimbingan">Bimbingan</option>
                          <option value="Sidang">Sidang</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-[Roboto] mb-1 block">
                          Pertanyaan
                        </label>
                        <textarea
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          placeholder="Jelaskan pertanyaan Anda dengan jelas..."
                          rows={5}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-[Roboto] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={
                            !questionName.trim() ||
                            !questionNrp.trim() ||
                            !questionText.trim()
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Roboto] text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Kirim Pertanyaan
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Riwayat */}
                  <div>
                    <h3 className="text-gray-800 font-[Poppins] mb-3">
                      Riwayat Pertanyaan
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[360px] overflow-y-auto">
                      {submittedQuestions.length === 0 &&
                      answeredQuestions.length === 0 ? (
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600 font-[Roboto]">
                            Belum ada pertanyaan. Pertanyaan yang Anda kirim
                            akan muncul di sini, dan jawaban dari administrator
                            akan ditampilkan setelah tersedia.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Pending / Terkirim */}
                          {submittedQuestions.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600 font-[Roboto] mb-2">
                                Pertanyaan Terkirim (Menunggu Jawaban)
                              </p>
                              <div className="space-y-3">
                                {submittedQuestions.map((q) => (
                                  <div
                                    key={q.id}
                                    className="bg-white border border-gray-200 rounded-lg p-3"
                                  >
                                    <div className="flex items-start justify-between mb-1">
                                      <p className="text-sm text-gray-800 font-[Poppins]">
                                        {q.name}
                                      </p>
                                      <span className="text-xs text-gray-500 font-[Roboto]">
                                        {q.date}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                                      {q.nrp} • {q.category}
                                    </p>
                                    <p className="text-sm text-gray-800 font-[Roboto] mb-2">
                                      {q.question}
                                    </p>
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                                      <p className="text-sm text-amber-800 font-[Roboto]">
                                        Menunggu jawaban admin.
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Answered */}
                          <div>
                            <p className="text-xs text-gray-600 font-[Roboto] mb-2">
                              Pertanyaan yang Sudah Dijawab
                            </p>
                            {answeredQuestions.length === 0 ? (
                              <div className="flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                                <p className="text-sm text-gray-600 font-[Roboto]">
                                  Belum ada pertanyaan yang dijawab. Pertanyaan
                                  yang telah dijawab administrator akan muncul
                                  di sini.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {answeredQuestions.map((q) => (
                                  <div
                                    key={q.id}
                                    className="bg-white border border-gray-200 rounded-lg p-3"
                                  >
                                    <div className="flex items-start justify-between mb-1">
                                      <p className="text-sm text-gray-800 font-[Poppins]">
                                        {q.name}
                                      </p>
                                      <span className="text-xs text-gray-500 font-[Roboto]">
                                        {q.date}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                                      {q.nrp} • {q.category}
                                    </p>
                                    <p className="text-sm text-gray-800 font-[Roboto] mb-2">
                                      {q.question}
                                    </p>
                                    {q.answer && (
                                      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                                        <p className="text-xs text-gray-500 font-[Roboto] mb-0.5">
                                          Jawaban:
                                        </p>
                                        <p className="text-sm text-gray-800 font-[Roboto]">
                                          {q.answer}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Timeline Modal */}
      <AnimatePresence>
        {isTimelineModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsTimelineModalOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-800 font-[Poppins]">
                        Timeline Proses Tugas Akhir
                      </h2>
                      <p className="text-sm text-gray-600 font-[Roboto]">
                        Tahapan proses dari pengajuan proposal hingga sidang
                        proposal. Tahap setelah sidang proposal dapat dilihat
                        secara detail pada menu Tugas Akhir.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTimelineModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Timeline Proses Proposal */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="space-y-4">
                    {PROPOSAL_TIMELINE_STEPS.map((step, idx) => {
                      const isActive = currentTimelineIndex >= idx;
                      const isNextActive = currentTimelineIndex >= idx + 1;
                      const isLast =
                        idx === PROPOSAL_TIMELINE_STEPS.length - 1;
                      const stepDate = MAIN_STUDENT_TIMELINE_DATES[idx];

                      return (
                        <div
                          key={step.label}
                          className="flex items-start gap-3"
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                isActive
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {idx + 1}
                            </div>
                            {!isLast && (
                              <div
                                className={`w-px flex-1 mt-1 ${
                                  isNextActive ? "bg-blue-600" : "bg-gray-300"
                                }`}
                              />
                            )}
                          </div>
                          <div className="pt-1">
                            <p
                              className={`text-xs font-[Roboto] ${
                                isActive
                                  ? "text-blue-700 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[10px] text-gray-500 font-[Roboto] mt-1">
                              {formatTimelineDate(stepDate ?? null)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-[Roboto]">
                    Catatan: Timeline ini menampilkan tahapan hingga sidang
                    proposal. Tahapan setelahnya (tugas akhir dan sidang tugas
                    akhir) dapat dipantau melalui halaman Tugas Akhir dan
                    Sidang.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title="Panduan Penggunaan - Beranda"
        steps={[
          {
            title: "Selamat Datang di myITS Thesis",
            description:
              "Sistem Pengelolaan Tugas Akhir untuk mengelola tugas akhir dan sidang mahasiswa Institut Teknologi Sepuluh Nopember. Platform ini dirancang untuk memudahkan proses pengajuan, persetujuan, dan pelaksanaan tugas akhir Anda.",
            imageUrl:
              "https://images.unsplash.com/photo-1614492898637-435e0f87cef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBob21lcGFnZXxlbnwxfHx8fDE3NjM2MzkxMTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Menu Utama & Fitur",
            description:
              "Beranda menampilkan pengumuman terbaru, reminder penting, dan menu utama. Anda dapat mengakses Tugas Akhir Terkini dan Sidang Terkini langsung dari halaman ini untuk melihat status terkini proposal dan jadwal sidang Anda.",
            imageUrl:
              "https://images.unsplash.com/photo-1614492898637-435e0f87cef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBob21lcGFnZXxlbnwxfHx8fDE3NjM2MzkxMTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Tugas Akhir & Proposal",
            description:
              "Kelola proposal tugas akhir Anda dengan mudah. Lakukan ajuan topik, lengkapi dokumen, dan tunggu persetujuan dari Pembimbing 1, Pembimbing 2, dan Admin. Sistem akan memberikan reminder otomatis untuk form yang belum lengkap.",
            imageUrl:
              "https://images.unsplash.com/photo-1721379805142-faaa28ab1424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMGZvcm0lMjB3cml0aW5nfGVufDF8fHx8MTc2MzYzOTExOXww&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Sidang & Presentasi",
            description:
              "Daftarkan diri pada periode sidang yang tersedia. Setelah jadwal ditentukan, Anda akan mendapat notifikasi dan reminder. Ikuti sidang sesuai jadwal, dan jika ada revisi, kumpulkan dokumen sebelum deadline yang ditentukan.",
            imageUrl:
              "https://images.unsplash.com/photo-1697650230856-e5b0f9949feb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBkZWZlbnNlJTIwbWVldGluZ3xlbnwxfHx8fDE3NjM2MzkxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
          {
            title: "Tips & Perhatian",
            description:
              "Pastikan Anda selalu memeriksa Pengumuman dan Reminder secara berkala untuk tidak melewatkan informasi penting. Perhatikan deadline revisi dan jadwal sidang. Lengkapi semua dokumen yang diperlukan sebelum batas waktu yang ditentukan.",
            imageUrl:
              "https://images.unsplash.com/photo-1620632889724-f1ddc7841c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHByb3ZhbCUyMGNoZWNrbGlzdCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzYzNjM5MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
          },
        ]}
      />
    </>
  );
}