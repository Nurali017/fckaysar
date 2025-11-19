import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { BenefitsSection } from "@/components/BenefitsSection";
import { PrototypesSection } from "@/components/PrototypesSection";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import kaisarLogo from "@/assets/kaisar-logo.jpg";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-8">
            <img
              src={kaisarLogo}
              alt="FC Kaisar Logo"
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Превратите ФК Кайсар в
            <span className="block bg-gradient-premium bg-clip-text text-transparent">
              Цифровую Империю
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Премиальная цифровая платформа, которая повышает имидж вашего клуба, углубляет вовлечённость болельщиков
            и открывает новые потоки доходов — всё под вашим полным контролем.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Prototypes Section */}
      <PrototypesSection />

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Выберите свою цифровую эволюцию
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Три пакета, созданные для ваших амбиций и роста вместе с клубом
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <PricingCard
            title="Стандарт"
            price="1,000,000"
            originalPrice="3,000,000"
            description="Современный официальный сайт клуба"
            features={[
              "Официальный сайт клуба",
              "Расписание матчей и результаты",
              "Список состава с профилями игроков",
              "Турнирные таблицы и статистика",
              "Протоколы матчей",
              "Админ-панель для управления контентом",
              "Система публикации новостей",
              "Базовая аналитика посещаемости"
            ]}
            purpose="Запустите современный цифровой дом для ФК Кайсар"
          />

          <PricingCard
            title="Цифровая Экосистема"
            price="10,000,000"
            originalPrice="20,000,000"
            description="Полная профессиональная платформа"
            features={[
              "Всё из пакета Стандарт, плюс:",
              "Мультисезонная аналитика игроков",
              "Продвинутое отслеживание эффективности",
              "Данные роста и развития игроков",
              "Полные профили персонала и тренеров",
              "Медиа-разделы (видео, интервью)",
              "Личные кабинеты болельщиков",
              "Мобильное приложение с push-уведомлениями",
              "Системы лояльности и подписок",
              "Интеграции с CRM и базами данных"
            ]}
            purpose="Создайте мирового класса цифровую экосистему, которая глубоко вовлекает фанатов и позиционирует ФК Кайсар как современный профессиональный клуб"
            highlighted
          />

          <PricingCard
            title="Профессиональный"
            price="20,000,000"
            originalPrice="40,000,000"
            description="Полный контроль + независимая продажа билетов"
            features={[
              "Всё из пакета Цифровая Экосистема, плюс:",
              "Независимая платформа продажи билетов",
              "Без Ticketon — вы владеете системой",
              "Генерация QR-кодов билетов",
              "Валидация и сканирование на входе",
              "Полные дашборды продаж",
              "Аналитика выручки по матчам/секторам",
              "Продажи через сайт, приложение и профили",
              "Финансовая отчётность и аналитика",
              "Полное владение платформой"
            ]}
            purpose="Получите полный финансовый контроль и устраните посреднические комиссии, создавая новые потоки доходов для ФК Кайсар"
            premium
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-card backdrop-blur-sm border border-border shadow-card">
          <h2 className="text-4xl md:text-5xl font-bold">
            Готовы возглавить цифровое будущее?
          </h2>
          <p className="text-xl text-muted-foreground">
            Мы готовы представить рабочий прототип и обсудить детали реализации,
            адаптированные специально для ФК Кайсар.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-premium text-primary-foreground hover:opacity-90 transition-opacity text-lg px-8 py-6">
              Запланировать презентацию
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10">
              Технические детали
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
