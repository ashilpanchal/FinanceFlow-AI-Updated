import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  ClipboardList, 
  Plus, 
  Wallet,
  LogOut
} from 'lucide-react';
import { SideBarTab } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { auth, logout } from '../lib/firebase';

interface SidebarProps {
  activeTab: SideBarTab;
  setActiveTab: (tab: SideBarTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: ClipboardList },
  ] as const;

  const user = auth.currentUser;

  return (
    <aside id="sidebar" className="h-screen border-r w-64 fixed left-0 top-0 bg-white border-outline-variant hidden lg:flex flex-col p-4 gap-2 z-50 text-left">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-black text-on-surface">FinanceFlow AI</h1>
          <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Analytical precision</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SideBarTab)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 active:scale-95 group",
              activeTab === tab.id 
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold" 
                : "text-on-surface-variant hover:bg-surface-container hover:text-blue-600"
            )}
          >
            <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "fill-blue-100" : "group-hover:text-blue-600")} />
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant space-y-4">
        {user && (
          <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
            <img src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} alt="" className="w-8 h-8 rounded-full border border-outline-variant shadow-sm" />
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-on-surface truncate">{user.displayName}</p>
              <p className="text-[9px] text-on-surface-variant truncate italic">{user.email}</p>
            </div>
          </div>
        )}

        <button 
          onClick={() => setActiveTab('expenses')}
          className="w-full bg-primary text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-colors active:scale-95 duration-150"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>

        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-error hover:bg-error-container/20 transition-all active:scale-95 group border border-transparent hover:border-error-variant/30"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
