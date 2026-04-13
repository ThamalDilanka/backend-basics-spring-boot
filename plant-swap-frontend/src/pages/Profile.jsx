import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// --- Custom 3D Tilt Component ---
const TiltCard = ({ children, className }) => {
  const [style, setStyle] = useState({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.6s ease-out",
    });
  };

  return (
    <div
      className={className}
      style={{ ...style, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// --- Animated Counter Hook (GSAP-like pure CSS/JS) ---
const CountUp = ({ end, decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const intervalTime = 16;
    let increment = end / (duration / intervalTime);

    if (end <= 0) {
      setCount(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, intervalTime);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{count.toFixed(decimals)}</span>;
};

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });

  const loggedInMemberId = Number(localStorage.getItem("memberId"));

  // 1. Fetch Member Profile
  const { data: memberData } = useQuery({
    queryKey: ["member", loggedInMemberId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/members/${loggedInMemberId}`);
      if (!response.ok) throw new Error("Failed to fetch member profile");
      return response.json();
    },
    enabled: !!loggedInMemberId,
  });

  // Keep Edit form synced with initial data
  useEffect(() => {
    if (memberData && !isEditing) {
      const liveMember = memberData.data || memberData;
      setEditForm({
        name: liveMember.name || "",
        email: liveMember.email || "",
        profilePicture: liveMember.profilePicture || "",
      });
    }
  }, [memberData, isEditing]);

  // 2. Fetch Plants
  const {
    isPending: isPlantsPending,
    error: plantsError,
    data: plantsData,
  } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetch("/api/v1/plants");
      if (!response.ok) throw new Error("Failed to fetch plants");
      return response.json();
    },
  });

  // 3. Fetch Requests (For swapped items stats)
  const { data: requestsData } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/requests`);
      if (!response.ok) throw new Error("Failed to fetch requests");
      return response.json();
    },
  });

  // 4. Fetch Feedback (For rating stats)
  const { data: feedbackData } = useQuery({
    queryKey: ["feedback", loggedInMemberId],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/feedback/member/${loggedInMemberId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch feedback");
      return response.json();
    },
    enabled: !!loggedInMemberId,
  });

  // --- Real Data Bindings ---
  // API responses return { success: true, data: { ... } }
  const member = memberData?.data || memberData || {};
  let memberSince = "Newly Joined";
  if (member.createdAt) {
    const date = new Date(member.createdAt);
    memberSince = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  const plantArray = Array.isArray(plantsData)
    ? plantsData
    : plantsData?.data || [];
  const myPlants = plantArray.filter(
    (plant) => plant.ownerId === loggedInMemberId,
  );

  const reqArray = Array.isArray(requestsData)
    ? requestsData
    : requestsData?.data || [];
  const swapsDoneCount = reqArray.filter(
    (r) => r.requesterId === loggedInMemberId && r.status === "ACCEPTED",
  ).length;

  const fbArray = Array.isArray(feedbackData)
    ? feedbackData
    : feedbackData?.data || [];
  const totalRating = fbArray.reduce(
    (acc, curr) => acc + (curr.rating || 0),
    0,
  );
  const avgRating = fbArray.length > 0 ? totalRating / fbArray.length : 0;

  const avatarUrl =
    member.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || "User")}&background=d4f0e0&color=2d6a4f`;

  // --- Mutations ---
  const editProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await fetch(`/api/v1/members/${loggedInMemberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: (data) => {
      // data from server: { success: boolean, data: { name, email, profilePicture, ... } }
      const updatedMember = data.data || data;
      if (updatedMember) {
        if (updatedMember.name)
          localStorage.setItem("name", updatedMember.name);
        if (updatedMember.profilePicture)
          localStorage.setItem("profilePicture", updatedMember.profilePicture);
        window.dispatchEvent(new Event("auth-change"));
      }

      queryClient.invalidateQueries({ queryKey: ["member", loggedInMemberId] });
      setIsEditing(false);
      alert("Profile updated successfully!");
    },
    onError: (err) => {
      alert("Error saving profile: " + err.message);
    },
  });

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // If a new file is selected, upload it to Cloudinary first
    if (profileImageFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", profileImageFile);
      formData.append("upload_preset", "plant_swap_preset");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dayy8te6n/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await response.json();

        if (data.secure_url) {
          const finalData = { ...editForm, profilePicture: data.secure_url };
          editProfileMutation.mutate(finalData);
        } else {
          setIsUploading(false);
          alert("Image upload failed. Please try again.");
          return;
        }
      } catch (err) {
        setIsUploading(false);
        console.error("Cloudinary error:", err);
        alert("Image upload error.");
        return;
      }
    } else {
      // No new file, just update with current data
      editProfileMutation.mutate(editForm);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-[#f0faf4] via-[#d4f0e0] to-[#e8f5ee] overflow-hidden pt-28 pb-24 font-sans selection:bg-[#52b788]/30">
      {/* --- Custom CSS specific to this luxury layout --- */}
      <style>
        {`
          .liquid-blob-profile {
            animation: blobMorph 10s ease-in-out infinite alternate;
          }
          @keyframes blobMorph {
            0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
            34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
            67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
            100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          }
          .liquid-btn {
            position: relative;
            overflow: hidden;
            background: #2d6a4f;
          }
          .liquid-btn::after {
            content: "";
            position: absolute;
            top: 100%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(255,255,255,0.15);
            border-radius: 40%;
            transition: top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            animation: spinBtn 4s linear infinite;
          }
          .liquid-btn:hover::after {
            top: -20%;
          }
          .liquid-btn-danger::after {
            background: rgba(239,68,68,0.25);
          }
          @keyframes spinBtn {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .pulse-ring {
            box-shadow: 0 0 0 0 rgba(82, 183, 136, 0.5);
            animation: pulseRing 2s infinite cubic-bezier(0.66, 0, 0, 1);
          }
          @keyframes pulseRing {
            to { box-shadow: 0 0 0 16px rgba(82, 183, 136, 0); }
          }
          .leaf {
            position: absolute;
            background: rgba(82, 183, 136, 0.25);
            border-radius: 50% 0 50% 0;
            pointer-events: none;
            animation: floatLeaf 8s linear infinite;
            opacity: 0;
          }
          @keyframes floatLeaf {
            0% { transform: translateY(100vh) rotate(0deg) scale(0.8); opacity: 0; }
            10% { opacity: 0.4; }
            90% { opacity: 0.4; }
            100% { transform: translateY(-20vh) rotate(360deg) scale(1.2); opacity: 0; }
          }
          .bobbing {
            animation: bob 3s ease-in-out infinite alternate;
          }
          @keyframes bob {
            0% { transform: translateY(0); }
            100% { transform: translateY(-12px); }
          }
          .stagger-item {
            opacity: 0;
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          /* Custom Skeuomorphic Input Fields */
          .skeuo-input {
             appearance: none;
             background-color: rgba(255, 255, 255, 0.8);
             border: 1px solid rgba(255, 255, 255, 0.9);
             box-shadow: inset 0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(255,255,255,1);
             transition: all 0.3s ease;
          }
          .skeuo-input:focus {
             outline: none;
             box-shadow: inset 0 2px 4px rgba(0,0,0,0.04), 0 0 0 3px rgba(82, 183, 136, 0.3);
             border-color: #52b788;
             background-color: #ffffff;
          }
         `}
      </style>

      {/* --- Ambient Blobs & Particles --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="liquid-blob-profile absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#52b788]/20 blur-[80px]"></div>
        <div
          className="liquid-blob-profile absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-[#2d6a4f]/10 blur-[100px] opacity-70"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="leaf left-[15%]"
          style={{ animationDuration: "10s", animationDelay: "0s" }}
        ></div>
        <div
          className="leaf left-[40%] w-6 h-6"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        ></div>
        <div
          className="leaf right-[20%] w-8 h-8"
          style={{ animationDuration: "9s", animationDelay: "4s" }}
        ></div>
        <div
          className="leaf right-[45%] w-4 h-4"
          style={{ animationDuration: "15s", animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        {/* --- Profile Header Section --- */}
        <div className="stagger-item flex flex-col md:flex-row items-center md:items-center justify-between p-8 md:p-10 mb-10 rounded-[3rem] bg-white/50 backdrop-blur-2xl border border-white/70 shadow-[0_15px_40px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,0.8)] relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <div className="pulse-ring w-28 h-28 rounded-full border-[6px] border-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.1),0_8px_16px_rgba(45,106,79,0.15)] bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden relative z-10">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center h-full pt-1">
              <h1 className="text-4xl font-extrabold text-[#1b4332] tracking-tight mb-1">
                {member.name || "Loading..."}
              </h1>
              <p className="text-[#52b788] font-bold text-sm tracking-wide mb-1 leading-snug">
                {member.email || "—"}
              </p>
              <p className="text-[#2d3748]/60 font-semibold italic text-xs tracking-wide flex items-center justify-center md:justify-start">
                Member since {memberSince}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 md:mt-0 relative z-10">
            <Link to="/add-plant">
              <button className="liquid-btn text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-[0_6px_15px_rgba(45,106,79,0.25),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-transform active:scale-[0.97] flex items-center gap-2">
                <svg
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="relative z-10">List New Plant</span>
              </button>
            </Link>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/60 text-[#2d6a4f] px-8 py-3.5 rounded-full font-bold text-sm border border-white/80 shadow-[0_4px_10px_rgba(0,0,0,0.02),inset_0_2px_4px_rgba(255,255,255,0.9)] hover:bg-white hover:shadow-[0_6px_15px_rgba(45,106,79,0.1),inset_0_2px_4px_rgba(255,255,255,1)] transition-all active:scale-[0.97] flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* --- Inline Profile Edit Panel --- */}
        {isEditing && (
          <div className="stagger-item mb-10 overflow-visible relative p-8 bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.06),inset_0_2px_5px_rgba(255,255,255,1)]">
            <h3 className="text-2xl font-black text-[#1b4332] mb-6 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-[#52b788]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Update Profile
            </h3>
            <form
              onSubmit={handleEditSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-bold text-[#1b4332] mb-2 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="skeuo-input w-full px-4 py-3 rounded-2xl text-[#2d3748]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1b4332] mb-2 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="skeuo-input w-full px-4 py-3 rounded-2xl text-[#2d3748]"
                />
              </div>
              <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-[#1b4332] mb-2 uppercase tracking-wide">
                    Profile Picture
                  </label>
                  <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white/60 border-2 border-dashed border-[#52b788]/60 rounded-2xl appearance-none cursor-pointer hover:border-[#2d6a4f] hover:bg-white focus:outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_2px_5px_rgba(255,255,255,1)]">
                    <span className="flex flex-col items-center space-y-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-[#52b788]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-bold text-[#2d3748] text-sm">
                        {profileImageFile
                          ? profileImageFile.name
                          : "Drop a high-res leaf here or click to select"}
                      </span>
                    </span>
                    <input
                      type="file"
                      name="file_upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProfileImageFile(e.target.files[0]);
                          const fileReader = new FileReader();
                          fileReader.onload = (e) => {
                            setEditForm({
                              ...editForm,
                              profilePicture: e.target.result,
                            });
                          };
                          fileReader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
                {editForm.profilePicture && (
                  <div className="w-24 h-24 shrink-0 rounded-full border-4 border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.1)] overflow-hidden self-center mt-6">
                    <img
                      src={editForm.profilePicture}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex gap-4 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-[#2d3748] px-6 py-3 font-bold rounded-full transition-colors hover:bg-black/5 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editProfileMutation.isPending || isUploading}
                  className="liquid-btn text-white px-10 py-3 rounded-full font-bold shadow-[0_6px_15px_rgba(45,106,79,0.25)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center"
                >
                  <span className="relative z-10">
                    {isUploading
                      ? "Uploading Avatar..."
                      : editProfileMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- Stats Row --- */}
        {/* Added overflow-visible and generous padding p-6/-m-6 so shadows and hover transforms do not get clipped */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 overflow-visible p-6 -mx-6">
          {[
            {
              label: "TOTAL PLANTS",
              val: myPlants.length,
              hasDec: false,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              ),
            },
            {
              label: "SWAPS DONE",
              val: swapsDoneCount,
              hasDec: false,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              ),
            },
            {
              label: "USER RATING",
              val: avgRating,
              hasDec: true,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              ),
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="stagger-item bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 text-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_10px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center transition-all duration-500 hover:shadow-[0_15px_30px_rgba(82,183,136,0.2)] hover:-translate-y-2 relative group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-[#52b788]/40 transition-colors duration-500"></div>
              <svg
                className="w-8 h-8 text-[#52b788] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {stat.icon}
              </svg>
              <div className="text-5xl font-black text-[#1b4332] mb-2 flex items-center justify-center gap-1">
                {stat.prefix && <span className="text-3xl">{stat.prefix}</span>}
                <CountUp end={stat.val} decimals={stat.hasDec ? 1 : 0} />
              </div>
              <div className="text-xs font-black text-[#2d3748]/70 tracking-[0.2em] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* --- Grid Title --- */}
        <div
          className="flex items-center justify-between mb-8 stagger-item"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="text-2xl font-black text-[#1b4332] tracking-tight">
            My Active Listings
          </h2>
          <div className="flex gap-3">
            <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black text-[#2d6a4f] tracking-widest uppercase shadow-sm border border-white">
              Active ({myPlants.length})
            </span>
          </div>
        </div>

        {/* --- Loading / Error States --- */}
        {isPlantsPending && (
          <p className="text-[#52b788] font-bold">
            Loading your botanical gallery...
          </p>
        )}
        {plantsError && (
          <p className="text-red-500 font-bold">
            Error loading your inventory.
          </p>
        )}

        {/* --- Empty State --- */}
        {myPlants.length === 0 && !isPlantsPending && !plantsError && (
          <div
            className="stagger-item w-full flex items-center justify-center min-h-[40vh]"
            style={{ animationDelay: "400ms" }}
          >
            <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-16 text-center border border-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-2xl flex flex-col items-center">
              <div className="w-24 h-24 mb-8 bg-[#e8f5ee] rounded-full flex items-center justify-center shadow-inner relative bobbing shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-[#52b788] opacity-30 animate-ping"></div>
                <span className="text-5xl leading-none block">🪴</span>
              </div>
              <h3 className="text-2xl font-black text-[#1b4332] mb-3">
                You haven't listed any plants yet
              </h3>
              <p className="text-[#2d3748] mb-8 font-medium">
                Share your first plant with the community to kickstart your
                ecosystem!
              </p>
              <Link to="/add-plant">
                <button className="liquid-btn text-white px-10 py-4 rounded-full font-black tracking-widest uppercase text-xs shadow-lg transition-transform active:scale-[0.97]">
                  <span className="relative z-10">Get Started</span>
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* --- My Listed Plants Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-visible pb-12">
          {myPlants.map((plant, index) => (
            <div
              key={plant.id}
              className="stagger-item"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <TiltCard className="h-full flex flex-col bg-white/55 backdrop-blur-xl border border-white/70 rounded-[2.5rem] p-5 shadow-[0_15px_35px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.8)] hover:shadow-[0_20px_45px_rgba(82,183,136,0.15)] group">
                {/* Big Circular Skueomorphic Image Header */}
                <div className="relative mb-6">
                  <div className="aspect-square w-full rounded-full border-[8px] border-white shadow-[inset_0_6px_12px_rgba(0,0,0,0.08),0_8px_20px_rgba(0,0,0,0.05)] overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent z-10 pointer-events-none"></div>
                    <img
                      src={plant.imageUrl || "/HeroSub.jpg"}
                      alt={plant.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  {/* Floating Difficulty Badge Outside Circular Clip Mask */}
                  <div className="absolute top-4 right-0 z-20 px-3 py-1 bg-[#d4f0e0]/90 backdrop-blur-md shadow-[0_4px_10px_rgba(82,183,136,0.3)] rounded-full text-[10px] font-black text-[#1b4332] uppercase tracking-wider border border-[#52b788]/40">
                    {plant.careDifficulty} Care
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col px-2">
                  <h3 className="text-xl font-extrabold text-[#1b4332] mb-2 leading-tight">
                    {plant.name}
                  </h3>
                  <p className="text-sm text-[#2d3748] font-medium leading-relaxed line-clamp-3 mb-6">
                    {plant.description ||
                      "A healthy addition to any collection."}
                  </p>

                  {/* Actions Footer */}
                  <div className="mt-auto flex justify-between items-center pt-5 border-t border-white/40">
                    <div className="flex gap-2">
                      <Link to={`/edit-plant/${plant.id}`}>
                        <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)] border border-slate-100 text-[#52b788] hover:text-[#2d6a4f] hover:bg-slate-50 transition-colors active:scale-95">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(plant.id, plant.name)}
                        disabled={deletePlantMutation.isPending}
                        className="liquid-btn liquid-btn-danger bg-white overflow-hidden w-10 h-10 flex items-center justify-center rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)] border border-slate-100 text-red-400 hover:text-red-600 transition-colors active:scale-95 disabled:opacity-50"
                      >
                        <svg
                          className="w-4 h-4 relative z-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <span className="px-4 py-1.5 bg-[#2d6a4f]/10 backdrop-blur-md rounded-full text-[10px] font-black text-[#1b4332] uppercase tracking-[0.2em] shadow-inner border border-[#52b788]/20">
                      {plant.status || "Available"}
                    </span>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
