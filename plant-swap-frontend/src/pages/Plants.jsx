import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Plants() {
  const [page, setPage] = useState(0);
  const size = 9; // Number of items per page

  const { isPending, error, data } = useQuery({
    queryKey: ["plants", page, size],
    queryFn: async () => {
      // Assuming a pagination endpoint exists, e.g. /api/v1/plants?page=...&size=...
      // If it doesn't, we will fetch all and paginate on the client
      const response = await fetch("http://localhost:8080/api/v1/plants");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  // Client-side pagination if the backend returns the full array:
  const plantsList = Array.isArray(data) ? data : data?.data || [];
  const totalPages = Math.ceil(plantsList.length / size) || 1;
  const currentPlants = plantsList.slice(page * size, (page + 1) * size);

  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-[#f2f8f3] to-[#e6f4ea] pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#1b4332] text-center mb-10">
          All Plants
        </h1>

        {isPending && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#316B3D]"></div>
          </div>
        )}

        {error && (
          <p className="text-center text-red-500 py-10 bg-red-50/50 rounded-2xl font-medium">
            Error loading plants.
          </p>
        )}

        {currentPlants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPlants.map((plant, index) => (
              <div
                key={plant.id}
                className="group relative bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(49,107,61,0.15)] hover:border-green-200/70 transition-all duration-500 hover:-translate-y-3 flex flex-col justify-between"
              >
                {/* Plant Image Area */}
                <div className="relative w-full h-[260px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-100 to-[#e5eee3] mb-5 shadow-inner">
                  <div className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-md border border-white/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#1e4d2b] shadow-[0_0_8px_#1e4d2b]"></span>
                    <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">
                      {plant.status}
                    </span>
                  </div>
                  <img
                    src={
                      plant.imageUrl ||
                      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={plant.name}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700 ease-out"
                  />
                </div>

                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#1b4332] truncate pr-4">
                      {plant.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 font-medium">
                    {plant.description}
                  </p>

                  <Link to={`/plant/${plant.id}`}>
                    <Button className="w-full h-12 rounded-full bg-[#e8f5ee] hover:bg-[#d1ebd9] text-[#1e4d2b] font-bold shadow-none transition-colors border border-[#a6fcaf]/50 hover:border-[#a6fcaf]">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isPending && (
            <p className="text-center text-slate-500 mt-10 font-bold">
              No plants found.
            </p>
          )
        )}

        {/* Pagination Controls */}
        {!isPending && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pb-10">
            <Button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="rounded-full px-6 bg-white/70 hover:bg-white text-slate-800 font-bold shadow transition border border-transparent hover:shadow-md flex items-center"
            >
              <ChevronLeft size={18} className="mr-1" />
              Previous
            </Button>
            <span className="font-bold text-slate-600 px-5 py-2.5 bg-white/50 backdrop-blur rounded-full border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="rounded-full px-6 bg-[#316B3D] hover:bg-[#1e4d2b] text-white font-bold shadow-[0_8px_20px_rgba(49,107,61,0.3)] transition hover:shadow-md hover:scale-105 flex items-center"
            >
              Next
              <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
