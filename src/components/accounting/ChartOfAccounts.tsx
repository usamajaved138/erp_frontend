import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { FileText, BadgePercent, Tags, Edit } from 'lucide-react';
import { getAccounts, addAccount, updateAccount } from '@/api/accountsApi';
import { toast } from '@/hooks/use-toast';

interface Account {
  account_id: number;
  account_code: string;
  account_name: string;
  account_type: string;
  parent_account_id: number | null;
  level_no: number;
  children?: Account[];
}

// Recursive component for rendering the tree structure
const TreeItem: React.FC<{
  account: Account;
  handleAddAccount: (parentId: number) => void;
  handleEditAccount: (account: Account) => void;
  getTypeColor: (type: string) => string;
}> = ({ account, handleAddAccount, handleEditAccount, getTypeColor }) => {
 const [isExpanded, setIsExpanded] = useState(account.level_no === 1);
  const hasChildren = account.children && account.children.length > 0;

  return (
  <li>
  <div className="flex items-center justify-items-center border-b hover:bg-gray-50 px-2 py-2 text-sm"
  style={{ paddingLeft: `${account.level_no * 20}px` }}
  >
    
    {/* Expand/Collapse Button or Spacer */}
    <div className="w-[24px] flex justify-center items-center">
      {hasChildren ? (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-900 focus:outline-none cursor-pointer"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▼' : '►'}
        </button>
      ) : (
        <div className="w-[16px]" />
      )}
    </div>

    {/* Account Code */}
    <div className="w-[100px] font-mono">{account.account_code}</div>

    {/* Account Name (flex-1) with INDENTATION */}
    <div className="flex-1">
      <div style={{ paddingLeft: `${account.level_no * 20}px` }}>
        <button
          onClick={() => handleAddAccount(account.account_id)}
          className="text-blue-600 hover:underline text-left w-full focus:outline-none"
        >
          {account.account_name}
        </button>
      </div>
    </div>

    {/* Account Type Badge */}
    <div className=" flex-1 justify-items-center space-x-8">
      <Badge className={`${getTypeColor(account.account_type)}`}>
        {account.account_type}
      </Badge>
    

    {/* Edit Button */}
   
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditAccount(account)}
        aria-label={`Edit ${account.account_name}`}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  </div>

  {/* Recursive children if expanded */}
  {isExpanded && hasChildren && (
    <ul className="space-y-2">
      {account.children.map((child) => (
        <TreeItem
          key={child.account_id}
          account={child}
          handleAddAccount={handleAddAccount}
          handleEditAccount={handleEditAccount}
          getTypeColor={getTypeColor}
        />
      ))}
    </ul>
  )}
</li>
  );
};


