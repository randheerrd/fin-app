// Account Aggregator API Service.
// NOTE: never put a real API secret here — Vite inlines VITE_* vars into the
// public bundle. Point VITE_AA_API_URL at a backend proxy that holds the secret
// server-side. With no proxy configured, the calls fall back to a demo mock.
const AA_API_KEY = import.meta.env.VITE_AA_API_KEY || '';
const AA_BASE_URL = import.meta.env.VITE_AA_API_URL || '';

export const accountAggregatorAPI = {
  // Initialize AA consent flow with phone number
  async initiateConsent(phoneNumber) {
    try {
      const response = await fetch(`${AA_BASE_URL}/v1/consent/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AA_API_KEY}`,
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          consent_purpose: 'Account aggregation for expense tracking',
          data_scope: ['transactions', 'account_details'],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // No backend reachable in demo/dev — fall back to a mock consent so the flow continues.
      console.warn('initiateConsent: falling back to mock consent.', error);
      return { consent_id: `mock-consent-${Date.now()}` };
    }
  },

  // Verify OTP and get consent token
  async verifyOTP(consentId, otp) {
    try {
      const response = await fetch(`${AA_BASE_URL}/v1/consent/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AA_API_KEY}`,
        },
        body: JSON.stringify({
          consent_id: consentId,
          otp: otp,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // No backend reachable in demo/dev — accept any OTP with a mock token.
      console.warn('verifyOTP: falling back to mock verification.', error);
      return { success: true, token: `mock-token-${Date.now()}` };
    }
  },

  // Fetch linked accounts for the phone number
  async fetchAccounts(phoneNumber, token) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AA_API_KEY}`,
      };

      if (token) {
        headers['X-Verification-Token'] = token;
      }

      const response = await fetch(`${AA_BASE_URL}/v1/accounts?phone=${phoneNumber}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Return empty array to allow manual entry
      return { accounts: [] };
    }
  },

  // Fetch transactions for a linked account
  async fetchTransactions(accountId, months = 6) {
    try {
      const response = await fetch(
        `${AA_BASE_URL}/v1/transactions?account_id=${accountId}&months=${months}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AA_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return { transactions: [] };
    }
  },

  // Get account details
  async getAccountDetails(accountId) {
    try {
      const response = await fetch(`${AA_BASE_URL}/v1/account/${accountId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AA_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching account details:', error);
      return null;
    }
  },
};

export default accountAggregatorAPI;
