import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Search, Building, Package, ChevronsUpDown, Check } from 'lucide-react';

import { getVendors,addVendor,updateVendor,deleteVendor } from '@/api/vendorsApi';
import { getCompanies } from '@/api/getCompaniesApi';
import {getAccounts} from '@/api/getAccountsApi'; 
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


interface Vendor {
  vendor_id: number;
  vendor_name: string;
  
  phone: string;
  email: string;
  address: string;
account_id?: number | null;
  account_code?: string;
  account_name?: string;
  
}

const VendorMaster: React.FC = () => {
  
const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
//Load Vendors
  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data);
    } catch (error) {
      console.error("Error loading vendors", error);
    }
  };


   const handleAddVendor = () => {
    setEditingVendor(null);
    setShowForm(true);
  };
 const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowForm(true);
  };
 const handleSaveVendor = async (VendorData: Omit<Vendor, "vendor_id">) => {
    try {
      if (editingVendor) {
        await updateVendor(
          editingVendor.vendor_id,
          VendorData.vendor_name,
         
          VendorData.phone,
          VendorData.email,
          VendorData.address,
          VendorData.account_id
        );
        
      } else {
        await addVendor(
          VendorData.vendor_name,
         
          VendorData.phone,
          VendorData.email,
          VendorData.address,
          VendorData.account_id
        );
        
      }
      setShowForm(false);
      loadVendors();
    } catch (error) {
      console.error("Error saving vendor", error);
    }
  };

  const handleDeleteVendor = async (vendorId: number) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      try {
        await deleteVendor(vendorId);
        
        loadVendors();
      } catch (error) {
        console.error("Error deleting vendor", error);
      }
    }
  };

        const filteredVendors = vendors.filter((vendor) =>
    vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) 
   
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


    return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Vendors Masters
            </CardTitle>
           <Button
           onClick={handleAddVendor}
            className="bg-gradient-to-r from-purple-500 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
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
                
                <TableHead>Name</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.vendor_id}>
                  <TableCell className="font-medium">{vendor.vendor_name}</TableCell>
                 <TableCell>{vendor.account_name
                                        ? `${vendor.account_name}-${vendor.account_code}`
                                        : "-"}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                     
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditVendor(vendor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteVendor(vendor.vendor_id)}
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
        <VendorForm vendor={editingVendor} onClose={() => setShowForm(false)} onSave={handleSaveVendor} />
      )}
    </>
  );
};
const VendorForm: React.FC<{
  vendor: Vendor | null;
  onClose: () => void;
  onSave: (data: Omit<Vendor, "vendor_id">) => void;
}> = ({ vendor, onClose, onSave }) => {
  const [vendor_name, setVendorName] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [account_id, setAccountId] = useState<number>(0);
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch company data
  useEffect(() => {
    const fetchData = async () => {
      try {
         const accountsData = await getAccounts();
                
                setAccounts(accountsData);
        if (vendor) {
          setVendorName(vendor.vendor_name || "");
          setPhone(vendor.phone || "");
          setEmail(vendor.email || "");
          setAddress(vendor.address || "");
          setAccountId(vendor.account_id || 0);
        }
      } catch (err) {
        console.error("Error loading companies", err);
      }
    };
    fetchData();
  }, [vendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor_name  || !phone || !email || !address || !account_id) {
      alert("Please fill all fields.");
      return;
    }
    onSave({
      vendor_name,
      phone,
      email,
      address,
      account_id
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {vendor ? "Edit Vendor" : "Add Vendor"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={vendor_name}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="Vendor Name"
          />
            {/* 🔹 Account Selection Dropdown */}
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {account_id
                  ? `${accounts.find((a) => a.account_id === account_id)?.account_name} (${accounts.find((a) => a.account_id === account_id)?.account_code})`
                  : "Select Account"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[300px] overflow-auto">
              <Command >
                <CommandInput placeholder="Search accounts..." className="text-black" />
                <CommandEmpty >No account found.</CommandEmpty>
                <CommandGroup>
                  {accounts.map((acc) => (
                    <CommandItem
                      key={acc.account_id}
                      className="hover:bg-gray-100"
                      onSelect={() => {
                        setAccountId(acc.account_id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                           "mr-2 h-4 w-4",
                          account_id === acc.account_id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {acc.account_name} ({acc.account_code})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          
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
export default VendorMaster;