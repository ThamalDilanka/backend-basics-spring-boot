import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- 3D Hover Tilt Card Component ---
const TiltCard = ({ children, className }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dragX = ((x - centerX) / centerX) * 6; // slightly stronger tilt
    const dragY = ((y - centerY) / centerY) * 6;

    setRotateX(-dragY);
    setRotateY(dragX);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div style={{ perspective: "1000px" }} className="w-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`transform-gpu ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default function Requests() {
  const queryClient = useQueryClient();
  const loggedInMemberId = Number(localStorage.getItem("memberId"));
  const [activeTab, setActiveTab] = useState("received"); // 'received' | 'sent'

  // Fetch Received Offers (Incoming)
  const { isPending: loadingReceived, data: receivedData } = useQuery({
    queryKey: ["incomingRequests", loggedInMemberId],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/requests/incoming/${loggedInMemberId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch incoming requests");
      const json = await response.json();
      return json.data || json;
    },
    enabled: !!loggedInMemberId, // Only fetch if logged in
  });

  // Fetch Sent Requests (Outgoing)
  const { isPending: loadingSent, data: sentData } = useQuery({
    queryKey: ["outgoingRequests", loggedInMemberId],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/requests/outgoing/${loggedInMemberId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch outgoing requests");
      const json = await response.json();
      return json.data || json;
    },
    enabled: !!loggedInMemberId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await fetch(
        `/api/v1/requests/${id}/status?status=${status}`,
        {
          method: "PATCH",
        },
      );
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["outgoingRequests"] });
    },
  });

  const handleAccept = (id) =>
    updateStatusMutation.mutate({ id, status: "ACCEPTED" });
  const handleDecline = (id) =>
    updateStatusMutation.mutate({ id, status: "REJECTED" });

  const received = Array.isArray(receivedData) ? receivedData : [];
  const sent = Array.isArray(sentData) ? sentData : [];

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tabs = [
    { id: "received", label: "RECEIVED OFFERS" },
    { id: "sent", label: "SENT REQUESTS" },
  ];

  const currentList = activeTab === "received" ? received : sent;
  const isLoading = activeTab === "received" ? loadingReceived : loadingSent;

  // Render Status Badge
  const renderBadge = (status) => {
    if (status === "PENDING") {
      return (
        <span className="inline-flex px-4 py-1.5 bg-amber-100/50 backdrop-blur-md text-amber-800 text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3)] border border-amber-200/50 animate-pulse">
          ⏳ {status}
        </span>
      );
    }
    if (status === "ACCEPTED") {
      return (
        <span className="inline-flex px-4 py-1.5 bg-[#d4f0e0]/70 backdrop-blur-md text-[#1b4332] text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(82,183,136,0.4)] border border-[#52b788]/40">
          ✅ {status}
        </span>
      );
    }
    return (
      <span className="inline-flex px-4 py-1.5 bg-red-100/50 backdrop-blur-md text-red-800 text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-red-200/50">
        ❌ {status}
      </span>
    );
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-[#f0faf4] via-[#d4f0e0] to-[#e8f5ee] overflow-hidden pt-28 pb-24 font-sans selection:bg-[#52b788]/30">
      {/* Custom Global Styles */}
      <style>
        {`
          .liquid-blob-req {
            animation: blobMorphReq 12s ease-in-out infinite alternate;
          }
          @keyframes blobMorphReq {
            0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
            100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          }
          .req-btn-accept {
            position: relative;
            overflow: hidden;
            background: #2d6a4f;
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 10px rgba(45,106,79,0.3);
          }
          .req-btn-accept::after {
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
          .req-btn-accept:hover::after {
            top: -20%;
          }
          @keyframes spinBtn {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .req-btn-decline {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.8);
            box-shadow: inset 0 2px 4px rgba(255,255,255,1), 0 4px 10px rgba(0,0,0,0.05);
            border: 1px solid rgba(239,68,68,0.2);
          }
          .req-btn-decline::after {
            content: "";
            position: absolute;
            top: 100%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(239,68,68,0.15);
            border-radius: 40%;
            transition: top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            animation: spinBtn 4s linear infinite;
          }
          .req-btn-decline:hover::after {
            top: -20%;
          }
          .leaf-particle {
            position: absolute;
            background: rgba(82, 183, 136, 0.25);
            border-radius: 50% 0 50% 0;
            pointer-events: none;
            animation: floatLeafReq linear infinite;
            opacity: 0;
          }
          @keyframes floatLeafReq {
            0% { transform: translateY(100vh) rotate(0deg) scale(0.8); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% { transform: translateY(-20vh) rotate(360deg) scale(1.2); opacity: 0; }
          }
        `}
      </style>

      {/* --- Ambient Blobs & Particles --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="liquid-blob-req absolute top-[5%] left-[5%] w-[450px] h-[450px] bg-[#52b788]/20 blur-[80px]"></div>
        <div
          className="liquid-blob-req absolute bottom-[10%] right-[5%] w-[550px] h-[550px] bg-[#2d6a4f]/15 blur-[100px]"
          style={{ animationDelay: "4s", animationDuration: "14s" }}
        ></div>
        <div
          className="leaf-particle left-[20%]"
          style={{
            animationDuration: "14s",
            animationDelay: "0s",
            width: "24px",
            height: "24px",
          }}
        ></div>
        <div
          className="leaf-particle left-[60%]"
          style={{
            animationDuration: "10s",
            animationDelay: "5s",
            width: "16px",
            height: "16px",
          }}
        ></div>
        <div
          className="leaf-particle right-[25%]"
          style={{
            animationDuration: "16s",
            animationDelay: "2s",
            width: "32px",
            height: "32px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 overflow-visible">
        {/* --- Page Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/50 backdrop-blur-2xl border border-white/70 shadow-[0_15px_40px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,0.8)] rounded-[2.5rem] p-8 md:p-10 mb-10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-[#1b4332] flex items-center gap-4">
              <span className="w-12 h-12 bg-[#c9eed1] rounded-full flex justify-center items-center shadow-inner border border-[#a6fcaf] shrink-0">
                <motion.svg
                  className="w-6 h-6 text-[#1e4d2b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </motion.svg>
              </span>
              Swap Requests
            </h1>
            <p className="text-[#52b788] font-bold mt-2 ml-16 tracking-wide text-sm">
              Manage your incoming offers and outgoing requests.
            </p>
          </div>
        </motion.div>

        {/* --- Custom Tab Bar --- */}
        <div className="flex justify-center mb-10 overflow-visible">
          <div className="flex p-1.5 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[inset_0_2px_5px_rgba(0,0,0,0.05),0_2px_10px_rgba(0,0,0,0.02)] relative shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-8 py-3 text-xs font-black tracking-widest uppercase transition-colors rounded-full z-10 ${
                  activeTab === tab.id
                    ? "text-[#1b4332]"
                    : "text-[#2d3748]/60 hover:text-[#52b788]"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white/80 backdrop-blur-xl shadow-[0_4px_15px_rgba(82,183,136,0.15),inset_0_2px_4px_rgba(255,255,255,1)] border border-white/90 rounded-full z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="min-h-[50vh] overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // triggers re-animation when tab changes
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col gap-6 overflow-visible pb-12"
            >
              {isLoading ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center p-16"
                >
                  <div className="w-16 h-16 border-4 border-[#52b788] border-t-transparent rounded-full animate-spin mx-auto opacity-70"></div>
                  <p className="mt-4 text-[#2d6a4f] font-bold animate-pulse tracking-widest uppercase text-xs">
                    Loading Requests...
                  </p>
                </motion.div>
              ) : currentList.length === 0 ? (
                // --- Empty State --- //
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center w-full mt-4"
                >
                  <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-16 text-center border border-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-2xl flex flex-col items-center">
                    <div className="w-24 h-24 mb-8 bg-[#e8f5ee] rounded-full flex items-center justify-center shadow-inner relative shrink-0">
                      <div className="absolute inset-0 rounded-full border-2 border-[#52b788] opacity-30 animate-pulse"></div>
                      <motion.svg
                        className="w-12 h-12 text-[#52b788]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ y: [-6, 6, -6] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </motion.svg>
                    </div>
                    <h3 className="text-2xl font-black text-[#1b4332] mb-3">
                      {activeTab === "received"
                        ? "No incoming offers yet"
                        : "No outgoing requests"}
                    </h3>
                    <p className="text-[#2d3748] mb-8 font-medium">
                      {activeTab === "received"
                        ? "Check back later when someone requests your available plants."
                        : "Find a plant you love and request a swap!"}
                    </p>
                    {activeTab === "sent" && (
                      <Link to="/">
                        <button className="relative px-8 py-3 bg-white text-[#2d6a4f] border-2 border-[#52b788]/60 font-black uppercase text-xs tracking-widest rounded-full shadow-[0_4px_15px_rgba(82,183,136,0.2)] hover:bg-[#e8f5ee] hover:border-[#52b788] hover:-translate-y-1 transition-all active:scale-[0.97]">
                          Browse the forest
                        </button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ) : (
                // --- Cards --- //
                currentList.map((req) => (
                  <TiltCard key={req.id} className="w-full">
                    <div className="bg-white/55 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_15px_35px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.8)] hover:shadow-[0_20px_45px_rgba(82,183,136,0.15)] transition-shadow duration-500 overflow-visible group">
                      {/* Left: Plant & User Info */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 w-full text-center sm:text-left">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(82,183,136,0.2)] shrink-0 overflow-hidden bg-slate-50 relative group-hover:scale-105 transition-transform duration-500">
                          <div className="absolute inset-0 border border-dashed border-[#52b788]/40 rounded-full z-10 m-1 pointer-events-none"></div>
                          <img
                            src={req.plantImageUrl || "/plant.png"}
                            alt={req.plantName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] mb-3 leading-tight tracking-tight">
                            {req.plantName}
                          </h2>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-semibold text-[#2d3748]">
                            <div className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-full shadow-sm border border-white">
                              <img
                                src={
                                  (activeTab === "received"
                                    ? req.requesterImageUrl
                                    : req.ownerImageUrl) ||
                                  "https://ui-avatars.com/api/?name=" +
                                    ((activeTab === "received"
                                      ? req.requesterName
                                      : req.ownerName) || "User") +
                                    "&background=e8f5ee&color=2d6a4f"
                                }
                                alt="User Avatar"
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm object-cover"
                              />
                              <span className="text-[#2d6a4f]">
                                {activeTab === "received"
                                  ? req.requesterName
                                  : req.ownerName || "Unknown"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 italic px-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {formatDate(req.date)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions / Badge */}
                      <div className="flex flex-col items-center sm:items-end gap-4 shrink-0 w-full sm:w-auto mt-4 md:mt-0">
                        {renderBadge(req.status)}

                        {activeTab === "received" &&
                          req.status === "PENDING" && (
                            <div className="flex gap-3 w-full sm:w-auto mt-2">
                              <button
                                onClick={() => handleDecline(req.id)}
                                disabled={updateStatusMutation.isPending}
                                className="req-btn-decline w-12 h-12 flex items-center justify-center rounded-2xl text-red-500 hover:text-red-600 transition-colors active:scale-95 disabled:opacity-50 shrink-0 font-bold"
                                title="Decline Offer"
                              >
                                <span className="relative z-10">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </span>
                              </button>
                              <button
                                onClick={() => handleAccept(req.id)}
                                disabled={updateStatusMutation.isPending}
                                className="req-btn-accept flex items-center justify-center px-6 h-12 rounded-2xl text-white font-bold tracking-widest text-sm shadow-md transition-transform active:scale-95 disabled:opacity-70 flex-1 sm:flex-none uppercase"
                              >
                                <span className="relative z-10 flex items-center gap-2">
                                  Accept Swap
                                  <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  </TiltCard>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
