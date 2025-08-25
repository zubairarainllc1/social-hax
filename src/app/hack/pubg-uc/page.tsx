
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Bitcoin, Edit, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

type Pack = {
    uc: number;
    pkr: number;
};

type PriceDialogInfo = {
    packIndex: number;
    type: 'uc' | 'pkr';
    currentValue: number;
}

const initialPacks: Pack[] = [
    { uc: 8000, pkr: 1900 },
    { uc: 16500, pkr: 3500 },
    { uc: 45000, pkr: 6900 },
    { uc: 75000, pkr: 9900 },
];

const EditDialog = ({ 
    info,
    onClose,
    onUpdate
}: { 
    info: PriceDialogInfo | null;
    onClose: () => void;
    onUpdate: (packIndex: number, type: 'uc' | 'pkr', newValue: number) => void;
}) => {
    const [newValue, setNewValue] = useState('');
    const isOpen = !!info;
    
    useState(() => {
        if (isOpen && info) {
            setNewValue('');
        }
    });

    const handleUpdate = () => {
        if (info) {
            const amount = parseFloat(newValue);
            if (!isNaN(amount)) {
                onUpdate(info.packIndex, info.type, amount);
            }
        }
        onClose();
    };

    const currency = info?.type === 'pkr' ? 'PKR' : 'UC';

    return (
        <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Price</DialogTitle>
                <DialogDescription>
                  Enter the new value for the {currency}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="new-value" className="sr-only">New Value</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currency}</span>
                    <Input
                        id="new-value"
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder={String(info?.currentValue)}
                        className="pl-12"
                    />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Update</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function PubgUcPage() {
    const [uid, setUid] = useState('');
    const [isFound, setIsFound] = useState(false);
    const [packs, setPacks] = useState<Pack[]>(initialPacks);
    const [priceDialogInfo, setPriceDialogInfo] = useState<PriceDialogInfo | null>(null);

    const handleFind = () => {
        if (uid.trim()) {
            setIsFound(true);
        }
    };
    
    const openPriceDialog = (packIndex: number, type: 'uc' | 'pkr') => {
        const pack = packs[packIndex];
        const currentValue = type === 'uc' ? pack.uc : pack.pkr;
        setPriceDialogInfo({ packIndex, type, currentValue });
    };

    const handlePriceUpdate = (packIndex: number, type: 'uc' | 'pkr', newValue: number) => {
        setPacks(prevPacks => {
            const newPacks = [...prevPacks];
            newPacks[packIndex] = { ...newPacks[packIndex], [type]: newValue };
            return newPacks;
        });
    };
    
    const ethIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 2.5 5.5 12l6.5 9.5 6.5-9.5L12 2.5z"/>
        <path d="m5.5 12 6.5 3.5 6.5-3.5"/>
        <path d="M12 22V15.5"/>
      </svg>
    )

    return (
        <div className="flex flex-col items-center justify-start pt-10 gap-8">
            <div className="text-center">
                <div className="relative h-24 w-24 mx-auto mb-4">
                    <Image src="/uc.png" alt="PUBG UC Logo" layout="fill" objectFit="contain" />
                </div>
                <h1 className="font-headline text-5xl font-bold text-primary">Carding UC</h1>
            </div>

            <Separator className="w-full max-w-4xl opacity-30" />
            
            <Card className="w-full max-w-2xl bg-card/70 border-border shadow-lg">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <Label htmlFor="uid" className="font-semibold text-lg whitespace-nowrap">Enter UID:</Label>
                        <div className="relative flex-grow">
                             <Input 
                                id="uid" 
                                placeholder="Enter your PUBG character ID" 
                                value={uid}
                                onChange={(e) => {
                                    setUid(e.target.value);
                                    setIsFound(false);
                                }}
                                className="pr-24"
                            />
                            {isFound && <CheckCircle className="absolute right-24 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
                        </div>
                        <Button onClick={handleFind} disabled={!uid.trim() || isFound}>
                           {isFound ? 'Found' : 'Find'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Separator className="w-full max-w-4xl opacity-30" />

            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {packs.map((pack, index) => (
                    <Card key={index} className="bg-card/70 border-border shadow-md flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-center text-3xl font-bold text-primary">{pack.uc.toLocaleString()} UC</CardTitle>
                            <CardDescription className="text-center text-lg">in {pack.pkr.toLocaleString()} PKR</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex-col items-stretch space-y-2 mt-auto">
                           <Button onClick={() => openPriceDialog(index, 'uc')} variant="outline" size="sm">
                                Pay with BTC <Bitcoin className="ml-2"/>
                            </Button>
                            <Button onClick={() => openPriceDialog(index, 'pkr')} variant="outline" size="sm">
                                Pay with ETH {ethIcon()}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <EditDialog 
                info={priceDialogInfo}
                onClose={() => setPriceDialogInfo(null)}
                onUpdate={handlePriceUpdate}
            />
        </div>
    );
}
