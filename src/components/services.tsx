import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Droplets, Wind, Flower2 } from "lucide-react";
import useInView from "./ui/useInView";
import React from "react";
import kleineImg from "../Bilder/k.jpg";
import mittlereImg from "../Bilder/m.avif";
import grosseImg from "../Bilder/g.jpg";

const services = [
  {
    icon: Sparkles,
    title: "Kleine Auszeit",
    value: "kleine",
    duration: "30 Min",
    price: "€60",
    description: "Kurze Auszeit zur Entspannung und Revitalisierung von Kopfhaut und Sinnen.",
    image: kleineImg
  },
  {
    icon: Droplets,
    title: "Mittlere Auszeit",
    value: "mittlere",
    duration: "45 Min",
    price: "€85",
    description: "Ausgedehnte Behandlung mit Massage und pflegenden Seren für mehr Wohlbefinden.",
    image: mittlereImg
  },
  {
    icon: Wind,
    title: "Die große Auszeit",
    value: "grosse",
    duration: "75 Min",
    price: "€110",
    description: "Umfassende Verwöhnbehandlung für tiefe Entspannung und Regeneration.",
    image: grosseImg
  }
];

export function Services() {
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
    <section id="services" className="py-32 px-4 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
            {/* animate header */}
            {(() => {
              const { ref, inView } = useInView<HTMLDivElement>();
              return (
                <div 
                  ref={ref} 
                  className="transition-all duration-700"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(30px)'
                  }}
                >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FFD700]"></div>
                  <span className="text-[#FFD700] tracking-[0.3em] uppercase text-sm">Unsere Behandlungen</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#FFD700]"></div>
                </div>
                  <h2 className="text-white mb-6">Unsere Behandlungen</h2>
                  <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
                    Wählen Sie aus unseren exklusiven Behandlungen, die speziell für Ihre individuellen 
                    Bedürfnisse entwickelt wurden. Jede Behandlung ist ein Erlebnis für sich.
                  </p>
                </div>
              );
            })()}
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}>
          {services.map((service, index) => {
            const { ref, inView } = useInView<HTMLDivElement>();
            return (
              <div 
                key={index} 
                ref={ref} 
                className="transition-all duration-700"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: inView ? `${index * 150}ms` : '0ms'
                }}
              >
                <Card 
                  className="bg-gradient-to-b from-zinc-900 to-black border border-white/5 hover:border-[#FFD700]/50 transition-all duration-500 overflow-hidden group hover:shadow-[0_0_50px_rgba(255,215,0,0.15)] transform hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  {/* Floating Price Tag */}
                  <div className="absolute top-4 right-4 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] text-black px-4 py-2 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                    <span className="font-semibold">{service.price}</span>
                  </div>
                </div>                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white text-xl">{service.title}</h3>
                      <span className="text-[#FFD700] text-sm tracking-wider">{service.duration}</span>
                    </div>
                    
                    <p className="text-gray-400 leading-relaxed">{service.description}</p>
                    
                    {/* Hover Effect Line */}
                    <div className="mt-4 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[#FFD700] to-transparent transition-all duration-500"></div>
                    
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={() => {
                          try {
                            sessionStorage.setItem("bookingService", service.value);
                          } catch (e) {
                            // ignore
                          }
                          // dispatch an event so the booking section can pick it up immediately
                          try {
                            window.dispatchEvent(new CustomEvent("bookingService", { detail: service.value }));
                          } catch (e) {
                            // ignore
                          }
                          document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black border-0 px-6 py-3 rounded-full hover:shadow-md"
                        aria-label={`Jetzt buchen für ${service.title}`}
                      >
                        Jetzt buchen
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Spacer to ensure visible gap between cards and notice */}
        <div className="h-12 md:h-24" />

        {/* Important notice below the service cards */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#111115] to-zinc-900 border border-[#FFD700]/20 rounded-xl p-6 md:p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <h4 className="text-[#FFD700] uppercase tracking-wider text-sm mb-2">Bitte beachten Sie</h4>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-3">
              Bitte beachten Sie, dass Behandlungen im HEADSPA mit Extension oder bei einer Glatze
              leider momentan nicht möglich sind.
            </p>
            <p className="text-gray-400 text-sm md:text-base">
              Wir bedanken uns für Ihr Verständnis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}