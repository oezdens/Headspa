# 🚀 FTP Deployment Anleitung für Capillus HEADSPA

## ✅ Build erfolgreich erstellt!

Der Production-Build wurde erstellt und befindet sich im Ordner `build/`.

---

## 📋 Deployment Checkliste

### 1. **Umgebungsvariablen prüfen**

Bevor Sie deployen, stellen Sie sicher, dass folgende Umgebungsvariablen korrekt konfiguriert sind:

**Lokale Entwicklung (.env.local oder .env):**
```
VITE_SUPABASE_URL=https://ihre-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=ihr-anon-key
```

⚠️ **WICHTIG:** Diese Variablen werden beim Build in den JavaScript-Code "gebacken". Falls Sie die Supabase-Konfiguration ändern müssen, führen Sie erneut `npm run build` aus.

---

### 2. **Build-Verzeichnis hochladen**

#### Alle Dateien im `build/` Ordner hochladen:

```
build/
├── index.html          ← Haupt-HTML-Datei
├── robots.txt          ← SEO: Crawler-Anweisungen
├── sitemap.xml         ← SEO: Sitemap
└── assets/             ← Alle optimierten Assets
    ├── Capillus-CGZmvU9x.png
    ├── g-D8sxRls-.jpg
    ├── Header-DPm7HpyP.png
    ├── index-BI1xE5LD.js      ← Minifiziertes JavaScript
    ├── index-BKZKoeoY.css     ← Minifiziertes CSS
    └── k-DwKQlN2b.jpg
```

---

### 3. **FTP-Upload Schritte**

#### Option A: FileZilla (empfohlen)

1. **FileZilla öffnen** und FTP-Server verbinden:
   - Host: `ftp.ihre-domain.de`
   - Benutzername: `ihr-ftp-username`
   - Passwort: `ihr-ftp-passwort`
   - Port: `21` (Standard FTP) oder `22` (SFTP)

2. **Navigieren Sie zum Web-Root-Verzeichnis:**
   - Häufig: `/public_html/` oder `/htdocs/` oder `/www/`

3. **Laden Sie ALLE Dateien aus dem `build/` Ordner hoch:**
   - Ziehen Sie den gesamten Inhalt von `build/` in das Root-Verzeichnis
   - **NICHT** den `build/` Ordner selbst hochladen, sondern nur dessen Inhalt!

4. **Dateistruktur auf dem Server sollte so aussehen:**
   ```
   /public_html/
   ├── index.html
   ├── robots.txt
   ├── sitemap.xml
   ├── .htaccess           ← Wichtig für React Router!
   └── assets/
       ├── Capillus-CGZmvU9x.png
       ├── g-D8sxRls-.jpg
       ├── Header-DPm7HpyP.png
       ├── index-BI1xE5LD.js
       ├── index-BKZKoeoY.css
       └── k-DwKQlN2b.jpg
   ```

#### Option B: WinSCP (Windows)

1. WinSCP öffnen und Server-Daten eingeben
2. Verbindung herstellen
3. Rechte Seite: Navigieren zum Web-Root (`/public_html/`)
4. Linke Seite: Navigieren zum `build/` Ordner
5. Alle Dateien von links nach rechts ziehen

#### Option C: Kommandozeile (Windows PowerShell)

Falls Sie `curl` oder `ftp` CLI nutzen:

```powershell
# Beispiel mit WinSCP Kommandozeile
"open ftp://username:password@ftp.ihre-domain.de" | winscp.com /command "put build\* /public_html/" "exit"
```

---

### 4. **`.htaccess` Datei erstellen (WICHTIG!)**

Da Ihre App React Router nutzt, benötigen Sie eine `.htaccess`-Datei, damit alle URLs korrekt auf `index.html` umgeleitet werden.

**Erstellen Sie auf dem Server eine Datei namens `.htaccess` im gleichen Verzeichnis wie `index.html`:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Wenn die angeforderte Datei nicht existiert
  RewriteCond %{REQUEST_FILENAME} !-f
  # Und das angeforderte Verzeichnis nicht existiert
  RewriteCond %{REQUEST_FILENAME} !-d
  # Leite alle Anfragen auf index.html um
  RewriteRule . /index.html [L]
