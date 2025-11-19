import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export const PrototypesSection = () => {
  const navigate = useNavigate();
  const prototypes = [
    {
      title: "Официальный сайт ФК KAYSAR",
      description: "Современный дизайн в красно-белых цветах",
      url: "/prototype/website",
      package: "Standard"
    },
    {
      title: "Профиль игрока: Думан Нарзилдаев",
      description: "Полная статистика полузащитника, тепловые карты и история выступлений",
      url: "/prototype/player",
      package: "Digital Ecosystem"
    },
    {
      title: "Мобильное приложение KAYSAR",
      description: "Матч-центр игры против Астаны, новости и уведомления для болельщиков",
      url: "/prototype/mobile",
      package: "Digital Ecosystem"
    },
    {
      title: "Билеты на стадион",
      description: "Выбор мест на схеме стадиона, покупка в один клик и QR-билет",
      url: "/prototype/ticketing",
      package: "Professional"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Визуальные прототипы платформы
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Примеры интерфейсов, которые получит ФК KAYSAR на каждом уровне
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
        {prototypes.map((prototype, idx) => (
          <Card
            key={idx}
            className="group overflow-hidden bg-card/50 border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={() => navigate(prototype.url)}
          >
            <div className="relative aspect-video overflow-hidden bg-secondary">
              <div className="w-full h-full relative">
                <iframe
                  src={prototype.url}
                  className="w-[200%] h-[200%] transform scale-50 origin-top-left pointer-events-none select-none"
                  title={prototype.title}
                  tabIndex={-1}
                />
                <div className="absolute inset-0 z-10 bg-transparent" /> {/* Overlay to prevent interaction */}
              </div>

              <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 backdrop-blur-sm text-accent-foreground text-sm font-semibold rounded-full z-20">
                {prototype.package}
              </div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                <span className="text-white font-semibold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  Открыть Live Демо
                </span>
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
          Все интерфейсы разработаны по современным UX-стандартам и адаптированы под мобильные устройства и планшеты
        </p>
      </div>
    </section>
  );
};
