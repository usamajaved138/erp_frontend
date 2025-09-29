import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, FileText, Settings, AlertTriangle, Lock } from 'lucide-react';
import UserManagement from '../security/UserManagement';
import RoleManagement from '../security/RoleManagement';
import AuditLogs from '../security/AuditLogs';
import AuthenticationSettings from '../security/AuthenticationSettings';
import SecurityAlerts from '../security/SecurityAlerts';

const SecurityModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const securityStats = {
    totalUsers: 156,
    activeUsers: 142,
    lockedUsers: 3,
    totalRoles: 8,
    activeAlerts: 5,
    criticalAlerts: 2,
    auditLogs: 1247,
    mfaEnabled: 89
  };

  const recentActivities = [
    { id: '1', action: 'User Login', user: 'john.doe', timestamp: '2024-01-15 10:30:00', status: 'Success' },
    { id: '2', action: 'Role Assignment', user: 'admin', timestamp: '2024-01-15 10:25:00', status: 'Success' },
    { id: '3', action: 'Failed Login', user: 'jane.smith', timestamp: '2024-01-15 10:20:00', status: 'Failed' },
    { id: '4', action: 'Password Change', user: 'mike.wilson', timestamp: '2024-01-15 10:15:00', status: 'Success' },
    { id: '5', action: 'Account Locked', user: 'system', timestamp: '2024-01-15 10:10:00', status: 'Warning' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Access Control & Security</h1>
        <Badge variant="outline" className="px-3 py-1">
          <Shield className="w-4 h-4 mr-1" />
          Security Module
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        {/*  <TabsTrigger value="auth">Authentication</TabsTrigger> */}
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {securityStats.activeUsers} active, {securityStats.lockedUsers} locked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Roles</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.totalRoles}</div>
                <p className="text-xs text-muted-foreground">
                  Including system and custom roles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{securityStats.activeAlerts}</div>
                <p className="text-xs text-muted-foreground">
                  {securityStats.criticalAlerts} critical alerts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MFA Enabled</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.mfaEnabled}%</div>
                <p className="text-xs text-muted-foreground">
                  Of active users have MFA enabled
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Security Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-gray-500">
                          User: {activity.user} • {activity.timestamp}
                        </div>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Security Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Password Policy</div>
                      <div className="text-sm text-gray-500">Minimum 8 characters, complexity required</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Multi-Factor Authentication</div>
                      <div className="text-sm text-gray-500">TOTP, SMS, Email methods available</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Session Timeout</div>
                      <div className="text-sm text-gray-500">30 minutes of inactivity</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Configured</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Audit Logging</div>
                      <div className="text-sm text-gray-500">{securityStats.auditLogs} events logged</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="auth">
          <AuthenticationSettings />
        </TabsContent>

        <TabsContent value="alerts">
          <SecurityAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityModule;