import { PlayerHero } from "@/components/player/PlayerHero";
import { StatsGrid } from "@/components/player/StatsGrid";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlayerProfilePrototype = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white pb-20">
            {/* Navigation */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="container mx-auto pointer-events-auto">
                    <Button
                        variant="ghost"
                        className="text-white hover:text-red-500 hover:bg-white/10 gap-2"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Артқа
                    </Button>
                </div>
            </div>

            <main>
                <PlayerHero />
                <StatsGrid />

            </main>
        </div>
    );
};

export default PlayerProfilePrototype;
