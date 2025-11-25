import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { MainContent } from "./components/MainContent";
import { BerandaDosen } from "./components/BerandaDosen";
import { PenawaranTopik } from "./components/PenawaranTopik";
import { PenawaranTopikDosen } from "./components/PenawaranTopikDosen";
import { TopicDetail } from "./components/TopicDetail";
import { TugasAkhir } from "./components/TugasAkhir";
import { ProposalForm } from "./components/ProposalForm";
import { Sidang } from "./components/Sidang";
import { MemilihSidang, Hearing } from "./components/MemilihSidang";
import { SidangDetail } from "./components/SidangDetail";
import { MySidangDetail } from "./components/MySidangDetail";
import { Panduan } from "./components/Panduan";
import { Pengumuman } from "./components/Pengumuman";
import { Toaster } from "./components/ui/sonner";
import { ViewPenawaranTopikDosen } from "./components/ViewPenawaranTopikDosen";
import { CatatanBimbingan } from "./components/CatatanBimbingan";

interface Topic {
  id: number;
  title: string;
  supervisor: string;
  supervisor2?: string;
  category: string;
  status: "Tersedia" | "Diambil";
  description: string;
  minimalKnowledge: string[];
  interestedStudents: string[];
}

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

  // Approval fields
  supervisor1Approval?: "pending" | "approved" | "rejected";
  supervisor2Approval?: "pending" | "approved" | "rejected";
  adminApproval?: "pending" | "approved" | "rejected";
  supervisor1ApprovalDate?: string;
  supervisor2ApprovalDate?: string;
  adminApprovalDate?: string;
  approvalDeadline?: string;
}