</IfModule>

# Browser-Caching für Assets aktivieren
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Kompression aktivieren
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

**📝 Die `.htaccess`-Datei wurde bereits für Sie erstellt und liegt im Projekt-Root!**

---

### 5. **Testen Sie Ihre Webseite**

Nach dem Upload:

1. **Öffnen Sie Ihre Domain im Browser:** `https://ihre-domain.de`

2. **Testen Sie diese URLs:**
   - `https://ihre-domain.de/` → Startseite
   - `https://ihre-domain.de/impressum` → Impressum
   - `https://ihre-domain.de/datenschutz` → Datenschutz
   - `https://ihre-domain.de/login` → Login-Seite
   - `https://ihre-domain.de/dashboard` → Dashboard (nach Login)

3. **Mobile-Ansicht testen:**
   - Chrome DevTools: F12 → Toggle Device Toolbar (Strg+Shift+M)
   - Prüfen: Header-Menü, Services-Kacheln, Footer

4. **Funktionen testen:**
   - Buchungsformular absenden
   - Kalender öffnen
   - Login-Funktion
   - Cookie-Banner

---

## 🔧 Troubleshooting

### Problem: "404 Not Found" bei Unterseiten

**Lösung:** `.htaccess`-Datei fehlt oder mod_rewrite ist nicht aktiviert
- Laden Sie die `.htaccess`-Datei hoch
- Kontaktieren Sie Ihren Hoster, um `mod_rewrite` zu aktivieren

### Problem: Weiße Seite oder "Cannot read properties of undefined"

**Lösung:** Supabase-Umgebungsvariablen fehlen
- Prüfen Sie, ob beim Build die `.env`-Datei vorhanden war
- Build erneut erstellen: `npm run build`

### Problem: Bilder werden nicht angezeigt

**Lösung:** `assets/`-Ordner nicht hochgeladen
- Prüfen Sie, ob der `assets/`-Ordner auf dem Server existiert
- Alle Dateien erneut hochladen

### Problem: CSS-Styles fehlen

**Lösung:** CSS-Datei nicht hochgeladen oder Pfad falsch
- Prüfen Sie, ob `assets/index-*.css` vorhanden ist
- Browser-Cache leeren (Strg+F5)

### Problem: Slow Loading / Lange Ladezeiten

**Lösung:** Aktivieren Sie Kompression und Caching
- `.htaccess` mit Caching-Regeln verwenden
- Bei Hoster nachfragen: Gzip/Brotli Kompression aktivieren
- Prüfen: Ist HTTP/2 aktiviert?

---

## 📊 Performance-Check nach Deployment

Testen Sie Ihre Webseite mit:
- **Google PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- **WebPageTest:** https://www.webpagetest.org/

Ziel:
- Performance Score > 90
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s

---

## 🔒 Sicherheit

### SSL/TLS Zertifikat (HTTPS)

⚠️ **Sehr wichtig:** Ihre Webseite sollte HTTPS nutzen!

- Viele Hoster bieten kostenlose Let's Encrypt Zertifikate
- In cPanel/Plesk: SSL/TLS aktivieren
- Bei Bedarf: Automatische HTTP→HTTPS Umleitung einrichten

**HTTP→HTTPS Umleitung in `.htaccess` hinzufügen:**

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📝 Zusammenfassung

✅ **Build erstellt:** `build/` Ordner
✅ **Dateien zum Upload:** Kompletter Inhalt von `build/`
✅ **Zusätzlich benötigt:** `.htaccess`-Datei
✅ **Nach Upload:** Testen aller Seiten und Funktionen

---

## 🆘 Support

Bei Problemen:
1. Browser-Konsole prüfen (F12)
2. Server-Logs beim Hoster einsehen
3. Supabase Dashboard → Logs prüfen

**Viel Erfolg beim Deployment! 🎉**
