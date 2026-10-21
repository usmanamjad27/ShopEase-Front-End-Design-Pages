import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { useCart } from "../context/CartContext.jsx";

const shippingCost = (subtotal) => (subtotal >= 75 ? 0 : 7.95);

function CheckoutSummary({ items, subtotal }) {
  const shipping = shippingCost(subtotal);

  return (
    <aside className="h-fit rounded-2xl border border-black/[0.05] bg-white p-6">
      <h2 className="font-display text-xl text-ink">Order summary</h2>
      <div className="mt-5 max-h-64 space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.imageAlt || item.name}
              className="h-14 w-14 rounded-lg bg-sand object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-ink">{item.name}</p>
              <p className="mt-1 text-xs text-muted">Qty {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-ink">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3 border-t border-black/[0.07] pt-4 text-sm">
        <div className="flex justify-between text-muted"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-muted"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
        <div className="flex justify-between border-t border-black/[0.07] pt-4 font-bold text-ink">
          <span>Total</span><span>${(subtotal + shipping).toFixed(2)}</span>
        </div>
      </div>
      {shipping > 0 && (
        <p className="mt-4 rounded-xl bg-brand-soft px-3 py-2.5 text-xs leading-5 text-brand">
          Add ${(75 - subtotal).toFixed(2)} more for free shipping.
        </p>
      )}
    </aside>
  );
}

export default function CheckoutPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (items.length === 0 || submitting) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      const order = {
        orderNumber: `SE-${Date.now().toString().slice(-8)}`,
        customer: {
          name: event.currentTarget.elements.fullName.value.trim(),
          email: event.currentTarget.elements.email.value.trim(),
        },
        items: items.map(({ id, name, image, imageAlt, price, quantity }) => ({
          id, name, image, imageAlt, price, quantity,
        })),
        subtotal,
        shipping: shippingCost(subtotal),
        total: subtotal + shippingCost(subtotal),
        paymentMethod: "Pay on delivery",
        placedAt: new Date().toISOString(),
      };

      sessionStorage.setItem("shopease:last-order", JSON.stringify(order));
      clearCart();
      navigate("/order-confirmation", { replace: true, state: { order } });
    } catch {
      setErrorMessage("We couldn’t prepare your order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <nav aria-label="Checkout progress" className="mb-8 flex items-center gap-2 text-xs font-semibold sm:text-sm">
          <Link to="/cart" className="text-brand hover:text-brand-dark">Cart</Link>
          <span className="text-muted" aria-hidden="true">/</span>
          <span className="text-ink" aria-current="step">Checkout</span>
          <span className="text-muted" aria-hidden="true">/</span>
          <span className="text-muted">Confirmation</span>
        </nav>
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">One last step</p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] text-ink">Checkout</h1>
          <p className="mt-2 text-sm text-muted">Add your delivery details and review your order.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center">
            <h2 className="font-display text-2xl text-ink">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted">Add a product before heading to checkout.</p>
            <Link to="/" className="mt-5 inline-block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Continue shopping</Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-black/[0.05] bg-white p-5 sm:p-7">
              <fieldset>
                <legend className="font-display text-xl text-ink">Delivery information</legend>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-ink">Full name</span>
                    <input name="fullName" autoComplete="name" required maxLength={100} className="w-full rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10" />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-ink">Email address</span>
                    <input name="email" type="email" autoComplete="email" required maxLength={254} className="w-full rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10" />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-ink">Phone (optional)</span>
                    <input name="phone" type="tel" autoComplete="tel" maxLength={30} className="w-full rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-ink">Street address</span>
                    <input name="address" autoComplete="street-address" required maxLength={200} className="w-full rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10" />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-ink">City</span>
                    <input name="city" autoComplete="address-level2" required maxLength={100} className="w-full rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10" />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-ink">Postal code</span>
                    <input name="postalCode" autoComplete="postal-code" required maxLength={20} className="w-full rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-ink">Country / region</span>
                    <input name="country" autoComplete="country-name" required maxLength={100} className="w-full rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10" />
                  </label>
                </div>
              </fieldset>

              <fieldset className="mt-8 border-t border-black/[0.07] pt-6">
                <legend className="font-display text-xl text-ink">Payment method</legend>
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-brand/20 bg-brand-soft/50 p-4">
                  <input type="radio" name="payment" value="cod" defaultChecked className="mt-1 accent-brand" />
                  <span>
                    <span className="block text-sm font-semibold text-ink">Pay on delivery</span>
                    <span className="mt-1 block text-xs leading-5 text-muted">Pay when your order arrives. Online card payments are not connected yet.</span>
                  </span>
                </label>
              </fieldset>

              {errorMessage && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</p>}

              <button type="submit" disabled={submitting} className="mt-6 w-full rounded-xl bg-brand px-5 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Placing your order..." : `Place order · $${(subtotal + shippingCost(subtotal)).toFixed(2)}`}
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-muted">
                Demo checkout only. Your order is stored in this browser; no payment is collected and no order is sent to a server.
              </p>
            </form>
            <CheckoutSummary items={items} subtotal={subtotal} />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export function OrderConfirmation() {
  const location = useLocation();
  let savedOrder = null;

  try {
    savedOrder = JSON.parse(sessionStorage.getItem("shopease:last-order") || "null");
  } catch {
    savedOrder = null;
  }

  const order = location.state?.order ?? savedOrder;
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-5 py-12 sm:px-8">
        <section className="w-full rounded-3xl border border-black/[0.05] bg-white px-6 py-10 text-center shadow-soft sm:px-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-3xl text-brand" aria-hidden="true">✓</span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brand">Thank you</p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] text-ink">
            {order ? "Your order is confirmed" : "Order confirmation"}
          </h1>
          {order ? (
            <>
              <p className="mt-3 text-sm leading-6 text-muted">
                Thanks{order.customer?.name ? `, ${order.customer.name}` : ""}! Your demo order has been saved in this browser.
                {order.customer?.email ? ` A real confirmation email will be available once the backend is connected.` : ""}
              </p>
              <div className="mx-auto mt-7 max-w-md rounded-2xl bg-canvas p-5 text-left">
                <div className="flex justify-between gap-3 text-sm"><span className="text-muted">Order number</span><span className="font-semibold text-ink">{order.orderNumber}</span></div>
                <div className="mt-3 flex justify-between gap-3 text-sm"><span className="text-muted">Payment</span><span className="font-semibold text-ink">Pay on delivery</span></div>
                <div className="mt-3 flex justify-between gap-3 border-t border-black/[0.07] pt-3 text-sm"><span className="font-semibold text-ink">Order total</span><span className="font-bold text-ink">${Number(order.total).toFixed(2)}</span></div>
              </div>
              <p className="mt-4 text-xs text-muted">This is a frontend demo; no payment was collected and no order was submitted to a server.</p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">We couldn’t find a recent order in this browser.</p>
          )}
          <Link to="/" className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
            Continue shopping
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
