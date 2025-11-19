import { useEffect, useState } from "react";
import { Trophy, Timer, Activity, Target, Footprints, Shield, ArrowUpRight, AlertTriangle, Flag } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon?: any;
    delay?: number;
    variant?: "default" | "large" | "highlight";
}

const StatCard = ({ label, value, subValue, icon: Icon, delay = 0, variant = "default" }: StatCardProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const baseClasses = "relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-500 hover:border-red-600/30 hover:bg-zinc-900 group";
    const variants = {
        default: "col-span-1",
        large: "col-span-2 row-span-2",
        highlight: "col-span-1 bg-gradient-to-br from-red-950/30 to-zinc-900/50 border-red-900/30"
    };

    return (
        <div className={`${baseClasses} ${variants[variant]} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{label}</div>
                {Icon && <Icon className="w-5 h-5 text-zinc-600 group-hover:text-red-500 transition-colors" />}
            </div>

            <div className="relative z-10">
                <div className={`font-black text-white tracking-tighter ${variant === 'large' ? 'text-5xl md:text-7xl' : 'text-4xl'}`}>
                    {value}
                </div>
                {subValue && (
                    <div className="mt-2 text-sm font-medium text-zinc-500 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-red-500" />
                        {subValue}
                    </div>
                )}
            </div>

            {/* Decorative background glow */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-colors" />
        </div>
    );
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="col-span-full mt-8 mb-4">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-600 rounded-full"></span>
            {title}
        </h3>
    </div>
);

export const StatsGrid = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Main Stats (Matches) */}
                <StatCard
                    label="Матчтар"
                    value="18"
                    subValue="Премьер-Лига"
                    icon={Trophy}
                    delay={0}
                    variant="large"
                />

                <StatCard
                    label="Минуттар"
                    value="1686"
                    icon={Timer}
                    delay={100}
                />

                <StatCard
                    label="Негізгі құрам"
                    value="17"
                    icon={Activity}
                    delay={200}
                />

                <StatCard
                    label="xG көрсеткіші"
                    value="0.58"
                    subValue="0.03 / 90 мин"
                    icon={Target}
                    delay={300}
                    variant="highlight"
                />

                <StatCard
                    label="Алаңға шығу"
                    value="1"
                    subValue="Запастан"
                    delay={400}
                />
                <StatCard
                    label="Алмастырылды"
                    value="2"
                    delay={450}
                />

                {/* Attack */}
                <SectionHeader title="Шабуыл (Атака)" />
                <StatCard label="Голдар" value="0" delay={500} />
                <StatCard label="Голдық пастар" value="1" delay={550} />
                <StatCard label="Соққылар" value="31" subValue="11 тура соққы" delay={600} />
                <StatCard label="Алдап өту" value="27" subValue="17 сәтті" delay={650} />

                {/* Passing */}
                <SectionHeader title="Пастар (Передачи)" />
                <StatCard label="Барлық пастар" value="655" subValue="75% дәлдік" icon={Footprints} delay={700} />
                <StatCard label="Алға пастар" value="364" subValue="65% дәлдік" delay={750} />
                <StatCard label="Айып алаңына" value="129" subValue="49% дәлдік" delay={800} />
                <StatCard label="Кросстар" value="17" subValue="24% дәлдік" delay={850} />
                <StatCard label="Продвижение" value="118" delay={900} />
                <StatCard label="Кілттік пастар" value="18" delay={950} />

                {/* Defense */}
                <SectionHeader title="Қорғаныс (Оборона)" />
                <StatCard label="Төмендегі күрес" value="54" subValue="24 жеңіс" icon={Shield} delay={1000} />
                <StatCard label="Екінші қабат" value="27" subValue="12 жеңіс" icon={Shield} delay={1050} />
                <StatCard label="Тартып алу" value="18" icon={Shield} delay={1100} />
                <StatCard label="Тосқауылдау" value="51" icon={Shield} delay={1150} />
                <StatCard label="Доп жинау" value="143" icon={Shield} delay={1200} />
                <StatCard label="Блок" value="2" icon={Shield} delay={1250} />

                {/* Discipline */}
                <SectionHeader title="Тәртіп (Дисциплина)" />
                <StatCard label="Сары қағаз" value="4" icon={AlertTriangle} delay={1300} />
                <StatCard label="Қызыл қағаз" value="0" icon={Flag} delay={1350} />
                <StatCard label="Фолдар" value="28" subValue="26 жасалған" delay={1400} />
                <StatCard label="Офсайд" value="0" delay={1450} />
            </div>
        </div>
    );
};
