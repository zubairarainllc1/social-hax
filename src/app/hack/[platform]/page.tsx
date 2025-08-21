"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Image as ImageIcon, Users, UserPlus, FileText } from "lucide-react";
import Image from 'next/image';

export default function HackPage() {
  const router = useRouter();
  const params = useParams();
  const { platform } = params;

  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [posts, setPosts] = useState('');

  const platformName = typeof platform === 'string' ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social Media';

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
      const query = new URLSearchParams({
        ...(profileUrl.trim() && { profileUrl: profileUrl.trim() }),
        ...(followers.trim() && { followers: followers.trim() }),
        ...(following.trim() && { following: following.trim() }),
        ...(posts.trim() && { posts: posts.trim() }),
      }).toString();
      
      router.push(`/hack/${platform}/${username.trim()}?${query}`);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-lg bg-card/70 border-border shadow-lg shadow-primary/10">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">Hack {platformName} Account</CardTitle>
            <CardDescription>Enter the target's details to proceed. Fields are optional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username (Required)</Label>
               <Input
                id="username"
                placeholder="@username or account link"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-lg py-6 bg-background/50 border-2 border-border focus:border-primary focus:ring-primary"
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
                <div className="space-y-2">
                    <Label htmlFor="posts" className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground"/> Posts</Label>
                    <Input id="posts" type="number" placeholder="e.g., 182" value={posts} onChange={e => setPosts(e.target.value)} className="bg-input"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="followers" className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground"/> Followers</Label>
                    <Input id="followers" type="number" placeholder="e.g., 50000" value={followers} onChange={e => setFollowers(e.g.target.value)} className="bg-input"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="following" className="flex items-center gap-2"><UserPlus className="h-4 w-4 text-muted-foreground"/> Following</Label>
                    <Input id="following" type="number" placeholder="e.g., 500" value={following} onChange={e => setFollowing(e.target.value)} className="bg-input"/>
                </div>
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
