import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Check, Fuel, Gauge, Calendar, Settings, Palette, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${API}/cars/${id}`);
        setCar(response.data);
        setInquiryForm(prev => ({
          ...prev,
          message: `Hi, I'm interested in the ${response.data.year} ${response.data.brand} ${response.data.model}. Please contact me with more information.`
        }));
      } catch (error) {
        console.error("Error fetching car:", error);
        toast.error("Car not found");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/inquiries`, {
        car_id: car.id,
        ...inquiryForm
      });
      toast.success("Inquiry sent successfully! We'll contact you soon.");
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        message: `Hi, I'm interested in the ${car.year} ${car.brand} ${car.model}. Please contact me with more information.`
      });
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => {
    if (car && car.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car && car.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  const specs = [
    { icon: Calendar, label: "Year", value: car.year },
    { icon: Gauge, label: "Mileage", value: `${car.mileage.toLocaleString()} mi` },
    { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
    { icon: Settings, label: "Transmission", value: car.transmission },
    { icon: Car, label: "Body Type", value: car.body_type },
    { icon: Palette, label: "Color", value: car.color }
  ];

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-600 hover:text-zinc-900 transition-colors"
              data-testid="back-btn"
            >
              <ArrowLeft size={20} />
            </button>
            <Link to="/" className="text-xl font-bold text-zinc-900 tracking-tight">VELOCITÀ</Link>
          </div>
          <Link to="/inventory">
            <Button variant="outline" data-testid="view-all-cars-btn">View All Cars</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-[16/10] relative">
                <img
                  src={car.images[selectedImage] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                  data-testid="main-car-image"
                />
                
                {/* Navigation Arrows */}
                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      data-testid="prev-image-btn"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      data-testid="next-image-btn"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Status Badge */}
                {car.status !== "available" && (
                  <span className={`absolute top-4 right-4 px-4 py-2 rounded-full font-medium text-sm ${
                    car.status === "sold" ? "bg-zinc-900 text-white" : "bg-amber-500 text-white"
                  }`}>
                    {car.status.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {car.images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto hide-scrollbar">
                  {car.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? "border-zinc-900 opacity-100" : "border-transparent opacity-60 hover:opacity-80"
                      }`}
                      data-testid={`thumbnail-${index}`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900 mb-6">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl">
                    <div className="w-10 h-10 bg-zinc-200 rounded-lg flex items-center justify-center">
                      <spec.icon size={20} className="text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{spec.label}</p>
                      <p className="font-medium text-zinc-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Engine Info */}
              <div className="mt-6 p-4 bg-zinc-900 rounded-xl">
                <p className="text-zinc-400 text-sm mb-1">Engine</p>
                <p className="text-white font-mono text-lg">{car.engine}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">Description</h2>
              <p className="text-zinc-600 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Features & Equipment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-zinc-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price & Inquiry */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="mb-6">
                <p className="text-zinc-500 text-sm">{car.brand}</p>
                <h1 className="text-2xl font-bold text-zinc-900">{car.model}</h1>
                <p className="text-3xl font-bold text-red-600 font-mono mt-2" data-testid="car-price">
                  ${car.price.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-sm">{car.year}</span>
                <span className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-sm font-mono">{car.mileage.toLocaleString()} mi</span>
                <span className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-sm">{car.transmission}</span>
              </div>

              {car.status === "available" ? (
                <>
                  <div className="border-t border-zinc-200 pt-6">
                    <h3 className="font-semibold text-zinc-900 mb-4">Interested in this car?</h3>
                    <form onSubmit={handleSubmitInquiry} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                        required
                        data-testid="inquiry-name"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                        required
                        data-testid="inquiry-email"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                        required
                        data-testid="inquiry-phone"
                      />
                      <textarea
                        placeholder="Your Message"
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
                        required
                        data-testid="inquiry-message"
                      />
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-full text-lg"
                        data-testid="send-inquiry-btn"
                      >
                        {submitting ? "Sending..." : "Send Inquiry"}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="bg-zinc-100 rounded-xl p-4 text-center">
                  <p className="text-zinc-600">
                    This vehicle is currently {car.status}. Check our inventory for similar options.
                  </p>
                  <Link to="/inventory">
                    <Button className="mt-4" variant="outline" data-testid="browse-similar-btn">
                      Browse Similar Cars
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
