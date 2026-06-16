export default function Toast({ message, type = 'info' }) {
  const bgColor = type === 'success' ? 'bg-sage' : type === 'error' ? 'bg-rose' : 'bg-text-dim';
  const textColor = 'text-bg';

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg ${bgColor} ${textColor} text-sm font-medium animate-slide-up z-50`}>
      {message}
    </div>
  );
}
