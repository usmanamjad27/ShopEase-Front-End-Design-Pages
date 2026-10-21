import categories from "../data/categories.js";

export default function CategoryCard({ name, onSelect }) {
  const category = categories.find((item) => item.name === name);

  return (
    <button
      type="button"
      onClick={() => onSelect(name)}
      className="group flex min-h-40 w-full flex-col items-start justify-between rounded-2xl border border-black/[0.04] bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-brand/20 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:p-6"
      aria-label={`Browse ${name} products`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-xl text-brand transition group-hover:bg-brand group-hover:text-white" aria-hidden="true">
        {category?.icon ?? "✦"}
      </span>
      <span className="mt-5 block">
        <span className="block font-semibold text-ink">{name}</span>
        <span className="mt-1 block text-xs text-muted">{category?.note ?? "Discover something new"}</span>
        <span className="mt-3 inline-block text-sm font-semibold text-brand transition group-hover:translate-x-1" aria-hidden="true">Shop now ↗</span>
      </span>
    </button>
  );
}
