import { Transaction, SummaryStat, SpendingCategory, Insight, Deduction } from './types';

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: 'Nov 20, 2023',
    time: '12:45 PM',
    category: 'Dining',
    description: 'Bistro Le Central',
    account: 'Visa 1234',
    amount: -42.80,
    icon: 'Utensils'
  },
  {
    id: '2',
    date: 'Nov 19, 2023',
    time: '09:12 AM',
    category: 'Groceries',
    description: 'Whole Foods Market',
    account: 'Bank Transfer',
    amount: -186.20,
    icon: 'ShoppingCart'
  },
  {
    id: '3',
    date: 'Nov 18, 2023',
    time: '08:00 PM',
    category: 'Service',
    description: 'Netflix.com',
    account: 'Visa 1234',
    amount: -19.99,
    icon: 'Play'
  },
  {
    id: '4',
    date: 'Nov 17, 2023',
    time: '04:30 PM',
    category: 'Transport',
    description: 'Shell Station',
    account: 'Amex 8821',
    amount: -85.00,
    icon: 'Car'
  },
  {
    id: '5',
    date: 'Nov 16, 2023',
    time: '11:00 AM',
    category: 'Business',
    description: 'Apple Store',
    account: 'Amex 8821',
    amount: -99.00,
    icon: 'Briefcase'
  }
];

export const SUMMARY_STATS: SummaryStat[] = [
  {
    label: 'Total Net Worth',
    value: '$284,592.00',
    trend: { value: '4.2%', isUp: true },
    icon: 'Wallet',
    colorClass: 'bg-blue-50 text-blue-600'
  },
  {
    label: 'Monthly Income',
    value: '$12,450.00',
    comparison: 'vs last month',
    icon: 'Banknote',
    colorClass: 'bg-secondary-container/30 text-secondary'
  },
  {
    label: 'Monthly Spending',
    value: '$4,821.50',
    trend: { value: '15%', isUp: true },
    icon: 'ShoppingCart',
    colorClass: 'bg-error-container text-on-error-container'
  },
  {
    label: 'Savings Rate',
    value: '61.2%',
    progress: 61.2,
    icon: 'PiggyBank',
    colorClass: 'bg-primary-container text-on-primary-container'
  }
];

export const SPENDING_CATEGORIES: SpendingCategory[] = [
  { name: 'Housing & Bills', value: 2410, percent: 50, color: '#004ac6' },
  { name: 'Dining & Food', value: 1205, percent: 25, color: '#006e2d' },
  { name: 'Transport', value: 723, percent: 15, color: '#ae0010' },
];

export const DASHBOARD_CHART_DATA = [
  { name: 'Jan', income: 8000, expenses: 3000 },
  { name: 'Feb', income: 8500, expenses: 3200 },
  { name: 'Mar', income: 9200, expenses: 3100 },
  { name: 'Apr', income: 8800, expenses: 3400 },
  { name: 'May', income: 10500, expenses: 3300 },
  { name: 'Jun', income: 12450, expenses: 4821 },
];

export const INSIGHTS: Insight[] = [
  {
    id: 'i1',
    type: 'priority',
    title: 'Subscription Alert',
    description: "We found 3 unused subscriptions costing $45/mo. These services haven't been accessed in 60 days.",
    icon: 'BellRing',
    badgeText: 'PRIORITY',
    actionText: 'Cancel Subscriptions',
    secondaryActionText: 'Dismiss',
    details: [
      { name: 'StreamTech HD', price: 14.99, iconText: 'ST' },
      { name: 'GymPass Lite', price: 20.00, iconText: 'GY' },
    ]
  },
  {
    id: 'i2',
    type: 'smart_tip',
    title: 'Saving Opportunity',
    description: "If you redirect $200/mo to your index fund, you'll reach your 'Retirement' goal 4 months early.",
    icon: 'Sparkles',
    badgeText: 'SMART TIP',
    actionText: 'Adjust Contribution',
  },
  {
    id: 'i3',
    type: 'warning',
    title: 'Budget Forecast',
    description: "Based on current trends, you might exceed your 'Travel' budget by $120 this month.",
    icon: 'Rocket',
    badgeText: 'WARNING',
    actionText: 'View Details',
    details: {
      spent: 92,
      note: 'Higher than usual dining costs in Rome.'
    }
  }
];

export const DEDUCTIONS: Deduction[] = [
  {
    category: 'Home Office Equipment',
    description: 'Work-related hardware & furniture',
    amount: 3420.50,
    confidence: 'High',
    confidenceValue: 98,
    icon: 'Laptop',
    actionText: 'Apply Deduction'
  },
  {
    category: 'Business Travel',
    description: 'Flights, hotels & mileage',
    amount: 1850.00,
    confidence: 'High',
    confidenceValue: 94,
    icon: 'Car',
    actionText: 'Apply Deduction'
  },
  {
    category: 'Professional Development',
    description: 'Courses, books & certifications',
    amount: 740.00,
    confidence: 'Med',
    confidenceValue: 72,
    icon: 'GraduationCap',
    actionText: 'Review Evidence'
  }
];

export const ANNUAL_SUMMARY_DATA = [
  { name: 'JAN', income: 60, expenses: 30, taxes: 10 },
  { name: 'FEB', income: 65, expenses: 40, taxes: 12 },
  { name: 'MAR', income: 80, expenses: 50, taxes: 15 },
  { name: 'APR', income: 70, expenses: 35, taxes: 12 },
  { name: 'MAY', income: 90, expenses: 55, taxes: 18 },
  { name: 'JUN', income: 85, expenses: 45, taxes: 14 },
  { name: 'JUL', income: 75, expenses: 42, taxes: 13 },
];
