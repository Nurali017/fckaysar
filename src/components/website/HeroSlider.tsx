import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import matchBg from "@/assets/website-hero-bg.webp";

export const HeroSlider = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={matchBg}
                    alt="Stadium Atmosphere"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center pt-20 md:pt-0">
                <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left duration-1000">
                    <span className="inline-block px-4 py-1 bg-red-600 text-white text-sm font-bold tracking-wider uppercase mb-4">
                        Ресми сайт
                    </span>
                    <h1 className="text-5xl md:text-9xl font-black italic tracking-tighter text-white leading-none">
                        WE ARE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                            KAYSAR
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
                        "Дала Қасқырларының" сандық әлеміне қош келдіңіз.
                        Қызылорда футболының тарихы, бүгінгісі және болашағы.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-8">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 h-14 text-lg font-bold uppercase tracking-wide w-full sm:w-auto">
                            Абонемент сатып алу
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 h-14 text-lg font-bold uppercase tracking-wide w-full sm:w-auto">
                            Клуб туралы
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
                <span className="text-xs uppercase tracking-widest">Төмен жылжытыңыз</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </div>
        </div>
    );
};
