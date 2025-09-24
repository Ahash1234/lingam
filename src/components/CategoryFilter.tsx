import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/LanguageContext";

interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{t('categories.title')}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => onCategoryChange("all")}
          className="h-auto py-4 px-3 flex flex-col items-center space-y-2 transition-spring"
        >
          <span className="text-2xl">🚛</span>
          <span className="text-sm font-medium">{t('categories.allVehicles')}</span>
          <Badge variant="secondary" className="text-xs">
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </Badge>
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className="h-auto py-4 px-3 flex flex-col items-center space-y-2 transition-spring"
          >
            <span className="text-2xl">{category.icon}</span>
            <span className="text-sm font-medium text-center">{category.name}</span>
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;