export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', emoji: '🍜' },
  { id: 'transport', name: 'Transport', emoji: '🛺' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'groceries', name: 'Groceries', emoji: '🥬' },
  { id: 'subscriptions', name: 'Subscriptions', emoji: '📺' },
  { id: 'health', name: 'Health', emoji: '💊' },
  { id: 'rent', name: 'Rent & Housing', emoji: '🏠' },
  { id: 'emi', name: 'EMI & Loans', emoji: '🏦' },
  { id: 'utilities', name: 'Utilities & Bills', emoji: '💡' },
  { id: 'cash', name: 'Cash (untracked)', emoji: '💵' },
];

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id);
export const getCategoryName = (id) => CATEGORIES.find(c => c.id === id)?.name || 'Other';
export const getCategoryEmoji = (id) => CATEGORIES.find(c => c.id === id)?.emoji || '💰';
