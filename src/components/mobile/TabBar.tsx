import { Home, Newspaper, Calendar, User } from "lucide-react";

interface TabBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
    const tabs = [
        { id: 'match', icon: Calendar, label: 'Матчтар' },
        { id: 'news', icon: Newspaper, label: 'Жаңалықтар' },
        { id: 'home', icon: Home, label: 'Басты' },
        { id: 'profile', icon: User, label: 'Профиль' },
    ];

    return (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-950 border-t border-zinc-800 flex items-center justify-around px-2 pb-4 z-50">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                const isDisabled = ['home', 'profile'].includes(tab.id);

                return (
                    <button
                        key={tab.id}
                        onClick={() => !isDisabled && onTabChange(tab.id)}
                        disabled={isDisabled}
                        className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-red-500' : 'text-zinc-500'
                            } ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:text-zinc-300'}`}
                    >
                        <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
