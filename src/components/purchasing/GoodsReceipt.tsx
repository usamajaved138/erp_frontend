import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, AlertTriangle, CheckCircle } from 'lucide-react';

const GoodsReceipt: React.FC = () => {
  const [grns, setGrns] = useState([
    {
      id: 'GRN001',
      date: '2024-01-20',
      poNumber: 'PO001',
      vendor: 'ABC Suppliers Ltd',
      items: [
        { itemCode: 'ITM001', description: 'Steel Rods', orderedQty: 100, receivedQty: 80, acceptedQty: 80, rejectedQty: 0, batchNo: 'B001' }
      ],
      status: 'Completed',
      receivedBy: 'Store Manager',
      discrepancy: false
    }
  ]);

  const [pendingPOs] = useState([
    { id: 'PO001', vendor: 'ABC Suppliers Ltd', items: [{ itemCode: 'ITM001', description: 'Steel Rods', pendingQty: 20 }] },
    { id: 'PO002', vendor: 'XYZ Trading Co', items: [{ itemCode: 'ITM002', description: 'Aluminum Sheets', pendingQty: 50 }] }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState('');
  const [formData, setFormData] = useState({
    poNumber: '',
    receivedBy: '',
    items: []
  });

  const handlePOSelect = (poId: string) => {
    const po = pendingPOs.find(p => p.id === poId);
    if (po) {
      setSelectedPO(poId);
      setFormData({
        poNumber: poId,
        receivedBy: 'Current User',
        items: po.items.map(item => ({
          ...item,
          receivedQty: '',
          acceptedQty: '',
          rejectedQty: '',
          batchNo: '',
          expiryDate: '',
          remarks: ''
        }))
      });
    }
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = formData.items.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value };
        if (field === 'receivedQty') {
          updated.acceptedQty = value;
          updated.rejectedQty = '0';
        }
        return updated;
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const po = pendingPOs.find(p => p.id === selectedPO);
    const hasDiscrepancy = formData.items.some(item => 
      Number(item.receivedQty) !== item.pendingQty || Number(item.rejectedQty) > 0
    );

    const newGRN = {
      id: `GRN${String(grns.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      poNumber: formData.poNumber,
      vendor: po?.vendor || '',
      items: formData.items.map(item => ({
        ...item,
        orderedQty: item.pendingQty,
        receivedQty: Number(item.receivedQty),
        acceptedQty: Number(item.acceptedQty),
        rejectedQty: Number(item.rejectedQty)
      })),
      status: 'Completed',
      receivedBy: formData.receivedBy,
      discrepancy: hasDiscrepancy
    };

    setGrns([...grns, newGRN]);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      poNumber: '',
      receivedBy: '',
      items: []
    });
    setSelectedPO('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Goods Receipt Note (GRN)</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create GRN
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Create Goods Receipt Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Purchase Order</Label>
                  <Select value={selectedPO} onValueChange={handlePOSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingPOs.map(po => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.id} - {po.vendor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Received By</Label>
                  <Input
                    value={formData.receivedBy}
                    onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                    required
                  />
                </div>
              </div>

              {formData.items.length > 0 && (
                <div>
                  <Label>Items Received</Label>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Ordered Qty</TableHead>
                          <TableHead>Received Qty</TableHead>
                          <TableHead>Accepted Qty</TableHead>
                          <TableHead>Rejected Qty</TableHead>
                          <TableHead>Batch No</TableHead>
                          <TableHead>Expiry Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.itemCode}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.pendingQty}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.receivedQty}
                                onChange={(e) => updateItem(index, 'receivedQty', e.target.value)}
                                className="w-20"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.acceptedQty}
                                onChange={(e) => updateItem(index, 'acceptedQty', e.target.value)}
                                className="w-20"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.rejectedQty}
                                onChange={(e) => updateItem(index, 'rejectedQty', e.target.value)}
                                className="w-20"
                                min="0"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.batchNo}
                                onChange={(e) => updateItem(index, 'batchNo', e.target.value)}
                                className="w-24"
                                placeholder="Batch"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={item.expiryDate}
                                onChange={(e) => updateItem(index, 'expiryDate', e.target.value)}
                                className="w-32"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!selectedPO}>
                  Create GRN
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-gray-600">Total GRNs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">22</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-gray-600">Discrepancies</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-gray-600">Pending POs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GRN History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GRN ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received By</TableHead>
                <TableHead>Discrepancy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grns.map((grn) => (
                <TableRow key={grn.id}>
                  <TableCell className="font-medium">{grn.id}</TableCell>
                  <TableCell>{grn.date}</TableCell>
                  <TableCell>{grn.poNumber}</TableCell>
                  <TableCell>{grn.vendor}</TableCell>
                  <TableCell>{grn.items.length} item(s)</TableCell>
                  <TableCell>
                    <Badge variant={grn.status === 'Completed' ? 'default' : 'secondary'}>
                      {grn.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{grn.receivedBy}</TableCell>
                  <TableCell>
                    {grn.discrepancy ? (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        No
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoodsReceipt;