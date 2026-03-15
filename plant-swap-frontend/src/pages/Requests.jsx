import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Requests() {
  const queryClient = useQueryClient();
  const loggedInMemberId = Number(localStorage.getItem("memberId"));

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
      queryClient.invalidateQueries(["incomingRequests"]);
      queryClient.invalidateQueries(["outgoingRequests"]);
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
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl mt-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-bold text-slate-800">Swap Requests</h1>
        <p className="text-slate-500 mt-2">
          Manage your incoming offers and outgoing plant requests.
        </p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="received" className="text-md">
            Received Offers
          </TabsTrigger>
          <TabsTrigger value="sent" className="text-md">
            Sent Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {loadingReceived ? (
            <div className="text-center p-12">
              <p className="text-slate-500">Loading...</p>
            </div>
          ) : received.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">
                You don't have any pending requests right now.
              </p>
            </div>
          ) : (
            received.map((req) => (
              <Card
                key={req.id}
                className="border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={req.plantImageUrl || "/plant.png"}
                      alt={req.plantName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-green-700">
                      {req.plantName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>Requested by</span>
                      <img
                        src={
                          req.requesterImageUrl ||
                          "https://ui-avatars.com/api/?name=" +
                            (req.requesterName || "User") +
                            "&background=random"
                        }
                        alt={req.requesterName}
                        className="w-6 h-6 rounded-full border border-slate-200 inline-block"
                      />
                      <span className="font-semibold text-slate-700">
                        {req.requesterName}
                      </span>
                      <span> {formatDate(req.date)}</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-3 pt-6 sm:pt-0 pb-6 sm:pb-0 pr-6">
                  {req.status === "PENDING" ? (
                    <>
                      <Button
                        onClick={() => handleAccept(req.id)}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        Accept Swap
                      </Button>
                      <Button
                        onClick={() => handleDecline(req.id)}
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Decline
                      </Button>
                    </>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-sm font-semibold rounded-full">
                      {req.status}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {loadingSent ? (
            <div className="text-center p-12">
              <p className="text-slate-500">Loading...</p>
            </div>
          ) : sent.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">
                You haven't requested any plants yet.
              </p>
              <Link to="/">
                <Button variant="link" className="text-green-600 mt-2">
                  Browse the market
                </Button>
              </Link>
            </div>
          ) : (
            sent.map((req) => (
              <Card
                key={req.id}
                className="border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={req.plantImageUrl || "/plant.png"}
                      alt={req.plantName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-800">
                      {req.plantName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>Owned by</span>
                      <img
                        src={
                          req.ownerImageUrl ||
                          "https://ui-avatars.com/api/?name=" +
                            (req.ownerName || "User") +
                            "&background=random"
                        }
                        alt={req.ownerName}
                        className="w-6 h-6 rounded-full border border-slate-200 inline-block"
                      />
                      <span className="font-semibold text-slate-700">
                        {req.ownerName || "Unknown"}
                      </span>
                      <span> {formatDate(req.date)}</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 sm:pt-0 pb-6 sm:pb-0 pr-6">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full">
                    {req.status}
                  </span>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
