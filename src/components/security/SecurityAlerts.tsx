import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, Settings, Eye, Lock } from 'lucide-react';

interface SecurityAlert {
  id: string;
  type: 'Failed Login' | 'Suspicious Location' | 'New Device';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  userId: string;
  username: string;
  description: string;
  ipAddress: string;
  location: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
}

interface AlertRule {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  threshold: number;
  timeWindow: number;
  action: string;
}

const SecurityAlerts: React.FC = () => {
  const [alerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'Failed Login',
      severity: 'High',
      timestamp: '2024-01-15 10:45:30',
      userId: '3',
      username: 'jane.smith',
      description: '5 consecutive failed login attempts',
      ipAddress: '203.0.113.1',
      location: 'Unknown Location',
      status: 'Active'
    },
    {
      id: '2',
      type: 'Suspicious Location',
      severity: 'Medium',
      timestamp: '2024-01-15 09:30:15',
      userId: '2',
      username: 'john.doe',
      description: 'Login from new geographic location',
      ipAddress: '198.51.100.1',
      location: 'New York, US',
      status: 'Acknowledged'
    },
    {
      id: '3',
      type: 'New Device',
      severity: 'Low',
      timestamp: '2024-01-15 08:15:45',
      userId: '4',
      username: 'mike.wilson',
      description: 'Login from unrecognized device',
      ipAddress: '192.168.1.150',
      location: 'Office Network',
      status: 'Resolved'
    }
  ]);

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'Failed Login Attempts',
      type: 'Failed Login',
      enabled: true,
      threshold: 5,
      timeWindow: 15,
      action: 'Lock Account'
    },
    {
      id: '2',
      name: 'Suspicious Location',
      type: 'Location',
      enabled: true,
      threshold: 1,
      timeWindow: 60,
      action: 'Notify User'
    },
    {
      id: '3',
      name: 'New Device Detection',
      type: 'Device',
      enabled: true,
      threshold: 1,
      timeWindow: 1,
      action: 'Require Verification'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Active', 'Acknowledged', 'Resolved'];

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
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
      case 'Active': return 'bg-red-100 text-red-800';
      case 'Acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Failed Login': return <Lock className="w-4 h-4" />;
      case 'Suspicious Location': return <Eye className="w-4 h-4" />;
      case 'New Device': return <Shield className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const toggleAlertRule = (ruleId: string) => {
    setAlertRules(alertRules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const activeAlertsCount = alerts.filter(alert => alert.status === 'Active').length;
  const criticalAlertsCount = alerts.filter(alert => alert.severity === 'Critical').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security Alerts</h2>
        <div className="flex gap-2">
          <Badge variant="destructive" className="px-3 py-1">
            {activeAlertsCount} Active
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {criticalAlertsCount} Critical
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Security Alerts ({filteredAlerts.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      {severities.map(severity => (
                        <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(alert.type)}
                          <div>
                            <div className="font-medium">{alert.type}</div>
                            <div className="text-sm text-gray-500">{alert.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{alert.username}</div>
                          <div className="text-sm text-gray-500">ID: {alert.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{alert.location}</div>
                          <div className="text-xs text-gray-500">{alert.ipAddress}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {alert.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Alert Rules Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Time Window</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Toggle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.type}</TableCell>
                      <TableCell>{rule.threshold}</TableCell>
                      <TableCell>{rule.timeWindow} min</TableCell>
                      <TableCell>{rule.action}</TableCell>
                      <TableCell>
                        <Badge className={rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleAlertRule(rule.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityAlerts;