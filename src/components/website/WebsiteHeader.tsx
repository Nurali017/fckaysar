import { Button } from "@/components/ui/button";
import { Search, User, Globe, Menu } from "lucide-react";
import kaisarLogo from "@/assets/kaisar-logo.jpg";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export const WebsiteHeader = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        "ЖАҢАЛЫҚТАР", "КОМАНДА", "ОЙЫНДАР", "БИЛЕТТЕР", "ДҮКЕН", "АКАДЕМИЯ"
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-black/95 border-r-white/10 text-white w-[300px]">
                            <div className="flex items-center gap-3 mt-8 mb-8 cursor-pointer" onClick={() => { navigate("/"); setIsOpen(false); }}>
                                <img
                                    src="/images/logo.png"
                                    alt="FC KAYSAR"
                                    className="h-10 w-10 object-contain"
                                />
                                <span className="font-bold text-xl tracking-tighter text-white">FC KAYSAR</span>
                            </div>
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a key={link} href="#" className="text-lg font-medium hover:text-red-500 transition-colors" onClick={() => setIsOpen(false)}>
                                        {link}
                                    </a>
                                ))}
                            </nav>

                        </SheetContent>
                    </Sheet>

                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        title="Презентацияға оралу"
                    >
                        <img src={kaisarLogo} alt="FC KAYSAR" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
                        <span className="text-xl md:text-2xl font-bold tracking-tighter uppercase text-white hidden sm:block">FC KAYSAR</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        {navLinks.map((link) => (
                            <a key={link} href="#" className="hover:text-red-500 transition-colors">{link}</a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hidden sm:flex">
                        <Search className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hidden sm:flex">
                        <Globe className="w-5 h-5" />
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 md:px-6 text-xs md:text-sm">
                        <User className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">КІРУ</span>
                        <span className="sm:hidden">КІРУ</span>
                    </Button>
                </div>
            </div>
        </header >
    );
};
