import { useQuery } from "@tanstack/react-query";
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

export default function Home() {
  const loggedInMemberId = Number(localStorage.getItem("memberId"));

  const { isPending, error, data } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/plants");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">
        <img
          src="/plant.png"
          alt="Plant Icon"
          className="w-10 h-10 inline-block mr-2"
        />{" "}
        Available Plants
      </h1>
      {isPending && (
        <p className="text-center text-slate-500">Loading plants...</p>
      )}
      {error && (
        <p className="text-center text-red-500">Error: Backend is offline.</p>
      )}

      {data && data.success && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((plant) => (
            <Card key={plant.id} className="flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-green-500 flex items-center justify-center bg-green-50 shrink-0 shadow-sm hover:rotate-12 transition-transform duration-300">
                  <img
                    src={plant.imageUrl || "/plant.png"}
                    alt={plant.name}
                    className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl text-green-700">
                    {plant.name}
                  </CardTitle>
                  <CardDescription>
                    Difficulty: {plant.careDifficulty}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{plant.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex flex-col">
                    <span className="inline-block mt-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                      Status: {plant.status}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <img
                      src={
                        plant.ownerImageUrl ||
                        `https://ui-avatars.com/api/?name=${plant.ownerName || "User"}&background=random`
                      }
                      alt={plant.ownerName}
                      className="w-8 h-8 rounded-full border border-slate-200"
                    />
                    <span className="text-sm text-slate-600 font-medium">
                      {plant.ownerName || "Unknown User"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="inline-block ">
                {plant.ownerId === loggedInMemberId ? (
                  <Button className="w-full mb-2" disabled variant="secondary">
                    Your Plant
                  </Button>
                ) : (
                  <Button className="w-full mb-2">Request Swap</Button>
                )}
                <Link to={`/plant/${plant.id}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-700 hover:bg-green-50"
                  >
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
