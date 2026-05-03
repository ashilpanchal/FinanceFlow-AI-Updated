/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Insights from './pages/Insights';
import Reports from './pages/Reports';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import { SideBarTab, Transaction } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutDashboard, CreditCard, BarChart3, ClipboardList, Plus, LogIn, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';
import { auth, signInWithGoogle, logout, subscribeToTransactions, addTransactionToDb } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<SideBarTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Flow state
  const [authStep, setAuthStep] = useState<'welcome' | 'email' | 'otp'>('welcome');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) setAuthStep('welcome');
    });
    return () => unsubscribeAuth();
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setIsSending(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsSending(false);
      setAuthStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) return;
    
    setIsVerifying(true);
    // Simulation: Any 6 digit code works for the demo flow, or a specific one like 123456
    setTimeout(() => {
      if (enteredCode === '123456' || enteredCode === '000000') {
        // Log in via anonymous for the sake of the demo, or just bypass state
        // For a real production app, this would use a Firebase Function or similar backend
        setAuthStep('welcome');
        setIsVerifying(false);
        // We simulate the login state here if not using real Firebase Auth for the OTP
        // In a real scenario, this would call a verify function
        // For this app, let's just trigger a Google login or anonymous login to satisfy the user object
        signInWithGoogle(); 
      } else {
        alert("Invalid OTP! Try 123456");
        setIsVerifying(false);
      }
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  useEffect(() => {
    if (user) {
      const unsubscribeTxs = subscribeToTransactions(user.uid, (txs) => {
        setTransactions(txs);
      });
      return () => unsubscribeTxs();
    } else {
      setTransactions([]);
    }
  }, [user]);

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    if (!user) return;
    await addTransactionToDb(user.uid, tx);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'expenses':
        return <Expenses transactions={transactions} onAddTransaction={addTransaction} searchQuery={searchQuery} />;
      case 'insights':
        return <Insights />;
      case 'reports':
        return <Reports transactions={transactions} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  const getPageTitle = () => {
    return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-outline-variant text-center space-y-8"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-on-surface">FinanceFlow</h1>
            <p className="text-sm text-on-surface-variant font-medium">
              {authStep === 'welcome' ? 'Your AI-powered personal vault' : 
               authStep === 'email' ? 'Enter your email to continue' : 'Verify your identity'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {authStep === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <button 
                  onClick={() => setAuthStep('email')}
                  className="w-full flex items-center justify-center gap-3 bg-on-surface text-surface py-4 rounded-xl font-bold hover:bg-on-surface/90 transition-all active:scale-95 shadow-lg"
                >
                  Get Started
                </button>
                <button 
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3 border border-outline-variant py-4 rounded-xl font-bold hover:bg-background transition-all active:scale-95"
                >
                  <img src="https://www.gstatic.com/firebase/anonymous-scan.png" className="w-5 h-5 grayscale opacity-50" alt="" />
                  Continue with Google
                </button>
              </motion.div>
            )}

            {authStep === 'email' && (
              <motion.form 
                key="email"
                onSubmit={handleSendOtp}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="relative group text-left">
                  <Plus className="absolute left-4 top-4 w-5 h-5 text-outline rotate-45 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-background border border-outline-variant rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  {isSending ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : "Send OTP code"}
                </button>
                <button onClick={() => setAuthStep('welcome')} type="button" className="text-xs font-bold text-outline uppercase tracking-wider hover:text-on-surface transition-colors">Go Back</button>
              </motion.form>
            )}

            {authStep === 'otp' && (
              <motion.form 
                key="otp"
                onSubmit={handleVerifyOtp}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <p className="text-xs text-on-surface-variant font-medium">We sent a 6-digit code to <span className="font-bold text-on-surface">{email}</span></p>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input 
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-10 h-14 md:w-12 md:h-16 text-center text-xl font-display font-bold bg-background border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  ))}
                </div>
                <button 
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-on-surface text-surface py-4 rounded-xl font-bold shadow-lg hover:bg-on-surface/90 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : "Verify & Login"}
                </button>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setAuthStep('email')} type="button" className="text-[10px] font-bold text-outline uppercase tracking-widest hover:text-on-surface transition-colors">Resend Code</button>
                  <button onClick={() => setAuthStep('welcome')} type="button" className="text-[10px] font-bold text-outline uppercase tracking-widest hover:text-on-surface transition-colors italic opacity-50">Demo Code: 123456</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="text-[10px] text-outline uppercase tracking-widest font-bold pt-4 border-t border-outline-variant/30">Secure Cloud Storage Included</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-left">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="lg:ml-64 flex flex-col h-screen overflow-y-auto">
        <TopBar 
          title={getPageTitle()} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
        
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Persistent Modals */}
        <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant px-6 py-3 flex justify-between items-center z-50">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn("flex flex-col items-center gap-1", activeTab === 'dashboard' ? "text-primary" : "text-outline")}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={cn("flex flex-col items-center gap-1", activeTab === 'expenses' ? "text-primary" : "text-outline")}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] font-bold">Expenses</span>
          </button>
          
          <div 
            onClick={() => setActiveTab('expenses')}
            className="-mt-12 bg-primary w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </div>

          <button 
            onClick={() => setActiveTab('insights')}
            className={cn("flex flex-col items-center gap-1", activeTab === 'insights' ? "text-primary" : "text-outline")}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-bold">Insights</span>
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={cn("flex flex-col items-center gap-1", activeTab === 'reports' ? "text-primary" : "text-outline")}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[10px] font-bold">Reports</span>
          </button>
        </nav>
      </main>
    </div>
  );
}

