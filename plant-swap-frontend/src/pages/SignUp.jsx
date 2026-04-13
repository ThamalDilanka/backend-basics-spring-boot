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
    <div className="flex-1 w-full flex justify-center items-center p-4 relative overflow-hidden bg-gradient-to-br from-[#e5eee3] via-[#d6ebd3] to-[#c9eed1]">
      <Card className="w-full max-w-lg relative z-10 backdrop-blur-xl bg-white/40 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-700 ease-out">
        <CardHeader className="space-y-2 text-left px-6 pt-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">
            Create an Account
          </CardTitle>
          <CardDescription className="text-slate-600 text-sm">
            Join the local community of rare plant enthusiasts.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-5 px-6">
            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest"
              >
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Ajay"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-t-0 border-x-0 border-b border-slate-300 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-slate-800 transition-colors"
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label
                  htmlFor="neighborhood"
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                >
                  Neighborhood
                </Label>
                <Input
                  id="neighborhood"
                  placeholder="e.g. Indiranagar"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="bg-transparent border-t-0 border-x-0 border-b border-slate-300 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-slate-800 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label
                htmlFor="profilePicture"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest"
              >
                Profile Picture (Optional)
              </Label>
              <div className="relative group cursor-pointer">
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImageFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full flex items-center gap-4 bg-white/50 border border-dashed border-slate-300 hover:border-green-600 transition-colors rounded-xl p-4">
                  <div className="w-10 h-10 rounded-full bg-green-200/50 flex items-center justify-center flex-shrink-0 text-green-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">
                      {profileImageFile
                        ? profileImageFile.name
                        : "Click to upload photo"}
                    </p>
                    <p className="text-slate-500 text-xs">JPG, PNG UP TO 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-slate-300 text-green-700 focus:ring-green-700/50 cursor-pointer accent-green-700"
                required
              />
              <label htmlFor="terms" className="text-xs text-slate-600">
                I agree to the{" "}
                <span className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2">
                  Privacy Policy
                </span>
                .
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col px-6 pb-8 pt-4 space-y-6">
            <Button
              type="submit"
              disabled={uploading}
              className="w-full h-12 rounded-xl bg-[#316B3D] hover:bg-[#25522e] text-white font-semibold text-base shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploading ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="text-sm text-center text-slate-500">
              Already part of the garden?{" "}
              <Link
                to="/login"
                className="text-[#316B3D] font-bold hover:underline underline-offset-4"
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
