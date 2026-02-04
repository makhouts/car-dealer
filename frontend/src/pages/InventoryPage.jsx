import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, SlidersHorizontal, X, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const InventoryPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    body_type: "",
    fuel_type: "",
    transmission: "",
    min_price: 0,
    max_price: 500000,
    min_year: 2015,
    max_year: 2024
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const bodyTypes = ["Sedan", "SUV", "Coupe", "Hatchback", "Sports", "Truck"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const transmissions = ["Automatic", "Manual"];

  useEffect(() => {
    fetchCars();
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API}/cars/brands`);
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCars = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (appliedFilters.brand) params.append("brand", appliedFilters.brand);
      if (appliedFilters.body_type) params.append("body_type", appliedFilters.body_type);
      if (appliedFilters.fuel_type) params.append("fuel_type", appliedFilters.fuel_type);
      if (appliedFilters.transmission) params.append("transmission", appliedFilters.transmission);
      if (appliedFilters.min_price) params.append("min_price", appliedFilters.min_price);
      if (appliedFilters.max_price && appliedFilters.max_price < 500000) params.append("max_price", appliedFilters.max_price);
      if (appliedFilters.min_year && appliedFilters.min_year > 2015) params.append("min_year", appliedFilters.min_year);
      if (appliedFilters.max_year && appliedFilters.max_year < 2024) params.append("max_year", appliedFilters.max_year);
      params.append("status", "available");

      const response = await axios.get(`${API}/cars?${params.toString()}`);
      let fetchedCars = response.data;

      // Client-side search
      if (searchTerm) {
        fetchedCars = fetchedCars.filter(car =>
          `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Client-side sorting
      switch (sortBy) {
        case "price-low":
          fetchedCars.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          fetchedCars.sort((a, b) => b.price - a.price);
          break;
        case "year-new":
          fetchedCars.sort((a, b) => b.year - a.year);
          break;
        case "mileage-low":
          fetchedCars.sort((a, b) => a.mileage - b.mileage);
          break;
        default:
          break;
      }

      setCars(fetchedCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchCars(filters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      brand: "",
      body_type: "",
      fuel_type: "",
      transmission: "",
      min_price: 0,
      max_price: 500000,
      min_year: 2015,
      max_year: 2024
    };
    setFilters(defaultFilters);
    setSearchTerm("");
    fetchCars(defaultFilters);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchCars(filters);
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchTerm, sortBy]);

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`${isMobile ? "" : "sticky top-24"}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-900">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700" data-testid="clear-filters-btn">
          Clear All
        </button>
      </div>

      {/* Brand Filter */}
      <div className="filter-section">
        <label className="filter-title">Brand</label>
        <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
          <SelectTrigger data-testid="brand-filter">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body Type Filter */}
      <div className="filter-section">
        <label className="filter-title">Body Type</label>
        <Select value={filters.body_type} onValueChange={(value) => setFilters({ ...filters, body_type: value })}>
          <SelectTrigger data-testid="body-type-filter">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {bodyTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type Filter */}
      <div className="filter-section">
        <label className="filter-title">Fuel Type</label>
        <Select value={filters.fuel_type} onValueChange={(value) => setFilters({ ...filters, fuel_type: value })}>
          <SelectTrigger data-testid="fuel-type-filter">
            <SelectValue placeholder="All Fuel Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            {fuelTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission Filter */}
      <div className="filter-section">
        <label className="filter-title">Transmission</label>
        <Select value={filters.transmission} onValueChange={(value) => setFilters({ ...filters, transmission: value })}>
          <SelectTrigger data-testid="transmission-filter">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {transmissions.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <label className="filter-title">Price Range</label>
        <div className="px-2">
          <Slider
            value={[filters.min_price, filters.max_price]}
            onValueChange={([min, max]) => setFilters({ ...filters, min_price: min, max_price: max })}
            min={0}
            max={500000}
            step={5000}
            className="mb-4"
            data-testid="price-slider"
          />
          <div className="flex justify-between text-sm text-zinc-600 font-mono">
            <span>${filters.min_price.toLocaleString()}</span>
            <span>${filters.max_price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Year Range */}
      <div className="filter-section">
        <label className="filter-title">Year</label>
        <div className="px-2">
          <Slider
            value={[filters.min_year, filters.max_year]}
            onValueChange={([min, max]) => setFilters({ ...filters, min_year: min, max_year: max })}
            min={2015}
            max={2024}
            step={1}
            className="mb-4"
            data-testid="year-slider"
          />
          <div className="flex justify-between text-sm text-zinc-600 font-mono">
            <span>{filters.min_year}</span>
            <span>{filters.max_year}</span>
          </div>
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full mt-6 bg-zinc-900 hover:bg-zinc-800" data-testid="apply-filters-btn">
        Apply Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-zinc-600 hover:text-zinc-900 transition-colors" data-testid="back-to-home">
              <ArrowLeft size={20} />
            </Link>
            <Link to="/" className="text-xl font-bold text-zinc-900 tracking-tight">VELOCITÀ</Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/admin" className="text-zinc-600 hover:text-zinc-900 transition-colors">Admin</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Our Inventory</h1>
            <p className="text-zinc-600 mt-1">{cars.length} vehicles available</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <Input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
                data-testid="search-input"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44" data-testid="sort-select">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="year-new">Year: Newest</SelectItem>
                <SelectItem value="mileage-low">Mileage: Lowest</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden" data-testid="mobile-filter-btn">
                  <SlidersHorizontal size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar isMobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          {/* Car Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden">
                    <div className="skeleton h-48" />
                    <div className="p-4 space-y-3">
                      <div className="skeleton h-4 w-1/3" />
                      <div className="skeleton h-6 w-2/3" />
                      <div className="skeleton h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-zinc-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">No cars found</h3>
                <p className="text-zinc-600 mb-6">Try adjusting your filters or search term</p>
                <Button onClick={clearFilters} variant="outline" data-testid="no-results-clear-btn">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <Link to={`/car/${car.id}`} key={car.id} data-testid={`car-card-${car.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={car.images[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {car.is_featured && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-zinc-500 text-sm">{car.brand}</p>
                          <span className="text-red-600 font-mono font-semibold">
                            ${car.price.toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-3">{car.model}</h3>
                        <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                          <span className="bg-zinc-100 px-2 py-1 rounded">{car.year}</span>
                          <span className="bg-zinc-100 px-2 py-1 rounded font-mono">{car.mileage.toLocaleString()} mi</span>
                          <span className="bg-zinc-100 px-2 py-1 rounded">{car.fuel_type}</span>
                          <span className="bg-zinc-100 px-2 py-1 rounded">{car.transmission}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
