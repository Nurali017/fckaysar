import { Button } from "@/components/ui/button";
import { Search, Menu, ChevronDown } from "lucide-react";
import kaisarLogo from "@/assets/kaysar-logo-nobg.png";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchModal } from "./SearchModal";

export const WebsiteHeader = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // Keyboard shortcut for search (Cmd/Ctrl + K)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsSearchOpen(true);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const navLinks = [
        { key: "news", label: t("nav.news"), path: "/news" },
        { key: "team", label: t("nav.team"), path: "/team" },
        { key: "matches", label: t("nav.matches"), path: "/matches" },
        { key: "statistics", label: t("nav.statistics"), path: "/statistics" },
        { key: "about", label: t("nav.about"), path: "/about" },
        { key: "academy", label: t("nav.academy"), path: "/academy" }
    ];

    const handleNavClick = (path: string) => {
        if (path.startsWith("/#")) {
            // Scroll to section on home page
            navigate("/");
            setTimeout(() => {
                const sectionId = path.replace("/#", "");
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        } else {
            // Navigate to page
            navigate(path);
        }
    };

    const languages = [
        { code: "kk", name: "ҚАЗ", flag: "🇰🇿" },
        { code: "ru", name: "РУС", flag: "🇷🇺" },
        { code: "en", name: "ENG", flag: "🇬🇧" }
    ];

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
                    ? "bg-black/80 backdrop-blur-md border-white/10 py-2"
                    : "bg-transparent border-transparent py-4"
                }`}
        >
            <div className="relative container mx-auto px-3 sm:px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 min-w-[44px] min-h-[44px]">
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-black/95 border-r-white/10 text-white w-[min(300px,85vw)]">
                            <div className="flex items-center gap-3 mt-8 mb-8 cursor-pointer" onClick={() => { navigate("/"); setIsOpen(false); }}>
                                <img
                                    src={kaisarLogo}
                                    alt="FC KAYSAR"
                                    className="h-10 w-10 object-contain"
                                />
                                <span className="font-bold text-xl tracking-tighter text-white">FC KAYSAR</span>
                            </div>
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.key}
                                        className="text-lg font-medium hover:text-red-500 transition-colors text-left py-3 min-h-[48px] active:bg-white/5 rounded-lg px-2 -mx-2"
                                        onClick={() => {
                                            handleNavClick(link.path);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {link.label}
                                    </button>
                                ))}
                            </nav>

                            {/* Mobile Language Switcher */}
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <p className="text-sm text-gray-400 mb-3">Тіл / Язык / Language</p>
                                <div className="flex flex-col gap-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                changeLanguage(lang.code);
                                                setIsOpen(false);
                                            }}
                                            className={`flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg min-h-[48px] hover:bg-white/10 active:bg-white/15 transition-colors ${i18n.language === lang.code ? 'bg-white/10 text-red-500' : ''
                                                }`}
                                        >
                                            <span className="text-xl">{lang.flag}</span>
                                            <span className="font-medium">{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <img src={kaisarLogo} alt="FC KAYSAR" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" />
                        <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter uppercase text-white hidden sm:block">FC KAYSAR</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-gray-300">
                        {navLinks.map((link) => (
                            <button
                                key={link.key}
                                onClick={() => handleNavClick(link.path)}
                                className="relative group py-2"
                            >
                                <span className="group-hover:text-white transition-colors">{link.label}</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
                        onClick={() => setIsSearchOpen(true)}
                        title="Поиск (Ctrl+K)"
                    >
                        <Search className="w-5 h-5" />
                    </Button>

                    {/* Desktop Language Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-white hover:bg-white/10 hidden sm:flex gap-1 px-3">
                                <span className="text-sm font-bold">{currentLang.flag} {currentLang.name}</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/95 border-white/10 text-white">
                            {languages.map((lang) => (
                                <DropdownMenuItem
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`cursor-pointer hover:bg-white/10 focus:bg-white/10 ${i18n.language === lang.code ? 'text-red-500' : ''
                                        }`}
                                >
                                    <span className="mr-2">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </motion.header>
    );
};
