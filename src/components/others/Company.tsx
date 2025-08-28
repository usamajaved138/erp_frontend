import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";
import { getCompanies, addCompany, updateCompany, deleteCompany } from "@/api/companyApi";

// Company type
export interface Company {
  company_id: number;
  company_name: string;
  registration_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

const CompanyComponent: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  // Load companies
  useEffect(() => {
    loadCompanies();
    
  }, []);
  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error loading companies:", error);
    }
  };

  // Search across all columns
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return companies.filter((c) =>
      [c.company_name, c.registration_number, c.address, c.phone, c.email]
        .filter(Boolean)
        .some((val) => val!.toLowerCase().includes(q))
    );
  }, [companies, search]);

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (c: Company) => {
    setEditing(c);
    setOpen(true);
  };

  const handleDelete = async (company_id: number) => {
    if (confirm("Delete this company?")) {
      try {
        await deleteCompany(company_id);
        setCompanies((prev) => prev.filter((c) => c.company_id !== company_id));
      } catch (error) {
        console.error("Error deleting company:", error);
        alert("Failed to delete company.");
      }
    }
  };

  const handleSave = async (data: Omit<Company, "id" | "created_at" | "updated_at">) => {
    try {
      if (editing) {
        await updateCompany(
          editing.company_id,
          data.company_name,
          data.registration_number,
          data.address,
          data.phone,
          data.email
        );
        setCompanies((prev) =>
          prev.map((c) =>
            c.company_id === editing.company_id ? { ...c, ...data, updated_at: new Date().toISOString() } : c
          )
        );
      } else {
        const res = await addCompany(
          data.company_name,
          data.registration_number,
          data.address,
          data.phone,
          data.email
        );
        if (res?.company_id) {
          setCompanies((prev) => [
            ...prev,
            { ...data, company_id: res.company_id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          ]);
        }
      }
      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Error saving company:", error);
      alert("Failed to save company.");
    }
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company
            </CardTitle>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Company
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Reg. No.</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.company_id}>
                  <TableCell>{c.company_name}</TableCell>
                  <TableCell>{c.registration_number || "-"}</TableCell>
                  <TableCell>{c.address || "-"}</TableCell>
                  <TableCell>{c.phone || "-"}</TableCell>
                  <TableCell>{c.email || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(c.company_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                    No companies found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CompanyForm open={open} onOpenChange={setOpen} initial={editing ?? undefined} onSave={handleSave} />
    </>
  );
};

const CompanyForm: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Company;
  onSave: (data: Omit<Company, "id" | "created_at" | "updated_at">) => void;
}> = ({ open, onOpenChange, initial, onSave }) => {
  const [name, setName] = useState("");
  const [registration_number, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Sync form state with "initial" prop
  useEffect(() => {
    setName(initial?.company_name || "");
    setRegistrationNumber(initial?.registration_number || "");
    setAddress(initial?.address || "");
    setPhone(initial?.phone || "");
    setEmail(initial?.email || "");
  }, [initial]);

  const resetIfClosed = (isOpen: boolean) => {
    if (!isOpen) {
      setName("");
      setRegistrationNumber("");
      setAddress("");
      setPhone("");
      setEmail("");
    }
    onOpenChange(isOpen);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }
    onSave({
      company_name: name, registration_number, address, phone, email,
      company_id: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={resetIfClosed}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Company" : "Add Company"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="registration_number">Registration Number</Label>
            <Input
              id="registration_number"
              value={registration_number}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => resetIfClosed(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600">
              {initial ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyComponent;
