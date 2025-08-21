import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";

const fakeOrders = [
  { id: 'ORD-84B2A1', date: '2023-10-26', status: 'Completed', progress: 100, account: '@john_doe_fb' },
  { id: 'ORD-C3D7E5', date: '2023-11-15', status: 'Pending', progress: 45, account: '@jane_doe_ig' },
  { id: 'ORD-F9A8B7', date: '2023-12-01', status: 'Partial', progress: 75, account: '@hacker_x_yt' },
  { id: 'ORD-1E2D3C', date: '2024-01-05', status: 'Frozen', progress: 10, account: '@tiktok_star' },
];

const statusStyles = {
  Completed: { variant: 'default', className: 'bg-green-500/20 text-green-500 border-green-500/30', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  Pending: { variant: 'secondary', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', icon: <Clock className="h-4 w-4 text-yellow-500" /> },
  Partial: { variant: 'secondary', className: 'bg-blue-500/20 text-blue-500 border-blue-500/30', icon: <Clock className="h-4 w-4 text-blue-500" /> },
  Frozen: { variant: 'destructive', className: 'bg-red-500/20 text-red-500 border-red-500/30', icon: <XCircle className="h-4 w-4 text-red-500" /> },
};

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
          return (
            <Card key={order.id} className="bg-card/70 border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-mono text-primary text-lg">{order.id}</CardTitle>
                        <CardDescription>{order.account} - Order placed on {order.date}</CardDescription>
                    </div>
                    <Badge variant={style.variant} className={style.className}>
                        {style.icon}
                        <span className="ml-2">{order.status}</span>
                    </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-20">Progress:</span>
                  <Progress value={order.progress} className="w-full" />
                  <span className="text-sm font-medium text-primary">{order.progress}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
