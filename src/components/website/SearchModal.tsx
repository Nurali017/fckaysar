import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X, ArrowRight, Newspaper, Users, Calendar, BarChart3, ShoppingBag, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Static search items (pages and sections)
const searchItems = [
  {
    id: 'news',
    icon: Newspaper,
    title: { ru: 'Новости', kk: 'Жаңалықтар', en: 'News' },
    description: { ru: 'Последние новости клуба', kk: 'Клубтың соңғы жаңалықтары', en: 'Latest club news' },
    path: '/#news',
    keywords: ['новости', 'news', 'жаңалықтар', 'статьи', 'пресса'],
  },
  {
    id: 'team',
    icon: Users,
    title: { ru: 'Команда', kk: 'Команда', en: 'Team' },
    description: { ru: 'Состав и игроки', kk: 'Құрам және ойыншылар', en: 'Squad and players' },
    path: '/#team',
    keywords: ['команда', 'team', 'игроки', 'players', 'ойыншылар', 'состав', 'roster'],
  },
  {
    id: 'matches',
    icon: Calendar,
    title: { ru: 'Матчи', kk: 'Матчтар', en: 'Matches' },
    description: { ru: 'Расписание и результаты', kk: 'Кесте және нәтижелер', en: 'Schedule and results' },
    path: '/matches',
    keywords: ['матчи', 'matches', 'матчтар', 'расписание', 'schedule', 'результаты', 'results'],
  },
  {
    id: 'statistics',
    icon: BarChart3,
    title: { ru: 'Статистика', kk: 'Статистика', en: 'Statistics' },
    description: { ru: 'Статистика команды', kk: 'Команда статистикасы', en: 'Team statistics' },
    path: '/statistics',
    keywords: ['статистика', 'statistics', 'голы', 'goals', 'таблица', 'table'],
  },
  {
    id: 'shop',
    icon: ShoppingBag,
    title: { ru: 'Магазин', kk: 'Дүкен', en: 'Shop' },
    description: { ru: 'Официальная атрибутика', kk: 'Ресми атрибутика', en: 'Official merchandise' },
    path: '/shop',
    keywords: ['магазин', 'shop', 'дүкен', 'форма', 'jersey', 'атрибутика', 'merchandise'],
  },
  {
    id: 'academy',
    icon: GraduationCap,
    title: { ru: 'Академия', kk: 'Академия', en: 'Academy' },
    description: { ru: 'Футбольная академия', kk: 'Футбол академиясы', en: 'Football academy' },
    path: '/academy',
    keywords: ['академия', 'academy', 'школа', 'youth', 'молодежь', 'обучение'],
  },
];

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'ru') as 'ru' | 'kk' | 'en';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(searchItems);

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults(searchItems);
      return;
    }

    const q = query.toLowerCase();
    const filtered = searchItems.filter((item) => {
      const titleMatch = item.title[lang]?.toLowerCase().includes(q);
      const descMatch = item.description[lang]?.toLowerCase().includes(q);
      const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(q));
      return titleMatch || descMatch || keywordMatch;
    });
    setResults(filtered);
  }, [query, lang]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (path: string) => {
    if (path.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const sectionId = path.replace('/#', '');
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(path);
    }
    setQuery('');
    onClose();
  };

  const placeholders = {
    ru: 'Поиск по сайту...',
    kk: 'Сайт бойынша іздеу...',
    en: 'Search the site...',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[550px] p-0 gap-0 bg-zinc-900 border-white/10 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-white/10">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholders[lang]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 text-lg py-6"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-2"
              >
                {results.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium group-hover:text-red-400 transition-colors">
                          {item.title[lang]}
                        </h4>
                        <p className="text-gray-500 text-sm truncate">
                          {item.description[lang]}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-red-400 transition-colors" />
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">
                  {lang === 'kk'
                    ? 'Ештеңе табылмады'
                    : lang === 'en'
                      ? 'Nothing found'
                      : 'Ничего не найдено'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard hints */}
        <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-white/10 text-xs text-gray-600">
          <span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400">Enter</kbd>{' '}
            {lang === 'kk' ? 'таңдау' : lang === 'en' ? 'select' : 'выбрать'}
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400">Esc</kbd>{' '}
            {lang === 'kk' ? 'жабу' : lang === 'en' ? 'close' : 'закрыть'}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
