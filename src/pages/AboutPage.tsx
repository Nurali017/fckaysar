import { PageWrapper } from '@/components/website/PageWrapper';
import { useTranslation } from 'react-i18next';
import { FadeInWhenVisible } from '@/components/animations/FadeInWhenVisible';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Target, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import kaisarLogo from '@/assets/kaisar-logo.jpg';

const AboutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <FadeInWhenVisible>
            <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full mb-6">
              <span className="text-red-500 text-sm font-bold uppercase tracking-wider">
                {t('about.hero.badge')}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
              {t('about.hero.description')}
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('about.backToHome')}
            </Button>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full mb-6">
                  <span className="text-red-500 text-sm font-bold uppercase tracking-wider">
                    {t('about.history.badge')}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
                  {t('about.history.title')}
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  {t('about.history.description')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <Calendar className="h-8 w-8 text-red-500 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">{t('about.history.founded')}</p>
                    <p className="text-3xl font-black">{t('about.history.foundedYear')}</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <MapPin className="h-8 w-8 text-red-500 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">{t('about.history.stadium')}</p>
                    <p className="text-lg font-bold">{t('about.history.stadiumName')}</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <Users className="h-8 w-8 text-red-500 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">{t('about.history.capacity')}</p>
                    <p className="text-2xl font-black">{t('about.history.capacityNumber')}</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="flex gap-2 mb-3">
                      <div className="w-8 h-8 bg-red-600 rounded-full" />
                      <div className="w-8 h-8 bg-black border-2 border-white rounded-full" />
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{t('about.history.colors')}</p>
                    <p className="text-lg font-bold">{t('about.history.colorsDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-red-600/20 to-transparent rounded-2xl border border-white/10 flex items-center justify-center">
                  <img
                    src={kaisarLogo}
                    alt="FC Kaisar"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain"
                  />
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-t border-white/10 bg-white/5">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full mb-6">
                <span className="text-red-500 text-sm font-bold uppercase tracking-wider">
                  {t('about.mission.badge')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
                {t('about.mission.title')}
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed mb-12">
                {t('about.mission.description')}
              </p>

              {/* Vision */}
              <div className="bg-black/50 p-8 rounded-2xl border border-white/10 mb-12">
                <Target className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">{t('about.mission.vision')}</h3>
                <p className="text-gray-400 text-lg">{t('about.mission.visionText')}</p>
              </div>

              {/* Values */}
              <div>
                <h3 className="text-2xl font-bold mb-8">{t('about.mission.values')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {['value1', 'value2', 'value3', 'value4'].map((value, idx) => (
                    <div
                      key={value}
                      className="bg-black/50 p-6 rounded-xl border border-white/10 hover:border-red-600/50 transition-all"
                    >
                      <div className="text-3xl font-black text-red-500 mb-2">0{idx + 1}</div>
                      <p className="font-bold">{t(`about.mission.${value}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* New Era Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full mb-6">
                  <span className="text-red-500 text-sm font-bold uppercase tracking-wider">
                    {t('about.newEra.badge')}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
                  {t('about.newEra.title')}
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  {t('about.newEra.description')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {['point1', 'point2', 'point3'].map(point => (
                  <div
                    key={point}
                    className="bg-gradient-to-br from-red-600/10 to-transparent p-8 rounded-2xl border border-white/10 text-center hover:border-red-600/50 transition-all"
                  >
                    <Trophy className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">{t(`about.newEra.${point}`)}</h3>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10 bg-gradient-to-b from-transparent to-red-900/10">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <div className="max-w-3xl mx-auto text-center">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
                Станьте частью истории
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Поддержите Дала Қасқырлары на их пути к новым вершинам
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/team')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
                >
                  Наша Команда
                </Button>
                <Button
                  onClick={() => navigate('/matches')}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Расписание Матчей
                </Button>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </PageWrapper>
  );
};

export default AboutPage;
