
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, XCircle, Download, Plus, DollarSign, Shield, GripVertical, Minus, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Identifier, XYCoord } from 'dnd-core';
import { useIsMobile } from '@/hooks/use-mobile';

const ORDERS_STORAGE_KEY = 'socialhax-orders';

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

const initialOrdersData: Omit<Order, 'date'>[] = [
    { id: 'ORD-84B2A1', status: 'Completed', progress: 100, account: '@john_doe_fb', platform: 'facebook', type: 'Instant', price: '50000.00' },
    { id: 'ORD-C3D7E5', status: 'Pending', progress: 45, account: '@jane_doe_ig', platform: 'instagram', type: 'Partial', price: '15000.00', remaining: '8250.00' },
    { id: 'ORD-F9A8B7', status: 'Partial', progress: 75, account: '@hacker_x_yt', platform: 'youtube', type: 'Partial', price: '25000.00', remaining: '6250.00' },
    { id: 'ORD-1E2D3C', status: 'Frozen', progress: 10, account: '@tiktok_star', platform: 'tiktok', type: 'Instant', price: '65000.00' },
    { id: 'ORD-G4H5I6', status: 'Canceled', progress: 0, account: '123-456-7890', platform: 'whatsapp', type: 'Instant', price: '30000.00' },
];

