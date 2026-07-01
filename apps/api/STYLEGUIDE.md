# Styleguide - Code Kids Backend

Dieser Styleguide definiert die technischen und organisatorischen Konventionen fuer das Backend von **codeKids**.
Das Projekt ist Teil einer **Bachelorarbeit** und wird von **einer einzelnen Person** entwickelt. Der Fokus liegt deshalb auf Konsistenz, Nachvollziehbarkeit und einer sauberen Dokumentation der Entscheidungen, nicht auf Teamprozessen wie Reviews oder komplexen Branch-Strategien.

## 1. Ziel des Styleguides

Der Styleguide soll sicherstellen, dass das Projekt:

- langfristig wartbar bleibt,
- im Rahmen der Bachelorarbeit nachvollziehbar dokumentiert ist,
- einen einheitlichen Stil in Code, Commits und Struktur verwendet,
- auch spaeter ohne grossen Kontextwechsel weiterentwickelt werden kann.

## 2. Projektrahmen

- Projekttyp: Backend fuer `codeKids`
- Kontext: Bachelorarbeit
- Entwicklungsmodell: Einzelprojekt, kein Team-Workflow
- Backend-Stack: NestJS, TypeScript, TypeORM, MySQL, Swagger

## 3. Sprachregeln

### 3.1 Code und technische Artefakte

Alle Bestandteile, die dauerhaft Teil des Projekts sind, werden auf **Englisch** geschrieben:

- Variablen
- Funktionen und Methoden
- Klassen, Interfaces, Types und Enums
- DTOs, Entities, Services, Controller und Module
- Datei- und Ordnernamen
- Branch-Namen
- Commit-Messages
- technische Kommentare
- API- und Backend-Fehlermeldungen

Begruendung: Englisch ist in der Softwareentwicklung der Standard und macht das Projekt fachlich klarer und spaeter besser anschlussfaehig.

### 3.2 Fachliche Beschreibung und wissenschaftlicher Kontext

Texte ausserhalb des eigentlichen Codes duerfen auf **Deutsch** geschrieben werden, wenn sie der Bachelorarbeit oder der Projektdokumentation dienen, zum Beispiel:

- Notizen fuer die Ausarbeitung
- Kapitelentwuerfe
- methodische oder wissenschaftliche Erlaeuterungen
- projektspezifische Entscheidungen in der Dokumentation

### 3.3 Kommentare

Kommentare nur dann schreiben, wenn der Code nicht selbsterklaerend genug ist.

- Gute Kommentare erklaeren das **Warum**, nicht das Offensichtliche.
- Veraltete oder redundante Kommentare sind zu vermeiden.
- `TODO` und `FIXME` sind erlaubt, sollten aber praezise formuliert sein.

Beispiel:

```ts
// Keep refresh token hashes only, so leaked database data cannot be used directly.
```

## 4. Benennungskonventionen

### 4.1 Variablen und Konstanten

- Lokale Variablen und Parameter: `lowerCamelCase`
- Konstanten mit technischer Bedeutung: `UPPER_SNAKE_CASE`
- Environment-Variablen: `UPPER_SNAKE_CASE`

Beispiele:

```ts
const jwtSecret = process.env.JWT_SECRET;
const DEFAULT_PORT = 3000;
```

### 4.2 Funktionen und Methoden

- Funktionen und Methoden: `lowerCamelCase`
- Handler mit Ereignisbezug: aussagekraeftige Verben wie `handle`, `create`, `update`, `validate`, `load`
- Vermeide unpraezise Namen wie `doStuff`, `processData`, `handleIt`

Beispiele:

```ts
function validatePassword(password: string) {}
async function registerParent(email: string, password: string) {}
```

### 4.3 Klassen, Interfaces, Types und Enums

- Klassen: `UpperCamelCase`
- Interfaces: `UpperCamelCase`
- Types: `UpperCamelCase`
- Enums: `UpperCamelCase`
- Enum-Werte: `UPPER_SNAKE_CASE`

