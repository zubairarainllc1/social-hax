
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, XCircle, Download, Eye, Server, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const platformLogos: { [key: string]: string } = {
  instagram: 'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png',
  facebook: 'https://acbrd.org.au/wp-content/uploads/2020/08/facebook-circular-logo.png',
  youtube: '/youtube.png',
  tiktok: '/tiktok.png',
  x: '/x.png',
  whatsapp: '/whatsapp.png',
};

const fakeOrders = [
  { id: 'ORD-84B2A1', date: '2023-10-26', status: 'Completed', progress: 100, account: '@john_doe_fb', platform: 'facebook', type: 'Instant', price: '50000.00' },
  { id: 'ORD-C3D7E5', date: '2023-11-15', status: 'Pending', progress: 45, account: '@jane_doe_ig', platform: 'instagram', type: 'Partial', price: '15000.00' },
  { id: 'ORD-F9A8B7', date: '2023-12-01', status: 'Partial', progress: 75, account: '@hacker_x_yt', platform: 'youtube', type: 'Partial', price: '25000.00' },
  { id: 'ORD-1E2D3C', date: '2024-01-05', status: 'Frozen', progress: 10, account: '@tiktok_star', platform: 'tiktok', type: 'Instant', price: '65000.00' },
];

const statusStyles = {
  Completed: { variant: 'default', className: 'bg-green-500/20 text-green-500 border-green-500/30', icon: <CheckCircle className="h-4 w-4" /> },
  Pending: { variant: 'secondary', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', icon: <Clock className="h-4 w-4" /> },
  Partial: { variant: 'secondary', className: 'bg-blue-500/20 text-blue-500 border-blue-500/30', icon: <Clock className="h-4 w-4" /> },
  Frozen: { variant: 'destructive', className: 'bg-red-500/20 text-red-500 border-red-500/30', icon: <XCircle className="h-4 w-4" /> },
};

const fakeLogs = [
    "Initializing connection to target server...",
    "Bypassing firewall rules...",
    "Authenticating with encrypted credentials...",
    "Access token granted.",
    "Searching for user database...",
    "Database located: /var/db/users.db",
    "Extracting user data for @jane_doe_ig...",
    "Decrypting password hash...",
    "Password decrypted: ••••••••••••",
    "Downloading account files: 45% completed...",
];

export default function OrdersPage() {
  return (
    <div className="w-full">
        <Button asChild variant="outline" className="mb-8">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Home
            </Link>
        </Button>
      <h1 className="font-headline text-4xl font-bold text-center mb-2">Order Dashboard</h1>
      <p className="text-muted-foreground text-center mb-10">Track the status of your hacking orders.</p>

      <div className="space-y-6">
        {fakeOrders.map((order) => {
          const style = statusStyles[order.status as keyof typeof statusStyles];
          const logo = platformLogos[order.platform];
          return (
            <Card key={order.id} className="bg-card/70 border-border hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                        {logo && <Image src={logo} alt={`${order.platform} logo`} width={40} height={40} className="rounded-full" />}
                        <div>
                            <CardTitle className="font-mono text-primary text-lg">{order.id}</CardTitle>
                            <CardDescription>
                                {order.account} - Order placed on {order.date}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant={style.variant} className={`whitespace-nowrap ${style.className}`}>
                        {style.icon}
                        <span className="ml-2">{order.status}</span>
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm font-medium w-20">Progress:</span>
                        <Progress value={order.progress} className="w-full" />
                        <span className="text-sm font-medium text-primary">{order.progress}%</span>
                    </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                    <div className="flex gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1"><Shield className="h-4 w-4" /> Type: <span className="font-medium text-foreground">{order.type}</span></div>
                        <div className="flex items-center gap-1"><Server className="h-4 w-4" /> Price: <span className="font-medium text-foreground">PKR {order.price}</span></div>
                    </div>
                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />View Details</Button>
                            </DialogTrigger>
                             <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                <DialogTitle>Order Details: {order.id}</DialogTitle>
                                <DialogDescription>
                                    Live logs from the hacking process.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 bg-slate-900 text-white font-mono text-xs rounded-md p-4 h-64 overflow-y-auto">
                                    {fakeLogs.slice(0, Math.ceil(order.progress / 10)).map((log, i) => (
                                        <p key={i} className="whitespace-pre-wrap">&gt; {log}</p>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button size="sm" disabled={order.status !== 'Completed'}><Download className="mr-2 h-4 w-4"/>Download Data</Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
