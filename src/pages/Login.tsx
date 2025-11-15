import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock, Mail } from "lucide-react";
import HeaderImg from "../Bilder/Header.png";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Normalize common English error messages to German for users
      let msg = error.message || "E-Mail oder Passwort ungültig";
      const low = msg.toLowerCase();
      if (low.includes("invalid login") || low.includes("invalid credentials") || low.includes("invalid password") || low.includes("invalid email")) {
        msg = "Email oder Passwort falsch";
      }
      toast.error("Login fehlgeschlagen: " + msg);
      setLoginError(msg);
      setIsLoading(false);
      return;
    }

    toast.success("Erfolgreich angemeldet!");
    setIsLoading(false);
    setLoginError(null);
    onLoginSuccess();
    // navigate to dashboard after successful login
    try {
      navigate('/dashboard', { replace: true });
    } catch (e) {
      // ignore navigation errors
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700] rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-[150px]"></div>
      </div>

      <Card className="w-full max-w-md bg-gradient-to-br from-zinc-900/90 via-black to-zinc-950 border border-[#FFD700]/20 p-8 backdrop-blur-xl shadow-[0_0_80px_rgba(255,215,0,0.15)] relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#FFD700]"></div>
            <span className="text-[#FFD700] tracking-[0.3em] uppercase text-sm">Admin Login</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#FFD700]"></div>
          </div>
          <p className="text-gray-400 text-sm">Melden Sie sich an, um fortzufahren</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-gray-300 mb-2 block flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FFD700]" />
              E-Mail
            </Label>
            <Input
              type="email"
              placeholder="ihre@email.de"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError(null);
              }}
              required
              className="bg-zinc-950/50 border-white/10 text-white placeholder:text-gray-600 py-6 focus:border-[#FFD700] transition-colors"
            />
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FFD700]" />
              Passwort
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError(null);
              }}
              required
              className="bg-zinc-950/50 border-white/10 text-white placeholder:text-gray-600 py-6 focus:border-[#FFD700] transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FFD700] text-black py-6 text-lg border-0 shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Anmelden...
              </span>
            ) : (
              <>
                Anmelden
              </>
            )}
          </Button>
          {loginError && (
            <p className="text-white text-sm mt-3" role="alert">{loginError}</p>
          )}
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Capillus HEADSPA. Alle Rechte vorbehalten.
          </p>
        </div>
      </Card>
    </div>
  );
}
