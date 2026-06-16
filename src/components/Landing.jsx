import { useState, useRef } from 'react';
import { ArrowRight, ShieldCheck, PieChart, Target, X, Lock, Pencil } from 'lucide-react';
import FinAppLogo from './FinAppLogo';

function Logo() {
  return <FinAppLogo color="#0E3F2E" className="h-7 w-auto" />;
}

function LoginModal({ onClose, onSuccess, onSignup }) {
  const [stage, setStage] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleOtp = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...otp];
    next[i] = v.slice(-1);
    setOtp(next);
    if (v && i < 5) refs[i + 1].current?.focus();
    if (next.every((d) => d)) setTimeout(onSuccess, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-display text-3xl text-[#111827]">
              {stage === 'phone' ? 'Welcome back' : 'Enter the code'}
            </h2>
            <p className="text-sm text-[#6b7280] mt-1 flex items-center gap-1.5">
              {stage === 'phone' ? (
                'Log in with your phone number.'
              ) : (
                <>
                  Sent to +91 {phone}
                  <button
                    onClick={() => setStage('phone')}
                    className="inline-flex items-center gap-1 text-[#0E3F2E] font-medium hover:underline"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                </>
              )}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        {stage === 'phone' ? (
          <>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Mobile number</label>
            <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#0E3F2E] mb-5">
              <span className="pl-4 pr-2 py-3 text-[#6b7280] text-sm select-none">+91</span>
              <input
                autoFocus
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={(e) => e.key === 'Enter' && phone.length === 10 && setStage('otp')}
                placeholder="9876543210"
                className="flex-1 pr-4 py-3 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
            </div>
            <button
              onClick={() => setStage('otp')}
              disabled={phone.length !== 10}
              className="w-full py-3 bg-[#0E3F2E] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send code
            </button>
          </>
        ) : (
          <>
            <div className="flex gap-2.5 justify-center items-center mb-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {i === 3 && <span className="text-[#9ca3af] font-bold">·</span>}
                  <input
                    ref={refs[i]}
                    autoFocus={i === 0}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleOtp(i, e.target.value)}
                    onKeyDown={(e) => e.key === 'Backspace' && !otp[i] && i > 0 && refs[i - 1].current?.focus()}
                    className="w-12 h-14 text-xl text-center border border-[#e5e7eb] rounded-lg text-[#111827] outline-none focus:border-[#0E3F2E] transition-colors"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={onSuccess}
              disabled={otp.some((d) => !d)}
              className="w-full py-3 bg-[#0E3F2E] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Verify &amp; log in
            </button>
          </>
        )}

        <p className="text-xs text-[#9ca3af] flex items-center justify-center gap-1.5 mt-4">
          <Lock size={11} />
          Phone login only · OTP-secured
        </p>

        <p className="text-sm text-[#6b7280] text-center mt-5">
          New to FinApp?{' '}
          <button onClick={onSignup} className="text-[#0E3F2E] font-medium hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: PieChart, title: 'See where it goes', body: 'Every transaction auto-categorized across all your accounts — no spreadsheets.' },
  { icon: Target, title: 'Hit your goals', body: 'Turn everyday spending into goals you actually reach, tracked automatically.' },
  { icon: ShieldCheck, title: 'Private by design', body: 'Read-only access through RBI’s Account Aggregator. We never move your money.' },
];

export default function Landing({ onSignup, onLogin }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <Logo />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogin(true)}
            className="px-5 py-2.5 text-sm font-medium text-[#374151] hover:text-[#111827] transition-colors"
          >
            Log in
          </button>
          <button
            onClick={onSignup}
            className="px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-8 grid lg:grid-cols-2 gap-16 items-center py-20">
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[#0E3F2E] bg-[#E7F5EE] px-3 py-1.5 rounded-full mb-6">
            Personal finance, on autopilot
          </span>
          <h1 className="font-display text-5xl lg:text-6xl text-[#111827] leading-[1.08] mb-6">
            Every rupee, finally accounted for.
          </h1>
          <p className="text-lg text-[#6b7280] mb-10 max-w-md leading-relaxed">
            FinApp connects your bank through India’s RBI-regulated Account Aggregator, auto-sorts every
            transaction, and turns spending into goals you actually hit.
          </p>
          <div className="flex items-center gap-3 mb-7">
            <button
              onClick={onSignup}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#0E3F2E] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              Get started free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-3.5 border border-[#e5e7eb] text-[#374151] text-sm font-semibold rounded-lg hover:bg-[#f9fafb] transition-colors"
            >
              Log in
            </button>
          </div>
          <p className="text-xs text-[#9ca3af] flex items-center gap-1.5">
            <Lock size={12} />
            256-bit encryption · Read-only access · Setup in 2 minutes
          </p>
        </div>

        {/* App preview */}
        <div className="relative">
          <div className="bg-[#0E3F2E] rounded-3xl p-7 shadow-2xl">
            <div className="bg-white rounded-2xl p-6">
              <p className="text-xs text-[#9ca3af] mb-1">June 2026 · spent this month</p>
              <p className="text-3xl font-bold text-[#111827] mb-5">₹31,240</p>
              <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden mb-1.5">
                <div className="h-full bg-[#0E3F2E] rounded-full" style={{ width: '62%' }} />
              </div>
              <p className="text-xs text-[#9ca3af] mb-6">62% of ₹50,000 budget</p>
              <div className="flex items-end justify-between gap-2 h-28">
                {[40, 70, 100, 95, 55, 35, 30].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-md ${i >= 5 ? 'bg-[#F08A5D]' : 'bg-[#0E3F2E]'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-[#f9fafb] border-t border-[#f3f4f6]">
        <div className="max-w-6xl mx-auto px-8 py-20 grid md:grid-cols-3 gap-10">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <div className="w-11 h-11 rounded-xl bg-[#E7F5EE] flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#0E3F2E]" />
              </div>
              <h3 className="font-semibold text-[#111827] mb-2">{title}</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full px-8 py-8 flex items-center justify-between">
        <Logo />
        <p className="text-xs text-[#9ca3af]">© 2026 FinApp · Built on the RBI Account Aggregator network</p>
      </footer>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={onLogin}
          onSignup={() => {
            setShowLogin(false);
            onSignup();
          }}
        />
      )}
    </div>
  );
}
