import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PlantDetails() {
  const loggedInMemberId = Number(localStorage.getItem("memberId"));

  // Grab the plant ID from the URL (e.g., /plant/3 -> id is 3)
  const { id } = useParams();

  // Fetch only this specific plant from Spring Boot
  const {
    isPending,
    error,
    data: plant,
  } = useQuery({
    queryKey: ["plant", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/api/v1/plants/${id}`);
      if (!response.ok) throw new Error("Failed to fetch plant details");
      const json = await response.json();
      // Unpack the data if your backend wraps it in a 'data' object
      return json.data || json;
    },
  });

  if (isPending)
    return (
      <div className="text-center mt-20 text-slate-500 text-xl">
        Loading plant details...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-20 text-red-500 text-xl">
        Error: Could not find this plant.
      </div>
    );
  if (!plant)
    return (
      <div className="text-center mt-20 text-slate-500 text-xl">
        Plant not found.
      </div>
    );

  return (
    <div className="container mx-auto p-8 max-w-5xl mt-6">
      <Link to="/">
        <Button
          variant="ghost"
          className="mb-6 text-slate-600 hover:text-green-700"
        >
          ← Back to Market
        </Button>
      </Link>

      <Card className="flex flex-col md:flex-row overflow-hidden shadow-lg border-slate-200">
        {/* Left Side: Image Placeholder */}
        <div className="md:w-1/2 bg-slate-100 flex items-center justify-center min-h-[400px] border-r border-slate-200">
          <img
            src={plant.imageUrl || "/plant.png"}
            alt={plant.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side: Plant Details */}
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="mb-2 text-sm text-slate-500 uppercase tracking-wider font-semibold">
            {plant.categoryName || "Uncategorized"}
          </div>

          <h1 className="text-4xl font-bold text-green-800 mb-4">
            {plant.name}
          </h1>

          <div className="flex gap-3 mb-8">
            <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Difficulty: {plant.careDifficulty}
            </span>
            <span className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
              Status: {plant.status}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            About this plant
          </h3>
          <p className="text-slate-600 mb-8 leading-relaxed whitespace-pre-line text-lg">
            {plant.description}
          </p>

          {/* This pushes the button to the very bottom of the card */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={
                  plant.ownerImageUrl ||
                  `https://ui-avatars.com/api/?name=${plant.ownerName || "User"}&background=random`
                }
                alt={plant.ownerName}
                className="w-12 h-12 rounded-full border-2 border-slate-200"
              />
              <div>
                <p className="text-sm font-medium text-slate-700">Listed by</p>
                <p className="text-lg font-semibold text-slate-900">
                  {plant.ownerName || "Unknown Member"}
                </p>
              </div>
            </div>
            {plant.ownerId === loggedInMemberId ? (
              <Button
                disabled
                variant="secondary"
                className="w-full text-lg py-6 cursor-not-allowed"
              >
                This is your plant
              </Button>
            ) : (
              <Button className="w-full bg-green-700 hover:bg-green-800 text-lg py-6">
                Request to Swap
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
