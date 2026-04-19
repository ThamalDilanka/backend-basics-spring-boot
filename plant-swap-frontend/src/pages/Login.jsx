import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  // These "states" will hold whatever the user types into the boxes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setError("");

    try {
      const response = await fetch("/api/v1/members/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // alert(`Login successful!`); // Optional, generally better UX without an alert for login
        localStorage.setItem("token", data.data.token);
        if (data.data.memberId) {
          localStorage.setItem("memberId", data.data.memberId);
        }
        localStorage.setItem("email", data.data.email);
        if (data.data.name) {
          localStorage.setItem("name", data.data.name);
        }
        if (data.data.profilePicture) {
          localStorage.setItem("profilePicture", data.data.profilePicture);
        }
        window.dispatchEvent(new Event("auth-change"));
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error during login", err);
      setError("Something went wrong during login");
    }
  };

  return (
    <div className="min-h-screen flex-1 w-full flex justify-center items-center pt-32 pb-12 px-4 relative overflow-hidden bg-gradient-to-br from-[#e5eee3] via-[#d6ebd3] to-[#c9eed1]">
      <Card className="w-full max-w-lg relative z-10 backdrop-blur-xl bg-white/40 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-700 ease-out">
        <CardHeader className="space-y-2 text-left px-6 pt-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-600 text-sm">
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5 px-6 pt-4">
            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ajay@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-t-0 border-x-0 border-b border-slate-300 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-slate-800 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-t-0 border-x-0 border-b border-slate-300 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-slate-800 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-green-700 focus:ring-green-700/50 cursor-pointer accent-green-700"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-slate-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-xs font-semibold text-[#316B3D] hover:underline underline-offset-2"
              >
                Forgot password?
              </a>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col px-6 pb-8 pt-4 space-y-6">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#316B3D] hover:bg-[#25522e] text-white font-semibold text-base shadow-sm transition-all"
            >
              Sign In
            </Button>

            <div className="text-sm text-center text-slate-500">
              Not part of the garden yet?{" "}
              {/* This Link safely routes the user to the SignUp page */}
              <Link
                to="/signup"
                className="text-[#316B3D] font-bold hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
