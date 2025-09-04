import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ColorfulTabs, ColorfulTabsContent, ColorfulTabsList, ColorfulTabsTrigger } from '@/components/ui/colorful-tabs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DollarSign, ShoppingCart, TrendingUp, FileText, CreditCard, BarChart3 } from 'lucide-react';
import QuotationManagement from '@/components/sales/QuotationManagement';
import SalesOrders from '@/components/sales/SalesOrders';
import InvoiceManagement from '@/components/sales/InvoiceManagement';
import POSSystem from '@/components/sales/POSSystem';
import SalesReports from '@/components/sales/SalesReports';
import QuotationForm from '@/components/forms/QuotationForm';
import SalesOrderForm from '@/components/forms/SalesOrderForm';
import InvoiceForm from '@/components/forms/InvoiceForm';
import SalesPerson from '@/components/sales/SalesPerson';
import Customers from '@/components/sales/Customers';





const SalesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showSalesOrderForm, setShowSalesOrderForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPOSDialog, setShowPOSDialog] = useState(false);

  const overviewData = {
    totalSales: 203500,
    completedOrders: 45,
    pendingOrders: 12,
    activeQuotations: 8,
    outstandingInvoices: 15,
    posTransactions: 127
  };

   const handleSelect = (value: string) => {
    setActiveTab(value);
  };
  const handleQuickSale = () => {
    setShowPOSDialog(true);
  };

  const handleNewQuote = () => {
    setShowQuotationForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales & POS Management</h2>
        <div className="flex gap-2">
          <Button 
            className="bg-gradient-to-r from-green-500 to-green-600"
            onClick={handleQuickSale}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Sale
          </Button>
          <Button variant="outline" onClick={handleNewQuote}>
            <FileText className="h-4 w-4 mr-2" />
            New Quote
          </Button>
          
        </div>
      </div>

      <ColorfulTabs value={activeTab} onValueChange={setActiveTab}>
        <ColorfulTabsList className="grid w-full grid-cols-7">
          <ColorfulTabsTrigger value="overview">Overview</ColorfulTabsTrigger>
          <ColorfulTabsTrigger value="quotations">Quotations</ColorfulTabsTrigger>
          <ColorfulTabsTrigger value="orders">Sales Orders</ColorfulTabsTrigger>
          <ColorfulTabsTrigger value="invoices">Invoices</ColorfulTabsTrigger>
          <ColorfulTabsTrigger value="pos">POS System</ColorfulTabsTrigger>
          <ColorfulTabsTrigger value="reports">Reports</ColorfulTabsTrigger>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">More</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSelect("salesperson")}>
              Sales Persons
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelect("customer")}>
              Customers
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </ColorfulTabsList>

        <ColorfulTabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">${overviewData.totalSales.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">{overviewData.completedOrders}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{overviewData.pendingOrders} pending</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">POS Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold">{overviewData.posTransactions}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Today's transactions</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  className="h-20 flex-col gap-2" 
                  variant="outline"
                  onClick={() => setShowQuotationForm(true)}
                >
                  <FileText className="h-6 w-6" />
                  <span>New Quotation</span>
                </Button>
                <Button 
                  className="h-20 flex-col gap-2" 
                  variant="outline"
                  onClick={() => setShowSalesOrderForm(true)}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>Sales Order</span>
                </Button>
                <Button 
                  className="h-20 flex-col gap-2" 
                  variant="outline"
                  onClick={() => setShowInvoiceForm(true)}
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Create Invoice</span>
                </Button>
                <Button 
                  className="h-20 flex-col gap-2" 
                  variant="outline"
                  onClick={() => setActiveTab('reports')}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </ColorfulTabsContent>

        <ColorfulTabsContent value="quotations">
          <QuotationManagement />
        </ColorfulTabsContent>

        <ColorfulTabsContent value="orders">
          <SalesOrders />
        </ColorfulTabsContent>

        <ColorfulTabsContent value="invoices">
          <InvoiceManagement />
        </ColorfulTabsContent>

        <ColorfulTabsContent value="pos">
          <POSSystem />
        </ColorfulTabsContent>

        <ColorfulTabsContent value="reports">
          <SalesReports />
        </ColorfulTabsContent>
        <ColorfulTabsContent value="salesperson">
          <SalesPerson />
        </ColorfulTabsContent>
        <ColorfulTabsContent value="customer">
          <Customers />
        </ColorfulTabsContent>
      </ColorfulTabs>

      {/* Dialog Forms */}
      <Dialog open={showQuotationForm} onOpenChange={setShowQuotationForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Quotation</DialogTitle>
          </DialogHeader>
          <QuotationForm onClose={() => setShowQuotationForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSalesOrderForm} onOpenChange={setShowSalesOrderForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Sales Order</DialogTitle>
          </DialogHeader>
          <SalesOrderForm onClose={() => setShowSalesOrderForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm onClose={() => setShowInvoiceForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showPOSDialog} onOpenChange={setShowPOSDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Sale - POS System</DialogTitle>
          </DialogHeader>
          <POSSystem />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesModule;