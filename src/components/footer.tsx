import { Link } from "react-router-dom";
import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import React from "react";

export function Footer() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer className="bg-black border-t border-white/5 py-16 px-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div style={{ gridColumn: isMobile ? '1' : 'span 2' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-30"></div>
                <Sparkles className="w-7 h-7 text-[#FFD700] relative z-10" />
              </div>
              <span className="text-white text-xl tracking-wider"> Capillus HEADSPA</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
            
Willkommen bei Capillus HEADSPA in Hohenlockstedt – Ihrem Zufluchtsort für professionelle Head Spa Behandlungen, Kopfhautpflege und ganzheitliche Wellness. Erleben Sie luxuriöse Kopfmassagen, Scalp Treatments und intensive Tiefenreinigung für gesundes Haar und pure Entspannung.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="group p-3 bg-zinc-900 hover:bg-[#FFD700]/10 border border-white/5 hover:border-[#FFD700] rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                aria-label="Besuchen Sie uns auf Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-[#FFD700] transition-colors" />
              </a>
              
            </div>
          </div>

          <div style={{ order: isMobile ? 1 : 0 }}>
            <h3 className="text-white mb-6 flex items-center gap-2">
              <div className="h-px w-8 bg-[#FFD700]"></div>
              Kontakt
            </h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <address className="group-hover:text-white transition-colors not-italic">Kieler Str. 65<br />25551 Hohenlockstedt</address>
              </div>
              <a 
                href="tel:+491704781661" 
                className="flex items-center gap-3 group hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1 -ml-2"
                aria-label="Anrufen: +49 170 4781661"
              >
                <Phone className="w-5 h-5 text-[#FFD700] flex-shrink-0" aria-hidden="true" />
                <span>+49 170 4781661</span>
              </a>
              <a 
                href="mailto:capillusheadspa@gmail.com" 
                className="flex items-center gap-3 group hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1 -ml-2"
                aria-label="E-Mail senden an capillusheadspa@gmail.com"
              >
                <Mail className="w-5 h-5 text-[#FFD700] flex-shrink-0" aria-hidden="true" />
                <span>capillusheadspa@gmail.com</span>
              </a>
            </div>
          </div>

          <div style={{ order: isMobile ? 2 : 0 }}>
            <h3 className="text-white mb-6 flex items-center gap-2">
              <div className="h-px w-8 bg-[#FFD700]"></div>
              Öffnungszeiten
            </h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex justify-between items-center group">
                <span>Mo - Fr</span>
                <span className="text-[#FFD700] group-hover:tracking-wider transition-all">09:00 - 20:00</span>
              </div>
              <div className="flex justify-between items-center group">
                <span>Samstag</span>
                <span className="text-[#FFD700] group-hover:tracking-wider transition-all">10:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sonntag</span>
                <span className="text-gray-600">Geschlossen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Capillus HEADSPA. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/datenschutz" className="hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1">Datenschutz</Link>
            <Link to="/impressum" className="hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1">Impressum</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}