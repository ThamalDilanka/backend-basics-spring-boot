import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Mock feedback data
const MOCK_FEEDBACK = [
  {
    id: 1,
    user: "Sarah J.",
    text: "Wow, this looks so healthy! Would you trade for a Snake Plant?",
    date: "2 days ago",
  },
  {
    id: 2,
    user: "Mike T.",
    text: "How tall is it currently?",
    date: "Yesterday",
  },
];

export default function PlantDetails() {
  const navigate = useNavigate();
  const loggedInMemberId = Number(localStorage.getItem("memberId"));

  const { id } = useParams();

  // Feedback state
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);

  const {
    isPending,
    error,
    data: plant,
  } = useQuery({
    queryKey: ["plant", id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/plants/${id}`);
      if (!response.ok) throw new Error("Failed to fetch plant details");
      const json = await response.json();
      return json.data || json;
    },
  });

  const { data: feedbacks = [], refetch: refetchFeedbacks } = useQuery({
    queryKey: ["plantFeedbacks", plant?.ownerId],
    queryFn: async () => {
      if (!plant?.ownerId) return [];
      const res = await fetch(`/api/v1/feedback/member/${plant.ownerId}`);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []).map((f) => ({
        id: f.id,
        user: f.reviewerName,
        text: f.comments,
        // Since owner isn't technically rating, we could maybe not show stars if they are the owner,
        // but for now let's just use stars for all, as requested by replacing the text rating.
        date: f.rating ? "⭐".repeat(f.rating) : "",
      }));
    },
    enabled: !!plant?.ownerId,
  });

  const addFeedbackMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`/api/v1/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to post feedback");
      return response.json();
    },
    onSuccess: () => {
      alert("Feedback posted successfully!");
      setNewComment("");
      setRating(5);
      refetchFeedbacks();
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`/api/v1/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const handleRequestSwap = () => {
    if (!loggedInMemberId) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    // Using a default message since the UI doesn't have a message input here yet
    const message = "Hi, I would love to swap for your " + plant.name + "!";

    createRequestMutation.mutate({
      requesterId: loggedInMemberId,
      plantId: plant.id,
      message: message,
    });
  };

  // Feedback handler
  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!loggedInMemberId) {
      alert("Please login to post feedback");
      return;
    }
    if (!newComment.trim()) return;

    addFeedbackMutation.mutate({
      reviewer: { id: loggedInMemberId },
      reviewedMember: { id: plant.ownerId },
      rating: plant.ownerId === loggedInMemberId ? 0 : rating,
      comments: newComment,
    });
  };

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
    <div className="min-h-screen w-full relative flex flex-col font-sans text-[#191c1a] selection:bg-[#006c48]/20">
      {/* Custom Styles for the specific effects */}
      <style>
        {`
          .glass-card-botanica {
            background: rgba(255, 255, 255, 0.45);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
          .wood-frame-botanica {
            background: linear-gradient(135deg, #8b5e3c 0%, #5d3f2a 100%);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 10px 25px rgba(0,0,0,0.1);
            border: 8px solid #a67c52;
          }
          .liquid-fill-botanica {
            background: linear-gradient(135deg, #006c48 0%, #2a9569 100%);
            position: relative;
            overflow: hidden;
          }
          .liquid-fill-botanica::after {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(255,255,255,0.15);
            border-radius: 38%;
            animation: wave 10s linear infinite;
          }
          @keyframes wave {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .sunk-in-botanica {
            box-shadow: inset 2px 2px 8px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(255,255,255,0.5);
          }
          .tilted-perspective-botanica {
            transform: perspective(1000px) rotateY(-2deg) rotateX(1deg);
            transition: transform 0.5s ease-out;
          }
          .tilted-perspective-botanica:hover {
            transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
          }
        `}
      </style>

      {/* Background Elements */}
      <div className="fixed inset-0 z-[0] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9f4] via-[#f7faf8] to-[#e8f3ec]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#c4f0d5]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#d1e8da]/30 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-[#006c48]/10 blur-sm rounded-full opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-[#4d6356]/15 blur-md rounded-full opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-[#006c48]/20 blur-sm rounded-full opacity-40"></div>
      </div>

      <main className="flex-grow pt-8 pb-20 px-4 md:px-12 max-w-7xl mx-auto w-full relative z-10">
        <Link to="/" className="inline-block mb-10 group">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.03)] text-[#4d6356] font-extrabold text-[11px] tracking-widest uppercase transition-all duration-300 hover:-translate-x-1 hover:bg-white/90 hover:text-[#006c48] hover:shadow-[0_8px_25px_rgba(0,108,72,0.12)]">
            <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#006c48] group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </div>
            Back to Market
          </div>
        </Link>

        {/* Hero Section: Tilted Glass Card */}
        <div className="tilted-perspective-botanica glass-card-botanica rounded-xl p-8 md:p-12 border border-white/60 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out">
          {/* Plant Frame (Skeuomorphic Wood) */}
          <div className="wood-frame-botanica rounded-xl overflow-hidden relative aspect-square group">
            <img
              src={plant.imageUrl || "/HeroSub.jpg"}
              alt={plant.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            {plant.status && (
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/80 backdrop-blur-md text-[#006c48] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#006c48]/10 shadow-sm">
                  {plant.status}
                </span>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[#006c48] text-sm uppercase tracking-widest font-bold mb-2">
                {plant.categoryName || "Uncategorized"}
              </h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#006c48] via-[#4d6356] to-[#c4f0d5] leading-tight pb-2">
                {plant.name}
              </h1>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2 bg-[#c4f0d5]/40 border border-[#006c48]/10 px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#006c48] animate-pulse"></span>
                <span className="text-xs font-bold text-[#006c48] tracking-wide">
                  {plant.careDifficulty} Difficulty
                </span>
              </div>
            </div>

            <p className="text-[#414942] text-lg leading-relaxed font-light">
              {plant.description ||
                "A stunning specimen ready for a new home. This plant has been cultivated with care, exhibiting lush foliage and perfect health. Ideal for enhancing your indoor or outdoor space."}
            </p>

            {/* Owner Card */}
            <div className="flex items-center gap-4 bg-white/40 p-4 rounded-xl border border-black/5 transition-transform hover:scale-[1.01]">
              <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-br from-[#c4f0d5] to-[#d1e8da] shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white sunk-in-botanica">
                  <img
                    src={
                      plant.ownerImageUrl ||
                      `https://ui-avatars.com/api/?name=${plant.ownerName || "User"}&background=c4f0d5&color=006c48`
                    }
                    alt={plant.ownerName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="text-[#191c1a] font-bold">
                  {plant.ownerName || "Unknown Member"}
                </div>
                <div className="text-[#717973] text-xs tracking-wider uppercase font-semibold">
                  Plant Owner • Community Member
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            {plant.ownerId === loggedInMemberId ? (
              <button
                disabled
                className="bg-slate-200 w-full py-5 rounded-full text-slate-500 font-black text-xl tracking-tight shadow-sm cursor-not-allowed border border-white/60 relative overflow-hidden"
              >
                <span className="relative z-10">This is your plant</span>
              </button>
            ) : (
              <button
                onClick={handleRequestSwap}
                disabled={createRequestMutation.isPending}
                className="liquid-fill-botanica group relative w-full py-5 rounded-full text-white font-black text-xl tracking-tight shadow-lg hover:shadow-[#006c48]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 border border-white/20"
              >
                <span className="relative z-10">
                  {createRequestMutation.isPending
                    ? "Sending Request..."
                    : "Request to Swap"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <section className="space-y-12">
          <div className="flex justify-between items-end border-b border-[#006c48]/10 pb-4">
            <h3 className="text-3xl font-bold tracking-tight text-[#191c1a]">
              Community Feedback & Questions
            </h3>
            <span className="text-[#717973] text-sm uppercase tracking-widest pb-1 font-bold">
              {feedbacks.length} Contributions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.length === 0 ? (
              <div className="col-span-1 md:col-span-2 glass-card-botanica p-8 rounded-xl border border-white/80 text-center text-[#717973] italic">
                No feedback yet. Be the first to ask a question!
              </div>
            ) : (
              feedbacks.map((fb, idx) => (
                <div
                  key={fb.id}
                  className="glass-card-botanica p-6 rounded-xl border border-white/80 hover:translate-y-[-8px] transition-transform duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-bottom-6"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-black/5 overflow-hidden flex justify-center items-center font-bold text-[#006c48]">
                        {fb.user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#191c1a]">
                          {fb.user}
                        </div>
                        <div className="text-[10px] text-[#717973] uppercase tracking-tighter font-semibold">
                          Community Member
                        </div>
                      </div>
                    </div>
                    <div className="flex text-[#006c48] gap-[2px]">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < (fb.date.length || 5) ? "text-[#006c48]" : "text-slate-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[#414942] text-sm italic leading-relaxed">
                    "{fb.text}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Feedback Form (Skeuomorphic Light) */}
          <div className="bg-white/30 backdrop-blur-md p-8 rounded-xl border border-white/40 relative overflow-hidden shadow-[inset_0_2px_15px_rgba(0,0,0,0.03)]">
            <div className="absolute top-[-20px] right-[-20px] p-4 opacity-5 rotate-12 pointer-events-none">
              <svg
                className="w-48 h-48 text-[#006c48]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h4 className="text-xl font-bold mb-6 text-[#191c1a] relative z-10">
              {plant.ownerId === loggedInMemberId
                ? "Reply to questions"
                : "Share your thoughts"}
            </h4>

            <form
              onSubmit={handleAddFeedback}
              className="space-y-6 relative z-10"
            >
              {plant.ownerId !== loggedInMemberId && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-[#717973] uppercase tracking-widest font-bold">
                    Your Rating:
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all hover:scale-110 ${star <= rating ? "text-[#006c48] drop-shadow-[0_0_5px_rgba(0,108,72,0.3)]" : "text-[#717973]/30"}`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="sunk-in-botanica bg-white/50 rounded-xl p-1 transition-all focus-within:bg-white/80">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-transparent border-none focus-visible:ring-0 text-[#191c1a] placeholder:text-[#717973]/50 p-4 font-light text-[15px] h-32 resize-none shadow-none"
                  placeholder={
                    plant.ownerId === loggedInMemberId
                      ? "Answer questions or add updates..."
                      : "Tell the community about your interest or ask a question..."
                  }
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#006c48] text-white px-8 py-3 rounded-full border border-[#006c48] shadow-lg hover:bg-[#005a3b] active:scale-[0.98] transition-all font-bold uppercase tracking-widest text-[11px]"
                >
                  Post Contribution
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
