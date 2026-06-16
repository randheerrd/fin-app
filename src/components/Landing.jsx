import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Target,
  Lock,
  Landmark,
  Sparkles,
  LineChart,
  ShieldCheck,
  Copy,
  Wallet,
  PiggyBank,
  Bell,
  Check,
} from 'lucide-react';
import FinAppLogo from './FinAppLogo';
import BrandLogo from './BrandLogo';
import { bankBrand } from '../lib/logos';

// Fade/slide a block in when it scrolls into view.
function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

const FEATURES = [
  { icon: Landmark, title: 'All your banks, one view', body: 'Link every account in one tap through India’s RBI-regulated Account Aggregator. Read-only — we never move money.' },
  { icon: Sparkles, title: 'Automatic categorization', body: 'Swiggy → Food, Uber → Transport, Netflix → Subscriptions. Every transaction sorted the moment it lands.' },
  { icon: Target, title: 'Goals that track themselves', body: 'Set a target, link the spending that matters, and watch progress update live — no manual logging.' },
  { icon: LineChart, title: 'Insights that pay off', body: 'Month-over-month trends, weekend patterns, and which subscriptions are quietly draining you.' },
  { icon: Copy, title: 'Duplicate detection', body: 'Added a cash expense your bank also imported? FinApp catches the double and merges it in a tap.' },
  { icon: ShieldCheck, title: 'Private by design', body: '256-bit encryption, read-only access, and credentials that never touch our servers. Revoke anytime.' },
];

const STEPS = [
  { icon: Landmark, title: 'Connect your bank', body: 'Enter your phone number. The Account Aggregator finds your accounts — no hunting through 50 banks.' },
  { icon: Sparkles, title: 'We sort everything', body: 'Six months of history imported and auto-categorized in seconds, across every linked account.' },
  { icon: Wallet, title: 'See clearly & act', body: 'Track goals, catch leaks, and know exactly where every rupee goes — updated daily.' },
];

const BANKS = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'];