Wichtig: Kein `I`-Prefix fuer Interfaces. In TypeScript bringt das fachlich wenig und macht Namen nur kuenstlich laenger.

Beispiele:

```ts
export class AuthService {}

export type AuthenticatedUser = {
  userId: number;
  role: string;
};

export enum Role {
  PARENT = 'PARENT',
  KID = 'KID',
  ADMIN = 'ADMIN',
}
```

### 4.4 Dateien und Ordner

Datei- und Ordnernamen orientieren sich an den ueblichen NestJS-Konventionen:

- Dateien: `kebab-case`
- Klassen innerhalb der Dateien: passend zur NestJS-Rolle
- Suffixe klar verwenden, z. B. `.controller.ts`, `.service.ts`, `.module.ts`, `.entity.ts`, `.dto.ts`

Beispiele:

- `auth.controller.ts`
- `users.service.ts`
- `database.config.ts`
- `submit-quiz.dto.ts`

## 5. Strukturprinzipien fuer das Backend

Das Backend ist modular aufgebaut. Neue Funktionen sollen sich an der bestehenden NestJS-Struktur orientieren.

### 5.1 Module zuerst denken

Neue Features werden nach fachlicher Verantwortung strukturiert, nicht nach technischen Ebenen allein.

Geeignet sind zum Beispiel:

- `auth/`
- `users/`
- `learning/`
- `parents/`
- `admin/`
- `upload/`

### 5.2 Verantwortlichkeiten trennen

- `controller`: HTTP-Endpunkte und Request/Response-Ebene
- `service`: Fachlogik
- `entity`: Datenbankmodell
- `dto`: Validierte Ein- und Ausgabestrukturen
- `config`: Konfigurationslogik

Controller sollen moeglichst schlank bleiben. Fachlogik gehoert in Services, nicht in Controller-Methoden.

### 5.3 Wiederverwendung vor Duplikation

- Gemeinsame Logik zentralisieren
- Hilfsfunktionen nur dann auslagern, wenn sie wirklich mehrfach gebraucht werden
- Keine abstrahierte Struktur "auf Vorrat" bauen

## 6. TypeScript- und NestJS-Regeln

### 6.1 Typisierung

- Typisierung konsequent verwenden
- `any` vermeiden
- Rueckgabewerte komplexerer Funktionen explizit typisieren
- Fuer API-Eingaben bevorzugt DTOs statt inline definierter Objektformen verwenden

Schlecht:

```ts
login(body: any) {}
```

Besser:

```ts
login(@Body() body: LoginDto) {}
```

### 6.2 Null und Optionalitaet bewusst behandeln

- `null` und `undefined` nicht vermischen, wenn es nicht noetig ist
- optionale Felder bewusst modellieren
- Eingaben frueh validieren

### 6.3 Exceptions und Fehlermeldungen

- NestJS-Exceptions gezielt einsetzen, z. B. `BadRequestException`, `UnauthorizedException`
- Fehlermeldungen praezise und technisch klar formulieren
- Keine generischen Meldungen wie `"Something went wrong"`

Beispiel:

```ts
throw new BadRequestException('Refresh token is required.');
```

### 6.4 Abhaengigkeiten

- Nur notwendige Packages hinzufuegen
- Neue Bibliotheken muessen fachlich oder technisch begruendbar sein
- Vor dem Hinzufuegen pruefen, ob NestJS oder bestehende Utilities das Problem schon loesen

## 7. Datenbank- und Entity-Regeln

- Entity-Namen in `UpperCamelCase`
- Tabellennamen konsistent und nachvollziehbar halten
- Beziehungen eindeutig benennen
- Keine unklaren Abkuerzungen fuer Felder verwenden

Beispiele:

- gut: `parentId`, `passwordHash`, `createdAt`
- schlecht: `pid`, `pwd`, `crt`

