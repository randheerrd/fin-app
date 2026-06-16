// Brand-colored monogram tiles for merchants. Real logos would live in /assets;
// this gives a consistent, recognizable stand-in keyed by merchant name.
const BRANDS = [
  { match: ['rapido'], bg: '#FFC72C', fg: '#1A1A1A' },
  { match: ["domino", 'mojo pizza'], bg: '#006491', fg: '#fff' },
  { match: ['netflix'], bg: '#000000', fg: '#E50914' },
  { match: ['swiggy'], bg: '#FC8019', fg: '#fff' },
  { match: ['zomato'], bg: '#E23744', fg: '#fff' },
  { match: ['apollo'], bg: '#0A9D5A', fg: '#fff' },
  { match: ['blinkit'], bg: '#F8CB46', fg: '#1A1A1A' },
  { match: ['myntra'], bg: '#FF3F6C', fg: '#fff' },
  { match: ['amazon'], bg: '#232F3E', fg: '#FF9900' },
  { match: ['spotify'], bg: '#1DB954', fg: '#fff' },
  { match: ['bookmyshow'], bg: '#C4242B', fg: '#fff' },
  { match: ['uber'], bg: '#000000', fg: '#fff' },
  { match: ['big bazaar'], bg: '#1E4FA3', fg: '#fff' },
  { match: ['claude'], bg: '#D97757', fg: '#fff' },
  { match: ['gym'], bg: '#111827', fg: '#fff' },
];

export default function MerchantLogo({ name = '', size = 36 }) {
  const lower = name.toLowerCase();
  const brand = BRANDS.find((b) => b.match.some((m) => lower.includes(m)));
  const bg = brand?.bg ?? '#0E3F2E';
  const fg = brand?.fg ?? '#fff';
  return (
    <div
      className="rounded-lg flex items-center justify-center flex-shrink-0 font-bold"
      style={{ width: size, height: size, backgroundColor: bg, color: fg, fontSize: size * 0.42 }}
    >
      {(name.trim()[0] || '?').toUpperCase()}
    </div>
  );
}
