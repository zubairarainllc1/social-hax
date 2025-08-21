
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Image as ImageIcon, Users, UserPlus, FileText, Video, Heart, MessageSquare } from "lucide-react";
import Image from 'next/image';

const PROFILE_PIC_STORAGE_KEY = 'prank_profile_pic';

type PlatformConfig = {
    name: string;
    slug: string;
    logo: string;
    mainInput: {
        label: string;
        placeholder: string;
        type: string;
    };
    stats: {
        followers: { label: string; icon: React.ElementType; placeholder: string };
        following: { label: string; icon: React.ElementType; placeholder: string };
        posts: { label: string; icon: React.ElementType; placeholder: string };
    };
};

const platforms: PlatformConfig[] = [
    { 
        name: 'Instagram', 
        slug: 'instagram', 
        logo: 'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png', 
        mainInput: { label: 'Username (Required)', placeholder: '@username or account link', type: 'text' },
        stats: {
            followers: { label: 'Followers', icon: Users, placeholder: 'e.g., 50k' },
            following: { label: 'Following', icon: UserPlus, placeholder: 'e.g., 500' },
            posts: { label: 'Posts', icon: FileText, placeholder: 'e.g., 182' },
        } 
    },
    { 
        name: 'Facebook', 
        slug: 'facebook', 
        logo: 'https://acbrd.org.au/wp-content/uploads/2020/08/facebook-circular-logo.png',
        mainInput: { label: 'Username or Profile URL (Required)', placeholder: 'e.g., jane.doe or profile link', type: 'text' },
        stats: {
            followers: { label: 'Friends', icon: Users, placeholder: 'e.g., 1,234' },
            following: { label: 'Likes', icon: Heart, placeholder: 'e.g., 450' },
            posts: { label: 'Posts', icon: FileText, placeholder: 'e.g., 98' },
        } 
    },
    { 
        name: 'WhatsApp', 
        slug: 'whatsapp', 
        logo: '/whatsapp.png',
        mainInput: { label: 'Phone Number (Required)', placeholder: '+1 123 456 7890', type: 'tel' },
        stats: {
            followers: { label: 'Contacts', icon: Users, placeholder: 'e.g., 256' },
            following: { label: 'Groups', icon: UserPlus, placeholder: 'e.g., 12' },
            posts: { label: 'Statuses', icon: MessageSquare, placeholder: 'e.g., 3' },
        } 
    },
    { 
        name: 'TikTok', 
        slug: 'tiktok', 
        logo: '/tiktok.png',
        mainInput: { label: 'Username (Required)', placeholder: '@tiktok_star', type: 'text' },
        stats: {
            followers: { label: 'Followers', icon: Users, placeholder: 'e.g., 1.2M' },
            following: { label: 'Following', icon: UserPlus, placeholder: 'e.g., 345' },
            posts: { label: 'Videos', icon: Video, placeholder: 'e.g., 78' },
        }
     },
    { 
        name: 'YouTube', 
        slug: 'youtube', 
        logo: '/youtube.png',
        mainInput: { label: 'Channel Name or URL (Required)', placeholder: 'e.g., @channel or channel link', type: 'text' },
        stats: {
            followers: { label: 'Subscribers', icon: Users, placeholder: 'e.g., 10M' },
            following: { label: 'Following', icon: UserPlus, placeholder: 'e.g., 1' },
            posts: { label: 'Videos', icon: Video, placeholder: 'e.g., 542' },
        }
     },
    { 
        name: 'X', 
        slug: 'x', 
        logo: '/x.png',
        mainInput: { label: 'Username (Required)', placeholder: '@username', type: 'text'},
        stats: {
            followers: { label: 'Followers', icon: Users, placeholder: 'e.g., 100k' },
            following: { label: 'Following', icon: UserPlus, placeholder: 'e.g., 320' },
            posts: { label: 'Tweets', icon: MessageSquare, placeholder: 'e.g., 1,234' },
        }
     },
];