// Form component for adding/editing accounts
const AccountForm: React.FC<{
  accounts: Account[];
  account: Account | null;
  parentId?: number | null;
  onClose: () => void;
  onSave: (data: {
    account_name: string;
    account_type: string;
    parent_account_id: number | null;
  }) => void;
}> = ({ accounts, account, parentId = null, onClose, onSave }) => {
  const [account_name, setAccountName] = useState(account?.account_name || '');
  const [account_type, setAccountType] = useState(account?.account_type || '');
  const [parent_account_id, setParentAccountId] = useState<number | null>(
    account?.parent_account_id ?? parentId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalAccountType = account_type;
    if (parent_account_id !== null) {
      const parent = accounts.find((a) => a.account_id === parent_account_id);
      if (parent) {
        finalAccountType = parent.account_type;
      }
    }

    onSave({
      account_name,
      account_type: finalAccountType,
      parent_account_id,
    });
  };

  const isTopLevel = parent_account_id === null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          {account ? 'Edit Account' : 'Add Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isTopLevel && (
            <select
              value={account_type}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Account Type</option>
              <option value="ASSET">Asset</option>
              <option value="LIABILITY">Liability</option>
              <option value="EQUITY">Equity</option>
              <option value="REVENUE">Revenue</option>
              <option value="EXPENSE">Expense</option>
            </select>
          )}

          <Input
            value={account_name}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Account Name"
            required
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
            >
              Save
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Chart of Accounts component
const ChartOfAccounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [parentAccountIdForForm, setParentAccountIdForForm] =
    useState<number | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [treeAccounts, setTreeAccounts] = useState<Account[]>([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const buildTree = (
    accounts: Account[],
    parentId: number | null = null,
    level = 0
  ): Account[] => {
    return accounts
      .filter((account) => {
        // Treat null, undefined, or 0 as top-level parent
        if (parentId === null) {
          return (
            account.parent_account_id === null ||
            account.parent_account_id === undefined ||
            account.parent_account_id === 0
          );
        }
        return account.parent_account_id === parentId;
      })
      .map((account) => ({
        ...account,
        level_no: level,
        children: buildTree(accounts, account.account_id, level + 1),
      }));
  };

  const loadAccounts = async () => {
    try {
      const data = await getAccounts();
      console.log('API accounts:', data); // Debugging line, remove in production

      // If your API returns { accounts: [...] } uncomment next line and adjust:
      // const accountsData = data.accounts || [];

      // For now, assuming data is the array of accounts directly
      const accountsData = Array.isArray(data) ? data : [];

      const sortedData = accountsData.sort((a, b) =>
        a.account_code.localeCompare(b.account_code)
      );
      setAccounts(sortedData);

      const treeData = buildTree(sortedData);
      setTreeAccounts(treeData);
    } catch (error) {
      console.error('Error loading accounts', error);
      toast({
        title: 'Error',
        description: 'Failed to load accounts.',
        variant: 'destructive',
      });
    }
  };

  const filterTree = (tree: Account[], term: string): Account[] => {
    const lowerCaseTerm = term.toLowerCase();
    return tree.flatMap((account) => {
      const matches =
        account.account_name.toLowerCase().includes(lowerCaseTerm) ||
        (account.account_code && account.account_code.includes(lowerCaseTerm)) ||
        (account.account_type &&
          account.account_type.toLowerCase().includes(lowerCaseTerm));

      const children = account.children ? filterTree(account.children, term) : [];

      if (matches || children.length > 0) {
        return [{ ...account, children }];
      }
      return [];
    });
  };

  const filteredTreeAccounts = searchTerm
    ? filterTree([...treeAccounts], searchTerm)
    : treeAccounts;

  const getTypeColor = (account_type: string) => {
    switch (account_type) {
      case 'ASSET':
        return 'bg-green-100 text-green-800';
      case 'LIABILITY':
        return 'bg-red-100 text-red-800';
      case 'EQUITY':
        return 'bg-blue-100 text-blue-800';
      case 'REVENUE':
        return 'bg-purple-100 text-purple-800';
      case 'EXPENSE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddAccount = (parent_account_id: number | null = null) => {
    setEditingAccount(null);
    setParentAccountIdForForm(parent_account_id);
    setShowForm(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setParentAccountIdForForm(null);
    setShowForm(true);
  };

  const handleSaveAccount = async (data: {
    account_name: string;
    account_type: string;
    parent_account_id: number | null;
  }) => {
    try {
      if (editingAccount) {
        await updateAccount(
          editingAccount.account_id,
          undefined,
          data.account_name,
          data.account_type,
          data.parent_account_id
        );
        toast({
          title: 'Updated',
          description: 'Account updated successfully!',
        });
      } else {
        await addAccount(
          data.account_name,
          data.account_type,
          data.parent_account_id
        );
        toast({
          title: 'Created',
          description: 'Account created successfully!',
          duration: 3000,
        });
      }
      setShowForm(false);
      setParentAccountIdForForm(null);
      loadAccounts();
    } catch (error) {
      console.error('Error saving account', error);
      toast({
        title: 'Error',
        description: 'Failed to save account',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chart of Accounts</CardTitle>
            <Button
              className="bg-gradient-to-r from-blue-500 to-blue-600"
              onClick={() => handleAddAccount(null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          
          {filteredTreeAccounts.length > 0 ? (
            <ul className="space-y-2">
       <div className="flex items-center border-y  py-2 text-sm font-medium text-gray-700">
  {/* Expand/Collapse Placeholder */}
  <div className="w-[20px]"></div>

  {/* Account Code */}
  <div className="w-[100px] font-mono">Account Code</div>

  {/* Account Name */}
  <div className="flex-1 pl-4">Account Name</div>

  {/* Account Type and Edit Icon in one div */}
  <div className="flex-1 flex items-center justify-between pl-0">
  <div>Account Type</div>
  <div className="text-gray-400 text-xs"/>
</div>
</div>
              {filteredTreeAccounts.map((account) => (
                
                <TreeItem
                  key={account.account_id}
                  account={account}
                  handleAddAccount={handleAddAccount}
                  handleEditAccount={handleEditAccount}
                  getTypeColor={getTypeColor}
                />
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No accounts found.
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <AccountForm
          accounts={accounts}
          account={editingAccount}
          parentId={parentAccountIdForForm}
          onClose={() => {
            setShowForm(false);
            setParentAccountIdForForm(null);
          }}
          onSave={handleSaveAccount}
        />
      )}
    </>
  );
};

export default ChartOfAccounts;
