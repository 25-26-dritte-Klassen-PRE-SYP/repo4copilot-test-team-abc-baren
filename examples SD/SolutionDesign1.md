# Solution Design: Digitales Notenverwaltungssystem

Dieses Dokument beschreibt das technische Solution Design für das neue Notenverwaltungssystem. Es basiert direkt auf den Anforderungen, Zielen (Z) und nicht-funktionalen Anforderungen (NFA) des Product Goals.

---

## 1. System- & Softwarearchitektur
Um eine hohe Usability (NFA Benutzbarkeit) und optimale Performance bei Spitzenlasten zu garantieren, wird das System als moderne Web-Applikation nach dem Client-Server-Prinzip umgesetzt.

### 1.1 Frontend (Client-Layer)
* **Technologie:** Single-Page-Application (SPA) mit **React** oder **Vue.js**.
* **UI-Framework:** Tailwind CSS für ein responsives, mobiles Design (wichtig für die Schüler-Startseite) und barrierefreie Bedienung für Lehrer.
* **State-Management:** Client-seitiges Caching (z. B. via TanStack Query), um die Notenübersichten für Schüler blitzschnell und ohne ständige Server-Anfragen zu laden (**Z 3**).

### 1.2 Backend (Application-Layer)
* **Technologie:** **Node.js (NestJS)** oder **FastAPI**. Beide Frameworks sind extrem ressourcenschonend und für hohe parallele Zugriffszahlen optimiert (NFA Effizienz).
* **API-Design:** RESTful API für die strukturierte Kommunikation zwischen Frontend und Backend.

### 1.3 Database (Data-Layer)
* **Technologie:** **PostgreSQL** (Relationale Datenbank). Perfekt geeignet, um die komplexen Beziehungen zwischen Lehrern, Schülern, Fächern und Notengewichtungen konsistent abzubilden.

---

## 2. Security & Data Integrity

Da es sich um hochsensible Schuldaten handelt, steht die Sicherheit (NFA Funktionalität / Sicherheit) an oberster Stelle.

* **Multi-Faktor-Authentifizierung (MFA / Z 8):** Der Zugriff für Lehrer wird über ein sicheres Login-Verfahren geschützt (z. B. TOTP via App oder E-Mail-MFA). 
* **Audit-Logging (Urheberschaft / Z 8):** Jede Noteneingabe oder -änderung schreibt einen unveränderlichen Log-Eintrag im Backend (`Lehrer_ID`, `Schüler_ID`, `Prüfungs_ID`, `Zeitstempel`, `Aktion`). Damit ist die Urheberschaft vor Gericht zweifelsfrei nachweisbar.
* **Data Integrity & Manipulationsschutz (Z 6):** * Schutz der Datenbank-Ebene über **Row-Level-Security (RLS)**.
  * Beim Speichern einer Note wird im Backend ein kryptografischer SHA-256-Hash über die Datenzeile generiert (`Schüler_ID + Prüfungs_ID + Note + Salt`). 
  * Das System prüft regelmäßig die Hashes. Manuelle, unberechtigte Änderungen direkt auf der Datenbank fliegen sofort auf, da der Hash-Wert ungültig wird.
* **Rollenbasiert Zugriffskontrolle (RBAC):** Schüler erhalten ausschließlich lesenden Zugriff (*Read-Only*) auf ihre eigenen Daten. Lehrer können nur Noten für die Fächer eintragen, für die sie autorisiert sind.

---

## 3. Datenmodell (High-Level ERD-Konzept)

Das relationale Datenmodell stellt sicher, dass jeder Lehrer seine individuellen Gewichtungen und Berechnungsarten hinterlegen kann (**Z 1**).
<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/56f204a5-dadc-41c4-8d9f-2103d76851c1" />


## 4. Kernfeatures & Algorithmus-Design

### 4.1 Der Berechnungs-Algorithmus (Z 1 & Z 7)
Um Rundungsfehler durch die native Fließkomma-Arithmetik von Programmiersprachen zu verhindern, nutzt das Backend exakte Dezimaltypen (z. B. `Decimal.js` in Node.js oder `NUMERIC(4,2)` in PostgreSQL).

* **Formel zur Notenberechnung:**
  Das System berechnet die Endnote dynamisch basierend auf der hinterlegten Gewichtung des Lehrers:
  Endnote = (Schnitt_SA * Gew_SA) + (Schnitt_Test * Gew_Test) + (Schnitt_MA * Gew_MA)
  * **Rundungsvorgabe:** Die finale Endnote wird strikt nach den gesetzlichen Vorgaben der Schulordnung (z. B. kaufmännische Rundung exakt auf zwei Dezimalstellen) über eine dedizierte Utility-Funktion (`roundToTwoDecimals()`) verarbeitet (**Z 7**).

### 4.2 Optimiertes Eingabeformular für Lehrer (Z 2)
* **UX/UI-Ansatz:** Ein tabellenbasiertes "Speed-Input"-Formular. Lehrer können nach Auswahl von Fach und Prüfung die Noten der Schülerliste via Tastatur (Tab-Taste zum Springen) eingeben, ohne die Maus nutzen zu müssen. Das spart Zeit und garantiert eine schnelle Bedienbarkeit direkt nach dem Workshop.

### 4.3 Transparenz & Veröffentlichung (Z 5 & Z 9)
* **Echtzeit-Veröffentlichung:** Sobald der Lehrer eine Prüfung auf den Status `Published` setzt, ist sie sofort für den Schüler sichtbar (**Z 5**).
* **Transparenz-Dashboard:** Auf der Detailseite eines Fachs wird die Endnote für Dritte (Eltern, Auditoren) vollständig aufgeschlüsselt (**Z 9**). Es wird exakt angezeigt, wie sich die Note aus den einzelnen Teilleistungen (SA, Test, MA) und deren Gewichtung zusammensetzt.

---

## 5. Infrastruktur & Lastverteilung (NFA Effizienz / Z 10)

Um die geforderte **Verfügbarkeit von 99,9 %** pro Schuljahr (**Z 10**) und eine hohe Performance in Spitzenzeiten (z. B. vor Zeugniskonferenzen) zu gewährleisten, wird folgende Infrastruktur eingesetzt:

* **Containerisierung & Skalierung:** Die Anwendung wird vollständig in Docker-Containern betrieben und läuft in einer Multi-Instance-Umgebung hinter einem **Load Balancer**. Fällt eine Instanz aus, übernimmt automatisch eine andere ohne Downtime.
* **Caching-Layer (Redis):** Da bereits veröffentlichte Noten nicht sekündlich geändert werden, werden die Startseiten-Übersichten (**Z 3**) für Schüler im In-Memory-Cache (Redis) zwischengespeichert. Bei extrem hohen parallelen Aufrufen am Notenstichtag wird die primäre PostgreSQL-Datenbank dadurch massiv entlastet (NFA Effizienz / Verbrauchsverhalten).
* **Hosting:** Betrieb in einem DSGVO-konformen, zertifizierten deutschen Rechenzentrum.
