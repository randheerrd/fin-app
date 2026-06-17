export const fmt = (num) => {
  if (typeof num !== 'number') return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
};

// For money <input>s: show digits with Indian comma grouping (e.g. "1,00,000").
// Pair with `digitsOnly` when reading the number back.
export const groupINR = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits ? Number(digits).toLocaleString('en-IN') : '';
};

export const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

export const fmtShort = (num) => {
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num}`;
};

export const getDateString = (date) => {
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
};

export const getToday = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getCurrentMonthYear = () => {
  const now = new Date();
  const month = now.toLocaleString('en-IN', { month: 'long' });
  const year = now.getFullYear();
  return `${month} ${year}`;
};

export const getDayOfMonth = () => {
  return new Date().getDate();
};

export const getDaysInMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

export const sortTransactionsByDate = (txns) => {
  return [...txns].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getCategoryTotals = (transactions) => {
  const totals = {};
  transactions
    .filter(t => !t.atm)
    .forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
  return totals;
};

export const getTopCategories = (transactions, limit = 5) => {
  const totals = getCategoryTotals(transactions);
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([cat, amount]) => ({ category: cat, amount }));
};

export const getTotalSpent = (transactions, atmRemaining = 0) => {
  const nonAtm = transactions
    .filter(t => !t.atm)
    .reduce((sum, t) => sum + t.amount, 0);
  return nonAtm + atmRemaining;
};

export const getMonthSpent = (transactions, month = null) => {
  const targetMonth = month || getCurrentMonthYear();
  return transactions
    .filter(t => {
      const txnMonth = new Date(t.date).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      return txnMonth === targetMonth && !t.atm;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getCategorySpent = (transactions, categoryId, atmRemaining = 0) => {
  let total = transactions
    .filter(t => !t.atm && t.category === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);

  if (categoryId === 'cash' && atmRemaining > 0) {
    total += atmRemaining;
  }

  return total;
};
