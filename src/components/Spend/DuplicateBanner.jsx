import { AlertCircle } from 'lucide-react';

export default function DuplicateBanner({ transaction, onMerge, onKeepBoth }) {
  return (
    <tr className="bg-amber/5 border-b border-line">
      <td colSpan="5" className="px-6 py-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-amber mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber font-medium">
              Looks like a duplicate — you added this, then HDFC imported the same payment.
            </p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={onMerge}
                className="text-xs text-amber hover:underline transition-colors"
              >
                Merge (keep one)
              </button>
              <button
                onClick={onKeepBoth}
                className="text-xs text-amber hover:underline transition-colors"
              >
                They're different, keep both
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
