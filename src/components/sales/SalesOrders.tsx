import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Truck, AlertCircle, CheckCircle2, Edit, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SalesOrderForm from '@/components/forms/SalesOrderForm';

interface SalesOrder {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  deliveryDate: string;
  priority: 'low' | 'medium' | 'high';
  amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  stockStatus: 'available' | 'partial' | 'backorder';
}

const SalesOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([
    { id: '1', orderNumber: 'SO-001', customer: 'John Doe', date: '2024-01-15', deliveryDate: '2024-01-20', priority: 'high', amount: 1299.99, status: 'processing', items: 2, stockStatus: 'available' },
    { id: '2', orderNumber: 'SO-002', customer: 'Jane Smith', date: '2024-01-16', deliveryDate: '2024-01-22', priority: 'medium', amount: 599.99, status: 'confirmed', items: 1, stockStatus: 'available' },
    { id: '3', orderNumber: 'SO-003', customer: 'Bob Johnson', date: '2024-01-17', deliveryDate: '2024-01-25', priority: 'low', amount: 899.99, status: 'pending', items: 3, stockStatus: 'partial' },
    { id: '4', orderNumber: 'SO-004', customer: 'Alice Brown', date: '2024-01-18', deliveryDate: '2024-01-28', priority: 'high', amount: 2199.99, status: 'shipped', items: 4, stockStatus: 'available' },
  ]);
  const { toast } = useToast();

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order: SalesOrder) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "View Order",
      description: `Opening order ${orderId} details...`,
    });
  };

  const handleShipOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'shipped' } : order
    ));
    toast({
      title: "Order Shipped",
      description: `Order ${orderId} has been marked as shipped.`,
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    toast({
      title: "Order Deleted",
      description: `Order ${orderId} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleFormSubmit = (formData: any) => {
    if (editingOrder) {
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...formData, amount: formData.total }
          : order
      ));
      toast({
        title: "Order Updated",
        description: "Sales order has been updated successfully.",
      });
    } else {
      const newOrder: SalesOrder = {
        id: Date.now().toString(),
        orderNumber: `SO-${String(orders.length + 1).padStart(3, '0')}`,
        customer: formData.customer,
        date: formData.orderDate,
        deliveryDate: formData.deliveryDate,
        priority: formData.priority,
        amount: formData.total,
        status: 'pending',
        items: formData.items.length,
        stockStatus: 'available'
      };
      setOrders(prev => [...prev, newOrder]);
      toast({
        title: "Order Created",
        description: "New sales order has been created successfully.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockIcon = (stockStatus: string) => {
    switch (stockStatus) {
      case 'available': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'backorder': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Orders</CardTitle>
            <Button 
              onClick={handleNewOrder}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Sales Order
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStockIcon(order.stockStatus)}
                      <span className="text-sm">{order.stockStatus}</span>
                    </div>
                  </TableCell>
                  <TableCell>${order.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {order.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <SalesOrderForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
        initialData={editingOrder}
      />
    </>
  );
};

export default SalesOrders;