import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Target, CheckCircle2, Instagram, Vote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasVotedInPoll, getPollVote, savePollVote } from '@/lib/voting-storage';
import { useTranslation } from 'react-i18next';
import { useActivePolls, useSubmitPollVote } from '@/hooks/api/usePolls';
import { useIsMobile } from '@/hooks/useIsMobile';

// Icon mapping for different poll types
const getIconForPoll = (index: number) => {
  const icons = [Users, Target, Vote, Trophy];
  return icons[index % icons.length];
};

// Color schemes for polls
const colorSchemes = [
  {
    iconBg: 'bg-red-600/20',
    iconColor: 'text-red-500',
    hoverBorder: 'hover:border-red-500/50',
    selectedBg: 'bg-red-600/20',
    selectedBorder: 'border-red-500',
  },
  {
    iconBg: 'bg-blue-600/20',
    iconColor: 'text-blue-500',
    hoverBorder: 'hover:border-blue-500/50',
    selectedBg: 'bg-blue-600/20',
    selectedBorder: 'border-blue-500',
  },
  {
    iconBg: 'bg-green-600/20',
    iconColor: 'text-green-500',
    hoverBorder: 'hover:border-green-500/50',
    selectedBg: 'bg-green-600/20',
    selectedBorder: 'border-green-500',
  },
  {
    iconBg: 'bg-yellow-600/20',
    iconColor: 'text-yellow-500',
    hoverBorder: 'hover:border-yellow-500/50',
    selectedBg: 'bg-yellow-600/20',
    selectedBorder: 'border-yellow-500',
  },
];

export const FanZone = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'ru') as 'ru' | 'kk' | 'en';
  const isMobile = useIsMobile();

  // Fetch active polls from CMS
  const { data: polls = [], isLoading, error } = useActivePolls(10);
  const submitVote = useSubmitPollVote();

  // Track which polls user has voted in
  const [votedPolls, setVotedPolls] = useState<Record<string, number | null>>({});

  // Load existing votes from localStorage on mount
  useEffect(() => {
    if (polls.length === 0) return;

    const loadedVotes: Record<string, number | null> = {};
    polls.forEach(poll => {
      if (hasVotedInPoll(poll.id)) {
        loadedVotes[poll.id] = getPollVote(poll.id);
      }
    });
    setVotedPolls(loadedVotes);
  }, [polls]);

  const handleVote = async (pollId: string, optionIndex: number) => {
    // Don't allow re-voting
    if (votedPolls[pollId] !== undefined) return;

    // Save vote locally first
    savePollVote(pollId, optionIndex);
    setVotedPolls(prev => ({ ...prev, [pollId]: optionIndex }));

    // Submit to CMS
    try {
      await submitVote.mutateAsync({ pollId, optionIndex });
    } catch {
      // Vote is still saved locally even if CMS submission fails
    }
  };

  const hasVoted = (pollId: string) => votedPolls[pollId] !== undefined;
  const getVotedOption = (pollId: string) => votedPolls[pollId];

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-red-500 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  // Show error or empty state
  if (error || polls.length === 0) {
    return null; // Hide section if no polls available
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-zinc-900/60 relative overflow-hidden">
      {/* Dots Pattern Background - subtle */}
      <div className="absolute inset-0 bg-dots-pattern bg-dots-20 opacity-30" />

      {/* Center Spotlight - very subtle */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.04)_0%,transparent_60%)]" />

      {/* Top Border Line - softer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.3 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4"
          >
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
            Fan Zone
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 uppercase italic tracking-tighter">
            {lang === 'kk' ? 'Жанкүйер' : lang === 'en' ? 'Fan' : 'Голос'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              {lang === 'kk' ? 'Дауысы' : lang === 'en' ? 'Voice' : 'Фанатов'}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {polls.map((poll, pollIndex) => {
            const Icon = getIconForPoll(pollIndex);
            const colors = colorSchemes[pollIndex % colorSchemes.length];
            const voted = hasVoted(poll.id);
            const votedOptionIndex = getVotedOption(poll.id);

            return (
              <motion.div
                key={poll.id}
                initial={
                  isMobile ? { opacity: 1 } : { opacity: 0, x: pollIndex % 2 === 0 ? -20 : 20 }
                }
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: isMobile ? 0 : 0.3 }}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{poll.question}</h3>
                    {poll.description && (
                      <p className="text-gray-400 text-xs sm:text-sm">{poll.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {poll.options.map((option, i) => {
                    const isSelected = voted && votedOptionIndex === i;
                    const percentage = option.percentage;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleVote(poll.id, i)}
                        disabled={voted}
                        className={`w-full p-3 sm:p-4 rounded-xl border transition-all text-left relative overflow-hidden min-h-[48px] ${
                          voted
                            ? isSelected
                              ? `${colors.selectedBg} ${colors.selectedBorder}`
                              : 'bg-white/5 border-white/5'
                            : `bg-white/5 hover:bg-white/10 border-white/5 ${colors.hoverBorder} cursor-pointer active:bg-white/15`
                        }`}
                      >
                        {/* Progress bar for results */}
                        {voted && (
                          <motion.div
                            initial={{ width: isMobile ? `${percentage}%` : 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: isMobile ? 0 : 0.8, delay: isMobile ? 0 : 0.2 }}
                            className={`absolute inset-y-0 left-0 ${
                              isSelected ? colors.selectedBg : 'bg-white/5'
                            }`}
                          />
                        )}

                        <div className="relative flex justify-between items-center">
                          <div className="flex items-center gap-2 min-w-0">
                            {isSelected && (
                              <CheckCircle2
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.iconColor} flex-shrink-0`}
                              />
                            )}
                            <span
                              className={`font-medium text-sm sm:text-base truncate ${
                                voted
                                  ? isSelected
                                    ? 'text-white'
                                    : 'text-gray-400'
                                  : 'text-gray-300 group-hover:text-white'
                              }`}
                            >
                              {option.text}
                            </span>
                          </div>

                          {voted ? (
                            <span
                              className={`font-bold text-sm sm:text-base flex-shrink-0 ml-2 ${isSelected ? 'text-white' : 'text-gray-500'}`}
                            >
                              {percentage}%
                            </span>
                          ) : (
                            <span className="text-white/20 group-hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-xs sm:text-sm hidden sm:inline">
                              {lang === 'kk' ? 'Дауыс беру' : lang === 'en' ? 'Vote' : 'Голосовать'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {voted && (
                  <motion.p
                    initial={{ opacity: isMobile ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: isMobile ? 0 : 0.3 }}
                    className="text-center text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4"
                  >
                    {lang === 'kk'
                      ? 'Дауысыңызға рахмет!'
                      : lang === 'en'
                        ? 'Thanks for voting!'
                        : 'Спасибо за ваш голос!'}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Social CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 px-4">
            {lang === 'kk'
              ? 'Біздің әлеуметтік желілерде жаңалықтарды қадағалаңыз'
              : lang === 'en'
                ? 'Follow our news on social media'
                : 'Следите за новостями в наших соцсетях'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Button
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-white min-h-[48px] w-full sm:w-auto"
              onClick={() => window.open('https://www.instagram.com/fckaysar_official', '_blank')}
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
            <Button
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-white min-h-[48px] w-full sm:w-auto"
              onClick={() => window.open('https://t.me/fckaysar_official', '_blank')}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
