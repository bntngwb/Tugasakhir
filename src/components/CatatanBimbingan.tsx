import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
  FileText,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { Label } from "./ui/label"; // ← gunakan label Shadcn

interface GuidanceNote {
  id: number;
  title: string;
  status: "Belum dikonfirmasi" | "Dikonfirmasi";
  meetingDate: string;
  supervisorName: string;
  note: string;
  recordedAt: string;
  hasFiles: boolean;
}

interface CatatanBimbinganProps {
  stage: "proposal" | "final";
  thesisTitle: string;
  thesisStatus: string;
  supervisor1Name: string;
  supervisor2Name?: string;
  onBack: () => void;
}

export function CatatanBimbingan({
  stage,
  thesisTitle,
  thesisStatus,
  supervisor1Name,
  supervisor2Name,
  onBack,
}: CatatanBimbinganProps) {
  const [notes, setNotes] = useState<GuidanceNote[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSupervisor, setFormSupervisor] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formDate, setFormDate] = useState("");

  const handleToggleAccordion = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const statusChipColor =
    thesisStatus.toLowerCase().includes("proposal") ||
    thesisStatus.toLowerCase().includes("sidang")
      ? "bg-blue-50 text-blue-700 border border-blue-100"
      : "bg-green-50 text-green-700 border border-green-100";

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCancelForm = () => {
    setIsFormOpen(false);
    setFormSupervisor("");
    setFormNote("");
    setFormDate("");
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formSupervisor || !formNote.trim() || !formDate) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    const dateObj = new Date(formDate);
    const tanggal = dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const jam = dateObj.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const meetingDate = `${tanggal} · ${jam}`;
    const recordedAt = `Dicatat pada ${tanggal} · ${jam}`;
    const nextId = notes.length + 1;

    const newNote: GuidanceNote = {
      id: nextId,
      title: `Bimbingan ${nextId}`,
      status: "Belum dikonfirmasi",
      supervisorName: formSupervisor,
      meetingDate,
      note: formNote,
      recordedAt,
      hasFiles: false,
    };

    setNotes((prev) => [...prev, newNote]);
    setOpenId(nextId);
    setIsFormOpen(false);

    toast.success("Catatan bimbingan ditambahkan");
  };

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Tugas Akhir
        </button>

        <h1 className="text-gray-800 font-[Poppins] text-[24px] mb-4">
          Catatan Penelitian dan Pembimbingan
        </h1>

        {/* Thesis Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <p className="text-xs text-gray-500 mb-1">Judul Tugas Akhir Anda</p>
          <p className="text-[15px] font-[Poppins] text-gray-900 uppercase leading-snug mb-2">
            {thesisTitle}
          </p>
          <p className="text-xs text-gray-400 mb-3">
            {stage === "proposal"
              ? "Proposal Tugas Akhir"
              : "Tugas Akhir"}
          </p>

<Label
  className={`px-3 py-1 rounded-lg text-xs font-medium
    ${thesisStatus.includes("Menunggu Persetujuan") ? "bg-yellow-100 text-yellow-700" : ""}
    ${thesisStatus.includes("Tugas Akhir") ? "bg-green-100 text-green-700" : ""}
  `}
>
  {thesisStatus}
</Label>
        </div>

        {/* Guidance Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 font-[Poppins] text-[16px]">
              Pembimbingan Dosen
            </h2>

            <button
              onClick={handleOpenForm}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </div>

          {/* FORM INPUT */}
          {isFormOpen && (
            <form
              onSubmit={handleSubmitForm}
              className="border border-gray-200 rounded-lg p-4 bg-[#F9FAFB] mb-6 space-y-4"
            >
              {/* SUPERVISOR */}
              <div>
                <Label className="text-xs text-gray-600 mb-1">
                  Dosen pembimbing <span className="text-red-500">*</span>
                </Label>

                <select
                  value={formSupervisor}
                  onChange={(e) => setFormSupervisor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Pilih dosen</option>
                  <option value={supervisor1Name}>{supervisor1Name}</option>
                  {supervisor2Name && supervisor2Name !== "-" && (
                    <option value={supervisor2Name}>{supervisor2Name}</option>
                  )}
                </select>
              </div>

              {/* DATE */}
              <div>
                <Label className="text-xs text-gray-600 mb-1">
                  Tanggal bimbingan <span className="text-red-500">*</span>
                </Label>
                <input
                  type="datetime-local"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* NOTE */}
              <div>
                <Label className="text-xs text-gray-600 mb-1">
                  Catatan bimbingan <span className="text-red-500">*</span>
                </Label>
                <textarea
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Tuliskan ringkasan hasil bimbingan..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}

          {/* LIST */}
          <div className="space-y-3">
            {notes.length === 0 && !isFormOpen && (
              <p className="text-sm text-gray-500">
                Belum ada catatan bimbingan. Klik tombol{" "}
                <strong>Tambah</strong> untuk menambah catatan pertama Anda.
              </p>
            )}

            {notes.map((note) => {
              const isOpen = openId === note.id;
              return (
                <div
                  key={note.id}
                  className="border border-gray-200 rounded-xl bg-white"
                >
                  <button
                    onClick={() => handleToggleAccordion(note.id)}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-[Poppins] text-gray-900">
                          {note.title}
                        </span>

<Label
  className={`px-3 py-1 rounded-lg text-xs font-medium
    ${note.status === "Belum dikonfirmasi" ? "bg-red-100 text-red-700" : ""}
    ${note.status === "Dikonfirmasi" ? "bg-green-100 text-green-700" : ""}
  `}
>
  {note.status}
</Label>

                      </div>

                      <p className="text-xs text-gray-500">
                        Tanggal bimbingan: {note.meetingDate}
                      </p>
                    </div>

                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {isOpen && (
<div className="border-t border-gray-100 px-4 pt-6 pb-6 bg-[#F9FAFB] space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Dosen pembimbing
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{note.supervisorName}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Catatan bimbingan
                        </p>
                        <p className="text-sm text-gray-800">{note.note}</p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {note.recordedAt}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Berkas bimbingan
                        </p>
                        <p className="text-sm text-gray-500">
                          Belum ada berkas unggahan.
                        </p>

                        <button
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 text-sm text-blue-600 hover:bg-blue-50"
                          type="button"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah Berkas Baru
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