Sicherheitsrelevante Daten duerfen nicht im Klartext gespeichert werden, wenn eine Hash- oder Schutzstrategie moeglich und sinnvoll ist.

## 8. API-Design

- Endpunkte ressourcenorientiert und konsistent benennen
- HTTP-Methoden korrekt einsetzen
- Request-Bodies validieren
- Swagger-Dokumentation aktuell halten, wenn sich API-Verhalten aendert

Beispiele:

- `POST /auth/login`
- `POST /auth/register-parent`
- `GET /auth/me`

## 9. Git-Workflow fuer ein Einzelprojekt

Da `codeKids` allein entwickelt wird, ist ein einfacher und disziplinierter Workflow sinnvoller als ein vollstaendiger Teamprozess.

### 9.1 Branch-Strategie

Empfohlen:

- `main`: stabiler Stand
- `feat/<topic>`: neue Funktion
- `fix/<topic>`: Fehlerbehebung
- `docs/<topic>`: Dokumentation
- `refactor/<topic>`: interne Umstrukturierung ohne Verhaltensaenderung

Beispiele:

- `feat/auth-login`
- `fix/jwt-refresh`
- `docs/backend-readme`

Es gibt keine Pflicht zu Pull Requests oder Reviews, da das Projekt allein bearbeitet wird. Trotzdem sollten Features nicht unstrukturiert direkt auf `main` entwickelt werden, wenn dadurch die Nachvollziehbarkeit leidet.

### 9.2 Commits

Commit-Messages sollen knapp, technisch praezise und konsistent sein.

Format:

```text
<type>(<scope>): <short imperative description>
```

Typen:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`
- `style`

Beispiele:

- `feat(auth): add parent registration endpoint`
- `fix(users): prevent null email access`
- `docs(readme): document swagger routes`
- `refactor(learning): extract progress calculation`

Issue-Nummern sind optional. Da es sich um eine Bachelorarbeit und kein Team-Backlog handelt, sind sie nur sinnvoll, wenn du tatsaechlich mit Tickets arbeitest.

## 10. Formatierung und Qualitaetssicherung

Im Projekt vorhandene Werkzeuge sollen konsequent genutzt werden:

- Formatierung: `Prettier`
- Linting: `ESLint`
- Tests: `Jest`
- e2e-Tests: `Jest` mit separater Konfiguration

Relevante Befehle:

```bash
npm run format
npm run lint
npm run test
npm run test:e2e
```

### 10.1 Vor wichtigen Commits

Vor groesseren oder fachlich abgeschlossenen Commits sollte geprueft werden:

- laeuft der Linter,
- ist der Code formatiert,
- bestehen relevante Tests,
- ist neue oder geaenderte API-Dokumentation konsistent.

## 11. Dokumentation in der Bachelorarbeit

Da `codeKids` im Rahmen einer Bachelorarbeit entsteht, ist nicht nur funktionierender Code wichtig, sondern auch dessen Begruendbarkeit.

Deshalb gilt:

- Architekturentscheidungen sollten dokumentierbar sein.
- Unnoetig komplexe Konstruktionen sind zu vermeiden.
- Technische Entscheidungen sollen nachvollziehbar und argumentierbar bleiben.
- Lesbarkeit ist wichtiger als "clevere" Kurzloesungen.

Wenn zwischen zwei Loesungen gewaehlt wird, ist in der Regel diejenige besser, die spaeter in der Arbeit einfacher erklaert und begruendet werden kann.

## 12. Zusammenfassung

Fuer das Backend von `codeKids` gelten vor allem diese Grundsaetze:

- konsistente englische Codebasis,
- klare Modulstruktur nach NestJS-Konventionen,
- einfache und nachvollziehbare Git-Historie,
- saubere Typisierung,
- sparsame, aber gute Kommentare,
- lesbarer und argumentierbarer Code fuer den Kontext einer Bachelorarbeit.
