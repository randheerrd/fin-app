import Anthropic from '@anthropic-ai/sdk';
import { readJson } from './_setu.js';
import { CATEGORIES } from '../src/data/categories.js';

// STEP (fallback) — AI categorization for bank-imported transactions that
// neither the user's learned overrides nor the keyword rules could resolve.
// POST /api/categorize  body: { narrations: string[] }
// Returns { categories: string[], mocked?: true } — same length/order as
// `narrations`, each one a CATEGORIES id. `mocked: true` means this ran the
// local demo fallback below instead of a real model call (no API key, or the
// account has no credit) — same idea as this app's existing Setu/Twilio demo
// fallbacks, so the categorization flow is demoable without spending on API calls.
const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

// Broader than lib/categorize.js's KEYWORDS on purpose — this stands in for
// "what an LLM would catch that the narrow keyword rules missed" (rent, EMI,
// utilities aren't covered there at all), so the demo shows the AI tier
// actually adding value instead of just repeating the keyword tier's guesses.
const MOCK_KEYWORDS = [
  [/swiggy|zomato|domino|pizza|restaurant|food|cafe|starbucks|dine/i, 'food'],
  [/uber|ola|rapido|irctc|rail|metro|fuel|petrol|transport|indigo|flight/i, 'transport'],
  [/amazon|flipkart|myntra|shop|mall|retail/i, 'shopping'],
  [/netflix|spotify|prime|hotstar|subscription|youtube/i, 'subscriptions'],
  [/blinkit|zepto|instamart|grocery|bigbasket|dmart|supermarket/i, 'groceries'],
  [/pharmacy|apollo|hospital|medical|health|clinic|diagnostic/i, 'health'],
  [/rent|landlord|housing society/i, 'rent'],
  [/emi|loan|lic premium|insurance/i, 'emi'],
  [/electricity|water bill|broadband|wifi|dth|utility|gas bill|mobile recharge/i, 'utilities'],
  [/movie|pvr|inox|bookmyshow|concert|game/i, 'entertainment'],
];

function mockCategorize(narration = '') {
  for (const [re, cat] of MOCK_KEYWORDS) if (re.test(narration)) return cat;
  return 'cash';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { narrations } = await readJson(req);
  if (!Array.isArray(narrations) || narrations.length === 0) {
    return res.status(400).json({ error: 'narrations (non-empty array) is required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(200).json({ categories: narrations.map(mockCategorize), mocked: true });
  }

  try {
    const client = new Anthropic();

    const list = narrations.map((n, i) => `${i}: ${n}`).join('\n');
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              results: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    index: { type: 'integer' },
                    category: { type: 'string', enum: CATEGORY_IDS },
                  },
                  required: ['index', 'category'],
                  additionalProperties: false,
                },
              },
            },
            required: ['results'],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: 'user',
          content: `Categorize each bank transaction narration below into exactly one of these categories: ${CATEGORY_IDS.join(', ')}. "cash" is the catch-all for anything that doesn't clearly fit another category (e.g. ATM withdrawals, generic transfers).\n\n${list}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const parsed = JSON.parse(textBlock?.text || '{}');

    const categories = narrations.map(() => 'cash');
    for (const r of parsed.results || []) {
      if (Number.isInteger(r.index) && r.index >= 0 && r.index < categories.length) {
        categories[r.index] = CATEGORY_IDS.includes(r.category) ? r.category : 'cash';
      }
    }
    return res.status(200).json({ categories });
  } catch (e) {
    // Real call failed (e.g. no credit) — fall back to the local demo mock
    // rather than surfacing a hard error, so the categorization flow still
    // demos end-to-end.
    console.error('AI categorization failed, using mock fallback:', e.message);
    return res.status(200).json({ categories: narrations.map(mockCategorize), mocked: true });
  }
}
