import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

const authModes = {
  login: {
    title: "Welcome back",
    description: "Sign in to pick up right where you left off.",
    submitLabel: "Sign in",
    endpoint: "/api/auth/login",
    fields: ["email", "password"],
  },
  register: {
    title: "Make yourself at home",
    description: "Create an account for a more personal way to shop.",
    submitLabel: "Create account",
    endpoint: "/api/auth/register",
    fields: ["name", "email", "password", "confirmPassword"],
  },
  forgot: {
    title: "Forgot your password?",
    description: "Enter your email and we’ll send you a link to reset it.",
    submitLabel: "Send reset link",
    endpoint: "/api/auth/forgot-password",
    fields: ["email"],
  },
};

const fieldDetails = {
  name: { label: "Full name", type: "text", autoComplete: "name", placeholder: "Your name" },
  email: { label: "Email address", type: "email", autoComplete: "email", placeholder: "you@example.com" },
  password: { label: "Password", type: "password", autoComplete: "new-password", placeholder: "At least 8 characters" },
  confirmPassword: { label: "Confirm password", type: "password", autoComplete: "new-password", placeholder: "Enter your password again" },
};

export default function AuthPage({ mode }) {
  const config = authModes[mode];
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.message ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (mode === "register" && values.password !== values.confirmPassword) {
      setErrorMessage("Your passwords don’t match. Please check them and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...values };
      delete payload.confirmPassword;
      await axios.post(config.endpoint, payload);

      if (mode === "register") {
        navigate("/login", {
          replace: true,
          state: { message: "Your account is ready. Sign in to continue." },
        });
      } else if (mode === "forgot") {
        setSuccessMessage("If an account exists for that email, a password reset link is on its way.");
        setValues({});
      } else {
        setSuccessMessage("You’re signed in.");
        setValues({});
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "We couldn’t complete that request. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="mx-auto flex min-h-[68vh] max-w-6xl items-center justify-center px-5 py-12 sm:px-8">
        <section className="grid w-full overflow-hidden rounded-3xl bg-white shadow-soft md:grid-cols-[0.85fr_1.15fr]">
          <div className="hero-texture hidden flex-col justify-between bg-brand p-10 text-white md:flex">
            <Link to="/" className="text-2xl font-bold tracking-[-0.06em]">
              ShopEase<span className="text-emerald-200">.</span>
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">A little more considered</p>
              <p className="mt-4 font-display text-4xl leading-tight">Good things feel even better when they’re yours.</p>
              <p className="mt-4 text-sm leading-6 text-white/70">Your favorites, your orders, and a few thoughtful surprises—all in one place.</p>
            </div>
            <p className="text-xs text-white/50">Thoughtful finds for everyday life.</p>
          </div>

          <div className="px-6 py-9 sm:px-10 sm:py-12">
            <Link to="/" className="text-sm font-semibold text-brand hover:text-brand-dark">← Back to the shop</Link>
            <div className="mx-auto mt-8 max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Your ShopEase account</p>
              <h1 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">{config.title}</h1>
              <p className="mt-2 text-sm leading-6 text-muted">{config.description}</p>

              {successMessage && (
                <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  {successMessage}
                </p>
              )}
              {errorMessage && (
                <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {errorMessage}
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {config.fields.map((field) => {
                  const detail = fieldDetails[field];
                  return (
                    <label key={field} className="block">
                      <span className="mb-1.5 block text-sm font-medium text-ink">{detail.label}</span>
                      <input
                        type={detail.type}
                        name={field}
                        autoComplete={detail.autoComplete}
                        placeholder={detail.placeholder}
                        value={values[field] ?? ""}
                        onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))}
                        required
                        minLength={field === "password" || field === "confirmPassword" ? 8 : undefined}
                        className="w-full rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
                      />
                    </label>
                  );
                })}

                {mode === "login" && (
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-sm font-semibold text-brand hover:text-brand-dark">Forgot password?</Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Please wait..." : config.submitLabel}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-muted">
                {mode === "login" && <>New to ShopEase? <Link to="/signup" className="font-semibold text-brand hover:text-brand-dark">Create an account</Link></>}
                {mode === "register" && <>Already have an account? <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">Sign in</Link></>}
                {mode === "forgot" && <>Remembered it? <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">Back to sign in</Link></>}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
