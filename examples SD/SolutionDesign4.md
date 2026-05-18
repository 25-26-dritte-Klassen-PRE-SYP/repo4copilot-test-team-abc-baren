# Solution Design - Auktionsplattform

## 1. Übersicht

Dieses Solution Design beschreibt die technische Architektur und Implementierungsstrategie für die geplante Auktionsplattform. Es basiert auf den Anforderungen aus dem Product Goal und adressiert sowohl funktionale als auch nicht-funktionale Anforderungen.

---

## 2. Systemarchitektur

### 2.1 High-Level-Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │   Web Frontend   │  │   Mobile App     │                 │
│  │   (React/Vue)    │  │   (React Native) │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
└───────────┼──────────────────────┼──────────────────────────┘
            │                      │
     ┌──────▼──────────────────────▼───────┐
     │      API Gateway / Load Balancer    │
     │       (NGINX / AWS ALB)             │
     └──────┬───────────────────────────┬──┘
            │                           │
┌───────────▼──────────────────────────▼────────────────────┐
│              Microservices Layer                           │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐    │
│  │   Auth       │ │   Auction    │ │   Bid          │    │
│  │   Service    │ │   Service    │ │   Service      │    │
│  └──────────────┘ └──────────────┘ └────────────────┘    │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐    │
│  │   Search     │ │ Notification │ │   Payment      │    │
│  │   Service    │ │   Service    │ │   Service      │    │
│  └──────────────┘ └──────────────┘ └────────────────┘    │
└───────────┬──────────────────────────────────────────────┘
            │
    ┌───────┼──────────┬─────────────┬──────────┐
    │       │          │             │          │
┌───▼──┐ ┌──▼────┐ ┌──▼────┐ ┌──────▼──┐ ┌─────▼─┐
│ DB   │ │Redis  │ │Event  │ │File     │ │Message│
│(PG)  │ │Cache  │ │Bus    │ │Storage  │ │Queue  │
└──────┘ └───────┘ └───────┘ └─────────┘ └───────┘
```

### 2.2 Deployment-Modell

- **Containerisierung:** Docker + Kubernetes (K8s)
- **Cloud-Provider:** AWS / Azure / Google Cloud (Multi-Cloud ready)
- **Skalierung:** Horizontal skalierbar, Auto-Scaling aktiviert
- **Regionen:** Multi-Region-Setup für Disaster Recovery

---

## 3. Technologie-Stack

### Backend
| Layer | Technologie | Begründung |
|-------|-------------|-----------|
| **Runtime** | Node.js 18+ LTS / Python 3.11 | Schnelle Entwicklung, Event-driven |
| **Framework** | Express.js / FastAPI | REST API Framework |
| **Real-Time** | WebSocket / Socket.io | Echtzeit-Gebote |
| **Database** | PostgreSQL 14+ | ACID, Transaktionen, Skalierbarkeit |
| **Cache** | Redis 7+ | Session, Bid-Caching, Rate-Limiting |
| **Search** | Elasticsearch 8+ | Schnelle Such- und Filterfunktion |
| **Message Queue** | RabbitMQ / Kafka | Asynchrone Verarbeitung |
| **Auth** | JWT + OAuth 2.0 | Sicherheit, Skalierbarkeit |

### Frontend
| Layer | Technologie | Begründung |
|-------|-------------|-----------|
| **Web** | React 18+ / Vue 3 | Progressive, reaktive UI |
| **State Management** | Redux / Pinia | Vorhersehbare State |
| **Real-Time Updates** | Socket.io Client | Live-Gebote |
| **CSS** | TailwindCSS | Utility-first CSS |
| **Build Tool** | Vite / Webpack 5 | Schnelle Builds |

### DevOps & Monitoring
| Tool | Zweck |
|------|-------|
| **CI/CD** | GitHub Actions / GitLab CI |
| **Container Registry** | Docker Hub / ECR / ACR |
| **Monitoring** | Prometheus + Grafana |
| **Logging** | ELK Stack (Elasticsearch, Logstash, Kibana) |
| **APM** | DataDog / New Relic |
| **IaC** | Terraform / CloudFormation |

---

## 4. Kernkomponenten und Services

### 4.1 Authentication Service

**Verantwortung:** Benutzerverwaltung, Authentifizierung, Autorisierung

**Funktionen:**
- Benutzerregistrierung und E-Mail-Verifikation
- Login mit JWT-Tokens (Access + Refresh)
- OAuth 2.0 Integration (Google, Facebook)
- 2FA (TOTP, SMS)
- Role-Based Access Control (RBAC)

**Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
POST   /api/auth/2fa/enable
POST   /api/auth/verify-email
```

