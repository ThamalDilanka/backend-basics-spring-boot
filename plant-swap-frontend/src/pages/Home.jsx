import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Sparkles, Sprout, Plus } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const loggedInMemberId = Number(localStorage.getItem("memberId"));

  const { isPending, error, data } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/plants");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch("/api/v1/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create request");
      return response.json();
    },
    onSuccess: () => {
      alert("Swap requested successfully!");
      navigate("/requests");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleRequestSwap = (plant) => {
    if (!loggedInMemberId) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    const message = "Hi, I would love to swap for your " + plant.name + "!";
    createRequestMutation.mutate({
      requesterId: loggedInMemberId,
      plantId: plant.id,
      message: message,
    });
  };

  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-[#f2f8f3] to-[#e6f4ea] overflow-hidden">
      {/* Ambient Liquid Glass Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-200/60 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
      <div
        className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-teal-200/50 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[#dcfce7]/70 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="container relative z-10 mx-auto px-6 pt-32 pb-12 lg:px-12 max-w-7xl">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between pt-8 pb-20 gap-12">
          <div className="lg:w-[45%] space-y-8 z-10 animate-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md shadow-sm text-[10px] font-extrabold text-[#2a6b3d] uppercase tracking-widest">
              <Sparkles size={14} className="text-[#2a6b3d]" />
              WEB3 Botanical Exchange
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-bold text-[#1f2937] leading-[1.05] tracking-tight">
              The Future <br />
              of <span className="text-[#316B3D]">Plant</span> <br />
              Swapping
            </h1>

            <p className="text-base text-slate-600 max-w-[90%] leading-relaxed font-medium">
              Join an organic ecosystem where rare genetics meet digital
              security. Trade, grow, and curate your living gallery in the
              world's most advanced plant marketplace.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button className="h-12 px-8 rounded-full bg-[#316B3D] hover:bg-[#1e4d2b] shadow-[0_8px_20px_rgba(49,107,61,0.3)] text-white text-[15px] font-bold transition-all hover:scale-105 duration-300">
                Start Swapping
              </Button>
              <Button
                variant="ghost"
                className="h-12 px-8 rounded-full bg-white/70 hover:bg-white text-slate-800 text-[15px] font-bold transition-all border border-transparent shadow-sm hover:shadow-md hover:scale-105 duration-300"
              >
                Explore Gallery
              </Button>
            </div>
          </div>

          <div className="lg:w-[55%] relative flex justify-center lg:justify-end animate-in zoom-in-95 duration-1000 mt-10 lg:mt-0">
            {/* Background Circular Highlight */}
            <div className="absolute top-[60%] left-[20%] w-[350px] h-[350px] bg-[#cde8cd] rounded-full mix-blend-multiply blur-2xl z-0 -translate-y-1/2"></div>

            {/* Main 3D Card Container rotated */}
            <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] -rotate-3 hover:rotate-0 transition-transform duration-700 ease-out z-10 bg-white overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/plant.png";
                }}
                alt="Monstera Header"
                className="w-full h-full object-cover object-[center_70%] group-hover:scale-105 transition-transform duration-[1500ms]"
              />
            </div>

            {/* Floating Mini Top Right Card */}
            <div
              className="absolute -top-8 -right-4 lg:-right-6 w-[140px] h-[140px] bg-white rounded-[2rem] shadow-[0_25px_50px_rgba(0,0,0,0.15)] flex items-center justify-center animate-[bounce_5s_infinite] z-20 overflow-hidden"
              style={{ animationTimingFunction: "ease-in-out" }}
            >
              <div className="w-full h-full p-2">
                <img
                  src="/HeroSub.jpg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/plant.png";
                  }}
                  alt="Hero Small Icon"
                  className="w-full h-full object-cover rounded-[1.5rem] shadow-inner"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Swaps */}
        <section className="py-12 mt-10">
          <div className="flex justify-between items-end mb-10 pl-2">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">
                Trending Swaps
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                Curated rare species available for immediate exchange.
              </p>
            </div>
            <Link to="/plants">
              <Button
                variant="outline"
                className="hidden sm:flex h-10 px-6 rounded-full bg-white/50 backdrop-blur-md border-white/60 text-slate-800 font-bold hover:bg-white/80 shadow-sm transition-all hover:scale-105"
              >
                <Eye className="w-4 h-4 mr-2" /> View All
              </Button>
            </Link>
          </div>

          {isPending && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#316B3D]"></div>
            </div>
          )}
          {error && (
            <p className="text-center text-red-500 py-10 bg-red-50/50 rounded-2xl font-medium">
              Error: Backend is offline.
            </p>
          )}

          {data && data.success && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.data.map((plant, index) => (
                <div
                  key={plant.id}
                  className="group relative bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(49,107,61,0.15)] hover:border-green-200/70 transition-all duration-500 hover:-translate-y-3 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-10"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {/* Inner glowing edge effect */}
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>

                  {/* Plant Image Area */}
                  <div className="relative w-full h-[260px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-100 to-[#e5eee3] mb-5 shadow-inner">
                    <div className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-md border border-white/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#1e4d2b] animate-pulse shadow-[0_0_8px_#1e4d2b]"></span>
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

                  {/* Details Block */}
                  <div className="px-3 flex-grow z-10">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-[1.35rem] font-bold text-slate-800 leading-tight group-hover:text-[#316B3D] transition-colors tracking-tight">
                          {plant.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1 font-medium">
                          {plant.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pl-3">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                          Owner
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-700">
                            {plant.ownerName
                              ? plant.ownerName.split(" ")[0]
                              : "User"}
                          </span>
                          <img
                            src={
                              plant.ownerImageUrl ||
                              "https://ui-avatars.com/api/?name=" +
                                (plant.ownerName || "User") +
                                "&background=random"
                            }
                            alt="Owner"
                            className="w-7 h-7 rounded-full border-2 border-white shadow-sm bg-slate-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mt-4 mb-6">
                      <span
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm border ${plant.careDifficulty === "Easy" ? "bg-[#c9eed1]/50 text-[#1e4d2b] border-[#a6fcaf]/50" : plant.careDifficulty === "Hard" ? "bg-red-100/50 text-red-800 border-red-200/50" : "bg-amber-100/50 text-amber-800 border-amber-200/50"}`}
                      >
                        Difficulty: {plant.careDifficulty || "Medium"}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-white/40 border border-white/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Standard
                      </span>
                    </div>
                  </div>

                  {/* Push Action Buttons to Bottom */}
                  <div className="flex items-center gap-3 mt-auto px-2 z-10 pb-1">
                    {plant.ownerId === loggedInMemberId ? (
                      <Button
                        disabled
                        className="flex-1 h-[3.25rem] rounded-2xl bg-white/40 border border-white/50 text-slate-500 font-bold shadow-none backdrop-blur-sm"
                      >
                        Your Plant
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 h-[3.25rem] rounded-2xl bg-[#316B3D] hover:bg-[#1e4d2b] shadow-[0_8px_20px_rgb(49,107,61,0.3)] text-white font-bold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center relative overflow-hidden group/btn"
                        onClick={() => handleRequestSwap(plant)}
                        disabled={createRequestMutation.isPending}
                      >
                        <span className="relative z-10">Request Swap</span>
                        <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] group-hover/btn:w-[150%] transition-all duration-700 ease-in-out -translate-x-[150%] group-hover/btn:translate-x-0"></div>
                      </Button>
                    )}
                    <Link to={"/plant/" + plant.id} className="shrink-0 block">
                      <Button
                        variant="outline"
                        className="w-[3.25rem] h-[3.25rem] p-0 rounded-2xl bg-white/50 backdrop-blur-md border-white/60 hover:bg-white text-slate-700 shadow-sm transition-all duration-300 hover:scale-[1.05]"
                      >
                        <Eye size={22} className="text-slate-600" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Features Bento Grid */}
        <section className="py-16">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:h-[420px]">
            {/* Giant Graphic Card (Left) */}
            <div className="xl:col-span-5 relative rounded-[3rem] overflow-hidden group shadow-[0_20px_40px_rgb(0,0,0,0.08)] h-[350px] xl:h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 group-hover:from-black/90 transition-colors duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
                alt="Jungle Variegation"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
              />
              <div className="absolute bottom-0 left-0 p-10 z-20 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-md">
                  Rare Variegation Collection
                </h3>
                <p className="text-white/90 text-sm mb-8 max-w-sm font-medium leading-relaxed drop-shadow-sm">
                  Explore the world's most unique patterns and curated mutations
                  straight from the tropics.
                </p>
                <Button className="h-12 bg-white text-[#1e4d2b] hover:bg-slate-50 rounded-full px-8 font-extrabold shadow-xl hover:scale-105 transition-transform duration-300">
                  Explore Collection
                </Button>
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="xl:col-span-7 flex flex-col gap-6 h-full">
              {/* Wide Card */}
              <div className="relative h-[200px] xl:flex-1 rounded-[3rem] overflow-hidden shadow-sm group border border-white/60 bg-white/20 backdrop-blur-md">
                <img
                  src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=80"
                  alt="Minimalist Leaves"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out mix-blend-overlay opacity-60"
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="bg-white/40 backdrop-blur-md border border-white/60 text-slate-800 text-[10px] font-extrabold px-4 py-1.5 rounded-full tracking-widest shadow-sm uppercase">
                    New Arrivals
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 z-20 max-w-[60%]">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">
                    Curated Indoor Jungle
                  </h3>
                </div>
              </div>

              {/* Bottom Twin Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:h-[200px]">
                {/* Info Card 1 */}
                <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-8 flex flex-col justify-center shadow-sm hover:shadow-[0_10px_30px_rgb(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-green-100/50 rounded-2xl flex items-center justify-center mb-5 border border-white">
                    <Sprout size={24} className="text-[#316B3D]" />
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-800 mb-1">
                    Sustainable Swapping
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">
                    Zero-carbon botanical trade infrastructure.
                  </p>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-gradient-to-br from-[#a6fcaf] to-[#7be988] rounded-[3rem] p-8 flex flex-col justify-center relative overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgb(123,233,136,0.3)] transition-all duration-300 hover:-translate-y-1 group">
                  <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/30 rounded-full filter blur-[30px] group-hover:scale-150 transition-transform duration-700"></div>
                  <h4 className="text-5xl font-black text-[#1e4d2b] mb-1 tracking-tighter drop-shadow-sm">
                    10k+
                  </h4>
                  <h5 className="text-lg font-extrabold text-[#2a6b3d] mb-1">
                    Active Botanists
                  </h5>
                  <p className="text-sm text-[#1e4d2b]/70 font-bold">
                    Global community network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Decorative Fixed Floating Element */}
      <div
        className="fixed bottom-8 right-8 z-50 animate-bounce group"
        style={{ animationDuration: "3s" }}
      >
        <Link to="/add-plant">
          <button className="w-16 h-16 bg-white/80 backdrop-blur-xl border border-white shadow-[0_10px_30px_rgb(0,0,0,0.1)] text-[#316B3D] rounded-full flex items-center justify-center hover:scale-110 hover:bg-[#316B3D] hover:text-white transition-all duration-300">
            <Plus
              size={32}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </Link>
      </div>
    </div>
  );
}
