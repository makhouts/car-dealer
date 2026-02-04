import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, Car, MessageSquare, LogOut, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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

const AdminInquiries = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [cars, setCars] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [inquiriesRes, carsRes] = await Promise.all([
        axios.get(`${API}/inquiries`),
        axios.get(`${API}/cars`)
      ]);

      setInquiries(inquiriesRes.data);

      // Create a map of car IDs to car data
      const carsMap = {};
      carsRes.data.forEach((car) => {
        carsMap[car.id] = car;
      });
      setCars(carsMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await axios.put(`${API}/inquiries/${inquiryId}/status?status=${newStatus}`);
      toast.success("Status updated successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const filteredInquiries = statusFilter === "all" 
    ? inquiries 
    : inquiries.filter((inq) => inq.status === statusFilter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      <AdminSidebar active="inquiries" />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">Customer Inquiries</h1>
              <p className="text-zinc-600">Manage and respond to customer inquiries.</p>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" data-testid="status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Inquiries</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inquiries List */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-xl p-8 text-center text-zinc-500">Loading...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-zinc-500">
                {statusFilter === "all" ? "No inquiries yet" : `No ${statusFilter} inquiries`}
              </div>
            ) : (
              filteredInquiries.map((inquiry) => {
                const car = cars[inquiry.car_id];
                return (
                  <div key={inquiry.id} className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid={`inquiry-${inquiry.id}`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-zinc-900">{inquiry.name}</h3>
                            <span className={`badge-${inquiry.status}`}>{inquiry.status}</span>
                          </div>
                          <p className="text-sm text-zinc-500">{formatDate(inquiry.created_at)}</p>
                        </div>

                        <Select
                          value={inquiry.status}
                          onValueChange={(value) => handleStatusChange(inquiry.id, value)}
                        >
                          <SelectTrigger className="w-32" data-testid={`status-select-${inquiry.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                          <Mail size={16} />
                          {inquiry.email}
                        </a>
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                          <Phone size={16} />
                          {inquiry.phone}
                        </a>
                      </div>

                      {/* Message */}
                      <div className="bg-zinc-50 rounded-lg p-4 mb-4">
                        <p className="text-zinc-700">{inquiry.message}</p>
                      </div>

                      {/* Car Info */}
                      {car && (
                        <div className="flex items-center justify-between p-4 bg-zinc-100 rounded-lg">
                          <div className="flex items-center gap-4">
                            <img
                              src={car.images[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100"}
                              alt={car.model}
                              className="w-20 h-14 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-zinc-900">{car.brand} {car.model}</p>
                              <p className="text-sm text-zinc-500">{car.year} • ${car.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <Link to={`/car/${car.id}`} target="_blank">
                            <Button variant="ghost" size="sm" className="gap-2" data-testid={`view-car-${car.id}`}>
                              View Car <ExternalLink size={14} />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminInquiries;
