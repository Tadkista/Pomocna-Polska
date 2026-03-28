# Struktura Bazy Danych — Pomocna Polska

Baza danych: **TiDB Cloud (MySQL)** | ORM: **Prisma**  
Plik schematu: `prisma/schema.prisma`

---

## Enumy

### `Role`
| Wartość | Opis |
|---------|------|
| `SEEKER` | Użytkownik szukający pomocy (domyślna) |
| `VOLUNTEER` | Wolontariusz oferujący pomoc |

### `HelpType`
| Wartość | Opis |
|---------|------|
| `IN_PERSON` | Pomoc na miejscu (domyślna) |
| `REMOTE` | Pomoc zdalna (telefon, wideo) |

### `RequestStatus`
| Wartość | Opis |
|---------|------|
| `OPEN` | Zgłoszenie otwarte, czeka na wolontariusza (domyślna) |
| `IN_PROGRESS` | Wolontariusz przyjął i realizuje |
| `COMPLETED` | Pomoc udzielona, zakończone |
| `CANCELLED` | Anulowane przez autora |

---

## Tabela: `User`

Przechowuje wszystkich zarejestrowanych użytkowników — seniorów i wolontariuszy.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|-------------|------|
| `id` | `String` | PK, `uuid()` | Unikalny identyfikator użytkownika |
| `phoneNumber` | `String?` | UNIQUE, nullable | Numer telefonu (opcjonalny) |
| `email` | `String?` | UNIQUE, nullable | Adres e-mail (opcjonalny) |
| `password` | `String?` | nullable | Hasło (hashowane, opcjonalne) |
| `name` | `String` | wymagane | Imię i nazwisko |
| `role` | `Role` | domyślnie `SEEKER` | Rola użytkownika |
| `avatarUrl` | `String?` | nullable | URL zdjęcia profilowego |
| `createdAt` | `DateTime` | `now()` | Data rejestracji |
| `updatedAt` | `DateTime` | auto-update | Data ostatniej zmiany |

**Relacje wychodzące:**
- `requests` → `HelpRequest[]` — zgłoszenia stworzone przez tego użytkownika
- `assignedTasks` → `HelpRequest[]` — zgłoszenia przyjęte jako wolontariusz
- `sentMessages` → `Message[]` — wysłane wiadomości
- `notifications` → `Notification[]` — powiadomienia

---

## Tabela: `HelpRequest`

Główna tabela aplikacji. Każdy rekord to jedno ogłoszenie z prośbą o pomoc.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|-------------|------|
| `id` | `String` | PK, `uuid()` | Unikalny identyfikator zgłoszenia |
| `title` | `String` | wymagane | Krótki tytuł ogłoszenia |
| `description` | `String` | `TEXT`, wymagane | Szczegółowy opis potrzeby |
| `type` | `HelpType` | domyślnie `IN_PERSON` | Typ pomocy |
| `status` | `RequestStatus` | domyślnie `OPEN` | Aktualny status zgłoszenia |
| `latitude` | `Float?` | nullable | Szerokość geograficzna (GPS) |
| `longitude` | `Float?` | nullable | Długość geograficzna (GPS) |
| `address` | `String?` | nullable | Adres tekstowy (ulica, miasto) |
| `createdAt` | `DateTime` | `now()` | Data utworzenia |
| `updatedAt` | `DateTime` | auto-update | Data ostatniej zmiany |
| `authorId` | `String` | FK → `User.id` | Kto stworzył zgłoszenie |
| `volunteerId` | `String?` | FK → `User.id`, nullable | Kto przyjął zgłoszenie |

**Indeksy:**
- `@@index([authorId])` — szybkie pobieranie zgłoszeń użytkownika
- `@@index([volunteerId])` — szybkie pobieranie zadań wolontariusza

**Relacje wychodzące:**
- `author` → `User` (AuthorRequests)
- `volunteer` → `User?` (AssignedVolunteer)
- `messages` → `Message[]` — wątek czatu dla tego zgłoszenia

---

## Tabela: `Message`

Wiadomości wymienianie w ramach konkretnego zgłoszenia (czat senior ↔ wolontariusz).

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|-------------|------|
| `id` | `String` | PK, `uuid()` | Unikalny identyfikator wiadomości |
| `body` | `String` | `TEXT`, wymagane | Treść wiadomości |
| `createdAt` | `DateTime` | `now()` | Data wysłania |
| `senderId` | `String` | FK → `User.id` | Kto wysłał wiadomość |
| `requestId` | `String` | FK → `HelpRequest.id` | Do którego zgłoszenia należy |

**Indeksy:**
- `@@index([senderId])` — wiadomości konkretnego użytkownika
- `@@index([requestId])` — cały wątek czatu dla zgłoszenia

---

## Tabela: `Notification`

Powiadomienia systemowe (np. "ktoś przyjął Twoje zgłoszenie").

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|-------------|------|
| `id` | `String` | PK, `uuid()` | Unikalny identyfikator powiadomienia |
| `title` | `String` | wymagane | Tytuł powiadomienia |
| `body` | `String` | wymagane | Treść powiadomienia |
| `read` | `Boolean` | domyślnie `false` | Czy użytkownik odczytał |
| `createdAt` | `DateTime` | `now()` | Data wysłania |
| `userId` | `String` | FK → `User.id` | Odbiorca powiadomienia |

**Indeksy:**
- `@@index([userId])` — szybkie pobieranie powiadomień użytkownika

---

## Diagram Relacji

```
User (1) ──────────────────────── (N) HelpRequest [jako autor]
User (1) ──────────────────────── (N) HelpRequest [jako wolontariusz]
User (1) ──────────────────────── (N) Message
User (1) ──────────────────────── (N) Notification
HelpRequest (1) ────────────────── (N) Message
```

---

## Przykłady Zapytań (Prisma)

```ts
// Pobierz wszystkie otwarte zgłoszenia z autorem
const requests = await prisma.helpRequest.findMany({
  where: { status: "OPEN" },
  include: { author: true },
  orderBy: { createdAt: "desc" },
});

// Pobierz historię zgłoszeń użytkownika
const history = await prisma.helpRequest.findMany({
  where: { authorId: userId },
});

// Dodaj wiadomość w wątku zgłoszenia
const msg = await prisma.message.create({
  data: { body: "Chętnie pomogę!", senderId, requestId },
});

// Oznacz powiadomienie jako przeczytane
await prisma.notification.update({
  where: { id: notifId },
  data: { read: true },
});
```
