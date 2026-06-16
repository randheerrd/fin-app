import {
  Utensils,
  Bus,
  ShoppingBag,
  Clapperboard,
  ShoppingCart,
  Ticket,
  Pill,
  Home,
  Landmark,
  Lightbulb,
  Banknote,
  Tag,
} from 'lucide-react';

const MAP = {
  food: Utensils,
  transport: Bus,
  shopping: ShoppingBag,
  entertainment: Clapperboard,
  groceries: ShoppingCart,
  subscriptions: Ticket,
  health: Pill,
  rent: Home,
  emi: Landmark,
  utilities: Lightbulb,
  cash: Banknote,
};

export default function CategoryIcon({ id, size = 14, className }) {
  const Icon = MAP[id] || Tag;
  return <Icon size={size} className={className} />;
}
