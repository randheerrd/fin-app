export const CATEGORIES = [
  { id: 'food', name: 'Food & Dinning', emoji: '🍴', chip: { bg: '#FBF1E5', text: '#B45309' }, dot: '#0E3F2E' },
  { id: 'transport', name: 'Transport', emoji: '🛺', chip: { bg: '#EEF1FB', text: '#4F5BD5' }, dot: '#4F5BD5' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍', chip: { bg: '#E7F5EE', text: '#15803D' }, dot: '#22A06B' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬', chip: { bg: '#F3E8FF', text: '#7C3AED' }, dot: '#7C3AED' },
  { id: 'groceries', name: 'Groceries', emoji: '🛒', chip: { bg: '#FCE7EC', text: '#DB2777' }, dot: '#7DD3C0' },
  { id: 'subscriptions', name: 'Subscription', emoji: '🎟', chip: { bg: '#F3E8FF', text: '#7C3AED' }, dot: '#A78BFA' },
  { id: 'health', name: 'Health & Pharmacy', emoji: '🩺', chip: { bg: '#E0F2F1', text: '#0D9488' }, dot: '#0D9488' },
  { id: 'rent', name: 'Rent & Housing', emoji: '🏠', chip: { bg: '#F3F4F6', text: '#374151' }, dot: '#9CA3AF' },
  { id: 'emi', name: 'EMI & Loans', emoji: '🏦', chip: { bg: '#F3F4F6', text: '#374151' }, dot: '#6B7280' },
  { id: 'utilities', name: 'Utilities & Bills', emoji: '💡', chip: { bg: '#FEF9C3', text: '#A16207' }, dot: '#EAB308' },
  { id: 'cash', name: 'Cash', emoji: '💵', chip: { bg: '#E0F2F1', text: '#0D9488' }, dot: '#0D9488' },
];

// Ordered palette for charts (donut / breakdown) — by visual prominence.
export const CHART_PALETTE = ['#22A06B', '#0E3F2E', '#7DD3C0', '#0D9488', '#F59E0B', '#A78BFA', '#4F5BD5'];

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id);
export const getCategoryName = (id) => CATEGORIES.find(c => c.id === id)?.name || 'Other';
export const getCategoryEmoji = (id) => CATEGORIES.find(c => c.id === id)?.emoji || '💰';
export const getCategoryChip = (id) => CATEGORIES.find(c => c.id === id)?.chip || { bg: '#F3F4F6', text: '#374151' };