**Sicherheit:**
- Passwort-Hashing (bcrypt mit salt)
- Tokens in HttpOnly Cookies speichern
- CORS-Policies streng konfigurieren
- Rate-Limiting auf Login-Endpoints

---

### 4.2 Auction Service

**Verantwortung:** Verwaltung von Auktionen (CRUD, Status)

**Funktionen:**
- Auktion erstellen, bearbeiten, löschen
- Status-Verwaltung (Draft, Active, Closed, Disputed)
- Endzeitpunkt-Verwaltung mit Countdown
- Auktions-Dashboard für Verkäufer
- Bildverwaltung und Upload

**Endpoints:**
```
POST   /api/auctions                 # Neue Auktion
GET    /api/auctions                 # Auktionsliste
GET    /api/auctions/:id             # Details
PUT    /api/auctions/:id             # Bearbeiten
DELETE /api/auctions/:id             # Löschen
POST   /api/auctions/:id/publish     # Veröffentlichen
POST   /api/auctions/:id/close       # Abschließen
GET    /api/auctions/my-auctions     # Meine Auktionen
POST   /api/auctions/:id/images      # Bilder hochladen
```

**Datenbankschema:**
```sql
CREATE TABLE auctions (
  id UUID PRIMARY KEY,
  seller_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_price DECIMAL(10, 2),
  current_price DECIMAL(10, 2),
  status ENUM('draft', 'active', 'closed', 'disputed'),
  created_at TIMESTAMP,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  category_id UUID,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE auction_images (
  id UUID PRIMARY KEY,
  auction_id UUID NOT NULL,
  image_url VARCHAR(512),
  display_order INT,
  FOREIGN KEY (auction_id) REFERENCES auctions(id)
);
```

---

### 4.3 Bid Service ⚡ (Kritische Komponente)

**Verantwortung:** Echtzeit-Gebotsabgabe und Verwaltung

**Anforderung:** < 100ms Latenz, Echtzeit-Updates für alle Teilnehmer

**Architektur:**

```
Bieter-Client
    │
    ├─► WebSocket Connect ──► Bid Service
    │                           │
    │                           ├─► Validierung
    │                           │   (Gebot > aktuell)
    │                           │
    │                           ├─► Redis Cache Update
    │                           │   (Live-Gebot)
    │                           │
    │                           ├─► Event Bus
    │                           │   (BidPlaced Event)
    │                           │
    │                           └─► PostgreSQL Write
    │                               (Persistierung)
    │
    └─► Broadcast zu allen
        WebSocket-Clients
```

**Funktionen:**
- Gebot validieren (Höhe, Timing, Bieter-Berechtigung)
- Echtzeit-Updates via WebSocket
- Automatische Bid Increments
- Snipe-Prevention (Auktion verlängern bei letzten Geboten)
- Höchstbietenden-Tracking

**Endpoints & Events:**
```
WebSocket Events:
- bid:place              # Bieter: Gebot abgeben
- bid:accepted           # Server: Gebot akzeptiert
- bid:rejected           # Server: Gebot abgelehnt
- bid:updated            # Server: Neuer Höchstbietender
- bid:snipe_prevention   # Server: Auktion verlängert
- auction:closing_soon   # Server: Auktion endet in 60s
```

**Optimierungen für Performance:**

1. **Redis Caching:**
   - Key: `auction:{auctionId}:current_bid`
   - TTL: Auktionsdauer + 5 Min
   - Struktur: `{bidderId, amount, timestamp}`

2. **Batch Writes:**
   - Gruppiere Gebote pro 100ms
   - Schreibe in DB via Bulk-Insert

3. **Connection Pooling:**
   - Max 500 Connections pro Service-Instanz
   - Load-Balancing via Round-Robin

4. **Circuit Breaker:**
   - Fallback zu HTTP-Polling bei WebSocket-Fehler
   - Auto-Reconnect mit Exponential Backoff

