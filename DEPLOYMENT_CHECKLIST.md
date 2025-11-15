# 📦 Deployment Checkliste - Capillus HEADSPA

## ✅ Vor dem Upload

- [x] Production Build erstellt (`npm run build`)
- [x] Build-Ordner erstellt: `build/`
- [x] `.htaccess` Datei in `build/` kopiert
- [ ] FTP-Zugangsdaten bereit
- [ ] Ziel-Verzeichnis auf Server bekannt (meist `/public_html/`)

---

## 📂 Dateien zum Hochladen

**Kompletter Inhalt des `build/` Ordners:**

```
build/
├── .htaccess           ← WICHTIG für React Router!
├── index.html          ← Haupt-HTML-Datei
├── robots.txt          ← SEO
├── sitemap.xml         ← SEO
└── assets/
    ├── Capillus-CGZmvU9x.png
    ├── g-D8sxRls-.jpg
    ├── Header-DPm7HpyP.png
    ├── index-BI1xE5LD.js      (526 KB - minifiziert)
    ├── index-BKZKoeoY.css     (56 KB - minifiziert)
    └── k-DwKQlN2b.jpg
```

**Gesamtgröße:** ~1.2 MB

---

## 🚀 Schnellstart FTP-Upload

### Mit FileZilla:

1. Verbinden mit FTP-Server
2. Links: Navigiere zu `C:\Users\serha\Desktop\2025_Projekte\112025_Head_Spa\build\`
3. Rechts: Navigiere zu `/public_html/` (oder Ihr Web-Root)
4. **Ziehe ALLE Dateien und Ordner** aus `build/` nach rechts
5. Warte bis Upload abgeschlossen ist
6. Fertig! ✅

### Mit WinSCP:

1. Verbinden mit FTP-Server
2. Linke Seite: `C:\Users\serha\Desktop\2025_Projekte\112025_Head_Spa\build\`
3. Rechte Seite: `/public_html/`
4. Alle Dateien von links nach rechts ziehen
5. Upload abwarten
6. Fertig! ✅

---

## 🧪 Nach dem Upload testen

### 1. Basis-URLs testen:

- [ ] `https://ihre-domain.de/` → Startseite lädt
- [ ] `https://ihre-domain.de/impressum` → Impressum-Seite
- [ ] `https://ihre-domain.de/datenschutz` → Datenschutz-Seite
- [ ] `https://ihre-domain.de/login` → Login-Seite

### 2. Funktionen testen:

- [ ] Header-Navigation funktioniert
- [ ] Services-Section wird angezeigt
- [ ] Buchungsformular öffnet sich
- [ ] Kalender funktioniert
- [ ] Cookie-Banner erscheint
- [ ] Footer wird angezeigt
- [ ] Mobile-Ansicht funktioniert (F12 → Device-Toolbar)

### 3. Performance prüfen:

- [ ] Seite lädt in < 3 Sekunden
- [ ] Bilder werden angezeigt
- [ ] CSS-Styles sind aktiv
- [ ] Keine Fehler in Browser-Konsole (F12)

---

## ⚠️ Wichtige Hinweise

### React Router und .htaccess

**OHNE `.htaccess`:**
- ❌ `https://ihre-domain.de/impressum` → 404 Fehler
- ❌ Direkter Link funktioniert nicht
- ❌ Seite neu laden → 404 Fehler

**MIT `.htaccess`:**
- ✅ Alle URLs funktionieren
- ✅ Direktlinks funktionieren
- ✅ Seite neu laden funktioniert

→ **`.htaccess` ist ZWINGEND erforderlich!**

---

## 🔧 Troubleshooting

| Problem | Lösung |
|---------|--------|
| 404 bei `/impressum` | `.htaccess` hochladen |
| Weiße Seite | Browser-Konsole prüfen (F12) |
| Bilder fehlen | `assets/` Ordner hochladen |
| Keine Styles | `index-*.css` in `assets/` prüfen |
| Login geht nicht | Supabase-Keys prüfen, neu builden |

---

## 📞 FTP-Server Informationen

**Tragen Sie hier Ihre Zugangsdaten ein:**

```
Host:       ftp.ihre-domain.de
Username:   ___________________
Password:   ___________________
Port:       21 (FTP) oder 22 (SFTP)
Web-Root:   /public_html/
```

---

## 🎯 Nächste Schritte nach Deployment

1. **SSL/HTTPS aktivieren** (Let's Encrypt bei Hoster)
2. **Domain mit www und ohne www testen**
3. **Google Analytics einbinden** (optional)
4. **Google Search Console einrichten**
5. **Sitemap bei Google einreichen**
6. **Performance testen:** https://pagespeed.web.dev/

---

## 📧 Support

Bei Fragen:
- Hoster-Support kontaktieren (für FTP/Server-Probleme)
- Browser-Konsole prüfen (F12 → Console)
- Network-Tab prüfen (F12 → Network)

**Viel Erfolg! 🎉**
