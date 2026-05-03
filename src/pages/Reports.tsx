import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  Share2,
  Laptop,
  Car,
  GraduationCap,
  Loader2
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ANNUAL_SUMMARY_DATA, DEDUCTIONS } from '../constants';
import { cn, formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../types';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const downloadReport = (reportTitle: string, data: any) => {
    const headers = Object.keys(data[0]);
    const rows = data.map((item: any) => headers.map(header => item[header]));
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FinanceFlow_${reportTitle.replace(/\s+/g, '_')}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleComprehensiveDownload = () => {
    setIsGenerating(true);
    // Combine some interesting data
    const summaryData = transactions.map(tx => ({
      Date: tx.date,
      Category: tx.category,
      Description: tx.description,
      Amount: tx.amount
    }));
    
    setTimeout(() => {
      downloadReport("Comprehensive_Report", summaryData);
      setIsGenerating(false);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Generate Report Card */}
        <section className="md:col-span-4 bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-on-surface">Generate Report</h3>
            <div className="space-y-4">
              <div>
                <label className="label-caps text-on-surface-variant mb-2 block">DATE RANGE</label>
                <select className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all cursor-pointer">
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Fiscal Year 2023</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="label-caps text-on-surface-variant mb-2 block">FORMAT</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 border-2 border-primary bg-blue-50 text-primary py-2.5 rounded-lg font-bold text-xs transition-all active:scale-95">
                    <FileText className="w-4 h-4" /> PDF
                  </button>
                  <button className="flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface-variant py-2.5 rounded-lg font-bold text-xs hover:border-outline transition-all active:scale-95">
                    <FileSpreadsheet className="w-4 h-4" /> CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleComprehensiveDownload}
            disabled={isGenerating}
            className="mt-8 w-full bg-primary text-white py-4 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </motion.div>
              ) : isDownloaded ? (
                <motion.div 
                   key="done"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Downloaded!
                </motion.div>
              ) : (
                <motion.div 
                  key="download"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Comprehensive Report
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </section>

        {/* Tax Estimator Tool */}
        <section className="md:col-span-8 bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-semibold text-lg text-on-surface">Tax Estimator Tool</h3>
              <p className="text-sm text-on-surface-variant">Based on current FY24 tracking</p>
            </div>
            <div className="flex bg-background p-1.5 rounded-xl border border-outline-variant/30">
              <button className="px-5 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg text-primary border border-outline-variant/20">US</button>
              <button className="px-5 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">UK</button>
              <button className="px-5 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Generic</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-background rounded-xl border border-outline-variant/30 space-y-2">
              <span className="label-caps text-on-surface-variant text-[10px] block">TOTAL ESTIMATED TAX</span>
              <span className="text-2xl font-black text-tertiary">$12,450.00</span>
              <div className="flex items-center gap-1 text-[11px] text-error font-bold">
                <TrendingUp className="w-3 h-3" />
                8.4% vs last year
              </div>
            </div>
            <div className="p-4 bg-background rounded-xl border border-outline-variant/30 space-y-2">
              <span className="label-caps text-on-surface-variant text-[10px] block">TAXABLE INCOME</span>
              <span className="text-2xl font-black text-on-surface">$84,200.00</span>
              <div className="flex items-center gap-1 text-[11px] text-secondary font-bold">
                <CheckCircle2 className="w-3 h-3" />
                Fully Verified
              </div>
            </div>
            <div className="p-4 bg-background rounded-xl border border-outline-variant/30 space-y-2">
              <span className="label-caps text-on-surface-variant text-[10px] block">EFFECTIVE RATE</span>
              <span className="text-2xl font-black text-on-surface">14.8%</span>
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
                <Info className="w-3 h-3" />
                Pro-rated estimate
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-outline-variant/40">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-on-surface">Quarterly Payment Progress</span>
              <span className="text-sm font-black text-primary">75% Paid</span>
            </div>
            <div className="w-full bg-background h-3 rounded-full overflow-hidden border border-outline-variant/30 shadow-inner">
              <div className="bg-primary h-full w-3/4 rounded-full shadow-lg shadow-primary/20 transition-all duration-1000 ease-out"></div>
            </div>
          </div>
        </section>
      </div>

      {/* Annual Summary Bar Chart Section */}
      <section className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h3 className="font-semibold text-xl text-on-surface">Annual Summary</h3>
            <p className="text-sm text-on-surface-variant">Income vs Expenses vs Tax Reserves</p>
          </div>
          <button 
            onClick={() => downloadReport("Quarterly_Summary", ANNUAL_SUMMARY_DATA)}
            className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold hover:bg-background transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download Data
          </button>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ANNUAL_SUMMARY_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                dy={12}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" iconType="rect" iconSize={10} wrapperStyle={{ paddingBottom: 20 }} />
              <Bar dataKey="income" fill="#004ac6" radius={[2, 2, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#CBD5E1" radius={[2, 2, 0, 0]} name="Expenses" />
              <Bar dataKey="taxes" fill="#ae0010" radius={[2, 2, 0, 0]} name="Taxes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Quick Reports List */}
      <section className="space-y-4">
        <h3 className="text-xl font-display font-bold text-on-surface text-left">Quick Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => downloadReport("Quarterly_Summary", ANNUAL_SUMMARY_DATA)}
            className="group p-6 bg-white border border-outline-variant rounded-xl hover:border-primary transition-all text-left flex items-start gap-4 active:scale-[0.98]"
          >
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-primary/10 transition-colors">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-on-surface">Quarterly Tax Summary</h4>
              <p className="text-sm text-on-surface-variant">Q1 2024 • Updated yesterday</p>
            </div>
            <Download className="w-5 h-5 text-outline group-hover:text-primary" />
          </button>
          <button 
            onClick={() => downloadReport("Deductions_List", DEDUCTIONS)}
            className="group p-6 bg-white border border-outline-variant rounded-xl hover:border-primary transition-all text-left flex items-start gap-4 active:scale-[0.98]"
          >
            <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
              <LucideIcons.ShieldCheck className="w-6 h-6 text-error" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-on-surface">Deductible Expenses</h4>
              <p className="text-sm text-on-surface-variant">Annual Review • 12 items</p>
            </div>
            <Download className="w-5 h-5 text-outline group-hover:text-red-500" />
          </button>
        </div>
      </section>

      {/* Top Tax Deductions List */}
      <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-on-surface">Top Tax Deductions Identified</h3>
            <p className="text-sm text-on-surface-variant font-medium">AI-driven analysis of your expense patterns</p>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/50">
                <th className="px-8 py-5 label-caps text-on-surface-variant">CATEGORY</th>
                <th className="px-8 py-5 label-caps text-on-surface-variant">IDENTIFIED AMOUNT</th>
                <th className="px-8 py-5 label-caps text-on-surface-variant text-center">CONFIDENCE</th>
                <th className="px-8 py-5 label-caps text-on-surface-variant">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {DEDUCTIONS.map((ded, idx) => {
                const Icon = (LucideIcons as any)[ded.icon];
                return (
                  <tr key={idx} className="hover:bg-background/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          {Icon && <Icon className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{ded.category}</p>
                          <p className="text-xs text-on-surface-variant font-medium">{ded.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-lg font-bold text-on-surface">{formatCurrency(ded.amount)}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={cn(
                        "inline-flex items-center px-4 py-1 rounded-full text-xs font-black shadow-sm",
                        ded.confidence === 'High' ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-highest text-on-surface-variant"
                      )}>
                        {ded.confidenceValue}% {ded.confidence}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button className="text-primary font-black text-sm hover:text-blue-800 transition-colors active:scale-95">
                        {ded.actionText}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sharing FAB */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-primary/20">
          <Share2 className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default Reports;
