import PlatformSelection from "@/components/platform-selection";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
        SocialHax
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Select a social media platform to begin the "hacking" process. This is a prank website for entertainment purposes only. No actual hacking occurs.
      </p>
      <PlatformSelection />
    </div>
  );
}
