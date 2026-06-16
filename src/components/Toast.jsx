export default function Toast({ message, type = 'info' }) {
  const bg = type === 'success' ? 'bg-[#0E3F2E]' : type === 'error' ? 'bg-red-500' : 'bg-[#374151]';
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg ${bg} text-white text-sm font-medium z-50 shadow-lg`}>
      {message}
    </div>
  );
}
