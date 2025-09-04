// ItemCategories.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Building2, ChevronsUpDown, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GenericForm from "@/components/forms/GenericForm";
import { getItemCategory, addItemCategory, updateItemCategory, deleteItemCategory } from "@/api/itemCategoryApi";
import { getAccounts } from "@/api/getAccountsApi";
import { getRegions } from "@/api/salesPersonApi";
import { getSalesPersons,addSalePerson,updateSalePerson,deleteSalePerson } from "@/api/salesPersonApi";
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
import { getBranches } from "@/api/branchApi";
import { getCompanies } from "@/api/companyApi";
import { getDesignations } from "@/api/getDesignationApi";
import { set } from "react-hook-form";


interface SalesPerson {
  sales_person_id: number;
  sales_person_name: string;
  father_name: string;
  phone: string;
  designation_id?: number;
  designation_name?: string;
  branch_id?: number;
  branch_name?: string;
  company_id?: number;
  company_name?: string;
  region_id?: number;
  region_name?: string;
  created_by: number;
  updated_by: number;
}

const SalesPersons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editSalePerson, setEditSalePerson] = useState<SalesPerson | null>(null);
  const [SalesPersons, setSalesPersons] = useState<SalesPerson[]>([]);  
  const { toast } = useToast();
  // Load categories
  const loadSalesPersons = async () => {
    try {
      const res = await getSalesPersons();
      setSalesPersons(res.data || res);
    } catch (error) {
      console.error("Error loading salespersons", error);
    }
  };
  useEffect(() => {
    loadSalesPersons();
  }, []);
  const handleAddSalesPerson = () => {
    setEditSalePerson(null);
    setShowForm(true);
  };
  const handleEditSalesPerson = (saleperson: SalesPerson) => {
    setEditSalePerson(saleperson);
    setShowForm(true);
  };
  const handleSaveSalesPerson = async (data: Omit<SalesPerson, "sales_person_id">) => {
    try {
      if (editSalePerson) {
        await updateSalePerson(
          editSalePerson.sales_person_id,
          data.sales_person_name,
          data.father_name,
          data.phone,
          data.designation_id,
          data.branch_id,
          data.company_id,
          data.region_id,
          data.created_by,
          data.updated_by
        );
        toast({ title: "Updated", description: "Sales Person updated successfully!" });
      } else {
        await addSalePerson(
          data.sales_person_name,
          data.father_name,
          data.phone,
          data.designation_id,
          data.branch_id,
          data.company_id,
          data.region_id,
          data.created_by,
          data.updated_by
        );
        toast({ title: "Created", description: "Sales Person created successfully!" });
      }
      setShowForm(false);
      loadSalesPersons();
    } catch (error) {
      console.error("Error saving Sales Person", error);
      toast({ title: "Error", description: "Failed to save Sales Person", variant: "destructive" });
    }
  };
  const handleDeleteSalesPerson = async (sales_person_id: number) => {
    if (confirm("Are you sure you want to delete this Sales Person?")) {
      try {
        await deleteSalePerson(sales_person_id);
        loadSalesPersons();
        toast({ title: "Deleted", description: "Sales Person deleted successfully!" });
      } catch (error) {
        console.error("Error deleting Sales Person", error);
        toast({ title: "Error", description: "Failed to delete Sales Person", variant: "destructive" });
      }
    }
  };
  const filteredSalesPersons = SalesPersons.filter(
    (sp) =>
      sp.sales_person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sp.father_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sp.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sp.designation_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sp.branch_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sp.company_name || "").toLowerCase().includes(searchTerm.toLowerCase())  
  );
  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Sales Persons
            </CardTitle>
            <Button
              onClick={handleAddSalesPerson}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Sale Person
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Sales Persons..."
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
               
                <TableHead>Father Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Region</TableHead>
    
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalesPersons.map((sp) => (
                <TableRow key={sp.sales_person_id}>
                  <TableCell className="font-medium">{sp.sales_person_name}</TableCell>
                  <TableCell>{sp.father_name}</TableCell>
                  <TableCell>{sp.phone}</TableCell>
                  <TableCell>{sp.designation_name}</TableCell>
                  <TableCell>{sp.branch_name}</TableCell>
                  <TableCell>{sp.company_name}</TableCell>
                  <TableCell>{sp.region_name}</TableCell>

                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditSalesPerson(sp)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteSalesPerson(sp.sales_person_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSalesPersons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm text-gray-500">
                    No sales persons found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       {
       showForm && (
        <SalesPersonForm salesPerson={editSalePerson} onClose={() => setShowForm(false)} onSave={handleSaveSalesPerson} />
      )}
    </>
  );
};
const SalesPersonForm: React.FC<{
  salesPerson: SalesPerson | null;
  onClose: () => void;
  onSave: (data: Omit<SalesPerson, "sales_person_id">) => void;
}> = ({ salesPerson, onClose, onSave }) => {
  const [sales_person_name, setSalesPersonName] = useState("");
  const [father_name, setFatherName] = useState("");
  const [phone, setPhone] = useState("");

  const [designation_id, setDesignationId] = useState<number >(0);
   const [designations, setDesignations] = useState([]);
     const [designationOpen, setDesignationOpen] = useState(false);

  const [branch_id, setBranchId] = useState<number >(0);
   const [branches, setBranches] = useState([]);
  const [branchOpen, setBranchOpen] = useState(false);

  const [company_id, setCompanyId] = useState<number >(0);
  const [companies, setCompanies] = useState([]);
  const [companyOpen, setCompanyOpen] = useState(false);

  const [region_id, setRegionId] = useState<number >(0);
   const [regions, setRegions] = useState([]);
  const [regionOpen, setRegionOpen] = useState(false);


  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const designationData = await getDesignations();
        const branchData = await getBranches();
        const companyData = await getCompanies();
        setDesignations(designationData);
        setBranches(branchData);
        setCompanies(companyData);
        setRegions(await getRegions());
        if (salesPerson) {
          setSalesPersonName(salesPerson.sales_person_name || "");
          setFatherName(salesPerson.father_name || "");
          setPhone(salesPerson.phone || "");    
          setDesignationId(salesPerson.designation_id || 0);
          setBranchId(salesPerson.branch_id || 0);
          setCompanyId(salesPerson.company_id || 0);
          setRegionId(salesPerson.region_id || 0);
        }
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    fetchData();
  }, [salesPerson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sales_person_name || !father_name || !phone || !designation_id || !branch_id || !company_id || !region_id) {
      alert("Please fill all fields.");
      return;
    }
    onSave({
        sales_person_name,
        father_name,
        phone,
        designation_id,
        branch_id,
        company_id,
        region_id,
        created_by: 0,
        updated_by: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {salesPerson ? "Edit Sales Person" : "Add Sales Person"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={sales_person_name}
            onChange={(e) => setSalesPersonName(e.target.value)}
            placeholder="Sales Person Name"
          />
          <Input
            value={father_name}
            onChange={(e) => setFatherName(e.target.value)}
            placeholder="Father Name"
          />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
           <Popover open={designationOpen} onOpenChange={setDesignationOpen}>
                      <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {designation_id
                  ? `${designations.find((d) => d.designation_id === designation_id)?.designation_name}`
                  : "Select Designation"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[300px] overflow-auto">
              <Command >
                <CommandInput placeholder="Search accounts..." className="text-black" />
                <CommandEmpty >No designation found.</CommandEmpty>
                <CommandGroup>
                  {designations.map((d) => (
                    <CommandItem
                      key={d.designation_id}
                      className="hover:bg-gray-100"
                      onSelect={() => {
                        setDesignationId(d.designation_id);
                        setDesignationOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                           "mr-2 h-4 w-4",
                          designation_id === d.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {d.designation_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
         <Popover open={branchOpen} onOpenChange={setBranchOpen}>
                      <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {branch_id
                  ? `${branches.find((br) => br.branch_id === branch_id)?.branch_name}`
                  : "Select Branch"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[300px] overflow-auto">
              <Command >
                <CommandInput placeholder="Search accounts..." className="text-black" />
                <CommandEmpty >No branch found.</CommandEmpty>
                <CommandGroup>
                  {branches.map((br) => (
                    <CommandItem
                      key={br.branch_id}
                      className="hover:bg-gray-100"
                      onSelect={() => {
                        setBranchId(br.branch_id);
                        setBranchOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                           "mr-2 h-4 w-4",
                          branch_id === br.branch_id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {br.branch_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
         <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                      <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {company_id
                  ? `${companies.find((c) => c.company_id === company_id)?.company_name}`
                  : "Select Company"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[300px] overflow-auto">
              <Command >
                <CommandInput placeholder="Search accounts..." className="text-black" />
                <CommandEmpty >No company found.</CommandEmpty>
                <CommandGroup>
                  {companies.map((c) => (
                    <CommandItem
                      key={c.company_id}
                      className="hover:bg-gray-100"
                      onSelect={() => {
                        setCompanyId(c.company_id);
                        setCompanyOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                           "mr-2 h-4 w-4",
                          company_id === c.company_id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {c.company_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Region Popover */}
          <Popover open={regionOpen} onOpenChange={setRegionOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {region_id
                  ? `${regions.find((r) => r.region_id === region_id)?.region_name}`
                  : "Select Region"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[300px] overflow-auto">
              <Command >
                <CommandInput placeholder="Search accounts..." className="text-black" />
                <CommandEmpty >No region found.</CommandEmpty>
                <CommandGroup>
                  {regions.map((r) => (
                    <CommandItem
                      key={r.region_id}
                      className="hover:bg-gray-100"
                      onSelect={() => {
                        setRegionId(r.region_id);
                        setRegionOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                           "mr-2 h-4 w-4",
                          region_id === r.region_id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {r.region_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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

export default SalesPersons;