const statusStyles: { [key in OrderStatus]: { variant: 'default' | 'secondary' | 'destructive', className: string, icon: React.ReactNode } } = {
  Completed: { variant: 'default', className: 'bg-green-500/20 text-green-500 border-green-500/30', icon: <CheckCircle className="h-4 w-4" /> },
  Pending: { variant: 'secondary', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', icon: <Clock className="h-4 w-4" /> },
  Partial: { variant: 'secondary', className: 'bg-blue-500/20 text-blue-500 border-blue-500/30', icon: <Clock className="h-4 w-4" /> },
  Frozen: { variant: 'destructive', className: 'bg-gray-500/20 text-gray-500 border-gray-500/30', icon: <XCircle className="h-4 w-4" /> },
  Canceled: { variant: 'destructive', className: 'bg-red-500/20 text-red-500 border-red-500/30', icon: <XCircle className="h-4 w-4" /> },
};


const ItemTypes = {
  ORDER: 'order',
}

interface DragItem {
  index: number
  id: string
  type: string
}

const OrderCard = ({ order, index, moveCard, onEdit }: { order: Order; index: number; moveCard: (dragIndex: number, hoverIndex: number) => void; onEdit: (order: Order) => void; }) => {
    const style = statusStyles[order.status];
    const logo = platformLogos[order.platform];
    const ref = useRef<HTMLDivElement>(null)
    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.ORDER,
        collect(monitor) {
        return {
            handlerId: monitor.getHandlerId(),
        }
        },
        hover(item: DragItem, monitor) {
        if (!ref.current) {
            return
        }
        const dragIndex = item.index
        const hoverIndex = index

        if (dragIndex === hoverIndex) {
            return
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect()
        const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const clientOffset = monitor.getClientOffset()
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }
        moveCard(dragIndex, hoverIndex)
        item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag, preview] = useDrag({
        type: ItemTypes.ORDER,
        item: () => {
        return { id: order.id, index }
        },
        collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
        }),
    })
    
    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    return (
      <div ref={preview} style={{ opacity }} className="group">
        <Card ref={ref} data-handler-id={handlerId} className="bg-card/70 border-border hover:border-primary/50 transition-colors shadow-sm relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move touch-none w-8 h-full" ref={drag}>
             <GripVertical className="h-6 w-6 text-muted-foreground/50 absolute top-1/2 -translate-y-1/2 left-1 hidden" />
          </div>
          <CardHeader className="pl-12">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                {logo && <Image src={logo} alt={`${order.platform} logo`} width={40} height={40} className="rounded-full" />}
                <div>
                  <CardTitle className="font-mono text-primary text-lg">{order.id}</CardTitle>
                  <CardDescription>{order.account} - Order placed on {format(new Date(order.date), "PPP")}</CardDescription>
                </div>
              </div>
              <Badge variant={style.variant} className={`whitespace-nowrap ${style.className}`}>
                {style.icon}
                <span className="ml-2">{order.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pl-12">
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
                  {order.type === 'Partial' && <Button size="sm" variant="destructive" className="w-full sm:w-auto">Pay Remainder</Button>}
                  <Button size="sm" onClick={() => onEdit(order)} className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" />Download Access</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

const EditOrderDialog = ({ order, isOpen, onOpenChange, onUpdate }: { order: Order | null; isOpen: boolean; onOpenChange: (isOpen: boolean) => void; onUpdate: (updatedOrder: Order) => void; }) => {
    const [localOrder, setLocalOrder] = useState<Order | null>(null);

    useEffect(() => {
        setLocalOrder(order);
    }, [order]);
    
    const handleChange = (field: keyof Omit<Order, 'progress'>, value: any) => {
        setLocalOrder(o => o ? { ...o, [field]: value } : null);
    };
    
    const handleProgressChange = (value: number) => {
        setLocalOrder(o => o ? { ...o, progress: value } : null);
    }

    const handleUpdate = () => {
        if (localOrder) {
            onUpdate(localOrder);
        }
    };
    
    const incrementProgress = (amount: number) => {
        setLocalOrder(o => {
            if (!o) return null;
            const newProgress = Math.max(0, Math.min(100, o.progress + amount));
            return { ...o, progress: newProgress };
        });
    }

    if (!localOrder) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setLocalOrder(null);
            }
            onOpenChange(open);
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Order: {localOrder.id}</DialogTitle>
                    <DialogDescription>Update the progress and status of this order.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 pt-4">
                    <div>
                        <Label htmlFor="progress" className="mb-2 block">Progress: {localOrder.progress}%</Label>
                        <Slider 
                            id="progress" 
                            value={[localOrder.progress]} 
                            onValueChange={([val]) => handleProgressChange(val)} 
                            max={100} 
                            step={1} 
                        />
                         <div className="flex justify-between items-center mt-2">
                            <Button variant="outline" size="sm" onClick={() => incrementProgress(-10)}>
                                <Minus className="h-4 w-4 mr-1" />
                                10%
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => incrementProgress(10)}>
                                <Plus className="h-4 w-4 mr-1" />
                                10%
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={localOrder.status} onValueChange={(value: OrderStatus) => handleChange('status', value)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(statusStyles).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {localOrder.type === 'Partial' && (
                        <div>
                            <Label htmlFor="remaining">Remaining Payment (PKR)</Label>
                            <Input
                                id="remaining"
                                type="number"
                                value={localOrder.remaining || ''}
                                onChange={e => handleChange('remaining', e.target.value)}
                                placeholder="e.g., 5000.00"
                            />
                        </div>
                    )}
                    <Button onClick={handleUpdate}>Update Order</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const CreateOrderDialog = ({ isOpen, onOpenChange, onCreate }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void; onCreate: (newOrder: Omit<Order, 'id' | 'date' | 'status' | 'progress'>) => void; }) => {
    const [platform, setPlatform] = useState('instagram');
    const [account, setAccount] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState<'Instant' | 'Partial'>('Instant');

    const handleCreate = () => {
        if (!account || !price) return;
        onCreate({
            platform,
            account,
            price: parseFloat(price).toFixed(2),
            type,
            ...(type === 'Partial' && { remaining: parseFloat(price).toFixed(2) })
        });
        setAccount('');
        setPrice('');
        setType('Instant');
        setPlatform('instagram');
    };

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                    <DialogDescription>Fill in the details to create a new fake order.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="platform" className="text-right">Platform</Label>
                        <Select value={platform} onValueChange={setPlatform}>
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
                        <Input id="account" value={account} onChange={e => setAccount(e.target.value)} className="col-span-3" placeholder="e.g., @username"/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price (PKR)</Label>
                        <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="col-span-3" placeholder="e.g., 50000"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                         <Select value={type} onValueChange={(value: 'Instant' | 'Partial') => setType(value)}>
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
                <Button onClick={handleCreate}>Create Order</Button>
            </DialogContent>
        </Dialog>
    );
};
  
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const isMobile = useIsMobile();

  // Load orders from localStorage on initial render
  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        const today = new Date();
        const initialOrdersWithDate = initialOrdersData.map(order => ({
            ...order,
            date: today.toISOString()
        }));
        setOrders(initialOrdersWithDate);
      }
    } catch (error) {
      console.error("Could not read orders from localStorage", error);
        const today = new Date();
        const initialOrdersWithDate = initialOrdersData.map(order => ({
            ...order,
            date: today.toISOString()
        }));
      setOrders(initialOrdersWithDate);
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    try {
      if (orders.length > 0) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      }
    } catch (error) {
      console.error("Could not save orders to localStorage", error);
    }
  }, [orders]);


  const handleCreateOrder = (newOrderData: Omit<Order, 'id' | 'date' | 'status' | 'progress'>) => {
    const newId = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newDate = new Date().toISOString();
    const createdOrder: Order = {
      ...newOrderData,
      id: newId,
      date: newDate,
      status: 'Pending',
      progress: 0,
    };
    setOrders(prev => [createdOrder, ...prev]);
    setCreateDialogOpen(false);
  };
  
  const handleOpenEditDialog = (order: Order) => {
    setEditingOrder(order);
    setEditDialogOpen(true);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setEditDialogOpen(false);
    setEditingOrder(null);
  }

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());
  }, [activeTab, orders]);
  
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setOrders((prevOrders: Order[]) => {
       const newOrders = [...prevOrders];
       const [draggedItem] = newOrders.splice(dragIndex, 1);
       newOrders.splice(hoverIndex, 0, draggedItem);
       return newOrders;
    });
  }, []);
  
  const TABS = ['all', 'completed', 'pending', 'partial', 'frozen', 'canceled'];

  const PageContent = () => (
    <div className="w-full">
        <div className="flex justify-between items-center mb-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Home
                </Link>
            </Button>
            <Button variant="default" onClick={() => setCreateDialogOpen(true)}><Plus className="mr-2 h-4 w-4"/> New Order</Button>
        </div>
      <h1 className="font-headline text-4xl font-bold text-center mb-2">Order Dashboard</h1>
      <p className="text-muted-foreground text-center mb-10">Track and manage the status of your hacking orders.</p>
      
      {isMobile ? (
        <div className="mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                  {TABS.map(tab => (
                      <SelectItem key={tab} value={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-6">
                {TABS.map(tab => (
                   <TabsTrigger key={tab} value={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
      )}

      <div className="space-y-6">
          {filteredOrders.length > 0 ? (
              filteredOrders.map((order, i) => <OrderCard key={order.id} index={i} order={order} moveCard={moveCard} onEdit={handleOpenEditDialog} />)
          ) : (
              <p className="text-center text-muted-foreground py-10">No orders found for this status.</p>
          )}
      </div>

      <CreateOrderDialog 
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateOrder}
      />
      
      <EditOrderDialog 
        order={editingOrder} 
        isOpen={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleUpdateOrder}
      />
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <PageContent />
    </DndProvider>
  )
}
    

    






