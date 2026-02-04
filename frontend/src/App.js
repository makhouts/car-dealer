import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "@/pages/LandingPage";
import InventoryPage from "@/pages/InventoryPage";
import CarDetailPage from "@/pages/CarDetailPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCars from "@/pages/AdminCars";
import AdminInquiries from "@/pages/AdminInquiries";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
