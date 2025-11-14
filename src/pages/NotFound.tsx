import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-2xl w-full text-center relative z-10">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FAFAD2] to-[#FFD700] bg-clip-text text-transparent">
            404
          </h1>
        </div>
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-full">
            <Search className="w-16 h-16 text-[#FFD700]" />
          </div>
        </div>
        
        {/* Heading */}
        <h2 className="text-3xl text-white font-semibold mb-4">
          Seite nicht gefunden
        </h2>
        
        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Die gesuchte Seite existiert leider nicht. Möglicherweise wurde sie verschoben oder der Link ist veraltet.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FFD700] text-black px-8 py-6 text-base gap-2 transition-transform duration-200 ease-out hover:scale-105">
              <Home className="w-5 h-5" />
              Zur Startseite
            </Button>
          </Link>
          
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5 hover:border-[#FFD700] px-8 py-6 text-base gap-2 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück
          </Button>
        </div>
        
        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4">Hilfreiche Links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/#services" className="text-[#FFD700] hover:text-[#D4AF37] transition-colors">
              Unsere Services
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/#booking" className="text-[#FFD700] hover:text-[#D4AF37] transition-colors">
              Termin buchen
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/impressum" className="text-[#FFD700] hover:text-[#D4AF37] transition-colors">
              Impressum
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/datenschutz" className="text-[#FFD700] hover:text-[#D4AF37] transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
