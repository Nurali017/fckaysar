import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '@/components/website/PageWrapper';
import { SEO } from '@/components/SEO';
import { useLeagueStandings } from '@/hooks/api/useStandings';

const StandingsPage = () => {
  const { i18n } = useTranslation();
  const { data: standings = [], isLoading, error } = useLeagueStandings();
  const lang = i18n.language as 'ru' | 'kk' | 'en';

  const labels = {
    ru: {
      title: 'Турнирная Таблица',
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
      title: 'Турнирлік Кесте',
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
      title: 'Expert League Standings',
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
    <PageWrapper>
      <SEO
        title="Турнирная таблица"
        description="Турнирная таблица Премьер-Лиги Казахстана"
        path="/standings"
      />
      <main className="bg-[hsl(222,47%,11%)] min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-red-500 hover:text-white mb-4 transition-colors font-mono text-xs uppercase tracking-wider"
            >
              <ChevronLeft className="w-3 h-3" /> {l.backToHome}
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-2 leading-none">
              {l.title.split(' ')[0]}{' '}
              <span className="text-red-600">{l.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="font-mono text-white/50 text-sm md:text-base max-w-2xl uppercase tracking-wider">
              {l.subtitle}
            </p>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center text-center text-white/60 gap-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <p>{l.error}</p>
            </div>
          ) : standings.length === 0 ? (
            <div className="py-20 text-center text-white/40 font-mono">{l.noData}</div>
          ) : (
            <div className="overflow-x-auto bg-white/5 border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/40 font-mono text-xs uppercase tracking-wider">
                    <th className="p-2 md:p-4 w-10 md:w-16 text-center">{l.position}</th>
                    <th className="p-2 md:p-4">{l.team}</th>
                    <th className="p-2 md:p-4 w-10 md:w-16 text-center">{l.played}</th>
                    <th className="p-2 md:p-4 w-10 md:w-16 text-center text-green-500/70">
                      {l.won}
                    </th>
                    <th className="p-2 md:p-4 w-10 md:w-16 text-center hidden sm:table-cell">
                      {l.drawn}
                    </th>
                    <th className="p-2 md:p-4 w-10 md:w-16 text-center text-red-500/70 hidden sm:table-cell">
                      {l.lost}
                    </th>
                    <th className="p-2 md:p-4 w-10 md:w-16 text-center hidden md:table-cell">
                      {l.gf}
                    </th>
                    <th className="p-2 md:p-4 w-10 md:w-16 text-center hidden md:table-cell">
                      {l.ga}
                    </th>
                    <th className="p-2 md:p-4 w-10 md:w-16 text-center hidden sm:table-cell">
                      {l.gd}
                    </th>
                    <th className="p-2 md:p-4 w-12 md:w-20 text-center text-white font-bold">
                      {l.points}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, _index) => (
                    <tr
                      key={team.teamId}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${
                        team.isKaisar ? 'bg-red-900/10' : ''
                      }`}
                    >
                      <td className="p-2 md:p-4 text-center font-mono text-white/60">
                        {team.rank}
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-2 md:gap-4">
                          <img
                            src={team.logo}
                            alt={team.teamName}
                            className="w-6 h-6 md:w-8 md:h-8 object-contain transition-all"
                            onError={e => {
                              e.currentTarget.src = '/images/placeholder-team.svg';
                            }}
                          />
                          <span
                            className={`font-display uppercase text-sm md:text-lg tracking-wide ${
                              team.isKaisar
                                ? 'text-red-500'
                                : 'text-white group-hover:text-white/80'
                            }`}
                          >
                            {team.teamName}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 md:p-4 text-center font-mono text-white/60">
                        {team.played}
                      </td>
                      <td className="p-2 md:p-4 text-center font-mono text-green-500">
                        {team.won}
                      </td>
                      <td className="p-2 md:p-4 text-center font-mono text-white/40 hidden sm:table-cell">
                        {team.drawn}
                      </td>
                      <td className="p-2 md:p-4 text-center font-mono text-red-500 hidden sm:table-cell">
                        {team.lost}
                      </td>
                      <td className="p-2 md:p-4 text-center font-mono text-white/40 hidden md:table-cell">
                        {team.goalsFor}
                      </td>
                      <td className="p-2 md:p-4 text-center font-mono text-white/40 hidden md:table-cell">
                        {team.goalsAgainst}
                      </td>
                      <td className="p-2 md:p-4 text-center font-mono text-white/60 hidden sm:table-cell">
                        {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                      </td>
                      <td className="p-2 md:p-4 text-center">
                        <span
                          className={`font-display text-2xl ${team.isKaisar ? 'text-red-500' : 'text-white'}`}
                        >
                          {team.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  );
};

export default StandingsPage;
