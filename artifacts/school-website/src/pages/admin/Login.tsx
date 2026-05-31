import { useState } from "react";
import { GraduationCap, Eye, EyeOff, Lock } from "lucide-react";
import { useAdminLogin } from "@workspace/api-client-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = useAdminLogin({
    mutation: {
      onSuccess: (data: any) => {
        if (data?.token) {
          localStorage.setItem("esh_admin_token", data.token);
          // Full-page navigation so AdminAuthProvider re-initializes with the
          // token present and fetches /admin/me before the route guard runs.
          window.location.href = `${import.meta.env.BASE_URL}admin/dashboard`;
        }
      },
      onError: () => {
        setError("Email ou mot de passe incorrect.");
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    login.mutate({ data: { email, password } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(209,64%,24%)] to-[hsl(209,64%,15%)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(49,87%,60%)] mb-4">
            <GraduationCap className="w-8 h-8 text-[hsl(209,64%,28%)]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Ecole Saint Hannibal</h1>
          <p className="text-white/60 text-sm mt-1">Panneau d'Administration</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[hsl(var(--primary))]" />
            <h2 className="font-serif text-xl font-semibold text-[hsl(var(--foreground))]">Connexion</h2>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" data-testid="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Adresse Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                placeholder="admin@ecolesainthannibal.rw"
                required
                data-testid="input-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Mot de Passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                  placeholder="••••••••"
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-3 bg-[hsl(var(--primary))] text-white font-semibold rounded-lg hover:bg-[hsl(209,64%,24%)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="button-submit"
            >
              {login.isPending ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : "Se Connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          &copy; {new Date().getFullYear()} Ecole Saint Hannibal
        </p>
      </div>
    </div>
  );
}
