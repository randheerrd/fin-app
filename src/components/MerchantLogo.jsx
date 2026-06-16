import BrandLogo from './BrandLogo';

// Merchant → { domain, brand colors for the monogram fallback }.
const BRANDS = [
  { match: ['rapido'], domain: 'rapido.bike', bg: '#FFC72C', fg: '#1A1A1A' },
  { match: ['mojo pizza'], domain: 'mojopizza.in', bg: '#E2231A', fg: '#fff' },
  { match: ['domino'], domain: 'dominos.co.in', bg: '#006491', fg: '#fff' },
  { match: ['netflix'], domain: 'netflix.com', bg: '#000000', fg: '#E50914' },
  { match: ['swiggy'], domain: 'swiggy.com', bg: '#FC8019', fg: '#fff' },
  { match: ['zomato'], domain: 'zomato.com', bg: '#E23744', fg: '#fff' },
  { match: ['apollo'], domain: 'apollopharmacy.in', bg: '#0A9D5A', fg: '#fff' },
  { match: ['blinkit'], domain: 'blinkit.com', bg: '#F8CB46', fg: '#1A1A1A' },
  { match: ['myntra'], domain: 'myntra.com', bg: '#FF3F6C', fg: '#fff' },
  { match: ['amazon'], domain: 'amazon.in', bg: '#232F3E', fg: '#FF9900' },
  { match: ['spotify'], domain: 'spotify.com', bg: '#1DB954', fg: '#fff' },
  { match: ['bookmyshow'], domain: 'bookmyshow.com', bg: '#C4242B', fg: '#fff' },
  { match: ['uber'], domain: 'uber.com', bg: '#000000', fg: '#fff' },
  { match: ['big bazaar'], domain: 'bigbazaar.com', bg: '#1E4FA3', fg: '#fff' },
  { match: ['claude'], domain: 'claude.ai', bg: '#D97757', fg: '#fff' },
  { match: ['gym'], domain: null, bg: '#111827', fg: '#fff' },
];

export default function MerchantLogo({ name = '', size = 36 }) {
  const lower = name.toLowerCase();
  const brand = BRANDS.find((b) => b.match.some((m) => lower.includes(m)));
  return (
    <BrandLogo
      domain={brand?.domain}
      label={name}
      bg={brand?.bg ?? '#0E3F2E'}
      fg={brand?.fg ?? '#fff'}
      size={size}
    />
  );
}
