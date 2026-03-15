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

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let profilePictureUrl = null;

      // 1. Upload to Cloudinary if an image is selected
      if (profileImageFile) {
        const formData = new FormData();
        formData.append("file", profileImageFile);
        // Replace 'your_upload_preset' and 'your_cloud_name' below with your actual values
        formData.append("upload_preset", "plant_swap_preset"); // Use your unsigned preset here

        const cloudinaryRes = await fetch(
          "https://api.cloudinary.com/v1_1/dayy8te6n/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const cloudinaryData = await cloudinaryRes.json();
        if (cloudinaryData.secure_url) {
          profilePictureUrl = cloudinaryData.secure_url;
        } else {
          console.error("Cloudinary Error Response:", cloudinaryData);
          throw new Error(
            cloudinaryData.error?.message ||
              "Failed to upload image to Cloudinary",
          );
        }
      }

      // 2. Register User
      const response = await fetch("/api/v1/members/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          neighborhood,
          profilePicture: profilePictureUrl,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`Account created successfully for: ${data.data.name}`);
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Error during signup", err);
      setError(err.message || "Something went wrong during signup");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-green-700">
            Create an account
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your details below to join Plant Swap
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
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
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                placeholder="e.g. Indiranagar"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files[0])}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={uploading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50"
            >
              {uploading ? "Signing Up..." : "Sign Up"}
            </Button>
            <div className="text-sm text-center text-slate-500">
              Already have an account? {/* This links back to the Login page */}
              <Link
                to="/login"
                className="text-green-600 font-semibold hover:underline"
              >
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
