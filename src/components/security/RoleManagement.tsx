import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Plus, Edit, Trash2, Users } from 'lucide-react';

interface Permission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  export: boolean;
  approve: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  isSystem: boolean;
  hierarchy: number;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access',
      permissions: [
        { module: 'Sales', read: true, write: true, delete: true, export: true, approve: true },
        { module: 'Accounting', read: true, write: true, delete: true, export: true, approve: true },
        { module: 'HR', read: true, write: true, delete: true, export: true, approve: true },
        { module: 'Inventory', read: true, write: true, delete: true, export: true, approve: true },
        { module: 'CRM', read: true, write: true, delete: true, export: true, approve: true },
        { module: 'Purchasing', read: true, write: true, delete: true, export: true, approve: true },
        { module: 'Reports', read: true, write: true, delete: true, export: true, approve: true }
      ],
      userCount: 3,
      isSystem: true,
      hierarchy: 1
    },
    {
      id: '2',
      name: 'Sales Manager',
      description: 'Sales module management',
      permissions: [
        { module: 'Sales', read: true, write: true, delete: true, export: true, approve: true },
        { module: 'CRM', read: true, write: true, delete: false, export: true, approve: false },
        { module: 'Reports', read: true, write: false, delete: false, export: true, approve: false }
      ],
      userCount: 5,
      isSystem: false,
      hierarchy: 2
    },
    {
      id: '3',
      name: 'Sales Rep',
      description: 'Sales operations',
      permissions: [
        { module: 'Sales', read: true, write: true, delete: false, export: false, approve: false },
        { module: 'CRM', read: true, write: true, delete: false, export: false, approve: false }
      ],
      userCount: 12,
      isSystem: false,
      hierarchy: 3
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const modules = ['Sales', 'Accounting', 'HR', 'Inventory', 'CRM', 'Purchasing', 'Reports', 'Security'];
  const permissionTypes = ['read', 'write', 'delete', 'export', 'approve'];

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionCount = (role: Role) => {
    return role.permissions.reduce((count, perm) => {
      return count + Object.values(perm).filter(val => typeof val === 'boolean' && val).length;
    }, 0);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      alert('System roles cannot be deleted');
      return;
    }
    setRoles(roles.filter(r => r.id !== roleId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input id="roleName" placeholder="Enter role name" />
                </div>
                <div>
                  <Label htmlFor="hierarchy">Hierarchy Level</Label>
                  <Input id="hierarchy" type="number" placeholder="1-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Enter role description" />
              </div>
              
              <div>
                <Label>Permissions</Label>
                <div className="mt-2 border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead className="text-center">Read</TableHead>
                        <TableHead className="text-center">Write</TableHead>
                        <TableHead className="text-center">Delete</TableHead>
                        <TableHead className="text-center">Export</TableHead>
                        <TableHead className="text-center">Approve</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map(module => (
                        <TableRow key={module}>
                          <TableCell className="font-medium">{module}</TableCell>
                          {permissionTypes.map(permission => (
                            <TableCell key={permission} className="text-center">
                              <Checkbox />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button>Create Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Roles ({filteredRoles.length})
            </CardTitle>
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Role List</TabsTrigger>
              <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Hierarchy</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-gray-500">{role.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Level {role.hierarchy}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{role.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getPermissionCount(role)} permissions
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={role.isSystem ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {role.isSystem ? 'System' : 'Custom'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!role.isSystem && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="matrix">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      {modules.map(module => (
                        <TableHead key={module} className="text-center">{module}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        {modules.map(module => {
                          const permission = role.permissions.find(p => p.module === module);
                          const permCount = permission ? 
                            Object.values(permission).filter(val => typeof val === 'boolean' && val).length : 0;
                          return (
                            <TableCell key={module} className="text-center">
                              {permission ? (
                                <Badge variant={permCount > 3 ? 'default' : permCount > 1 ? 'secondary' : 'outline'}>
                                  {permCount}/5
                                </Badge>
                              ) : (
                                <Badge variant="outline">0/5</Badge>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;