**Datenbankschema:**
```sql
CREATE TABLE bids (
  id UUID PRIMARY KEY,
  auction_id UUID NOT NULL,
  bidder_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  FOREIGN KEY (auction_id) REFERENCES auctions(id),
  FOREIGN KEY (bidder_id) REFERENCES users(id)
);

CREATE INDEX idx_bids_auction_amount 
ON bids(auction_id, amount DESC);

CREATE INDEX idx_bids_auction_timestamp 
ON bids(auction_id, timestamp DESC);
```

---

### 4.4 Search Service

**Verantwortung:** Suchfunktion und Filterung

**Funktionen:**
- Volltextsuche nach Titel & Beschreibung
- Filter nach Kategorie, Preisspanne, Zustand
- Sortierung nach Preis, Endzeitpunkt, Neu
- Auto-Complete für Kategorien
- Saved Searches

**Elasticsearch-Mapping:**
```json
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard"
      },
      "category": {
        "type": "keyword"
      },
      "price_range": {
        "type": "double_range"
      },
      "status": {
        "type": "keyword"
      },
      "end_time": {
        "type": "date"
      },
      "created_at": {
        "type": "date"
      }
    }
  }
}
```

**Endpoints:**
```
GET /api/search?q=laptop&category=electronics&price_min=100&price_max=1000
GET /api/search/suggestions?q=lap
GET /api/search/saved
POST /api/search/saved
```

---

### 4.5 Notification Service

**Verantwortung:** In-App, Email und Push-Benachrichtigungen

**Trigger-Events:**
- ✅ Neues Gebot abgegeben (Real-time)
- ✅ Überboten worden (Real-time + Email)
- ✅ Auktion endet in 1 Stunde (Scheduled)
- ✅ Auktion beendet (Sofort)
- ✅ Zahlungsbestätigung (Sofort)

**Implementierung:**

```
Event Bus
    │
    ├─► Notification Service
    │       │
    │       ├─► WebSocket Push (In-App)
    │       ├─► Email Queue (SendGrid)
    │       └─► Push Notifications (Firebase Cloud Messaging)
    │
```

**Endpoints:**
```
GET    /api/notifications
GET    /api/notifications/unread-count
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
GET    /api/notifications/preferences
PUT    /api/notifications/preferences
```

---

### 4.6 Payment Service

**Verantwortung:** Zahlungsabwicklung und Transaktionsmanagement

**Integration:**
- Stripe / PayPal als PSP
- Webhook-Handling für Zahlungsbestätigung
- Invoice-Generierung

**Funktionen:**
- Zahlungsinitiierung
- Webhook-Verarbeitung
- Transaktions-Historie
- Refunds

**Endpoints:**
```
POST   /api/payments/create-intent     # Zahlungs-Intent erstellen
POST   /api/payments/confirm           # Zahlung bestätigen
POST   /api/payments/webhook           # Webhook (PSP)
GET    /api/payments/history           # Transaktions-Historie
POST   /api/payments/:id/refund        # Rückerstattung
```

---

## 5. Nicht-funktionale Anforderungen - Implementierung

### 5.1 Crash-Rate < 0,5%

**Strategien:**

1. **Fehlerbehandlung:**
   - Global Error Handler auf allen Services
   - Graceful Degradation (Fallbacks)
   - Circuit Breaker Pattern (z.B. Resilience4j)

2. **Testing:**
   - Unit Tests (Jest): Ziel > 80% Coverage
   - Integration Tests (Supertest)
   - Load Testing (Apache JMeter, k6)
   - Chaos Engineering (Gremlin)

3. **Monitoring & Alerting:**
   ```
   Prometheus Metrics:
   - error_rate (< 0.1%)
   - crash_count
   - memory_usage
   - cpu_usage
   - response_time_p95 (< 500ms)
   ```

4. **Deployment Strategy:**
   - Blue-Green Deployments
   - Canary Releases (5% → 25% → 100%)
   - Automatic Rollback bei Errors

5. **Infrastructure:**
   - Multi-AZ Deployment
   - Auto-Scaling bei CPU > 70%
   - Database Replication (Master-Slave)
   - Redis Cluster für Caching

---

