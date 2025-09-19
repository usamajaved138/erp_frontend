import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileText, Check, X, Edit, Trash2, ChevronsUpDown } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { getJournalEntries,createJournalEntry ,updateJournalEntry} from '@/api/journalEntryApi';
import { getAccounts } from "@/api/getAccountsApi";

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
import DatePicker from 'react-datepicker';
import { getVouchers } from '@/api/vouchersApi';
import { toast } from '@/hooks/use-toast';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface JournalEntry {
  journal_entry_id:number;
  voucher_id: number;
  voucher_name:string;
  entry_date: Date;
  reference_number: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
 
  createdBy: string;
}

const JournalEntries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  
   const loadJournalEntries = async () => {
      try {
        const data = await getJournalEntries();
        setEntries(data);
        console.log(data);
      } catch (error) {
        console.error("Error loading Journal Enteries", error);
      }
    };
    useEffect(() => {
      loadJournalEntries();
    }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Posted': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Reversed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Posted': return <Check className="h-4 w-4" />;
      case 'Draft': return <FileText className="h-4 w-4" />;
      case 'Reversed': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

 const handleSaveEntry = async (payload: any) => {
  try {
    if (editingEntry) {
      await updateJournalEntry(
        editingEntry.journal_entry_id,
        payload.voucher_id,
        payload.entry_date,
        payload.description,
        1, // updated_by
        payload.lines
      );
      toast({ title: "Updated", description: "Journal Entry updated successfully!" });
    } else {
      await createJournalEntry(
        payload.voucher_id,
        payload.entry_date,
        payload.description,
        payload.created_by,
        payload.lines
      );
      toast({ title: "Created", description: "Journal Entry created successfully!" });
    }
    setShowForm(false);
    loadJournalEntries();
  } catch (err) {
    console.error("Save Journal Entry failed", err);
  }
};

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Journal Entries</CardTitle>
            <Button 
              className="bg-gradient-to-r from-green-500 to-green-600"
              onClick={handleNewEntry}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search journal entries..."
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
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Voucher Name</TableHead>
                <TableHead>Description</TableHead>
                {/*
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.journal_entry_id}>
                 <TableCell>{entry.entry_date ? new Date(entry.entry_date).toLocaleDateString() : ''}</TableCell>
                  <TableCell className="font-mono">{entry.reference_number}</TableCell>
                  <TableCell  className="font-medium">{entry.voucher_name}</TableCell>
                  <TableCell className="font-medium">{entry.description}</TableCell>
                   {/*
                  <TableCell className="font-mono text-red-600">
                    ${entry.totalDebit.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-green-600">
                    ${entry.totalCredit.toLocaleString()}
                  </TableCell>
                 
                  <TableCell>
                    <Badge className={getStatusColor(entry.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(entry.status)}
                        {entry.status}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell>{entry.createdBy}</TableCell>
                  */}
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditEntry(entry)}
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

      {showForm && (
        <JournalEntryForm
          entry={editingEntry}
          onClose={() => setShowForm(false)}
          onSave={handleSaveEntry}
        />
      )}
    </>
  );
};


interface JournalLine {
  account_id: number;
  debit: number;
  credit: number;
  description: string;
}

