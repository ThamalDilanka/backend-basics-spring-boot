import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data to show the UI while your Spring Boot backend is being built
const MOCK_RECEIVED = [
  { id: 101, plantName: "Monstera Deliciosa", requesterName: "Sarah J.", status: "Pending", date: "Today" },
  { id: 102, plantName: "Snake Plant", requesterName: "Mike T.", status: "Pending", date: "Yesterday" },
];

const MOCK_SENT = [
  { id: 201, plantName: "Fiddle Leaf Fig", ownerName: "Emma W.", status: "Waiting for approval", date: "2 days ago" },
];

export default function Requests() {
  const [received, setReceived] = useState(MOCK_RECEIVED);
  const [sent, setSent] = useState(MOCK_SENT);

  const handleAccept = (id) => {
    alert(`Accepted request #${id}! Time to message the user to coordinate the swap.`);
    setReceived(received.filter(req => req.id !== id));
  };

  const handleDecline = (id) => {
    setReceived(received.filter(req => req.id !== id));
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl mt-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-bold text-slate-800">Swap Requests</h1>
        <p className="text-slate-500 mt-2">Manage your incoming offers and outgoing plant requests.</p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="received" className="text-md">Received Offers</TabsTrigger>
          <TabsTrigger value="sent" className="text-md">Sent Requests</TabsTrigger>
        </TabsList>
        
        {/* TAB 1: Received Offers */}
        <TabsContent value="received" className="space-y-4">
          {received.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">You don't have any pending requests right now.</p>
            </div>
          ) : (
            received.map((req) => (
              <Card key={req.id} className="border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center">
                <CardHeader>
                  <CardTitle className="text-xl text-green-700">{req.plantName}</CardTitle>
                  <CardDescription>Requested by <span className="font-semibold text-slate-700">{req.requesterName}</span> • {req.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3 pt-6 sm:pt-0 pb-6 sm:pb-0 pr-6">
                  <Button onClick={() => handleAccept(req.id)} className="bg-green-700 hover:bg-green-800">Accept Swap</Button>
                  <Button onClick={() => handleDecline(req.id)} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Decline</Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* TAB 2: Sent Requests */}
        <TabsContent value="sent" className="space-y-4">
          {sent.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">You haven't requested any plants yet.</p>
              <Link to="/">
                <Button variant="link" className="text-green-600 mt-2">Browse the market</Button>
              </Link>
            </div>
          ) : (
            sent.map((req) => (
              <Card key={req.id} className="border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">{req.plantName}</CardTitle>
                  <CardDescription>Owned by {req.ownerName} • {req.date}</CardDescription>
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