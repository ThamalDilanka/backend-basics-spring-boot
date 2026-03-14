import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
    // These "states" will hold whatever the user types into the boxes
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault(); // Prevents the page from refreshing

        // For now, we will just alert the credentials.
        // Later, you can use a TanStack Mutation to send these to Spring Boot!
        alert(`Attempting to login with:\nEmail: ${email}\nPassword: ${password}`);
    };

    return (
        <div className="container mx-auto p-8 flex justify-center items-center min-h-[80vh]">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-green-700">Welcome back</CardTitle>
                    <CardDescription className="text-slate-500">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
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
                        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">Sign In</Button>
                        <div className="text-sm text-center text-slate-500">
                            Don't have an account?{" "}
                            {/* This Link safely routes the user to the SignUp page */}
                            <Link to="/signup" className="text-green-600 font-semibold hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}