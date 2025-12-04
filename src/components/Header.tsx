import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  userRole: "Mahasiswa" | "Dosen" | "Admin";
  onRoleSwitch: (role: "Mahasiswa" | "Dosen" | "Admin") => void;
}

export function Header({ userRole, onRoleSwitch }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<"Mahasiswa" | "Dosen" | "Admin" | null>(null);

  const handleRoleClick = (role: "Mahasiswa" | "Dosen" | "Admin") => {
    if (role !== userRole) {
      setPendingRole(role);
      setIsDropdownOpen(false);
      setIsConfirmModalOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleConfirmSwitch = () => {
    if (pendingRole) {
      onRoleSwitch(pendingRole);
      setIsConfirmModalOpen(false);
      setPendingRole(null);
    }
  };

  const handleCancelSwitch = () => {
    setIsConfirmModalOpen(false);
    setPendingRole(null);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" fill="white" />
              <rect x="9" y="2" width="5" height="5" fill="white" />
              <rect x="2" y="9" width="5" height="5" fill="white" />
            </svg>
          </div>
          <span className="text-gray-800 font-[Poppins]">myITS Thesis</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {/* Role Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 font-[Poppins] px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" fill="currentColor"/>
                  <path d="M8 9.5C5.23858 9.5 3 11.7386 3 14.5H13C13 11.7386 10.7614 9.5 8 9.5Z" fill="currentColor"/>
                </svg>
                Akses : {userRole}
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleRoleClick("Mahasiswa")}
                          className={`w-full px-4 py-2 text-left text-sm font-[Roboto] hover:bg-gray-50 transition-colors ${
                            userRole === "Mahasiswa" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" fill="currentColor"/>
                              <path d="M8 9.5C5.23858 9.5 3 11.7386 3 14.5H13C13 11.7386 10.7614 9.5 8 9.5Z" fill="currentColor"/>
                            </svg>
                            <span>Mahasiswa</span>
                            {userRole === "Mahasiswa" && (
                              <svg className="ml-auto w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                        <button
                          onClick={() => handleRoleClick("Dosen")}
                          className={`w-full px-4 py-2 text-left text-sm font-[Roboto] hover:bg-gray-50 transition-colors ${
                            userRole === "Dosen" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                              <circle cx="9" cy="6" r="3" fill="currentColor" />
                              <path d="M9 10C6.23858 10 4 12.2386 4 15H14C14 12.2386 11.7614 10 9 10Z" fill="currentColor" />
                            </svg>
                            <span>Dosen</span>
                            {userRole === "Dosen" && (
                              <svg className="ml-auto w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                        <button
                          onClick={() => handleRoleClick("Admin")}
                          className={`w-full px-4 py-2 text-left text-sm font-[Roboto] hover:bg-gray-50 transition-colors ${
                            userRole === "Admin" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" fill="currentColor"/>
                              <path d="M8 9.5C5.23858 9.5 3 11.7386 3 14.5H13C13 11.7386 10.7614 9.5 8 9.5Z" fill="currentColor"/>
                              <circle cx="12" cy="12" r="3" fill="currentColor"/>
                              <path d="M12 10.5V13.5M10.5 12H13.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                            <span>Admin</span>
                            {userRole === "Admin" && (
                              <svg className="ml-auto w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button className="ml-2 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
              <span className="font-[Poppins] font-bold">ID</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3" fill="white" />
              <path d="M10 11C7.23858 11 5 13.2386 5 16H15C15 13.2386 12.7614 11 10 11Z" fill="white" />
            </svg>
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && pendingRole && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleCancelSwitch}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={handleCancelSwitch}
            >
              <div
                className="bg-white rounded-lg shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-[Poppins] text-[18px]">Konfirmasi Pergantian Akses</h2>
                      <p className="text-sm text-blue-100 font-[Roboto] mt-1">
                        Anda akan beralih ke mode akses {pendingRole}
                      </p>
                    </div>
                    <button
                      onClick={handleCancelSwitch}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-700 font-[Roboto]">
                          Anda akan beralih dari akses <span className="font-semibold">{userRole}</span> ke{" "}
                          <span className="font-semibold">{pendingRole}</span>.
                        </p>
                        <p className="text-sm text-gray-600 font-[Roboto] mt-2">
                          Halaman akan kembali ke Beranda dan menampilkan fitur sesuai akses {pendingRole}.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 font-[Roboto]">
                    Apakah Anda yakin ingin melanjutkan?
                  </p>
                </div>

                {/* Modal Footer */}
                <div className="p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                  <button
                    onClick={handleCancelSwitch}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-[Roboto] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmSwitch}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-[Roboto] transition-colors"
                  >
                    Ya, Beralih
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}