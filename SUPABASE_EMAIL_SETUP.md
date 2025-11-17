# Supabase Edge Function Email Setup

## 🎯 Einfache Lösung mit Supabase + Resend

Diese Lösung ist **viel einfacher** als die PHP-Variante:
- ✅ Keine Server-Dateien hochladen
- ✅ Keine PHP/SMTP Konfiguration
- ✅ Alles in Supabase Dashboard
- ✅ 100 kostenlose E-Mails pro Tag mit Resend

---

## Schritt 1: Supabase CLI installieren

Öffne PowerShell und führe aus:

```powershell
# Installiere Supabase CLI
npm install -g supabase

# Prüfe Installation
supabase --version
```

---

## Schritt 2: Supabase Login

```powershell
# Login bei Supabase
supabase login

# Verknüpfe dein Projekt
cd "c:\Users\serha\Desktop\2025_Projekte\112025_Head_Spa"
supabase link --project-ref vvkuqjbkstecjbgttjjh
```

---

## Schritt 3: Resend Account erstellen

1. Gehe zu: https://resend.com/signup
2. Registriere dich (kostenlos)
3. Bestätige deine E-Mail
4. Gehe zu **API Keys** und erstelle einen neuen Key
5. **Kopiere den API Key** (zeigt sich nur einmal!)

---

## Schritt 4: Domain in Resend verifizieren

### Option A: Eigene Domain (empfohlen)
1. Gehe zu **Domains** in Resend
2. Klicke **Add Domain**
3. Gib `oezdens.com` ein
4. Kopiere die DNS Records
5. Füge sie in Strato DNS hinzu:
   - **TXT Record**: `_resend` mit dem Wert von Resend
   - **MX Record**: falls angegeben
   - **DKIM Records**: alle 3 CNAME Records

**Warte 5-10 Minuten**, dann klicke in Resend auf **Verify**

### Option B: Resend Test-Domain (schneller Start)
Nutze erstmal `onboarding@resend.dev` zum Testen (funktioniert sofort, aber E-Mails könnten im Spam landen)

---

## Schritt 5: Secrets in Supabase setzen

```powershell
# Setze Resend API Key
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxxx

# Prüfe ob gesetzt
supabase secrets list
```

---

## Schritt 6: Edge Function deployen

```powershell
# Deploy die Funktion
supabase functions deploy send-booking-email

# Teste die Funktion
supabase functions invoke send-booking-email --data '{"booking_id":"test-id"}'
```

---

## Schritt 7: Frontend URL anpassen

Die Funktion ist jetzt unter dieser URL erreichbar:
```
https://vvkuqjbkstecjbgttjjh.supabase.co/functions/v1/send-booking-email
```

**Bereits erledigt!** Das Frontend ruft diese URL automatisch auf.

---

## Schritt 8: Testen

1. Gehe auf deine Website: https://oezdens.com
2. Mache eine Test-Buchung
3. Prüfe dein E-Mail-Postfach
4. Prüfe auch `info@oezdens.com` (BCC)

---

## Troubleshooting

### Funktion deployed nicht
```powershell
# Prüfe ob eingeloggt
supabase projects list

# Neu linken
supabase link --project-ref vvkuqjbkstecjbgttjjh
```

### E-Mail kommt nicht an
1. Prüfe Logs:
   ```powershell
   supabase functions logs send-booking-email
   ```
2. Prüfe Resend Dashboard > Logs
3. Schaue im Spam-Ordner

### Domain nicht verifiziert
- Warte 10-15 Minuten nach DNS-Änderung
- Prüfe DNS mit: https://mxtoolbox.com/SuperTool.aspx
- Nutze erstmal `onboarding@resend.dev` zum Testen

---

## Kosten

- **Supabase**: Kostenlos (500 Edge Function Aufrufe/Monat)
- **Resend**: Kostenlos (100 E-Mails/Tag = 3000/Monat)

Mehr als genug für dein Buchungssystem! 🎉

---

## Was ist besser als PHP/Strato?

| Feature | Supabase + Resend | PHP + Strato |
|---------|-------------------|--------------|
| Setup-Zeit | 10 Minuten | 30+ Minuten |
| Dateien hochladen | Keine | Viele (PHP, PHPMailer, config) |
| Sicherheit | Automatisch | Manuell (config.php außerhalb webroot) |
| Monitoring | Dashboard + Logs | Eigenes Logging |
| Kosten | Kostenlos | Kostenlos |
| E-Mail Zustellung | Sehr gut (Resend Infrastruktur) | Mittel (Strato SMTP) |

---

## Nächste Schritte

1. Installiere Supabase CLI
2. Erstelle Resend Account
3. Deploy die Edge Function
4. Teste eine Buchung

**Los geht's!** 🚀
