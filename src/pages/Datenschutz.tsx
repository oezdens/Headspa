import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Shield } from "lucide-react";

export function Datenschutz() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Datenschutz — Capillus HEADSPA</title>
        <meta name="description" content="Datenschutzerklärung von Capillus HEADSPA — Informationen zum Datenschutz und zur Datenverarbeitung." />
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
          <h1 className="text-white mb-3" style={{ fontSize: '4.25rem' }}>Datenschutz</h1>
          <p className="text-gray-400 text-lg">Datenschutzerklärung</p>
        </div>

        {/* Content Container */}
        <div className="bg-gradient-to-b from-zinc-900/80 to-black/60 border border-white/5 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
          <div className="space-y-8">
            {/* Allgemeine Hinweise */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-[#FFD700]" />
                <h2 className="text-xl text-white font-semibold">Allgemeine Hinweise</h2>
              </div>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  <strong>Verantwortliche Stelle:</strong> Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist <strong>Name</strong>. Die vollständigen Kontaktdaten finden Sie im Impressum.
                </p>
              </div>
            </div>

            {/* Datenerfassung */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Datenerfassung auf dieser Website</h3>
              <div className="pl-8 space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Wer ist verantwortlich für die Datenerfassung?</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber <strong>NAME</strong>. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Wie erfassen wir Ihre Daten?</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed mt-2">
                    Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Wofür nutzen wir Ihre Daten?</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten und die Sicherheit unserer IT-Systeme zu gewährleisten.
                  </p>
                </div>
              </div>
            </div>

            {/* Hosting */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Hosting und Content Delivery Networks (CDN)</h3>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Diese Website wird bei <strong>STRATO AG</strong> (Otto-Lilienthal-Straße 1, 31135 Hildesheim, Deutschland) gehostet. Der Hoster verarbeitet in unserem Auftrag alle Daten, die auf dieser Website verarbeitet werden oder über die Website erhoben werden. Dies ist insbesondere zur Bereitstellung der Website, Gewährleistung von Stabilität und Sicherheit erforderlich.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Die Nutzung von STRATO erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer technisch einwandfreien und optimierten Bereitstellung unserer Website. Wir haben mit der STRATO AG einen Vertrag über Auftragsverarbeitung (AVV) abgeschlossen, der sicherstellt, dass die Daten unserer Website-Besucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet werden.
                </p>
              </div>
            </div>

            {/* Server-Log-Dateien */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Server-Log-Dateien</h3>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Der Provider der Seiten (STRATO) erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung der technischen Sicherheit und Optimierung unserer Dienste.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Cookies</h3>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  <strong>Diese Website verwendet keine Cookies.</strong>
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Wir setzen weder technisch notwendige Cookies noch Cookies zu Analyse-, Marketing- oder Trackingzwecken ein. Es werden keine Informationen in Ihrem Browser gespeichert, und es erfolgt keine Nachverfolgung Ihres Nutzerverhaltens über Cookies oder ähnliche Technologien.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Die Website funktioniert vollständig ohne den Einsatz von Cookies. Ihre Privatsphäre wird somit maximal geschützt.
                </p>
              </div>
            </div>

            {/* Kontaktformular */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Kontaktformular</h3>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.
                </p>
              </div>
            </div>

            {/* Ihre Rechte */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Ihre Rechte</h3>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
                </p>
                <p className="text-gray-300 text-sm font-medium">Ihre Rechte im Überblick:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li><strong>Auskunftsrecht:</strong> Sie können Auskunft über Ihre bei uns gespeicherten Daten verlangen</li>
                  <li><strong>Berichtigungsrecht:</strong> Sie können die Berichtigung unrichtiger Daten verlangen</li>
                  <li><strong>Löschungsrecht:</strong> Sie können die Löschung Ihrer Daten verlangen</li>
                  <li><strong>Einschränkung der Verarbeitung:</strong> Sie können die Einschränkung der Verarbeitung verlangen</li>
                  <li><strong>Datenübertragbarkeit:</strong> Sie haben das Recht auf Datenübertragbarkeit</li>
                  <li><strong>Widerspruchsrecht:</strong> Sie können der Verarbeitung Ihrer Daten widersprechen</li>
                  <li><strong>Beschwerderecht:</strong> Sie können sich bei einer Aufsichtsbehörde beschweren, insbesondere bei der für uns zuständigen Aufsichtsbehörde: Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (Postfach 10 29 32, 70025 Stuttgart)</li>
                </ul>
                <p className="text-gray-300 text-sm leading-relaxed">
                  <strong>Kontakt:</strong> Für Fragen zum Datenschutz wenden Sie sich bitte an: <a href="mailto:capillusheadspa@gmail.com" className="text-[#FFD700] hover:text-[#D4AF37] transition-colors">capillusheadspa@gmail.com</a>
                </p>
              </div>
            </div>

            {/* SSL-Verschlüsselung */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">SSL- bzw. TLS-Verschlüsselung</h3>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
              </div>
            </div>

            {/* Speicherdauer */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-lg text-white font-semibold mb-3">Speicherdauer</h3>
              <div className="pl-8 space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.
                </p>
              </div>
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

export default Datenschutz;
