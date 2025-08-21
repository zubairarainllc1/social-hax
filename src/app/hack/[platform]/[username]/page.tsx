"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, CreditCard, Info, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { username } = params;
  
  const [followers, setFollowers] = useState<string | null>(null);
  const [friends, setFriends] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('https://placehold.co/128x128.png');

  const [instantAmount, setInstantAmount] = useState('200.00');
  const [partialAmount, setPartialAmount] = useState('50.00');

  useEffect(() => {
    // Generate random numbers on client to avoid hydration mismatch
    const randomFollowers = (Math.random() * 50000 + 1000).toFixed(0);
    const randomFriends = (Math.random() * 500 + 50).toFixed(0);
    setFollowers(Number(randomFollowers).toLocaleString());
    setFriends(Number(randomFriends).toLocaleString());
    setAvatarUrl(`https://i.pravatar.cc/128?u=${username}`);
  }, [username]);

  const handleOrder = () => {
    router.push('/orders');
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-2xl bg-card/70 border-border shadow-lg shadow-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image
              src={avatarUrl}
              alt="Profile Picture"
              width={128}
              height={128}
              className="rounded-full border-4 border-primary shadow-lg shadow-primary/30"
              data-ai-hint="profile avatar"
            />
          </div>
          <CardTitle className="font-headline text-4xl text-primary">@{username}</CardTitle>
          <CardDescription>Account located. Ready to proceed.</CardDescription>
          <div className="flex justify-center gap-8 pt-4 text-foreground">
            <div className="text-center">
              <p className="text-2xl font-bold">{followers || '...'}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{friends || '...'}</p>
              <p className="text-sm text-muted-foreground">Friends</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          
          {/* Instant Order Card */}
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="text-primary"/> Instant Order</CardTitle>
              <CardDescription>Full access, instant delivery.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input value={instantAmount} onChange={e => setInstantAmount(e.target.value)} className="pl-7 font-bold text-lg text-primary bg-input" />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="text-xs justify-start p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-primary"><Info className="h-3 w-3 mr-1"/>More Details</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Instant Order Details</DialogTitle>
                        <DialogDescription>
                            You must pay the full amount to get instant access to all account data. This is non-refundable.
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Button onClick={handleOrder} className="w-full text-lg py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                    Order Full Access
                </Button>
            </CardFooter>
          </Card>

          {/* Partial Order Card */}
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-accent"/> Partial Order</CardTitle>
              <CardDescription>Pay in installments for partial data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input value={partialAmount} onChange={e => setPartialAmount(e.target.value)} className="pl-7 font-bold text-lg text-accent bg-input" />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="text-xs justify-start p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-accent"><Info className="h-3 w-3 mr-1"/>More Details</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Partial Order Details</DialogTitle>
                        <DialogDescription>
                            Payment can be made in installments. You will receive data chunks as you pay. First payment is required to start.
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Button onClick={handleOrder} variant="destructive" className="w-full text-lg py-6 font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                    Pay First Installment
                </Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
