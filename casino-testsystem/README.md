# Casino Testsystem - Lokal + Render

Stack:

- Frontend: React + TypeScript (Vite)
- Backend: Node.js + Express
- Datenbank: PostgreSQL (Render)
- Deployment: Render mit Auto-Deploy ueber GitHub

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

In Render bei PostgreSQL (Shell/Console) oder in einem SQL-Tool ausfuehren:

```sql
\i db_init.sql
```

Falls dein SQL-Tool `\i` nicht unterstuetzt, einfach den Inhalt aus [db_init.sql](db_init.sql) direkt ausfuehren.

## 4. Backend auf Render deployen (Web Service)

Render Einstellungen:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Environment Variables:

- `DATABASE_URL` = Internal Database URL von Render PostgreSQL
- `NODE_ENV` = `production`
- `FRONTEND_URL` = `https://DEIN-FRONTEND.onrender.com`

Hinweis: Das Backend nutzt in Produktion SSL automatisch ueber `NODE_ENV=production`.

## 5. Frontend auf Render deployen (Static Site)

Render Einstellungen:

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Environment Variable:

- `VITE_API_URL` = `https://DEIN-BACKEND.onrender.com`

Nach dem Deploy stellt Render die eigentliche Produktions-URL bereit, zum Beispiel `https://DEIN-FRONTEND.onrender.com`.
Diese URL ist nicht lokal fest eingebaut, sondern entsteht erst nach dem Deploy des Static Site Services.

Im lokalen Entwicklungsmode bleibt die URL weiterhin `http://localhost:5173`.

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
