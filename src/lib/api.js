// Onboarding's account-discovery demo mock. There is no real backend behind
// this anymore (the real integration is the Setu AA proxy in lib/setu.js) —
// this always resolves mock data so the onboarding demo stays fast and clean,
// with no failed network calls.
export const accountAggregatorAPI = {
  async initiateConsent() {
    return { consent_id: `mock-consent-${Date.now()}` };
  },

  async verifyOTP() {
    return { success: true, token: `mock-token-${Date.now()}` };
  },

  async fetchAccounts() {
    // StepDiscovery.jsx supplies its own MOCK_ACCOUNTS fallback when this
    // returns no accounts, so an empty list is enough here.
    return { accounts: [] };
  },

  async fetchTransactions() {
    return { transactions: [] };
  },

  async getAccountDetails() {
    return null;
  },
};

export default accountAggregatorAPI;
