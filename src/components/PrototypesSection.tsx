import mockupWebsite from "@/assets/mockup-website.jpg";
import mockupPlayerProfile from "@/assets/mockup-player-profile.jpg";
import mockupMobileApp from "@/assets/mockup-mobile-app.jpg";
import mockupTicketing from "@/assets/mockup-ticketing.jpg";
import { Card } from "@/components/ui/card";

export const PrototypesSection = () => {
  const prototypes = [
    {
      title: "Главная страница сайта клуба",
      description: "Современный дизайн с расписанием матчей, новостями и составом команды",
      image: mockupWebsite,
      package: "Standard"
    },
    {
      title: "Профиль игрока с аналитикой",
      description: "Полная статистика игрока, графики эффективности, история карьеры",
      image: mockupPlayerProfile,
      package: "Digital Ecosystem"
    },
    {
      title: "Мобильное приложение",
      description: "iOS и Android приложения с результатами матчей, составом и новостями",
      image: mockupMobileApp,
      package: "Digital Ecosystem"
    },
    {
      title: "Система продажи билетов",
      description: "Выбор мест на стадионе, QR-коды, аналитика продаж и выручки",
      image: mockupTicketing,
      package: "Professional"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Визуальные Прототипы Платформы
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Примеры интерфейсов, которые получит FC Kaisar на каждом уровне
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {prototypes.map((prototype, idx) => (
          <Card 
            key={idx}
            className="group overflow-hidden bg-card/50 border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative aspect-video overflow-hidden bg-secondary">
              <img 
                src={prototype.image} 
                alt={prototype.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 backdrop-blur-sm text-accent-foreground text-sm font-semibold rounded-full">
                {prototype.package}
              </div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold">{prototype.title}</h3>
              <p className="text-muted-foreground">{prototype.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Все интерфейсы разработаны с учётом современных UX-стандартов и адаптированы для мобильных устройств и планшетов
        </p>
      </div>
    </section>
  );
};