/* Framed product shot — a faux browser window with a mini dashboard */
function ProductShot() {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute -inset-x-8 -top-8 bottom-0 bg-gradient-to-b from-[#BFE0CD]/60 to-transparent blur-3xl -z-10" />
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_30px_60px_-20px_rgba(16,24,40,0.25)] overflow-hidden transition-transform duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-24px_rgba(16,24,40,0.35)]">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#f3f4f6] bg-[#f9fafb]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#1B5740]" />
          <span className="ml-3 text-xs text-[#9ca3af]">app.finapp.in/dashboard</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              ['Total spent', '₹19,069'],
              ['Budget left', '₹25,931'],
              ['Top category', 'Shopping'],
              ['Transactions', '19'],
            ].map(([l, v]) => (
              <div key={l} className="border border-[#f3f4f6] rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wide text-[#9ca3af]">{l}</p>
                <p className="text-base font-bold text-[#111827] mt-1">{v}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#f3f4f6] rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-3">This month</p>
              <p className="text-lg font-bold text-[#111827] mb-2">₹19,069 <span className="text-sm text-[#9ca3af] font-medium">/ ₹45,000</span></p>
              <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden mb-4">
                <div
                  className="h-full bg-[#0E3F2E] rounded-full transition-[width] duration-1000 ease-out"
                  style={{ width: grown ? '42%' : '0%' }}
                />
              </div>
              {[['Shopping', '78%'], ['Groceries', '70%'], ['Food', '44%']].map(([n, w]) => (
                <div key={n} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#374151]">{n}</span>
                  </div>
                  <div className="w-full bg-[#f3f4f6] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-[#1B5740] rounded-full transition-[width] duration-1000 ease-out"
                      style={{ width: grown ? w : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-[#f3f4f6] rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-3">Weekly spend</p>
              <div className="flex items-end justify-between gap-2 h-32">
                {[40, 70, 100, 95, 55, 35, 30].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-md transition-[height] duration-700 ease-out ${i >= 5 ? 'bg-[#F08A5D]' : 'bg-[#1B5740]'}`}
                    style={{ height: grown ? `${h}%` : '0%', transitionDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#0E3F2E] bg-[#E7F5EE] px-3 py-1.5 rounded-full">
      {children}
    </span>
  );
}

export default function Landing({ onSignup, onGoToLogin }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#f3f4f6]">
        <div className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto w-full">
          <FinAppLogo color="#0E3F2E" className="h-7 w-auto" />
          <div className="flex items-center gap-2">
            <button
              onClick={onGoToLogin}
              className="px-5 py-2.5 text-sm font-medium text-[#374151] hover:text-[#111827] transition-colors"
            >
              Log in
            </button>
            <button
              onClick={onSignup}
              className="px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero — centered, with a prominent product shot */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-[#E7F5EE] to-white -z-10" />
        <div className="max-w-3xl mx-auto px-8 pt-20 pb-12 text-center">
          <Eyebrow>Personal finance, on autopilot</Eyebrow>
          <h1 className="font-display text-5xl lg:text-6xl text-[#111827] leading-[1.05] mt-6 mb-6">
            Every rupee, finally accounted for.
          </h1>
          <p className="text-lg text-[#6b7280] mb-9 max-w-xl mx-auto leading-relaxed">
            FinApp connects all your bank accounts, auto-sorts every transaction, and turns your spending into
            goals you actually hit — without a single spreadsheet.
          </p>
          <div className="flex items-center justify-center gap-3 mb-5">
            <button
              onClick={onSignup}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#0E3F2E] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              Get started free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onGoToLogin}
              className="px-6 py-3.5 border border-[#e5e7eb] text-[#374151] text-sm font-semibold rounded-lg hover:bg-[#f9fafb] transition-colors"
            >
              Log in
            </button>
          </div>
          <p className="text-xs text-[#9ca3af] flex items-center justify-center gap-1.5">
            <Lock size={12} />
            256-bit encryption · Read-only access · Setup in 2 minutes
          </p>
        </div>
        <div className="px-8 pb-20">
          <ProductShot />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#f3f4f6] bg-[#f9fafb]">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[#6b7280]">Works with every major Indian bank</p>
          <div className="flex items-center gap-6">
            {BANKS.map((b) => (
              <BrandLogo key={b} domain={bankBrand(b).domain} label={b} bg={bankBrand(b).bg} size={30} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works — polished numbered cards */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-display text-4xl text-[#111827] mt-5 mb-3">Up and running in two minutes</h2>
          <p className="text-[#6b7280]">No statements to upload. No categories to set up. It just works.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <Reveal
              key={title}
              delay={i * 100}
              className="relative border border-[#ECEEF0] rounded-2xl p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <span className="absolute top-6 right-6 text-5xl font-display text-[#CBE0D4] leading-none">
                {i + 1}
              </span>
              <div className="w-12 h-12 rounded-xl bg-[#E7F5EE] flex items-center justify-center mb-5">
                <Icon size={22} className="text-[#0E3F2E]" />
              </div>
              <h3 className="font-semibold text-[#111827] mb-2">{title}</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f9fafb] border-y border-[#f3f4f6]">
        <div className="max-w-6xl mx-auto px-8 py-24">
          <div className="max-w-xl mb-12">
            <Eyebrow>Features</Eyebrow>
            <h2 className="font-display text-4xl text-[#111827] mt-5 mb-3">Everything your bank app should’ve been</h2>
            <p className="text-[#6b7280]">One place to understand your money — built on India’s Account Aggregator network.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={(i % 3) * 100}
                className="bg-white border border-[#ECEEF0] rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
              >
                <div className="w-11 h-11 rounded-xl bg-[#E7F5EE] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#0E3F2E]" />
                </div>
                <h3 className="font-semibold text-[#111827] mb-1.5">{title}</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Insights deep-dive */}
      <section className="max-w-6xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Eyebrow><LineChart size={13} /> Insights</Eyebrow>
          <h2 className="font-display text-4xl text-[#111827] mt-5 mb-4">Find the leaks you didn’t know you had</h2>
          <p className="text-[#6b7280] mb-6 leading-relaxed">
            FinApp watches the patterns so you don’t have to — “48% of your spending happens on weekends,”
            “₹768/month across 2 subscriptions,” “₹2,713 more than last month.” Clear, plain-language nudges,
            never noise.
          </p>
          <ul className="space-y-3">
            {[
              [Bell, 'Weekly spend summaries & budget alerts'],
              [LineChart, 'Month-over-month and category trends'],
              [Wallet, 'Untracked cash reminders after ATM withdrawals'],
            ].map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-3 text-sm text-[#374151]">
                <span className="w-7 h-7 rounded-lg bg-[#E7F5EE] flex items-center justify-center">
                  <Icon size={15} className="text-[#0E3F2E]" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-[#ECEEF0] rounded-2xl p-6 shadow-[0_20px_40px_-24px_rgba(16,24,40,0.25)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#E7F5EE] text-[#0E3F2E]">Month over month</span>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FEECEC] text-[#DC2626]">↑ 12% vs May</span>
          </div>
          <p className="text-[#111827] mb-5">You’ve spent <span className="font-semibold">₹2,713</span> more than May at this point in the month.</p>
          {[['This month', '100%'], ['May 2025', '78%']].map(([label, w]) => (
            <div key={label} className="mb-3">
              <p className="text-xs text-[#9ca3af] uppercase tracking-wide mb-1.5">{label}</p>
              <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden">
                <div className="h-full bg-[#0E3F2E] rounded-full" style={{ width: w }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Goals deep-dive */}
      <section className="bg-[#f9fafb] border-y border-[#f3f4f6]">
        <div className="max-w-6xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-white border border-[#ECEEF0] rounded-2xl p-6 shadow-[0_20px_40px_-24px_rgba(16,24,40,0.25)]">
            {[
              ['Nepal Trip', '30%', 'bg-[#F08A5D]'],
              ['For My Car', '80%', 'bg-[#0E3F2E]'],
              ['Emergency Fund', '90%', 'bg-[#0E3F2E]'],
            ].map(([name, w, color]) => (
              <div key={name} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#111827]">{name}</span>
                  <span className="text-[#9ca3af]">{w}</span>
                </div>
                <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: w }} />
                </div>
              </div>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow><PiggyBank size={13} /> Goals</Eyebrow>
            <h2 className="font-display text-4xl text-[#111827] mt-5 mb-4">Turn spending into something that matters</h2>
            <p className="text-[#6b7280] mb-6 leading-relaxed">
              Name a goal — a trip, a car, an emergency fund — link the categories that feed it, and FinApp keeps
              score automatically. It even spots recurring savings like a SIP and offers to track them for you.
            </p>
            <ul className="space-y-3 mb-7">
              {['Auto-detected from your bank history', 'Linked to real spending categories', 'On-track / needs-attention at a glance'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-[#374151]">
                  <Check size={16} className="text-[#0E3F2E]" />
                  {t}
                </li>
              ))}
            </ul>
            <button
              onClick={onSignup}
              className="flex items-center gap-2 px-6 py-3 bg-[#0E3F2E] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              Start your first goal
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center bg-gradient-to-br from-[#0E3F2E] to-[#06241A]">
          <h2 className="font-display text-4xl lg:text-5xl text-white mb-4">Ready to see where your money goes?</h2>
          <p className="text-white/70 max-w-md mx-auto mb-8">
            Connect your bank in two minutes. Free to start, private by design.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onSignup}
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#0E3F2E] text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Get started free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onGoToLogin}
              className="px-6 py-3.5 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#f3f4f6]">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <FinAppLogo color="#0E3F2E" className="h-6 w-auto" />
          <p className="text-xs text-[#9ca3af]">© 2026 FinApp · Built on the RBI Account Aggregator network</p>
        </div>
      </footer>
    </div>
  );
}
