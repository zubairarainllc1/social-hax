"use client";

import Link from "next/link";
import TypingEffect from "@/components/typing-effect";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-5xl items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          PrankMaster
        </Link>
        <div className="hidden md:flex flex-1 justify-center">
          <TypingEffect />
        </div>
        <div className="text-right font-mono text-sm sm:text-base text-green-400">
          Funds: $12,450.00
        </div>
      </div>
    </header>
  );
}
