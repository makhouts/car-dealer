import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, Car, MessageSquare, LogOut, Plus, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

const emptyCarForm = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuel_type: "Petrol",
  transmission: "Automatic",
  body_type: "Sedan",
  color: "",
  engine: "",
  description: "",
  features: [],
  images: [],
  is_featured: false,
  status: "available"
};

const AdminCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carForm, setCarForm] = useState(emptyCarForm);
  const [featureInput, setFeatureInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const bodyTypes = ["Sedan", "SUV", "Coupe", "Hatchback", "Sports", "Truck"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const transmissions = ["Automatic", "Manual"];
  const statuses = ["available", "sold", "reserved"];

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    fetchCars();
  }, [navigate]);

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${API}/cars`);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (car = null) => {
    if (car) {
      setEditingCar(car);
      setCarForm(car);
    } else {
      setEditingCar(null);
      setCarForm(emptyCarForm);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCar(null);
    setCarForm(emptyCarForm);
    setFeatureInput("");
    setImageInput("");
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setCarForm({ ...carForm, features: [...carForm.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setCarForm({ ...carForm, features: carForm.features.filter((_, i) => i !== index) });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setCarForm({ ...carForm, images: [...carForm.images, imageInput.trim()] });
      setImageInput("");
    }
  };

  const handleRemoveImage = (index) => {
    setCarForm({ ...carForm, images: carForm.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCar) {
        await axios.put(`${API}/cars/${editingCar.id}`, carForm);
        toast.success("Car updated successfully!");
      } else {
        await axios.post(`${API}/cars`, carForm);
        toast.success("Car added successfully!");
      }
      handleCloseDialog();
      fetchCars();
    } catch (error) {
      toast.error("Failed to save car. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`${API}/cars/${carId}`);
      toast.success("Car deleted successfully!");
      fetchCars();
    } catch (error) {
      toast.error("Failed to delete car.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      <AdminSidebar active="cars" />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">Manage Cars</h1>
              <p className="text-zinc-600">Add, edit, or remove vehicles from your inventory.</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="bg-zinc-900 hover:bg-zinc-800" data-testid="add-car-btn">
                  <Plus size={18} className="mr-2" /> Add New Car
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Brand *</label>
                      <Input
                        value={carForm.brand}
                        onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                        placeholder="e.g., Porsche"
                        required
                        data-testid="car-brand-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Model *</label>
                      <Input
                        value={carForm.model}
                        onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                        placeholder="e.g., 911 Turbo S"
                        required
                        data-testid="car-model-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Year *</label>
                      <Input
                        type="number"
                        value={carForm.year}
                        onChange={(e) => setCarForm({ ...carForm, year: parseInt(e.target.value) })}
                        min="1990"
                        max="2025"
                        required
                        data-testid="car-year-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Price ($) *</label>
                      <Input
                        type="number"
                        value={carForm.price}
                        onChange={(e) => setCarForm({ ...carForm, price: parseFloat(e.target.value) })}
                        min="0"
                        required
                        data-testid="car-price-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Mileage (mi) *</label>
                      <Input
                        type="number"
                        value={carForm.mileage}
                        onChange={(e) => setCarForm({ ...carForm, mileage: parseInt(e.target.value) })}
                        min="0"
                        required
                        data-testid="car-mileage-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Fuel Type</label>
                      <Select value={carForm.fuel_type} onValueChange={(v) => setCarForm({ ...carForm, fuel_type: v })}>
                        <SelectTrigger data-testid="car-fuel-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fuelTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="form-label">Transmission</label>
                      <Select value={carForm.transmission} onValueChange={(v) => setCarForm({ ...carForm, transmission: v })}>
                        <SelectTrigger data-testid="car-transmission-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {transmissions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="form-label">Body Type</label>
                      <Select value={carForm.body_type} onValueChange={(v) => setCarForm({ ...carForm, body_type: v })}>
                        <SelectTrigger data-testid="car-body-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {bodyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Color *</label>
                      <Input
                        value={carForm.color}
                        onChange={(e) => setCarForm({ ...carForm, color: e.target.value })}
                        placeholder="e.g., GT Silver"
                        required
                        data-testid="car-color-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Engine *</label>
                      <Input
                        value={carForm.engine}
                        onChange={(e) => setCarForm({ ...carForm, engine: e.target.value })}
                        placeholder="e.g., 3.8L Twin-Turbo"
                        required
                        data-testid="car-engine-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Description *</label>
                    <textarea
                      value={carForm.description}
                      onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                      className="form-textarea"
                      rows={3}
                      placeholder="Describe the vehicle..."
                      required
                      data-testid="car-description-input"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="form-label">Features</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Add a feature"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                        data-testid="car-feature-input"
                      />
                      <Button type="button" variant="outline" onClick={handleAddFeature}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {carForm.features.map((feature, index) => (
                        <span key={index} className="bg-zinc-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {feature}
                          <button type="button" onClick={() => handleRemoveFeature(index)} className="text-zinc-500 hover:text-zinc-700">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="form-label">Image URLs</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="Paste image URL"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
                        data-testid="car-image-input"
                      />
                      <Button type="button" variant="outline" onClick={handleAddImage}>
                        <ImagePlus size={16} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {carForm.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Status</label>
                      <Select value={carForm.status} onValueChange={(v) => setCarForm({ ...carForm, status: v })}>
                        <SelectTrigger data-testid="car-status-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={carForm.is_featured}
                          onChange={(e) => setCarForm({ ...carForm, is_featured: e.target.checked })}
                          className="w-4 h-4 rounded border-zinc-300"
                          data-testid="car-featured-checkbox"
                        />
                        <span className="text-sm text-zinc-700">Mark as Featured</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                    <Button type="submit" disabled={submitting} className="bg-zinc-900 hover:bg-zinc-800" data-testid="save-car-btn">
                      {submitting ? "Saving..." : editingCar ? "Update Car" : "Add Car"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Cars Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Mileage</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-zinc-500">Loading...</td>
                  </tr>
                ) : cars.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-zinc-500">No cars in inventory</td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr key={car.id} data-testid={`car-row-${car.id}`}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={car.images[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100"}
                            alt={car.model}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-zinc-900">{car.brand}</p>
                            <p className="text-sm text-zinc-500">{car.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono">{car.year}</td>
                      <td className="font-mono text-red-600">${car.price.toLocaleString()}</td>
                      <td className="font-mono">{car.mileage.toLocaleString()} mi</td>
                      <td>
                        <span className={`badge-${car.status}`}>{car.status}</span>
                      </td>
                      <td>
                        {car.is_featured && <span className="text-amber-500">★</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDialog(car)}
                            className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                            data-testid={`edit-car-${car.id}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            data-testid={`delete-car-${car.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCars;
