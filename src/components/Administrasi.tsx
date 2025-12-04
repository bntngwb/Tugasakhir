export function Administrasi() {
  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen">
      <h1 className="text-gray-800 font-[Poppins] mb-6">Administrasi</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600 font-[Roboto]">
          Halaman Administrasi - Kelola prasarana dan profil Anda.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 font-[Roboto]">
          © 2021-2025 Institut Teknologi Sepuluh Nopember
        </p>
      </footer>
    </div>
  );
}