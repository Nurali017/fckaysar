import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFinishedMatches } from '@/hooks/api/useGames';

interface MatchResult {
    id: string; // UUID from API
    opponent: string;
    opponentLogo: string;
    score: string;
    date: string;
    competition: string;
    isHome: boolean;
    isWin: boolean;
    scorers?: string[];
}

export const LastMatches = () => {
    // Get FC Kaisar's finished matches from API
    const kaisarTeamId = Number(import.meta.env.VITE_FC_KAISAR_TEAM_ID);
    const { data: apiMatches = [], isLoading, error } = useFinishedMatches(kaisarTeamId, 5);

    // Transform API matches to MatchResult format
    const lastMatches: MatchResult[] = apiMatches.map((match) => {
        const isHome = match.homeTeam.name.includes('Кайсар') || match.homeTeam.name.includes('Kaisar') || match.homeTeam.name.includes('Kaysar');
        const homeScore = match.homeTeam.score ?? 0;
        const awayScore = match.awayTeam.score ?? 0;
        const isWin = isHome ? homeScore > awayScore : awayScore > homeScore;
        const opponent = isHome ? match.awayTeam : match.homeTeam;

        return {
            id: match.id, // Keep original UUID for navigation
            opponent: opponent.name,
            opponentLogo: opponent.logo,
            score: `${homeScore} : ${awayScore}`,
            date: match.date,
            competition: match.league || 'Kazakhstan Premier League',
            isHome,
            isWin,
        };
    });

    // Loading state
    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                        <Calendar className="w-8 h-8 text-red-500" />
                        Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Results</span>
                    </h2>
                </div>
                <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="w-[min(288px,85vw)] md:w-80 h-48 bg-white/10 rounded-2xl" />
                    ))}
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="container mx-auto px-4 py-12">
                <Alert className="bg-red-500/10 border-red-500/20">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-white">
                        Unable to load recent results. Please try again later.
                    </AlertDescription>
                </Alert>
            </section>
        );
    }

    // No matches state
    if (lastMatches.length === 0) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="text-center text-gray-400">
                    No recent results available.
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                    <Calendar className="w-8 h-8 text-red-500" />
                    Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Results</span>
                </h2>
                <Link to="/matches" className="text-sm text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center gap-1">
                    All Results <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-4">
                    {lastMatches.map((match, index) => (
                        <MatchResultCard key={match.id} match={match} index={index} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="bg-white/10" />
            </ScrollArea>
        </section>
    );
};

const MatchResultCard = ({ match, index }: { match: MatchResult; index: number }) => {
    return (
        <Link to={`/match/${match.id}`}>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-[min(288px,85vw)] md:w-80 flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden cursor-pointer"
            >
            {/* Result Indicator Strip */}
            <div className={`absolute top-0 left-0 w-1 h-full ${match.isWin ? 'bg-green-500' : match.score.includes(match.score.split(' : ')[0] === match.score.split(' : ')[1] ? 'bg-gray-500' : 'bg-red-500')}`} />

            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{match.competition}</span>
                <span className="text-xs font-bold text-gray-500">{match.date}</span>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                {/* Home Team (Logic for display based on isHome) */}
                <div className="flex flex-col items-center gap-2 flex-1">
                    <img
                        src={match.isHome ? "/images/logo.png" : match.opponentLogo}
                        alt="Team 1"
                        className="w-12 h-12 object-contain"
                        onError={(e) => (e.currentTarget.src = '/images/teams/placeholder-team.svg')}
                    />
                    <span className="text-xs font-bold uppercase text-center truncate w-full">
                        {match.isHome ? "Kaysar" : match.opponent}
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <span className={`text-3xl font-black tracking-tighter ${match.isWin ? 'text-green-500' : 'text-white'}`}>
                        {match.score}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded mt-1">
                        FT
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1">
                    <img
                        src={!match.isHome ? "/images/logo.png" : match.opponentLogo}
                        alt="Team 2"
                        className="w-12 h-12 object-contain"
                        onError={(e) => (e.currentTarget.src = '/images/teams/placeholder-team.svg')}
                    />
                    <span className="text-xs font-bold uppercase text-center truncate w-full">
                        {!match.isHome ? "Kaysar" : match.opponent}
                    </span>
                </div>
            </div>

                {/* Scorers */}
                {match.scorers && (
                    <div className="border-t border-white/10 pt-3 mt-3">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {match.scorers.map((scorer, i) => (
                                <span key={i} className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                    <Star className="w-3 h-3 text-white fill-white" />
                                    {scorer}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </Link>
    );
};
