import { QRCodeSVG } from "qrcode.react";
import kaisarLogo from "@/assets/kaisar-logo.jpg";

interface TicketViewProps {
    ticket: {
        sectorId: string;
        row: number;
        number: number;
        price: number;
    };
}

export const TicketView = ({ ticket }: TicketViewProps) => {
    return (
        <div className="bg-white text-black rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto relative">
            {/* Header */}
            <div className="bg-red-600 p-6 text-white flex items-center justify-between">
                <div className="font-bold text-lg">FC KAISAR</div>
                <div className="w-10 h-10 bg-white rounded-full p-1">
                    <img src={kaisarLogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
            </div>

            {/* Match Info */}
            <div className="p-6 border-b-2 border-dashed border-zinc-200 relative">
                <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-zinc-900 rounded-full"></div>
                <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-zinc-900 rounded-full"></div>

                <div className="text-center mb-6">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Матч</div>
                    <div className="text-2xl font-black">KAISAR vs KAIRAT</div>
                    <div className="text-sm font-medium text-red-600 mt-1">24 Тур • Премьер-Лига</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase">Күні</div>
                        <div className="font-bold text-lg">19 Қараша</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase">Уақыты</div>
                        <div className="font-bold text-lg">19:00</div>
                    </div>
                </div>
            </div>

            {/* Seat Info */}
            <div className="p-6 bg-zinc-50">
                <div className="grid grid-cols-3 gap-2 text-center mb-8">
                    <div className="bg-white p-2 rounded-lg border border-zinc-200 shadow-sm">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">Сектор</div>
                        <div className="font-black text-xl text-red-600">{ticket.sectorId}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-zinc-200 shadow-sm">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">Қатар</div>
                        <div className="font-black text-xl">{ticket.row}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-zinc-200 shadow-sm">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">Орын</div>
                        <div className="font-black text-xl">{ticket.number}</div>
                    </div>
                </div>

                <div className="flex justify-center mb-4">
                    <QRCodeSVG
                        value={`KAISAR-TICKET-${ticket.sectorId}-${ticket.row}-${ticket.number}`}
                        size={160}
                        level="H"
                    />
                </div>

                <div className="text-center text-[10px] text-zinc-400">
                    Билет ID: 8493-2938-4920
                </div>
            </div>
        </div>
    );
};
