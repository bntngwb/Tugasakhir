"use client";

import {
  ArrowLeft,
  User,
  BookOpen,
  FileText,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { BimbinganItem } from "./BimbinganAktif";

type StatusBimbingan = BimbinganItem["status"];

interface BimbinganDosenDetailProps {
  bimbingan: BimbinganItem;
  onBack: () => void;
}

/**
 * Mapping status → step index timeline
 * 0: Proposal
 * 1: Sidang Proposal
 * 2: Revisi Proposal
 * 3: Pengerjaan TA
 * 4: Sidang TA
 * 5: Revisi TA
 */
const TIMELINE_STEPS = [
  "Proposal",
  "Sidang Proposal",
  "Revisi Proposal",
  "Pengerjaan TA",
  "Sidang TA",
  "Revisi TA",
] as const;

const getTimelineIndex = (status: StatusBimbingan): number => {
  switch (status) {
    case "Pengerjaan Proposal":
      return 0;
    case "Sidang Proposal":
      return 1;
    case "Revisi Proposal":
      return 2;
    case "Pengerjaan TA":
      return 3;
    case "Sidang TA":
      return 4;
    case "Revisi TA":
      return 5;
    default:
      return 0;
  }
};

const getStatusPillColor = (status: StatusBimbingan): string => {
  if (status.includes("Revisi")) return "bg-yellow-100 text-yellow-700";
  if (status.includes("Sidang")) return "bg-green-100 text-green-700";
  if (status.includes("Pengerjaan")) return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

export function BimbinganDosenDetail({
  bimbingan,
  onBack,
}: BimbinganDosenDetailProps) {
  const currentStepIndex = getTimelineIndex(bimbingan.status);

  // data dummy untuk tugas akhir (judul, abstrak, lab) – bisa kamu ganti nanti
  const dummyTitle =
    "RANCANG BANGUN SISTEM MONITORING BIMBINGAN TUGAS AKHIR BERBASIS WEB";
  const dummyAbstract =
    "Penelitian ini bertujuan untuk merancang dan membangun sistem monitoring bimbingan tugas akhir berbasis web guna memudahkan dosen dan mahasiswa dalam memantau progres bimbingan. Sistem menyediakan fitur pencatatan pertemuan, status tahapan tugas akhir, serta riwayat revisi secara terstruktur.";
  const dummyLab = "Laboratorium Rekayasa Perangkat Lunak";

  const showProposalSection =
    bimbingan.status === "Sidang Proposal" ||
    bimbingan.status === "Revisi Proposal" ||
    bimbingan.status === "Pengerjaan TA" ||
    bimbingan.status === "Sidang TA" ||
    bimbingan.status === "Revisi TA";

  const showRevisionSection = bimbingan.status.includes("Revisi");

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-4xl mx-auto">
        {/* Tombol Kembali */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-[Roboto] text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Bimbingan Aktif
        </button>

        {/* HEADER UTAMA */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-gray-800 font-[Poppins] text-[20px] mb-1">
                  {bimbingan.nama}
                </h1>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  NRP {bimbingan.nrp} • {bimbingan.jenjang} • Angkatan{" "}
                  {bimbingan.angkatan}
                </p>
                <p className="text-xs text-gray-500 font-[Roboto]">
                  Posisi Anda: {bimbingan.pembimbing}
                </p>
                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-[Roboto] ${getStatusPillColor(
                    bimbingan.status
                  )}`}
                >
                  {bimbingan.status}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-[Roboto]">
              <AlertCircle className="w-3 h-3" />
              <span>
                Detail progres bimbingan tugas akhir mahasiswa bimbingan Anda.
              </span>
            </div>
          </div>
        </div>

        {/* INFORMASI TUGAS AKHIR */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-[Poppins] text-[18px]">
              Informasi Tugas Akhir
            </h2>
          </div>

          <div className="space-y-4">
            {/* Nama & NRP */}
            <div>
              <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                Nama dan NRP
              </p>
              <p className="text-sm text-gray-800 font-[Roboto]">
                {bimbingan.nama} – {bimbingan.nrp}
              </p>
            </div>

            {/* Judul */}
            <div>
              <p className="text-xs text-gray-500 font-[Roboto] mb-1">Judul</p>
              <p className="text-sm text-gray-800 font-[Roboto] uppercase">
                {dummyTitle}
              </p>
            </div>

            {/* Abstrak */}
            <div>
              <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                Abstrak
              </p>
              <p className="text-sm text-gray-700 font-[Roboto] leading-relaxed">
                {dummyAbstract}
              </p>
            </div>

            {/* Lab */}
            <div>
              <p className="text-xs text-gray-500 font-[Roboto] mb-1">Lab</p>
              <p className="text-sm text-gray-800 font-[Roboto]">{dummyLab}</p>
            </div>

            {/* Pembimbing 1 & 2 (posisi saja) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  Pembimbing 1
                </p>
                <p className="text-sm text-gray-800 font-[Roboto]">
                  Pembimbing 1
                  {bimbingan.pembimbing === "Pembimbing 1"
                    ? " (Anda)"
                    : " (Rekan)"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                  Pembimbing 2
                </p>
                <p className="text-sm text-gray-800 font-[Roboto]">
                  Pembimbing 2
                  {bimbingan.pembimbing === "Pembimbing 2"
                    ? " (Anda)"
                    : " (Rekan)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE PROSES */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-800 font-[Poppins] text-[18px]">
              Timeline Proses
            </h2>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex items-center justify-between relative">
                {TIMELINE_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={step}
                      className="flex-1 flex flex-col items-center"
                    >
                      {/* garis penghubung di belakang bullet */}
                      {index > 0 && (
                        <div className="w-full h-[2px] bg-gray-200 absolute top-[14px] -z-10" />
                      )}

                      {/* Bulat */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 ${
                          isCompleted
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Label */}
                      <p
                        className={`mt-2 text-[11px] text-center font-[Roboto] ${
                          isCurrent
                            ? "text-blue-700 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500 font-[Roboto]">
            Status saat ini:{" "}
            <span className="font-semibold">{bimbingan.status}</span>
          </p>
        </div>

        {/* INFORMASI SIDANG PROPOSAL */}
        {showProposalSection && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-800 font-[Poppins] text-[18px]">
                Informasi Sidang Proposal
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Jenis Sidang
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    Sidang Proposal Tugas Akhir
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Tanggal
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    12 Januari 2026
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Waktu
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    09.00 – 11.00 WIB
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-[Roboto] mb-1">
                    Lokasi
                  </p>
                  <p className="text-sm text-gray-800 font-[Roboto]">
                    Ruang Sidang 1 Departemen Informatika
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION REVISI (KALAU STATUS REVISI) */}
        {showRevisionSection && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-800 font-[Poppins] text-[18px]">
                Catatan Revisi
              </h2>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-700 font-[Roboto]">
                Mahasiswa diminta untuk melakukan revisi terhadap naskah
                proposal dan menyesuaikan bagian metodologi serta penulisan
                bab hasil dan pembahasan agar sesuai dengan masukan yang
                diberikan saat sidang.
              </p>
              <p className="text-xs text-gray-500 font-[Roboto]">
                *Catatan ini masih dummy dan dapat diganti dengan data revisi
                yang sesungguhnya ketika integrasi dengan backend.
              </p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2021-2025 Institut Teknologi Sepuluh Nopember
          </p>
        </footer>
      </div>
    </main>
  );
}
