import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddPlant from "./pages/AddPlant";
import SignUp from "@/pages/SignUp.jsx";
import PlantDetails from "./pages/PlantDetails";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import EditPlant from "./pages/EditPlant";
import Plants from "./pages/Plants";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* The Navbar sits outside the Routes so it never disappears! */}
        <Navbar />

        {/* The Routes control what goes in the space below the Navbar */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/add-plant" element={<AddPlant />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plant/:id" element={<PlantDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/edit-plant/:id" element={<EditPlant />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
