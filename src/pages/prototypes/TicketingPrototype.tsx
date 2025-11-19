import { useState } from "react";
import { StadiumMap } from "@/components/ticketing/StadiumMap";
import { SeatGrid } from "@/components/ticketing/SeatGrid";
import { CartSummary } from "@/components/ticketing/CartSummary";
import { CheckoutModal } from "@/components/ticketing/CheckoutModal";
import { TicketView } from "@/components/ticketing/TicketView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TicketingPrototype = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'map' | 'seats' | 'success'>('map');
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const handleSectorSelect = (sectorId: string) => {
        setSelectedSector(sectorId);
        setStep('seats');
    };

    const handleSeatSelect = (seat: any) => {
        const exists = selectedSeats.find(s => s.row === seat.row && s.number === seat.number);
        if (exists) {
            setSelectedSeats(prev => prev.filter(s => s !== exists));
        } else {
            setSelectedSeats(prev => [...prev, { ...seat, sectorId: selectedSector }]);
        }
    };

    const handleRemoveSeat = (index: number) => {
        setSelectedSeats(prev => prev.filter((_, i) => i !== index));
    };

    const handleCheckoutSuccess = () => {
        setIsCheckoutOpen(false);
        setStep('success');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white pb-20">
            {/* Navigation */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="container mx-auto pointer-events-auto flex justify-between items-center">
                    <Button
                        variant="ghost"
                        className="text-white hover:text-red-500 hover:bg-white/10 gap-2"
                        onClick={() => {
                            if (step === 'seats') setStep('map');
                            else navigate("/");
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {step === 'seats' ? 'Сектор таңдау' : 'Артқа'}
                    </Button>

                    <div className="text-xl font-bold">
                        <span className="text-red-600">KAYSAR</span> Tickets
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 pt-24">
                {step === 'map' && (
                    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-bold">Секторды таңдаңыз</h1>
                            <p className="text-zinc-400">KAYSAR vs Кайрат • 19 Қараша • 19:00</p>
                        </div>
                        <StadiumMap
                            onSectorSelect={handleSectorSelect}
                            selectedSector={selectedSector}
                        />
                    </div>
                )}

                {step === 'seats' && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-40 lg:pb-0">
                        <div className="lg:col-span-2">
                            <SeatGrid
                                sectorId={selectedSector!}
                                price={2000} // Dynamic price based on sector could be added
                                onSeatSelect={handleSeatSelect}
                                selectedSeats={selectedSeats}
                            />
                        </div>
                        <div className="hidden lg:block">
                            <CartSummary
                                selectedSeats={selectedSeats}
                                onRemoveSeat={handleRemoveSeat}
                                onCheckout={() => setIsCheckoutOpen(true)}
                            />
                        </div>

                        {/* Mobile Fixed Cart */}
                        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 lg:hidden z-40 safe-area-bottom">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="text-sm text-zinc-400">Таңдалды: {selectedSeats.length}</div>
                                    <div className="text-xl font-bold text-white">{selectedSeats.reduce((sum, s) => sum + s.price, 0)} ₸</div>
                                </div>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8"
                                    disabled={selectedSeats.length === 0}
                                    onClick={() => setIsCheckoutOpen(true)}
                                >
                                    Сатып алу
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="max-w-4xl mx-auto text-center space-y-12 animate-in zoom-in duration-500">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-green-500">Сәтті төлем!</h1>
                            <p className="text-zinc-400">Билеттер сіздің email-ге жіберілді</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                            {selectedSeats.map((seat, idx) => (
                                <TicketView key={idx} ticket={seat} />
                            ))}
                        </div>

                        <Button
                            onClick={() => {
                                setSelectedSeats([]);
                                setStep('map');
                            }}
                            variant="outline"
                            className="border-zinc-700 text-white hover:bg-zinc-900"
                        >
                            Басқа билет сатып алу
                        </Button>
                    </div>
                )}
            </main>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirm={handleCheckoutSuccess}
                total={selectedSeats.reduce((sum, s) => sum + s.price, 0)}
            />
        </div>
    );
};

export default TicketingPrototype;
