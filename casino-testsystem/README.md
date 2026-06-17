# Casino Testsystem - Lokal + Vercel

Stack:

- Frontend: React + TypeScript (Vite)
- Backend: Node.js + Express
- Datenbank: PostgreSQL (extern)
- Deployment: Vercel mit GitHub Auto-Deploy

## Projektstruktur

```text
casino-testsystem
|- frontend
`- backend
```

## Einmalig alles installieren (global)

```powershell
cd casino-testsystem
npm run install:all
```

Das installiert alle noetigen Pakete in `backend` und `frontend`.

## 1. Backend lokal starten

```powershell
cd casino-testsystem
Copy-Item example.env .env
cd backend
npm run dev
```

Dann in der globalen `.env` (im Ordner `casino-testsystem`) die Werte anpassen:

```env
DATABASE_URL=postgresql://USER:PASSWORT@localhost:5432/DEINE_DB
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

Check:

- `http://localhost:3000` muss `Backend laeuft` anzeigen.

## 2. Frontend lokal starten

In einem zweiten Terminal:

```powershell
cd casino-testsystem/frontend
npm run dev
```

Check:

- `http://localhost:5173`

## 3. Datenbanktabelle erstellen

Die Datei [db_init.sql](db_init.sql) legt das benoetigte Schema an.

In einer PostgreSQL-Instanz (Shell/Console) oder in einem SQL-Tool ausfuehren:

```sql
\i db_init.sql
```

Falls dein SQL-Tool `\i` nicht unterstuetzt, einfach den Inhalt aus [db_init.sql](db_init.sql) direkt ausfuehren.

## 4. Deployment auf Vercel

Vercel erwartet im Root des Repositories eine `vercel.json`, wenn mehrere Services (Frontend + Backend) vorhanden sind. Dieses Repository ist bereits vorbereitet:

- Frontend: `frontend` (Vite) — wird als Static Site gebaut (Ausgabe: `dist`).
- Backend: Serverless-API unter `api/*`, die das bestehende Express-App verwendet.

Vercel Einstellungen (GitHub Auto-Deploy):

- Repository-Root: das Projekt-Repository
- Build: Vercel führt die Builds entsprechend `vercel.json` aus

Environment Variables (in Vercel Dashboard unter Project → Settings → Environment Variables setzen):

- `DATABASE_URL` = Verbindungsstring zur PostgreSQL-Datenbank
- `NODE_ENV` = `production`
- `FRONTEND_URL` = `https://<dein-vercel-frontend>.vercel.app`
- `VITE_API_URL` = `https://<dein-vercel-project>.vercel.app/api`

Hinweis: Vercel bietet keine eingebaute Datenbank wie Render; nutze eine externe Postgres-Instanz (z. B. DigitalOcean, Neon, Railway, Supabase) und setze `DATABASE_URL` entsprechend.

## 6. GitHub CI/CD (Auto-Deploy)

Wenn GitHub Repo mit Render verknuepft ist, deployed Render nach jedem Push automatisch neu.

```powershell
git add .
git commit -m "Update"
git push
```

## Globale .env vs Render

- Lokal: Eine globale Datei `casino-testsystem/.env` reicht fuer Backend und Frontend.
- Render: Backend und Frontend laufen als getrennte Services. Deshalb setzt du die Variablen in Render weiterhin pro Service.
- Optional in Render: Du kannst Environment Groups nutzen, um gemeinsame Werte zentral zu verwalten.

## Troubleshooting

- DB-Verbindung scheitert: `DATABASE_URL` pruefen.
- CORS-Fehler im Browser: `FRONTEND_URL` im Backend auf die echte Frontend-URL setzen.
- Frontend erreicht Backend nicht: `VITE_API_URL` pruefen und Frontend neu deployen.
