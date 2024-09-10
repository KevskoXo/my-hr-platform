Lastenheft für die „my-hr-platform“
1. Einleitung
1.1 Ziel des Projekts
Entwicklung einer weltweit einsetzbaren HR-Plattform für Bewerber und Recruiter mit Fokus auf Benutzerfreundlichkeit und Personalisierung.

1.2 Zielgruppe
	Bewerber: Personen, die sich um Stellen bewerben.
	Recruiter/Firmen: Unternehmen, die Stellenangebote veröffentlichen und Bewerber suchen.
2. Systembeschreibung
2.1 Allgemeine Systemübersicht
Die Plattform besteht aus mehreren Microservices, die miteinander über APIs kommunizieren. Dazu gehören:

userService: Verwaltung von Benutzerdaten und Authentifizierung.
resumeService: Verwaltung und Aktualisierung von Lebensläufen.
messageService: Messaging-System für die Kommunikation zwischen Bewerbern und Recruitern.
jobService: Verwaltung von Stellenanzeigen.
aiRecommendationService: KI-gestützte Jobempfehlungen.
blocklistService: Verwaltung von Blockierungen von Recruitern durch Bewerber.
conversationService: Verwaltung von Konversationen zwischen Bewerbern und Recruitern.
companyService: Verwaltung von Unternehmensdaten und Stellenangeboten.
recruiterService: Verwaltung der Recruiter-Daten und Interaktionen mit Bewerbern.
videoService: Verwaltung von Videokonferenzen und vorab aufgezeichneten Bewerbungsvideos.
2.2 Funktionale Anforderungen
2.2.1 User Management
Registrierung und Authentifizierung:
Registrierung neuer Benutzer.
JWT-Token-basierte Anmeldung und Authentifizierung.
2.2.2 Resume Management
Lebenslaufmanagement:
Erstellung, Abruf und Aktualisierung von Lebensläufen.
2.2.3 Jobfilter
Standard-Jobfilter:
Hinzufügen und Bearbeiten von Filtern für Stellenangebote.
2.2.4 Messaging-System
Kommunikation:
Direkte Kommunikation zwischen Bewerbern und Recruitern.
Benachrichtigungen über neue Nachrichten.
Blockierung von Recruitern durch Bewerber.
2.2.5 Videobewerbungsraum
Videointerviews:

Integration von Videokonferenz-Tools für Bewerbungsgespräche.
Verwaltung und Durchführung von Live-Interviews.
Vorab aufgezeichnete Bewerbungsvideos (optional):

