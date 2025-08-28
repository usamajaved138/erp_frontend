
import AccountsLevels from '@/components/accounting/AccountsLevels';
import ManageAccounts from '@/components/accounting/ManageAccounts';
import { useState } from 'react';
import { ColorfulTabs, ColorfulTabsContent, ColorfulTabsList, ColorfulTabsTrigger } from '../ui/colorful-tabs';
import { Building } from 'lucide-react';
const Others: React.FC = () => {
  const [activeTab, setActiveTab] = useState('manage_accounts');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <div className="mb-2">
          <p className="text-gray-600">Manage your Accounts</p>
        </div>

        <ColorfulTabs value={activeTab} onValueChange={setActiveTab}>
          <ColorfulTabsList className="grid w-full grid-cols-2 mb-4 overflow-hidden">
            
            
            <ColorfulTabsTrigger value="accounts_levels" icon={Building}>Accounts Levels</ColorfulTabsTrigger>
            <ColorfulTabsTrigger value="manage_accounts" icon={Building}>Manage Accounts</ColorfulTabsTrigger>
           
          </ColorfulTabsList>
          <ColorfulTabsContent value="accounts_levels">
            <AccountsLevels />
          </ColorfulTabsContent>

          <ColorfulTabsContent value="manage_accounts">
            <ManageAccounts />
          </ColorfulTabsContent>

          
        </ColorfulTabs>
      </div>
    </div>
  );
};

export default Others;