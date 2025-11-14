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
- Von den Cron-Services aufgerufen werden kann
- Automatisch einen Heartbeat sendet
- Status anzeigt (für Debugging)

Diese Datei wird mit deiner Website deployed und kann dann vom Cron-Service alle 2 Tage aufgerufen werden.
