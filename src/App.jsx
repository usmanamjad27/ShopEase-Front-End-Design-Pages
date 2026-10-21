import { Link, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Categories from "./pages/Categories.jsx";
import { useCart } from "./context/CartContext.jsx";
import CheckoutPage, { OrderConfirmation } from "./pages/Checkout.jsx";

function CartPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { items, updateQuantity } = useCart();
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <Link to="/" className="text-sm font-semibold text-brand hover:text-brand-dark">← Continue shopping</Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Almost yours</p>
            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] text-ink">Your cart</h1>
          </div>
          <span className="text-sm text-muted">{items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
        </div>
        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-black/[0.05] bg-white px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-2xl text-brand" aria-hidden="true">♡</span>
            <p className="mt-5 font-display text-2xl text-ink">Your cart is taking a little break.</p>
            <p className="mt-2 text-sm text-muted">Add something you love and it’ll show up here.</p>
            <Link to="/" className="mt-5 inline-block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Explore the shop</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-black/[0.05] bg-white p-4 sm:flex-nowrap">
                  <Link to={`/products/${encodeURIComponent(item.id)}`} className="shrink-0">
                    <img src={item.image} alt={item.imageAlt || item.name} className="h-24 w-24 rounded-xl bg-sand object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-muted">{item.category}</p>
                    <Link to={`/products/${encodeURIComponent(item.id)}`} className="mt-1 block font-semibold text-ink hover:text-brand">{item.name}</Link>
                    <button type="button" onClick={() => updateQuantity(item.id, 0)} className="mt-2 text-xs font-medium text-muted underline underline-offset-2 hover:text-red-700">Remove</button>
                  </div>
                  <div className="flex items-center rounded-xl border border-black/10">
                    <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 text-ink hover:text-brand">−</button>
                    <span className="min-w-8 text-center text-sm font-semibold" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                    <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 text-ink hover:text-brand">+</button>
                  </div>
                  <p className="w-24 text-right font-semibold text-ink">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </article>
              ))}
            </div>
            <aside className="h-fit rounded-2xl border border-black/[0.05] bg-white p-6">
              <h2 className="font-display text-xl text-ink">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-muted"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted"><span>Shipping</span><span>{total >= 75 ? "Free" : "$7.95"}</span></div>
                <div className="flex justify-between border-t border-black/[0.07] pt-4 font-bold text-ink"><span>Estimated total</span><span>${(total + (total >= 75 ? 0 : 7.95)).toFixed(2)}</span></div>
              </div>
              {total < 75 && <p className="mt-4 rounded-xl bg-brand-soft px-3 py-2.5 text-xs leading-5 text-brand">You’re ${(75 - total).toFixed(2)} away from free shipping.</p>}
              <Link to="/checkout" className="mt-5 block rounded-xl bg-brand px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-brand-dark">
                Proceed to checkout <span aria-hidden="true">→</span>
              </Link>
              <p className="mt-3 text-center text-xs text-muted">Easy 30-day returns on your order</p>
            </aside>
          </div>
        )}
        {items.length > 0 && (
          <div className="mt-7 flex flex-wrap justify-center gap-6 text-xs text-muted">
            <span>✓ Secure checkout</span><span>✓ Easy 30-day returns</span><span>✓ Free shipping over $75</span>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Home />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="register" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
