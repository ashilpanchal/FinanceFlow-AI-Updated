import React, { useState } from 'react';
import { Sparkles, TrendingUp, History, BellRing, Rocket, Info, Send, MessageSquare, Bot, ArrowRight, Loader2, X, Zap } from 'lucide-react';
import { INSIGHTS } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const FORECAST_DATA = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 35 },
  { x: 4, y: 30 },
  { x: 5, y: 50 },
];

const InsightsList: React.FC<{ onSelect: (insight: any) => void }> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
      {INSIGHTS.map((insight) => (
        <div 
          key={insight.id} 
          onClick={() => onSelect(insight)}
          className="bg-white rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer group"
        >
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                insight.type === 'priority' ? "bg-error-container/50 text-error" : 
                insight.type === 'smart_tip' ? "bg-primary/10 text-primary" : 
                "bg-tertiary-container/20 text-tertiary"
              )}>
                {insight.id === 'i1' && <BellRing className="w-5 h-5" />}
                {insight.id === 'i2' && <Sparkles className="w-5 h-5" />}
                {insight.id === 'i3' && <Rocket className="w-5 h-5" />}
              </div>
              <span className={cn(
                "label-caps px-2 py-1 rounded text-[10px]",
                insight.type === 'priority' ? "text-error bg-error-container" : 
                insight.type === 'smart_tip' ? "text-primary bg-primary-fixed-dim/30" : 
                "text-tertiary bg-tertiary-container/30"
              )}>
                {insight.badgeText}
              </span>
            </div>
            <h3 className="font-semibold text-lg text-on-surface mb-1 group-hover:text-primary transition-colors">{insight.title}</h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              {insight.description}
            </p>

            {insight.id === 'i1' && (
              <div className="space-y-2">
                {insight.details.slice(0, 2).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-background border border-outline-variant/30">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-outline-variant text-[10px] font-bold text-on-surface-variant">{item.iconText}</div>
                    <span className="text-sm font-medium flex-1 text-on-surface">{item.name}</span>
                    <span className="text-sm font-bold text-on-surface">${item.price}</span>
                  </div>
                ))}
              </div>
            )}

            {insight.id === 'i2' && (
              <div className="relative h-24 w-full rounded-lg overflow-hidden border border-outline-variant bg-slate-50">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={FORECAST_DATA}>
                    <Line type="monotone" dataKey="y" stroke="#004ac6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {insight.id === 'i3' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between label-caps text-[10px] mb-1">
                    <span>TRAVEL SPENDING</span>
                    <span className="text-tertiary">92% OF BUDGET</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full w-[92%] rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-background border-t border-outline-variant flex gap-3 mt-auto">
            <button className={cn(
              "flex-1 py-2 rounded font-bold label-caps text-[10px] transition-colors",
              insight.type === 'priority' ? "text-error hover:bg-error-container/30" : "text-primary border border-primary hover:bg-primary/5"
            )}>
              {insight.actionText}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Insights: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<any | null>(null);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAsking(true);
    setAiResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are FinanceFlow AI, a helpful financial assistant. The user is looking at their financial dashboard. User Question: ${aiQuery}`,
        config: {
          systemInstruction: "Provide concise, actionable financial advice based on the dashboard context. Keep it under 100 words.",
        },
      });
      setAiResponse(response.text);
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("I'm sorry, I encountered an error while processing your request. Please try again later.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 text-left"
    >
      {/* Hero: Financial Health Score */}
      <section>
        <div className="bg-white rounded-xl p-8 border border-outline-variant shadow-sm flex flex-col md:flex-row items-center gap-10 overflow-hidden relative text-left">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none bg-gradient-to-l from-primary to-transparent"></div>
          
          <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border-[12px] border-surface-container"></div>
            <div 
              className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent border-l-transparent" 
              style={{ transform: 'rotate(45deg)' }}
            ></div>
            <div className="text-center">
              <span className="text-5xl font-black text-primary block mb-1">82</span>
              <span className="label-caps text-outline tracking-widest text-[10px]">EXCELLENT</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <h2 className="text-2xl font-bold text-on-surface">Financial Health Score</h2>
            <p className="text-lg text-on-surface-variant max-w-xl font-medium leading-relaxed">
              Your financial standing is up 4% this month. Your high liquidity and disciplined savings in your travel fund are primary drivers of this score.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="bg-secondary-container/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-on-secondary-container" />
                <span className="label-caps text-[10px] text-on-secondary-container">SAVINGS UP 12%</span>
              </div>
              <div className="bg-surface-container px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="label-caps text-[10px] text-on-surface-variant">UPDATED 2H AGO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Insights */}
      <InsightsList onSelect={setSelectedInsight} />

      {/* AI Assistant Interactive Section */}
      <section>
        <div className="bg-inverse-surface text-inverse-on-surface rounded-2xl p-10 shadow-xl relative overflow-hidden text-left">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Ask FinanceFlow AI</h2>
              <p className="text-lg opacity-80 mb-8 max-w-xl">
                Get instant answers about your spending habits, investment strategies, or tax planning.
              </p>
              
              <form onSubmit={handleAskAI} className="relative max-w-2xl bg-white/10 rounded-xl overflow-hidden border border-white/20 p-2 group focus-within:ring-2 focus-within:ring-primary transition-all">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-white py-3 pl-4 pr-16 focus:ring-0 placeholder:text-white/40"
                  placeholder="How much can I afford for a new car?"
                />
                <button 
                  type="submit"
                  disabled={isAsking}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-primary rounded-lg flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all shadow-lg"
                >
                  {isAsking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>

              <AnimatePresence>
                {aiResponse && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex gap-3">
                      <Zap className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <p className="text-sm leading-relaxed italic opacity-90">{aiResponse}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                <button onClick={() => setAiQuery('Compare rent vs buy')} className="label-caps text-[10px] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors">Compare rent vs buy</button>
                <button onClick={() => setAiQuery('Tax saving tips')} className="label-caps text-[10px] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors">Tax saving tips</button>
                <button onClick={() => setAiQuery('Portfolio rebalancing')} className="label-caps text-[10px] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors">Portfolio rebalancing</button>
              </div>
            </div>

            <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center shrink-0">
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="relative w-full h-full"
               >
                 <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                 <Bot className="w-full h-full text-primary relative z-10 opacity-80" />
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInsight(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-8 text-left"
            >
              <button 
                onClick={() => setSelectedInsight(null)}
                className="absolute top-4 right-4 p-2 hover:bg-background rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-outline" />
              </button>

              <div className="flex flex-col space-y-6">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                  selectedInsight.type === 'priority' ? "bg-error-container text-error" : 
                  selectedInsight.type === 'smart_tip' ? "bg-primary/10 text-primary" : 
                  "bg-tertiary-container text-tertiary"
                )}>
                  {selectedInsight.id === 'i1' && <BellRing className="w-8 h-8" />}
                  {selectedInsight.id === 'i2' && <Sparkles className="w-8 h-8" />}
                  {selectedInsight.id === 'i3' && <Rocket className="w-8 h-8" />}
                </div>
                
                <div>
                  <h3 className="text-2xl font-display font-bold text-on-surface mb-2">{selectedInsight.title}</h3>
                  <p className="text-sm text-on-surface-variant">{selectedInsight.description}</p>
                </div>

                <div className="bg-background p-6 rounded-xl border border-outline-variant w-full">
                  <h4 className="label-caps text-[10px] text-outline mb-4">Detailed Breakdown</h4>
                  <div className="space-y-4">
                    {selectedInsight.id === 'i1' && selectedInsight.details.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-outline-variant/30">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-bold text-error">${item.price}</span>
                      </div>
                    ))}
                    {selectedInsight.id === 'i2' && (
                      <p className="text-sm leading-relaxed text-on-surface italic">
                        Our intelligent forecasting predicts a 15% increase in your disposable income if currently tracked spending patterns continue.
                      </p>
                    )}
                    {selectedInsight.id === 'i3' && (
                      <p className="text-sm leading-relaxed text-on-surface">
                        {selectedInsight.details.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 w-full pt-4">
                   <button className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95">
                     Apply Suggestion
                   </button>
                   <button 
                     onClick={() => setSelectedInsight(null)}
                     className="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-xl font-bold hover:bg-background transition-all"
                   >
                     Close
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Bubble Placeholder */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden">
          <MessageSquare className="w-6 h-6 group-hover:opacity-0 transition-opacity" />
          <Bot className="w-7 h-7 absolute opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </motion.div>
  );
};

export default Insights;
