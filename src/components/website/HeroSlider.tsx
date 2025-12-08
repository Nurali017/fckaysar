import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import matchBg from "@/assets/website-hero-bg.webp";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const HeroSlider = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    return (
        <div ref={ref} className="relative h-screen w-full overflow-hidden">
            {/* Background Image with Parallax */}
            <motion.div style={{ y, opacity }} className="absolute inset-0">
                <img
                    src={matchBg}
                    alt="Stadium Atmosphere"
                    className="w-full h-full object-cover scale-110" // Scaled up slightly to prevent whitespace during parallax
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
            </motion.div>

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center pt-16 sm:pt-20 md:pt-0">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl space-y-4 sm:space-y-6"
                >
                    <motion.span variants={itemVariants} className="inline-block px-3 py-1 sm:px-4 bg-red-600 text-white text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 sm:mb-4">
                        {t("hero.officialSite")}
                    </motion.span>

                    <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black italic tracking-tighter text-white leading-none">
                        {t("hero.newEra")} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                            {t("hero.teamName")}
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
                        {t("hero.newOwner")}
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 md:pt-8">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                size="lg"
                                className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-bold uppercase tracking-wide w-full sm:w-auto shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-shadow duration-300"
                                onClick={() => navigate('/about')}
                            >
                                {t("hero.aboutClub")}
                                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-bold uppercase tracking-wide w-full sm:w-auto backdrop-blur-sm"
                                onClick={() => document.getElementById('matches')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                {t("nav.matches")}
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator - hidden on very small screens */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/50 hidden sm:flex"
            >
                <motion.div
                    animate={{ height: [0, 48, 0], y: [0, 0, 48] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-px bg-gradient-to-b from-white/50 to-transparent"
                />
            </motion.div>
        </div>
    );
};
