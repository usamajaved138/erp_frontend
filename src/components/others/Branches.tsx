import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { getBranches, addBranch, updateBranch, deleteBranch } from "@/api/branchApi";

interface Branch {
  branch_id: number;
  branch_name: string;
  address: string;
  city: string;
}

const Branches: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Fetch branches on load
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data);
    } catch (error) {
      console.error("Error loading branches", error);
    }
  };

  const handleAddBranch = () => {
    setEditingBranch(null);
    setShowForm(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleSaveBranch = async (branchData: Omit<Branch, "branch_id">) => {
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.branch_id, branchData.branch_name, branchData.address, branchData.city);
      } else {
        await addBranch(branchData.branch_name, branchData.address, branchData.city);
      }
      setShowForm(false);
      loadBranches();
    } catch (error) {
      console.error("Error saving branch", error);
    }
  };

  const handleDeleteBranch = async (branchId: number) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      try {
        await deleteBranch(branchId);
        loadBranches();
      } catch (error) {
        console.error("Error deleting branch", error);
      }
    }
  };

  const filteredBranches = branches.filter((branch) =>
    branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Branches</CardTitle>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600" onClick={handleAddBranch}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search branches..."
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
                <TableHead>Branch Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.map((branch) => (
                <TableRow key={branch.branch_id}>
                  <TableCell className="font-medium">{branch.branch_name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.city}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditBranch(branch)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteBranch(branch.branch_id)}>
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
        <BranchForm branch={editingBranch} onClose={() => setShowForm(false)} onSave={handleSaveBranch} />
      )}
    </>
  );
};

const BranchForm: React.FC<{
  branch: Branch | null;
  onClose: () => void;
  onSave: (data: Omit<Branch, "branch_id">) => void;
}> = ({ branch, onClose, onSave }) => {
  const [branch_name, setBranchName] = useState(branch?.branch_name || "");
  const [address, setAddress] = useState(branch?.address || "");
  const [city, setCity] = useState(branch?.city || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ branch_name, address, city });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{branch ? "Edit Branch" : "Add Branch"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Branch Name" value={branch_name} onChange={(e) => setBranchName(e.target.value)} />
          <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Branches;
