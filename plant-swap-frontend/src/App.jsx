import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddPlant from "./pages/AddPlant";
import SignUp from "@/pages/SignUp.jsx";

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

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;