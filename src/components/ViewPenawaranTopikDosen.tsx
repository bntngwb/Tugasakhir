import { ArrowLeft } from "lucide-react";
import { PenawaranTopik } from "./PenawaranTopik";

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

interface ViewPenawaranTopikDosenProps {
  onBack: () => void;
  onTopicSelect?: (topic: Topic) => void;
}

export function ViewPenawaranTopikDosen({ onBack, onTopicSelect }: ViewPenawaranTopikDosenProps) {
  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Tombol Kembali */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-[Roboto]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kelola Penawaran Topik
        </button>

        {/* Versi mahasiswa yang bisa pilih topik */}
        <PenawaranTopik onTopicSelect={onTopicSelect} />
      </div>
    </main>
  );
}
