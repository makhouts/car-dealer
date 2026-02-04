import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Car, Shield, Clock, Phone, Mail, MapPin, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight" data-testid="logo">
          VELOCITÀ
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/inventory" className="text-zinc-400 hover:text-white transition-colors" data-testid="nav-inventory">
            Inventory
          </Link>
          <a href="#about" className="text-zinc-400 hover:text-white transition-colors">About</a>
          <a href="#contact" className="text-zinc-400 hover:text-white transition-colors">Contact</a>
          <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors" data-testid="nav-admin">
            Admin
          </Link>
          <Link to="/inventory">
            <Button className="rounded-full px-6 bg-white text-black hover:bg-zinc-200" data-testid="browse-cars-btn">
              Browse Cars
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass mt-4 mx-6 rounded-xl p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            <Link to="/inventory" className="text-white py-2" onClick={() => setMobileMenuOpen(false)}>
              Inventory
            </Link>
            <a href="#about" className="text-white py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#contact" className="text-white py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <Link to="/admin" className="text-white py-2" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            <Link to="/inventory" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-full bg-white text-black hover:bg-zinc-200">
                Browse Cars
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-zinc-950 flex items-center noise-overlay overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80"
          alt="Luxury Car"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="max-w-3xl stagger-children">
          <p className="text-red-500 font-medium mb-4 tracking-wide">PREMIUM PRE-OWNED VEHICLES</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Drive Your <br />
            <span className="text-zinc-400">Dream Car</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-xl">
            Discover an exclusive collection of meticulously inspected luxury vehicles. 
            Every car tells a story of excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/inventory">
              <Button
                className="pill-button-primary text-lg px-10 py-6 flex items-center gap-2"
                data-testid="hero-browse-btn"
              >
                Explore Collection
                <ArrowRight size={20} />
              </Button>
            </Link>
            <a href="#contact">
              <Button
                variant="outline"
                className="pill-button-secondary text-lg px-10 py-6 border-zinc-700"
                data-testid="hero-contact-btn"
              >
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-zinc-400 rounded-full" />
        </div>
      </div>
    </section>
  );
};

const FeaturedCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        // First seed the database if empty
        await axios.post(`${API}/seed`);
        const response = await axios.get(`${API}/cars/featured`);
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching featured cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedCars();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-dark h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-zinc-950 noise-overlay" id="featured">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-red-500 font-medium mb-2">FEATURED</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Latest Arrivals</h2>
          </div>
          <Link to="/inventory" className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {cars.slice(0, 6).map((car) => (
            <Link to={`/car/${car.id}`} key={car.id} data-testid={`featured-car-${car.id}`}>
              <div className="vehicle-card group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={car.images[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"}
                    alt={`${car.brand} ${car.model}`}
                    className="vehicle-image w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-zinc-500 text-sm">{car.brand}</p>
                      <h3 className="text-xl font-semibold text-white">{car.model}</h3>
                    </div>
                    <span className="text-red-500 font-mono font-medium">
                      ${car.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 text-sm mt-4">
                    <span>{car.year}</span>
                    <span>•</span>
                    <span className="font-mono">{car.mileage.toLocaleString()} mi</span>
                    <span>•</span>
                    <span>{car.fuel_type}</span>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/30 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>

        <Link to="/inventory" className="md:hidden flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors mt-8">
          View All Cars <ChevronRight size={20} />
        </Link>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Every vehicle undergoes a rigorous 150-point inspection before joining our collection."
    },
    {
      icon: Car,
      title: "Premium Selection",
      description: "Handpicked luxury and performance vehicles from the world's most prestigious brands."
    },
    {
      icon: Clock,
      title: "Hassle-Free Process",
      description: "Transparent pricing, flexible financing, and seamless paperwork handling."
    }
  ];

  return (
    <section className="py-24 bg-zinc-100" id="about">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-red-600 font-medium mb-2">WHY CHOOSE US</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">The Velocità Difference</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-zinc-900 rounded-full flex items-center justify-center">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">{feature.title}</h3>
              <p className="text-zinc-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 noise-overlay" id="contact">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <p className="text-red-500 font-medium mb-2">GET IN TOUCH</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Talk</h2>
            <p className="text-zinc-400 text-lg mb-10">
              Ready to find your perfect vehicle? Our team is here to help you every step of the way.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center">
                  <Phone className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Call Us</p>
                  <p className="text-white font-medium">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center">
                  <Mail className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Email Us</p>
                  <p className="text-white font-medium">info@velocitamotors.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center">
                  <MapPin className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Visit Us</p>
                  <p className="text-white font-medium">123 Luxury Lane, Beverly Hills, CA 90210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors"
                  required
                  data-testid="contact-name"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors"
                  required
                  data-testid="contact-email"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors"
                  data-testid="contact-phone"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors resize-none"
                  required
                  data-testid="contact-message"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full pill-button-accent py-6 text-lg"
                data-testid="contact-submit-btn"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold text-white tracking-tight">VELOCITÀ</div>
          <div className="flex items-center gap-8 text-zinc-500 text-sm">
            <Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} Velocità Motors. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <HeroSection />
      <FeaturedCars />
      <WhyChooseUs />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
