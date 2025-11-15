# Supabase Keep-Alive ohne GitHub

## Lösung 1: Kostenlose Cron-Job Services (EMPFOHLEN)

### Option A: cron-job.org (einfachste Lösung)

1. **Gehe zu**: https://cron-job.org/en/signup/
2. **Erstelle kostenloses Konto** (keine Kreditkarte nötig)
3. **Neuer Cronjob**:
   - **Titel**: "Supabase Keep-Alive"
   - **URL**: `https://deine-website.com/heartbeat.html` (nach dem Deploy)
   - **Zeitplan**: Jeden 2. Tag um 03:00 Uhr
   - **Speichern**

✅ **Vorteile**: 
- Komplett kostenlos
- Keine technischen Kenntnisse nötig
- Zuverlässig
- Email-Benachrichtigung bei Fehler

### Option B: EasyCron

1. **Gehe zu**: https://www.easycron.com/
2. **Kostenloser Account** (keine Kreditkarte)
3. **Neuer Cron Job**:
   - **URL**: `https://deine-website.com/heartbeat.html`
   - **Cron Expression**: `0 3 */2 * *` (alle 2 Tage um 3 Uhr)

### Option C: UptimeRobot

1. **Gehe zu**: https://uptimerobot.com/
2. **Kostenloser Account**
3. **Add New Monitor**:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://deine-website.com/heartbeat.html`
   - **Monitoring Interval**: Jeden Tag (längste kostenlose Option)

## Lösung 2: Client-Side (schon implementiert)

Die `DatabaseHeartbeat` Komponente läuft bereits im Hintergrund wenn Besucher auf der Seite sind.

## Was du machen musst:

1. **Supabase Tabelle erstellen** (SQL im Supabase Editor):
```sql
CREATE TABLE heartbeat (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

2. **Website deployen** (z.B. auf Vercel, Netlify, etc.)

3. **Cron-Job Service wählen** (z.B. cron-job.org)

4. **URL eintragen**: `https://deine-website.com/heartbeat.html`

5. **Fertig!** - Läuft automatisch alle 2 Tage

## Empfehlung:

**Nutze cron-job.org** - ist am einfachsten und zuverlässigsten:
- Keine Installation
- Keine Kreditkarte
- Keine technischen Kenntnisse
- Email bei Problemen
- 100% kostenlos

## Die `heartbeat.html` Datei

Ich habe eine `heartbeat.html` Datei erstellt, die:
- Direkt die Supabase REST API nutzt (kein ES-Module Import)
- Von Cron-Services per GET aufgerufen werden kann
- Automatisch einen Heartbeat sendet, sobald die Seite geladen wird
- Status anzeigt (für Debugging)

**Wichtig:** Die Datei enthält Platzhalter für `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`. 
Beim Build (`npm run build`) werden diese automatisch durch das Script `scripts/prepare-heartbeat.js` 
mit den echten Werten aus deiner `.env`-Datei ersetzt und in `build/heartbeat.html` geschrieben.

**Wie es funktioniert:**
1. Du buildest deine Seite: `npm run build`
2. Das Build-Script ersetzt die Platzhalter in `heartbeat.html` automatisch
3. Die fertige `build/heartbeat.html` wird mit deiner Seite deployed
4. cron-job.org ruft `https://deine-domain/heartbeat.html` auf (einfacher GET-Request)
5. Die Seite lädt, das JavaScript führt einen POST an Supabase REST API aus
6. Heartbeat wird in der Datenbank gespeichert ✅

Diese Datei wird mit deiner Website deployed und kann dann vom Cron-Service alle 2 Tage aufgerufen werden.