const defaultPlatform: PlatformConfig = {
    name: 'Social Media',
    slug: 'default',
    logo: 'https://placehold.co/40x40.png',
    mainInput: { label: 'Username (Required)', placeholder: '@username or account link', type: 'text' },
    stats: {
        followers: { label: 'Followers', icon: Users, placeholder: 'e.g., 50k' },
        following: { label: 'Following', icon: UserPlus, placeholder: 'e.g., 500' },
        posts: { label: 'Posts', icon: FileText, placeholder: 'e.g., 182' },
    },
};

export default function HackPage() {
  const router = useRouter();
  const params = useParams<{ platform: string }>();
  const { platform } = params;

  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [posts, setPosts] = useState('');

  const currentPlatform = platforms.find(p => p.slug === platform) || defaultPlatform;
  const platformName = currentPlatform.name;
  
  const StatInput = ({ id, value, onChange, label, icon: Icon, placeholder }: { id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, icon: React.ElementType, placeholder: string }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" /> {label}
      </Label>
      <Input
        id={id}
        type="text" // Use text to allow for flexible inputs like "1.2M"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-input"
      />
    </div>
  );

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      try {
        if (profileUrl) {
            sessionStorage.setItem(PROFILE_PIC_STORAGE_KEY, profileUrl);
        } else {
            sessionStorage.removeItem(PROFILE_PIC_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Could not save profile picture to session storage", error);
      }

      const query = new URLSearchParams({
        ...(followers.trim() && { followers: followers.trim() }),
        ...(following.trim() && { following: following.trim() }),
        ...(posts.trim() && { posts: posts.trim() }),
      }).toString();
      
      const targetIdentifier = username.trim().replace(/^@/, '');
      router.push(`/hack/${platform}/${targetIdentifier}?${query}`);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-lg bg-card/70 border-border shadow-lg shadow-primary/10">
        <form onSubmit={handleSubmit}>
          <CardHeader className="items-center text-center">
            <div className="flex items-center gap-4">
                <div className="relative h-12 w-12">
                    <Image src={currentPlatform.logo} alt={`${platformName} logo`} layout="fill" objectFit="contain" />
                </div>
                <CardTitle className="font-headline text-3xl text-primary">Hack {platformName} Account</CardTitle>
            </div>
            <CardDescription>Enter the target's details to proceed. Fields are optional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{currentPlatform.mainInput.label}</Label>
               <Input
                id="username"
                placeholder={currentPlatform.mainInput.placeholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-lg py-6 bg-background/50 border-2 border-border focus:border-primary focus:ring-primary"
                type={currentPlatform.mainInput.type}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="profileUrl" className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-muted-foreground"/> Profile Picture</Label>
                    <Input id="profileUrl" type="file" accept="image/*" onChange={handleProfilePictureChange} className="bg-input"/>
                    {profileUrl && (
                        <div className="mt-2 flex justify-center">
                            <Image src={profileUrl} alt="Profile preview" width={80} height={80} className="rounded-full" data-ai-hint="profile avatar" />
                        </div>
                    )}
                </div>
                 <StatInput id="followers" value={followers} onChange={e => setFollowers(e.target.value)} label={currentPlatform.stats.followers.label} icon={currentPlatform.stats.followers.icon} placeholder={currentPlatform.stats.followers.placeholder} />
                 <StatInput id="following" value={following} onChange={e => setFollowing(e.target.value)} label={currentPlatform.stats.following.label} icon={currentPlatform.stats.following.icon} placeholder={currentPlatform.stats.following.placeholder} />
                 <StatInput id="posts" value={posts} onChange={e => setPosts(e.target.value)} label={currentPlatform.stats.posts.label} icon={currentPlatform.stats.posts.icon} placeholder={currentPlatform.stats.posts.placeholder} />
            </div>

          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full text-lg py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50"
              disabled={!username.trim()}
            >
              Find Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
