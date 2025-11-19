import { Button } from "@/components/ui/button";
import { Search, User, Globe } from "lucide-react";
import kaisarLogo from "@/assets/kaisar-logo.jpg";
import { useNavigate } from "react-router-dom";

export const WebsiteHeader = () => {
    const navigate = useNavigate();
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        title="Презентацияға оралу"
                    >
                        <img src={kaisarLogo} alt="FC Kaisar" className="h-12 w-12 object-contain" />
                        <span className="text-2xl font-bold tracking-tighter uppercase text-white">FC Kaisar</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <a href="#" className="hover:text-red-500 transition-colors">ЖАҢАЛЫҚТАР</a>
                        <a href="#" className="hover:text-red-500 transition-colors">КОМАНДА</a>
                        <a href="#" className="hover:text-red-500 transition-colors">ОЙЫНДАР</a>
                        <a href="#" className="hover:text-red-500 transition-colors">БИЛЕТТЕР</a>
                        <a href="#" className="hover:text-red-500 transition-colors">ДҮКЕН</a>
                        <a href="#" className="hover:text-red-500 transition-colors">АКАДЕМИЯ</a>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Search className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Globe className="w-5 h-5" />
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6">
                        <User className="w-4 h-4 mr-2" />
                        КІРУ
                    </Button>
                </div>
            </div>
        </header>
    );
};
