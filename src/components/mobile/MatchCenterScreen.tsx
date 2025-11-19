import { useState } from "react";
import kaisarLogo from "@/assets/kaisar-logo.jpg";
import kairatLogo from "@/assets/kairat-logo.png";
import { GoalNotification } from "./GoalNotification";
import { Button } from "@/components/ui/button";

export const MatchCenterScreen = () => {
    const [showGoal, setShowGoal] = useState(false);
    const [score, setScore] = useState({ home: 1, away: 0 });

    const triggerGoal = () => {
        setShowGoal(true);
        setScore(prev => ({ ...prev, home: prev.home + 1 }));
    };

    return (
        <div className="relative min-h-full">
            <GoalNotification
                show={showGoal}
                onClose={() => setShowGoal(false)}
                scorer="Думан Нәрзілдаев"
                minute="78"
            />

            {/* Match Header */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 pb-10 rounded-b-[32px] border-b border-zinc-800">
                <div className="text-center text-zinc-400 text-xs font-medium mb-6 uppercase tracking-wider">
                    Премьер-Лига • 24 Тур
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg shadow-red-900/20">
                            <img src={kaisarLogo} alt="Kaisar" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-bold">KAYSAR</span>
                    </div>

                    <div className="flex flex-col items-center w-1/3">
                        <div className="text-4xl font-black text-white tracking-tight flex items-center gap-2">
                            <span>{score.home}</span>
                            <span className="text-zinc-600">:</span>
                            <span>{score.away}</span>
                        </div>
                        <div className="text-red-500 font-bold text-sm mt-1 animate-pulse">78'</div>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg">
                            <img src={kairatLogo} alt="Kairat" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-sm">Кайрат</span>
                    </div>
                </div>

                {/* Demo Trigger */}
                <Button
                    onClick={triggerGoal}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-red-900/30 transition-all active:scale-95"
                >
                    ГОЛ СОҒУ (Демо)
                </Button>
            </div>

            {/* Timeline / Stats */}
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between text-sm font-medium text-zinc-400 border-b border-zinc-800 pb-4">
                    <span className="text-white border-b-2 border-red-600 pb-4 -mb-4">Таймлайн</span>
                    <span>Құрамдар</span>
                    <span>Статистика</span>
                </div>

                <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
                    {/* Event Item */}
                    <div className="flex gap-4 relative">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center z-10 text-xs font-bold text-zinc-400 shrink-0">
                            78'
                        </div>
                        <div className="flex-1 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">⚽️</span>
                                <span className="font-bold text-white">Гол!</span>
                            </div>
                            <div className="text-sm text-zinc-400">Думан Нәрзілдаев (Кайсар)</div>
                        </div>
                    </div>

                    <div className="flex gap-4 relative">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center z-10 text-xs font-bold text-zinc-400 shrink-0">
                            65'
                        </div>
                        <div className="flex-1 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-4 h-5 bg-yellow-400 rounded-sm inline-block"></span>
                                <span className="font-bold text-white">Сары қағаз</span>
                            </div>
                            <div className="text-sm text-zinc-400">Жоао Пауло (Кайрат)</div>
                        </div>
                    </div>

                    <div className="flex gap-4 relative">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center z-10 text-xs font-bold text-zinc-400 shrink-0">
                            45'
                        </div>
                        <div className="flex-1 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                            <div className="font-bold text-white">2-ші тайм басталды</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