export default function App() {
  const [selectedAnnouncementId, setSelectedAnnouncementId] =
    useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState("Beranda");
  const [userRole, setUserRole] = useState<"Mahasiswa" | "Dosen">("Mahasiswa");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [takenHearings, setTakenHearings] = useState<TakenHearing[]>([]);
  const [selectedHearing, setSelectedHearing] = useState<Hearing | null>(null);
  const [selectedTakenHearing, setSelectedTakenHearing] =
    useState<TakenHearing | null>(null);

  const [guidanceContext, setGuidanceContext] = useState<{
    stage: "proposal" | "final";
    title: string;
    status: string;
    supervisor1: string;
    supervisor2: string;
  } | null>(null);

  // Announcements data
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "Perubahan Jadwal Sidang Proposal Gelombang 2",
      category: "Penting",
      date: "20 November 2024",
      content:
        "Jadwal sidang proposal gelombang 2 mengalami perubahan dari tanggal 25 November menjadi 28 November 2024. Mahasiswa yang telah mendaftar sidang diharapkan untuk menyesuaikan jadwal. Konfirmasi ulang akan dikirimkan melalui email resmi masing-masing. Untuk informasi lebih lanjut, silakan hubungi sekretariat program studi.",
      imageUrl:
        "https://images.unsplash.com/photo-1649645669515-85299ad3688b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGVydCUyMHdhcm5pbmclMjBub3RpZmljYXRpb258ZW58MXx8fHwxNzYzNzEzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      isNew: true,
    },
    {
      id: 2,
      title: "Batas Waktu Pengumpulan Proposal Semester Gasal 2024/2025",
      category: "Deadline",
      date: "18 November 2024",
      content:
        "Batas akhir pengumpulan proposal tugas akhir untuk semester gasal 2024/2025 adalah tanggal 30 November 2024 pukul 23:59 WIB. Proposal yang terlambat dikumpulkan tidak akan diproses dan harus menunggu periode berikutnya. Pastikan semua dokumen sudah lengkap dan telah mendapatkan persetujuan dari dosen pembimbing sebelum dikumpulkan.",
      imageUrl:
        "https://images.unsplash.com/photo-1624969862293-b749659ccc4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWFkbGluZSUyMGNhbGVuZGFyJTIwcmVtaW5kZXJ8ZW58MXx8fHwxNzYzNzEzMjk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      isNew: true,
    },
    {
      id: 3,
      title: "Seminar Nasional Teknologi Informasi 2024",
      category: "Acara",
      date: "15 November 2024",
      content:
        "Departemen Informatika mengadakan Seminar Nasional Teknologi Informasi dengan tema 'AI and Machine Learning in Modern Era' pada tanggal 5 Desember 2024. Acara ini terbuka untuk mahasiswa S1 dan S2. Pembicara: Prof. Dr. Ahmad Saikhu, M.Kom dan Dr. Retno Wardani, S.Kom, M.T. Pendaftaran dibuka hingga 1 Desember 2024. Fasilitas: sertifikat, coffee break, dan materi seminar.",
      imageUrl:
        "https://images.unsplash.com/photo-1759456629070-8e222ab878ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGV2ZW50JTIwc2VtaW5hcnxlbnwxfHx8fDE3NjM3MTMyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      isNew: false,
    },
    {
      id: 4,
      title: "Pembukaan Penawaran Topik Tugas Akhir Semester Genap",
      category: "Info",
      date: "10 November 2024",
      content:
        "Penawaran topik tugas akhir untuk semester genap 2024/2025 telah dibuka. Mahasiswa dapat melihat daftar topik yang ditawarkan di menu Penawaran Topik. Topik mencakup berbagai bidang: Machine Learning, IoT, Web Development, Mobile Development, dan Cyber Security. Konsultasikan dengan dosen pembimbing untuk pemilihan topik yang sesuai dengan minat dan kemampuan Anda.",
      imageUrl:
        "https://images.unsplash.com/photo-1613059550870-63bbef4744e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnQlMjBub2FyZHxlbnwxfHx8fDE3NjM3MTMyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      isNew: false,
    },
    {
      id: 5,
      title: "Maintenance Sistem myITS Thesis",
      category: "Sistem",
      date: "12 November 2024",
      content:
        "Sistem myITS Thesis akan menjalani maintenance rutin pada hari Minggu, 17 November 2024 pukul 00:00 - 06:00 WIB. Selama periode ini, sistem tidak dapat diakses. Harap melakukan penyimpanan data dan submit proposal sebelum waktu maintenance dimulai. Mohon maaf atas ketidaknyamanannya. Untuk pertanyaan, hubungi tim IT support.",
      imageUrl:
        "https://images.unsplash.com/photo-1758780690553-8bc703fabca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeXN0ZW0lMjBtYWludGVuYW5jZSUyMHVwZGF0ZXxlbnwxfHx8fDE3NjM3MTMyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      isNew: false,
    },
  ];

  // Available hearings data
  const availableHearings: Hearing[] = [
    {
      id: 1,
      name: "Sidang Proposal Gelombang 1",
      type: "Proposal",
      batch: 1,
      period: "Semester Gasal 2025/2026",
      description:
        "Sidang proposal untuk mahasiswa yang telah menyelesaikan pengajuan proposal tugas akhir. Mahasiswa akan mempresentasikan proposal di hadapan dosen penguji.",
      startDate: "15 Oktober 2025",
      endDate: "30 Oktober 2025",
    },
    {
      id: 2,
      name: "Sidang Akhir Gelombang 1",
      type: "Final",
      batch: 1,
      period: "Semester Gasal 2025/2026",
      description:
        "Sidang akhir untuk mahasiswa yang telah menyelesaikan penelitian dan penulisan tugas akhir. Mahasiswa akan mempresentasikan hasil penelitian secara lengkap.",
      startDate: "1 November 2025",
      endDate: "15 November 2025",
    },
    {
      id: 3,
      name: "Sidang Proposal Gelombang 2",
      type: "Proposal",
      batch: 2,
      period: "Semester Genap 2025/2026",
      description:
        "Sidang proposal gelombang kedua untuk mahasiswa yang mengajukan proposal di semester genap.",
      startDate: "1 Februari 2026",
      endDate: "15 Februari 2026",
    },
  ];

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentPage("Topic Detail");
  };

  const handleBackToPenawaran = () => {
    setSelectedTopic(null);
    setCurrentPage("Penawaran Topik");
  };

  const handleCreateProposal = () => {
    setEditingProposal(null);
    setCurrentPage("Proposal Form");
  };

  const handleEditProposal = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setCurrentPage("Proposal Form");
  };

  const handleBackToTugasAkhir = () => {
    setEditingProposal(null);
    setCurrentPage("Tugas Akhir");
  };

  const handleSaveProposal = (proposalData: any, isDraft: boolean) => {
    // Set approval deadline to 3 days from now if submitting (not draft)
    let approvalDeadline;
    if (!isDraft) {
      const today = new Date();
      const deadline = new Date(today);
      deadline.setDate(today.getDate() + 3);
      approvalDeadline = deadline.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    const newProposal: Proposal = {
      id: editingProposal ? editingProposal.id : Date.now(),
      title: proposalData.title,
      category: proposalData.category,
      grouped: proposalData.grouped,
      abstract: proposalData.abstract,
      keywords: proposalData.keywords,
      supervisor1: proposalData.supervisor1,
      supervisor2: proposalData.supervisor2 || "-",
      file: proposalData.file,
      fileName: proposalData.file ? proposalData.file.name : "",
      laboratory: proposalData.category.split(" - ")[0] || "Laboratorium",
      scheduleDate: "",
      scheduleTime: "",
      status: isDraft ? "Draft" : "Menunggu Persetujuan",
      isDraft,
      missingFields: proposalData.missingFields || [],
      stage: editingProposal ? editingProposal.stage : "proposal",

      // Initialize approval fields if not draft
      supervisor1Approval: !isDraft
        ? editingProposal?.supervisor1Approval || "pending"
        : editingProposal?.supervisor1Approval,
      supervisor2Approval: !isDraft
        ? editingProposal?.supervisor2Approval || "pending"
        : editingProposal?.supervisor2Approval,
      adminApproval: !isDraft
        ? editingProposal?.adminApproval || "pending"
        : editingProposal?.adminApproval,
      approvalDeadline: !isDraft
        ? editingProposal?.approvalDeadline || approvalDeadline
        : editingProposal?.approvalDeadline,
      supervisor1ApprovalDate: editingProposal?.supervisor1ApprovalDate,
      supervisor2ApprovalDate: editingProposal?.supervisor2ApprovalDate,
      adminApprovalDate: editingProposal?.adminApprovalDate,
    };

    if (editingProposal) {
      setProposals(
        proposals.map((p) => (p.id === editingProposal.id ? newProposal : p))
      );
    } else {
      setProposals([...proposals, newProposal]);
    }

    setEditingProposal(null);
    setCurrentPage("Tugas Akhir");
  };

  // === Catatan Bimbingan handlers ===
  const handleOpenProposalGuidance = () => {
    const proposal = proposals.find((p) => p.stage === "proposal");
    if (!proposal) return;

    setGuidanceContext({
      stage: "proposal",
      title: proposal.title,
      status: proposal.status,
      supervisor1: proposal.supervisor1,
      supervisor2: proposal.supervisor2,
    });
    setCurrentPage("Catatan Bimbingan");
  };

  const handleOpenFinalGuidance = () => {
    const ta = proposals.find((p) => p.stage === "final");
    if (!ta) return;

    setGuidanceContext({
      stage: "final",
      title: ta.title,
      status: ta.status || "Tugas Akhir - Dalam Pengerjaan",
      supervisor1: ta.supervisor1,
      supervisor2: ta.supervisor2,
    });
    setCurrentPage("Catatan Bimbingan");
  };

  const handleBackFromGuidance = () => {
    setCurrentPage("Tugas Akhir");
  };
  // === END Catatan Bimbingan handlers ===

  const handleApproveAll = () => {
    setProposals(
      proposals.map((p) => {
        if (p.status === "Menunggu Persetujuan") {
          if (p.stage === "proposal") {
            return { ...p, status: "Siap Daftar Sidang" };
          }
          if (p.stage === "final") {
            return { ...p, status: "Siap Daftar Sidang Akhir" };
          }
        }
        return p;
      })
    );
  };

  const handleUpdateProposal = (
    proposalId: number,
    updates: Partial<Proposal>
  ) => {
    setProposals(
      proposals.map((p) =>
        p.id === proposalId ? { ...p, ...updates } : p
      )
    );
  };

  const handleSelectHearing = (hearing: Hearing) => {
    setSelectedHearing(hearing);
    setCurrentPage("Sidang Detail");
  };

  const handleBackToMemilihSidang = () => {
    setSelectedHearing(null);
    setCurrentPage("Memilih Sidang");
  };

  const handleTakeHearing = (hearingId: number, proposalId: number) => {
    const hearing = availableHearings.find((h) => h.id === hearingId);
    const proposal = proposals.find((p) => p.id === proposalId);

    if (!hearing || !proposal) return;

    // Set approval deadline to 3 days from now
    const today = new Date();
    const approvalDeadline = new Date(today);
    approvalDeadline.setDate(today.getDate() + 3);

    const newTakenHearing: TakenHearing = {
      id: Date.now(),
      hearingId: hearing.id,
      hearingName: hearing.name,
      hearingType: hearing.type,
      proposalId: proposal.id,
      proposalTitle: proposal.title,
      status: "Menunggu Approval Sidang",
      proposalCategory: proposal.category,
      proposalAbstract: proposal.abstract,
      supervisor1: proposal.supervisor1,
      supervisor2: proposal.supervisor2,
      approvalDeadline: approvalDeadline.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    setTakenHearings([...takenHearings, newTakenHearing]);
    setSelectedHearing(null);
    setCurrentPage("Sidang");
  };

  const handleViewHearingDetail = (hearing: TakenHearing) => {
    setSelectedTakenHearing(hearing);
    setCurrentPage("My Sidang Detail");
  };

  const handleBackToSidang = () => {
    setSelectedTakenHearing(null);
    setCurrentPage("Sidang");
  };

  const handleChooseHearing = () => {
    setCurrentPage("Memilih Sidang");
  };

  const handleBackToSidangFromMemilih = () => {
    setCurrentPage("Sidang");
  };

  const handleCompleteProposalDefense = (proposalId: number) => {
    // Pindah dari tahap "proposal" ke tahap "final" DAN reset state approval
    setProposals(
      proposals.map((p) => {
        if (p.id !== proposalId) return p;

        return {
          ...p,
          stage: "final",
          status: "Tugas Akhir - Dalam Pengerjaan",
          supervisor1Approval: "pending",
          supervisor2Approval: "pending",
          adminApproval: "pending",
          supervisor1ApprovalDate: undefined,
          supervisor2ApprovalDate: undefined,
          adminApprovalDate: undefined,
          approvalDeadline: undefined,
        };
      })
    );

    // Update status hearing proposal jadi "Sidang Selesai"
    setTakenHearings(
      takenHearings.map((h) =>
        h.proposalId === proposalId && h.hearingType === "Proposal"
          ? { ...h, status: "Sidang Selesai" as const }
          : h
      )
    );
  };

  const handleCompleteFinalDefense = (proposalId: number) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? { ...p, status: "Tugas Akhir Telah Selesai" }
          : p
      )
    );

    setTakenHearings((prev) =>
      prev.map((h) =>
        h.proposalId === proposalId && h.hearingType === "Final"
          ? { ...h, status: "Sidang Selesai" as const }
          : h
      )
    );
  };

  const handleUpdateHearingInfo = (
    hearingId: number,
    info: Partial<TakenHearing>
  ) => {
    setTakenHearings(
      takenHearings.map((h) => (h.id === hearingId ? { ...h, ...info } : h))
    );

    if (selectedTakenHearing && selectedTakenHearing.id === hearingId) {
      setSelectedTakenHearing({ ...selectedTakenHearing, ...info });
    }
  };

  const handleFinishHearing = (
    hearingId: number,
    notes: string,
    deadline: string
  ) => {
    setTakenHearings(
      takenHearings.map((h) =>
        h.id === hearingId
          ? {
              ...h,
              status: "Revisi" as const,
              revisionNotes: notes,
              revisionDeadline: deadline,
            }
          : h
      )
    );

    if (selectedTakenHearing && selectedTakenHearing.id === hearingId) {
      setSelectedTakenHearing({
        ...selectedTakenHearing,
        status: "Revisi",
        revisionNotes: notes,
        revisionDeadline: deadline,
      });
    }
  };

  const handleSubmitRevision = (
    hearingId: number,
    file: File,
    fileName: string
  ) => {
    const today = new Date();
    const revisionApprovalDeadline = new Date(today);
    revisionApprovalDeadline.setDate(today.getDate() + 3);

    setTakenHearings(
      takenHearings.map((h) =>
        h.id === hearingId
          ? {
              ...h,
              revisionFile: file,
              revisionFileName: fileName,
              status: "Menunggu Approval Revisi" as const,
              revisionApprovalDeadline: revisionApprovalDeadline.toLocaleDateString(
                "id-ID",
                { day: "numeric", month: "long", year: "numeric" }
              ),
            }
          : h
      )
    );

    if (selectedTakenHearing && selectedTakenHearing.id === hearingId) {
      setSelectedTakenHearing({
        ...selectedTakenHearing,
        revisionFile: file,
        revisionFileName: fileName,
        status: "Menunggu Approval Revisi",
        revisionApprovalDeadline: revisionApprovalDeadline.toLocaleDateString(
          "id-ID",
          { day: "numeric", month: "long", year: "numeric" }
        ),
      });
    }
  };

  const handleRoleSwitch = (newRole: "Mahasiswa" | "Dosen") => {
    setUserRole(newRole);
    setCurrentPage("Beranda");
  };

  const handleNavigate = (page: string) => {
    if (page.startsWith("Pengumuman:")) {
      const id = Number(page.split(":")[1]);
      setSelectedAnnouncementId(id);
      setCurrentPage("Pengumuman");
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col pt-[57px]">
      <Header userRole={userRole} onRoleSwitch={handleRoleSwitch} />
      <div className="flex flex-1 relative">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userRole={userRole}
        />
        <div className="flex-1 ml-64">
          {currentPage === "Beranda" && userRole === "Mahasiswa" && (
            <MainContent
              onNavigate={handleNavigate}
              proposals={proposals}
              takenHearings={takenHearings}
              onEditProposal={handleEditProposal}
              onViewHearingDetail={handleViewHearingDetail}
              announcements={announcements}
            />
          )}

          {currentPage === "Beranda" && userRole === "Dosen" && (
            <BerandaDosen
              announcements={announcements}
              onNavigate={setCurrentPage}
              onAnnouncementClick={(id) => {
                setCurrentPage("Pengumuman");
              }}
            />
          )}

          {currentPage === "Penawaran Topik" && userRole === "Mahasiswa" && (
            <PenawaranTopik onTopicSelect={handleTopicSelect} />
          )}

          {currentPage === "Penawaran Topik" && userRole === "Dosen" && (
            <PenawaranTopikDosen onNavigate={setCurrentPage} />
          )}

          {currentPage === "View Penawaran Topik Dosen" &&
            userRole === "Dosen" && (
              <ViewPenawaranTopikDosen
                onBack={() => setCurrentPage("Penawaran Topik")}
                onTopicSelect={handleTopicSelect}
              />
            )}

          {currentPage === "Topic Detail" && selectedTopic && (
            <TopicDetail
              topic={selectedTopic}
              onBack={handleBackToPenawaran}
              userRole={userRole}
            />
          )}

          {currentPage === "Tugas Akhir" && (
            <TugasAkhir
              onCreateProposal={handleCreateProposal}
              proposals={proposals}
              onEditProposal={handleEditProposal}
              onApproveAll={handleApproveAll}
              onUpdateProposal={handleUpdateProposal}
              onOpenProposalGuidance={handleOpenProposalGuidance}
              onOpenFinalGuidance={handleOpenFinalGuidance}
            />
          )}

          {currentPage === "Proposal Form" && (
            <ProposalForm
              onBack={handleBackToTugasAkhir}
              onSave={handleSaveProposal}
              editingProposal={editingProposal}
            />
          )}

          {currentPage === "Sidang" && (
            <Sidang
              onChooseHearing={handleChooseHearing}
              takenHearings={takenHearings}
              onViewHearingDetail={handleViewHearingDetail}
              onCompleteProposalDefense={handleCompleteProposalDefense}
            />
          )}

          {currentPage === "Memilih Sidang" && (
            <MemilihSidang
              onBack={handleBackToSidangFromMemilih}
              onSelectHearing={handleSelectHearing}
              hearings={availableHearings}
            />
          )}

          {currentPage === "Sidang Detail" && selectedHearing && (
            <SidangDetail
              hearing={selectedHearing}
              onBack={handleBackToMemilihSidang}
              proposals={proposals}
              onTakeHearing={handleTakeHearing}
            />
          )}

          {currentPage === "My Sidang Detail" && selectedTakenHearing && (
            <MySidangDetail
              hearing={selectedTakenHearing}
              onBack={handleBackToSidang}
              onCompleteProposalDefense={handleCompleteProposalDefense}
              onCompleteFinalDefense={handleCompleteFinalDefense}
              onUpdateHearingInfo={handleUpdateHearingInfo}
              onFinishHearing={handleFinishHearing}
              onSubmitRevision={handleSubmitRevision}
            />
          )}

          {currentPage === "Catatan Bimbingan" && guidanceContext && (
            <CatatanBimbingan
              stage={guidanceContext.stage}
              thesisTitle={guidanceContext.title}
              thesisStatus={guidanceContext.status}
              supervisor1Name={guidanceContext.supervisor1}
              supervisor2Name={guidanceContext.supervisor2}
              onBack={handleBackFromGuidance}
            />
          )}

          {currentPage === "Panduan" && <Panduan />}

          {currentPage === "Pengumuman" && (
            <Pengumuman
              announcements={announcements}
              selectedId={selectedAnnouncementId}
              onClearSelected={() => setSelectedAnnouncementId(null)}
            />
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
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
  approvalDeadline?: string;

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
  revisionApprovalDeadline?: string;

  revisionDeadline?: string;
  revisionNotes?: string;
  revisionNotesExaminer1?: string;
  revisionNotesExaminer2?: string;
  revisionNotesExaminer3?: string;
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
