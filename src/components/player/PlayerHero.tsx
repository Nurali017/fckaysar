import { useTranslation } from 'react-i18next';
import narzildaevPhoto from "@/assets/narzildaev.webp";

export const PlayerHero = () => {
    const { t } = useTranslation();

    return (
        <div className="relative min-h-[500px] h-auto overflow-hidden bg-gradient-to-br from-black via-red-950/30 to-black py-12 md:py-0">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
                }}></div>
            </div>

            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                    {/* Player Photo */}
                    <div className="relative order-2 md:order-1">
                        <div className="absolute inset-0 bg-red-600/20 blur-3xl"></div>
                        <img
                            src={narzildaevPhoto}
                            alt="Думан Нәрзілдаев"
                            className="relative z-10 w-full h-auto max-h-[350px] md:max-h-[450px] object-contain drop-shadow-2xl mx-auto"
                        />
                    </div>

                    {/* Player Info */}
                    <div className="space-y-6 text-white order-1 md:order-2 text-center md:text-left">
                        <div className="space-y-2">
                            <div className="text-6xl md:text-9xl font-black text-red-600 opacity-20">10</div>
                            <h1 className="text-4xl md:text-6xl font-bold -mt-12 md:-mt-24 relative z-10">
                                Думан<br />Нәрзілдаев
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-lg">
                            <div>
                                <div className="text-gray-400 text-sm">{t('playerHero.position')}</div>
                                <div className="font-bold">{t('team.positions.midfielder')}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm">{t('playerHero.number')}</div>
                                <div className="font-bold text-red-500">#10</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm">{t('playerHero.age')}</div>
                                <div className="font-bold">31</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm">{t('playerHero.nationality')}</div>
                                <div className="font-bold">{t('playerHero.country')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
