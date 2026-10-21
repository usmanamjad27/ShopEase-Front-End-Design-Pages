import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import categories from "../data/categories.js";
import products from "../data/products.js";

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm text-muted">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-ink">All departments</span>
        </nav>

        <section className="rounded-3xl bg-brand px-6 py-9 text-white sm:px-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Find your next favorite</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">Shop by department</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
            Explore thoughtful picks for every part of your day, all in one place.
          </p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-emerald-50">
            Browse all products <span className="ml-2" aria-hidden="true">↗</span>
          </Link>
        </section>

        <section className="pt-10 sm:pt-14">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">All departments</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">What are you looking for?</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const itemCount = products.filter((product) => product.category === category.name).length;
              const categoryUrl = `/products?category=${encodeURIComponent(category.name)}`;

              return (
                <article key={category.name} className="group rounded-2xl border border-black/[0.06] bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-soft sm:p-6">
                  <Link to={categoryUrl} className="flex items-start justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-2xl text-brand transition group-hover:bg-brand group-hover:text-white" aria-hidden="true">
                      {category.icon}
                    </span>
                    <span className="text-muted transition group-hover:translate-x-1 group-hover:text-brand" aria-hidden="true">↗</span>
                  </Link>
                  <h3 className="mt-5 text-lg font-semibold text-ink">
                    <Link to={categoryUrl} className="hover:text-brand">{category.name}</Link>
                  </h3>
                  <p className="mt-1 text-sm text-muted">{category.note}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        to={categoryUrl}
                        className="rounded-full bg-canvas px-3 py-1.5 text-xs text-muted transition hover:bg-brand-soft hover:text-brand"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                  <Link to={categoryUrl} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark">
                    Explore {category.name}
                    <span className="text-xs font-normal text-muted">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-sand px-6 py-7 sm:mt-14 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl text-ink">Not sure where to start?</h2>
              <p className="mt-2 text-sm text-muted">Browse our whole collection and see what catches your eye.</p>
            </div>
            <Link to="/products" className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
              Shop all products
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
