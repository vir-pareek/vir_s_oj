// src/components/Layout.jsx
import Navbar from "./Navbar";


const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#003153] via-[#0a2239] to-[#1e2a38] text-white font-sans">
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
