# Schnellstart — Casino Testsystem (lokal)

Kurze Anleitung, um Backend und Frontend lokal zu starten und das Frontend im Browser zu öffnen.

Voraussetzungen
- Node.js (>=18) und `npm` installiert
- Optional: PostgreSQL wenn du die DB lokal betreiben willst

1) Abhängigkeiten installieren

```powershell
cd casino-testsystem
npm run install:all
```

2) Environment-Datei anlegen

Eine Kopie von `example.env` anlegen und nach Bedarf anpassen:

```powershell
cd casino-testsystem
Copy-Item example.env .env
```

Wichtige Variablen (in `casino-testsystem/.env`):

- `DATABASE_URL` — PostgreSQL-Verbindungsstring (lokal oder Render)
- `PORT` — Backend-Port (Standard: `3000`)
- `VITE_API_URL` — API-URL für das Frontend (z.B. `http://localhost:3000`)

3) Backend starten

In einem Terminal:

```powershell
cd casino-testsystem\backend
npm run dev
```

Prüfen: Backend erreichbar unter `http://localhost:3000`

4) Frontend starten

In einem zweiten Terminal:

```powershell
cd casino-testsystem\frontend
npm run dev
```

Standard-Vite-URL: `http://localhost:5173` — Seite im Browser öffnen.

5) Datenbank-Schema (optional lokal)

Die Datei `db_init.sql` enthält das Schema. In psql ausführen oder im SQL-Tool:

```sql
-- Beispiel (psql)
\i db_init.sql
```

Troubleshooting
- Port-Konflikt: anderes Programm auf Port 5173/3000 beenden oder Ports anpassen
- CORS/API-Fehler: `VITE_API_URL` und `FRONTEND_URL` in `.env` prüfen
- Abhängigkeiten: `npm install` in `frontend`/`backend` manuell ausführen

Zusätzliche Hinweise
- Frontend-Skripte stehen in `casino-testsystem/frontend/package.json` (`dev`, `build`, `preview`).
- Vite-Config: [casino-testsystem/frontend/vite.config.ts](casino-testsystem/frontend/vite.config.ts#L1-L20)

Wenn du möchtest, starte ich jetzt den Dev-Server für das Frontend in deinem Workspace.
