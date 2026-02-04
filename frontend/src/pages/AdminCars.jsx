import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, Car, MessageSquare, LogOut, Plus, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminSidebar = ({ active }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin");
  };

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-6 flex flex-col">
      <Link to="/" className="text-2xl font-bold text-white tracking-tight mb-10">
        VELOCITÀ
      </Link>

      <nav className="flex-1 space-y-2">
        <Link to="/admin/dashboard" className={`admin-nav-item ${active === "dashboard" ? "active" : ""}`} data-testid="nav-dashboard">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/admin/cars" className={`admin-nav-item ${active === "cars" ? "active" : ""}`} data-testid="nav-cars">
          <Car size={20} /> Manage Cars
        </Link>
        <Link to="/admin/inquiries" className={`admin-nav-item ${active === "inquiries" ? "active" : ""}`} data-testid="nav-inquiries">
          <MessageSquare size={20} /> Inquiries
        </Link>
      </nav>

      <button onClick={handleLogout} className="admin-nav-item text-red-400 hover:text-red-300 hover:bg-red-950/30" data-testid="logout-btn">
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
};

const bodyTypes = ["Sedan", "SUV", "Coupe", "Hatchback", "Sports", "Truck"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
const transmissions = ["Automatic", "Manual"];
const statuses = ["available", "sold", "reserved"];

const AdminCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2024);
  const [price, setPrice] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [fuelType, setFuelType] = useState("Petrol");
  const [transmission, setTransmission] = useState("Automatic");
  const [bodyType, setBodyType] = useState("Sedan");
  const [color, setColor] = useState("");
  const [engine, setEngine] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [images, setImages] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("available");
  const [featureInput, setFeatureInput] = useState("");
  const [imageInput, setImageInput] = useState("");

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

  const resetForm = () => {
    setBrand("");
    setModel("");
    setYear(2024);
    setPrice(0);
    setMileage(0);
    setFuelType("Petrol");
    setTransmission("Automatic");
    setBodyType("Sedan");
    setColor("");
    setEngine("");
    setDescription("");
    setFeatures([]);
    setImages([]);
    setIsFeatured(false);
    setStatus("available");
    setFeatureInput("");
    setImageInput("");
    setEditingCarId(null);
  };

  const handleOpenDialog = (car) => {
    if (car) {
      setEditingCarId(car.id);
      setBrand(car.brand);
      setModel(car.model);
      setYear(car.year);
      setPrice(car.price);
      setMileage(car.mileage);
      setFuelType(car.fuel_type);
      setTransmission(car.transmission);
      setBodyType(car.body_type);
      setColor(car.color);
      setEngine(car.engine);
      setDescription(car.description);
      setFeatures(car.features || []);
      setImages(car.images || []);
      setIsFeatured(car.is_featured);
      setStatus(car.status);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const carData = {
      brand, model, year, price, mileage,
      fuel_type: fuelType, transmission, body_type: bodyType,
      color, engine, description, features, images,
      is_featured: isFeatured, status
    };

    try {
      if (editingCarId) {
        await axios.put(`${API}/cars/${editingCarId}`, carData);
        toast.success("Car updated successfully!");
      } else {
        await axios.post(`${API}/cars`, carData);
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

            <Button onClick={() => handleOpenDialog(null)} className="bg-zinc-900 hover:bg-zinc-800" data-testid="add-car-btn">
              <Plus size={18} className="mr-2" /> Add New Car
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCarId ? "Edit Car" : "Add New Car"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Brand *</label>
                    <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g., Porsche" required data-testid="car-brand-input" />
                  </div>
                  <div>
                    <label className="form-label">Model *</label>
                    <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g., 911 Turbo S" required data-testid="car-model-input" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Year *</label>
                    <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} min="1990" max="2025" required data-testid="car-year-input" />
                  </div>
                  <div>
                    <label className="form-label">Price ($) *</label>
                    <Input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} min="0" required data-testid="car-price-input" />
                  </div>
                  <div>
                    <label className="form-label">Mileage (mi) *</label>
                    <Input type="number" value={mileage} onChange={(e) => setMileage(parseInt(e.target.value))} min="0" required data-testid="car-mileage-input" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Fuel Type</label>
                    <Select value={fuelType} onValueChange={setFuelType}>
                      <SelectTrigger data-testid="car-fuel-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="form-label">Transmission</label>
                    <Select value={transmission} onValueChange={setTransmission}>
                      <SelectTrigger data-testid="car-transmission-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {transmissions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="form-label">Body Type</label>
                    <Select value={bodyType} onValueChange={setBodyType}>
                      <SelectTrigger data-testid="car-body-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Color *</label>
                    <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g., GT Silver" required data-testid="car-color-input" />
                  </div>
                  <div>
                    <label className="form-label">Engine *</label>
                    <Input value={engine} onChange={(e) => setEngine(e.target.value)} placeholder="e.g., 3.8L Twin-Turbo" required data-testid="car-engine-input" />
                  </div>
                </div>

                <div>
                  <label className="form-label">Description *</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" rows={3} placeholder="Describe the vehicle..." required data-testid="car-description-input" />
                </div>

                <div>
                  <label className="form-label">Features</label>
                  <div className="flex gap-2 mb-2">
                    <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add a feature" onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())} data-testid="car-feature-input" />
                    <Button type="button" variant="outline" onClick={handleAddFeature}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span key={index} className="bg-zinc-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {feature}
                        <button type="button" onClick={() => handleRemoveFeature(index)} className="text-zinc-500 hover:text-zinc-700"><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Image URLs</label>
                  <div className="flex gap-2 mb-2">
                    <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="Paste image URL" onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())} data-testid="car-image-input" />
                    <Button type="button" variant="outline" onClick={handleAddImage}><ImagePlus size={16} /></Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                        <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger data-testid="car-status-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded border-zinc-300" data-testid="car-featured-checkbox" />
                      <span className="text-sm text-zinc-700">Mark as Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit" disabled={submitting} className="bg-zinc-900 hover:bg-zinc-800" data-testid="save-car-btn">
                    {submitting ? "Saving..." : editingCarId ? "Update Car" : "Add Car"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
                          <img src={car.images[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100"} alt={car.model} className="w-16 h-12 object-cover rounded-lg" />
                          <div>
                            <p className="font-medium text-zinc-900">{car.brand}</p>
                            <p className="text-sm text-zinc-500">{car.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono">{car.year}</td>
                      <td className="font-mono text-red-600">${car.price.toLocaleString()}</td>
                      <td className="font-mono">{car.mileage.toLocaleString()} mi</td>
                      <td><span className={`badge-${car.status}`}>{car.status}</span></td>
                      <td>{car.is_featured && <span className="text-amber-500">★</span>}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenDialog(car)} className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors" data-testid={`edit-car-${car.id}`}>
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(car.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" data-testid={`delete-car-${car.id}`}>
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
