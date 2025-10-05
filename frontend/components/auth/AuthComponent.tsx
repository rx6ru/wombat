    "use client";

    import { useState } from "react";
    import { createClient } from "@/lib/supabase/client";
    import { Button } from "@/components/ui/Button";
    import { Input } from "@/components/ui/Input";
    import { motion, AnimatePresence } from "framer-motion";

    export default function AuthComponent() {
      const [isNewUser, setIsNewUser] = useState(false);
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [message, setMessage] = useState<string | null>(null);
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const supabase = createClient();

      const handleAuth = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
          if (isNewUser) {
            const { error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
              },
            });
            if (error) throw error;
            setMessage("Check your email for the confirmation link!");
          } else {
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (error) throw error;
            // The page will redirect on success via the server component logic
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred.");
          }
        } finally {
          setLoading(false);
        }
      };

      const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };
      
      const title = isNewUser ? "Create an Account" : "Welcome Back";

      return (
        <div className="w-full max-w-sm mt-8 p-8 space-y-6 bg-secondary/50 rounded-lg border border-border">
           <AnimatePresence mode="wait">
            <motion.h2
              key={title}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="text-2xl font-semibold text-center text-foreground"
            >
              {title}
            </motion.h2>
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <AnimatePresence>
                {message && (
                     <motion.p initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-sm text-center text-green-400">{message}</motion.p>
                )}
                {error && (
                     <motion.p initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-sm text-center text-destructive">{error}</motion.p>
                )}
            </AnimatePresence>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : (isNewUser ? "Sign Up" : "Log In")}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {isNewUser ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsNewUser(!isNewUser)
                setError(null)
                setMessage(null)
              }}
              className="font-medium text-primary hover:underline"
            >
              {isNewUser ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      );
    }