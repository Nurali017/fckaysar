import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import kaisarLogo from '@/assets/kaisar-logo.jpg';
import { useTranslation } from 'react-i18next';
import { env } from '@/lib/env';

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
              <p className="text-gray-400 text-sm leading-relaxed" id="footer-about">
                {t('footer.description')}
              </p>
              {/* Social Links */}
              <nav aria-label="Social media links">
                <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
                  <a
                    href="https://www.facebook.com/fckyzylzhar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Follow FC Kaisar on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
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
                    href="https://twitter.com/fc_kaisar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Follow FC Kaisar on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@fckaisar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Subscribe to FC Kaisar on YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </nav>
            </div>
          </section>

          {/* Quick Links */}
          <section aria-labelledby="footer-quick-links" className="text-center sm:text-left">
            <nav>
              <h3 id="footer-quick-links" className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-2 sm:space-y-2.5 text-gray-400 text-sm sm:text-base">
                <li>
                  <a
                    href="/news"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.links.news')}
                  </a>
                </li>
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
                <li>
                  <a
                    href="/gallery"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.links.gallery')}
                  </a>
                </li>
                <li>
                  <a
                    href="/shop"
                    className="hover:text-red-500 transition-all duration-200 sm:hover:translate-x-1 inline-block py-1 active:text-red-500"
                  >
                    {t('footer.links.shop')}
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
                  <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <a
                    href={`tel:${env.VITE_FC_KAISAR_PHONE}`}
                    className="hover:text-red-500 transition-colors active:text-red-500"
                  >
                    {env.VITE_FC_KAISAR_PHONE}
                  </a>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <a
                    href={`mailto:${env.VITE_FC_KAISAR_EMAIL}`}
                    className="hover:text-red-500 transition-colors active:text-red-500"
                  >
                    {env.VITE_FC_KAISAR_EMAIL}
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
