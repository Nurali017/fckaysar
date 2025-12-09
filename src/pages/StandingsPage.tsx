import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trophy, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLeagueStandings } from '@/hooks/api/useStandings';

const StandingsPage = () => {
  const { i18n } = useTranslation();
  const { data: standings = [], isLoading, error } = useLeagueStandings();
  const lang = i18n.language as 'ru' | 'kk' | 'en';

  const labels = {
    ru: {
      title: 'Турнирная',
      titleHighlight: 'Таблица',
      subtitle: 'Премьер-Лига Казахстана 2025',
      backToHome: 'На главную',
      position: '#',
      team: 'Команда',
      played: 'И',
      won: 'В',
      drawn: 'Н',
      lost: 'П',
      gf: 'ЗМ',
      ga: 'ПМ',
      gd: '+/-',
      points: 'О',
      loading: 'Загрузка...',
      error: 'Ошибка загрузки',
      noData: 'Нет данных',
    },
    kk: {
      title: 'Турнирлік',
      titleHighlight: 'Кесте',
      subtitle: 'Қазақстан Премьер-Лигасы 2025',
      backToHome: 'Басты бетке',
      position: '#',
      team: 'Команда',
      played: 'О',
      won: 'Ж',
      drawn: 'Т',
      lost: 'Ж',
      gf: 'ТД',
      ga: 'ЖД',
      gd: '+/-',
      points: 'У',
      loading: 'Жүктелуде...',
      error: 'Қате',
      noData: 'Деректер жоқ',
    },
    en: {
      title: 'League',
      titleHighlight: 'Standings',
      subtitle: 'Kazakhstan Premier League 2025',
      backToHome: 'Back to Home',
      position: '#',
      team: 'Team',
      played: 'P',
      won: 'W',
      drawn: 'D',
      lost: 'L',
      gf: 'GF',
      ga: 'GA',
      gd: 'GD',
      points: 'Pts',
      loading: 'Loading...',
      error: 'Error loading',
      noData: 'No data',
    },
  };
  const l = labels[lang] || labels.ru;

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />
      <section className="relative pt-24 pb-12 bg-gradient-to-b from-red-900/20 via-red-900/5 to-black overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,100vw)] h-[min(400px,60vh)] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{l.backToHome}</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-2">
              <Trophy className="w-10 h-10 text-red-500" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter">
                {l.title} <span className="text-red-500">{l.titleHighlight}</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg md:text-xl">{l.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-gray-400 mb-8">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{l.loading}</span>
            </div>
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-white/10 rounded-lg" />
            ))}
          </div>
        )}
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-white">{l.error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && standings.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{l.noData}</p>
          </div>
        )}

        {standings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase w-12">
                      {l.position}
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase">
                      {l.team}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase w-12">
                      {l.played}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase w-12">
                      {l.won}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase w-12">
                      {l.drawn}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase w-12">
                      {l.lost}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase w-12">
                      {l.gf}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase w-12">
                      {l.ga}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase w-16">
                      {l.gd}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase w-16">
                      {l.points}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <motion.tr
                      key={team.teamId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-b border-white/5 hover:bg-white/5 ${team.isKaisar ? 'bg-red-500/10 hover:bg-red-500/20' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${team.rank <= 3 ? 'bg-yellow-500/20 text-yellow-500' : team.rank >= standings.length - 1 ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-gray-400'}`}
                        >
                          {team.rank}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={team.logo}
                            alt={team.teamName}
                            className="w-8 h-8 object-contain"
                            onError={e =>
                              (e.currentTarget.src = '/images/teams/placeholder-team.svg')
                            }
                          />
                          <span
                            className={`font-bold ${team.isKaisar ? 'text-red-500' : 'text-white'}`}
                          >
                            {team.teamName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-400">{team.played}</td>
                      <td className="px-4 py-4 text-center text-green-500 font-medium">
                        {team.won}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-400">{team.drawn}</td>
                      <td className="px-4 py-4 text-center text-red-500 font-medium">
                        {team.lost}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-400">{team.goalsFor}</td>
                      <td className="px-4 py-4 text-center text-gray-400">{team.goalsAgainst}</td>
                      <td
                        className={`px-4 py-4 text-center font-bold ${team.goalDifference > 0 ? 'text-green-500' : team.goalDifference < 0 ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        {team.goalDifference > 0 ? '+' : ''}
                        {team.goalDifference}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg font-black ${team.isKaisar ? 'bg-red-500 text-white' : 'bg-white/10 text-white'}`}
                        >
                          {team.points}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-white/10">
              {standings.map((team, index) => (
                <motion.div
                  key={team.teamId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`p-4 ${team.isKaisar ? 'bg-red-500/10' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${team.rank <= 3 ? 'bg-yellow-500/20 text-yellow-500' : team.rank >= standings.length - 1 ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-gray-400'}`}
                      >
                        {team.rank}
                      </span>
                      <img
                        src={team.logo}
                        alt={team.teamName}
                        className="w-8 h-8 object-contain"
                        onError={e => (e.currentTarget.src = '/images/teams/placeholder-team.svg')}
                      />
                      <span
                        className={`font-bold text-sm ${team.isKaisar ? 'text-red-500' : 'text-white'}`}
                      >
                        {team.teamName}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg font-black ${team.isKaisar ? 'bg-red-500 text-white' : 'bg-white/10 text-white'}`}
                    >
                      {team.points}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">{l.played}</p>
                      <p className="text-white font-medium">{team.played}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">{l.won}</p>
                      <p className="text-green-500 font-medium">{team.won}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">{l.drawn}</p>
                      <p className="text-white font-medium">{team.drawn}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">{l.lost}</p>
                      <p className="text-red-500 font-medium">{team.lost}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">{l.gd}</p>
                      <p
                        className={`font-medium ${team.goalDifference > 0 ? 'text-green-500' : team.goalDifference < 0 ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        {team.goalDifference > 0 ? '+' : ''}
                        {team.goalDifference}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StandingsPage;
