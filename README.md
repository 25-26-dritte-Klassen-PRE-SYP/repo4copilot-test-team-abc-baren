# Gaming Platform MVP

Eine digitale Glücksspiel-Plattform mit verschiedenen Spielen basierend auf dem Solution Design v1.

## 🎮 Features

- **Mehrere Spieltypen**: Kartenspiele, Würfelspiele, Spielautomaten, Roulette
- **Responsive Web-Anwendung**: React.js mit TypeScript und Tailwind CSS
- **RESTful API**: Express.js Backend
- **Real-time Spiele**: Sofortige Spielergebnisse
- **Benutzer-Statistiken**: Verfolgung von Spiel-Ergebnissen

## 🛠️ Tech-Stack

### Frontend
- **React.js 18** mit TypeScript
- **Tailwind CSS** für Styling
- **TanStack Query** für Daten-Caching
- **Vite** als Build-Tool
- **React Router** für Navigation

### Backend
- **Node.js** mit Express
- **TypeScript** für Typsicherheit
- **PostgreSQL** für Datenspeicherung
- **Redis** für Caching

### Infrastructure
- **Docker** für Containerisierung
- **Docker Compose** für lokale Entwicklung
- **GitHub Actions** für CI/CD

## 📋 Voraussetzungen

- Docker & Docker Compose
- oder Node.js 18+ und PostgreSQL 15

## 🚀 Quickstart mit Docker Compose

```bash
# Repository klonen
git clone <repo-url>
cd repo4copilot-test-team-abc-baren

# Services starten
docker-compose up --build

# Anwendung öffnen
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000/api
```

## 🏗️ Projekt-Struktur

```
.
├── backend/                 # Express API
│   ├── src/
│   │   ├── index.ts        # Server-Einstiegspunkt
│   │   ├── models/         # Datentypen
│   │   ├── services/       # Business-Logik
│   │   ├── routes/         # API-Routen
│   │   └── middleware/     # Express Middleware
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React App
│   ├── src/
│   │   ├── components/    # React Komponenten
│   │   ├── pages/         # Seiten
│   │   ├── hooks/         # Custom Hooks
│   │   ├── api/           # API-Client
│   │   └── store/         # Redux Store
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml     # Docker Compose Konfiguration
└── .github/workflows/     # CI/CD Pipelines
```

## 📚 API-Endpoints

### Spiele
- `GET /api/games` - Alle Spiele auflisten
- `GET /api/games/:id` - Spiel nach ID abrufen
- `POST /api/games` - Neues Spiel erstellen

### Buchungen (Spielergebnisse)
- `GET /api/bookings/user/:userId` - Buchungen eines Benutzers
- `GET /api/bookings/:id` - Buchung nach ID abrufen
- `POST /api/bookings` - Neues Spiel spielen (Buchung erstellen)
- `GET /api/bookings/stats/:userId` - Benutzer-Statistiken

## 🎮 Verfügbare Spiele

1. **High-Low Card Game** - Erraten Sie, ob die nächste Karte höher oder niedriger ist
2. **Dice Roll** - Würfeln Sie und wetten Sie auf das Ergebnis
3. **Slots Machine** - Klassischer Spielautomat
4. **European Roulette** - Roulette-Tisch

## 🧪 Testen

```bash
# Backend Tests
cd backend
npm test

# Frontend Tests
cd frontend
npm test
```

## 📖 Entwicklung

### Backend starten (nur entwicklung)
```bash
cd backend
npm install
npm run dev
```

### Frontend starten (nur entwicklung)
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Konfiguration

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://gaming_user:password@localhost:5432/gaming_db
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 📝 Lizenz

MIT License

## 📧 Support

Bei Fragen oder Problemen bitte ein Issue erstellen.
