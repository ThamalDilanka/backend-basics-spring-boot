import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = (e) => {
        e.preventDefault();
        // Just like the login page, we will use a simple alert for now.
        // Later, you can use a TanStack Mutation to POST this to your Spring Boot database!
        alert(`Account created for:\nName: ${name}\nEmail: ${email}`);
    };

    return (
        <div className="container mx-auto p-8 flex justify-center items-center min-h-[80vh]">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-green-700">Create an account</CardTitle>
                    <CardDescription className="text-slate-500">
                        Enter your details below to join Plant Swap
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSignUp}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Ajay"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">Sign Up</Button>
                        <div className="text-sm text-center text-slate-500">
                            Already have an account?{" "}
                            {/* This links back to the Login page */}
                            <Link to="/login" className="text-green-600 font-semibold hover:underline">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}