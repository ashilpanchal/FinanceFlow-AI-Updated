export type SideBarTab = 'dashboard' | 'expenses' | 'insights' | 'reports';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  account: string;
  amount: number;
  time?: string;
  icon?: string;
  priority?: 'Low' | 'Medium' | 'High';
  userId?: string;
  createdAt?: any;
}

export interface SummaryStat {
  label: string;
  value: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  comparison?: string;
  icon: string;
  colorClass?: string;
  progress?: number;
}

export interface SpendingCategory {
  name: string;
  value: number;
  color: string;
  percent: number;
}

export interface Insight {
  id: string;
  type: 'priority' | 'smart_tip' | 'warning';
  title: string;
  description: string;
  icon: string;
  badgeText: string;
  actionText: string;
  secondaryActionText?: string;
  details?: any;
}

export interface Deduction {
  category: string;
  description: string;
  amount: number;
  confidence: 'High' | 'Med' | 'Low';
  confidenceValue: number;
  icon: string;
  actionText: string;
}
