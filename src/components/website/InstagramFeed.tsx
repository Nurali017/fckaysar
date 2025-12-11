import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';

// Elfsight Widget ID from https://elfsight.com
const ELFSIGHT_WIDGET_ID = 'cc28739425124fd58a908f1a1d0e81ae';

export const InstagramFeed = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="elfsight"]')) {
      return;
    }

    // Load Elfsight platform script
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup is optional since Elfsight manages its own state
    };
  }, []);

  return (
    <section className="container mx-auto px-4 py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 0 : 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-500 text-sm font-bold uppercase tracking-wider mb-4"
          >
            <Instagram className="w-4 h-4" />
            {t('instagram.badge', 'Social')}
          </motion.div>

          <motion.h2
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: isMobile ? 0 : 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            {t('instagram.title', 'FOLLOW')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              {t('instagram.titleHighlight', 'US')}
            </span>
          </motion.h2>

          <motion.a
            href="https://instagram.com/fckaysar_official"
            target="_blank"
            rel="noopener noreferrer"
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: isMobile ? 0 : 0.2 }}
            className="text-gray-400 hover:text-pink-500 transition-colors text-lg"
          >
            @fckaysar_official
          </motion.a>
        </div>

        {/* Elfsight Widget Container */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: isMobile ? 0 : 0.3 }}
          className="max-w-[95vw] sm:max-w-6xl mx-auto"
        >
          {ELFSIGHT_WIDGET_ID === 'YOUR_WIDGET_ID' ? (
            // Placeholder when widget is not configured
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-12 text-center">
              <Instagram className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                {t('instagram.setupRequired', 'Instagram feed coming soon')}
              </p>
              <p className="text-gray-600 text-sm">
                Configure Elfsight widget ID in InstagramFeed.tsx
              </p>
            </div>
          ) : (
            // Actual Elfsight widget
            <div className={`elfsight-app-${ELFSIGHT_WIDGET_ID}`} data-elfsight-app-lazy />
          )}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: isMobile ? 0 : 0.4 }}
          className="text-center mt-10"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-8 h-12 rounded-full"
          >
            <a
              href="https://instagram.com/fckaysar_official"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5 mr-2" />
              {t('instagram.followButton', 'Follow on Instagram')}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
