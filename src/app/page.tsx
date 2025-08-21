import PlatformSelection from "@/components/platform-selection";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
        SocialHax
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Our advanced platform provides seamless access to a variety of social networks. Select a target platform to initiate your operation. Anonymity is guaranteed.
      </p>
      <PlatformSelection />
    </div>
  );
}
