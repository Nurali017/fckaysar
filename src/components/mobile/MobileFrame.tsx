import { ReactNode } from "react";

interface MobileFrameProps {
    children: ReactNode;
}

export const MobileFrame = ({ children }: MobileFrameProps) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-4 md:p-8">
            <div className="relative w-full max-w-[375px] h-[812px] bg-black rounded-[40px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-[20px] z-50 flex items-center justify-center">
                    <div className="w-16 h-4 bg-zinc-900/50 rounded-full"></div>
                </div>

                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between text-white text-xs font-medium z-40">
                    <span>19:38</span>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-sm border border-white/30 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-[1px]"></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="h-full w-full overflow-y-auto scrollbar-hide pt-12 pb-20 bg-zinc-950 text-white">
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50"></div>
            </div>
        </div>
    );
};
