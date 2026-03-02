import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<{ error: any }>;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! You can now sign in.");
        setMode("login");
      }
    } else {
      const { error } = await onLogin(email, password);
      if (error) {
        setError(error.message || "Invalid credentials");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{mode === "login" ? "Admin Login" : "Create Account"}</CardTitle>
          <CardDescription>
            {mode === "login" ? "Sign in to manage ERPRundown content" : "Create your admin account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                {success}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@erprundown.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? (
                <><LogIn className="h-4 w-4 mr-2" />Sign In</>
              ) : (
                <><UserPlus className="h-4 w-4 mr-2" />Create Account</>
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <button type="button" className="underline hover:text-foreground" onClick={() => { setMode("signup"); setError(null); }}>
                  Need an account? Sign up
                </button>
              ) : (
                <button type="button" className="underline hover:text-foreground" onClick={() => { setMode("login"); setError(null); }}>
                  Already have an account? Sign in
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
