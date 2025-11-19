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
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-6 md:mb-8">
            <img
              src={kaisarLogo}
              alt="FC Kaisar Logo"
              className="w-24 h-24 md:w-40 md:h-40 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h1 className="text-3xl md:text-6xl font-bold leading-tight uppercase">
            СОВРЕМЕННЫЕ ЦИФРОВЫЕ <br />
            <span className="bg-gradient-premium bg-clip-text text-transparent">
              ТЕХНОЛОГИИ ДЛЯ ФК КАЙСАР
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto px-2">
            Поднимаем имидж клуба на новый уровень, внедряя передовые технологии для работы с болельщиками.
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
              "Расписание матчей и результаты (Интеграция с СОТА)",
              "Список состава с профилями игроков",
              "Турнирные таблицы и статистика (Интеграция с СОТА)",
              "Протоколы матчей (Интеграция с СОТА)",
              "Админ-панель для управления контентом",
              "Система публикации новостей",
              "ЛАЙВ РЕЖИМ МАТЧИ",
              "МЕДИА И ФОТО",
              "ОБЗОРЫ И ССЫЛКИ НА ТРАНСЛЯЦИИ"
            ]}
            purpose="Запустите современный цифровой дом для ФК Кайсар"
          />

          <PricingCard
            title="Digital Ecosystem"
            price="10,000,000"
            originalPrice="20,000,000"
            description="Развитие вовлеченности болельщиков через цифровые технологии"
            features={[
              "Всё из пакета Стандарт, плюс:",
              "Мультисезонная аналитика игроков",
              "Продвинутое отслеживание эффективности",
              "Данные роста и развития игроков",
              "Полные профили персонала и тренеров",
              "Личные кабинеты болельщиков",
              "Мобильное приложение с push-уведомлениями",
              "Системы лояльности и подписок",
              "Интеграции с CRM и базами данных",
              "ОНЛАЙН МАГАЗИН"
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


    </div>
  );
};

export default Index;
