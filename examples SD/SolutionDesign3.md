# Solution Design: LauchFrei

## 1. Einleitung und Zielsetzung
Die App **LauchFrei** ist eine digitale Lösung zur zentralen Planung, Dokumentation und Auswertung von Fitnesstraining. Sie ersetzt den fehleranfälligen und unübersichtlichen Ist-Zustand (Papier, Notizen, Tabellen) durch ein strukturiertes, zuverlässiges System. 

**Hauptziele der Lösung:**
* Intuitive und schnelle Erfassung von Trainingseinheiten (Übungen, Sätze, Wiederholungen, Gewicht).
* Zuverlässige, lokale oder cloudbasierte Speicherung zur Vermeidung von Datenverlust.
* Übersichtliche Visualisierung der Trainingshistorie und des Leistungsfortschritts.

---

## 2. Systemarchitektur & Kontext
Basierend auf den Anforderungen (insb. Effizienz und Benutzbarkeit während des Trainings) wird eine **Mobile-First-Architektur** (Smartphone-App) empfohlen. 

* **Frontend (User Interface):** Eine native oder Cross-Platform-App (z. B. Flutter oder React Native, auch wenn Portabilität in V1 nicht im Fokus steht, erleichtert es zukünftige Wartbarkeit), optimiert für die einhändige Bedienung im Fitnessstudio.
* **Datenspeicherung (Persistenz):** Ein lokaler Datenspeicher (z. B. SQLite oder Realm), um die Ladezeiten unter 2 Sekunden zu halten und eine hohe Zuverlässigkeit (kein Datenverlust bei Neustart/ohne Internet) zu garantieren. 
* **Systemgrenze:** Die App operiert autark. Externe Schnittstellen (Smartwatches, andere Fitness-Apps) sind für die erste Version (V1) explizit **nicht** vorgesehen (Interoperabilität: Nicht relevant).

---

## 3. Datenmodell (Entity Relationship)
Um die fachlichen Kernfunktionen abzubilden, wird ein relationales Datenbankschema verwendet. Das folgende Diagramm zeigt die Entitäten und ihre Beziehungen in der Krähenfuß-Notation:

<img width="1408" height="768" alt="image" src="https://github.com/user-attachments/assets/66358459-13a8-47f4-a757-87b9b7795944" />

### Detailbeschreibung der Entitäten

| Entität | Attribute (Beispiele) | Beschreibung |
| :--- | :--- | :--- |
| **User** | `UserID` | (Optional für V1, falls rein lokal, andernfalls zur Identifikation) |
| **WorkoutSession** | `SessionID`, `Date`, `Duration`, `Notes` | Repräsentiert eine einzelne Trainingseinheit. |
| **Exercise** | `ExerciseID`, `Name`, `Category` | Stammdaten für mögliche Übungen (z.B. Bankdrücken). |
| **WorkoutSet** | `SetID`, `SessionID`, `ExerciseID`, `Weight`, `Reps`, `SetNumber` | Die eigentlichen Leistungsdaten pro Übung und Satz. |

---

## 4. Funktionale Kernkomponenten (Module)

### 4.1 Modul: Workout-Management
* **Erstellung:** Starten einer neuen Trainingseinheit mit aktuellem Zeitstempel.
* **Historie:** Abruf und chronologische Darstellung vergangener `WorkoutSessions` (Zugriffszeit < 2 Sekunden).

### 4.2 Modul: Exercise-Tracking
* **Übungsauswahl:** Hinzufügen von `Exercises` zur aktiven `WorkoutSession`.
* **Dateneingabe:** Schnelleingabe-Maske für Gewichte (kg/lbs) und Wiederholungen. 
* **Validierung:** Fehlertolerante Eingabeprüfung (Verhinderung von negativen Wiederholungen, leeren Pflichtfeldern), die statt eines Absturzes klare Fehlermeldungen liefert.

### 4.3 Modul: Progress-Analytics
* **Fortschrittsübersicht:** Aggregation der `WorkoutSets` (z. B. Maximalgewicht pro Übung im Zeitverlauf) zur Befriedigung des Benutzerbedürfnisses nach Messbarkeit.

---

## 5. Nicht-funktionale Anforderungen (Systemqualitäten)
Die Architektur und Entwicklung richten sich nach den definierten Qualitätszielen (ISO/IEC 9126). 

### 5.1 Benutzbarkeit (Usability)
Die App wird während des Trainings genutzt, weshalb die UI extrem reibungslos funktionieren muss.
* **Erlernbarkeit:** Onboarding und Ersterfassung eines Trainings müssen ohne externe Anleitung in **< 5 Minuten** möglich sein (Ziel: < 2 Minuten für die reine Anlage).
* **Bedienbarkeit:** Das Speichern eines Satzes (Gewicht & Wiederholungen) darf maximal **5 Interaktionen (Taps)** erfordern.
* **Verständlichkeit:** Eindeutige Wording-Konventionen (Übung, Gewicht, Sätze, Wiederholungen).

### 5.2 Effizienz (Performance)
* **Zeitverhalten:** Ladezeiten für das Speichern und Anzeigen von Trainingseinheiten liegen strikt bei **< 2 Sekunden**, selbst bei einer Historie von > 100 Einträgen.
* **Responsivität:** Die UI darf bei Eingaben niemals länger als 2 Sekunden blockieren.

### 5.3 Zuverlässigkeit & Sicherheit (Reliability & Security)
* **Wiederherstellbarkeit:** Die App muss Zustände speichern. Nach einem erzwungenen Neustart (App-Kill) müssen die zuletzt gespeicherten Trainingsdaten in **100 % der Fälle** wieder verfügbar sein.
* **Fehlertoleranz:** Falsche Eingaben führen zu Validierungsmeldungen, niemals zu App-Abstürzen. Die Reife wird durch 10 fehlerfreie, aufeinanderfolgende Testdurchläufe der Kernprozesse gesichert.
* **Datenschutz:** Trainingsdaten werden nur lokal oder im isolierten User-Kontext gespeichert und sind nicht öffentlich einsehbar.

### 5.4 Wartbarkeit (Maintainability)
Das System muss auf zukünftige Erweiterungen (z.B. neue Auswertungen) ausgelegt sein.
* **Testbarkeit:** Jede Kernfunktion (Erstellen, Hinzufügen, Speichern, Anzeigen) wird durch mindestens **einen automatisierten Testfall** abgedeckt.
* **Stabilität:** Nach Anpassungen müssen Regressionstests der Kernfunktionen zu **100 %** erfolgreich durchlaufen.
* **Analysierbarkeit:** Log-Management und saubere Modultrennung (z.B. MVC oder MVVM-Pattern) stellen sicher, dass Fehlerquellen (UI vs. Datenbank) innerhalb von **30 Minuten** isoliert werden können.
