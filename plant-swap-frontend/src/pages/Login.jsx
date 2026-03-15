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
    <div className="container mx-auto p-8 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-green-700">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ajay@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800"
            >
              Sign In
            </Button>
            <div className="text-sm text-center text-slate-500">
              Don't have an account?{" "}
              {/* This Link safely routes the user to the SignUp page */}
              <Link
                to="/signup"
                className="text-green-600 font-semibold hover:underline"
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
