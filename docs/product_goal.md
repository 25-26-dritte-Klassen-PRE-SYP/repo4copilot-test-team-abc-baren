# Ist-Zustand

Ist-Zustand:
Der Kunde betreibt ein Casino als physischen Standort und richtet sich an Kunden, die vor Ort spielen. Die Verwaltung und das Angebot sind auf den lokalen Einzugsbereich beschränkt.

Aktuelles Problem:
Die Anzahl der Kunden ist begrenzt, da nur Personen erreicht werden, die das Casino physisch besuchen können. Dadurch bleiben potenzielle Online-Zielgruppen ungenutzt, was zu geringerer Auslastung und weniger Umsatz führt.

## UCD:
<img width="641" height="716" alt="image" src="https://github.com/user-attachments/assets/f26caa07-2696-4545-9e59-ad70b55979bd" />


## DFD:
<img width="555" height="575" alt="image" src="https://github.com/user-attachments/assets/58e22693-55f6-4b83-870d-a80cbda21db8" />


# Soll-Zustand:

### Ziele:
- **benutzerfreundliche Website** <br>
  Der Entwickler erstellt innerhalb von 6 Monaten eine benutzerfreundliche Website mit klarer Navigation, Kontaktformular und mindestens 5 Funktionen.
  
- **Prozessoptimierung** <br>
  Der Entwickler optimiert innerhalb von 9 Monaten digitale Prozesse, sodass die Bearbeitungszeit von Anfragen oder Bestellungen um 30 % reduziert wird.
  
- **Verbesserung des Systems** <br>
  Der Entwickler implementiert innerhalb von 6 Monaten ein System, das Ladezeiten auf unter 2 Sekunden reduziert und mindestens 500 gleichzeitige Nutzer             unterstützt.
  
- **Implementierung von Expansionsmöglichkeiten** <br>
   Der Entwickler entwickelt innerhalb von 12 Monaten eine skalierbare und mehrsprachige Plattform, die in mindestens 3 Regionen eingesetzt werden kann.
  
- **Möglichkeit der mobilen Nutzung** <br>
  Der Entwickler erstellt innerhalb von 6 Monaten eine mobil optimierte Website oder App, die auf mindestens 95 % aller gängigen Smartphones und Tablets             fehlerfrei funktioniert.
  
- **Online-Verfügbarkeit** <br>
  Innerhalb von 6 Monaten soll eine mobil nutzbare Website oder App bereitgestellt werden.

### UCD
<img width="1519" height="1159" alt="image" src="https://github.com/user-attachments/assets/090c8ef8-55d5-4398-bf2e-c06f5e1d687d" />


### DFD
<img width="575" height="548" alt="image" src="https://github.com/user-attachments/assets/0ef9ddf8-5a12-4aba-98c2-68083a16bea2" />


### Liste der Rollen
- Kunde
- Mitarbeiter

### Liste der Systeme
- Casino-System
- Online-Spielsystem
- Zahlungssystem

### NFA
- Modifizierbarkeit
  - Ziel: Die Zeit für die Implementierung von neuen Funktionen soll möglichst gering sein
  - Messbarkeit: Die Modifizierbarkeit wird daran gemessen, dass kleine Funktionen in unter 1 Arbeitstag und mittlere Erweiterungen in unter 3 Arbeitstagen ohne kritische Fehler umgesetzt werden können.

- Attraktivität
  - Ziel: Die UI soll möglichst attraktiv sein, um Kunden anzulocken und zu Käufen zu verleiten
  - Messbarkeit: 8 von 10 Testern, die der Kunde aussucht, bewerten die UI bei einem Workshop mit "Sehr Gut".

- Bedienbarkeit
  - Ziel: Das System soll leicht bedienbar sein, damit auch neue Kunden das System schnell verstehen.
  - Messbarkeit: 8 von 10 Testern, die der Kunde aussucht, bewerten die Bedienbarkeit bei einem Workshop mit "Sehr Gut".

- Zeitverhalten
  - Ziel: Ladezeiten von Funktionen sollen möglischst gering sein, um eine störungsfreie Benutzung des Systems zu ermöglichen.
  - Messbarkeit: Kleine Funktionen werden in unter 5 Sekunden geladen und große Funktionen in unter 20 Sekunden.

- Sicherheit
  - Ziel: Alle Userdaten werden sicher gespeichert, damit kein Sicherheitsrisiko entsteht.
  - Messbarkeit: 100% der Passwörter sind vor unberechtigtem Zugriff geschützt.

- Reife
  - Ziel: Die Versagenshäufigkeit durch Fehler soll möglichst gering sein. 
  - Messbarkeit: Weniger als 1 kritischer Systemfehler pro Monat und mindestens 95 % fehlerfreie Systemstarts im Regelbetrieb.

- Wiederherstellbarkeit
  - Ziel: Nach einem kritischem Systemfehler dürfen keine Daten verloren gehen. 
  - Messbarkeit: 100% der Daten sind nach der Wiederherstellung wieder korrekt vorhanden. 
