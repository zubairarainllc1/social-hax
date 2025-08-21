
"use client";

import { useState, useMemo } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, XCircle, Download, Settings, Plus, DollarSign, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const platformLogos: { [key: string]: string } = {
  instagram: 'https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584853.png',
  facebook: 'https://acbrd.org.au/wp-content/uploads/2020/08/facebook-circular-logo.png',
  youtube: '/youtube.png',
  tiktok: '/tiktok.png',
  x: '/x.png',
  whatsapp: '/whatsapp.png',
};

type OrderStatus = 'Completed' | 'Pending' | 'Partial' | 'Frozen' | 'Canceled';

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  progress: number;
  account: string;
  platform: string;
  type: 'Instant' | 'Partial';
  price: string;
  remaining?: string;
};

const initialOrders: Order[] = [
  { id: 'ORD-84B2A1', date: '2023-10-26', status: 'Completed', progress: 100, account: '@john_doe_fb', platform: 'facebook', type: 'Instant', price: '50000.00' },
  { id: 'ORD-C3D7E5', date: '2023-11-15', status: 'Pending', progress: 45, account: '@jane_doe_ig', platform: 'instagram', type: 'Partial', price: '15000.00', remaining: '8250.00' },
  { id: 'ORD-F9A8B7', date: '2023-12-01', status: 'Partial', progress: 75, account: '@hacker_x_yt', platform: 'youtube', type: 'Partial', price: '25000.00', remaining: '6250.00' },
  { id: 'ORD-1E2D3C', date: '2024-01-05', status: 'Frozen', progress: 10, account: '@tiktok_star', platform: 'tiktok', type: 'Instant', price: '65000.00' },
  { id: 'ORD-G4H5I6', date: '2024-01-10', status: 'Canceled', progress: 0, account: '123-456-7890', platform: 'whatsapp', type: 'Instant', price: '30000.00' },
];

