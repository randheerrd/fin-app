import { AlertCircle } from 'lucide-react';

export default function DuplicateBanner({ transaction, onMerge, onKeepBoth }) {
  return (
    <tr className="bg-amber-50/80">
      <td colSpan="5" className="px-5 py-3 border-b border-amber-100">
        <div className="flex items-start gap-2.5">
          <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-amber-700">
              Looks like a duplicate. You added "{transaction.merchant}", then HDFC imported the same payment.
            </p>
            <div className="flex gap-4 mt-2">
              <button onClick={onMerge} className="text-xs text-amber-600 hover:underline">
                Merge (keep one)
              </button>
              <button onClick={onKeepBoth} className="text-xs text-amber-600 hover:underline">
                Keep both
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
