import { useState } from "react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { MatchCenterScreen } from "@/components/mobile/MatchCenterScreen";
import { NewsScreen } from "@/components/mobile/NewsScreen";
import { TabBar } from "@/components/mobile/TabBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileAppPrototype = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('match');

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white flex flex-col items-center justify-center relative">
            {/* Navigation */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
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

            <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold">KAYSAR Mobile App</h1>
                <p className="text-zinc-400">Интерактивті прототип</p>
            </div>

            <MobileFrame>
                {activeTab === 'match' && <MatchCenterScreen />}
                {activeTab === 'news' && <NewsScreen />}
                {activeTab === 'home' && <div className="flex items-center justify-center h-full text-zinc-500">Басты бет (Әзірленуде)</div>}
                {activeTab === 'profile' && <div className="flex items-center justify-center h-full text-zinc-500">Профиль (Әзірленуде)</div>}

                <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            </MobileFrame>
        </div>
    );
};

export default MobileAppPrototype;