### 5.2 Benutzbarkeit (SUS Score > 70)

**Maßnahmen:**

1. **Usability Testing:**
   - System Usability Scale (SUS) Umfrage nach Release
   - A/B Testing für neue Features
   - Heatmaps & Session Recording (Hotjar)

2. **UI/UX Richtlinien:**
   - Mobile-First Design
   - Accessibility (WCAG 2.1 Level AA)
   - Konsistente Komponenten-Bibliothek
   - Klare Fehler-Meldungen

3. **Performance:**
   - Erste Contentful Paint (FCP): < 1.5s
   - Time to Interactive (TTI): < 3.5s
   - Cumulative Layout Shift (CLS): < 0.1

---

### 5.3 Zuverlässigkeit & Sicherheit

**Sicherheitsmaßnahmen:**

1. **Authentifizierung:**
   - JWT mit kurzer Gültigkeitsdauer (15 min)
   - Refresh-Tokens in HttpOnly Cookies
   - CSRF-Protection via SameSite Cookies

2. **Datenbank-Sicherheit:**
   - Verschlüsselte Verbindungen (SSL/TLS)
   - Row-Level Security (RLS) in PostgreSQL
   - Prepared Statements gegen SQL-Injection

3. **API-Sicherheit:**
   - Rate-Limiting: 100 Requests/Minute pro IP
   - Input Validation & Sanitization
   - CORS-Whitelist
   - API Keys für externe Services

4. **Datenschutz (DSGVO):**
   - Daten-Anonymisierung nach 12 Monaten Inaktivität
   - Recht auf Vergessenwerden (GDPR Article 17)
   - Datenverschlüsselung at-rest (AES-256)

5. **Infrastruktur:**
   - Web Application Firewall (WAF)
   - DDoS-Protection
   - Intrusion Detection System (IDS)
   - Regelmäßige Security Audits & Penetration Tests

---

## 6. Database Design

### 6.1 ER-Diagramm

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ created_at  │
└──────┬──────┘
       │
       ├─► auctions
       │   ├─ seller_id (FK)
       │   ├─ status
       │   └─ ...
       │
       └─► bids
           ├─ bidder_id (FK)
           └─ ...
```

### 6.2 Migrations (Flyway / Alembic)

```sql
-- migration_001_initial_schema.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weitere Migrationen...
```

---

## 7. API-Design

### 7.1 RESTful Conventions

- **Versioning:** `/api/v1/...`
- **Pagination:** `?page=1&limit=20`
- **Filtering:** `?status=active&category=electronics`
- **Sorting:** `?sort=-created_at` (- für DESC)

### 7.2 Response Format

```json
{
  "success": true,
  "data": {
    "id": "123",
    "title": "Vintage Laptop"
  },
  "meta": {
    "timestamp": "2026-05-18T10:30:00Z",
    "version": "1.0"
  }
}
```

### 7.3 Error Handling

```json
{
  "success": false,
  "error": {
    "code": "AUCTION_NOT_FOUND",
    "message": "Die Auktion existiert nicht",
    "details": {
      "auction_id": "123"
    }
  },
  "statusCode": 404
}
```

---

## 8. CI/CD Pipeline

### 8.1 GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run Linter
        run: npm run lint
      
      - name: Run Tests
        run: npm run test:coverage
      
      - name: SonarQube Scan
        uses: SonarSource/sonarcloud-github-action@master
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker Image
        run: docker build -t auction-app:${{ github.sha }} .
      
      - name: Push to Registry
        run: docker push auction-app:${{ github.sha }}
  
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: kubectl set image deployment/auction-app auction-app=auction-app:${{ github.sha }}
```

---

## 9. Monitoring & Observability

### 9.1 Prometheus Metrics

```python
# Key Metrics
http_requests_total{method="POST", endpoint="/api/bids", status="200"}
http_request_duration_seconds{endpoint="/api/bids", quantile="0.95"}
auction_active_count
bids_per_second
websocket_active_connections
database_connection_pool_size
redis_memory_usage_bytes
```

### 9.2 Grafana Dashboards

- **System Dashboard:** CPU, Memory, Disk, Network
- **Application Dashboard:** Request Rate, Error Rate, Latency
- **Business Dashboard:** Auktionen aktiv, Gebote/Min, GMV
- **Alerts:** Crash Rate > 0.5%, Error Rate > 1%, Latency > 1s

