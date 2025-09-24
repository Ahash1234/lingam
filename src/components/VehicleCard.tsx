import { Car, Users, Calendar, MapPin, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  id: string;
  name: string;
  images: string[];
  wheels: number;
  owners: number;
  year: number;
  price: number;
  type: "sale" | "rent";
  location: string;
  soldOut?: boolean;
  onClick?: () => void;
}

const VehicleCard = ({
  name,
  images,
  wheels,
  owners,
  year,
  price,
  type,
  location,
  soldOut = false,
  onClick,
}: VehicleCardProps) => {
  return (
    <Card
      className="group gradient-card border-border/50 hover:border-primary/30 transition-spring cursor-pointer shadow-card hover:shadow-premium relative overflow-hidden"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={images.length > 0 ? images[0] : "/placeholder-vehicle.jpg"}
          alt={name}
          className="w-full h-48 object-cover transition-smooth group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {soldOut ? (
            <Badge variant="destructive" className="font-semibold">
              Sold Out
            </Badge>
          ) : (
            <Badge 
              variant={type === "sale" ? "default" : "secondary"}
              className="font-semibold"
            >
              For {type === "sale" ? "Sale" : "Rent"}
            </Badge>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="gradient-primary text-primary-foreground font-bold text-lg px-3 py-1">
            ₹{price.toLocaleString()}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-smooth">
          {name}
        </h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Car className="h-4 w-4" />
            <span>{wheels} Wheels</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{owners} Owner{owners !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;