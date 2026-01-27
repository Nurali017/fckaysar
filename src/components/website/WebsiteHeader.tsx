import { Button } from '@/components/ui/button';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import kaisarLogo from '@/assets/kaysar-logo-nobg.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchModal } from './SearchModal';

export const WebsiteHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    setIsScrolled(latest > 20);
  });

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Keyboard shortcut for search
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    },
    [menuOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Navigation structure for the top bar (simple links)
  const topNavItems = [
    { key: 'club', label: t('nav.club', 'CLUB'), path: '/club' },
    { key: 'team', label: t('nav.team', 'TEAM'), path: '/team' },
    { key: 'matches', label: t('nav.matches', 'MATCHES'), path: '/matches' },
    { key: 'news', label: t('nav.news', 'NEWS'), path: '/news' },
    { key: 'fans', label: t('nav.fans', 'FANS'), path: '/fans' },
    { key: 'stadium', label: t('nav.stadium', 'STADIUM'), path: '/stadium' },
  ];

  // Mega menu structure — 2 rows x 4 columns
  const megaMenuSections = [
    // Row 1
    {
      key: 'club',
      label: t('nav.club', 'CLUB'),
      items: [
        { label: t('nav.about', 'About Club'), path: '/club' },
        { label: t('nav.leadership', 'Management'), path: '/club/leadership' },
        { label: t('nav.history', 'History'), path: '/club/history' },
        { label: t('nav.infrastructure', 'Infrastructure'), path: '/club/infrastructure' },
        { label: t('nav.partners', 'Partners'), path: '/club/partners' },
        { label: t('nav.contacts', 'Contacts'), path: '/club/contacts' },
      ],
    },
    {
      key: 'fans',
      label: t('nav.fans', 'FANS'),
      items: [
        { label: t('nav.city', 'City'), path: '/city' },
        { label: t('nav.seasonPass', 'Tickets'), path: '/tickets' },
      ],
    },
    // Row 2
    {
      key: 'team',
      label: t('nav.team', 'TEAM'),
      items: [
        { label: t('nav.roster', 'Roster'), path: '/team' },
        { label: t('nav.staff', 'Coaching Staff'), path: '/team/staff' },
        { label: t('nav.statistics', 'Statistics'), path: '/statistics' },
      ],
    },
    {
      key: 'matches',
      label: t('nav.matches', 'MATCHES'),
      items: [
        { label: t('nav.calendar', 'Calendar'), path: '/matches' },
        { label: t('nav.results', 'Results'), path: '/matches?tab=results' },
        { label: t('nav.standings', 'Table'), path: '/standings' },
      ],
    },
    {
      key: 'news-media',
      label: t('nav.news', 'NEWS'),
      items: [
        { label: t('nav.allNews', 'All News'), path: '/news' },
        { label: t('nav.media', 'Media'), path: '/media' },
      ],
    },
    {
      key: 'fans-extra',
      label: t('nav.fans', 'FANS'),
      items: [{ label: t('nav.city', 'City'), path: '/city' }],
    },
    {
      key: 'stadium',
      label: t('nav.stadium', 'STADIUM'),
      items: [{ label: t('nav.stadiumMain', 'Kaisar Arena'), path: '/stadium' }],
    },
  ];

  const languages = [
    { code: 'kk', name: 'KZ', flag: '🇰🇿' },
    { code: 'ru', name: 'RU', flag: '🇷🇺' },
    { code: 'en', name: 'EN', flag: '🇬🇧' },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          menuOpen
            ? 'bg-[#1a1a1a]'
            : isScrolled
              ? 'bg-black/95 backdrop-blur-md'
              : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-10 h-full">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={kaisarLogo}
                alt="FC KAYSAR"
                className="h-10 w-10 object-contain transition-all duration-300 group-hover:scale-105"
              />
            </div>

            {/* Desktop top nav links */}
            <nav className="hidden lg:flex items-center gap-6 h-full">
              {topNavItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`font-display text-base uppercase tracking-wider transition-colors ${
                    isActive(item.path) ? 'text-red-500' : 'text-white hover:text-red-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-red-500 rounded-none transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden sm:flex items-center gap-2 text-white hover:bg-white/10 hover:text-red-500 rounded-none h-10 px-3 font-mono text-sm"
                >
                  <span>{currentLang.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black/95 border-white/10 p-0 rounded-none w-32"
              >
                <div className="h-0.5 bg-red-600 w-full" />
                {languages.map(lang => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`rounded-none py-3 px-4 font-mono text-sm uppercase cursor-pointer hover:bg-white/5 focus:bg-white/5 ${
                      i18n.language === lang.code ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <span className="mr-3 text-base">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburger / Close */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-none"
              onClick={() => setMenuOpen(prev => !prev)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen Mega Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[99] bg-[#1a1a1a] pt-16 overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-12">
              {/* Mega menu grid: 4 cols on desktop, 2 on tablet, 1 on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
                {megaMenuSections.map(section => (
                  <div key={section.key}>
                    <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-4">
                      {section.label}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {section.items.map((item, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => {
                              navigate(item.path);
                              setMenuOpen(false);
                            }}
                            className="text-gray-400 hover:text-white font-mono text-sm uppercase tracking-wide transition-colors"
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mobile language switcher at bottom */}
              <div className="mt-12 flex sm:hidden gap-2 justify-center">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-4 py-2 border ${
                      i18n.language === lang.code
                        ? 'border-red-600 bg-red-600/10 text-white'
                        : 'border-white/10 text-gray-400'
                    } font-mono uppercase text-sm transition-all`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