const statusStyles: { [key in OrderStatus]: { variant: 'default' | 'secondary' | 'destructive', className: string, icon: React.ReactNode } } = {
  Completed: { variant: 'default', className: 'bg-green-500/20 text-green-500 border-green-500/30', icon: <CheckCircle className="h-4 w-4" /> },
  Pending: { variant: 'secondary', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', icon: <Clock className="h-4 w-4" /> },
  Partial: { variant: 'secondary', className: 'bg-blue-500/20 text-blue-500 border-blue-500/30', icon: <Clock className="h-4 w-4" /> },
  Frozen: { variant: 'destructive', className: 'bg-gray-500/20 text-gray-500 border-gray-500/30', icon: <XCircle className="h-4 w-4" /> },
  Canceled: { variant: 'destructive', className: 'bg-red-500/20 text-red-500 border-red-500/30', icon: <XCircle className="h-4 w-4" /> },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [newOrder, setNewOrder] = useState({
    platform: 'instagram',
    account: '',
    price: '',
    type: 'Instant' as 'Instant' | 'Partial'
  });

  const handleCreateOrder = () => {
    if (!newOrder.account || !newOrder.price) return;
    const newId = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newDate = new Date().toISOString().split('T')[0];
    const createdOrder: Order = {
      ...newOrder,
      id: newId,
      date: newDate,
      status: 'Pending',
      progress: 0,
      price: parseFloat(newOrder.price).toFixed(2),
      ...(newOrder.type === 'Partial' && { remaining: parseFloat(newOrder.price).toFixed(2) })
    };
    setOrders(prev => [createdOrder, ...prev]);
    setCreateDialogOpen(false);
    setNewOrder({ platform: 'instagram', account: '', price: '', type: 'Instant' });
  };
  
  const handleOpenEditDialog = (order: Order) => {
    setEditingOrder({ ...order });
    setEditDialogOpen(true);
  };

  const handleUpdateOrder = () => {
    if (!editingOrder) return;
    setOrders(prev => prev.map(o => o.id === editingOrder.id ? editingOrder : o));
    setEditDialogOpen(false);
    setEditingOrder(null);
  }

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());
  }, [activeTab, orders]);

  const OrderCard = ({ order }: { order: Order }) => {
    const style = statusStyles[order.status];
    const logo = platformLogos[order.platform];
    return (
      <Card className="bg-card/70 border-border hover:border-primary/50 transition-colors shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              {logo && <Image src={logo} alt={`${order.platform} logo`} width={40} height={40} className="rounded-full" />}
              <div>
                <CardTitle className="font-mono text-primary text-lg">{order.id}</CardTitle>
                <CardDescription>{order.account} - Order placed on {order.date}</CardDescription>
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
              <Progress value={order.progress} />
              <span className="text-sm font-medium text-primary">{order.progress}%</span>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 text-sm">
            <div className="flex flex-col gap-2 text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="h-4 w-4" /> Type: <span className="font-medium text-foreground">{order.type}</span></div>
                <div className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Price: <span className="font-medium text-foreground">PKR {order.price}</span></div>
                {order.type === 'Partial' && order.remaining && (
                    <div className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-red-500" /> Remaining: <span className="font-medium text-red-500">PKR {order.remaining}</span></div>
                )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(order)} className="w-full sm:w-auto"><Settings className="mr-2 h-4 w-4" />Manage</Button>
                {order.type === 'Partial' && <Button size="sm" variant="destructive" className="w-full sm:w-auto">Pay Remainder</Button>}
                <Button size="sm" disabled={order.status !== 'Completed'} className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" />Download Access</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Home
                </Link>
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="default"><Plus className="mr-2 h-4 w-4"/> New Order</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Order</DialogTitle>
                        <DialogDescription>Fill in the details to create a new fake order.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="platform" className="text-right">Platform</Label>
                            <Select value={newOrder.platform} onValueChange={(value) => setNewOrder(p => ({ ...p, platform: value }))}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(platformLogos).map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="account" className="text-right">Username</Label>
                            <Input id="account" value={newOrder.account} onChange={e => setNewOrder(p => ({ ...p, account: e.target.value }))} className="col-span-3" placeholder="e.g., @username"/>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price (PKR)</Label>
                            <Input id="price" type="number" value={newOrder.price} onChange={e => setNewOrder(p => ({ ...p, price: e.target.value }))} className="col-span-3" placeholder="e.g., 50000"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                             <Select value={newOrder.type} onValueChange={(value: 'Instant' | 'Partial') => setNewOrder(p => ({ ...p, type: value }))}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select order type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Instant">Instant</SelectItem>
                                    <SelectItem value="Partial">Partial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleCreateOrder}>Create Order</Button>
                </DialogContent>
            </Dialog>
        </div>
      <h1 className="font-headline text-4xl font-bold text-center mb-2">Order Dashboard</h1>
      <p className="text-muted-foreground text-center mb-10">Track and manage the status of your hacking orders.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="partial">Partial</TabsTrigger>
              <TabsTrigger value="frozen">Frozen</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
             <div className="space-y-6">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
                ) : (
                    <p className="text-center text-muted-foreground py-10">No orders found for this status.</p>
                )}
            </div>
          </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Order: {editingOrder?.id}</DialogTitle>
            <DialogDescription>Update the progress and status of this order.</DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <div className="grid gap-6 pt-4">
              <div>
                <Label htmlFor="progress">Progress: {editingOrder.progress}%</Label>
                <Slider id="progress" value={[editingOrder.progress]} onValueChange={([val]) => setEditingOrder(o => o ? {...o, progress: val} : null)} max={100} step={1} />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                 <Select value={editingOrder.status} onValueChange={(value: OrderStatus) => setEditingOrder(o => o ? {...o, status: value} : null)}>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                       {Object.keys(statusStyles).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              
              {editingOrder.type === 'Partial' && (
                <div>
                  <Label htmlFor="remaining">Remaining Payment (PKR)</Label>
                  <Input 
                    id="remaining" 
                    type="number" 
                    value={editingOrder.remaining || ''} 
                    onChange={e => setEditingOrder(o => o ? { ...o, remaining: e.target.value } : null)}
                    placeholder="e.g., 5000.00"
                  />
                </div>
              )}
               <Button onClick={handleUpdateOrder}>Update Order</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



    