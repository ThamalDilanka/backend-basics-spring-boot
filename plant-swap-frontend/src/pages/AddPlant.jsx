import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Hardcoded fallback categories just in case the database fetch fails
const FALLBACK_CATEGORIES = [
  { id: 1, name: "Succulents" },
  { id: 2, name: "Indoor Foliage" },
  { id: 3, name: "Herbs" },
  { id: 4, name: "Flowering" },
  { id: 5, name: "Cacti" },
  { id: 6, name: "Indoor Plants" },
  { id: 7, name: "Outdoor Plants" },
];

export default function AddPlant() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [careDifficulty, setCareDifficulty] = useState("Easy");
  const [categoryId, setCategoryId] = useState("");
  const [plantImageFile, setPlantImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch Categories
  const { data: categories = FALLBACK_CATEGORIES } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/v1/categories");
      if (!response.ok) return FALLBACK_CATEGORIES; // If it fails, use our hardcoded list

      const json = await response.json();
      // If your backend wraps it in { success: true, data: [...] }, extract the .data array!
      return json.data || json;
    },
  });

  // TanStack Mutation for sending POST request
  const addPlantMutation = useMutation({
    mutationFn: async (newPlant) => {
      const response = await fetch("/api/v1/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlant),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add plant");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
      alert("Plant added successfully! 🌱");
      navigate("/");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const memberIdFromStorage = localStorage.getItem("memberId");
      const parsedMemberId = Number(memberIdFromStorage);

      if (!Number.isInteger(parsedMemberId) || parsedMemberId <= 0) {
        throw new Error("Please log in again before listing a plant");
      }

      let imageUrl = null;

      // Upload image to Cloudinary if selected
      if (plantImageFile) {
        const formData = new FormData();
        formData.append("file", plantImageFile);
        formData.append("upload_preset", "plant_swap_preset");

        const cloudinaryRes = await fetch(
          "https://api.cloudinary.com/v1_1/dayy8te6n/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const cloudinaryData = await cloudinaryRes.json();
        if (cloudinaryData.secure_url) {
          imageUrl = cloudinaryData.secure_url;
        } else {
          console.error("Cloudinary Error Response:", cloudinaryData);
          throw new Error(
            cloudinaryData.error?.message || "Failed to upload image",
          );
        }
      }

      await addPlantMutation.mutateAsync({
        name,
        description,
        careDifficulty: careDifficulty.toUpperCase(),
        categoryId: parseInt(categoryId),
        memberId: parsedMemberId,
        imageUrl: imageUrl || null,
      });
    } catch (error) {
      console.error("Error during plant creation:", error);
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex justify-center items-center pt-32 pb-12 px-4 relative overflow-hidden min-h-screen">
      {/* Animated Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/AddPlant.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "panBg 30s infinite alternate ease-in-out",
        }}
      ></div>

      {/* Inline styles for background animation to prevent layout shifts */}
      <style>
        {`
          @keyframes panBg {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
          }
        `}
      </style>

      {/* Light glass overlay so the background image isn't too overpowering */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-0"></div>

      {/* Ambient Liquid Glass Blobs */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-green-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse z-0"></div>
      <div
        className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-teal-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse z-0"
        style={{ animationDelay: "2s" }}
      ></div>

      <Card className="w-full max-w-lg relative z-10 bg-[#f4f7f4] border border-white shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.8)] rounded-[2.5rem] p-4 m-4 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        <CardHeader className="space-y-2 text-left px-6 pt-6 pb-2">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-[#16a34a] drop-shadow-sm">
            List a Plant
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm font-medium">
            Share your plant with the swap community.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 px-2">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 drop-shadow-sm"
              >
                Plant Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Monstera Deliciosa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 bg-[#e9ece9] border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#16a34a]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="difficulty"
                className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 drop-shadow-sm"
              >
                Care Difficulty
              </Label>
              <div className="relative">
                <select
                  id="difficulty"
                  className="flex h-12 w-full appearance-none rounded-xl border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] bg-[#e9ece9] px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]/50 transition-colors cursor-pointer"
                  value={careDifficulty}
                  onChange={(e) => setCareDifficulty(e.target.value)}
                  required
                >
                  <option value="Easy" className="text-black">
                    Easy
                  </option>
                  <option value="Medium" className="text-black">
                    Medium
                  </option>
                  <option value="Hard" className="text-black">
                    Hard
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 drop-shadow-sm">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 drop-shadow-sm"
              >
                Category
              </Label>
              <div className="relative">
                <select
                  id="category"
                  className="flex h-12 w-full appearance-none rounded-xl border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] bg-[#e9ece9] px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]/50 transition-colors cursor-pointer"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled className="text-slate-400">
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="text-black">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 drop-shadow-sm">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 drop-shadow-sm"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Tell us about this plant... (size, health, etc.)"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="resize-none bg-[#e9ece9] border-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#16a34a]/50 transition-all"
              />
            </div>

            <div className="space-y-2 pt-2">
              <Label
                htmlFor="plantImage"
                className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 drop-shadow-sm"
              >
                Plant Image (Optional)
              </Label>
              <div className="relative cursor-pointer mt-1">
                <Input
                  id="plantImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPlantImageFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full flex flex-col items-center justify-center gap-3 bg-[#e9ece9] border border-white shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-all duration-300 rounded-[1.5rem] p-6 hover:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.08),inset_-6px_-6px_12px_rgba(255,255,255,1)]">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f4f7f4] to-[#dcdfdc] shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#16a34a] transform transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.1))",
                      }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" x2="12" y1="8" y2="4" />
                      <line x1="12" x2="12" y1="20" y2="16" />
                      <line x1="8" x2="4" y1="12" y2="12" />
                      <line x1="20" x2="16" y1="12" y2="12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-600 text-sm drop-shadow-sm">
                      {plantImageFile
                        ? plantImageFile.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      High resolution PNG, JPG (max. 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-xl relative overflow-hidden bg-[#eff2ef] text-[#14532d] font-extrabold text-[15px] border border-white shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,1)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              disabled={addPlantMutation.isPending || uploading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm">
                {addPlantMutation.isPending || uploading
                  ? "Saving to database..."
                  : "List Plant for Swap"}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
