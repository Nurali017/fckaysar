import { Button } from '@/components/ui/button';
import { Search, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import kaisarLogo from '@/assets/kaysar-logo-nobg.png';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchModal } from './SearchModal';

// Компонент NavDropdown с hover-эффектом для классического меню ФК
interface NavItem {
  key: string;
  label: string;
  path?: string;
}

interface NavDropdownProps {
  label: string;
  items: NavItem[];
  onNavigate: (path: string) => void;
}

const NavDropdown = ({ label, items, onNavigate }: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className={`relative py-3 flex items-center gap-1.5 transition-colors ${isOpen ? 'text-white' : 'hover:text-white'}`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-500' : ''}`}
        />
      </button>

      {/* Dropdown с CSS анимацией */}
      <div
        className={`absolute top-full left-0 pt-1 z-50 transition-all duration-200 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <div
          className="bg-black/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden min-w-[200px] shadow-xl shadow-black/50"
          style={{ willChange: 'transform' }} // Safari fix for backdrop-blur
        >
          {/* Красная линия сверху */}
          <div className="h-0.5 bg-gradient-to-r from-red-600 to-red-500" />
          <div className="py-1.5">
            {items.map(item => (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.path || '');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-gray-300 hover:text-white hover:bg-white/5 transition-all relative group/item flex items-center"
              >
                {/* Красная полоска слева при hover */}
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-600 scale-y-0 group-hover/item:scale-y-100 transition-transform origin-center" />
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WebsiteHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    setIsScrolled(latest > 50);
  });

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Новая структура навигации по образцу ФК Краснодар
  const navStructure = [
    {
      key: 'club',
      label: t('nav.club', 'Клуб'),
      hasDropdown: true,
      items: [
        { key: 'about', label: t('nav.about', 'О клубе'), path: '/club' },
        { key: 'leadership', label: t('nav.leadership', 'Руководство'), path: '/club/leadership' },
        { key: 'history', label: t('nav.history', 'История'), path: '/club/history' },
        {
          key: 'infrastructure',
          label: t('nav.infrastructure', 'Инфраструктура'),
          path: '/club/infrastructure',
        },
        { key: 'partners', label: t('nav.partners', 'Партнёры'), path: '/club/partners' },
        { key: 'contacts', label: t('nav.contacts', 'Контакты'), path: '/club/contacts' },
        { key: 'city', label: t('nav.city', 'О городе'), path: '/city' },
      ],
    },
    {
      key: 'team',
      label: t('nav.team', 'Команда'),
      hasDropdown: true,
      items: [
        { key: 'roster', label: t('nav.roster', 'Состав'), path: '/team' },
        { key: 'staff', label: t('nav.staff', 'Тренерский штаб'), path: '/team/staff' },
        { key: 'statistics', label: t('nav.statistics', 'Статистика'), path: '/statistics' },
      ],
    },
    {
      key: 'academy',
      label: t('nav.academy', 'Академия'),
      hasDropdown: true,
      items: [
        { key: 'academyMain', label: t('nav.academyAbout', 'Об академии'), path: '/academy' },
        {
          key: 'youthTeams',
          label: t('nav.youthTeams', 'Молодёжные команды'),
          path: '/academy/teams',
        },
        { key: 'coaches', label: t('nav.coaches', 'Тренеры'), path: '/academy/coaches' },
        { key: 'branches', label: t('nav.branches', 'Филиалы'), path: '/academy/branches' },
        {
          key: 'recommend',
          label: t('nav.recommendPlayer', 'Рекомендовать игрока'),
          path: '/academy/recommend',
        },
      ],
    },
    {
      key: 'matches',
      label: t('nav.matches', 'Ойындар'),
      hasDropdown: true,
      items: [
        { key: 'calendar', label: t('nav.calendar', 'Календарь'), path: '/matches' },
        { key: 'results', label: t('nav.results', 'Результаты'), path: '/matches?tab=results' },
        { key: 'standings', label: t('nav.standings', 'Таблица'), path: '/standings' },
        { key: 'statistics', label: t('nav.statistics', 'Статистика'), path: '/statistics' },
      ],
    },
    {
      key: 'news',
      label: t('nav.news', 'Жаңалықтар'),
      hasDropdown: true,
      items: [
        { key: 'allNews', label: t('nav.allNews', 'Все новости'), path: '/news' },
        { key: 'media', label: t('nav.media', 'Медиа'), path: '/media' },
      ],
    },
    {
      key: 'fans',
      label: t('nav.fans', 'Жанкүйерге'),
      hasDropdown: true,
      items: [
        { key: 'stadium', label: t('nav.stadium', 'Стадион'), path: '/stadium' },
        { key: 'seasonPass', label: t('nav.seasonPass', 'Абонемент'), path: '/tickets' },
        { key: 'vipBox', label: t('nav.vipBox', 'Ложа VIP'), path: '/vip-box' },
        { key: 'rules', label: t('nav.rules', 'Правила'), path: '/fans/rules' },
      ],
    },
  ];

  // State для раскрытых подменю в мобильном меню
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  const toggleMobileSubmenu = (key: string) => {
    setExpandedMobileMenu(prev => (prev === key ? null : key));
  };

  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
      // Scroll to section on home page
      navigate('/');
      setTimeout(() => {
        const sectionId = path.replace('/#', '');
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Navigate to page
      navigate(path);
    }
  };

  const languages = [
    { code: 'kk', name: 'ҚАЗ', flag: '🇰🇿' },
    { code: 'ru', name: 'РУС', flag: '🇷🇺' },
    { code: 'en', name: 'ENG', flag: '🇬🇧' },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-white/10 py-2'
          : 'bg-transparent border-transparent py-4'
      }`}
      style={{ willChange: 'transform' }} // Safari fix for backdrop-blur
    >
      <div className="relative container mx-auto px-3 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-black/95 border-r-white/10 text-white w-[min(300px,85vw)]"
            >
              <div
                className="flex items-center gap-3 mt-8 mb-8 cursor-pointer"
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
              >
                <img src={kaisarLogo} alt="FC KAYSAR" className="h-10 w-10 object-contain" />
                <span className="font-bold text-xl tracking-tighter text-white">FC KAYSAR</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navStructure.map(section => (
                  <div key={section.key}>
                    <button
                      className="w-full text-lg font-medium hover:text-red-500 transition-colors text-left py-3 min-h-[48px] active:bg-white/5 rounded-lg px-2 -mx-2 flex items-center justify-between"
                      onClick={() => toggleMobileSubmenu(section.key)}
                    >
                      <span>{section.label}</span>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedMobileMenu === section.key ? 'rotate-90 text-red-500' : ''
                        }`}
                      />
                    </button>
                    {/* Подменю */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        expandedMobileMenu === section.key
                          ? 'max-h-[500px] opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pl-4 border-l-2 border-red-500/30 ml-2 space-y-1 pb-2">
                        {section.items.map(item => (
                          <button
                            key={item.key}
                            className="w-full text-left py-2.5 px-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors min-h-[44px] text-sm"
                            onClick={() => {
                              handleNavClick(item.path || '');
                              setIsOpen(false);
                              setExpandedMobileMenu(null);
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </nav>

              {/* Mobile Language Switcher */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-sm text-gray-400 mb-3">Тіл / Язык / Language</p>
                <div className="flex flex-col gap-1">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg min-h-[48px] hover:bg-white/10 active:bg-white/15 transition-colors ${
                        i18n.language === lang.code ? 'bg-white/10 text-red-500' : ''
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={kaisarLogo}
              alt="FC KAYSAR"
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter uppercase text-white hidden sm:block">
              FC KAYSAR
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-3 lg:gap-5 text-[13px] font-semibold text-gray-300 uppercase tracking-wide">
            {navStructure.map(item => (
              <NavDropdown
                key={item.key}
                label={item.label}
                items={item.items}
                onNavigate={handleNavClick}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
            onClick={() => setIsSearchOpen(true)}
            title="Поиск (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Desktop Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hidden sm:flex gap-1 px-3"
              >
                <span className="text-sm font-bold">
                  {currentLang.flag} {currentLang.name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/95 border-white/10 text-white">
              {languages.map(lang => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`cursor-pointer hover:bg-white/10 focus:bg-white/10 ${
                    i18n.language === lang.code ? 'text-red-500' : ''
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.header>
  );
};
