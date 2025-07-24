import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-[#003153] shadow-lg">
      {/* Platform Name */}
      <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-teal-500 bg-clip-text text-transparent tracking-wide">
        CodeJoy
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link
          to="/questions"
          className="text-cyan-200 hover:text-teal-300 font-semibold transition-colors duration-200"
        >
          Questions
        </Link>
        <button
          onClick={() => navigate("/")}
          className="ml-4 p-2 rounded-full bg-gray-800 hover:bg-[#68e5e5] transition-colors duration-200"
          title={user?.name || "Dashboard"}
        >
          <User className="w-6 h-6 text-cyan-200 hover:text-white transition-colors duration-200" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
