import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Scale, MapPin, Phone, Mail } from "lucide-react";

export function Impressum() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Impressum — Capillus HEADSPA</title>
        <meta name="description" content="Impressum von Capillus HEADSPA — Betreiberinformationen, Kontakt und rechtliche Hinweise." />
      </Helmet>
      <section className="py-32 px-4 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Decorative Background Elements - matching Services */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px]"></div>
      </div>

      <div className="mx-auto relative" style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FFD700]"></div>
            <span className="text-[#FFD700] tracking-[0.3em] uppercase text-sm">Rechtliches</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#FFD700]"></div>
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: '4.25rem' }}>Impressum</h1>
          <p className="text-gray-400 text-lg">Angaben gemäß § 5 TMG</p>
        </div>

        {/* Content Container */}
        <div className="bg-gradient-to-b from-zinc-900/80 to-black/60 border border-white/5 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
          <div className="space-y-8">
            {/* Diensteanbieter Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-[#FFD700]" />
                <h2 className="text-xl text-white font-semibold">Diensteanbieter / Betreiber</h2>
              </div>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-base font-medium">Capillus HEADSPA — "NAME"</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 flex-shrink-0">
                      <MapPin className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <div className="text-gray-300 text-sm">
                      <p>Kieler Str. 65</p>
                      <p>25551 Hohenlockstedt</p>
                      <p>Deutschland</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <a href="tel:+4915758199741" className="text-gray-300 hover:text-[#FFD700] transition-colors text-sm">
                      +49 30 12345678
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <a href="mailto:capillusheadspa@gmail.com" className="text-gray-300 hover:text-[#FFD700] transition-colors text-sm">
                      capillusheadspa@gmail.com
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <p className="text-gray-400 text-sm">USt-IdNr.: Kleingewerbetreibend, keine USt-IdNr. vorhanden</p>
                </div>
              </div>
            </div>

            {/* Verantwortlich für den Inhalt */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Verantwortlich für den Inhalt</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Gemäß § 18 Abs. 2 Medienstaatsvertrag (MStV): Capillus HEADSPA, Kieler Str. 65, 25551 Hohenlockstedt
              </p>
            </div>

            {/* EU-Streitschlichtung */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">EU-Streitschlichtung</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              <a 
                href="https://ec.europa.eu/consumers/odr/" 
                target="_blank" 
                rel="noreferrer"
                className="text-[#FFD700] hover:text-[#D4AF37] underline transition-colors inline-block text-sm"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>

            {/* Verbraucherstreitbeilegung */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Verbraucherstreitbeilegung</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

            {/* Haftungsausschluss & Urheberrecht */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Haftungsausschluss & Urheberrecht</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Seite unterliegen 
                dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung oder Verbreitung bedürfen der 
                schriftlichen Zustimmung.
              </p>
            </div>
          </div>

          {/* Footer timestamp */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-gray-500 text-sm">
            Stand: November 2025
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default Impressum;
