import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, push, onValue, set, remove } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Edit, Trash2, LogOut, Upload, X } from "lucide-react";

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
  createdAt: Date;
}

const AdminManage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [listingsUnsubscribe, setListingsUnsubscribe] = useState<(() => void) | null>(null);
  const [formData, setFormData] = useState<Omit<Listing, 'id' | 'createdAt'>>({
    name: "",
    wheels: 4,
    owners: 1,
    year: new Date().getFullYear(),
    description: "",
    location: "",
    contact: "",
    type: "sale",
    price: 0,
    images: [],
    soldOut: false,
    vehicleType: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchListings();
      } else {
        navigate("/admin");
      }
    });

    return () => {
      unsubscribe();
      if (listingsUnsubscribe) {
        listingsUnsubscribe();
      }
    };
  }, [navigate]);

  const fetchListings = () => {
    if (listingsUnsubscribe) {
      listingsUnsubscribe();
    }
    const listingsRef = dbRef(db, "listings");
    const unsubscribe = onValue(listingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listingsData = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          createdAt: new Date(data[key].createdAt || Date.now()),
        })) as Listing[];
        // Sort by createdAt desc
        listingsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setListings(listingsData);
      } else {
        setListings([]);
      }
      setIsLoading(false);
    }, (error) => {
      setError("Failed to fetch listings: " + error.message);
      setIsLoading(false);
    });
    setListingsUnsubscribe(() => unsubscribe);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error: any) {
      setError("Failed to logout: " + error.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageUrls(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const listingData = {
        ...formData,
        images: imageUrls,
        createdAt: Date.now(),
      };

      if (editingListing) {
        await set(dbRef(db, `listings/${editingListing.id}`), listingData);
        setSuccess("Listing updated successfully!");
      } else {
        await push(dbRef(db, "listings"), listingData);
        setSuccess("Listing added successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      setError("Failed to save listing: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setFormData({
      name: listing.name,
      wheels: listing.wheels,
      owners: listing.owners,
      year: listing.year,
      description: listing.description,
      location: listing.location,
      contact: listing.contact,
      type: listing.type,
      price: listing.price,
      images: listing.images || [],
      soldOut: listing.soldOut || false,
      vehicleType: listing.vehicleType || "",
    });
    setImageUrls(listing.images || []);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await remove(dbRef(db, `listings/${id}`));
      setSuccess("Listing deleted successfully!");
    } catch (error: any) {
      setError("Failed to delete listing: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      wheels: 4,
      owners: 1,
      year: new Date().getFullYear(),
      description: "",
      location: "",
      contact: "",
      type: "sale",
      price: 0,
      images: [],
      soldOut: false,
      vehicleType: "",
    });
    setImageUrls([]);
    setEditingListing(null);
  };

  const totalListings = listings.length;
  const forSaleCount = listings.filter(l => l.type === "sale").length;
  const forRentCount = listings.filter(l => l.type === "rent").length;
  const averagePrice = listings.length > 0
    ? Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <div className="glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalListings}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">For Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forSaleCount}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">For Rent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forRentCount}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{averagePrice.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Add Listing Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground">Manage Listings</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingListing ? "Edit Listing" : "Add New Listing"}</DialogTitle>
                <DialogDescription>
                  Fill in the details for the heavy vehicle listing.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Vehicle Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wheels">Number of Wheels</Label>
                    <Select
                      value={formData.wheels.toString()}
                      onValueChange={(value) => setFormData({ ...formData, wheels: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Wheels</SelectItem>
                        <SelectItem value="6">6 Wheels</SelectItem>
                        <SelectItem value="8">8 Wheels</SelectItem>
                        <SelectItem value="10">10 Wheels</SelectItem>
                        <SelectItem value="12">12 Wheels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owners">Previous Owners</Label>
                    <Select
                      value={formData.owners.toString()}
                      onValueChange={(value) => setFormData({ ...formData, owners: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Owner</SelectItem>
                        <SelectItem value="2">2 Owners</SelectItem>
                        <SelectItem value="3">3 Owners</SelectItem>
                        <SelectItem value="4">4 Owners</SelectItem>
                        <SelectItem value="5">5+ Owners</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === "" ? 0 : parseInt(value);
                        setFormData({ ...formData, year: isNaN(numValue) ? formData.year : numValue });
                      }}
                      min="1990"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === "" ? 0 : parseInt(value);
                        setFormData({ ...formData, price: isNaN(numValue) ? formData.price : numValue });
                      }}
                      min="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "sale" | "rent") => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excavators">🚜 Excavators</SelectItem>
                        <SelectItem value="cranes">🏗️ Cranes</SelectItem>
                        <SelectItem value="trucks">🚛 Heavy Trucks</SelectItem>
                        <SelectItem value="bulldozers">🚧 Bulldozers</SelectItem>
                        <SelectItem value="loaders">⚡ Loaders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Detailed description of the vehicle..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="gradient-primary">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingListing ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editingListing ? "Update Listing" : "Add Listing"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{listing.name}</CardTitle>
                    <CardDescription>{listing.location}</CardDescription>
                  </div>
                  <Badge variant={listing.type === "sale" ? "default" : "secondary"}>
                    {listing.type === "sale" ? "For Sale" : "For Rent"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing.images.length > 0 && (
                  <img
                    src={listing.images[0]}
                    alt={listing.name}
                    className="w-full h-32 object-cover rounded"
                  />
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Wheels: {listing.wheels}</div>
                  <div>Owners: {listing.owners}</div>
                  <div>Year: {listing.year}</div>
                  <div>₹{listing.price.toLocaleString()}</div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Type:</span> {listing.vehicleType}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(listing)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(listing.id!)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No listings found. Add your first listing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManage;
