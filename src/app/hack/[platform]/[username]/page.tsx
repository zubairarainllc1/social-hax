
"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, CreditCard, Info, AlertTriangle, FileText, DollarSign, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

const PROFILE_PIC_STORAGE_KEY = 'prank_profile_pic';

type PriceDialogInfo = {
    type: 'instant' | 'partial';
    currentValue: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { username } = params;
  
  const [followers, setFollowers] = useState<string | null>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [posts, setPosts] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('https://placehold.co/128x128.png');

  const [instantAmount, setInstantAmount] = useState('200.00');
  const [partialAmount, setPartialAmount] = useState('50.00');
  
  const [priceDialogInfo, setPriceDialogInfo] = useState<PriceDialogInfo | null>(null);
  const [newPrice, setNewPrice] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const formatNumber = (numStr: string | null) => {
        if (!numStr) return null;
        const num = parseInt(numStr, 10);
        return isNaN(num) ? null : num.toLocaleString();
    };

    const followersParam = searchParams.get('followers');
    const followingParam = searchParams.get('following');
    const postsParam = searchParams.get('posts');
    
    // This code runs only on the client, so sessionStorage is available.
    const profileUrlFromStorage = sessionStorage.getItem(PROFILE_PIC_STORAGE_KEY);
    
    setFollowers(followersParam ? formatNumber(followersParam) : null);
    setFollowing(followingParam ? formatNumber(followingParam) : null);
    setPosts(postsParam ? formatNumber(postsParam) : null);

    if (profileUrlFromStorage) {
        setAvatarUrl(profileUrlFromStorage);
        // Clean up storage after use
        try {
            sessionStorage.removeItem(PROFILE_PIC_STORAGE_KEY);
        } catch (error) {
            console.error("Could not remove from session storage", error);
        }
    } else {
        setAvatarUrl(`https://i.pravatar.cc/128?u=${username}`);
    }

  }, [username, searchParams]);


  const openPriceDialog = (type: 'instant' | 'partial') => {
    setPriceDialogInfo({ type, currentValue: type === 'instant' ? instantAmount : partialAmount });
    setNewPrice("");
  };

  const handlePriceUpdate = () => {
    if (priceDialogInfo) {
        const amount = parseFloat(newPrice);
        if (!isNaN(amount)) {
            const formattedPrice = amount.toFixed(2);
            if (priceDialogInfo.type === 'instant') {
                setInstantAmount(formattedPrice);
            } else {
                setPartialAmount(formattedPrice);
            }
        }
    }
    setPriceDialogInfo(null);
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-3xl bg-card/70 border-border shadow-lg shadow-primary/10">
        <CardHeader className="text-center">
          {avatarUrl && (
            <div className="mx-auto mb-4 relative group">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    className="hidden" 
                    accept="image/*"
                />
                <Image
                    src={avatarUrl}
                    alt="Profile Picture"
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-primary shadow-lg shadow-primary/30"
                    data-ai-hint="profile avatar"
                    onError={() => setAvatarUrl('https://placehold.co/128x128.png')}
                />
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Change profile picture"
                >
                    <Edit className="h-8 w-8" />
                </button>
            </div>
          )}
          <CardTitle className="font-headline text-4xl text-primary">@{username}</CardTitle>
          <CardDescription>Account located. Ready to proceed.</CardDescription>
          <div className="flex justify-center gap-8 pt-4 text-foreground">
            {followers && (
                <div className="text-center">
                    <p className="text-2xl font-bold">{followers}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3"/> Followers</p>
                </div>
            )}
            {following && (
                <div className="text-center">
                    <p className="text-2xl font-bold">{following}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><UserPlus className="h-3 w-3"/> Following</p>
                </div>
            )}
            {posts && (
                <div className="text-center">
                    <p className="text-2xl font-bold">{posts}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3"/> Posts</p>
                </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          
          <Card className="bg-background/50 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="text-primary"/> Instant Order</CardTitle>
              <CardDescription>Full access, instant delivery.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold text-primary">${instantAmount}</div>
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
                <Button onClick={() => openPriceDialog('instant')} className="w-full text-lg py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                    Order Full Access
                </Button>
            </CardFooter>
          </Card>

          <Card className="bg-background/50 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-accent"/> Partial Order</CardTitle>
              <CardDescription>Pay in installments for partial data.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="text-4xl font-bold text-accent">${partialAmount}</div>
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
                <Button onClick={() => openPriceDialog('partial')} variant="destructive" className="w-full text-lg py-6 font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                    Pay First Installment
                </Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
      
      {/* Price editing dialog */}
      <Dialog open={!!priceDialogInfo} onOpenChange={(isOpen) => !isOpen && setPriceDialogInfo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Price</DialogTitle>
            <DialogDescription>
              Enter the new price for the {priceDialogInfo?.type} order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-price" className="sr-only">New Price</Label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id="new-price"
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder={priceDialogInfo?.currentValue}
                    className="pl-8"
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPriceDialogInfo(null)}>Cancel</Button>
            <Button onClick={handlePriceUpdate}>Update Price</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
