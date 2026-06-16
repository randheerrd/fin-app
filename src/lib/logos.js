const LOGODEV_TOKEN = import.meta.env.VITE_LOGODEV_TOKEN;

// Build a logo URL for a domain. Prefers logo.dev (crisp) when a token is set,
// otherwise falls back to Google's favicon service — which needs no key, so
// real logos show out of the box.
export function logoSrc(domain, size = 64) {
  if (!domain) return null;
  if (LOGODEV_TOKEN) {
    return `https://img.logo.dev/${domain}?token=${LOGODEV_TOKEN}&size=${Math.round(size * 2)}&format=png`;
  }
  // No token: DuckDuckGo's icon service returns higher-res logos than Google favicons.
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

const BANKS = [
  { match: 'hdfc', domain: 'hdfcbank.com', bg: '#ED232A' },
  { match: 'axis', domain: 'axisbank.com', bg: '#97144D' },
  { match: 'icici', domain: 'icicibank.com', bg: '#F58220' },
  { match: 'kotak', domain: 'kotak.com', bg: '#003874' },
  { match: 'sbi', domain: 'onlinesbi.sbi', bg: '#22409A' },
  { match: 'yes', domain: 'yesbank.in', bg: '#00518F' },
];

export function bankBrand(name = '') {
  const l = name.toLowerCase();
  return BANKS.find((b) => l.includes(b.match)) || { domain: null, bg: '#0E3F2E' };
}
