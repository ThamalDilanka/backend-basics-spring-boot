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
    <div className="container mx-auto p-8 max-w-5xl mt-6">
      <Link to="/">
        <Button
          variant="ghost"
          className="mb-6 text-slate-600 hover:text-green-700"
        >
          {" "}
          Back to Market
        </Button>
      </Link>

      {/* MAIN PLANT CARD (Untouched) */}
      <Card className="flex flex-col md:flex-row overflow-hidden shadow-lg border-slate-200 mb-12">
        <div className="md:w-1/2 bg-slate-100 flex items-center justify-center min-h-[400px] border-r border-slate-200">
          <img
            src={plant.imageUrl || "/plant.png"}
            alt={plant.name}
            className="object-cover w-full h-full"
          />
        </div>
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
          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={
                  plant.ownerImageUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    (plant.ownerName || "User")
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
              <Button
                onClick={handleRequestSwap}
                disabled={createRequestMutation.isPending}
                className="w-full bg-green-700 hover:bg-green-800 text-lg py-6"
              >
                {createRequestMutation.isPending
                  ? "Requesting..."
                  : "Request to Swap"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* NEW FEEDBACK SECTION */}
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Community Feedback & Questions
        </h2>

        {/* The List of Comments */}
        <div className="space-y-4 mb-8">
          {feedbacks.length === 0 ? (
            <p className="text-slate-500 italic">
              No feedback yet. Be the first to ask a question!
            </p>
          ) : (
            feedbacks.map((fb) => (
              <Card key={fb.id} className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-700">
                      {fb.user}
                    </span>
                    <span className="text-xs text-slate-400">{fb.date}</span>
                  </div>
                  <p className="text-slate-600">{fb.text}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* The Form to Add New Feedback */}
        <form
          onSubmit={handleAddFeedback}
          className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-700 mb-3">
            {plant.ownerId === loggedInMemberId
              ? "Reply to questions"
              : "Leave a comment"}
          </h3>
          {plant.ownerId !== loggedInMemberId && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl hover:scale-110 transition-transform ${star <= rating ? "text-yellow-400" : "text-slate-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}
          <Textarea
            placeholder={
              plant.ownerId === loggedInMemberId
                ? "Answer questions or add updates..."
                : "Ask a question about this plant or leave a review..."
            }
            className="mb-4"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
              Post Feedback
            </Button>
          </div>
        </form>
      </div>
      {/* END OF FEEDBACK SECTION */}
    </div>
  );
}
