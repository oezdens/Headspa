import { ImageWithFallback } from "./figma/ImageWithFallback";
import CapillusImg from "../Bilder/Capillus.png";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    setMounted(true);
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking");
    bookingSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main id="main">
      <div id="hero" className="relative h-screen overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={CapillusImg}
          alt="Capillus Head Spa Behandlung - Professionelle Kopfhautpflege und Massage in Hohenlockstedt"
          className="w-full h-full object-cover scale-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
        
        {/* Animated Gold Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Decorative Top Line */}
        <div 
          className="flex items-center gap-3 mb-8 transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
            transitionDelay: '200ms'
          }}
        >
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
          <span className="text-[#FFD700] tracking-[0.3em] uppercase text-sm">Luxuriöse Kopfhautpflege</span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-[#FFD700] to-transparent"></div>
        </div>
        
        {/* Main Heading */}
        <h1 
          className="text-white mb-8 max-w-5xl transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '400ms',
            lineHeight: '1.4',
            paddingBottom: '0.5rem'
          }}
        >
          <span className="block bg-gradient-to-r from-[#FFD700] via-[#FAFAD2] to-[#FFD700] animate-[shimmer_2s_ease-in-out_infinite]" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Erleben Sie Entspannung
          </span>
        </h1>

        <p 
          className="text-gray-300/90 mb-12 max-w-2xl leading-loose transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '600ms'
          }}
        >
          Willkommen bei Capillus HEADSPA in Hohenlockstedt – Ihrem Zufluchtsort für professionelle Head Spa Behandlungen, Kopfhautpflege und ganzheitliche Wellness. Erleben Sie luxuriöse Kopfmassagen, Scalp Treatments und intensive Tiefenreinigung für gesundes Haar und pure Entspannung.
        </p>
        
        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-6 mb-16 transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '800ms'
          }}
        >
          <Button
            onClick={scrollToBooking}
            className="group bg-[#FFD700] hover:bg-[#E6C200] text-black px-10 py-6 text-lg rounded-md shadow-md transform transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Jetzt Termin buchen - Zum Buchungsformular"
          >
            <span>Jetzt Termin buchen</span>
          </Button>
        </div>

        {/* Scroll Indicator - hidden on mobile, visible on desktop */}
        <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 text-[#FFD700]/60">
            <span className="text-xs tracking-widest uppercase">Mehr entdecken</span>
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" aria-hidden="true"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-[#FFD700] rounded-full animate-pulse delay-150" aria-hidden="true"></div>
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-[#FFD700] rounded-full animate-pulse delay-300" aria-hidden="true"></div>
    </div>
    </main>
  );
}