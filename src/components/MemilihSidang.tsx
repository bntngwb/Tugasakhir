import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";

export interface Hearing {
  id: number;
  name: string;
  type: "Proposal" | "Final";
  batch: number;
  period: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface MemilihSidangProps {
  onBack: () => void;
  onSelectHearing: (hearing: Hearing) => void;
  hearings: Hearing[];
}

export function MemilihSidang({ onBack, onSelectHearing, hearings }: MemilihSidangProps) {
  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-[Roboto] text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Sidang
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-800 font-[Poppins] text-[24px] mb-2">Memilih Sidang</h1>
          <p className="text-sm text-gray-500 font-[Roboto]">Pilih jadwal sidang yang tersedia</p>
        </div>

        {/* Available Hearings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-gray-800 font-[Poppins] text-[18px] mb-4">Sidang Tersedia</h2>
          
          <div className="space-y-3">
            {hearings.map((hearing) => (
              <div
                key={hearing.id}
                onClick={() => onSelectHearing(hearing)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-[Poppins] text-gray-800 mb-1">
                      {hearing.name}
                    </h3>
                    <p className="text-xs text-gray-600 font-[Roboto] mb-1">
                      Periode: {hearing.period}
                    </p>
                    <p className="text-xs text-gray-500 font-[Roboto]">
                      {hearing.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
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
