import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center max-w-6xl">
        {/* Logo / Home Link */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-700 flex items-center gap-2"
        >
          <span>🌱</span> BorrowBox
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/add-plant">
            <Button
              variant="outline"
              className="border-green-600 text-green-700"
            >
              Add Plant
            </Button>
          </Link>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
