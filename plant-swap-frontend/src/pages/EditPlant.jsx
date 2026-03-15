import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const FALLBACK_CATEGORIES = [
  { id: 1, name: "Succulents" },
  { id: 2, name: "Indoor Foliage" },
  { id: 3, name: "Herbs" },
  { id: 4, name: "Flowering" },
  { id: 5, name: "Cacti" },
  { id: 6, name: "Indoor Plants" },
  { id: 7, name: "Outdoor Plants" },
];

export default function EditPlant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [careDifficulty, setCareDifficulty] = useState("Easy");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("Available");
  const [plantImageFile, setPlantImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 1. Fetch Categories for the dropdown
  const { data: categories = FALLBACK_CATEGORIES } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/v1/categories");
      if (!response.ok) return FALLBACK_CATEGORIES;
      const json = await response.json();
      return json.data || json;
    },
  });

  // 2. Fetch the specific plant we want to edit
  const { isPending: isLoadingPlant, data: plant } = useQuery({
    queryKey: ["plant", id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/plants/${id}`);
      if (!response.ok) throw new Error("Failed to fetch plant");
      const json = await response.json();
      return json.data || json;
    },
  });

  // 3. When the plant data arrives, fill in the text boxes!
  useEffect(() => {
    if (plant && categories.length > 0) {
      setName(plant.name || "");
      setDescription(plant.description || "");
      setImageUrl(plant.imageUrl || "");

      // Match case-insensitively just in case
      const upperDifficulty = plant.careDifficulty
        ? plant.careDifficulty.charAt(0).toUpperCase() +
          plant.careDifficulty.slice(1).toLowerCase()
        : "Easy";
      setCareDifficulty(upperDifficulty);

      // Find category ID by name
      if (plant.categoryName) {
        const foundCat = categories.find((c) => c.name === plant.categoryName);
        if (foundCat) setCategoryId(foundCat.id);
      } else {
        setCategoryId(plant.categoryId || "");
      }

      // Status map for frontend to enum
      const statusMap = {
        AVAILABLE: "AVAILABLE",
        PENDING_EXCHANGE: "PENDING_EXCHANGE",
        SWAPPED: "SWAPPED",
      };
      setStatus(statusMap[plant.status] || "AVAILABLE");
    }
  }, [plant, categories]);

  // 4. TanStack Mutation for sending the PUT request (Update)
  const updatePlantMutation = useMutation({
    mutationFn: async (updatedPlant) => {
      // 1. Send the PUT request for general details
      const response = await fetch(`/api/v1/plants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPlant),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update plant");

      // 2. Send the PATCH request for status if it changed
      if (plant && status.toUpperCase() !== plant.status?.toUpperCase()) {
        const patchRes = await fetch(`/api/v1/plants/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: status.toUpperCase() }),
        });
        const patchData = await patchRes.json();
        if (!patchRes.ok)
          throw new Error(patchData.message || "Failed to update status");
      }

      return data;
    },
    onSuccess: () => {
      // Refresh the data so the user sees their changes instantly
      queryClient.invalidateQueries({ queryKey: ["plants"] });
      queryClient.invalidateQueries({ queryKey: ["plant", id] });
      alert("Plant updated successfully! 🌱");
      navigate("/profile");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = imageUrl || null;

    try {
      const memberIdFromStorage = localStorage.getItem("memberId");
      const parsedMemberId = Number(memberIdFromStorage);
      const activeMemberId =
        Number.isInteger(parsedMemberId) && parsedMemberId > 0
          ? parsedMemberId
          : plant?.ownerId || 1;

      // Upload image to Cloudinary if a new file is selected
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
          finalImageUrl = cloudinaryData.secure_url;
        } else {
          console.error("Cloudinary Error Response:", cloudinaryData);
          throw new Error(
            cloudinaryData.error?.message || "Failed to upload image",
          );
        }
      }

      updatePlantMutation.mutate({
        name,
        description,
        imageUrl: finalImageUrl,
        careDifficulty: careDifficulty.toUpperCase(),
        categoryId: parseInt(categoryId),
        memberId: activeMemberId,
      });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (isLoadingPlant) {
    return (
      <div className="text-center mt-20 text-slate-500 text-xl">
        Loading your plant data...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 flex justify-center mt-6">
      <Card className="w-full max-w-lg shadow-md border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">
            Edit Plant
          </CardTitle>
          <CardDescription>
            Update the details for your {plant?.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Plant Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageFile">Update Image</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => setPlantImageFile(e.target.files[0])}
              />
              <p className="text-xs text-muted-foreground">
                Select a new image to replace the current one.
              </p>

              {imageUrl && !plantImageFile && (
                <div className="mt-2 h-32 w-32 rounded-md overflow-hidden border border-slate-200">
                  <img
                    src={imageUrl}
                    alt="Current Plant"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              {plantImageFile && (
                <div className="mt-2 text-sm text-green-600">
                  Ready to upload new image: {plantImageFile.name}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Care Difficulty</Label>
                <select
                  id="difficulty"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
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
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="PENDING_EXCHANGE">Pending Swap</option>
                  <option value="SWAPPED">Swapped</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
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
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-1/3"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-2/3 bg-green-700 hover:bg-green-800"
                disabled={updatePlantMutation.isPending || uploading}
              >
                {uploading
                  ? "Uploading Image..."
                  : updatePlantMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
