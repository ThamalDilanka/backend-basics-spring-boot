import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { isPending, error, data } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/v1/plants');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">🌱 Available Plants</h1>
      
      {isPending && <p className="text-center text-slate-500">Loading plants...</p>}
      {error && <p className="text-center text-red-500">Error: Backend is offline.</p>}

      {data && data.success && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((plant) => (
            <Card key={plant.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl text-green-700">{plant.name}</CardTitle>
                <CardDescription>Difficulty: {plant.careDifficulty}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{plant.description}</p>
                <span className="inline-block mt-4 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                  Status: {plant.status}
                </span>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Request Swap</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}