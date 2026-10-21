import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-[-0.04em]">ShopEase<span className="text-emerald-300">.</span></Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
            Thoughtful finds for everyday life. Good things, chosen with care.
          </p>
          <div className="mt-5 flex gap-3" aria-label="Social media">
            <a href="https://www.instagram.com/" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold transition hover:bg-white hover:text-ink">ig</a>
            <a href="https://www.pinterest.com/" aria-label="Pinterest" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold transition hover:bg-white hover:text-ink">p</a>
            <a href="https://www.tiktok.com/" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold transition hover:bg-white hover:text-ink">tk</a>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            <li><a href="#home" className="transition hover:text-white">Home</a></li>
            <li><a href="#categories" className="transition hover:text-white">Categories</a></li>
            <li><a href="#products" className="transition hover:text-white">Shop all</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Customer care</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            <li><a href="mailto:hello@shopease.example" className="transition hover:text-white">Contact us</a></li>
              <li><a href="mailto:hello@shopease.example?subject=Shipping" className="transition hover:text-white">Shipping & returns</a></li>
              <li><a href="mailto:hello@shopease.example?subject=FAQs" className="transition hover:text-white">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Say hello</h2>
          <p className="mt-4 text-sm leading-6 text-white/60">Questions or just want to chat?</p>
          <a href="mailto:hello@shopease.example" className="mt-2 inline-block text-sm text-emerald-200 hover:text-white">hello@shopease.example</a>
          <p className="mt-2 text-sm text-white/60">Mon–Fri, 9am–5pm</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/40 sm:px-8">
          © {new Date().getFullYear()} ShopEase. Made for everyday moments.
        </p>
      </div>
    </footer>
  );
}
