import { motion } from "framer-motion";
import { User, Award, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLeadership } from "@/hooks/api/useLeadership";
import { useMemo } from "react";

// Icon mapping helper
const getIconComponent = (iconName: string) => {
    const icons: Record<string, typeof Briefcase> = {
        briefcase: Briefcase,
        user: User,
        award: Award,
    };
    return icons[iconName] || User;
};

// Loading skeleton component
const LeaderSkeleton = () => (
    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-pulse">
        <div className="aspect-square bg-white/5" />
        <div className="bg-black/40 backdrop-blur-xl border-t-0 p-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 mb-4" />
            <div className="space-y-3">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="h-8 w-48 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/10 rounded" />
            </div>
        </div>
    </div>
);

export const NewLeadershipSection = () => {
    const { t } = useTranslation();
    const { data: leadershipPhotos, isLoading, isError } = useLeadership();

    // Merge CMS photos with i18n data
    const leaders = useMemo(() => {
        if (!leadershipPhotos) return [];

        return leadershipPhotos
            .map((photo) => {
                // Get leader data from i18n
                const leaderData = t(`newLeadership.leaders.${photo.key}`, {
                    returnObjects: true,
                    defaultValue: null,
                }) as any;

                // Skip if no i18n data found
                if (!leaderData || typeof leaderData === 'string') {
                    return null;
                }

                const IconComponent = getIconComponent(leaderData.icon);

                return {
                    key: photo.key,
                    role: leaderData.role,
                    name: leaderData.name,
                    description: leaderData.quote,
                    icon: IconComponent,
                    image: photo.photoUrl,
                    color: leaderData.color,
                };
            })
            .filter((leader): leader is NonNullable<typeof leader> => leader !== null);
    }, [leadershipPhotos, t]);

    // Don't render if error or no data
    if (isError || (!isLoading && leaders.length === 0)) {
        return null;
    }

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-900/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-900/10 blur-[120px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1 bg-white/10 text-white/80 text-sm font-bold tracking-wider uppercase mb-4 rounded-full border border-white/10">
                        {t('newLeadership.badge')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 uppercase italic tracking-tighter">
                        {t('newLeadership.title').split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                            {t('newLeadership.title').split(' ').slice(-1)}
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {t('newLeadership.description')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {isLoading
                        ? // Show 3 loading skeletons
                        Array.from({ length: 3 }).map((_, index) => (
                            <LeaderSkeleton key={index} />
                        ))
                        : // Show real leaders
                        leaders.map((leader, index) => (
                            <motion.div
                                key={leader.key}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                            >
                                {/* Image Block */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.src = '/images/placeholder-leader.jpg';
                                            e.currentTarget.onerror = null;
                                        }}
                                    />
                                    {/* Hover Border on Photo */}
                                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-colors duration-500 pointer-events-none" />
                                </div>

                                {/* Text Block - Below Photo */}
                                <div className="bg-black/40 backdrop-blur-xl border-t-0 p-6">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${leader.color} flex items-center justify-center shadow-lg`}
                                    >
                                        <leader.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-sm font-bold text-white/80 uppercase tracking-widest block mb-2">
                                            {leader.role}
                                        </span>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                                            {leader.name}
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {leader.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>

                {/* Stats / Trust Indicators */}
                <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 border-t border-white/10 pt-8 sm:pt-12">
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                            {t('newLeadership.stats.investment.value')}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                            {t('newLeadership.stats.investment.label')}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                            {t('newLeadership.stats.yearOfVictories.value')}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                            {t('newLeadership.stats.yearOfVictories.label')}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                            {t('newLeadership.stats.youthFocus.value')}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                            {t('newLeadership.stats.youthFocus.label')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
