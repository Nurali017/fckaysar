import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const NewsletterSubscription = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribe:', email);
    // TODO: Implement subscription logic
  };

  return (
    <section className="bg-red-700 py-16 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Text */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-display uppercase text-white mb-2">
            {t('newsletter.title', 'Subscribe to Newsletter')}
          </h2>
          <p className="text-white/80 font-mono text-sm md:text-base max-w-xl">
            {t(
              'newsletter.subtitle',
              'Stay updated with the latest news, match results, and exclusive content from FC Kaysar.'
            )}
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md lg:max-w-xl">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder', 'Your Email')}
              className="flex-1 bg-[hsl(222,47%,11%)] text-white font-mono text-sm px-6 py-4 outline-none border border-transparent focus:border-white/20 transition-colors placeholder:text-white/30"
              required
            />
            <button
              type="submit"
              className="bg-[hsl(222,47%,11%)] text-white font-mono uppercase text-sm font-bold px-8 py-4 hover:bg-white hover:text-[hsl(222,47%,11%)] transition-colors border border-[hsl(222,47%,11%)]"
            >
              {t('newsletter.subscribe', 'Subscribe')}
            </button>
          </form>
          <p className="text-white/40 text-[10px] md:text-xs font-mono mt-3 text-center lg:text-left">
            {t(
              'newsletter.consent',
              'By subscribing, you agree to receive marketing emails from FC Kaysar.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
};