### 9.3 Logging (ELK Stack)

```json
{
  "timestamp": "2026-05-18T10:30:00.123Z",
  "level": "ERROR",
  "service": "bid-service",
  "message": "Bid validation failed",
  "error": {
    "code": "INVALID_BID_AMOUNT",
    "details": "Bid must be higher than current"
  },
  "context": {
    "auction_id": "abc123",
    "bidder_id": "user456",
    "trace_id": "xyz789"
  }
}
```

---

## 10. Security Architecture

### 10.1 Network Security

```
┌─────────────────────────────────────┐
│       AWS WAF (Web ACL)             │
│  - SQL Injection Protection         │
│  - XSS Protection                   │
│  - DDoS Rate-Based Rules            │
└────────────────┬────────────────────┘
                 │
        ┌────────▼────────┐
        │   AWS Shield    │
        │ (DDoS Protection│
        └────────┬────────┘
                 │
    ┌────────────▼────────────┐
    │ Application Load        │
    │ Balancer (ALB)          │
    │ - SSL/TLS Termination   │
    │ - Horizontal Scaling    │
    └────────────┬────────────┘
                 │
         ┌───────▼────────┐
         │ ECS / Kubernetes│
         │ (Services)      │
         └────────────────┘
```

### 10.2 Data Encryption

| Ebene | Methode |
|-------|---------|
| **In Transit** | TLS 1.3 (HTTPS) |
| **At Rest** | AES-256 (Database) |
| **In Memory** | Sensitive Data nur temporär halten |
| **Backups** | Verschlüsselt in S3 (AES-256) |

---

## 11. Disaster Recovery & Backup

### 11.1 RTO & RPO Ziele

| Komponente | RTO | RPO |
|-----------|-----|-----|
| **Datenbank** | 15 min | 5 min |
| **Services** | 5 min | 0 min (Stateless) |
| **Frontend** | 1 min | 0 min (CDN Cache) |

### 11.2 Backup-Strategie

```
Tägliche Backups:
- 10:00 UTC: Full Backup → S3
- 14:00 UTC: Incremental Backup → S3
- 18:00 UTC: Full Backup → Glacier (Archiv)

Retention Policy:
- 7 Tage: S3 Standard
- 30 Tage: S3 Infrequent Access
- 1+ Jahre: Glacier
```

### 11.3 Failover-Prozedur

1. **Monitoring** erkennt Primary Region als Down
2. **Automatic Failover** zu Secondary Region (< 5 min)
3. **DNS Update** (Route53 Health Checks)
4. **Data Restore** aus jüngsten Backup
5. **Service Verification** & Smoke Tests

---

## 12. Skalierungs-Strategie

### 12.1 Horizontale Skalierung

**Services:**
```
┌─────────────────────────┐
│ Load Balancer (NGINX)   │
├─────────────────────────┤
│ Instance 1: bid-service │
│ Instance 2: bid-service │
│ Instance 3: bid-service │
└─────────────────────────┘
```

**Auto-Scaling Policy:**
- Scale-Up: CPU > 70% für 3 min
- Scale-Down: CPU < 30% für 10 min
- Min Instances: 2 (HA), Max Instances: 10

### 12.2 Datenbankoptimierungen

**Read Replicas:**
```
Primary DB (Write)
    ├─► Replica 1 (Read)
    ├─► Replica 2 (Read)
    └─► Replica 3 (Read)
```

**Sharding (zukünftig):**
```
Shard 1: auctions 0-3M
Shard 2: auctions 3-6M
Shard 3: auctions 6-9M
```

---

## 13. Development Workflow

### 13.1 Git Strategy (Git Flow)

```
main (Production)
  ├─ release/v1.0.0
  │  └─ hotfix/critical-bug
  └─ develop (Staging)
     └─ feature/new-feature
        └─ bugfix/issue-123
```

### 13.2 Code Review Checklist

- [ ] Tests mit > 80% Coverage
- [ ] Security Review durchgeführt
- [ ] Performance-Impact analysiert
- [ ] Database Migrations vorhanden
- [ ] Dokumentation aktualisiert
- [ ] Keine Breaking Changes