Möglichkeit für Bewerber, vorab aufgezeichnete Bewerbungsvideos hochzuladen und zu verwalten.
Integration in das Bewerbungsverfahren für eine bessere Präsentation der Bewerber.
2.2.6 KI-gestützte Jobabfrage
Personalisierte Jobempfehlungen:
Die KI analysiert Lebensläufe und Jobanforderungen, um personalisierte Jobvorschläge zu generieren.
Integration eines KI-Modells, das basierend auf Bewerberdaten und Jobprofilen Empfehlungen gibt.
2.3 Spezifische Services
2.3.1 userService
Funktionen:
Registrierung und Authentifizierung von Nutzern.
JWT-Token-Management für die Sitzungskontrolle.
2.3.2 resumeService
Funktionen:
Erstellung, Abruf und Aktualisierung von Lebensläufen.
2.3.3 messageService
Funktionen:
Verwaltung der Nachrichtenkommunikation.
Speicherung und Abruf von Nachrichten.
Benachrichtigungen über neue Nachrichten.
2.3.4 jobService
Funktionen:
Verwaltung und Veröffentlichung von Stellenanzeigen.
Integration mit dem AI Recommendation Service für Jobvorschläge.
2.3.5 aiRecommendationService
Funktionen:
Analyse von Lebensläufen und Stellenangeboten.
Generierung von personalisierten Jobempfehlungen.
2.3.6 blocklistService
Funktionen:
Verwaltung der Blockierungslisten, die es Bewerbern ermöglichen, Recruiter zu blockieren.
2.3.7 conversationService
Funktionen:
Verwaltung der Konversationen zwischen Bewerbern und Recruitern.
Unterstützung für das Öffnen und Verwalten von Konversationen nach Kontaktaufnahme durch Recruiter.
2.3.8 companyService
Funktionen:
Verwaltung der Unternehmensdaten und deren Stellenangebote.
Synchronisierung mit externen Jobbörsen und Unternehmenswebseiten.
2.3.9 recruiterService
Funktionen:
Verwaltung der Daten von Recruitern.
Verknüpfung von Recruitern mit Stellenangeboten und Bewerbungen.
2.3.10 videoService
Funktionen:
Integration von Videokonferenz-Tools für Bewerbungsgespräche.
Verwaltung von vorab aufgezeichneten Bewerbungsvideos.
2.4 Nicht-funktionale Anforderungen
Sicherheit:
Datenschutzkonforme Speicherung von Daten.
Sichere Übertragung von Nachrichten und Videos.
Performance:
Schnelle Reaktionszeiten und hohe Verfügbarkeit.
Skalierbarkeit:
Unterstützung für eine wachsende Anzahl von Nutzern und Daten.
3. Systemarchitektur
3.1 Service-Architektur
User Service: Verwaltung der Benutzerdaten und Authentifizierung.
Resume Service: Verwaltung der Lebensläufe.
Message Service: Verwaltung der Nachrichtenkommunikation.
Job Service: Verwaltung der Stellenangebote.
AI Recommendation Service: KI-gestützte Empfehlungen.
Blocklist Service: Verwaltung der Blockierungen.
Conversation Service: Verwaltung der Konversationen.
Company Service: Verwaltung der Unternehmensdaten.
Recruiter Service: Verwaltung der Recruiter-Daten.
Video Service: Verwaltung der Videokonferenzen und Bewerbungsvideos.
3.2 Datenbankdesign
User Service Datenbank: Speicherung von Benutzerdaten und Anmeldeinformationen.
Resume Service Datenbank: Speicherung der Lebensläufe der Bewerber.
Message Service Datenbank: Speicherung der Nachrichten und Blockierungslisten.
Job Service Datenbank: Speicherung der Stellenanzeigen.
AI Recommendation Service Datenbank: Speicherung von Modellergebnissen und Nutzerpräferenzen.
Blocklist Service Datenbank: Speicherung der Blockierungsinformationen.
Conversation Service Datenbank: Speicherung der Konversationsdaten.
Company Service Datenbank: Speicherung der Unternehmensdaten und Stellenangebote.
Recruiter Service Datenbank: Speicherung der Recruiter-Daten.
Video Service Datenbank: Speicherung der Videokonferenz- und Bewerbungsvideodaten.
4. Projektplanung
4.1 Meilensteine
Planung: Fertigstellung des Lastenhefts.
Design: Entwurf der Systemarchitektur und Datenbanken.
Entwicklung: Implementierung der Services.
Integration: Verknüpfung der Services und Implementierung der KI-gestützten Abfrage.
Testing: Durchführung von Tests zur Sicherstellung der Funktionalität.
Deployment: Veröffentlichung der Plattform.
4.2 Ressourcen
Personal: Entwickler, Data Scientists, Tester.
Technologie: Entwicklungswerkzeuge, Serverinfrastruktur.
5. Risiken und Herausforderungen
Datenqualität: Sicherstellen, dass die Daten für das Modelltraining von hoher Qualität sind.
Datenschutz: Einhaltung aller Datenschutzbestimmungen.
Modellgenauigkeit: Sicherstellen, dass die KI präzise und relevante Empfehlungen gibt.
6. Anhang
6.1 Glossar
AI (Künstliche Intelligenz): Systeme, die menschliche Intelligenz nachahmen, um Aufgaben zu erfüllen.
6.2 Referenzen
Quellen und Literatur, die bei der Erstellung des Lastenhefts verwendet wurden.
