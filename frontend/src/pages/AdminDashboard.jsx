import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, Car, MessageSquare, LogOut, TrendingUp, DollarSign, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminSidebar = ({ active }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { id: "cars", label: "Manage Cars", icon: Car, path: "/admin/cars" },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare, path: "/admin/inquiries" }
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-6 flex flex-col">
      <Link to="/" className="text-2xl font-bold text-white tracking-tight mb-10">
        VELOCITÀ
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`admin-nav-item ${active === item.id ? "active" : ""}`}
            data-testid={`nav-${item.id}`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="admin-nav-item text-red-400 hover:text-red-300 hover:bg-red-950/30"
        data-testid="logout-btn"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [carStats, setCarStats] = useState({ total: 0, available: 0, sold: 0, reserved: 0, featured: 0 });
  const [inquiryStats, setInquiryStats] = useState({ total: 0, new: 0, contacted: 0, closed: 0 });
  const [recentCars, setRecentCars] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }

    const fetchData = async () => {
      try {
        const [carStatsRes, inquiryStatsRes, carsRes, inquiriesRes] = await Promise.all([
          axios.get(`${API}/cars/stats`),
          axios.get(`${API}/inquiries/stats`),
          axios.get(`${API}/cars?limit=5`),
          axios.get(`${API}/inquiries`)
        ]);

        setCarStats(carStatsRes.data);
        setInquiryStats(inquiryStatsRes.data);
        setRecentCars(carsRes.data.slice(0, 5));
        setRecentInquiries(inquiriesRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const statCards = [
    { label: "Total Vehicles", value: carStats.total, icon: Car, color: "bg-blue-500" },
    { label: "Available", value: carStats.available, icon: Package, color: "bg-emerald-500" },
    { label: "Sold", value: carStats.sold, icon: DollarSign, color: "bg-zinc-500" },
    { label: "New Inquiries", value: inquiryStats.new, icon: MessageSquare, color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      <AdminSidebar active="dashboard" />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
            <p className="text-zinc-600">Welcome back! Here's an overview of your dealership.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="stats-card" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-zinc-900">{loading ? "-" : stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Cars */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">Recent Vehicles</h2>
                <Link to="/admin/cars">
                  <Button variant="ghost" size="sm" data-testid="view-all-cars-link">View All</Button>
                </Link>
              </div>
              <div className="divide-y divide-zinc-100">
                {loading ? (
                  <div className="p-6 text-center text-zinc-500">Loading...</div>
                ) : recentCars.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500">No vehicles yet</div>
                ) : (
                  recentCars.map((car) => (
                    <div key={car.id} className="p-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                      <img
                        src={car.images[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100"}
                        alt={car.model}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900 truncate">{car.brand} {car.model}</p>
                        <p className="text-sm text-zinc-500">{car.year} • ${car.price.toLocaleString()}</p>
                      </div>
                      <span className={`badge-${car.status}`}>{car.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">Recent Inquiries</h2>
                <Link to="/admin/inquiries">
                  <Button variant="ghost" size="sm" data-testid="view-all-inquiries-link">View All</Button>
                </Link>
              </div>
              <div className="divide-y divide-zinc-100">
                {loading ? (
                  <div className="p-6 text-center text-zinc-500">Loading...</div>
                ) : recentInquiries.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500">No inquiries yet</div>
                ) : (
                  recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-zinc-900">{inquiry.name}</p>
                        <span className={`badge-${inquiry.status}`}>{inquiry.status}</span>
                      </div>
                      <p className="text-sm text-zinc-500 truncate">{inquiry.message}</p>
                      <p className="text-xs text-zinc-400 mt-1">{inquiry.email}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
