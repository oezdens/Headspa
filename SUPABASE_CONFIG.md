# 🔐 Supabase Konfiguration für Production

## Wichtiger Hinweis

Die Supabase-Zugangsdaten werden beim Build-Prozess **direkt in den JavaScript-Code eingebettet**. 

⚠️ **Wenn Sie die Supabase-Konfiguration ändern, müssen Sie einen neuen Build erstellen!**

---

## 📋 Benötigte Umgebungsvariablen

Erstellen Sie im Projekt-Root eine Datei namens `.env` (oder `.env.local`) mit folgendem Inhalt:

```env
VITE_SUPABASE_URL=https://ihre-projekt-id.supabase.co
VITE_SUPABASE_ANON_KEY=ihr-anon-key-hier
```

---

## 🔍 Wo finde ich diese Werte?

### 1. Supabase Dashboard öffnen
Gehen Sie zu: https://app.supabase.com/

### 2. Projekt auswählen
Wählen Sie Ihr Projekt aus

### 3. Project Settings öffnen
Klicken Sie links auf das Zahnrad-Symbol → **Settings** → **API**

### 4. Werte kopieren

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```
→ Dies ist Ihre `VITE_SUPABASE_URL`

**anon/public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Dies ist Ihr `VITE_SUPABASE_ANON_KEY`

---

## 📝 .env Datei erstellen

1. Im Projekt-Root (neben `package.json`) eine neue Datei erstellen
2. Dateiname: `.env`
3. Inhalt einfügen und Werte ersetzen:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Datei speichern

---

## 🔨 Build mit korrekten Umgebungsvariablen

Nach dem Erstellen/Ändern der `.env`-Datei:

```powershell
npm run build
```

Die Werte werden nun in `build/assets/index-*.js` eingebaut.

---

## ✅ Prüfen ob Variablen korrekt sind

Nach dem Build können Sie testen:

```powershell
# Im build/ Ordner nach Ihrer Supabase-URL suchen
Select-String -Path ".\build\assets\*.js" -Pattern "supabase.co" -Quiet
```

Wenn `True` zurückgegeben wird → Variablen wurden korrekt eingebaut! ✅

---

## 🛡️ Sicherheit

### Ist es sicher, den ANON_KEY öffentlich zu machen?

**JA!** Der `anon` Key ist für die öffentliche Nutzung gedacht.

**ABER:** 
- ⚠️ Niemals den `service_role` Key verwenden!
- ✅ Row Level Security (RLS) in Supabase aktivieren
- ✅ Nur notwendige Berechtigungen vergeben

### Row Level Security (RLS) prüfen

1. Supabase Dashboard → **Table Editor**
2. Jede Tabelle auswählen
3. Oben rechts: **RLS enabled** sollte aktiv sein ✅

**Beispiel Policies:**

```sql
-- Buchungen: Jeder kann erstellen (für Kontaktformular)
CREATE POLICY "Enable insert for all users" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Buchungen: Nur authentifizierte Admins können lesen
CREATE POLICY "Enable read for authenticated users only" ON bookings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Buchungen: Nur authentifizierte Admins können löschen
CREATE POLICY "Enable delete for authenticated users only" ON bookings
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

---

## 🔄 Umgebungsvariablen ändern

**Wenn Sie die Supabase-Keys ändern müssen:**

1. `.env` Datei bearbeiten
2. Neue Werte eintragen
3. **Neuen Build erstellen:**
   ```powershell
   npm run build
   ```
4. Neuen `build/` Ordner per FTP hochladen

---

## 📊 Tabellen-Struktur

Ihre Datenbank sollte folgende Tabellen haben:

### `bookings` Tabelle

```sql
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `blocked_slots` Tabelle

```sql
CREATE TABLE blocked_slots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  time TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `heartbeat` Tabelle (optional, für Keep-Alive)

```sql
CREATE TABLE heartbeat (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🧪 Verbindung testen

Nach dem Build können Sie die Verbindung testen:

1. Build lokal starten:
   ```powershell
   npm install -g serve
   serve -s build -p 3000
   ```

2. Browser öffnen: `http://localhost:3000`

3. Browser-Konsole öffnen (F12)

4. Buchung testen → Sollte in Supabase-Datenbank erscheinen

---

## 📞 Support

Bei Verbindungsproblemen:

1. **Supabase Dashboard → Logs** prüfen
2. **Browser-Konsole (F12)** → Fehlermeldungen checken
3. **Network-Tab (F12)** → API-Calls prüfen

Typische Fehler:
- `Invalid API key` → ANON_KEY falsch
- `Failed to fetch` → URL falsch oder Netzwerkproblem
- `Row Level Security` → RLS-Policy fehlt

---

**Alles klar? Dann auf zum Build! 🚀**
