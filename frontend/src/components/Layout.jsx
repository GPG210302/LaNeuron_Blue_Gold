import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./sections/Footer";
import { Toaster } from "./ui/sonner";

export const Layout = () => (
  <div className="App min-h-screen bg-[#FDFBF7] overflow-x-hidden">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
    <Toaster position="top-center" richColors />
  </div>
);
