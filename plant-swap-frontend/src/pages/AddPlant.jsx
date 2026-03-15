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
    <div className="container mx-auto p-8 flex justify-center mt-10">
      <Card className="w-full max-w-lg shadow-md border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">
            List a Plant
          </CardTitle>
          <CardDescription>
            Share your plant with the swap community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Plant Name</Label>
              <Input
                id="name"
                placeholder="e.g., Monstera Deliciosa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Care Difficulty</Label>
              <select
                id="difficulty"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={careDifficulty}
                onChange={(e) => setCareDifficulty(e.target.value)}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {/* Now this map will always have data to use! */}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about this plant... (size, health, etc.)"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plantImage">Plant Image (Optional)</Label>
              <Input
                id="plantImage"
                type="file"
                accept="image/*"
                onChange={(e) => setPlantImageFile(e.target.files[0])}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50"
              disabled={addPlantMutation.isPending || uploading}
            >
              {addPlantMutation.isPending || uploading
                ? "Saving..."
                : "List Plant for Swap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
