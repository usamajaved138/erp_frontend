import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Eye, Trash2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GenericForm from '@/components/forms/GenericForm';
import { getItems,addItem,updateItem,deleteItem } from '@/api/itemsApi'; 
import { getItemCategories } from '@/api/getItemCategoriesApi';
import { getWarehouses } from '@/api/getWarehousesApi';

interface Item {
   item_id:number,
    item_code:string,
    item_name:string,
    description:string,
    
    unit:string,
    price:number,
    category_id?:number,
    category_name?:string,
    warehouse_id?:number,
    warehouse_name?:string
}


const Items: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

//Load Items 
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error("Error loading items", error);
    }
  };

 
  const { toast } = useToast();
  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSaveItem = async (itemData: Omit<Item, "item_id">) => {
    try {
      if (editingItem) {
        await updateItem(
          editingItem.item_id,
          itemData.item_code,
          itemData.item_name,
          itemData.description,
          itemData.category_id,
          itemData.warehouse_id,
          itemData.unit,
          itemData.price
        );
         toast({ title: "Updated", description: "Item updated successfully!" });
      } else {
        await addItem(
          itemData.item_code,
          itemData.item_name,
          itemData.description,
          itemData.category_id,
          itemData.warehouse_id,
          itemData.unit,
          itemData.price
        );
        toast({ title: "Created", description: "Item created successfully!" });
      }
      setShowForm(false);
      loadItems();
    } catch (error) {
      console.error("Error saving item", error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(itemId);
        toast({ title: "Deleted", description: "Item deleted successfully!" });
        loadItems();
      } catch (error) {
        console.error("Error deleting item", error);
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
const handleViewItem = (itemId: number) => { toast({ title: "View Item", description: `Opening item ${itemId} details...`, }); };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) return 'bg-red-100 text-red-800';
    if (stock <= minStock * 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Item Master
            </CardTitle>
            <Button 
              onClick={handleAddItem}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Item
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
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price</TableHead>
                
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.item_id}>
                  <TableCell className="font-medium">{item.item_code}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                    <TableCell>{item.warehouse_name}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                     
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteItem(item.item_id)}
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
      
         {showForm && (
        <ItemForm item={editingItem} onClose={() => setShowForm(false)} onSave={handleSaveItem} />
      )}

    </>
  );
};
const ItemForm: React.FC<{
  item: Item | null;
  onClose: () => void;
  onSave: (data: Omit<Item, "item_id">) => void;
}> = ({ item, onClose, onSave }) => {
  const [item_code, setItemCode] = useState("");
  const [item_name, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category_id, setCategoryId] = useState<number>(0);
  const [category_name, setCategories] = useState<any[]>([]);
  const [warehouse_id, setWarehouseId] = useState<number>(0);
  const [warehouse_name, setWarehouses] = useState<any[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getItemCategories();
        const warehousesData = await getWarehouses();
        setCategories(categoriesData);
        setWarehouses(warehousesData);

        if (item) {
        setItemCode(item.item_code || "");
          setItemName(item.item_name || "");
          setDescription(item.description || "");
          setPrice(item.price );
          setUnit(item.unit || "");
          setCategoryId(item.category_id || 0);
          setWarehouseId(item.warehouse_id || 0);
        }
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    fetchData();
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item_name  || !category_id || !item_code || !description || !unit) {
      alert("Please fill all fields.");
      return;
    }
    onSave({
        item_code,
        item_name,
        price,
        category_id,
        warehouse_id,
        description,
        unit
        
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {item ? "Edit Item" : "Add Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
             <Input
            value={item_code}
            onChange={(e) => setItemCode(e.target.value)}
            placeholder="Item Code"
          />
          <Input
            value={item_name}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item Name"
          />
          <Input
           
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type='text'
            placeholder="Description"
          />
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
          />
           <Input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Unit"
          />

          {/* Category Dropdown */}
          <select
            value={category_id}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="w-full border p-2 rounded"
          >
            <option value={0}>Select Category</option>
            {category_name.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.category_name}
              </option>
            ))}
          </select>

          {/* Warehouse Dropdown */}
          <select
            value={warehouse_id}
            onChange={(e) => setWarehouseId(Number(e.target.value))}
            className="w-full border p-2 rounded"
          >
            <option value={0}>Select Warehouse</option>
            {warehouse_name.map((c) => (
              <option key={c.warehouse_id} value={c.warehouse_id}>
                {c.warehouse_name}
              </option>
            ))}
          </select>

          <div className="flex  gap-2">
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


export default Items;