import mockupWebsite from "@/assets/mockup-website.png";
import mockupPlayerProfile from "@/assets/mockup-player-profile.png";
import mockupRealProfile from "@/assets/kaisar_profile_real_narzildaev_1763588825921.png";
import mockupMobileApp from "@/assets/mockup-mobile-app.png";
import mockupTicketing from "@/assets/mockup-ticketing.png";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const PrototypesSection = () => {
  const prototypes = [
    {
      title: "Главная страница ФК Кайсар",
      description: "Современный дизайн в красно-белых цветах с героем Айбаром Жаксылыковым",
      image: mockupWebsite,
      package: "Standard"
    },
    {
      title: "Профиль игрока: Думан Нарзилдаев",
      description: "Полная статистика полузащитника, тепловые карты и история выступлений",
      image: mockupRealProfile,
      package: "Digital Ecosystem"
    },
    {
      title: "Мобильное приложение Кайсар",
      description: "Матч-центр игры против Астаны, новости и уведомления для фанатов",
      image: mockupMobileApp,
      package: "Digital Ecosystem"
    },
    {
      title: "Билеты на стадион Гани Муратбаева",
      description: "Выбор мест на схеме стадиона, покупка в один клик и QR-проход",
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
          <Dialog key={idx}>
            <DialogTrigger asChild>
              <Card
                className="group overflow-hidden bg-card/50 border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
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
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white font-semibold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                      Нажмите, чтобы увеличить
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-xl font-bold">{prototype.title}</h3>
                  <p className="text-muted-foreground">{prototype.description}</p>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
              <img
                src={prototype.image}
                alt={prototype.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </DialogContent>
          </Dialog>
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
