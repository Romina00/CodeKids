# codeKids Project Guide

Dieser Guide ist die verbindliche Arbeitsgrundlage fuer `codeKids`.
Er gilt fuer Backend, Frontend, kuenftige Erweiterungen und die Zusammenarbeit mit KI-Unterstuetzung.

## 1. Ziel

Das Projekt soll:

- technisch konsistent bleiben,
- sauber dokumentiert sein,
- fuer die Bachelorarbeit nachvollziehbar bleiben,
- ohne stilistische Brueche weiterentwickelt werden koennen.

Alle Regeln in diesem Dokument sind als `MUST` zu verstehen, sofern nicht ausdruecklich anders markiert.

## 2. Grundprinzipien

### 2.1 Clean Code

- Code loest genau ein Problem pro Komponente, Datei oder Funktion.
- Lesbarkeit hat Vorrang vor cleveren Kurzloesungen.
- Duplikate werden reduziert, aber nicht durch unnoetige Abstraktion ersetzt.
- Neue Abhaengigkeiten duerfen nur eingefuehrt werden, wenn der Mehrwert klar begruendet ist.
- Unfertige Workarounds ohne Kommentar oder Ticket sind nicht erlaubt.

### 2.2 Konsistenz vor persoenlichem Stil

- Bestehende Konventionen werden eingehalten.
- Neue Muster duerfen nur eingefuehrt werden, wenn sie dokumentiert und im Projekt konsistent anwendbar sind.
- Mischformen bei Benennung, Ordnerstruktur, Farben, Icons oder API-Verhalten sind zu vermeiden.

### 2.3 Einfachheit

- Bevorzugt werden einfache, nachvollziehbare Loesungen.
- Kein Overengineering.
- Keine "vorsorglichen" Patterns fuer Probleme, die im Projekt noch nicht real existieren.

## 3. Sprache

- Code, Bezeichner, Commit-Messages, Branch-Namen, API-Responses und technische Kommentare sind auf Englisch.
- Wissenschaftliche Notizen, Bachelorarbeits-Kontext und organisatorische Dokumentation duerfen auf Deutsch sein.
- UI-Texte sind in der finalen Produktsprache des jeweiligen Screens zu verfassen. Solange nichts anderes festgelegt ist, sollen produktive UI-Texte in Deutsch angelegt werden.

## 4. Benennung

- Variablen und Funktionen: `camelCase`
- Klassen, Types, Interfaces, DTOs, React Components: `PascalCase`
- Konstanten und Environment-Variablen: `UPPER_SNAKE_CASE`
- Dateien und Ordner: `kebab-case`
- React Component-Dateien: `PascalCase.tsx` sind erlaubt, wenn der Frontend-Stack dies bereits so nutzt; andernfalls bleibt `kebab-case` Standard. Vor der Einfuehrung ist der Stil einmalig festzulegen und anschliessend strikt beizubehalten.

Verboten sind unklare Namen wie:

- `data`
- `item`
- `temp`
- `stuff`
- `handleIt`
- `doSomething`

## 5. Projektstruktur

### 5.1 Allgemein

- Fachliche Struktur vor technischer Sammelstruktur.
- Jede Datei hat eine klare Verantwortung.
- Gemeinsame Utilities kommen nur dann in Shared-Bereiche, wenn echte Wiederverwendung besteht.

### 5.2 Backend

- Das Backend folgt der bestehenden NestJS-Modulstruktur.
- Controller enthalten keine Fachlogik.
- Services enthalten die Geschaeftslogik.
- DTOs werden fuer Ein- und Ausgaben verwendet, sobald Daten eine API-Grenze ueberschreiten.
- `any` ist nicht erlaubt, ausser es ist technisch unvermeidbar und kurz begruendet.

Hinweis: Der bestehende Guide in [backend/backend-code-kids/STYLEGUIDE.md](/Users/rominamirmehdi/Desktop/bht/Bachloer/codeKids/backend/backend-code-kids/STYLEGUIDE.md) bleibt gueltig und wird durch dieses Dokument auf Projektebene ergaenzt.

### 5.3 Frontend

Die folgenden Regeln gelten verbindlich, sobald das Frontend implementiert oder erweitert wird:

- Komponenten werden nach fachlicher Verantwortung strukturiert, nicht als unklare Sammelordner.
- Praesentationslogik und Datenlogik werden getrennt gehalten.
- Wiederverwendbare UI-Bausteine kommen in einen klar benannten `ui`- oder `components`-Bereich.
- Seitenlogik darf keine unkontrollierten Inline-Styles oder ad-hoc Farbwerte enthalten.
- Accessibility ist Pflicht: semantische HTML-Elemente, sinnvolle Labels, Tastaturbedienbarkeit, ausreichende Kontraste.

## 6. Frontend Design System

### 6.1 Farbregel

Das Frontend verwendet feste, zentral definierte Farben mit Thailand-Bezug. Einzelne Komponenten duerfen keine eigenen "zufaelligen" Farben einfuehren.

Verbindliche Kernpalette:

- `--color-thai-red: #A51931`
- `--color-thai-blue: #2D2A4A`
- `--color-thai-white: #F8F7F4`
- `--color-sand: #E9D8B4`
- `--color-leaf: #5B8C5A`
- `--color-ink: #1F2430`

