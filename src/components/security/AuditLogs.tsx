import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Search, Shield, User, Database } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  module: string;
  objectType: string;
  objectId: string;
  ipAddress: string;
  details: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Success' | 'Failed' | 'Warning';
}

const AuditLogs: React.FC = () => {
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15 10:30:15',
      userId: '1',
      username: 'admin',
      action: 'LOGIN',
      module: 'Authentication',
      objectType: 'Session',
      objectId: 'sess_123',
      ipAddress: '192.168.1.100',
      details: 'Successful login with MFA',
      severity: 'Low',
      status: 'Success'
    },
    {
      id: '2',
      timestamp: '2024-01-15 10:25:30',
      userId: '2',
      username: 'john.doe',
      action: 'CREATE',
      module: 'Sales',
      objectType: 'Invoice',
      objectId: 'INV-2024-001',
      ipAddress: '192.168.1.101',
      details: 'Created new invoice for customer ABC Corp',
      severity: 'Medium',
      status: 'Success'
    },
    {
      id: '3',
      timestamp: '2024-01-15 10:20:45',
      userId: '3',
      username: 'jane.smith',
      action: 'FAILED_LOGIN',
      module: 'Authentication',
      objectType: 'Session',
      objectId: 'sess_124',
      ipAddress: '203.0.113.1',
      details: 'Failed login attempt - invalid password',
      severity: 'High',
      status: 'Failed'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const modules = ['Authentication', 'Sales', 'Accounting', 'HR', 'Inventory', 'CRM', 'Purchasing', 'Reports', 'Security'];
  const actions = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'APPROVE', 'ROLE_ASSIGN', 'FAILED_LOGIN'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    
    return matchesSearch && matchesModule && matchesAction && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
      case 'LOGOUT':
      case 'FAILED_LOGIN':
        return <User className="w-4 h-4" />;
      case 'ROLE_ASSIGN':
        return <Shield className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Audit Trail ({filteredLogs.length} records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label>Module</Label>
                <Select value={filterModule} onValueChange={setFilterModule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {modules.map(module => (
                      <SelectItem key={module} value={module}>{module}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Action</Label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {actions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severity</Label>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    {severities.map(severity => (
                      <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Object</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{log.username}</div>
                            <div className="text-xs text-gray-500">ID: {log.userId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="font-medium">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{log.objectType}</div>
                          <div className="text-gray-500">{log.objectId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-gray-600 truncate" title={log.details}>
                          {log.details}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;