import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const platforms = [
  { name: 'Instagram', slug: 'instagram', logo: 'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png' },
  { name: 'Facebook', slug: 'facebook', logo: 'https://acbrd.org.au/wp-content/uploads/2020/08/facebook-circular-logo.png' },
  { name: 'WhatsApp', slug: 'whatsapp', logo: 'https://static.vecteezy.com/system/resources/previews/042/127/116/non_2x/whatsapp-square-logo-on-a-transparent-background-free-png.png' },
  { name: 'TikTok', slug: 'tiktok', logo: 'https://static.vecteezy.com/system/resources/previews/016/716/450/non_2x/tiktok-icon-free-png.png' },
  { name: 'YouTube', slug: 'youtube', logo: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png' },
  { name: 'Twitter', slug: 'twitter', logo: 'https://static.vecteezy.com/system/resources/previews/018/930/587/non_2x/twitter-logo-twitter-icon-transparent-free-free-png.png' },
];

export default function PlatformSelection() {
  return (
    <div className="mt-12 w-full">
      <h2 className="text-3xl font-headline font-semibold text-center mb-8">Choose a Platform</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <Link key={platform.slug} href={`/hack/${platform.slug}`} passHref>
            <Card className="bg-card/50 hover:bg-card/90 border-border hover:border-primary transition-all duration-300 group hover:shadow-lg hover:shadow-primary/20 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium font-headline">
                  {platform.name}
                </CardTitle>
                <div className="relative h-10 w-10">
                   <Image src={platform.logo} alt={`${platform.name} logo`} layout="fill" objectFit="contain" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Click to start hacking process</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