Regeln:

- Farben werden ausschliesslich ueber Design Tokens oder CSS-Variablen verwendet.
- Keine Hex-Werte direkt in Komponenten, ausser innerhalb der zentralen Theme-Datei.
- Rot und Blau sind Markenfarben und nicht beliebig durch andere Primaerfarben ersetzbar.
- Statusfarben wie Error, Success oder Warning werden ebenfalls zentral definiert.

### 6.2 Icons

- Ausschliesslich `lucide-react` ist als Icon-Bibliothek erlaubt.
- Keine Mischung mit Heroicons, Font Awesome, Material Icons oder SVG-Imports aus Fremdquellen, sofern nicht fachlich zwingend und explizit dokumentiert.
- Icon-Groessen, Strichstaerken und Farben werden ueber zentrale UI-Konventionen gesteuert.

### 6.3 Typografie und Spacing

- Schriften, Groessen, Abstaende, Border-Radius und Schatten werden zentral definiert.
- Keine zufaelligen Einzelwerte pro Komponente.
- Spacing folgt einer festen Skala, z. B. `4 / 8 / 12 / 16 / 24 / 32`.

## 7. Implementierungsregeln

### 7.1 Vor jeder neuen Funktion

Vor der Implementierung muss klar sein:

- welches Problem geloest wird,
- welche Datei oder welches Modul verantwortlich ist,
- welche Daten rein- und rausgehen,
- wie das Verhalten getestet oder mindestens manuell nachvollzogen wird.

### 7.2 Waehren der Implementierung

- Keine toten Imports.
- Keine auskommentierten Codebloecke im finalen Stand.
- Keine Debug-Logs im finalen Stand.
- Funktionen sollen klein und klar benannt bleiben.
- Verschachtelung ist moeglichst flach zu halten.
- Fehlerfaelle werden bewusst behandelt und nicht "geschluckt".

### 7.3 Nach der Implementierung

- Linting muss ohne neue Warnungen oder Fehler durchlaufen.
- Relevante Tests werden ausgefuehrt oder begruendet, falls noch keine Testbasis existiert.
- Neue technische Entscheidungen werden dokumentiert, wenn sie das Projektverhalten oder die Architektur beeinflussen.

## 8. Tests und Qualitaet

- Jeder Bugfix soll nach Moeglichkeit durch einen Test oder mindestens einen klar dokumentierten Reproduktionsfall abgesichert werden.
- Kritische Logik wird nicht ungetestet eingebaut, wenn das Projekt bereits eine passende Testumgebung hat.
- Snapshots ohne klare Aussagekraft sind zu vermeiden.
- "Scheint zu funktionieren" ist kein Qualitaetskriterium.

## 9. API- und Datenregeln

- API-Namen muessen fachlich klar und stabil sein.
- Fehlerantworten muessen konkret sein.
- Eingaben werden validiert, bevor Fachlogik ausgefuehrt wird.
- Datenbankfelder und API-Felder werden bewusst benannt; Abkuerzungen ohne Fachwert sind zu vermeiden.

## 10. Dokumentation

Folgende Dinge muessen dokumentiert werden, wenn sie neu eingefuehrt werden:

- neue Libraries,
- neue Architekturentscheidungen,
- neue globale UI-Regeln,
- neue Umgebungsvariablen,
- neue KI-relevante Arbeitsweise, falls sie fuer die Bachelorarbeit dokumentationspflichtig ist.

Kurze Entscheidungen koennen direkt in Markdown-Dateien im Repo dokumentiert werden. Dokumentation soll knapp, aber belastbar sein.

## 11. KI-Nutzung im Projekt

- KI darf bei technischen Formulierungen, Refactoring, Strukturvorschlaegen, UI-Ideen und Implementierungsunterstuetzung helfen.
- Die fachliche Verantwortung bleibt voll beim Projekt.
- Jeder uebernommene Vorschlag muss verstanden, geprueft und bei Bedarf angepasst werden.
- Code oder Texte duerfen nicht blind uebernommen werden.
- Fuer bachelorarbeitsrelevante Inhalte gilt zusaetzlich der Anhang in [AI_USAGE_APPENDIX.md](/Users/rominamirmehdi/Desktop/bht/Bachloer/codeKids/AI_USAGE_APPENDIX.md).

## 12. Nicht verhandelbare Verbote

- Keine unerklaerten Copy-Paste-Loesungen aus dem Internet oder aus KI-Ausgaben.
- Keine zweite Icon-Bibliothek neben `lucide-react`.
- Keine uneinheitlichen Farbsysteme.
- Keine Vermischung von Deutsch und Englisch in technischen Bezeichnern.
- Keine Fachlogik in Controllern oder spaeter in reinen Presentational Components.
- Keine "temporaren" Quick Fixes ohne sichtbare Nachverfolgung.

## 13. Arbeitsregel fuer kuenftige Zusammenarbeit

Wenn neue Regeln dazukommen, werden sie nicht nur ausgesprochen, sondern in diesem Guide festgeschrieben. Dieser Guide ist damit die Single Source of Truth fuer Stil, Struktur und technische Disziplin in `codeKids`.
