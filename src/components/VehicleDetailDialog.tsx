import { Car, Users, Calendar, MapPin, Tag, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  createdAt: number;
}

interface VehicleDetailDialogProps {
  vehicle: Listing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VehicleDetailDialog = ({
  vehicle,
  open,
  onOpenChange,
}: VehicleDetailDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!vehicle) return null;

  const images = vehicle.images.length > 0 ? vehicle.images : ["/placeholder-vehicle.jpg"];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{vehicle.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Left Column - Images and Details */}
          <div className="space-y-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={images[currentImageIndex]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Buttons */}
                {hasMultipleImages && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-muted-foreground/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={vehicle.type === "sale" ? "default" : "secondary"}
                  className="font-semibold"
                >
                  For {vehicle.type === "sale" ? "Sale" : "Rent"}
                </Badge>
                <Badge className="gradient-primary text-primary-foreground font-bold text-lg px-3 py-1">
                  ₹{vehicle.price.toLocaleString()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{vehicle.wheels} Wheels</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{vehicle.owners} Owner{vehicle.owners !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{vehicle.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{vehicle.location}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">Contact Information</h4>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.contact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Description and Map */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Description</h4>
              <ScrollArea className="h-48 w-full rounded-md border p-4">
                <p className="text-muted-foreground leading-relaxed">
                  {vehicle.description}
                </p>
              </ScrollArea>
            </div>

            {/* Map Placeholder */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Location</h4>
              <div className="aspect-video rounded-lg border bg-muted flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Map integration coming soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailDialog;
