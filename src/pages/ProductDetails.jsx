import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Loader from "../components/Loader.jsx";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import mockProducts from "../data/products.js";

function productId(product) {
  return String(product._id ?? product.id ?? product.slug ?? "");
}

export default function ProductDetails() {
  const { productId: routeId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      setProduct(null);
      setLoadError("");
      setQuantity(1);

      try {
        const response = await axios.get("/api/products", { signal: controller.signal });
        const apiProducts = Array.isArray(response.data) ? response.data : response.data?.products;
        if (!Array.isArray(apiProducts)) {
          throw new Error("The products response is not a list.");
        }
        const match = apiProducts.find((item) => productId(item) === routeId || item.slug === routeId);
        if (match) {
          setProduct(match);
          setRelatedProducts(apiProducts.filter((item) => productId(item) !== productId(match)));
        } else {
          const mockMatch = mockProducts.find((item) => productId(item) === routeId);
          if (mockMatch) {
            setProduct(mockMatch);
            setRelatedProducts(mockProducts.filter((item) => item.id !== mockMatch.id));
          } else {
            setLoadError("We couldn’t find that product. It may have moved or sold out.");
          }
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        const mockMatch = mockProducts.find((item) => productId(item) === routeId);
        if (mockMatch) {
          setProduct(mockMatch);
          setRelatedProducts(mockProducts.filter((item) => item.id !== mockMatch.id));
          setLoadError("The shop is offline right now, so this is the sample product overview.");
        } else {
          setLoadError("We couldn’t load this product. Please try again in a moment.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [routeId]);

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index += 1) addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="mx-auto min-h-[55vh] max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm text-muted">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link to="/products" className="hover:text-brand">Products</Link>
          {product && <><span className="mx-2" aria-hidden="true">/</span><span className="text-ink">{product.name}</span></>}
        </nav>

        {loading ? (
          <Loader />
        ) : product ? (
          <>
            {loadError && <p role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</p>}
            <section className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="overflow-hidden rounded-3xl bg-sand">
                <img src={product.image} alt={product.imageAlt || product.name} className="aspect-square h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center py-2">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{product.category}</p>
                <h1 className="mt-3 font-display text-4xl leading-tight tracking-[-0.03em] text-ink sm:text-5xl">{product.name}</h1>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                  <span className="text-amber-500" aria-hidden="true">★</span>
                  <span aria-label={`${product.rating} out of 5 stars`}>{product.rating} out of 5</span>
                  <span>({product.reviews ?? 0} reviews)</span>
                </div>
                <p className="mt-6 text-2xl font-bold text-ink">${Number(product.price).toFixed(2)}</p>
                <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
                  {product.description || `Meet the ${product.name}: a thoughtfully chosen ${String(product.category ?? "everyday").toLowerCase()} essential, made to bring a little more ease and enjoyment to your day.`}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <label htmlFor="product-quantity" className="sr-only">Quantity</label>
                  <div className="flex h-12 items-center rounded-xl border border-black/10 bg-white">
                    <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-full px-4 text-lg text-ink hover:text-brand disabled:opacity-40">−</button>
                    <input id="product-quantity" type="number" min="1" max="99" value={quantity} onChange={(event) => setQuantity(Math.min(99, Math.max(1, Number(event.target.value) || 1)))} className="w-10 appearance-none bg-transparent text-center text-sm font-semibold text-ink outline-none" />
                    <button type="button" aria-label="Increase quantity" disabled={quantity >= 99} onClick={() => setQuantity((value) => Math.min(99, value + 1))} className="h-full px-4 text-lg text-ink hover:text-brand disabled:opacity-40">+</button>
                  </div>
                  <button type="button" onClick={handleAddToCart} className="h-12 flex-1 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                    {added ? "Added to cart ✓" : "Add to cart"}
                  </button>
                </div>

                <div className="mt-7 space-y-3 border-t border-black/[0.07] pt-6 text-sm text-muted">
                  <p><span className="mr-2 text-brand" aria-hidden="true">✓</span>Free shipping on orders over $75</p>
                  <p><span className="mr-2 text-brand" aria-hidden="true">✓</span>Easy 30-day returns</p>
                  <p><span className="mr-2 text-brand" aria-hidden="true">✓</span>Thoughtfully selected by ShopEase</p>
                </div>
              </div>
            </section>

            {relatedProducts.length > 0 && (
              <section className="pt-16 sm:pt-20">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Keep exploring</p>
                  <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">You might also like</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                  {relatedProducts.slice(0, 4).map((item) => (
                    <ProductCard key={productId(item)} product={{ ...item, id: productId(item) }} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-14 text-center">
            <h1 className="font-display text-2xl text-ink">Product not found</h1>
            <p role="alert" className="mt-2 text-sm text-muted">{loadError}</p>
            <Link to="/" className="mt-5 inline-block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Back to the shop</Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
