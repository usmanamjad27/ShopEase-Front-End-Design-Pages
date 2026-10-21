import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/[0.04] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/4.2] overflow-hidden bg-sand">
        <Link to={`/products/${encodeURIComponent(product.id)}`} aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.imageAlt || product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink shadow-sm">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {product.category}
        </p>
        <h3 className="line-clamp-2 mt-1.5 min-h-12 font-semibold leading-6 text-ink">
          <Link to={`/products/${encodeURIComponent(product.id)}`} className="hover:text-brand">{product.name}</Link>
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-ink">${Number(product.price).toFixed(2)}</span>
          <span className="flex items-center gap-1 text-sm text-muted" aria-label={`${product.rating} out of 5 stars`}>
            <span className="text-amber-500" aria-hidden="true">★</span>
            <span>{product.rating}</span>
            <span className="text-xs">({product.reviews ?? 0})</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="mt-4 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Add to cart
        </button>
        <Link
          to={`/products/${encodeURIComponent(product.id)}`}
          className="mt-3 block text-center text-xs font-semibold text-muted transition hover:text-brand"
        >
          View product details
        </Link>
      </div>
    </article>
  );
}
