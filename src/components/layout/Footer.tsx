import { Instagram, MessageCircle, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              {t('app.title')}
            </div>
            <p className="text-muted-foreground text-sm">
              Premium marketplace for heavy vehicles and machinery.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">{t('footer.legal')}</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                {t('footer.privacy')}
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                {t('footer.terms')}
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                {t('footer.cookies')}
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">{t('footer.follow')}</h3>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8 hover:text-primary transition-smooth">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8 hover:text-primary transition-smooth">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8 hover:text-primary transition-smooth">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8 hover:text-primary transition-smooth">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Admin Access */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">{t('footer.admin')}</h3>
            <Button
              variant="premium"
              size="sm"
              className="w-full"
              onClick={() => window.location.href = "/admin"}
            >
              {t('nav.adminLogin')}
            </Button>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;