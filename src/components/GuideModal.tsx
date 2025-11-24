import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface GuideStep {
  title: string;
  description: string;
  imageUrl: string;
}

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: GuideStep[];
  title: string;
}

export function GuideModal({ isOpen, onClose, steps, title }: GuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-[Poppins] text-gray-800">{title}</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Progress Indicators */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "w-8 bg-blue-600"
                        : index < currentStep
                        ? "w-2 bg-blue-400"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-500 font-[Roboto]">
                  Langkah {currentStep + 1} dari {steps.length}
                </span>
              </div>
            </div>

            {/* Content with Animation */}
            <div className="relative overflow-hidden" style={{ minHeight: "400px" }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="p-6"
                >
                  {/* Image */}
                  <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={steps[currentStep].imageUrl}
                      alt={steps[currentStep].title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Step Title */}
                  <h3 className="text-2xl font-[Poppins] text-gray-800 mb-4">
                    {steps[currentStep].title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-gray-700 font-[Roboto] leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with Navigation */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-[Poppins] transition-all ${
                  currentStep === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Sebelumnya
              </button>

              {/* Next or Understood Button */}
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-[Poppins] hover:bg-blue-700 transition-colors shadow-md"
                >
                  Selanjutnya
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-[Poppins] hover:bg-green-700 transition-colors shadow-md"
                >
                  Mengerti ✓
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
