import { Users, TrendingUp, Sparkles } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Глубокая вовлечённость болельщиков",
      description: "Общайтесь со своими сторонниками как никогда раньше. Предоставьте им персонализированный опыт, эксклюзивный контент и прямые каналы связи, которые превратят случайных зрителей в страстных фанатов."
    },
    {
      icon: TrendingUp,
      title: "Новые потоки доходов",
      description: "Максимизируйте доходы клуба. Исключите лишние комиссии, внедрив собственную систему продаж билетов и атрибутики."
    },
    {
      icon: Sparkles,
      title: "Современный профессиональный имидж",
      description: "Цифровое присутствие мирового класса сигнализирует об амбициях, профессионализме и передовом мышлении — привлекая лучших спонсоров, игроков и внимание СМИ."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20 bg-card/30 backdrop-blur-sm rounded-3xl">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Почему ФК Кайсар нужно это <span className="text-accent">сейчас</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="space-y-4 p-6 rounded-xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
