import { useTranslation } from 'react-i18next';

const PARTNERS = [
  {
    id: 1,
    name: 'TAU GROUP LTD',
    role: 'Генеральный партнёр',
    roleEn: 'General Partner',
  },
  {
    id: 2,
    name: 'Reebok',
    role: 'Технический партнёр',
    roleEn: 'Technical Partner',
    logo: '/images/partners/reebok.png',
  },
];

export const PartnersSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 md:py-16 lg:py-24 px-4 md:px-8 max-w-[1440px] mx-auto border-t border-white/10">
      <h2 className="text-2xl md:text-3xl font-display uppercase text-white mb-4 text-center tracking-wider">
        {t('partners.title', 'Партнёры')}
      </h2>
      <p className="text-white/40 text-center text-sm mb-12 uppercase tracking-widest">
        {t('partners.subtitle', 'Официальные партнёры клуба')}
      </p>

      <div className="flex flex-wrap justify-center items-stretch gap-4 md:gap-8 lg:gap-16">
        {PARTNERS.map(partner => (
          <div
            key={partner.id}
            className="group flex flex-col items-center gap-4 px-4 py-4 md:px-8 md:py-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-500 min-w-[120px] sm:min-w-[150px] md:min-w-[200px]"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400/70 font-medium">
              {partner.role}
            </span>

            <div className="h-16 md:h-20 flex items-center justify-center">
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full w-auto object-contain max-w-[160px] brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
              ) : (
                <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.15em] opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {partner.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
