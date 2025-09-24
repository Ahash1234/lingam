import { useState, useEffect } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VehicleCard from "@/components/VehicleCard";
import VehicleDetailDialog from "@/components/VehicleDetailDialog";
import SearchFilters from "@/components/SearchFilters";
import CategoryFilter from "@/components/CategoryFilter";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

interface Listing {
  id?: string;
  name: string;
  wheels: number;
  owners: number;
  year: number;
  description: string;
  location: string;
  contact: string;
  type: "sale" | "rent";
  price: number;
  images: string[];
  soldOut: boolean;
  vehicleType: string;
  createdAt: number;
}

const getCategories = (vehicles: Listing[]) => [
  { id: "excavators", name: "Excavators", count: vehicles.filter(v => v.vehicleType === "excavators").length, icon: "🚜" },
  { id: "cranes", name: "Cranes", count: vehicles.filter(v => v.vehicleType === "cranes").length, icon: "🏗️" },
  { id: "trucks", name: "Heavy Trucks", count: vehicles.filter(v => v.vehicleType === "trucks").length, icon: "🚛" },
  { id: "bulldozers", name: "Bulldozers", count: vehicles.filter(v => v.vehicleType === "bulldozers").length, icon: "🚧" },
  { id: "loaders", name: "Loaders", count: vehicles.filter(v => v.vehicleType === "loaders").length, icon: "⚡" },
];

interface FilterState {
  searchTerm: string;
  wheels: string;
  owners: string;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
  type: string;
}

const Index = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    wheels: "any",
    owners: "any",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
    type: "any",
  });
  const [vehicles, setVehicles] = useState<Listing[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Listing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchVehicles = () => {
      const listingsRef = dbRef(db, "listings");
      onValue(listingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const vehiclesData = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            createdAt: data[key].createdAt || Date.now(),
          })) as Listing[];
          // Sort by createdAt desc
          vehiclesData.sort((a, b) => b.createdAt - a.createdAt);
          setVehicles(vehiclesData);
        } else {
          setVehicles([]);
        }
        setIsLoading(false);
      }, (error) => {
        setError("Failed to fetch vehicles: " + error.message);
        setIsLoading(false);
      });
    };

    fetchVehicles();
  }, []);

  // Filter vehicles based on selected category and search filters
  useEffect(() => {
    let filtered = vehicles;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(vehicle => vehicle.vehicleType === selectedCategory);
    }

    // Apply search filters
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchLower) ||
        vehicle.description.toLowerCase().includes(searchLower) ||
        vehicle.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.wheels && filters.wheels !== "any") {
      filtered = filtered.filter(vehicle => vehicle.wheels.toString() === filters.wheels);
    }

    if (filters.owners && filters.owners !== "any") {
      filtered = filtered.filter(vehicle => vehicle.owners.toString() === filters.owners);
    }

    if (filters.yearFrom) {
      filtered = filtered.filter(vehicle => vehicle.year >= parseInt(filters.yearFrom));
    }

    if (filters.yearTo) {
      filtered = filtered.filter(vehicle => vehicle.year <= parseInt(filters.yearTo));
    }

    if (filters.priceFrom) {
      filtered = filtered.filter(vehicle => vehicle.price >= parseInt(filters.priceFrom));
    }

    if (filters.priceTo) {
      filtered = filtered.filter(vehicle => vehicle.price <= parseInt(filters.priceTo));
    }

    if (filters.type && filters.type !== "any") {
      filtered = filtered.filter(vehicle => vehicle.type === filters.type);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, selectedCategory, filters]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const hasMoreVehicles = filteredVehicles.length > visibleCount;

  return (
    <div className="min-h-screen gradient-hero">
        <Header onSearchChange={(searchTerm) => setFilters({ ...filters, searchTerm })} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters onFiltersChange={setFilters} />

        {/* Clear All Filters Button */}
        {(selectedCategory !== "all" || Object.values(filters).filter((value, index) => {
          const keys = Object.keys(filters);
          return value !== "" && keys[index] !== "searchTerm";
        }).length > 0) && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("all");
                setFilters(prev => ({
                  ...prev,
                  wheels: "any",
                  owners: "any",
                  yearFrom: "",
                  yearTo: "",
                  priceFrom: "",
                  priceTo: "",
                  type: "any",
                }));
              }}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>{t('filters.clearAll')}</span>
            </Button>
          </div>
        )}

        {/* Categories */}
        <CategoryFilter
          categories={getCategories(vehicles)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Vehicle Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              {t('vehicles.available')}
            </h2>
            <p className="text-muted-foreground">
              {filteredVehicles.length} {t('vehicles.found')}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.slice(0, visibleCount).map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id || ""}
                  {...vehicle}
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setIsDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMoreVehicles && (
          <div className="text-center py-8">
            <button
              onClick={handleLoadMore}
              className="gradient-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-spring hover:shadow-glow hover:-translate-y-1"
            >
              {t('vehicles.loadMore')}
            </button>
          </div>
        )}
      </main>

      <Footer />

      <VehicleDetailDialog
        vehicle={selectedVehicle}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default Index;
