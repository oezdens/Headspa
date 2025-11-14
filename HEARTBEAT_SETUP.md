# Supabase Database Keep-Alive Setup

## Problem
Supabase Free Tier pausiert die Datenbank nach 8 Tagen Inaktivität.

## Lösung
Zwei-Stufen-Ansatz für maximale Zuverlässigkeit:

### 1. GitHub Actions (Hauptlösung - 100% zuverlässig)
Automatischer Cron-Job läuft alle 2 Tage, unabhängig von Website-Besuchern.

**Setup-Schritte:**

1. **Supabase Tabelle erstellen** (falls noch nicht geschehen):
```sql
CREATE TABLE heartbeat (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Auto-Cleanup (behält nur die letzten 10 Einträge)
CREATE OR REPLACE FUNCTION cleanup_old_heartbeats()
RETURNS trigger AS $$
BEGIN
  DELETE FROM heartbeat
  WHERE id NOT IN (
    SELECT id FROM heartbeat
    ORDER BY timestamp DESC
    LIMIT 10
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER heartbeat_cleanup
AFTER INSERT ON heartbeat
FOR EACH STATEMENT
EXECUTE FUNCTION cleanup_old_heartbeats();
```

2. **GitHub Secrets einrichten**:
   - Gehe zu deinem GitHub Repository
   - Settings → Secrets and variables → Actions → New repository secret
   - Füge hinzu:
     - `SUPABASE_URL`: Deine Supabase Projekt-URL (z.B. `https://xxx.supabase.co`)
     - `SUPABASE_ANON_KEY`: Dein Supabase anon/public key

3. **Workflow ist bereits erstellt**: `.github/workflows/keep-db-alive.yml`

4. **Testen**:
   - Gehe zu Actions Tab in GitHub
   - Wähle "Keep Supabase Database Active"
   - Klicke "Run workflow" um manuell zu testen

### 2. Client-Side Heartbeat (Backup)
Zusätzlicher Schutz wenn Besucher auf der Seite sind.

**Bereits implementiert in**: `src/components/DatabaseHeartbeat.tsx`

## Wie es funktioniert

- **GitHub Actions**: Läuft automatisch alle 2 Tage (auch wenn niemand die Website besucht)
- **Client-Side**: Zusätzlicher Backup wenn Besucher die Seite laden
- **Zusammen**: Doppelte Absicherung gegen Datenbank-Pause

## Monitoring

Nach dem Push zu GitHub:
1. Gehe zu Repository → Actions Tab
2. Siehst du alle Workflow-Runs mit Zeitstempel
3. Grüner Haken = Erfolgreich, Roter X = Fehler

## Wichtig

⚠️ **Du musst die Secrets in GitHub einrichten**, sonst funktioniert der Workflow nicht!

## Alternative: UptimeRobot

Falls GitHub Actions nicht gewünscht, kannst du auch UptimeRobot.com (kostenlos) nutzen:
1. Account erstellen
2. Neuer Monitor → HTTP(s)
3. URL: `https://deine-website.com` (ruft einfach deine Seite auf)
4. Monitoring Interval: Alle 2 Tage (längste kostenlose Option)
