import { Plus, BookOpen, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProposalCardWithApproval } from "./ProposalCardWithApproval";
import { GuideModal } from "./GuideModal";

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

interface TugasAkhirProps {
  onCreateProposal: () => void;
  proposals: Proposal[];
  onEditProposal: (proposal: Proposal) => void;
  onApproveAll: () => void;
  onUpdateProposal?: (proposalId: number, updates: Partial<Proposal>) => void;
}

export function TugasAkhir({ onCreateProposal, proposals, onEditProposal, onApproveAll, onUpdateProposal }: TugasAkhirProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Filter proposals by stage
  const proposalStageProposals = proposals.filter(p => p.stage === "proposal");
  const finalStageProposals = proposals.filter(p => p.stage === "final");

  return (
    <>
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800 font-[Poppins] text-[24px]">Tugas Akhir</h1>
            <button 
              onClick={() => setIsGuideModalOpen(true)} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-[Poppins]">Panduan Penggunaan</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 font-[Roboto]">Kelola proposal dan tugas akhir Anda</p>
        </div>

        {/* Tugas Akhir Proposal Saya Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-gray-800 font-[Poppins] text-[18px] mb-1">Tugas Akhir Proposal Saya</h2>
            <p className="text-sm text-gray-500 font-[Roboto]">Proposal yang dapat didaftarkan untuk sidang proposal</p>
          </div>

          {/* Buat Usulan Button */}
          <button
            onClick={onCreateProposal}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors mb-4"
          >
            <div className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-gray-800 font-[Roboto] text-sm">Buat Usulan</p>
              <p className="text-xs text-gray-500 font-[Roboto]">Buat usulan baru</p>
            </div>
          </button>

          {/* Proposal Stage Proposals */}
          {proposalStageProposals.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-[Roboto]">Belum ada proposal</p>
              <p className="text-xs text-gray-400 font-[Roboto] mt-1">Buat usulan proposal untuk memulai</p>
            </div>
          ) : (
            proposalStageProposals.map((proposal) => (
              <ProposalCardWithApproval
                key={proposal.id}
                proposal={proposal}
                onEditProposal={onEditProposal}
                onUpdateProposal={onUpdateProposal}
              />
            ))
          )}
        </div>

        {/* Tugas Akhir Saya Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-gray-800 font-[Poppins] text-[18px] mb-1">Tugas Akhir Saya</h2>
            <p className="text-sm text-gray-500 font-[Roboto]">Tugas akhir yang telah lulus sidang proposal dan dapat didaftarkan untuk sidang akhir</p>
          </div>

          {/* Final Stage Proposals */}
          {finalStageProposals.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-[Roboto]">Belum ada tugas akhir</p>
              <p className="text-xs text-gray-400 font-[Roboto] mt-1">Selesaikan sidang proposal untuk melanjutkan ke tahap tugas akhir</p>
            </div>
          ) : (
            finalStageProposals.map((proposal) => (
              <ProposalCardWithApproval
                key={proposal.id}
                proposal={proposal}
                onEditProposal={onEditProposal}
                onUpdateProposal={onUpdateProposal}
              />
            ))
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
      title="Panduan Penggunaan - Tugas Akhir"
      steps={[
        {
          title: "Tentang Tugas Akhir",
          description: "Halaman ini menampilkan dua bagian: Tugas Akhir Proposal (tahap proposal) dan Tugas Akhir (tahap akhir). Kelola proposal dan tugas akhir Anda dengan mudah. Sistem ini membantu Anda dari tahap pengajuan proposal hingga sidang akhir.",
          imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVzaXMlMjB3cml0aW5nJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzYzNjM5MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Buat & Kelola Proposal",
          description: "Klik tombol 'Buat Usulan' untuk membuat proposal baru. Lengkapi semua field yang diperlukan termasuk judul, abstrak, dosen pembimbing, dan laboratorium. Anda dapat menyimpan sebagai draft jika belum siap submit atau langsung submit untuk proses persetujuan.",
          imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMGZvcm0lMjB3cml0aW5nfGVufDF8fHx8MTc2MzYzOTM2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Proses Persetujuan Transparan",
          description: "Klik proposal dengan status 'Menunggu Persetujuan' untuk melihat detail approval. Sistem menampilkan progress persetujuan dari Pembimbing 1, Pembimbing 2, dan Admin secara real-time dengan countdown deadline 3 hari. Persetujuan dapat dilakukan bersamaan oleh setiap pihak.",
          imageUrl: "https://images.unsplash.com/photo-1554224311-beee910f2465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHByb3ZhbCUyMHByb2Nlc3MlMjBjaGVja2xpc3R8ZW58MXx8fHwxNzYzNjM5MzY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          title: "Status & Tahapan",
          description: "Setelah proposal disetujui, status berubah menjadi 'Siap Daftar Sidang'. Anda dapat mendaftarkan proposal untuk sidang di halaman Sidang. Setelah lulus sidang proposal, tugas akhir akan muncul di section 'Tugas Akhir Saya' dan dapat didaftarkan untuk sidang akhir.",
          imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmVzcyUyMHRyYWNraW5nJTIwc3RhdHVzfGVufDF8fHx8MTc2MzYzOTM2NXww&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ]}
    />
    </>
  );
}