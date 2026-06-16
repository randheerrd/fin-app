import { v4 as uuid } from 'uuid';

export const BANK_TRANSACTIONS = [
  { date: '2026-06-11', merchant: 'Swiggy', category: 'food', amount: 455, source: 'bank', atm: false },
  { date: '2026-06-11', merchant: 'Swiggy dinner', category: 'food', amount: 455, source: 'manual', atm: false, dup: true },
  { date: '2026-06-11', merchant: 'Uber', category: 'transport', amount: 284, source: 'bank', atm: false },
  { date: '2026-06-10', merchant: 'Blinkit', category: 'groceries', amount: 1240, source: 'bank', atm: false },
  { date: '2026-06-09', merchant: 'BookMyShow', category: 'entertainment', amount: 980, source: 'bank', atm: false },
  { date: '2026-06-09', merchant: 'Zomato', category: 'food', amount: 612, source: 'bank', atm: false },
  { date: '2026-06-08', merchant: 'ATM Withdrawal', category: 'cash', amount: 5000, source: 'bank', atm: true },
  { date: '2026-06-07', merchant: 'Myntra', category: 'shopping', amount: 2890, source: 'bank', atm: false },
  { date: '2026-06-07', merchant: 'Rapido', category: 'transport', amount: 130, source: 'bank', atm: false },
  { date: '2026-06-06', merchant: 'Netflix', category: 'subscriptions', amount: 649, source: 'bank', atm: false },
  { date: '2026-06-05', merchant: 'Apollo Pharmacy', category: 'health', amount: 430, source: 'bank', atm: false },
  { date: '2026-06-05', merchant: 'Swiggy Instamart', category: 'groceries', amount: 867, source: 'bank', atm: false },
  { date: '2026-06-04', merchant: 'Zomato', category: 'food', amount: 389, source: 'bank', atm: false },
  { date: '2026-06-03', merchant: 'Amazon', category: 'shopping', amount: 1549, source: 'bank', atm: false },
  { date: '2026-06-03', merchant: 'Auto fare', category: 'transport', amount: 80, source: 'manual', atm: false },
  { date: '2026-06-02', merchant: 'Spotify', category: 'subscriptions', amount: 119, source: 'bank', atm: false },
  { date: '2026-06-02', merchant: 'Big Bazaar', category: 'groceries', amount: 2230, source: 'bank', atm: false },
  { date: '2026-06-01', merchant: 'Swiggy', category: 'food', amount: 520, source: 'bank', atm: false },
  { date: '2026-06-01', merchant: 'Uber', category: 'transport', amount: 310, source: 'bank', atm: false },
];

export const enrichTransactionsWithIds = (txns) => {
  return txns.map(txn => ({
    id: uuid(),
    ...txn,
  }));
};

export const INITIAL_RECURRING = [
  { name: 'Rent', amount: 25000, day: '1st' },
  { name: 'Car EMI', amount: 12400, day: '5th' },
  { name: 'Netflix', amount: 649, day: '12th' },
  { name: 'Gym', amount: 2000, day: '1st' },
  { name: 'SIP Index fund', amount: 10000, day: '3rd' },
];
