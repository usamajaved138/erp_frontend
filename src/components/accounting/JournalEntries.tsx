import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileText, Check, X, Edit } from 'lucide-react';
import JournalEntryForm from '@/components/forms/JournalEntryForm';

interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: 'Draft' | 'Posted' | 'Reversed';
  createdBy: string;
}

const JournalEntries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      reference: 'JE-001',
      description: 'Sales Revenue Recognition',
      totalDebit: 2500.00,
      totalCredit: 2500.00,
      status: 'Posted',
      createdBy: 'John Doe'
    },
    {
      id: '2',
      date: '2024-01-14',
      reference: 'JE-002',
      description: 'Office Supplies Purchase',
      totalDebit: 150.00,
      totalCredit: 150.00,
      status: 'Posted',
      createdBy: 'Jane Smith'
    },
    {
      id: '3',
      date: '2024-01-13',
      reference: 'JE-003',
      description: 'Equipment Depreciation',
      totalDebit: 200.00,
      totalCredit: 200.00,
      status: 'Draft',
      createdBy: 'Mike Johnson'
    },
    {
      id: '4',
      date: '2024-01-12',
      reference: 'JE-004',
      description: 'Loan Interest Accrual',
      totalDebit: 75.00,
      totalCredit: 75.00,
      status: 'Posted',
      createdBy: 'Sarah Wilson'
    }
  ]);

  const filteredEntries = entries.filter(entry => 
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSaveEntry = (entryData: any) => {
    if (editingEntry) {
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id ? { ...entry, ...entryData } : entry
      ));
    } else {
      const newEntry = {
        ...entryData,
        id: Date.now().toString(),
        status: 'Draft' as const,
        createdBy: 'Current User',
        totalDebit: entryData.lines?.reduce((sum: number, line: any) => sum + (line.debit || 0), 0) || 0,
        totalCredit: entryData.lines?.reduce((sum: number, line: any) => sum + (line.credit || 0), 0) || 0
      };
      setEntries([newEntry, ...entries]);
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
                <TableHead>Description</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell className="font-mono">{entry.reference}</TableCell>
                  <TableCell className="font-medium">{entry.description}</TableCell>
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

export default JournalEntries;