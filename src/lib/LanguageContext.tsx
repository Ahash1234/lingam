import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'TA';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  EN: {
    'app.title': 'Heavy Lingam',
    'nav.contact': 'Contact',
    'nav.adminLogin': 'Admin Login',
    'search.placeholder': 'Search heavy vehicles...',
    'hero.title': 'Heavy Lingam',
    'hero.subtitle': 'Discover premium heavy vehicles and machinery. Your trusted marketplace for construction equipment, trucks, and industrial machinery.',
    'categories.title': 'Categories',
    'categories.allVehicles': 'All Vehicles',
    'categories.excavators': 'Excavators',
    'categories.cranes': 'Cranes',
    'categories.trucks': 'Heavy Trucks',
    'categories.bulldozers': 'Bulldozers',
    'categories.loaders': 'Loaders',
    'vehicles.available': 'Available Vehicles',
    'vehicles.found': 'vehicles found',
    'vehicles.loadMore': 'Show More Listings',
    'filters.title': 'Filters',
    'filters.clearAll': 'Clear All Filters',
    'filters.wheels': 'Wheels',
    'filters.owners': 'Owners',
    'filters.yearFrom': 'Year From',
    'filters.yearTo': 'Year To',
    'filters.priceFrom': 'Price From (₹)',
    'filters.priceTo': 'Price To (₹)',
    'filters.type': 'Listing Type',
    'filters.typeAny': 'Any',
    'filters.typeSale': 'For Sale',
    'filters.typeRent': 'For Rent',
    'admin.title': 'Admin Management',
    'admin.addListing': 'Add New Listing',
    'admin.editListing': 'Edit Listing',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.delete': 'Delete',
    'admin.name': 'Name',
    'admin.wheels': 'Wheels',
    'admin.owners': 'Owners',
    'admin.year': 'Year',
    'admin.description': 'Description',
    'admin.location': 'Location',
    'admin.contact': 'Contact',
    'admin.type': 'Type',
    'admin.price': 'Price',
    'admin.images': 'Images',
    'admin.soldOut': 'Sold Out',
    'admin.vehicleType': 'Vehicle Type',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.cookies': 'Cookie Policy',
    'footer.follow': 'Follow Us',
    'footer.admin': 'Admin',
    'footer.copyright': '© 2024 Heavy Lingam. All rights reserved.',
  },
  TA: {
    'app.title': 'ஹெவி லிங்கம்',
    'nav.contact': 'தொடர்பு',
    'nav.adminLogin': 'நிர்வாகி உள்நுழைவு',
    'search.placeholder': 'ஹெவி வாகனங்களைத் தேடு...',
    'hero.title': 'ஹெவி லிங்கம்',
    'hero.subtitle': 'பிரீமியம் ஹெவி வாகனங்கள் மற்றும் இயந்திரங்களைக் கண்டறியவும். கட்டுமான உபகரணங்கள், டிரக்குகள் மற்றும் தொழில்துறை இயந்திரங்களுக்கான உங்கள் நம்பகமான சந்தை.',
    'categories.title': 'வகைகள்',
    'categories.allVehicles': 'அனைத்து வாகனங்கள்',
    'categories.excavators': 'எக்ஸ்கவேட்டர்கள்',
    'categories.cranes': 'கிரேன்கள்',
    'categories.trucks': 'ஹெவி டிரக்குகள்',
    'categories.bulldozers': 'புல்டோசர்கள்',
    'categories.loaders': 'லோடர்கள்',
    'vehicles.available': 'கிடைக்கும் வாகனங்கள்',
    'vehicles.found': 'வாகனங்கள் காணப்பட்டன',
    'vehicles.loadMore': 'மேலும் பட்டியல்களைக் காட்டு',
    'filters.title': 'வடிகட்டிகள்',
    'filters.clearAll': 'அனைத்து வடிகட்டிகளையும் அழி',
    'filters.wheels': 'சக்கரங்கள்',
    'filters.owners': 'உரிமையாளர்கள்',
    'filters.yearFrom': 'ஆண்டு முதல்',
    'filters.yearTo': 'ஆண்டு வரை',
    'filters.priceFrom': 'விலை முதல் (₹)',
    'filters.priceTo': 'விலை வரை (₹)',
    'filters.type': 'பட்டியல் வகை',
    'filters.typeAny': 'எந்த',
    'filters.typeSale': 'விற்பனைக்கு',
    'filters.typeRent': 'வாடகைக்கு',
    'admin.title': 'நிர்வாகி நிர்வாகம்',
    'admin.addListing': 'புதிய பட்டியல் சேர்',
    'admin.editListing': 'பட்டியலைத் திருத்து',
    'admin.save': 'சேமி',
    'admin.cancel': 'ரத்து செய்',
    'admin.delete': 'அழி',
    'admin.name': 'பெயர்',
    'admin.wheels': 'சக்கரங்கள்',
    'admin.owners': 'உரிமையாளர்கள்',
    'admin.year': 'ஆண்டு',
    'admin.description': 'விளக்கம்',
    'admin.location': 'இடம்',
    'admin.contact': 'தொடர்பு',
    'admin.type': 'வகை',
    'admin.price': 'விலை',
    'admin.images': 'படங்கள்',
    'admin.soldOut': 'விற்றுவிட்டது',
    'admin.vehicleType': 'வாகன வகை',
    'footer.legal': 'சட்டம்',
    'footer.privacy': 'தனியுரிமைக் கொள்கை',
    'footer.terms': 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
    'footer.cookies': 'குக்கீ கொள்கை',
    'footer.follow': 'எங்களைப் பின்தொடரவும்',
    'footer.admin': 'நிர்வாகி',
    'footer.copyright': '© 2024 ஹெவி லிங்கம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.EN] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
