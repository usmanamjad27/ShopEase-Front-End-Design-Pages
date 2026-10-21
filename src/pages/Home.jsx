import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import CategoryCard from "../components/CategoryCard.jsx";
import Footer from "../components/Footer.jsx";
import Loader from "../components/Loader.jsx";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import mockProducts from "../data/products.js";
import categories from "../data/categories.js";

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("category") || "");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await axios.get("/api/products", { signal: controller.signal });
        const apiProducts = Array.isArray(response.data)
          ? response.data
          : response.data?.products;

        if (!Array.isArray(apiProducts)) {
          throw new Error("The products response is not a list.");
        }
        setProducts(apiProducts);
      } catch (error) {
        if (controller.signal.aborted) return;
        setProducts(mockProducts);
        setLoadError("We couldn't reach the shop right now, so you're seeing our sample collection.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = product.name?.toLowerCase().includes(normalizedSearch);
      const matchesCategory = !activeCategory || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const selectCategory = (category) => {
    setActiveCategory(category);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main>
        <div className="bg-brand-dark px-5 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
          A little something extra: free shipping on orders over $75
        </div>
        <section id="home" className="px-5 pt-6 sm:px-8 sm:pt-8">
          <div className="hero-texture relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-brand text-white lg:min-h-[460px] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:flex-col lg:justify-center lg:py-14 lg:pl-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-200" aria-hidden="true" />
                The ShopEase edit · New season, good finds
              </span>
              <h1 className="mt-6 max-w-xl font-display text-4xl leading-[1.12] tracking-[-0.035em] sm:text-5xl lg:text-[3.65rem]">
                Good things for <span className="text-emerald-200">everyday</span> living.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base">
                Your next everyday favorite is closer than you think. Explore thoughtful picks for home, style, and everything in between.
              </p>
              <a
                href="#products"
                className="mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand transition hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
              >
                Shop now <span aria-hidden="true">↗</span>
              </a>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
                <span>✓ Thoughtfully picked</span>
                <span>✓ Easy 30-day returns</span>
              </div>
            </div>
            <div className="relative min-h-64 px-6 pb-7 sm:px-12 lg:min-h-full lg:px-8 lg:py-10">
              <div className="absolute inset-x-6 bottom-6 top-0 overflow-hidden rounded-[1.5rem] bg-[#d9d0c1] sm:inset-x-12 lg:inset-y-8 lg:right-12 lg:left-0">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=90"
                  alt="Studio wireless headphones, a ShopEase customer favorite"
                  className="h-full w-full object-cover object-center transition duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-black/20 px-4 py-2 text-xs font-medium text-white backdrop-blur">
                  Little upgrades, big everyday energy
                </span>
              </div>
              <div className="absolute right-5 top-4 rounded-2xl bg-white p-4 text-ink shadow-soft sm:right-12 lg:-right-0 lg:top-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand">Customer favorite</p>
                <p className="mt-1 text-sm font-semibold">Studio Wireless Headphones</p>
                <div className="mt-2 flex items-center justify-between gap-5">
                  <span className="text-sm font-bold">$129.00</span>
                  <span className="text-xs text-muted"><span className="text-amber-500">★</span> 4.9</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">A good place to start</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">Shop by category</h2>
            </div>
            <Link to="/categories" className="hidden text-sm font-semibold text-brand hover:text-brand-dark sm:block">
              Browse everything <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.name} name={category.name} onSelect={selectCategory} />
            ))}
          </div>
          <Link to="/categories" className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-dark sm:hidden">
            Browse all departments <span className="ml-2" aria-hidden="true">↗</span>
          </Link>
        </section>

        <section id="products" className="mx-auto max-w-7xl scroll-mt-28 px-5 pt-16 sm:px-8 sm:pt-20">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Picked for you</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">The good stuff</h2>
              <p className="mt-2 text-sm text-muted">Everyday essentials, a little more special.</p>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter products by category">
              {["All", ...categories.map((category) => category.name)].map((category) => {
                const selected = category === "All" ? !activeCategory : activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category === "All" ? "" : category)}
                    aria-pressed={selected}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${selected ? "bg-brand text-white" : "bg-white text-muted hover:bg-brand-soft hover:text-brand"}`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {loadError && (
            <p role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {loadError}
            </p>
          )}

          {loading ? (
            <Loader />
          ) : visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product._id ?? product.id} product={{ ...product, id: product._id ?? product.id }} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/[0.05] bg-white px-6 py-14 text-center">
              <p className="font-display text-2xl text-ink">No finds this time.</p>
              <p className="mt-2 text-sm text-muted">Try another search or browse all categories.</p>
              <button
                type="button"
                onClick={() => { setSearchTerm(""); setActiveCategory(""); }}
                className="mt-5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Clear filters
              </button>
            </div>
          )}
          <p className="mt-6 text-center text-xs text-muted">
            {loading ? " " : `Showing ${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"}`}
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-sand p-7 sm:flex-row sm:items-center sm:px-10 sm:py-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">A note from us</p>
              <h2 className="mt-2 font-display text-2xl text-ink">The little things make the day.</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted">We find useful, enduring pieces that make daily routines feel a bit more like you.</p>
            </div>
            <a href="#categories" className="shrink-0 rounded-full border border-brand/20 bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white">
              Find your thing <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
