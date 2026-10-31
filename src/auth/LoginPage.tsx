import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeSlash,
  GraduationCap,
  LockKey,
  ShieldCheck,
  Sparkle,
  Users,
  XCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { LOGIN_TAGLINES } from "@/data/curriculumData";

/* ------------------------------------------------------------------ */
/* Canvas animation (Edu/Academic low-CPU background)                  */
/* ------------------------------------------------------------------ */
function EduCanvas() {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    resize();
    window.addEventListener("resize", resize);

    const symbols = ["∑", "∫", "λ", "π", "Δ", "∇", "Ω", "θ", "f(x)", "O(n)", "log n", "∈", "⊂", "∀", "∃"];

    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(11, 27, 58, 0.04)";
      ctx.lineWidth = 1;
      const step = 44;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.font = "12px monospace";
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      symbols.forEach((s, i) => {
        const angle = t + (i * Math.PI * 2) / symbols.length;
        const radius = 130 + Math.sin(t * 1.5 + i) * 35;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.7;
        ctx.fillStyle = `rgba(11, 27, 58, ${0.12 + (i % 4) * 0.04})`;
        ctx.fillText(s, x, y);
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-white/90 py-2.5 pl-10 pr-10 text-sm text-[#0B1B3A] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

type Tab = "student" | "admin";

/* ------------------------------------------------------------------ */
/* Forms                                                               */
/* ------------------------------------------------------------------ */
function CredentialForm({
  tab,
  onSuccess,
  onSwitchToSignup,
  onSwitchToForgot,
}: {
  tab: Tab;
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onSwitchToForgot: () => void;
}) {
  const { signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const isAdmin = tab === "admin";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setAccessDenied(false);
    setSubmitting(true);
    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      if (isAdmin) {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData.user?.id;
        if (!uid) {
          await signOut();
          const message = "Could not verify your session. Please try again.";
          setError(message);
          toast.error(message);
          return;
        }

        const { data: profile, error: roleError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", uid)
          .maybeSingle();

        if (roleError) {
          await signOut();
          setError(roleError.message);
          toast.error(roleError.message);
          return;
        }

        if (profile?.role !== "admin") {
          await signOut();
          setAccessDenied(true);
          return;
        }

        toast.success("Administrator signed in.");
        navigate("/admin");
        return;
      }

      toast.success("Welcome back.");
      if (onSuccess) onSuccess();
      else navigate("/");
    } finally {
      setSubmitting(false);
    }
  };

  if (accessDenied) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50/80 p-5 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-bold text-red-950">Access Denied</h3>
        <p className="mt-1.5 text-xs text-red-700 leading-relaxed">
          This account does not have administrator privileges. Only provisioned staff and owner accounts have access to the NEXORA Admin Console.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setAccessDenied(false);
              setError(null);
            }}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700 transition"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="inline-block text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            Return to Student Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="relative mt-1.5">
          <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder={isAdmin ? "admin@university.edu" : "student@university.edu"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative mt-1.5">
          <LockKey className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="login-password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
          >
            {show ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
            aria-live="polite"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <button
        type="submit"
        disabled={submitting}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isAdmin
            ? "bg-[#0B1B3A] hover:bg-[#132a56]"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {submitting ? "Signing in…" : isAdmin ? "Access Admin Console" : "Sign in"}
        {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
      </button>

      {isAdmin ? (
        <p className="rounded-lg bg-[#F4F8FF] px-3 py-2 text-center text-[11px] leading-relaxed text-gray-500">
          Owner administrator account is verified server-side. Wrong roles will be rejected immediately.
        </p>
      ) : onSwitchToSignup ? (
        <p className="text-center text-xs text-gray-500">
          New to NEXORA?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create an account
          </button>
        </p>
      ) : null}
    </form>
  );
}

function ForgotForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await resetPassword(email);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setSent(true);
        toast.success("Password reset instructions sent.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0B1B3A]">Reset your password</h2>
      <p className="mt-1 text-sm text-gray-500">
        Enter your email and we&apos;ll send you a secure reset link.
      </p>

      {sent ? (
        <>
          <p className="mt-6 rounded-lg bg-[#F4F8FF] px-3 py-2 text-sm text-gray-600" aria-live="polite">
            Check your inbox for the reset link.
          </p>
          <button
            type="button"
            onClick={onBackToLogin}
            className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to sign in
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-[#0B1B3A] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600" aria-live="polite">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send reset link"}
          </button>
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to sign in
          </button>
        </form>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export function LoginPage({
  onSuccess,
  onSwitchToSignup,
  bare = false,
}: {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  bare?: boolean;
}) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<Tab>("student");
  const [mode, setMode] = React.useState<"login" | "forgot">("login");
  const [taglineIndex, setTaglineIndex] = React.useState(0);

  // Rotating taglines every 5s without attribution
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % LOGIN_TAGLINES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const hasAdminSession = user && profile?.role === "admin";

  const card = (
    <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_-24px_rgba(11,27,58,0.35)] backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md">
          <span className="text-sm font-black text-white">N</span>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-blue-600">NEXORA</p>
          <p className="text-sm font-semibold text-[#0B1B3A]">Jimma University Portal</p>
        </div>
      </div>

      {/* Persistent admin session resume prompt */}
      {hasAdminSession ? (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/90 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#0B1B3A] text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#0B1B3A]">Active Admin Session</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Logged in as <span className="font-semibold text-blue-700">{profile?.email || user.email}</span>
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1B3A] px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-[#132a56] transition"
              >
                Continue to Admin Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {mode === "login" ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-gray-100/80 p-1">
            {(["student", "admin"] as Tab[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === value
                    ? value === "admin"
                      ? "bg-[#0B1B3A] text-white shadow-sm"
                      : "bg-white text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {value === "admin" ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                {value === "admin" ? "Admin" : "Student"}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <h1 className="text-xl font-semibold tracking-tight text-[#0B1B3A]">
              {tab === "admin" ? "Administrator sign in" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {tab === "admin"
                ? "Restricted console. Staff & owner credentials only."
                : "Continue your courses, projects, and submissions."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <CredentialForm
                tab={tab}
                onSuccess={onSuccess}
                onSwitchToSignup={tab === "student" ? onSwitchToSignup : undefined}
                onSwitchToForgot={() => setMode("forgot")}
              />
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <div className="mt-6">
          <ForgotForm onBackToLogin={() => setMode("login")} />
        </div>
      )}
    </div>
  );

  if (bare) return card;

  return (
    <div className="min-h-screen bg-[#F4F8FF] lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#EAF2FF] via-white to-[#DBEAFE] lg:block">
        <EduCanvas />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3.5 py-1 text-xs font-semibold text-blue-700 backdrop-blur shadow-sm">
            <Sparkle className="h-3.5 w-3.5" /> Jimma University • NEXORA
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0B1B3A]">
              Learn deeper.
              <br />
              Build bolder.
            </h2>

            {/* Rotating Taglines (every 5s, no attribution) */}
            <div className="mt-5 h-16">
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="text-sm font-medium leading-relaxed text-blue-900/80"
                >
                  {LOGIN_TAGLINES[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-6 text-xs font-medium text-gray-500">
            <span>Faculty of Computing & Informatics</span>
            <span>JIT Tech Hub</span>
            <span>Common Freshman Year</span>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#0B1B3A]/10 blur-3xl" />
        </div>
        <div className="relative w-full max-w-md">{card}</div>
      </div>
    </div>
  );
}

export default LoginPage;
