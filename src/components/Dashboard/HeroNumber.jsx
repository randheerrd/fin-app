export default function HeroNumber({ amount }) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-6xl font-bold text-emerald-light">
        ₹{amount.toLocaleString('en-IN')}
      </h1>
    </div>
  );
}
