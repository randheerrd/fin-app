export default function Landing({ onStart }) {
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="border-2 border-[#1B3A2F] rounded-2xl w-full max-w-5xl mx-8 h-[calc(100vh-48px)] flex flex-col items-center justify-center gap-0">
        {/* Logo badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#1B3A2F] flex items-center justify-center mb-6 shadow-md">
          <svg viewBox="0 0 32 32" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8h16v3H11.5v4.5H22v3H11.5V24H8V8z" fill="white"/>
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-[#111827] mb-3 tracking-tight">FinApp</h1>
        <p className="text-[#6b7280] text-base mb-10 text-center max-w-sm">
          A smarter way for busy professionals to manage money
        </p>

        <button
          onClick={onStart}
          className="px-8 py-3 bg-[#1B3A2F] text-white text-sm font-semibold rounded-xl hover:bg-[#142D24] active:scale-[0.98] transition-all shadow-sm"
        >
          Get started
        </button>
      </div>
    </div>
  );
}
