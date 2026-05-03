import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Sparkles, Utensils, Briefcase, ShoppingBag, Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import { SUMMARY_STATS, SPENDING_CATEGORIES, DASHBOARD_CHART_DATA } from '../constants';
import * as LucideIcons from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Summary Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_STATS.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </section>

      {/* Middle Section: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Cash Flow Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Cash Flow</h2>
              <p className="text-sm text-on-surface-variant">Income vs Expenses • Last 6 Months</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-xs font-medium text-on-surface-variant">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                <span className="text-xs font-medium text-on-surface-variant">Expenses</span>
              </div>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DASHBOARD_CHART_DATA}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004ac6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#004ac6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ae0010" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ae0010" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                  dy={10}
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#004ac6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ae0010" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category Donut */}
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-on-surface mb-1">Spending by Category</h2>
          <p className="text-sm text-on-surface-variant mb-6">Current Month Distribution</p>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SPENDING_CATEGORIES}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {SPENDING_CATEGORIES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-outline label-caps text-[10px]">TOTAL</span>
                <span className="text-xl font-bold text-on-surface">$4,821</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              {SPENDING_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-xs font-medium text-on-surface-variant">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">{cat.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Insights & Action */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-primary to-blue-800 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-100" />
              <span className="label-caps text-[10px] text-blue-100">AI Spending Insight</span>
            </div>
            <h2 className="text-xl font-bold mb-2">You're spending 15% more on dining than last month.</h2>
            <p className="text-sm text-blue-100/80 mb-6 leading-relaxed">Our AI detected a pattern of late-night delivery orders. Cutting back on 2 meals per week could save you $140 by the end of the month.</p>
            <div className="flex gap-3">
              <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors">Adjust Budget</button>
              <button className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">Ignore</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-on-surface">Recent Transactions</h2>
            <button className="text-primary text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 3).map((tx) => {
              const Icon = (LucideIcons as any)[tx.icon || 'CreditCard'];
              return (
                <div key={tx.id} className="flex items-center gap-4 p-3 hover:bg-background rounded-xl transition-all group cursor-pointer">
                  <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant group-hover:bg-white shadow-sm transition-colors">
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-on-surface">{tx.description}</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                      {tx.category} • {tx.date === 'Nov 20, 2023' ? 'Today' : tx.date}, {tx.time}
                    </p>
                  </div>
                  <p className={cn(
                    "text-sm font-bold",
                    tx.amount > 0 ? "text-secondary" : "text-on-surface"
                  )}>
                    {tx.amount > 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating Add Expense Action - Shown on dashboard as requested by UI */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 z-50 group">
        <Plus className="w-7 h-7" />
        <span className="absolute right-16 bg-inverse-surface text-inverse-on-surface text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Quick Add Expense</span>
      </button>
    </motion.div>
  );
};

export default Dashboard;
