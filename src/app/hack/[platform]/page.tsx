"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HackPage() {
  const router = useRouter();
  const params = useParams();
  const { platform } = params;
  const [username, setUsername] = useState('');

  const platformName = typeof platform === 'string' ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social Media';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/hack/${platform}/${username.trim()}`);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-lg bg-card/70 border-border shadow-lg shadow-primary/10">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">Hack {platformName} Account</CardTitle>
            <CardDescription>Enter the target's username or account link to proceed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="@username or account link"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-lg py-6 bg-background/50 border-2 border-border focus:border-primary focus:ring-primary"
              required
            />
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
