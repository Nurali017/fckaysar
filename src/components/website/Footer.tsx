import { Instagram, Mail, MapPin } from 'lucide-react';
import kaisarLogo from '@/assets/kaisar-logo.jpg';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black border-t border-white/10 text-white" role="contentinfo">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and About */}
          <section
            aria-labelledby="footer-about"
            className="text-center sm:text-left sm:col-span-2 lg:col-span-1"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <img
                  src={kaisarLogo}
                  alt="FC KAYSAR"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                />
                <span className="text-xl sm:text-2xl font-bold">FC KAYSAR</span>
              </div>
              {/* Social Links */}
              <nav aria-label="Social media links">
                <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
                  <a
                    href="https://www.instagram.com/fckaysar_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Follow FC Kaisar on Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.threads.net/@fckaysar_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Follow FC Kaisar on Threads"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.104-1.126 3.449-1.13h.026c1.053.006 1.96.246 2.707.715.248.155.477.335.684.54l-.07-3.497 2.12-.042.107 5.322c.005.208.01.417.01.626 0 .098-.002.196-.005.294.112.476.164.982.152 1.514-.094 2.487-1.025 4.48-2.77 5.923C16.883 23.159 14.738 23.98 12.186 24zm.323-7.41c-.095 0-.19.002-.285.007-1.476.08-2.315.88-2.268 1.738.028.49.335.95.87 1.296.613.399 1.434.59 2.312.543 1.079-.058 1.9-.45 2.44-1.121.424-.527.73-1.255.894-2.125-.53-.284-1.147-.384-1.83-.384l-.024.003c-.746 0-1.475.015-2.109.043z" />
                    </svg>
                  </a>
                  <a
                    href="https://t.me/fckaysar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Join FC Kaisar on Telegram"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>
                </div>
              </nav>
            </div>
          </section>

          {/* Quick Links */}
          <section aria-labelledby="footer-quick-links" className="text-center sm:text-left">
            <nav>
              <h3
                id="footer-quick-links"
                className="font-display font-bold text-xl mb-4 text-white uppercase"
              >
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-2 sm:space-y-2.5 text-gray-400 text-sm sm:text-base font-mono">
                <li>
                  <a
                    href="/news"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.links.news')}
                  </a>
                </li>
                {/* ... (other items) */}
                <li>
                  <a
                    href="/team"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.links.team')}
                  </a>
                </li>
                <li>
                  <a
                    href="/matches"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.links.matches')}
                  </a>
                </li>
                <li>
                  <a
                    href="/statistics"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.links.statistics')}
                  </a>
                </li>
              </ul>
            </nav>
          </section>

          {/* Club Info */}
          <section aria-labelledby="footer-club-info" className="text-center sm:text-left">
            <nav>
              <h3 id="footer-club-info" className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                {t('footer.clubInfo')}
              </h3>
              <ul className="space-y-2 sm:space-y-2.5 text-gray-400 text-sm sm:text-base">
                <li>
                  <a
                    href="/club/history"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.club.history')}
                  </a>
                </li>
                <li>
                  <a
                    href="/academy"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.club.academy')}
                  </a>
                </li>
                <li>
                  <a
                    href="/club/partners"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.club.partners')}
                  </a>
                </li>
                <li>
                  <a
                    href="/news"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.club.press')}
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@fckaysar.kz"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.club.contact')}
                  </a>
                </li>
              </ul>
            </nav>
          </section>

          {/* Contact */}
          <section aria-labelledby="footer-contact" className="text-center sm:text-left">
            <h3 id="footer-contact" className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
              {t('footer.contact')}
            </h3>
            <address className="not-italic">
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2 justify-center sm:justify-start">
                  <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-left">{t('footer.address')}</span>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <a
                    href="mailto:info@kaysar.kz"
                    className="hover:text-red-500 transition-colors active:text-red-500"
                  >
                    info@kaysar.kz
                  </a>
                </li>
              </ul>
            </address>
          </section>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
          <p className="text-center sm:text-left">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a
              href="/privacy"
              className="hover:text-red-500 transition-all duration-200 cursor-pointer py-1 active:text-red-500"
            >
              {t('footer.privacy')}
            </a>
            <a
              href="/terms"
              className="hover:text-red-500 transition-all duration-200 cursor-pointer py-1 active:text-red-500"
            >
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
