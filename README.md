1. Einleitung
1.1 Ziel des Projekts
Entwicklung einer weltweit einsetzbaren HR-Plattform für Bewerber und Recruiter mit Fokus auf Benutzerfreundlichkeit, Personalisierung und effiziente Kommunikation.

1.2 Zielgruppe
Bewerber: Personen, die sich um Stellen bewerben.
Recruiter/Firmen: Unternehmen und Personalvermittler, die Stellenangebote veröffentlichen und Bewerber suchen.
2. Systembeschreibung
2.1 Allgemeine Systemübersicht
Die Plattform besteht aus mehreren Microservices, die über APIs miteinander kommunizieren:

userService: Verwaltung von Benutzerdaten und Authentifizierung.
resumeService: Verwaltung und Aktualisierung von Lebensläufen.
applicationService: Verwaltung von Bewerbungen.
messageService: Messaging-System für die Kommunikation.
jobService: Verwaltung von Stellenanzeigen.
aiRecommendationService: KI-gestützte Jobempfehlungen.
blocklistService: Verwaltung von Blockierungen.
conversationService: Verwaltung von Konversationen.
companyService: Verwaltung von Unternehmensdaten.
recruiterService: Verwaltung der Recruiter-Daten.
videoService: Verwaltung von Videofunktionen.
zoomService: Integration von Zoom für Videokonferenzen.
reportingService: Generierung von Berichten und Statistiken.
2.2 Funktionale Anforderungen
2.2.1 User Management (userService)
Registrierung und Authentifizierung:
Registrierung neuer Benutzer (Bewerber und Recruiter).
JWT-Token-basierte Anmeldung und Authentifizierung.
2.2.2 Lebenslaufmanagement (resumeService)
Lebenslaufverwaltung:
Erstellung, Abruf und Aktualisierung von Lebensläufen.
Upload von Dokumenten und Zertifikaten.
2.2.3 Bewerbungsmanagement (applicationService)
Bewerbungen:
Erstellung und Verwaltung von Bewerbungen auf Stellenanzeigen.
Nachverfolgung des Bewerbungsstatus.
Kommunikation spezifisch zu einer Bewerbung.
2.2.4 Jobfilter und -suche (jobService)
Jobfilter:
Hinzufügen und Bearbeiten von Filtern für Stellenangebote.
KI-gestützte Suche (aiRecommendationService):
Personalisierte Jobempfehlungen basierend auf Profil und Präferenzen.
2.2.5 Kommunikation (messageService, conversationService)
Nachrichten:
Direkte Kommunikation zwischen Bewerbern und Recruitern.
Benachrichtigungen über neue Nachrichten.
Konversationen:
Verwaltung von Chat-Verläufen.
Gruppierung von Nachrichten nach Bewerbung oder Unternehmen.
2.2.6 Blockierung (blocklistService)
Blockierungsfunktion:
Bewerber können Recruiter blockieren.
Verwaltung von Blockierungslisten.
2.2.7 Unternehmensverwaltung (companyService, recruiterService)
Unternehmensprofile:
Verwaltung von Unternehmensdaten und Stellenangeboten.
Recruiter-Management:
Verwaltung der Recruiter-Daten.
Zuweisung von Recruitern zu Unternehmen.
2.2.8 Videofunktionen (videoService, zoomService)
Videointerviews:
Integration von Zoom für Live-Videokonferenzen.
Planung und Durchführung von Video-Interviews.
Vorab aufgezeichnete Bewerbungsvideos:
Bewerber können Bewerbungsvideos hochladen.
Recruiter können diese Videos einsehen.
zoomService:
Dedizierter Service zur Integration von Zoom-APIs.
Verwaltung von Meeting-Links und -Einstellungen.
2.2.9 Berichterstellung (reportingService)
Reporting:
Generierung von Berichten und Statistiken für Bewerber und Recruiter.
Analyse von Bewerbungsaktivitäten, Erfolgsquoten, etc.
Exportfunktionen für Berichte (PDF, Excel).
2.3 Nicht-funktionale Anforderungen
Sicherheit:
Datenschutzkonforme Speicherung und Verarbeitung von Daten.
Verschlüsselte Übertragung von Nachrichten und Videos.
Performance:
Schnelle Ladezeiten und hohe Verfügbarkeit.
Skalierbarkeit:
Flexible Infrastruktur zur Unterstützung von Nutzungsanstiegen.
Benutzerfreundlichkeit:
Intuitive Benutzeroberfläche für alle Zielgruppen.
Kompatibilität:
Unterstützung gängiger Browser und mobiler Endgeräte.
3. Systemarchitektur
3.1 Service-Architektur
User Service: Benutzermanagement und Authentifizierung.
Resume Service: Verwaltung von Lebensläufen.
Application Service: Verwaltung von Bewerbungen.
Message Service: Nachrichtenkommunikation.
Job Service: Verwaltung von Stellenanzeigen.
AI Recommendation Service: Personalisierte Jobempfehlungen.
Blocklist Service: Verwaltung von Blockierungen.
Conversation Service: Verwaltung von Chats und Konversationen.
Company Service: Verwaltung von Unternehmensprofilen.
Recruiter Service: Verwaltung der Recruiter und deren Rechte.
Video Service: Videofunktionen für Bewerbungen und Interviews.
Zoom Service: Integration von Zoom für Videokonferenzen.
Reporting Service: Generierung von Berichten und Analysen.
3.2 Datenbankdesign
User Datenbank: Benutzerdaten, Login-Informationen.
Resume Datenbank: Lebensläufe und zugehörige Dokumente.
Application Datenbank: Bewerbungsdaten und -status.
Message Datenbank: Nachrichten und Chat-Verläufe.
Job Datenbank: Stellenanzeigen und Jobdetails.
AI Datenbank: Daten für KI-Modelle und Empfehlungen.
Blocklist Datenbank: Informationen zu Blockierungen.
Conversation Datenbank: Konversationsmetadaten.
Company Datenbank: Unternehmens- und Recruiter-Daten.
Video Datenbank: Links und Daten zu Videointerviews und Bewerbungsvideos.
Reporting Datenbank: Gesammelte Daten für Berichte und Analysen.
4. Projektplanung
4.1 Meilensteine
Anforderungsanalyse:
Fertigstellung des Lastenhefts.
Designphase:
Detailliertes System- und Datenbankdesign.
Entwicklungsphase:
Implementierung der einzelnen Services.
Parallelentwicklung für Effizienz.
Integrationsphase:
Zusammenspiel der Services sicherstellen.
Integration externer APIs (z.B. Zoom).
Testphase:
Funktionale Tests für jeden Service.
Integrationstests und Lasttests.
Bereitstellung:
Deployment in der Produktionsumgebung.
Monitoring und Wartung.
4.2 Ressourcen
Personal:
Projektmanager
Softwareentwickler (Frontend und Backend)
Data Scientists für KI-Modelle
QA-Ingenieure für Tests
Technologie:
Server und Hosting
Entwicklungswerkzeuge und Lizenzen
Sicherheitszertifikate
5. Risiken und Herausforderungen
Datenschutz und Sicherheit:
Einhaltung von DSGVO und anderen Datenschutzgesetzen.
Schutz vor Cyberangriffen und Datenlecks.
Integration externer Dienste:
Abhängigkeit von Diensten wie Zoom.
Sicherstellung der API-Kompatibilität.
KI-Modellgenauigkeit:
Qualität der Empfehlungen sicherstellen.
Vermeidung von Bias im Modell.
Skalierbarkeit:
System muss mit wachsenden Nutzerzahlen umgehen können.
Lastverteilung und Performance-Optimierung.
6. Anhang
6.1 Glossar
AI (Künstliche Intelligenz): Technologie zur Simulation menschlicher Intelligenz.
JWT (JSON Web Token): Standard für die sichere Übertragung von Informationen.
API (Application Programming Interface): Schnittstelle zur Kommunikation zwischen Softwarekomponenten.
DSGVO: Datenschutz-Grundverordnung der EU.
6.2 Referenzen
Technische Dokumentationen der verwendeten Technologien und APIs.
Rechtliche Vorschriften zu Datenschutz und Datensicherheit.
