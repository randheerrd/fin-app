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
import { firebaseEnabled } from './lib/firebase';
import { onUser, loadUserData, saveUserData } from './lib/userData';

function App() {
  // Core state
  const [income, setIncome] = useState(75000);
  const [budget, setBudget] = useState(45000);
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

  // UI state
  const [activeView, setActiveView] = useState('dashboard');
  const [activeFilter, setActiveFilter] = useState(null);
  const [sipDismissed, setSipDismissed] = useState(false);
  const [linkingMode, setLinkingMode] = useState(false);

  // Modal state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAtmSplit, setShowAtmSplit] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [toast, setToast] = useState(null);
  const mainContentRef = useRef(null);

  // Track the signed-in Firebase user (no-op in demo mode).
  useEffect(() => onUser(setFirebaseUser), []);

  // When a real user signs in, hydrate their saved data from Firestore.
  useEffect(() => {
    if (!firebaseEnabled || !firebaseUser) return;
    let cancelled = false;
    loadUserData(firebaseUser.uid).then((data) => {
      if (cancelled) return;
      if (data && (data.transactions?.length || data.onboardingDone)) {
        setIncome(data.income ?? 75000);
        setBudget(data.budget ?? 45000);
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

  // With real Firebase, phone OTP is the single entry point — first-time users
  // are routed to it too, then the hydrate effect decides onboarding vs dashboard.
  const handleSignup = () => {
    if (firebaseEnabled) {
      setAuthScreen('login');
      return;
    }
    setLandingDone(true);
  };

  const handleLogin = () => {
    if (firebaseEnabled) {
      // Auth state change triggers the hydrate effect, which sets the rest.
      setLandingDone(true);
      return;
    }
    handleBankConnected(DEFAULT_BANKS);
    setLandingDone(true);
    setActiveView('dashboard');
  };

  const handleManualMode = () => {
    setTransactions([]);
    setAtmRemaining(0);
    setBanks([]);
    setManualMode(true);
    setOnboardingDone(true);
  };

  const handleLinkBankFromSettings = () => {
    setLinkingMode(true);
    setOnboardingDone(false);
  };

  const handleLinkBankComplete = (selectedBanks) => {
    setBanks(prev => [...prev, ...selectedBanks]);
    setLinkingMode(false);
    setOnboardingDone(true);
    setActiveView('settings');
    showToast('Bank connected', 'success');
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
            onBack={() => setAuthScreen('landing')}
            onSuccess={handleLogin}
            onSignup={handleSignup}
          />
        );
      }
      return <Landing onSignup={handleSignup} onGoToLogin={() => setAuthScreen('login')} />;
    }

    if (!onboardingDone) {
      return (
        <OnboardingShell
          onBankConnected={handleBankConnected}
          onManualMode={handleManualMode}
          onLinkBank={handleLinkBankFromSettings}
          linkingMode={linkingMode}
          onLinkBankComplete={handleLinkBankComplete}
        />
      );
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
            setActiveFilter={setActiveFilter}
            onAddExpense={() => setShowAddExpense(true)}
            onAtmSplit={() => setShowAtmSplit(true)}
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
          />
        );
      default:
        return null;
    }
  };

  const handleRestart = () => {
    if (confirm('Restart demo? All data will be lost.')) {
      setTransactions([]);
      setGoals([]);
      setBanks([]);
      setRecurring([]);
      setAtmRemaining(0);
      setManualMode(false);
      setOnboardingDone(false);
      setLandingDone(false);
      setAuthScreen('landing');
      setActiveView('dashboard');
      setActiveFilter(null);
      setSipDismissed(false);
      setShowAddExpense(false);
      setShowAtmSplit(false);
      showToast('Demo restarted', 'success');
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${onboardingDone ? 'bg-[#0E3F2E]' : 'bg-white'}`}>
      {/* Sidebar */}
      {onboardingDone && (
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onAddExpense={() => setShowAddExpense(true)}
          onSearch={() => setShowSearch(true)}
          onRestart={handleRestart}
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
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
