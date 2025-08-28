import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Clock, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import InvoiceForm from '@/components/forms/InvoiceForm';

interface ARInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: 'Paid' | 'Overdue' | 'Pending';
  daysPastDue: number;
}

const AccountsReceivable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<ARInvoice | null>(null);
  const [invoices, setInvoices] = useState<ARInvoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-001',
      customer: 'ABC Corp',
      date: '2024-01-01',
      dueDate: '2024-01-31',
      amount: 5000.00,
      paid: 5000.00,
      balance: 0.00,
      status: 'Paid',
      daysPastDue: 0
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      customer: 'XYZ Ltd',
      date: '2024-01-05',
      dueDate: '2024-02-04',
      amount: 3200.00,
      paid: 0.00,
      balance: 3200.00,
      status: 'Pending',
      daysPastDue: 0
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      customer: 'Tech Solutions',
      date: '2023-12-15',
      dueDate: '2024-01-14',
      amount: 1800.00,
      paid: 800.00,
      balance: 1000.00,
      status: 'Overdue',
      daysPastDue: 15
    },
    {
      id: '4',
      invoiceNumber: 'INV-004',
      customer: 'Global Industries',
      date: '2024-01-10',
      dueDate: '2024-02-09',
      amount: 2750.00,
      paid: 1000.00,
      balance: 1750.00,
      status: 'Pending',
      daysPastDue: 0
    }
  ]);

  const filteredInvoices = invoices.filter(invoice => 
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.balance, 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: ARInvoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleSaveInvoice = (invoiceData: any) => {
    if (editingInvoice) {
      setInvoices(invoices.map(inv => 
        inv.id === editingInvoice.id ? { ...inv, ...invoiceData } : inv
      ));
    } else {
      const newInvoice = {
        ...invoiceData,
        id: Date.now().toString(),
        paid: 0,
        balance: invoiceData.total || invoiceData.amount || 0,
        status: 'Pending' as const,
        daysPastDue: 0,
        amount: invoiceData.total || invoiceData.amount || 0
      };
      setInvoices([newInvoice, ...invoices]);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${totalOutstanding.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overdue Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${overdueAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Invoiced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalInvoiced.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Accounts Receivable</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline">Aging Report</Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                  onClick={handleNewInvoice}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
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
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Days Past Due</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="font-medium">{invoice.customer}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell className="font-mono">${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-green-600">
                      ${invoice.paid.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono font-bold">
                      ${invoice.balance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className={invoice.daysPastDue > 0 ? 'text-red-600 font-bold' : ''}>
                      {invoice.daysPastDue > 0 ? invoice.daysPastDue : '-'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <InvoiceForm
          invoice={editingInvoice}
          onClose={() => setShowForm(false)}
          onSave={handleSaveInvoice}
        />
      )}
    </>
  );
};

export default AccountsReceivable;