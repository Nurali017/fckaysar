import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import kaisarLogo from "@/assets/kaisar-logo.jpg";
import kairatLogo from "@/assets/kairat-logo.png";

export const MatchCenterWidget = () => {
    return (
        <div className="absolute bottom-0 right-0 md:right-12 md:bottom-12 w-full md:w-auto z-40">
            <div className="bg-black/90 backdrop-blur-md border border-white/10 p-6 md:rounded-2xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-sm tracking-wider">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        Келесі ойын
                    </div>
                    <div className="text-gray-400 text-xs font-mono">
                        QFL PREMIER LEAGUE
                    </div>
                </div>

                <div className="flex items-center justify-between gap-8 mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <img src={kaisarLogo} alt="Kaisar" className="w-16 h-16 object-contain drop-shadow-lg" />
                        <span className="font-bold text-lg">KAISAR</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-3xl font-black text-white/20">VS</span>
                        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                            24 МАМЫР
                        </span>
                        <span className="text-xl font-bold text-white">18:00</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <img src={kairatLogo} alt="Kairat" className="w-16 h-16 object-contain drop-shadow-lg" />
                        <span className="font-bold text-lg">KAIRAT</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>Ғани Мұратбаев стадионы</span>
                    </div>

                    <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 uppercase tracking-wide">
                        Билет сатып алу
                    </Button>
                </div>
            </div>
        </div>
    );
};
