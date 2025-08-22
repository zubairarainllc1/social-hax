
"use client";

import { useState, useEffect, useReducer, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, CreditCard, Info, AlertTriangle, FileText, DollarSign, Edit, ShieldCheck, Server, KeyRound, Video, Heart, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

const PROFILE_PIC_STORAGE_KEY = 'prank_profile_pic';
const PKR_TO_USD_RATE = 278.5; // Example exchange rate

type PriceDialogInfo = {
    type: 'instant' | 'partial';
    currentValue: string;
}

type PlatformConfig = {
    name: string;
    slug: string;
    logo: string;
    features: {
        profilePicture: boolean;
        stats: boolean;
    };
    stats?: {
        followers: { label: string; icon: React.ElementType };
        following: { label: string; icon: React.ElementType };
        posts: { label: string; icon: React.ElementType };
    };
};

const platforms: PlatformConfig[] = [
    { 
        name: 'Instagram', 
        slug: 'instagram', 
        logo: 'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png', 
        features: { profilePicture: true, stats: true },
        stats: {
            followers: { label: 'Followers', icon: Users },
            following: { label: 'Following', icon: UserPlus },
            posts: { label: 'Posts', icon: FileText },
        } 
    },
    { 
        name: 'Facebook', 
        slug: 'facebook', 
        logo: 'https://acbrd.org.au/wp-content/uploads/2020/08/facebook-circular-logo.png',
        features: { profilePicture: true, stats: true },
        stats: {
            followers: { label: 'Friends', icon: Users },
            following: { label: 'Likes', icon: Heart },
            posts: { label: 'Posts', icon: FileText },
        } 
    },
    { 
        name: 'WhatsApp', 
        slug: 'whatsapp', 
        logo: '/whatsapp.png',
        features: { profilePicture: true, stats: true },
        stats: {
            followers: { label: 'Contacts', icon: Users },
            following: { label: 'Groups', icon: UserPlus },
            posts: { label: 'Statuses', icon: MessageSquare },
        } 
    },
    { 
        name: 'TikTok', 
        slug: 'tiktok', 
        logo: '/tiktok.png',
        features: { profilePicture: true, stats: true },
        stats: {
            followers: { label: 'Followers', icon: Users },
            following: { label: 'Following', icon: UserPlus },
            posts: { label: 'Videos', icon: Video },
        }
     },
    { 
        name: 'YouTube', 
        slug: 'youtube', 
        logo: '/youtube.png',
        features: { profilePicture: true, stats: true },
        stats: {
            followers: { label: 'Subscribers', icon: Users },
            following: { label: 'Following', icon: UserPlus },
            posts: { label: 'Videos', icon: Video },
        }
     },
    { 
        name: 'X', 
        slug: 'x', 
        logo: '/x.png',
        features: { profilePicture: true, stats: true },
        stats: {
            followers: { label: 'Followers', icon: Users },
            following: { label: 'Following', icon: UserPlus },
            posts: { label: 'Tweets', icon: MessageSquare },
        }
     },
     { 
        name: 'Snapchat', 
        slug: 'snapchat', 
        logo: '/snapchat.png',
        features: { profilePicture: false, stats: false },
     },
];


const defaultPlatform: PlatformConfig = {
    name: 'Social Media',
    slug: 'default',
    logo: 'https://placehold.co/40x40.png',
    features: { profilePicture: true, stats: true },
    stats: {
        followers: { label: 'Followers', icon: Users },
        following: { label: 'Following', icon: UserPlus },
        posts: { label: 'Posts', icon: FileText },
    },
};

const priceDialogReducer = (state: any, action: { type: string, payload: any }) => {
    switch (action.type) {
        case 'SET_NEW_PRICE':
            return { ...state, newPrice: action.payload };
        case 'RESET':
            return { ...state, newPrice: '' };
        default:
            return state;
    }
};

const PriceEditDialog = ({ 
    info,
    onClose,
    onUpdate
}: { 
    info: PriceDialogInfo | null;
    onClose: () => void;
    onUpdate: (type: 'instant' | 'partial', newPrice: string) => void;
}) => {
    const [state, dispatch] = useReducer(priceDialogReducer, { newPrice: '' });
    const { newPrice } = state;
    const isOpen = !!info;
    
    useEffect(() => {
        if (!isOpen) {
            dispatch({ type: 'RESET', payload: null });
        }
    }, [isOpen]);

    const handleUpdate = () => {
        if (info) {
            const amount = parseFloat(newPrice);
            if (!isNaN(amount)) {
                const formattedPrice = amount.toFixed(2);
                onUpdate(info.type, formattedPrice);
            }
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Price</DialogTitle>
                <DialogDescription>
                  Enter the new price in PKR for the {info?.type} order.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="new-price" className="sr-only">New Price</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">PKR</span>
                    <Input
                        id="new-price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => dispatch({ type: 'SET_NEW_PRICE', payload: e.target.value })}
                        placeholder={info?.currentValue}
                        className="pl-10"
                    />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Update Price</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const platformSlug = params.platform as string;
  const searchParams = useSearchParams();
  
  const [followers, setFollowers] = useState<string | null>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [posts, setPosts] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('https://placehold.co/128x128.png');

  const [instantAmount, setInstantAmount] = useState('50000.00');
  const [partialAmount, setPartialAmount] = useState('15000.00');
  
  const [priceDialogInfo, setPriceDialogInfo] = useState<PriceDialogInfo | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentPlatform = platforms.find(p => p.slug === platformSlug) || defaultPlatform;
  const platformName = currentPlatform.name;


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

    if (currentPlatform.features.profilePicture && profileUrlFromStorage) {
        setAvatarUrl(profileUrlFromStorage);
        // Clean up storage after use
        try {
            sessionStorage.removeItem(PROFILE_PIC_STORAGE_KEY);
        } catch (error) {
            console.error("Could not remove from session storage", error);
        }
    } else if (currentPlatform.features.profilePicture) {
        setAvatarUrl(`https://i.pravatar.cc/128?u=${username}`);
    } else {
        setAvatarUrl('');
    }

  }, [username, searchParams, currentPlatform.features.profilePicture]);


  const openPriceDialog = (type: 'instant' | 'partial') => {
    setPriceDialogInfo({ type, currentValue: type === 'instant' ? instantAmount : partialAmount });
  };
  
  const handlePriceUpdate = (type: 'instant' | 'partial', newPrice: string) => {
      if (type === 'instant') {
          setInstantAmount(newPrice);
      } else {
          setPartialAmount(newPrice);
      }
  };

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
  
  const convertPkrToUsd = (pkr: string) => {
    const pkrAmount = parseFloat(pkr);
    if (isNaN(pkrAmount)) {
      return '0.00';
    }
    return (pkrAmount / PKR_TO_USD_RATE).toFixed(2);
  }
  
  const StatDisplay = ({ value, label, icon: Icon }: { value: string | null, label: string, icon: React.ElementType }) => {
    if (!value) return null;
    return (
      <div className="text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Icon className="h-3 w-3" /> {label}
        </p>
      </div>
    );
  };

  const displayName = platformSlug === 'whatsapp' ? username : `@${username}`;

  return (
    <div className="flex flex-col items-center justify-start pt-10 gap-6">
      <Card className="w-full max-w-3xl bg-card/70 border-border shadow-lg">
        <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
                <div className="relative h-12 w-12">
                    <Image src={currentPlatform.logo} alt={`${platformName} logo`} layout="fill" objectFit="contain" />
                </div>
                <CardTitle className="font-headline text-3xl text-primary">Hacking {platformName}</CardTitle>
            </div>
          {currentPlatform.features.profilePicture && avatarUrl && (
            <div className="mx-auto mb-4 relative group w-32 h-32">
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
                    className="rounded-full border border-black/10 shadow-lg w-full h-full object-cover"
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
          <CardTitle className="font-headline text-3xl text-black">{displayName}</CardTitle>
          <CardDescription>Account located. Ready to proceed.</CardDescription>
          {currentPlatform.features.stats && currentPlatform.stats && (
            <>
                <div className="flex justify-center gap-8 pt-4 text-foreground">
                    <StatDisplay value={followers} label={currentPlatform.stats.followers.label} icon={currentPlatform.stats.followers.icon} />
                    <StatDisplay value={following} label={currentPlatform.stats.following.label} icon={currentPlatform.stats.following.icon} />
                    <StatDisplay value={posts} label={currentPlatform.stats.posts.label} icon={currentPlatform.stats.posts.icon} />
                </div>
                <div className="flex justify-center gap-8 pt-6 text-foreground border-t border-border/50 mt-6">
                        <div className="text-center">
                            <p className="text-lg font-bold text-green-500">Online</p>
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><ShieldCheck className="h-3 w-3"/> Status</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold">Active</p>
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Server className="h-3 w-3"/> VPS</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold">Granted</p>
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><KeyRound className="h-3 w-3"/> Account Access</p>
                        </div>
                </div>
            </>
          )}
        </CardHeader>
      </Card>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-background/50 flex flex-col bg-card/70 border-border shadow-lg shadow-red-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-red-500"/> Partial Order</CardTitle>
              <CardDescription>Pay with Partial</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="text-4xl font-bold text-red-500">PKR {partialAmount}</div>
               <p className="text-sm text-muted-foreground">Approx. ${convertPkrToUsd(partialAmount)}</p>
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-2">
                <div className="flex items-center justify-between">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="text-xs justify-start p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-red-500"><Info className="h-3 w-3 mr-1"/>More Details</Button>
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
                </div>
                <div className="flex flex-col gap-2 pt-2">
                    <Button onClick={() => openPriceDialog('partial')} variant="destructive" className="w-full bg-red-500 text-white hover:bg-red-500/90">Pay with Account Funds</Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => openPriceDialog('partial')} variant="outline">Pay with Bitcoin</Button>
                        <Button onClick={() => openPriceDialog('partial')} variant="outline">Pay with Ethereum</Button>
                    </div>
                </div>
            </CardFooter>
          </Card>

          <Card className="bg-background/50 flex flex-col bg-card/70 border-border shadow-lg shadow-red-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="text-red-500"/> Instant Order</CardTitle>
              <CardDescription>Full access, instant delivery.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold text-red-500">PKR {instantAmount}</div>
              <p className="text-sm text-muted-foreground">Approx. ${convertPkrToUsd(instantAmount)}</p>
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-2">
                 <div className="flex items-center justify-between">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="text-xs justify-start p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-red-500"><Info className="h-3 w-3 mr-1"/>More Details</Button>
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
                </div>
                <div className="flex flex-col gap-2 pt-2">
                    <Button onClick={() => openPriceDialog('instant')} variant="destructive" className="w-full bg-red-500 text-white hover:bg-red-500/90">Pay with Account Funds</Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => openPriceDialog('instant')} variant="outline">Pay with Bitcoin</Button>
                        <Button onClick={() => openPriceDialog('instant')} variant="outline">Pay with Ethereum</Button>
                    </div>
                </div>
            </CardFooter>
          </Card>
        </div>
      
        <PriceEditDialog 
            info={priceDialogInfo}
            onClose={() => setPriceDialogInfo(null)}
            onUpdate={handlePriceUpdate}
        />
    </div>
  );
}
