import { ArrowLeft, Calendar, Info, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner@2.0.3";

interface Hearing {
  id: number;
  name: string;
  type: "Proposal" | "Final";
  batch: number;
  period: string;
  description: string;
  startDate: string;
  endDate: string;
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
}

interface SidangDetailProps {
  hearing: Hearing;
  onBack: () => void;
  proposals: Proposal[];
  onTakeHearing: (hearingId: number, proposalId: number) => void;
}

export function SidangDetail({ hearing, onBack, proposals, onTakeHearing }: SidangDetailProps) {
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");

  // Filter proposals based on hearing type and readiness
  const eligibleProposals = proposals.filter(p => {
    // Must not be a draft
    if (p.isDraft) return false;
    
    // For Proposal hearings, only show proposals in "proposal" stage
    if (hearing.type === "Proposal") {
      return p.stage === "proposal" && (p.status === "Siap Daftar Sidang" || p.status === "Menunggu Persetujuan");
    }
    
    // For Final hearings, only show proposals in "final" stage
    if (hearing.type === "Final") {
      return p.stage === "final" && (p.status === "Siap Daftar Sidang Akhir" || p.status === "Siap Daftar Sidang");
    }
    
    return false;
  });

  const handleTake = () => {
    if (!selectedProposalId) {
      toast.error("Mohon pilih topik proposal terlebih dahulu");
      return;
    }

    onTakeHearing(hearing.id, parseInt(selectedProposalId));
    toast.success(`Berhasil mengambil ${hearing.name}`);
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
          Kembali ke Memilih Sidang
        </button>

        {/* Hearing Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-gray-800 font-[Poppins] text-[20px] mb-2">
                {hearing.name}
              </h1>
              <div className="space-y-1 text-sm text-gray-600 font-[Roboto]">
                <p><span className="font-medium">Periode:</span> {hearing.period}</p>
                <p><span className="font-medium">Tanggal Pendaftaran:</span> {hearing.startDate} - {hearing.endDate}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-[Poppins] text-blue-800 mb-1">Deskripsi</h3>
                <p className="text-xs text-blue-700 font-[Roboto]">
                  {hearing.description}
                </p>
              </div>
            </div>
          </div>

          {/* Select Proposal */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="proposal" className="text-gray-800 font-[Poppins]">
                Pilih Topik Proposal <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 font-[Roboto] mb-2">
                Pilih proposal yang sudah diajukan sebelumnya
              </p>
              <Select value={selectedProposalId} onValueChange={setSelectedProposalId}>
                <SelectTrigger className="font-[Roboto]">
                  <SelectValue placeholder="Pilih proposal" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleProposals.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500 font-[Roboto]">
                      Tidak ada proposal yang memenuhi syarat
                    </div>
                  ) : (
                    eligibleProposals.map((proposal) => (
                      <SelectItem 
                        key={proposal.id} 
                        value={proposal.id.toString()} 
                        className="font-[Roboto]"
                      >
                        {proposal.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Warning if no eligible proposals */}
            {eligibleProposals.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-[Roboto] text-red-800">
                    Anda belum memiliki proposal yang memenuhi syarat untuk mengikuti sidang. 
                    Mohon ajukan proposal terlebih dahulu di menu Tugas Akhir.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onBack}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-[Inter] text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleTake}
                disabled={!selectedProposalId || eligibleProposals.length === 0}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-[Inter] text-sm"
              >
                Ambil Sidang
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">© 2021-2025 Institut Teknologi Sepuluh Nopember</p>
        </footer>
      </div>
    </main>
  );
}