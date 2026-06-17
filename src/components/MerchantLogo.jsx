import BrandLogo from './BrandLogo';

// Merchant → { domain, brand colors for the monogram fallback }.
// Order matters: more specific matches (e.g. "swiggy instamart") come first.
const BRANDS = [
  // Food & dining
  { match: ['swiggy instamart'], domain: 'swiggy.com', bg: '#FC8019', fg: '#fff' },
  { match: ['swiggy'], domain: 'swiggy.com', bg: '#FC8019', fg: '#fff' },
  { match: ['zomato'], domain: 'zomato.com', bg: '#E23744', fg: '#fff' },
  { match: ['domino'], domain: 'dominos.co.in', bg: '#006491', fg: '#fff' },
  { match: ['mojo pizza'], domain: 'mojopizza.in', bg: '#E2231A', fg: '#fff' },
  { match: ['starbucks'], domain: 'starbucks.in', bg: '#00704A', fg: '#fff' },
  { match: ['mcdonald', 'mcd'], domain: 'mcdonaldsindia.com', bg: '#FFC72C', fg: '#DA291C' },
  { match: ['kfc'], domain: 'kfc.co.in', bg: '#A6192E', fg: '#fff' },
  { match: ['chaayos', 'chai point'], domain: 'chaayos.com', bg: '#C8102E', fg: '#fff' },
  { match: ['third wave'], domain: 'thirdwavecoffee.in', bg: '#1A4D2E', fg: '#fff' },

  // Transport & fuel
  { match: ['uber'], domain: 'uber.com', bg: '#000000', fg: '#fff' },
  { match: ['ola'], domain: 'olacabs.com', bg: '#000000', fg: '#C6F806' },
  { match: ['rapido'], domain: 'rapido.bike', bg: '#FFC72C', fg: '#1A1A1A' },
  { match: ['indian oil', 'indianoil', 'iocl'], domain: 'iocl.com', bg: '#F26522', fg: '#fff' },
  { match: ['irctc'], domain: 'irctc.co.in', bg: '#213B7D', fg: '#fff' },

  // Shopping
  { match: ['amazon'], domain: 'amazon.in', bg: '#232F3E', fg: '#FF9900' },
  { match: ['flipkart'], domain: 'flipkart.com', bg: '#2874F0', fg: '#fff' },
  { match: ['myntra'], domain: 'myntra.com', bg: '#FF3F6C', fg: '#fff' },
  { match: ['ajio'], domain: 'ajio.com', bg: '#2C4152', fg: '#fff' },
  { match: ['nike'], domain: 'nike.com', bg: '#111111', fg: '#fff' },
  { match: ['decathlon'], domain: 'decathlon.in', bg: '#0082C3', fg: '#fff' },
  { match: ['ikea'], domain: 'ikea.com', bg: '#0058A3', fg: '#FFDA1A' },
  { match: ['big bazaar'], domain: 'bigbazaar.com', bg: '#1E4FA3', fg: '#fff' },

  // Groceries
  { match: ['blinkit'], domain: 'blinkit.com', bg: '#F8CB46', fg: '#1A1A1A' },
  { match: ['zepto'], domain: 'zeptonow.com', bg: '#6B21A8', fg: '#fff' },
  { match: ['bigbasket', 'big basket'], domain: 'bigbasket.com', bg: '#84C225', fg: '#fff' },
  { match: ['dmart', 'd-mart'], domain: 'dmart.in', bg: '#00A04A', fg: '#fff' },

  // Health
  { match: ['apollo'], domain: 'apollopharmacy.in', bg: '#0A9D5A', fg: '#fff' },
  { match: ['practo'], domain: 'practo.com', bg: '#199FD9', fg: '#fff' },
  { match: ['1mg', 'tata 1mg'], domain: '1mg.com', bg: '#FF6F61', fg: '#fff' },
  { match: ['pharmeasy'], domain: 'pharmeasy.in', bg: '#10A37F', fg: '#fff' },
  { match: ['cult', 'cultfit'], domain: 'cult.fit', bg: '#171A29', fg: '#fff' },

  // Entertainment & subscriptions
  { match: ['bookmyshow'], domain: 'bookmyshow.com', bg: '#C4242B', fg: '#fff' },
  { match: ['pvr', 'inox'], domain: 'pvrcinemas.com', bg: '#1B1B1B', fg: '#FFB81C' },
  { match: ['netflix'], domain: 'netflix.com', bg: '#000000', fg: '#E50914' },
  { match: ['spotify'], domain: 'spotify.com', bg: '#1DB954', fg: '#fff' },
  { match: ['hotstar', 'disney'], domain: 'hotstar.com', bg: '#0F1014', fg: '#fff' },
  { match: ['prime video', 'amazon prime'], domain: 'primevideo.com', bg: '#1399FF', fg: '#fff' },
  { match: ['youtube'], domain: 'youtube.com', bg: '#FF0000', fg: '#fff' },
  { match: ['claude'], domain: 'claude.ai', bg: '#D97757', fg: '#fff' },

  // Utilities & telecom
  { match: ['jio'], domain: 'jio.com', bg: '#0A2885', fg: '#fff' },
  { match: ['airtel'], domain: 'airtel.in', bg: '#E40000', fg: '#fff' },
  { match: ['tata power'], domain: 'tatapower.com', bg: '#486AAE', fg: '#fff' },
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
