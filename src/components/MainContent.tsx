import { ChevronLeft, ChevronRight, Megaphone, ArrowRight, ClipboardList, Bell, BookOpen, X, Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
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
}

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

export function MainContent({ onNavigate, proposals, takenHearings, onEditProposal, onViewHearingDetail, announcements }: MainContentProps) {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

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

  // Get latest proposal (most recent one)
  const latestProposal = proposals.length > 0 ? proposals[proposals.length - 1] : null;
  
  // Get latest hearing (most recent one)
  const latestHearing = takenHearings.length > 0 ? takenHearings[takenHearings.length - 1] : null;

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
    <main className="flex-1 p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gray-800 text-2xl font-[Poppins] font-medium font-bold">Selamat datang, Bintang Wibi Hanoraga</h1>
          <button onClick={() => setIsGuideModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
            <BookOpen className="w-4 h-4" />
            <span className="font-[Poppins]">Panduan Penggunaan</span>
          </button>
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
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={currentAnnouncementIndex}
                    custom={direction}
                    initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <h3 className="text-gray-800 mb-1 font-[Poppins]">
                      {announcements[currentAnnouncementIndex].title}
                    </h3>

                    <p className="text-xs text-gray-400 font-[Roboto]">{announcements[currentAnnouncementIndex].date}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">

                <button onClick={handlePrevious} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={handleNext} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Reminder Cards */}
          {(() => {
            const incompleteDraft = proposals.find(p => p.isDraft && p.missingFields && p.missingFields.length > 0);
            
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
            
            const upcomingRevisionDeadlines = takenHearings.filter(hearing => {
              if (!hearing.revisionDeadline || hearing.status !== "Revisi" || hearing.revisionFile) return false;
              
              const deadline = parseIndonesianDate(hearing.revisionDeadline);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              deadline.setHours(0, 0, 0, 0);
              
              const diffTime = deadline.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 3 && diffDays >= 0;
            });

            // Find proposals waiting for approval
            const waitingApproval = proposals.find(p => p.status === "Menunggu Persetujuan");
            
            return (
              <>
                {/* Waiting for Approval - Compact Version */}
                {waitingApproval && (
                  <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-300 p-4 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
                        <Bell className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-yellow-900 mb-2 font-[Poppins] font-semibold">
                          Status Persetujuan Proposal
                        </h3>
                        <div className="flex items-center gap-3 mb-2">
                          {/* Compact Avatars */}
                          <div className="flex items-center -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                              <span className="text-white text-xs font-[Poppins]">P1</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                              <span className="text-white text-xs font-[Poppins]">P2</span>
                            </div>
                          </div>
                          <span className="text-xs text-yellow-800 font-[Roboto]">
                            Menunggu persetujuan dari 2 pihak
                          </span>
                        </div>
                        <p className="text-xs text-yellow-700 font-[Roboto]">
                          Proposal sedang ditinjau oleh Pembimbing 1 dan Pembimbing 2
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
                {incompleteDraft && (
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
                          Anda belum mengumpulkan proposal, mohon isi untuk menyelesaikan ajuan topik
                        </p>
                        {incompleteDraft.missingFields && incompleteDraft.missingFields.length > 0 && (
                          <p className="text-xs text-red-700 font-[Roboto]">
                            Field yang belum lengkap: {incompleteDraft.missingFields.join(", ")}
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
                {upcomingRevisionDeadlines.length > 0 && (
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
                                {daysLeft === 0 ? "Deadline hari ini!" : daysLeft === 1 ? "Tersisa 1 hari lagi" : `Tersisa ${daysLeft} hari lagi`} - Harap segera kumpulkan file revisi.
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

                {/* Sidang Status Reminders */}
                <SidangReminderCards 
                  takenHearings={takenHearings} 
                  onViewHearingDetail={onViewHearingDetail} 
                />

                {/* Upcoming Hearing Reminder */}
                {(() => {
                  const upcomingHearings = takenHearings.filter(hearing => {
                    if (!hearing.date || hearing.status !== "Menunggu Sidang") return false;
                    
                    const hearingDate = parseIndonesianDate(hearing.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    hearingDate.setHours(0, 0, 0, 0);
                    
                    const diffTime = hearingDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return diffDays >= 0 && diffDays <= 7;
                  });

                  if (upcomingHearings.length === 0) return null;

                  const nextHearing = upcomingHearings[0];
                  const hearingDate = parseIndonesianDate(nextHearing.date!);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  hearingDate.setHours(0, 0, 0, 0);
                  const diffTime = hearingDate.getTime() - today.getTime();
                  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
                            <span className="text-base text-yellow-900 font-[Poppins] font-semibold">{nextHearing.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-700" />
                            <span className="text-sm text-yellow-800 font-[Roboto]">{nextHearing.time || "-"}</span>
                            {nextHearing.location && (
                              <>
                                <span className="text-yellow-400 mx-1">•</span>
                                <MapPin className="w-4 h-4 text-yellow-700" />
                                <span className="text-sm text-yellow-800 font-[Roboto]">{nextHearing.location}</span>
                              </>
                            )}
                          </div>
                          {upcomingHearings.length > 1 && (
                            <p className="text-xs text-yellow-700 font-[Roboto] mt-2">
                              +{upcomingHearings.length - 1} sidang lainnya minggu ini
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 self-center">
                          <div className="bg-yellow-600 text-white px-4 py-2.5 rounded-lg text-base font-[Poppins] font-semibold whitespace-nowrap shadow-md">
                            {daysUntil === 0 ? "Hari Ini!" : daysUntil === 1 ? "Besok" : `${daysUntil} Hari Lagi!`}
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
          <h2 className="text-gray-800 mb-4 font-[Poppins] text-[16px] font-bold font-normal">Menu Utama</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Tugas Akhir Card */}
            <div 
              onClick={() => onNavigate("tugas-akhir")}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center mb-3">
                  <ClipboardList className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-gray-800 mb-1 font-[Poppins]">Tugas Akhir</h3>
                <p className="text-sm text-gray-500 font-[Roboto]">Kelola Tugas Akhir Anda</p>
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
                  onNavigate("tugas-akhir");
                }
              }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="4" y="3" width="12" height="14" rx="1" stroke="#3B82F6" strokeWidth="1.5" fill="none"/>
                    <line x1="7" y1="6" x2="13" y2="6" stroke="#3B82F6" strokeWidth="1.5"/>
                    <line x1="7" y1="9" x2="13" y2="9" stroke="#3B82F6" strokeWidth="1.5"/>
                    <line x1="7" y1="12" x2="10" y2="12" stroke="#3B82F6" strokeWidth="1.5"/>
                  </svg>
                  <h3 className="text-gray-800 font-[Poppins]">Tugas Akhir Terkini</h3>
                </div>
                {latestProposal ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-800 mb-1 font-[Roboto]">{truncateText(latestProposal.title.toUpperCase(), 35)}</p>
                      <p className="text-xs text-gray-500 font-[Roboto]">Laboratorium: {latestProposal.laboratory}</p>
                      <p className="text-xs text-gray-500 font-[Roboto]">Pembimbing 1: {truncateText(latestProposal.supervisor1, 30)}</p>
                      <p className="text-xs text-gray-500 font-[Roboto]">Pembimbing 2: {truncateText(latestProposal.supervisor2, 30)}</p>
                    </div>
                    <button className="text-xs text-blue-500 hover:underline bg-blue-50 px-3 py-1.5 rounded font-[Inter]">
                      {latestProposal.status}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-[Roboto] italic">Belum ada tugas akhir yang dibuat</p>
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
                  onNavigate("sidang");
                }
              }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="5" width="14" height="10" rx="1" stroke="#3B82F6" strokeWidth="1.5" fill="none"/>
                    <line x1="3" y1="7" x2="17" y2="7" stroke="#3B82F6" strokeWidth="1.5"/>
                    <circle cx="6" cy="3" r="1" fill="#3B82F6"/>
                    <circle cx="10" cy="3" r="1" fill="#3B82F6"/>
                    <circle cx="14" cy="3" r="1" fill="#3B82F6"/>
                  </svg>
                  <h3 className="text-gray-800 font-[Poppins]">Sidang Terkini</h3>
                </div>
                {latestHearing ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-800 mb-1 font-[Roboto]">Periode Sidang : {truncateText(latestHearing.hearingName, 35)}</p>
                      <p className="text-xs text-gray-500 font-[Roboto]">Pelaksanaan : Offline</p>
                      <p className="text-xs text-gray-500 font-[Roboto]">Waktu Pelaksanaan : {latestHearing.date ? latestHearing.date + " " + (latestHearing.time || "") : "-"}</p>
                      <p className="text-xs text-gray-500 font-[Roboto]">Ruangan : {latestHearing.location || "-"}</p>
                    </div>
                    <button className="text-xs text-blue-500 hover:underline bg-blue-50 px-2 py-1 rounded font-[Inter]">
                      {latestHearing.status === "Menunggu Sidang" ? "Dijadwalkan" : "Selesai"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-[Roboto] italic">Belum ada sidang yang terdaftar</p>
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
        <p className="text-sm text-gray-500">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
      </footer>
    </main>

    {/* Guide Modal */}
    <GuideModal
      isOpen={isGuideModalOpen}
      onClose={() => setIsGuideModalOpen(false)}
      title="Panduan Penggunaan - Beranda"
      steps={[
        {
          title: "Selamat Datang di myITS Thesis",
          description: "Sistem Pengelolaan Tugas Akhir untuk mengelola tugas akhir dan sidang mahasiswa Institut Teknologi Sepuluh Nopember. Platform ini dirancang untuk memudahkan proses pengajuan, persetujuan, dan pelaksanaan tugas akhir Anda.",
          imageUrl: "https://images.unsplash.com/photo-1614492898637-435e0f87cef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBob21lcGFnZXxlbnwxfHx8fDE3NjM2MzkxMTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Menu Utama & Fitur",
          description: "Beranda menampilkan pengumuman terbaru, reminder penting, dan menu utama. Anda dapat mengakses Tugas Akhir Terkini dan Sidang Terkini langsung dari halaman ini untuk melihat status terkini proposal dan jadwal sidang Anda.",
          imageUrl: "https://images.unsplash.com/photo-1614492898637-435e0f87cef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBob21lcGFnZXxlbnwxfHx8fDE3NjM2MzkxMTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Tugas Akhir & Proposal",
          description: "Kelola proposal tugas akhir Anda dengan mudah. Lakukan ajuan topik, lengkapi dokumen, dan tunggu persetujuan dari Pembimbing 1, Pembimbing 2, dan Admin. Sistem akan memberikan reminder otomatis untuk form yang belum lengkap.",
          imageUrl: "https://images.unsplash.com/photo-1721379805142-faaa28ab1424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMGZvcm0lMjB3cml0aW5nfGVufDF8fHx8MTc2MzYzOTExOXww&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Sidang & Presentasi",
          description: "Daftarkan diri pada periode sidang yang tersedia. Setelah jadwal ditentukan, Anda akan mendapat notifikasi dan reminder. Ikuti sidang sesuai jadwal, dan jika ada revisi, kumpulkan dokumen sebelum deadline yang ditentukan.",
          imageUrl: "https://images.unsplash.com/photo-1697650230856-e5b0f9949feb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBkZWZlbnNlJTIwbWVldGluZ3xlbnwxfHx8fDE3NjM2MzkxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Tips & Perhatian",
          description: "Pastikan Anda selalu memeriksa Pengumuman dan Reminder secara berkala untuk tidak melewatkan informasi penting. Perhatikan deadline revisi dan jadwal sidang. Lengkapi semua dokumen yang diperlukan sebelum batas waktu yang ditentukan.",
          imageUrl: "https://images.unsplash.com/photo-1620632889724-f1ddc7841c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHByb3ZhbCUyMGNoZWNrbGlzdCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzYzNjM5MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ]}
    />
    </>
  );
}