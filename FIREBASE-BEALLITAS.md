# Munkáim – Firebase beállítás (egyszer kell, kb. 5 perc)

Az AlexFPV Studio **saját** Firebase projektet kap, a FoodShare-től teljesen külön.

## 1. Új projekt
1. https://console.firebase.google.com → **Create a project** (vagy **Add project**)
2. Név: `alexfpv-studio` → Continue → Google Analytics: **kikapcsolhatod** → **Create project**

## 2. Webes app és a config
1. A projekt főoldalán kattints a **`</>`** (Web) ikonra.
2. App nickname: `AlexFPV Studio` → **Register app** (a Hosting pipát NEM kell bepipálni).
3. Megjelenik egy kódrész `const firebaseConfig = { apiKey: ..., ... }` – **ezt másold ki, és küldd el Claude-nak**,
   vagy írd be te a `firebase-config.js` fájlba a `const FIREBASE_CONFIG = null;` helyére.

## 3. Adatbázis
1. Bal oldalt **Build → Firestore Database** → **Create database**
2. Helyszín: `eur3 (europe-west)` vagy `europe-west3 (Frankfurt)` → **Next**
3. **Start in production mode** → **Create**
4. Fent a **Rules** fül → törölj ki mindent → másold be a `firestore.rules` fájl tartalmát → **Publish**

## 4. Bejelentkezés
1. **Build → Authentication** → **Get started**
2. **Sign-in method** fül → **Email/Password** → az első kapcsolót kapcsold be → **Save**
3. **Users** fül → **Add user**
   - Email: `alexcmedia1@gmail.com` (ha mást írsz, a `firestore.rules`-ban is írd át!)
   - Password: egy erős jelszó, amit megjegyzel → **Add user**

## 5. A GitHub-os cím engedélyezése
**Authentication → Settings → Authorized domains → Add domain** → `FELHASZNALONEV.github.io`
(a `localhost` és a `127.0.0.1` már alapból benne van, így a Live Serverrel is megy)

## Kész
Nyisd meg az oldalt → **Munkáim** fül → lépj be. Telefonon is egyszer be kell lépni, utána bent maradsz.

Az ingyenes Firebase csomag (Spark) bőven elég: naponta 50 000 olvasás és 20 000 írás.
