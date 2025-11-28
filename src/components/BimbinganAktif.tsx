"use client";

import { useMemo, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Eye,
} from "lucide-react";
import { GuideModal } from "./GuideModal";
import { BimbinganDosenDetail } from "./BimbinganDosenDetail";

/* ========================================================================
   TYPES
   ======================================================================== */

export type Jenjang = "S1" | "S2" | "S3";

export type StatusBimbingan =
  | "Pengerjaan Proposal"
  | "Sidang Proposal"
  | "Revisi Proposal"
  | "Pengerjaan TA"
  | "Sidang TA"
  | "Revisi TA";

export interface BimbinganItem {
  id: number;
  nama: string;
  nrp: string;
  jenjang: Jenjang;
  angkatan: string; // hanya tahun: 2020 / 2021 / 2022 / 2023
  pembimbing: "Pembimbing 1" | "Pembimbing 2"; // posisi Anda di mahasiswa ini
  status: StatusBimbingan;
  jumlahBimbingan: number;
}

interface BimbinganAktifProps {
  onSummaryChange?: (summary: {
    s1Count: number;
    s2Count: number;
    s3Count: number;
    ajuanCount: number;
  }) => void;
}

/* ========================================================================
   DUMMY DATA
   ======================================================================== */

const dummyBimbinganData: BimbinganItem[] = [
  // S1
  {
    id: 1,
    nama: "Budi Santoso",
    nrp: "5025221034",
    jenjang: "S1",
    angkatan: "2021",
    pembimbing: "Pembimbing 1",
    status: "Pengerjaan Proposal",
    jumlahBimbingan: 5,
  },
  {
    id: 2,
    nama: "Siti Rahmawati",
    nrp: "5025222001",
    jenjang: "S1",
    angkatan: "2021",
    pembimbing: "Pembimbing 2",
    status: "Sidang Proposal",
    jumlahBimbingan: 9,
  },
  {
    id: 3,
    nama: "Andi Pratama",
    nrp: "5025223002",
    jenjang: "S1",
    angkatan: "2020",
    pembimbing: "Pembimbing 1",
    status: "Revisi Proposal",
    jumlahBimbingan: 12,
  },

  // S2
  {
    id: 7,
    nama: "Yoga Saputra",
    nrp: "6025221001",
    jenjang: "S2",
    angkatan: "2022",
    pembimbing: "Pembimbing 1",
    status: "Pengerjaan Proposal",
    jumlahBimbingan: 6,
  },
  {
    id: 8,
    nama: "Nadia Kusuma",
    nrp: "6025221002",
    jenjang: "S2",
    angkatan: "2022",
    pembimbing: "Pembimbing 1",
    status: "Sidang Proposal",
    jumlahBimbingan: 10,
  },

  // S3
  {
    id: 11,
    nama: "Farhan Akbar",
    nrp: "7025221001",
    jenjang: "S3",
    angkatan: "2021",
    pembimbing: "Pembimbing 2",
    status: "Pengerjaan Proposal",
    jumlahBimbingan: 8,
  },
];

const dummyAjuanBimbinganData: BimbinganItem[] = [
  {
    id: 1001,
    nama: "Rahma Dwi Astuti",
    nrp: "5025221999",
    jenjang: "S1",
    angkatan: "2021",
    pembimbing: "Pembimbing 1",
    status: "Pengerjaan Proposal",
    jumlahBimbingan: 0,
  },
  {
    id: 1002,
    nama: "Rama Putra",
    nrp: "6025221888",
    jenjang: "S2",
    angkatan: "2022",
    pembimbing: "Pembimbing 1",
    status: "Pengerjaan Proposal",
    jumlahBimbingan: 0,
  },
];

/* ========================================================================
   MAIN COMPONENT
   ======================================================================== */

