# TimeAway — Przewodnik Deploy (Firebase + GitHub Pages)

## Architektura

```
GitHub Pages (frontend React)
    ↓ czyta/pisze dane
Firebase Firestore (baza danych)
    ↓ OAuth callback
Firebase Function: discordCallback
    ↓ wymiana kodu na token
Discord API
```

## Wymagania wstępne
- Konto GitHub
- Konto Firebase (darmowy plan Spark wystarczy, ale Functions wymaga Blaze — pay-as-you-go, praktycznie darmowe przy małym ruchu)
- Aplikacja Discord w [Discord Developer Portal](https://discord.com/developers/applications)
- Node.js 20+, yarn, firebase-cli

---

## Krok 1 — Utwórz projekt Firebase

1. Wejdź na [console.firebase.google.com](https://console.firebase.google.com)
2. Kliknij **Add project** → wpisz nazwę np. `timeaway`
3. Po utworzeniu kliknij **Firestore Database** → **Create database** → wybierz region → tryb **production** (rules wgrasz za chwilę)
4. Kliknij **Project Overview** (ikona koła zębatego) → **Project settings** → zakładka **Your apps** → dodaj **Web app** (ikona `</>`)
5. Skopiuj obiekt `firebaseConfig` — potrzebujesz tych wartości do `.env.local`

---

## Krok 2 — Skonfiguruj Discord OAuth

1. Wejdź na [discord.com/developers/applications](https://discord.com/developers/applications) → **New Application**
2. Zakładka **OAuth2** → skopiuj **Client ID** i **Client Secret**
3. W polu **Redirects** dodaj URL Firebase Function (wygląda tak):
   ```
   https://us-central1-TWOJ_PROJECT_ID.cloudfunctions.net/discordCallback
   ```
   *(dokładny URL poznasz po deployu funkcji — możesz dodać go później)*

---

## Krok 3 — Zainstaluj Firebase CLI i zaloguj się

```bash
npm install -g firebase-tools
firebase login
```

---

## Krok 4 — Wgraj Firebase Functions

```bash
# W katalogu projektu:
cd functions
npm install
cd ..

# Ustaw sekrety dla funkcji:
firebase functions:secrets:set DISCORD_CLIENT_ID
# → wklej Client ID z Discord Dev Portal

firebase functions:secrets:set DISCORD_CLIENT_SECRET
# → wklej Client Secret

# Ustaw URL frontendu (GitHub Pages URL):
# Na razie możesz pominąć i wrócić po kroku 6

# Deploy funkcji:
firebase deploy --only functions
```

Po deployu Firebase pokaże URL funkcji, np.:
```
✔ functions[discordCallback]: https://us-central1-twoj-project.cloudfunctions.net/discordCallback
```

**Skopiuj ten URL** — potrzebujesz go w kroku 5 i w Discord Dev Portal.

Wróć do Discord Dev Portal → OAuth2 → Redirects → dodaj ten URL jeśli jeszcze nie dodałeś.

---

## Krok 5 — Wgraj reguły Firestore

```bash
firebase deploy --only firestore
```

---

## Krok 6 — Utwórz repozytorium GitHub i wgraj kod

```bash
# Inicjalizuj git w katalogu projektu:
git init
git add .
git commit -m "Initial TimeAway Firebase version"

# Utwórz repo na GitHub (np. timeaway), a potem:
git remote add origin https://github.com/TWOJ_USERNAME/TWOJE_REPO.git
git push -u origin main
```

---

## Krok 7 — Skonfiguruj GitHub Secrets

W repozytorium GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Dodaj każdy z tych sekretów (wartości z kroku 1 i 2):

| Secret Name | Wartość |
|---|---|
| `REACT_APP_FIREBASE_API_KEY` | z Firebase config |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | z Firebase config |
| `REACT_APP_FIREBASE_PROJECT_ID` | z Firebase config |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | z Firebase config |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | z Firebase config |
| `REACT_APP_FIREBASE_APP_ID` | z Firebase config |
| `REACT_APP_DISCORD_CLIENT_ID` | Client ID z Discord |
| `REACT_APP_FUNCTIONS_URL` | URL funkcji z kroku 4 |

---

## Krok 8 — Włącz GitHub Pages

W repozytorium GitHub: **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: **gh-pages** / root

Przy pierwszym pushu do `main` GitHub Actions automatycznie zbuduje i wdroży frontend.

Twoja strona będzie dostępna pod:
```
https://TWOJ_USERNAME.github.io/TWOJE_REPO
```

---

## Krok 9 — Ustaw URL frontendu w funkcji (opcjonalne ale zalecane)

Jeżeli chcesz aby funkcja redirectowała do Twojego GitHub Pages URL:

```bash
firebase functions:config:set frontend.url="https://TWOJ_USERNAME.github.io/TWOJE_REPO"
firebase deploy --only functions
```

Lub dodaj zmienną środowiskową `FRONTEND_URL` w konsoli Firebase.

---

## Krok 10 — Inicjalizacja haseł w Firestore

Przy pierwszym uruchomieniu aplikacja automatycznie stworzy dokument `config/settings` z domyślnymi hasłami:
- **Hasło do strony**: `timeaway123`
- **Hasło moderatora**: `mod123`

**Zmień je natychmiast po pierwszym logowaniu!** (Panel moderatora → Ustawienia)

---

## Struktura plików

```
timeaway-firebase/
├── src/
│   ├── lib/
│   │   ├── firebase.js          ← inicjalizacja Firebase SDK
│   │   └── firestoreApi.js      ← wszystkie operacje na danych (zastępuje backend)
│   ├── pages/
│   │   ├── LoginPage.jsx        ← logowanie (hasło + Discord OAuth)
│   │   ├── DashboardPage.jsx    ← kalendarz użytkownika
│   │   ├── ModeratorPage.jsx    ← panel moderatora
│   │   └── AuthCallback.jsx     ← obsługa powrotu z Discord
│   └── App.js                   ← routing
├── functions/
│   ├── index.js                 ← Firebase Function (Discord OAuth)
│   └── package.json
├── .github/workflows/deploy.yml ← automatyczny deploy do GitHub Pages
├── .env.example                 ← szablon zmiennych środowiskowych
├── firebase.json
├── firestore.rules
└── firestore.indexes.json
```

---

## Debugowanie

**Funkcja nie działa:**
```bash
firebase functions:log
```

**Build frontendu nie przechodzi:**
- Sprawdź czy wszystkie GitHub Secrets są ustawione

**Discord redirect_uri mismatch:**
- Upewnij się że URL w Discord Dev Portal DOKŁADNIE zgadza się z URL funkcji (łącznie z `https://`)

**Dane nie pojawiają się:**
- Sprawdź Firestore Console czy kolekcje `users`, `absences`, `config` istnieją
- Sprawdź reguły Firestore (firebase deploy --only firestore:rules)
