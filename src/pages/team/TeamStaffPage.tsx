import { PageWrapper } from '@/components/website/PageWrapper';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TeamStaffPage = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <main className="bg-[hsl(222,47%,11%)] min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-2 leading-none">
              {t('staff.title', 'Coaching Staff')}
            </h1>
            <p className="font-mono text-white/50 text-sm md:text-base max-w-2xl uppercase tracking-wider">
              {t('staff.subtitle', 'Team Managers and Coaches')}
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-6 md:p-12 text-center">
              <Users className="w-16 h-16 text-red-600 mx-auto mb-6 opacity-80" />
              <p className="text-white/60 font-mono text-lg uppercase tracking-wide">
                {t('staff.comingSoon', 'Staff information will be added soon.')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default TeamStaffPage;
