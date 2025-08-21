"use client";

import Link from "next/link";
import { useState } from "react";
import TypingEffect from "@/components/typing-effect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

export default function Header() {
  const [funds, setFunds] = useState(12450.00);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!isNaN(amount) && amount > 0) {
      setFunds(amount);
    }
    setTopUpAmount("");
    setIsDialogOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-5xl items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          SocialHax
        </Link>
        <div className="hidden md:flex flex-1 justify-center">
          <TypingEffect />
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right font-mono text-sm sm:text-base text-green-400">
                Funds: ${funds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">Top Up</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Top Up Funds</DialogTitle>
                    <DialogDescription>
                        Enter the amount you want to add to your funds.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="number"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="pl-8"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleTopUp}>Update Funds</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>
    </header>
  );
}
