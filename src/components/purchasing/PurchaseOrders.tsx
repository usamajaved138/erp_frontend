import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Eye, Check, X, Edit, Trash2, Search, Package, ChevronsUpDown } from 'lucide-react';
import { useAppContext, Vendor } from '@/contexts/AppContext';
import { getPurchaseOrders,createPurchaseOrder } from '@/api/poApi';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface PO {
  po_id: number;
  vendor_id?: number;
  vendor_name: string;
  total_price: number;
  status: string;
  order_date: string;
  items: Array<{ item_id: string; item_name: string; quantity: number; unit_price: number; }>;
}

const PurchaseOrders: React.FC = () => {
 const [searchTerm, setSearchTerm] = useState('');
   const [showForm, setShowForm] = useState(false);
   const [purchaseOrders, setPurchaseOrders] = useState<PO[]>([]);
   const [editingPO, setEditingPO] = useState<PO | null>(null);
 useEffect(() => {
    // Fetch PO list
    const fetchOrders = async () => {
      const data = await getPurchaseOrders();
      console.log('Fetched PO data:', data);
      setPurchaseOrders(data);
    };
    fetchOrders();
  }, []);


     const filteredPO = purchaseOrders.filter((po) =>
    po.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.po_id.toString().includes(searchTerm)
  );
  const totalPOs = purchaseOrders.length;
  const createdPOs = purchaseOrders.filter(po => po.status === 'CREATED').length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + Number(po.total_price || 0), 0);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED': return 'bg-gray-100 text-gray-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'RECEIVED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPOs}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Created POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{createdPOs}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Purchase Orders
            </CardTitle>
           <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create PO
                </Button>
          </div>
         <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search items..."
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
                
                <TableHead>PO ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
               
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPO.map((po) => (
                <TableRow key={po.po_id}>
                  <TableCell className="font-medium">{po.po_id}</TableCell>
                  <TableCell>{po.vendor_name}</TableCell>
                  <TableCell>{po.order_date}</TableCell>
                  <TableCell>${po.total_price}</TableCell>
                  <TableCell>{po.status}</TableCell>
                  
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {showForm && (
        <PurchaseOrderForm
          po={editingPO}
          onClose={() => setShowForm(false)} onSave={function (data: any): void {
            throw new Error('Function not implemented.');
          } }        //  onSave={handleSavePO}
        />
      )}
    </div>
  );
};
interface PurchaseOrderFormProps {
  po: any | null;
  onClose: () => void;
  onSave: (data: any) => void;
}
interface Item {
  item_id: number;
  item_name: string;
  unit_price: number;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ po, onClose, onSave }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [vendorId, setVendorId] = useState<number>(0);
  const [poItems, setPoItems] = useState([{ item_id: 0, quantity: 1, unit_price: 0 }]);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [itemDropdown, setItemDropdown] = useState<number | null>(null);



  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...poItems];
    updated[index] = { ...updated[index], [field]: value };
    setPoItems(updated);
  };

  const addItemRow = () => {
    setPoItems([...poItems, { item_id: 0, quantity: 1, unit_price: 0 }]);
  };

  const removeItemRow = (index: number) => {
    const updated = poItems.filter((_, i) => i !== index);
    setPoItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) {
      alert("Please select a vendor.");
      return;
    }
    onSave({ vendor_id: vendorId, items: poItems });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[600px]">
        <h2 className="text-lg font-semibold mb-4">{po ? "Edit Purchase Order" : "New Purchase Order"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vendor Selector */}
          <Popover open={vendorOpen} onOpenChange={setVendorOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[300px] overflow-auto">
              <Command>
                <CommandInput placeholder="Search vendors..." className="text-black" />
                <CommandEmpty>No vendor found.</CommandEmpty>
                
              </Command>
            </PopoverContent>
          </Popover>

          {/* Items Table */}
          <div className="space-y-3">
            {poItems.map((row, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Popover open={itemDropdown === index} onOpenChange={(open) => setItemDropdown(open ? index : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-1/3 justify-between">
                      {row.item_id
                        ? items.find((i) => i.item_id === row.item_id)?.item_name
                        : "Select Item"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="max-h-[300px] overflow-auto">
                    <Command>
                      <CommandInput placeholder="Search items..." className="text-black" />
                      <CommandEmpty>No item found.</CommandEmpty>
                      <CommandGroup>
                        {items.map((item) => (
                          <CommandItem
                            key={item.item_id}
                            onSelect={() => {
                              handleItemChange(index, "item_id", item.item_id);
                              handleItemChange(index, "unit_price", item.unit_price);
                              setItemDropdown(null);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                row.item_id === item.item_id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {item.item_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  type="number"
                  placeholder="Qty"
                  className="w-20"
                  value={row.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  className="w-28"
                  value={row.unit_price}
                  onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))}
                />
                {poItems.length > 1 && (
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeItemRow(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addItemRow}>
              + Add Item
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default PurchaseOrders;