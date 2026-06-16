export default function DuplicateBanner({ transaction, onMerge, onKeepBoth }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[#FBF7EF] border border-[#F3EAD8] rounded-xl px-5 py-4 mb-5">
      <div>
        <p className="text-sm font-semibold text-[#111827]">Looks like a duplicate.</p>
        <p className="text-sm text-[#9ca3af] mt-0.5">
          You added "{transaction.merchant}", then HDFC imported the same payment.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onMerge}
          className="px-4 py-2 bg-white border border-[#e5e7eb] text-sm font-medium text-[#374151] rounded-lg hover:bg-[#f9fafb] transition-colors"
        >
          Merge Them
        </button>
        <button
          onClick={onKeepBoth}
          className="px-4 py-2 bg-white border border-[#e5e7eb] text-sm font-medium text-[#374151] rounded-lg hover:bg-[#f9fafb] transition-colors"
        >
          Keep Both
        </button>
      </div>
    </div>
  );
}