---

## 14. Testing-Strategie

### 14.1 Test Pyramid

```
        ┌─────────────────┐
        │   E2E Tests     │  (10%)
        │  (Cypress)      │
        ├─────────────────┤
        │ Integration     │  (30%)
        │ Tests           │
        │ (Supertest)     │
        ├─────────────────┤
        │ Unit Tests      │  (60%)
        │ (Jest)          │
        └─────────────────┘
```

### 14.2 Testing-Standards

| Typ | Tool | Ziel | Häufigkeit |
|-----|------|------|-----------|
| **Unit** | Jest | > 80% Coverage | Jeden Commit |
| **Integration** | Supertest | Kritische Flows | Pre-merge |
| **E2E** | Cypress | Happy Paths | Nightly |
| **Load** | k6 / JMeter | P95 < 500ms | Weekly |
| **Security** | OWASP ZAP | Vulnerabilities | Monthly |

---

## 15. Deployment-Roadmap

### Phase 1: MVP (Woche 1-4)
- ✅ Auth Service
- ✅ Auction Service (Basic CRUD)
- ✅ Bid Service (Echtzeit-Gebote)
- ✅ Web Frontend
- ✅ Docker + Kubernetes Setup

### Phase 2: Enhancement (Woche 5-8)
- ✅ Search Service (Elasticsearch)
- ✅ Notification Service
- ✅ Payment Integration
- ✅ Mobile App

### Phase 3: Optimization (Woche 9-12)
- ✅ Monitoring & Alerting
- ✅ Performance Tuning
- ✅ Security Hardening
- ✅ Load Testing

### Phase 4: Advanced Features (Woche 13+)
- ✅ Machine Learning (Empfehlungen)
- ✅ Multi-Language Support
- ✅ API für Dritte
- ✅ Advanced Analytics

---

## 16. Dokumentation & Runbooks

### 16.1 Technische Dokumentation
- API Documentation (OpenAPI/Swagger)
- Architecture Decision Records (ADRs)
- Database Schema Documentation
- Deployment & Operations Guide

### 16.2 Runbooks (auf Wiki/Confluence)
- "Neue Service deployen"
- "Database Migration durchführen"
- "Incident Response"
- "Performance-Probleme debuggen"

---

## 17. Kosten-Schätzung (AWS)

| Komponente | Geschätzte Kosten/Monat |
|-----------|------------------------|
| **ECS/Kubernetes** | $500-1000 |
| **RDS PostgreSQL** | $300-600 |
| **ElastiCache Redis** | $150-300 |
| **Elasticsearch** | $200-400 |
| **CDN (CloudFront)** | $100-200 |
| **S3 (Speicher)** | $50-150 |
| **Route53, WAF, Shield** | $100-150 |
| **Monitoring, Logging** | $200-300 |
| **Total** | **~$1600-3100/Monat** |

---

## 18. Erfolgskriterien

### Funktional
- ✅ Echtzeit-Gebote mit < 100ms Latenz
- ✅ Such-/Filterfunktion performant (< 200ms)
- ✅ Auktionsverwaltung intuitive UI

### Nicht-funktional
- ✅ Crash-Rate < 0,5%
- ✅ Uptime > 99,9% (< 43 min/Monat Downtime)
- ✅ SUS Score > 70 (Usability)
- ✅ P95 Response Time < 500ms
- ✅ Database Availability > 99,95%

### Business
- ✅ 10.000+ aktive Auktionen
- ✅ 1.000+ gleichzeitige Bieter
- ✅ 100+ Gebote pro Minute
- ✅ < 0,5% Payment Failure Rate

---

## 19. Zusätzliche Ressourcen

- **OpenAPI Spec:** `/docs/api-specification.yaml`
- **Infrastructure as Code:** `/terraform/` Verzeichnis
- **Deployment Scripts:** `/scripts/deploy.sh`
- **Monitoring Dashboards:** Grafana-JSON im Repo

---

## 20. Kontakt & Support

- **Tech Lead:** [Name]
- **Architecture Questions:** [Slack Channel]
- **Incident Support:** [On-Call Rotation]

---

**Letzte Aktualisierung:** 2026-05-18  
**Version:** 1.0  
**Status:** Produktionsreif
