import { useState, useEffect, useRef } from 'react';
import './index.css';
import Landing from './components/Landing';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import OnboardingShell from './components/Onboarding/OnboardingShell';
import Dashboard from './components/Dashboard/Dashboard';
import Spend from './components/Spend/Spend';
import Goals from './components/Goals/Goals';
import Recurring from './components/Recurring/Recurring';
import Insights from './components/Insights/Insights';
import Settings from './components/Settings/Settings';
import AddExpenseModal from './components/modals/AddExpenseModal';
import AtmSplitModal from './components/modals/AtmSplitModal';
import SearchModal from './components/SearchModal';
import Toast from './components/Toast';
import { enrichTransactionsWithIds, BANK_TRANSACTIONS, INITIAL_RECURRING } from './data/seed';
import { getToday } from './lib/utils';
import { firebaseEnabled, logout } from './lib/firebase';
import { onUser, loadUserData, saveUserData } from './lib/userData';
import { aaEnabled, waitForConsent, createSession, waitForData, mapTransactions } from './lib/setu';
import {
  FRESH_DEMO_PHONE,
  isDemoPhone,
  generateDemoTransactions,
  DEMO_BANKS,
  DEMO_GOALS,
} from './data/demoSeed';

function App() {
  // Core state — 0 means "not set yet" so the dashboard shows the empty/prompt
  // state until the user actually enters income/budget (or a demo/real account
  // hydrates real values).
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [banks, setBanks] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [atmRemaining, setAtmRemaining] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [landingDone, setLandingDone] = useState(false);
  const [authScreen, setAuthScreen] = useState('landing'); // 'landing' | 'login'
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [hydrated, setHydrated] = useState(false); // user's saved data loaded
  // 'importing' when we return from the Setu approval page with a pending consent.
  const [aaImport, setAaImport] = useState(() =>
    aaEnabled && localStorage.getItem('aa_pending') ? 'importing' : 'idle'
  );

  // UI state
  const [activeView, setActiveView] = useState('dashboard');
  const [activeFilter] = useState(null);
  const [spendSearch, setSpendSearch] = useState(''); // merchant text from global search → filters Spend
  const [sipDismissed, setSipDismissed] = useState(false);

  // Modal state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAtmSplit, setShowAtmSplit] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [toast, setToast] = useState(null);
  const mainContentRef = useRef(null);

  // Resume a Setu AA bank-connect after the user returns from the approval page.
  useEffect(() => {
    if (aaImport !== 'importing') return;
    (async () => {
      let pending;
      try {
        pending = JSON.parse(localStorage.getItem('aa_pending') || 'null');
      } catch {
        pending = null;
      }
      if (!pending) {
        localStorage.removeItem('aa_pending');
        setAaImport('idle');
        return;
      }
      try {
        const consent = await waitForConsent(pending.consentId);
        if (consent.status !== 'ACTIVE') throw new Error('Consent not approved');
        const session = await createSession(pending.consentId);
        const data = await waitForData(session.id);
        setTransactions(mapTransactions(data));
        if (pending.income) setIncome(pending.income);
        if (pending.budget) setBudget(pending.budget);
        setBanks([{ name: 'Linked Bank', type: 'Savings account', mask: '····', synced: 'just now' }]);
        setLandingDone(true);
        setOnboardingDone(true);
        setActiveView('dashboard');
        setAaImport('idle');
      } catch (e) {
        console.error('AA import failed:', e);
        setAaImport('error');
      } finally {
        localStorage.removeItem('aa_pending');
      }
    })();
  }, [aaImport]);

  // Track the signed-in Firebase user (no-op in demo mode).
  useEffect(() => onUser(setFirebaseUser), []);

  // When a real user signs in, hydrate their saved data from Firestore.
  // (Demo accounts bypass Firebase — they're seeded in handleLogin.)
  useEffect(() => {
    if (!firebaseEnabled || !firebaseUser) return;
    let cancelled = false;
    loadUserData(firebaseUser.uid).then((data) => {
      if (cancelled) return;
      if (data && (data.transactions?.length || data.onboardingDone)) {
        setIncome(data.income ?? 0);
        setBudget(data.budget ?? 0);
        setTransactions(data.transactions ?? []);
        setGoals(data.goals ?? []);
        setBanks(data.banks ?? []);
        setRecurring(data.recurring ?? []);
        setAtmRemaining(data.atmRemaining ?? 0);
        setManualMode(!!data.manualMode);
        setLandingDone(true);
        setOnboardingDone(true);
        setActiveView('dashboard');
      } else {
        // New user — run onboarding; data will be saved under their uid.
        setLandingDone(true);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser]);

  // Persist app data for the signed-in user (debounced) once onboarded.
  useEffect(() => {
    if (!firebaseEnabled || !firebaseUser || !onboardingDone || !hydrated) return;

    const t = setTimeout(() => {
      saveUserData(firebaseUser.uid, {
        income,
        budget,
        transactions,
        goals,
        banks,
        recurring,
        atmRemaining,
        manualMode,
        onboardingDone: true,
      });
    }, 800);
    return () => clearTimeout(t);
  }, [firebaseUser, hydrated, onboardingDone, income, budget, transactions, goals, banks, recurring, atmRemaining, manualMode]);

  // Reset scroll when view changes or onboarding completes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeView, onboardingDone]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input
      const isInputFocused = document.activeElement.tagName === 'INPUT' ||
                            document.activeElement.tagName === 'TEXTAREA';

      if (e.key === 'n' || e.key === 'N') {
        if (!isInputFocused) {
          e.preventDefault();
          setShowAddExpense(true);
        }
      } else if (e.key === 'Escape') {
        setShowAddExpense(false);
        setShowAtmSplit(false);
        setShowSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Onboarding handlers
  const handleBankConnected = (selectedBanks, numbers) => {
    const enrichedTransactions = enrichTransactionsWithIds(BANK_TRANSACTIONS);
    setTransactions(enrichedTransactions);
    setAtmRemaining(4880); // 5000 - 120 already accounted
    setBanks(selectedBanks);
    setRecurring(INITIAL_RECURRING);
    if (numbers) {
      setIncome(numbers.income);
      setBudget(numbers.budget);
    }
    setOnboardingDone(true);
  };

  // Landing → signup enters onboarding; login is treated as a returning user
  // (seed their connected accounts and drop them straight on the dashboard).
  const DEFAULT_BANKS = [
    { name: 'HDFC Bank', type: 'Salary account', mask: '··4521', synced: 'just now' },
    { name: 'Axis Bank', type: 'Saving account', mask: '··8834', synced: 'just now' },
    { name: 'ICICI Bank', type: 'Saving account', mask: '··2291', synced: 'just now' },
  ];

  // Signup and login are distinct screens. With real Firebase both authenticate
  // by phone OTP, but signup leads into onboarding while login hydrates the
  // returning user's data (decided in the hydrate effect).
  // Signup → straight into onboarding (phone verification happens at step 3,
  // not as an upfront gate).
  const handleSignup = () => setLandingDone(true);

  // Demo/test account — preload 6 months of mock data, skip onboarding.
  const seedDemo = () => {
    setIncome(100000);
    setBudget(45000);
    setTransactions(generateDemoTransactions(6));
    setGoals(DEMO_GOALS);
    setBanks(DEMO_BANKS);
    setHydrated(true);
    setLandingDone(true);
    setOnboardingDone(true);
    setActiveView('dashboard');
  };

  const handleLogin = (phone) => {
    // Demo numbers bypass Firebase — route them locally.
    if (isDemoPhone(phone)) {
      if (phone === FRESH_DEMO_PHONE) {
        // Always start a fresh new-user onboarding flow.
        setOnboardingDone(false);
        setLandingDone(true);
      } else {
        seedDemo();
      }
      return;
    }
    if (firebaseEnabled) {
      // Auth state change triggers the hydrate effect, which sets the rest.
      setLandingDone(true);
      return;
    }
    handleBankConnected(DEFAULT_BANKS);
    setLandingDone(true);
    setActiveView('dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setTransactions([]);
    setGoals([]);
    setBanks([]);
    setRecurring([]);
    setAtmRemaining(0);
    setManualMode(false);
    setOnboardingDone(false);
    setLandingDone(false);
    setHydrated(false);
    setAuthScreen('landing');
    setActiveView('dashboard');
    localStorage.removeItem('aa_pending');
  };

  // Onboarding finished (after phone verification + bank discovery).
  //  • Linked at least one bank → pull in their data so the app is populated.
  //  • No bank linked (unchecked all) → manual mode, everything stays at 0.
  const handleOnboardingComplete = ({ income: inc, budget: bud, goal, banks = [] } = {}) => {
    const hasBanks = banks.length > 0;
    setBanks(banks);
    setManualMode(!hasBanks);
    setTransactions(hasBanks ? generateDemoTransactions(6) : []);
    setAtmRemaining(0);
    setIncome(inc ?? 0); // 0 = not set yet (goal path) → dashboard prompts for it
    setBudget(bud ?? 0);
    setGoals(goal ? [{ id: crypto.randomUUID(), ...goal, isNew: true, detected: false }] : []);
    setOnboardingDone(true);
    setActiveView('dashboard');
  };

  const handleLinkBankFromSettings = () => {
    setOnboardingDone(false); // re-run onboarding to connect
  };

  // Transaction handlers
  const addTransaction = (data) => {
    const newTxn = {
      id: crypto.randomUUID(),
      date: data.date,
      merchant: data.merchant,
      category: data.category,
      amount: data.amount,
      source: 'manual',
      atm: data.atm || false,
    };

    setTransactions(prev => {
      const updated = [...prev, newTxn];
      return updated.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    setShowAddExpense(false);
    showToast(`${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.amount)} added to ${data.category}`, 'success');
  };

  const updateTransaction = (updated) => {
    setTransactions((prev) =>
      prev
        .map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    showToast('Transaction updated', 'success');
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction deleted', 'success');
  };

  const addAtmSplit = (amount, description) => {
    if (amount > atmRemaining) {
      showToast(`Only ₹${atmRemaining.toLocaleString('en-IN')} left to account for`, 'error');
      return false;
    }

    const newTxn = {
      id: crypto.randomUUID(),
      date: getToday(),
      merchant: description || 'Cash (unaccounted)',
      category: 'cash',
      amount,
      source: 'manual',
      atm: false,
    };

    setTransactions(prev => [...prev, newTxn]);
    setAtmRemaining(prev => prev - amount);

    if (atmRemaining - amount === 0) {
      setShowAtmSplit(false);
      showToast('Your withdrawal is fully accounted for ✓', 'success');
    }

    return true;
  };

  const mergeDuplicate = (txnId) => {
    setTransactions(prev => prev.filter(t => t.id !== txnId));
    showToast('Merged — counted once. Your total just got more honest.', 'success');
  };

  const keepDuplicate = (txnId) => {
    setTransactions(prev =>
      prev.map(t => t.id === txnId ? { ...t, dup: false } : t)
    );
    showToast("Kept both. Won't flag this pair again.", 'success');
  };

  // Goal handlers
  const addGoal = (goalData) => {
    const newGoal = {
      id: crypto.randomUUID(),
      ...goalData,
      isNew: true,
      detected: false,
    };
    setGoals(prev => [...prev, newGoal]);
    showToast(`Goal "${goalData.name}" created`, 'success');
  };

  const updateGoal = (updated) => {
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? { ...g, ...updated } : g)));
    showToast('Goal updated', 'success');
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal deleted', 'success');
  };

  // Toast handler
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  // View content
  const renderView = () => {
    if (!landingDone) {
      if (authScreen === 'login') {
        return (
          <LoginPage
            mode="login"
            onBack={() => setAuthScreen('landing')}
            onSuccess={handleLogin}
            onSwitch={() => {
              setAuthScreen('landing');
              handleSignup();
            }}
          />
        );
      }
      return <Landing onSignup={handleSignup} onGoToLogin={() => setAuthScreen('login')} />;
    }

    if (!onboardingDone) {
      return <OnboardingShell onComplete={handleOnboardingComplete} />;
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            income={income}
            budget={budget}
            transactions={transactions}
            goals={goals}
            atmRemaining={atmRemaining}
            manualMode={manualMode}
            activeFilter={activeFilter}
            onAddExpense={() => setShowAddExpense(true)}
            onAtmSplit={() => setShowAtmSplit(true)}
            onViewAll={() => {
              setSpendSearch('');
              setActiveView('spend');
            }}
            onSetupBudget={() => setActiveView('settings')}
          />
        );
      case 'spend':
        return (
          <Spend
            transactions={transactions}
            onMergeDuplicate={mergeDuplicate}
            onKeepDuplicate={keepDuplicate}
            onAddExpense={() => setShowAddExpense(true)}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
            searchQuery={spendSearch}
            onClearSearch={() => setSpendSearch('')}
          />
        );
      case 'goals':
        return (
          <Goals
            goals={goals}
            transactions={transactions}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
            sipDismissed={sipDismissed}
            onDismissSip={() => setSipDismissed(true)}
            onAcceptSip={(goal) => {
              addGoal(goal);
              setSipDismissed(true);
            }}
          />
        );
      case 'recurring':
        return (
          <Recurring
            recurring={recurring}
            income={income}
            manualMode={manualMode}
            onLinkBank={handleLinkBankFromSettings}
          />
        );
      case 'insights':
        return (
          <Insights
            transactions={transactions}
            manualMode={manualMode}
            income={income}
            goals={goals}
            onLinkBank={handleLinkBankFromSettings}
          />
        );
      case 'settings':
        return (
          <Settings
            income={income}
            setIncome={setIncome}
            budget={budget}
            setBudget={setBudget}
            banks={banks}
            setBanks={setBanks}
            transactions={transactions}
            setTransactions={setTransactions}
            manualMode={manualMode}
            onLinkBank={handleLinkBankFromSettings}
            onLogout={firebaseEnabled ? handleLogout : null}
          />
        );
      default:
        return null;
    }
  };

  // Setu AA import screen (after returning from the bank approval page).
  if (aaImport !== 'idle') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        {aaImport === 'importing' ? (
          <>
            <div className="w-10 h-10 border-2 border-[#e5e7eb] border-t-[#0E3F2E] rounded-full animate-spin mb-6" />
            <p className="font-display text-2xl text-[#111827] mb-1">Importing your transactions…</p>
            <p className="text-sm text-[#6b7280]">Fetching securely from your bank via the Account Aggregator.</p>
          </>
        ) : (
          <>
            <p className="font-display text-2xl text-[#111827] mb-2">Couldn’t import your data</p>
            <p className="text-sm text-[#6b7280] mb-6">The bank connection wasn’t approved or timed out.</p>
            <button
              onClick={() => setAaImport('idle')}
              className="px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              Back to start
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${onboardingDone ? 'bg-[#0E3F2E]' : 'bg-white'}`}>
      {/* Sidebar */}
      {onboardingDone && (
        <Sidebar
          activeView={activeView}
          setActiveView={(v) => {
            setSpendSearch('');
            setActiveView(v);
          }}
          onAddExpense={() => setShowAddExpense(true)}
          onSearch={() => setShowSearch(true)}
        />
      )}

      {/* Main content — in-app sits in a rounded white surface with a 4px green frame */}
      {onboardingDone ? (
        <div className="flex-1 ml-56 overflow-hidden p-1">
          <div className="h-full bg-white rounded-2xl overflow-hidden">
            <div ref={mainContentRef} className="h-full overflow-y-auto">
              {renderView()}
            </div>
          </div>
        </div>
      ) : (
        <div ref={mainContentRef} className="flex-1 overflow-auto">
          {renderView()}
        </div>
      )}

      {/* Modals */}
      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          onSave={addTransaction}
        />
      )}

      {showAtmSplit && atmRemaining > 0 && (
        <AtmSplitModal
          atmRemaining={atmRemaining}
          onClose={() => setShowAtmSplit(false)}
          onAddSplit={addAtmSplit}
        />
      )}

      {/* Search */}
      {showSearch && (
        <SearchModal
          transactions={transactions}
          onClose={() => setShowSearch(false)}
          onNavigate={setActiveView}
          onOpenMerchant={(merchant) => {
            setSpendSearch(merchant);
            setActiveView('spend');
          }}
          onAddExpense={() => setShowAddExpense(true)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
