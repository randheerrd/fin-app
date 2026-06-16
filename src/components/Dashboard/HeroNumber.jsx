export default function HeroNumber({ amount }) {
  return (
    <div className="mb-4">
      <h1 className="font-serif text-7xl text-text-primary font-light">
        ₹{amount.toLocaleString('en-IN')}
      </h1>
    </div>
  );
}