export function BimbinganAktif({ onSummaryChange }: BimbinganAktifProps) {
  const [activeJenjang, setActiveJenjang] = useState<Jenjang>("S1");

  // filter per kolom
  const [filterNama, setFilterNama] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState<string>("all");
  const [filterPembimbing, setFilterPembimbing] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | StatusBimbingan>(
    "all"
  );

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [showAjuan, setShowAjuan] = useState(false);

  const [bimbinganData, setBimbinganData] =
    useState<BimbinganItem[]>(dummyBimbinganData);
  const [ajuanBimbinganData, setAjuanBimbinganData] =
    useState<BimbinganItem[]>(dummyAjuanBimbinganData);

  // detail yang sedang dibuka (tombol Lihat)
  const [selectedBimbingan, setSelectedBimbingan] =
    useState<BimbinganItem | null>(null);

  /* ========================================================================
     SUMMARY KE APP.tsx (REALTIME)
     ======================================================================== */

  const jenjangCounts = useMemo(
    () => ({
      s1: bimbinganData.filter((d) => d.jenjang === "S1").length,
      s2: bimbinganData.filter((d) => d.jenjang === "S2").length,
      s3: bimbinganData.filter((d) => d.jenjang === "S3").length,
    }),
    [bimbinganData]
  );

  useEffect(() => {
    if (!onSummaryChange) return;
    onSummaryChange({
      s1Count: jenjangCounts.s1,
      s2Count: jenjangCounts.s2,
      s3Count: jenjangCounts.s3,
      ajuanCount: ajuanBimbinganData.length,
    });
  }, [jenjangCounts, ajuanBimbinganData, onSummaryChange]);

  /* ========================================================================
     FILTERING TABLE
     ======================================================================== */

  const filteredBimbingan = useMemo(() => {
    return bimbinganData
      .filter((d) => d.jenjang === activeJenjang)
      .filter((d) =>
        filterNama.trim()
          ? d.nama.toLowerCase().includes(filterNama.toLowerCase()) ||
            d.nrp.includes(filterNama.trim())
          : true
      )
      .filter((d) =>
        filterAngkatan === "all" ? true : d.angkatan === filterAngkatan
      )
      .filter((d) =>
        filterPembimbing === "all"
          ? true
          : d.pembimbing === filterPembimbing
      )
      .filter((d) =>
        filterStatus === "all" ? true : d.status === filterStatus
      );
  }, [
    bimbinganData,
    activeJenjang,
    filterNama,
    filterAngkatan,
    filterPembimbing,
    filterStatus,
  ]);

  const filteredAjuan = useMemo(
    () => ajuanBimbinganData.filter((a) => a.jenjang === activeJenjang),
    [ajuanBimbinganData, activeJenjang]
  );

  // daftar angkatan untuk dropdown per kolom
  const angkatanOptions = useMemo(
    () =>
      Array.from(
        new Set(
          bimbinganData
            .filter((d) => d.jenjang === activeJenjang)
            .map((d) => d.angkatan)
        )
      ).sort(),
    [bimbinganData, activeJenjang]
  );

  /* ========================================================================
     HANDLE APPROVAL
     ======================================================================== */

  const handleApproveAjuan = (item: BimbinganItem) => {
    setAjuanBimbinganData((prev) => prev.filter((a) => a.id !== item.id));
    setBimbinganData((prev) => [
      ...prev,
      { ...item, jumlahBimbingan: 1 }, // default awal
    ]);
  };

  /* ========================================================================
     MODE DETAIL (TOMBOL LIHAT)
     ======================================================================== */

  if (selectedBimbingan) {
    return (
      <BimbinganDosenDetail
        bimbingan={selectedBimbingan}
        onBack={() => setSelectedBimbingan(null)}
      />
    );
  }

  /* ========================================================================
     RENDER LIST
     ======================================================================== */

  return (
    <main className="flex-1 p-6 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-800 text-2xl font-[Poppins] font-bold">
              Bimbingan Aktif
            </h1>
            <p className="text-gray-500 font-[Roboto] text-sm">
              Pantau daftar mahasiswa bimbingan dan progres pengerjaan tugas
              akhir mereka.
            </p>
          </div>

          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Panduan Penggunaan
          </button>
        </div>

        {/* MINI CARDS (S1/S2/S3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MiniJenjangCard
            label="Mahasiswa S-1 Anda"
            count={jenjangCounts.s1}
            active={activeJenjang === "S1"}
            onClick={() => setActiveJenjang("S1")}
            iconBgClass="bg-blue-100"
            iconColorClass="text-blue-600"
          />
          <MiniJenjangCard
            label="Mahasiswa S-2 Anda"
            count={jenjangCounts.s2}
            active={activeJenjang === "S2"}
            onClick={() => setActiveJenjang("S2")}
            iconBgClass="bg-green-100"
            iconColorClass="text-green-600"
          />
          <MiniJenjangCard
            label="Mahasiswa S-3 Anda"
            count={jenjangCounts.s3}
            active={activeJenjang === "S3"}
            onClick={() => setActiveJenjang("S3")}
            iconBgClass="bg-purple-100"
            iconColorClass="text-purple-600"
          />
        </div>

        {/* AJUAN BIMBINGAN BUTTON */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowAjuan((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 bg-white"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Ajuan Mahasiswa Bimbingan</span>
            {ajuanBimbinganData.length > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {ajuanBimbinganData.length}
              </span>
            )}
          </button>

          {ajuanBimbinganData.length > 0 && (
            <p className="text-xs text-red-600 flex gap-1 items-center">
              <AlertCircle className="w-3 h-3" />
              Terdapat {ajuanBimbinganData.length} ajuan menunggu persetujuan
            </p>
          )}
        </div>

        {/* SECTION AJUAN */}
        {showAjuan && (
          <AjuanBimbinganSection
            data={filteredAjuan}
            activeJenjang={activeJenjang}
            onApprove={handleApproveAjuan}
            onView={(item) => setSelectedBimbingan(item)}
          />
        )}

        {/* TABLE BIMBINGAN */}
        <BimbinganTableSection
          activeJenjang={activeJenjang}
          data={filteredBimbingan}
          angkatanOptions={angkatanOptions}
          filterNama={filterNama}
          setFilterNama={setFilterNama}
          filterAngkatan={filterAngkatan}
          setFilterAngkatan={setFilterAngkatan}
          filterPembimbing={filterPembimbing}
          setFilterPembimbing={setFilterPembimbing}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onView={(item) => setSelectedBimbingan(item)}
        />
      </div>

      {/* GUIDE MODAL */}
      {isGuideModalOpen && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          title="Panduan Penggunaan - Bimbingan Aktif"
          steps={[
            {
              title: "Filter Berdasarkan Jenjang",
              description:
                "Gunakan mini card untuk menampilkan mahasiswa S1, S2, atau S3.",
              imageUrl:
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
            },
            {
              title: "Ajuan Mahasiswa Bimbingan",
              description:
                "Setujui atau lakukan batch approval terhadap mahasiswa yang ingin dibimbing.",
              imageUrl:
                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
            },
          ]}
        />
      )}
    </main>
  );
}

/* ========================================================================
   MINI CARD COMPONENT
   ======================================================================== */

function MiniJenjangCard({
  label,
  count,
  active,
  onClick,
  iconBgClass,
  iconColorClass,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  iconBgClass: string;
  iconColorClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border flex justify-between items-center transition cursor-pointer ${
        active ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgClass}`}
        >
          <GraduationCap className={`w-5 h-5 ${iconColorClass}`} />
        </div>
        <div>
          <p className="font-[Poppins] text-gray-800 text-sm">{label}</p>
          <p className="text-xs text-gray-500 font-[Roboto]">
            Klik untuk menampilkan daftar
          </p>
        </div>
      </div>
      <p className="text-2xl font-[Poppins]">{count}</p>
    </button>
  );
}

/* ========================================================================
   TABLE BIMBINGAN SECTION (DENGAN FILTER PER KOLOM)
   ======================================================================== */

function BimbinganTableSection({
  activeJenjang,
  data,
  angkatanOptions,
  filterNama,
  setFilterNama,
  filterAngkatan,
  setFilterAngkatan,
  filterPembimbing,
  setFilterPembimbing,
  filterStatus,
  setFilterStatus,
  onView,
}: {
  activeJenjang: Jenjang;
  data: BimbinganItem[];
  angkatanOptions: string[];
  filterNama: string;
  setFilterNama: (v: string) => void;
  filterAngkatan: string;
  setFilterAngkatan: (v: string) => void;
  filterPembimbing: string;
  setFilterPembimbing: (v: string) => void;
  filterStatus: "all" | StatusBimbingan;
  setFilterStatus: (v: "all" | StatusBimbingan) => void;
  onView: (item: BimbinganItem) => void;
}) {
  const title =
    activeJenjang === "S1"
      ? "Daftar Bimbingan S-1"
      : activeJenjang === "S2"
      ? "Daftar Bimbingan S-2"
      : "Daftar Bimbingan S-3";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* TITLE */}
      <h2 className="text-gray-800 font-[Poppins] text-[18px] font-bold mb-1">
        {title}
      </h2>
      <p className="text-sm text-gray-500 font-[Roboto] mb-4">
        Daftar mahasiswa bimbingan aktif berdasarkan jenjang
      </p>

      {/* TABLE */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {/* Header label */}
            <tr>
              <th className="px-4 py-3 text-left text-sm w-12">No</th>
              <th className="px-4 py-3 text-left text-sm">Nama</th>
              <th className="px-4 py-3 text-left text-sm w-24">Angkatan</th>
              <th className="px-4 py-3 text-left text-sm w-40">Pembimbing</th>
              <th className="px-4 py-3 text-left text-sm w-40">Status</th>
              <th className="px-4 py-3 text-left text-sm w-40">
                Jumlah Bimbingan
              </th>
              <th className="px-4 py-3 text-left text-sm w-28">Aksi</th>
            </tr>

            {/* Filter per kolom */}
            <tr className="bg-gray-50 border-t border-gray-200">
              <th className="px-4 py-2" />
              {/* Nama / NRP */}
              <th className="px-4 py-2">
                <input
                  type="text"
                  value={filterNama}
                  onChange={(e) => setFilterNama(e.target.value)}
                  placeholder="Cari nama / NRP"
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </th>

              {/* Angkatan */}
              <th className="px-4 py-2">
                <select
                  value={filterAngkatan}
                  onChange={(e) => setFilterAngkatan(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                >
                  <option value="all">Semua</option>
                  {angkatanOptions.map((angk) => (
                    <option key={angk} value={angk}>
                      {angk}
                    </option>
                  ))}
                </select>
              </th>

              {/* Pembimbing */}
              <th className="px-4 py-2">
                <select
                  value={filterPembimbing}
                  onChange={(e) => setFilterPembimbing(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                >
                  <option value="all">Semua</option>
                  <option value="Pembimbing 1">Pembimbing 1</option>
                  <option value="Pembimbing 2">Pembimbing 2</option>
                </select>
              </th>

              {/* Status */}
              <th className="px-4 py-2">
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as "all" | StatusBimbingan)
                  }
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                >
                  <option value="all">Semua</option>
                  <option value="Pengerjaan Proposal">
                    Pengerjaan Proposal
                  </option>
                  <option value="Sidang Proposal">Sidang Proposal</option>
                  <option value="Revisi Proposal">Revisi Proposal</option>
                  <option value="Pengerjaan TA">Pengerjaan TA</option>
                  <option value="Sidang TA">Sidang TA</option>
                  <option value="Revisi TA">Revisi TA</option>
                </select>
              </th>

              {/* Jumlah & Aksi: tidak ada filter */}
              <th className="px-4 py-2" />
              <th className="px-4 py-2" />
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((d, i) => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{i + 1}</td>

                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col">
                      <span>{d.nama}</span>
                      <span className="text-xs text-gray-400">{d.nrp}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm">{d.angkatan}</td>

                  <td className="px-4 py-3 text-sm">
                    <span className="text-xs text-gray-700">
                      {d.pembimbing}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] ${
                        d.status.includes("Revisi")
                          ? "bg-yellow-100 text-yellow-700"
                          : d.status.includes("Sidang")
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm w-40">
                    <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-[11px] text-gray-700">
                      {d.jumlahBimbingan}x
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm w-28">
                    <button
                      onClick={() => onView(d)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lihat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================================================================
   AJUAN BIMBINGAN SECTION + BATCH APPROVAL
   ======================================================================== */

function AjuanBimbinganSection({
  data,
  activeJenjang,
  onApprove,
  onView,
}: {
  data: BimbinganItem[];
  activeJenjang: Jenjang;
  onApprove: (item: BimbinganItem) => void;
  onView: (item: BimbinganItem) => void;
}) {
  const [batchMode, setBatchMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirm, setConfirm] = useState(false);

  const title =
    activeJenjang === "S1"
      ? "Ajuan Bimbingan S-1"
      : activeJenjang === "S2"
      ? "Ajuan Bimbingan S-2"
      : "Ajuan Bimbingan S-3";

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const approveSelected = () => {
    if (selected.length === 0) return;
    setConfirm(true);
  };

  const doApprove = () => {
    data
      .filter((d) => selected.includes(d.id))
      .forEach((item) => onApprove(item));
    setSelected([]);
    setBatchMode(false);
    setConfirm(false);
  };

  const allSelected = data.length > 0 && selected.length === data.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(data.map((d) => d.id));
  };

  return (
    <div className="bg-white rounded-lg border border-blue-200 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-[18px] font-bold text-gray-800 font-[Poppins]">
            {title}
          </h2>
          <p className="text-sm text-gray-500 font-[Roboto]">
            Daftar mahasiswa yang meminta Anda sebagai pembimbing
          </p>
        </div>

        {data.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setBatchMode((b) => !b);
                setSelected([]);
              }}
              className={`px-3 py-1.5 rounded-full border text-xs ${
                batchMode
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-blue-600 border-blue-300"
              }`}
            >
              {batchMode ? "Batalkan Batch" : "Batch Approval"}
            </button>

            {batchMode && (
              <button
                disabled={selected.length === 0}
                onClick={approveSelected}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  selected.length === 0
                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                    : "bg-green-500 text-white border border-green-500"
                }`}
              >
                Approve Semua
              </button>
            )}
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm w-12">No</th>
              <th className="px-4 py-3 text-left text-sm">Nama</th>
              <th className="px-4 py-3 text-left text-sm w-24">Angkatan</th>
              <th className="px-4 py-3 text-left text-sm w-44">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  Tidak ada ajuan
                </td>
              </tr>
            ) : (
              data.map((item, i) => {
                const checked = selected.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-3">{i + 1}</td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span>{item.nama}</span>
                        <span className="text-xs text-gray-400">
                          {item.nrp}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">{item.angkatan}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {batchMode && (
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSelect(item.id)}
                            className="w-4 h-4 accent-blue-600"
                          />
                        )}

                        {/* Button LIHAT */}
                        <button
                          onClick={() => onView(item)}
                          className="px-3 py-1.5 border border-gray-300 bg-white text-xs rounded-full flex items-center gap-1 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Lihat
                        </button>

                        {/* Button APPROVE */}
                        <button
                          onClick={() => onApprove(item)}
                          className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-full"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* SELECT ALL (batch mode) */}
        {batchMode && data.length > 0 && (
          <div className="flex justify-between px-4 py-2 bg-gray-50 border-t">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-blue-600"
              />
              Pilih semua
            </label>
            <span className="text-xs text-gray-500">
              {selected.length} dipilih
            </span>
          </div>
        )}
      </div>

      {/* CONFIRM POPUP */}
      {confirm && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur flex items-center justify-center">
          <div className="w-[448px] h-[264px] bg-white rounded-2xl border shadow-lg p-6 flex flex-col justify-between">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm font-[Poppins]">
                  Konfirmasi Batch Approval
                </h3>
                <p className="text-xs text-gray-600 mt-1 font-[Roboto]">
                  Anda akan menyetujui{" "}
                  <strong>{selected.length} ajuan</strong> sekaligus dan
                  memindahkannya ke Bimbingan Aktif.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 text-xs bg-gray-200 rounded-full"
                onClick={() => setConfirm(false)}
              >
                Batal
              </button>
              <button
                className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-full flex items-center gap-1"
                onClick={doApprove}
              >
                <CheckCircle2 className="w-4 h-4" />
                Ya, Setujui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
