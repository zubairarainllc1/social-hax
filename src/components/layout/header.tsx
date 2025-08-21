"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import TypingEffect from "@/components/typing-effect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

const DEFAULT_FUNDS = 12450.00;
const FUNDS_STORAGE_KEY = 'socialhax-funds';

export default function Header() {
  const [funds, setFunds] = useState<number | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const storedFunds = window.localStorage.getItem(FUNDS_STORAGE_KEY);
      if (storedFunds) {
        setFunds(JSON.parse(storedFunds));
      } else {
        setFunds(DEFAULT_FUNDS);
      }
    } catch (error) {
      console.error("Failed to read funds from localStorage", error);
      setFunds(DEFAULT_FUNDS);
    }
  }, []);

  useEffect(() => {
    if (funds !== null) {
        try {
            window.localStorage.setItem(FUNDS_STORAGE_KEY, JSON.stringify(funds));
        } catch (error) {
            console.error("Failed to save funds to localStorage", error);
        }
    }
  }, [funds]);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!isNaN(amount) && amount >= 0) {
      setFunds(amount);
    }
    setTopUpAmount("");
    setIsDialogOpen(false);
  };

  const formattedFunds = funds === null
    ? "..."
    : funds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
            <div className="text-right font-mono text-sm sm:text-base text-green-500">
                Funds: ${formattedFunds}
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Top Up</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Top Up Funds</DialogTitle>
                    <DialogDescription>
                        Enter the amount you want to set your funds to.
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
