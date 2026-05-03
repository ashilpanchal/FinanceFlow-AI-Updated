import React, { useState } from 'react';
import { Camera, Send, ArrowDown, ArrowUp, Filter, Download, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';

interface ExpensesProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  searchQuery: string;
}

const Expenses: React.FC<ExpensesProps> = ({ transactions, onAddTransaction, searchQuery }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Dining');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState('Visa 1234');
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Live Filtering & Search
  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = selectedFilter === 'All' || tx.category === selectedFilter;
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Category', 'Description', 'Account', 'Priority', 'Amount'];
    const rows = filteredTransactions.map(tx => [
      tx.date,
      tx.time || '',
      tx.category,
      tx.description,
      tx.account,
      tx.priority || 'Medium',
      tx.amount.toString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FinanceFlow_Expenses_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    setIsAdding(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddTransaction({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        category,
        description,
        account,
        priority,
        amount: -parseFloat(amount),
        icon: category === 'Dining' ? 'Utensils' : category === 'Groceries' ? 'ShoppingCart' : category === 'Transport' ? 'Car' : 'CreditCard'
      });
      
      setIsAdding(false);
      setShowSuccess(true);
      setAmount('');
      setDescription('');
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm text-left">
          <p className="label-caps text-on-surface-variant mb-2">TODAY'S TOTAL</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-display text-on-surface">$428.50</h2>
            <div className="bg-secondary-container px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowDown className="w-3 h-3 text-on-secondary-container" />
              <span className="text-[10px] font-bold text-on-secondary-container">12%</span>
            </div>
          </div>
          <p className="text-[11px] text-outline mt-2">v.s. $486.20 yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm text-left">
          <p className="label-caps text-on-surface-variant mb-2">WEEKLY AVERAGE</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-display text-on-surface">$2,140.00</h2>
            <div className="bg-error-container px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUp className="w-3 h-3 text-on-error-container" />
              <span className="text-[10px] font-bold text-on-error-container">4%</span>
            </div>
          </div>
          <p className="text-[11px] text-outline mt-2">Trending higher than usual</p>
        </div>

        <div className="md:col-span-2 bg-primary-container p-6 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-center text-white text-left">
          <div className="relative z-10">
            <h3 className="font-semibold text-lg mb-1">Smart Receipt Scan</h3>
            <p className="text-white/80 text-sm max-w-xs">Upload your invoice and let FinanceFlow AI categorize it automatically.</p>
            <button className="mt-4 bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-lg active:scale-95 duration-100">
              <Camera className="w-4 h-4" />
              Scan Now
            </button>
          </div>
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm sticky top-24 text-left">
            <h3 className="font-semibold text-lg text-on-surface mb-6 flex items-center gap-2">
              <LucideIcons.PlusCircle className="w-5 h-5 text-primary" />
              Quick Expense Entry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="label-caps text-on-surface-variant mb-2 block">TRANSACTION AMOUNT</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-background border-outline-variant border rounded-lg py-3 pl-8 pr-4 font-semibold text-on-surface focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="label-caps text-on-surface-variant mb-2 block">CATEGORY</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border-outline-variant border rounded-lg py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Dining">Dining & Drinks</option>
                  <option value="Transport">Transportation</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Service">Subscription</option>
                </select>
              </div>
              <div>
                <label className="label-caps text-on-surface-variant mb-2 block">DESCRIPTION</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-background border-outline-variant border rounded-lg py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Weekly grocery run"
                />
              </div>
              <div>
                <label className="label-caps text-on-surface-variant mb-2 block">PRIORITY</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-lg border transition-all",
                        priority === p 
                          ? p === 'High' ? "bg-error text-white border-error" : 
                            p === 'Medium' ? "bg-primary text-white border-primary" : 
                            "bg-tertiary text-white border-tertiary"
                          : "bg-background text-on-surface-variant border-outline-variant hover:border-outline"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-caps text-on-surface-variant mb-2 block">DATE</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-outline-variant rounded-lg py-3 px-4 text-sm focus:bg-white outline-none" 
                  />
                </div>
                <div>
                  <label className="label-caps text-on-surface-variant mb-2 block">ACCOUNT</label>
                  <select 
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full bg-background border border-outline-variant rounded-lg py-3 px-4 text-sm focus:bg-white outline-none"
                  >
                    <option>Visa 1234</option>
                    <option>Amex 8821</option>
                  </select>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 py-4 text-secondary font-bold"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Transaction Logged!
                  </motion.div>
                ) : (
                  <button 
                    type="submit"
                    disabled={isAdding}
                    className="w-full bg-primary text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isAdding ? 'Processing...' : 'Log Transaction'}
                  </button>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-semibold text-on-surface w-full sm:w-auto text-left">Recent History</h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="flex items-center gap-2 px-3 py-2 bg-background text-on-surface-variant rounded-lg text-sm font-medium hover:bg-surface-container transition-all border border-outline-variant outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Dining">Dining</option>
                  <option value="Transport">Transport</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Service">Subscriptions</option>
                </select>
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-3 py-2 bg-background text-on-surface-variant rounded-lg text-sm font-medium hover:bg-surface-container transition-all border border-outline-variant active:scale-95 duration-75"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background">
                    <th className="px-6 py-4 label-caps text-on-surface-variant border-b border-outline-variant">DATE</th>
                    <th className="px-6 py-4 label-caps text-on-surface-variant border-b border-outline-variant">CATEGORY</th>
                    <th className="px-6 py-4 label-caps text-on-surface-variant border-b border-outline-variant">PRIORITY</th>
                    <th className="px-6 py-4 label-caps text-on-surface-variant border-b border-outline-variant">DESCRIPTION</th>
                    <th className="px-6 py-4 label-caps text-on-surface-variant border-b border-outline-variant">ACCOUNT</th>
                    <th className="px-6 py-4 label-caps text-on-surface-variant border-b border-outline-variant text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredTransactions.map((tx) => {
                    const Icon = (LucideIcons as any)[tx.icon || 'CreditCard'];
                    return (
                      <tr key={tx.id} className="hover:bg-background transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-on-surface">{tx.date}</div>
                          <div className="text-xs text-outline font-medium">{tx.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              {Icon && <Icon className="w-4 h-4" />}
                            </div>
                            <span className="text-sm font-medium text-on-surface-variant">{tx.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            tx.priority === 'High' ? "bg-error-container/20 text-error border-error-variant/20" :
                            tx.priority === 'Low' ? "bg-tertiary-container/20 text-tertiary border-tertiary-variant/20" :
                            "bg-primary/5 text-primary border-primary/20"
                          )}>
                            {tx.priority || 'Medium'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-on-surface font-medium">{tx.description}</div>
                          <div className="text-xs text-outline font-medium truncate max-w-[120px]">Transaction notes</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <LucideIcons.CreditCard className="w-3.5 h-3.5 text-outline" />
                            <span className="text-xs text-on-surface-variant font-medium">{tx.account}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-on-surface">
                          {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-background border-t border-outline-variant flex justify-between items-center">
              <span className="text-xs text-on-surface-variant font-medium">Showing {filteredTransactions.length} transactions</span>
              <div className="flex gap-2">
                <button className="p-2 border border-outline-variant rounded-md bg-white hover:bg-background transition-all active:scale-90">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 border border-outline-variant rounded-md bg-white hover:bg-background transition-all active:scale-90">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Expenses;
