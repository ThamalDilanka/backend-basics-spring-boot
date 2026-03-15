import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddPlant from "./pages/AddPlant";
import SignUp from "@/pages/SignUp.jsx";
import PlantDetails from "./pages/PlantDetails";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        {/* The Navbar sits outside the Routes so it never disappears! */}
        <Navbar />
        
        {/* The Routes control what goes in the space below the Navbar */}
        <main className="pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            <Route path="/add-plant" element={<AddPlant />} />
            <Route path="/plant/:id" element={<PlantDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/requests" element={<Requests />} />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;