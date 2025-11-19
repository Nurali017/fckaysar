import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    total: number;
}

export const CheckoutModal = ({ isOpen, onClose, onConfirm, total }: CheckoutModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onConfirm();
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Төлем жасау</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400">Аты-жөні</Label>
                            <Input id="name" placeholder="Думан Нәрзілдаев" className="bg-zinc-950 border-zinc-800 focus:border-red-600" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-400">Email</Label>
                            <Input id="email" type="email" placeholder="duman@kaisar.kz" className="bg-zinc-950 border-zinc-800 focus:border-red-600" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card" className="text-zinc-400">Карта нөмірі</Label>
                            <Input id="card" placeholder="0000 0000 0000 0000" className="bg-zinc-950 border-zinc-800 focus:border-red-600" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry" className="text-zinc-400">Мерзімі</Label>
                                <Input id="expiry" placeholder="MM/YY" className="bg-zinc-950 border-zinc-800 focus:border-red-600" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv" className="text-zinc-400">CVV</Label>
                                <Input id="cvv" placeholder="123" className="bg-zinc-950 border-zinc-800 focus:border-red-600" required />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                        <span className="text-zinc-400">Төлем сомасы:</span>
                        <span className="text-xl font-bold text-white">{total} ₸</span>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6"
                        disabled={isLoading}
                    >
                        {isLoading ? "Төлем өңделуде..." : "Төлеу"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