interface JournalEntryFormProps {
  onClose: () => void;
  onSave: (entry: any) => void;
  entry?: any;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onClose, onSave, entry }) => {
  const [formData, setFormData] = useState({
    voucher_id: entry?.voucher_id || 0,
    date: entry?.date || new Date().toISOString().split('T')[0],
    description: entry?.description || '',
    lines: entry?.lines || [{ account_id: '', description: '', debit: 0, credit: 0 }]
    
  });
  const [showBalanceError, setShowBalanceError] = useState(false);
 const [accountOpen, setAccountOpen] = useState<number | null>(null);
  
   const [accounts, setAccounts] = useState([]);
   const [vouchers, setVouchers] = useState([]);
  useEffect(() => {
      const fetchData = async () => {
        try {
         
          const accountsData = await getAccounts(); 
          setAccounts(accountsData);
          const vouchersData = await getVouchers(); 
          setVouchers(vouchersData);
          console.log(accountsData);
          if (entry) {
          
          }
        } catch (err) {
          console.error("Error loading categories", err);
        }
      };
      fetchData();
    }, [entry]);

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { account_id: '', description: '', debit: 0, credit: 0 }]
    });
  };

  const removeLine = (index: number) => {
    const newLines = formData.lines.filter((_, i) => i !== index);
    setFormData({ ...formData, lines: newLines });
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...formData.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setFormData({ ...formData, lines: newLines });
  };

  const totalDebit = formData.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = formData.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      setShowBalanceError(true);
      return;
    }
    setShowBalanceError(false);

    // Construct the payload to match your database function's expected JSON format
    const payload = {
      operation:  entry ? 3 : 2,
      voucher_id: formData.voucher_id ? parseInt(formData.voucher_id, 10) : null,
      entry_date: formData.date,
      description: formData.description,
      created_by: 1, // You'll need to replace this with the actual user ID
      lines: formData.lines.map(line => ({
        account_id: parseInt(line.account_id),
        debit: parseFloat(line.debit),
        credit: parseFloat(line.credit),
        description: line.description
      }))
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{entry ? 'Edit Journal Entry' : 'New Journal Entry'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            <div>
               <Label htmlFor="voucherType">Voucher Type</Label>
                    <select
                   
                    value={formData.voucher_id ? String(formData.voucher_id) : ''}
                    onChange={(e) => setFormData({ ...formData, voucher_id: parseInt(e.target.value) })}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 
                    focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>Select a voucher type</option>
                    {vouchers.map(v => (
                      <option key={v.voucher_id} value={String(v.voucher_id)}>
                        {v.voucher_name}
                      </option>
                    ))}
                  </select>
                    </div>


              <div>
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value="Auto-generated by system"
                  readOnly
                  placeholder="JE-001"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="h-5"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Journal Lines</h3>
                
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.lines.map((line, index) => (
                    <TableRow key={index}>
                     <TableCell>
  <Popover
    open={accountOpen === index}
    onOpenChange={(open) => setAccountOpen(open ? index : null)}
  >
    <PopoverTrigger asChild>
      <Button variant="outline" role="combobox" className="w-full max-w-[300px] justify-between truncate">
        {line.account_id
          ? `${accounts.find((a) => a.account_id === line.account_id)?.account_name} 
             (${accounts.find((a) => a.account_id === line.account_id)?.account_code})`
          : "Select Account"}
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="max-h-[300px] overflow-auto">
      <Command>
        <CommandInput placeholder="Search accounts..." className="text-black" />
        <CommandEmpty>No account found.</CommandEmpty>
        <CommandGroup>
          {accounts.map((a) => (
            <CommandItem
              key={a.account_id}
              className="hover:bg-gray-100"
              onSelect={() => {
                updateLine(index, 'account_id', a.account_id); // ✅ update this line only
                setAccountOpen(null); // close after selection
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  line.account_id === a.account_id ? "opacity-100" : "opacity-0"
                )}
              />
              {`${a.account_code}-${a.account_name}`}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>
</TableCell>
                      <TableCell>
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(index, 'description', e.target.value)}
                          placeholder=" description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={line.debit || ''}
                          onChange={(e) => updateLine(index, 'debit', parseFloat(e.target.value) || 0)}
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={line.credit || ''}
                          onChange={(e) => updateLine(index, 'credit', parseFloat(e.target.value) || 0)}
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        {formData.lines.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLine(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                     <Button type="button" onClick={addLine} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line
                </Button>
              <div className="mt-4 p-4 rounded" style={{ backgroundColor: '#f0f4f8' }}>
                <div className="flex justify-between items-center">
                  <span>Total Debit: ${totalDebit.toFixed(2)}</span>
                  <span>Total Credit: ${totalCredit.toFixed(2)}</span>
                  <span className={isBalanced ? 'text-green-600' : 'text-red-600'}>
                    {isBalanced ? '✓ Balanced' : '✗ Not Balanced'}
                  </span>
                </div>
                {showBalanceError && (
                  <div className="mt-2 text-sm text-red-500">
                    Journal entry must be balanced (total debits must equal total credits).
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={!isBalanced}>
                Save Journal Entry
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalEntries;