import * as React from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export function SignupPage({
  onSuccess,
  onSwitchToLogin,
  bare = false,
}: {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  bare?: boolean;
}) {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [departmentId, setDepartmentId] = React.useState("00000000-0000-4000-8000-0000000000d1");
  const [academicYear, setAcademicYear] = React.useState("1");
  const [studentId, setStudentId] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmationSentTo, setConfirmationSentTo] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await signUp(email, password, fullName.trim());
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      // If user is directly logged in, update their department & academic year
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        await supabase
          .from("profiles")
          .update({
            department_id: departmentId,
            academic_year: parseInt(academicYear, 10),
            student_id: studentId.trim() || null,
          })
          .eq("id", authData.user.id);
      }

      if (result.needsConfirmation) {
        setConfirmationSentTo(email);
        toast.success("Account created. Check your email to confirm.", {
          duration: 7000,
        });
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      toast.success("Account created — welcome to NEXORA.");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const card = (
    <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-15px_rgba(11,27,58,0.25)] backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md">
          <span className="text-sm font-black text-white">N</span>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-blue-600">NEXORA</p>
          <p className="text-sm font-semibold text-[#0B1B3A]">Student Registration</p>
        </div>
      </div>

      {confirmationSentTo ? (
        <>
          <h1 className="text-xl font-bold text-[#0B1B3A]">Check your email</h1>
          <p className="mt-2 text-sm text-gray-600">
            We sent a confirmation link to <span className="font-medium text-gray-900">{confirmationSentTo}</span>.
            Open it to finish creating your account, then sign in.
          </p>
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to sign in
            </button>
          ) : null}
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold text-[#0B1B3A]">Create student account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Join your Jimma University academic department portal.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div>
              <label htmlFor="signup-full-name" className="block text-xs font-semibold text-gray-700">
                Full name
              </label>
              <input
                id="signup-full-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Abebe Kebede"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-gray-700">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                placeholder="student@ju.edu.et"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-dept" className="block text-xs font-semibold text-gray-700">
                  Program / Department
                </label>
                <select
                  id="signup-dept"
                  value={departmentId}
                  onChange={(e) => {
                    setDepartmentId(e.target.value);
                    if (e.target.value === "00000000-0000-4000-8000-0000000000d1") {
                      setAcademicYear("1");
                    }
                  }}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="00000000-0000-4000-8000-0000000000d1">Freshman (Common Year 1)</option>
                  <option value="00000000-0000-4000-8000-0000000000d2">Information Science</option>
                  <option value="00000000-0000-4000-8000-0000000000d3" disabled>Computer Science (Coming Soon)</option>
                  <option value="00000000-0000-4000-8000-0000000000d4" disabled>Software Engineering (Coming Soon)</option>
                </select>
              </div>

              <div>
                <label htmlFor="signup-year" className="block text-xs font-semibold text-gray-700">
                  Academic Year
                </label>
                <select
                  id="signup-year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="1">Year 1 (Freshman)</option>
                  <option value="2">Year 2 (Sophomore)</option>
                  <option value="3">Year 3 (Junior)</option>
                  <option value="4">Year 4 (Senior)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="signup-id" className="block text-xs font-semibold text-gray-700">
                Student ID (Optional)
              </label>
              <input
                id="signup-id"
                type="text"
                placeholder="R/1234/15"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-password" className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label htmlFor="signup-confirm" className="block text-xs font-semibold text-gray-700">
                  Confirm password
                </label>
                <input
                  id="signup-confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {error ? <p className="rounded-lg bg-red-50 p-2 text-xs font-medium text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Create Student Account"}
            </button>
          </form>

          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="mt-4 w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Already have an account? Sign in
            </button>
          ) : null}
        </>
      )}
    </div>
  );

  if (bare) return card;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F8FF] px-4 py-12">
      {card}
    </div>
  );
}

export default SignupPage;
