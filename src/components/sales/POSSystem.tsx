import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ShoppingCart, CreditCard, Banknote, Smartphone, Printer, Pause, Play } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  barcode: string;
  stock: number;
}

const POSSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isTransactionHeld, setIsTransactionHeld] = useState(false);
  
  const [products] = useState<Product[]>([
    { id: '1', name: 'Laptop Computer', price: 999.99, category: 'Electronics', barcode: '123456789', stock: 15 },
    { id: '2', name: 'Wireless Mouse', price: 29.99, category: 'Electronics', barcode: '987654321', stock: 50 },
    { id: '3', name: 'Office Chair', price: 199.99, category: 'Furniture', barcode: '456789123', stock: 8 },
    { id: '4', name: 'Desk Lamp', price: 49.99, category: 'Furniture', barcode: '789123456', stock: 25 },
  ]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const holdTransaction = () => {
    setIsTransactionHeld(true);
    setCart([]);
  };

  const resumeTransaction = () => {
    setIsTransactionHeld(false);
    // In real implementation, would load held transaction
  };

  const processPayment = (method: string) => {
    // Process payment logic here
    setCart([]);
    alert(`Payment of $${total.toFixed(2)} processed via ${method}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Product Selection */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle>Product Selection</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addToCart(product)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart & Checkout */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Shopping Cart</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={holdTransaction}>
                <Pause className="h-4 w-4 mr-1" />
                Hold
              </Button>
              {isTransactionHeld && (
                <Button size="sm" variant="outline" onClick={resumeTransaction}>
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <>
                <div className="max-h-48 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="w-16 h-8"
                              min="0"
                            />
                          </TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => processPayment('Cash')} className="bg-green-500 hover:bg-green-600">
                    <Banknote className="h-4 w-4 mr-2" />
                    Cash
                  </Button>
                  <Button onClick={() => processPayment('Card')} className="bg-blue-500 hover:bg-blue-600">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Card
                  </Button>
                  <Button onClick={() => processPayment('Mobile')} className="bg-purple-500 hover:bg-purple-600">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSSystem;