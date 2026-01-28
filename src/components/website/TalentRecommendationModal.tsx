import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlayerRecommendationForm from '@/components/forms/PlayerRecommendationForm';
import { createPortal } from 'react-dom';

interface TalentRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TalentRecommendationModal = ({ isOpen, onClose }: TalentRecommendationModalProps) => {
  const { t } = useTranslation();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {t('talentRecommendation.modalTitle', 'Рекомендовать талант')}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {t('talentRecommendation.modalSubtitle', 'Помогите нам найти будущих звёзд')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-gray-500 [&_textarea]:bg-white/10 [&_textarea]:border-white/20 [&_textarea]:text-white [&_textarea]:placeholder:text-gray-500 [&_button[role=combobox]]:bg-white/10 [&_button[role=combobox]]:border-white/20 [&_button[role=combobox]]:text-white [&_label]:text-gray-200 [&_p]:text-gray-400 [&_button[role=checkbox]]:border-white/40">
                <PlayerRecommendationForm />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TalentRecommendationModal;
