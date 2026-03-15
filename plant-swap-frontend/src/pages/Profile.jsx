import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Profile() {
  const queryClient = useQueryClient();

  // Fetch the plants
  const { isPending, error, data } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/plants");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  // Filter out only the plants uploaded by our logged-in user
  const loggedInMemberId = Number(localStorage.getItem("memberId"));

  // React Query might give us the full `{ success: true, data: [...] }` if cached from Home.jsx
  // Or if it's returning the raw array somehow, we handle both.
  const plantArray = Array.isArray(data) ? data : data?.data || [];

  const myPlants = plantArray.filter(
    (plant) => plant.ownerId === loggedInMemberId,
  );

  // TanStack Mutation for deleting a plant
  const deletePlantMutation = useMutation({
    mutationFn: async (plantId) => {
      const response = await fetch(`/api/v1/plants/${plantId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete plant");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
      alert("Plant deleted successfully!");
    },
    onError: (error) => {
      alert("Error deleting plant: " + error.message);
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deletePlantMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl mt-6">
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-2">
            Manage your inventory and account settings.
          </p>
        </div>
        <Link to="/add-plant">
          <Button className="bg-green-700 hover:bg-green-800">
            + List New Plant
          </Button>
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-slate-700 mb-6">
        My Listed Plants
      </h2>

      {isPending && <p className="text-slate-500">Loading your plants...</p>}
      {error && <p className="text-red-500">Error loading your inventory.</p>}

      {/* If they haven't uploaded anything yet */}
      {myPlants.length === 0 && !isPending && !error && (
        <div className="text-center p-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <span className="text-5xl block mb-4">🪴</span>
          <h3 className="text-xl font-medium text-slate-700 mb-2">
            You haven't listed any plants yet
          </h3>
          <p className="text-slate-500 mb-6">
            Share your first plant with the community to start swapping!
          </p>
          <Link to="/add-plant">
            <Button
              variant="outline"
              className="border-green-600 text-green-700"
            >
              Get Started
            </Button>
          </Link>
        </div>
      )}

      {/* Grid of the user's plants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myPlants.map((plant) => (
          <Card
            key={plant.id}
            className="flex flex-col justify-between border-slate-200 shadow-sm"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-dashed border-green-500 flex items-center justify-center bg-green-50 shrink-0 shadow-sm">
                <img
                  src={plant.imageUrl || "/plant.png"}
                  alt={plant.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-800">
                  {plant.name}
                </CardTitle>
                <CardDescription>
                  Difficulty: {plant.careDifficulty}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 line-clamp-2">{plant.description}</p>
              <span className="inline-block mt-4 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                Status: {plant.status}
              </span>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Link to={`/edit-plant/${plant.id}`} className="w-1/2">
                <Button variant="outline" className="w-full border-slate-300">
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-1/2"
                onClick={() => handleDelete(plant.id, plant.name)}
                disabled={deletePlantMutation.isPending}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
