import React, { useState } from 'react';
import { Search, Bell, Settings, Menu, X, User, Shield, Image as ImageIcon, Check } from 'lucide-react';
import { SideBarTab } from '../types';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TopBarProps {
  title: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, searchQuery, setSearchQuery, onOpenSettings, onOpenProfile }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const user = auth.currentUser;

  const notifications = [
    { id: 1, title: 'Budget Alert', message: 'You have reached 80% of your Dining budget.', time: '2m ago', type: 'warning' },
    { id: 2, title: 'New insight', message: 'FinanceFlow AI found a new saving opportunity.', time: '1h ago', type: 'info' },
    { id: 3, title: 'Report ready', message: 'Your monthly statement is available for download.', time: '5h ago', type: 'success' },
  ];

  return (
    <header id="topbar" className="flex justify-between items-center px-6 py-3 w-full sticky top-0 bg-white/80 backdrop-blur-md border-b border-outline-variant shadow-sm z-40">
      <div className="flex items-center gap-4">
        <div className="lg:hidden w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <Menu className="w-6 h-6" />
        </div>
        <h1 className="lg:hidden text-xl font-bold text-primary">{title}</h1>
        
        <div className="relative group hidden sm:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-background border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative cursor-pointer active:scale-90",
              showNotifications && "bg-surface-container text-primary"
            )}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-tertiary rounded-full border-2 border-white"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white border border-outline-variant rounded-2xl shadow-2xl z-50 overflow-hidden text-left"
                >
                  <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-background/50">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-outline hover:text-on-surface"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 hover:bg-background border-b border-outline-variant/30 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-2 h-2 mt-1.5 rounded-full shrink-0",
                            n.type === 'warning' ? 'bg-error' : n.type === 'success' ? 'bg-secondary' : 'bg-primary'
                          )} />
                          <div>
                            <p className="text-xs font-bold text-on-surface">{n.title}</p>
                            <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-[9px] text-outline mt-2 font-bold uppercase">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-background group cursor-pointer hover:bg-surface-container transition-colors text-center border-t border-outline-variant">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Mark all as read</span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={onOpenSettings}
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors cursor-pointer active:scale-90"
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
        
        <button 
          onClick={onOpenProfile}
          className="flex items-center gap-3 cursor-pointer active:opacity-80 group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface leading-none group-hover:text-primary transition-colors">{user?.displayName || 'Alex Sterling'}</p>
            <p className="text-[11px] text-on-surface-variant font-medium">Premium Member</p>
          </div>
          <img
            src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAfNrRkKTa2G-QwGjRuOHlRMAB9sPRMtlBBz4SldsrOOXe-ff6jLKew9mFL2oHPczXrmd8GCbAaF0VHxb2eTk337LMPHzIU0QBWAaCT6bm8TZM-Scl89_UD6gW24A63c-CMg2mF-ZCpRtm2gYrx1ArpYRnZhx0ceguaMbkYEzizA-Q3fCEyNQsNzXtVeYWvXeQR8r71NSxg5RW_39SDvpAGXwrVoVP27AMO5iIA04XKY6ys2MowfcxPX2idfYLzxNCXJQRKSFAbnhU"}
            alt="User profile"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover group-hover:border-primary transition-all"
          />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
