export const NewsScreen = () => {
    const news = [
        {
            id: 1,
            title: "Кайсар vs Кайрат: Матч алдындағы баспасөз мәслихаты",
            date: "Бүгін, 14:00",
            category: "Команда",
            image: "https://picsum.photos/800/600?random=1"
        },
        {
            id: 2,
            title: "Думан Нәрзілдаев: «Біз жеңіске дайынбыз»",
            date: "Кеше, 18:30",
            category: "Интервью",
            image: "https://picsum.photos/800/600?random=2"
        },
        {
            id: 3,
            title: "Жанкүйерлер назарына: Билеттер сатылымы басталды",
            date: "19 Қараша",
            category: "Клуб",
            image: "https://picsum.photos/800/600?random=3"
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Соңғы жаңалықтар</h2>

            <div className="space-y-4">
                {news.map((item) => (
                    <div key={item.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 active:scale-95 transition-transform">
                        <div className="h-32 overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{item.category}</span>
                                <span className="text-[10px] text-zinc-500">•</span>
                                <span className="text-[10px] text-zinc-500">{item.date}</span>
                            </div>
                            <h3 className="font-bold text-white leading-tight">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
