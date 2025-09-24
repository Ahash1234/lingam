import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/LanguageContext";

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

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
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

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      searchTerm: "",
      wheels: "any",
      owners: "any",
      yearFrom: "",
      yearTo: "",
      priceFrom: "",
      priceTo: "",
      type: "any",
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter((value, index) => {
    const keys = Object.keys(filters);
    return value !== "" && keys[index] !== "searchTerm";
  }).length;

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>{t('filters.title')}</span>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            {t('filters.clearAll')}
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Wheels */}
              <div className="space-y-2">
                <Label htmlFor="wheels">{t('filters.wheels')}</Label>
                <Select value={filters.wheels} onValueChange={(value) => handleFilterChange("wheels", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.typeAny')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('filters.typeAny')}</SelectItem>
                    <SelectItem value="4">4 {t('filters.wheels')}</SelectItem>
                    <SelectItem value="6">6 {t('filters.wheels')}</SelectItem>
                    <SelectItem value="8">8 {t('filters.wheels')}</SelectItem>
                    <SelectItem value="10">10+ {t('filters.wheels')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Owners */}
              <div className="space-y-2">
                <Label htmlFor="owners">{t('filters.owners')}</Label>
                <Select value={filters.owners} onValueChange={(value) => handleFilterChange("owners", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.typeAny')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('filters.typeAny')}</SelectItem>
                    <SelectItem value="1">1 Owner</SelectItem>
                    <SelectItem value="2">2 Owners</SelectItem>
                    <SelectItem value="3">3 Owners</SelectItem>
                    <SelectItem value="4">4+ Owners</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year From */}
              <div className="space-y-2">
                <Label htmlFor="yearFrom">{t('filters.yearFrom')}</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2015"
                  value={filters.yearFrom}
                  onChange={(e) => handleFilterChange("yearFrom", e.target.value)}
                  min="1990"
                  max={new Date().getFullYear()}
                />
              </div>

              {/* Year To */}
              <div className="space-y-2">
                <Label htmlFor="yearTo">{t('filters.yearTo')}</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2024"
                  value={filters.yearTo}
                  onChange={(e) => handleFilterChange("yearTo", e.target.value)}
                  min="1990"
                  max={new Date().getFullYear()}
                />
              </div>

              {/* Price From */}
              <div className="space-y-2">
                <Label htmlFor="priceFrom">{t('filters.priceFrom')}</Label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.priceFrom}
                  onChange={(e) => handleFilterChange("priceFrom", e.target.value)}
                  min="0"
                />
              </div>

              {/* Price To */}
              <div className="space-y-2">
                <Label htmlFor="priceTo">{t('filters.priceTo')}</Label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.priceTo}
                  onChange={(e) => handleFilterChange("priceTo", e.target.value)}
                  min="0"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">{t('filters.type')}</Label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.typeAny')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('filters.typeAny')}</SelectItem>
                    <SelectItem value="sale">{t('filters.typeSale')}</SelectItem>
                    <SelectItem value="rent">{t('filters.typeRent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchFilters;