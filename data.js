// =====================================================
//  Adatok: kategóriák és kezdő sablonok
//  Ha új sablont akarsz (pl. "Esküvői videó"), itt add hozzá a PRESETS-hez.
// =====================================================

// Kategóriák: név, szín (a style.css változóiból), és a magyarázat az ügyfélnek ("Miért ennyi?")
const CATS = {
  prep:   { name: "Előkészítés",        color: "var(--c6)", why: "Helyszínfelmérés, útvonal megtervezése, egyeztetés. Egy FPV repülés csak akkor egy snitt, ha előre be van gyakorolva." },
  shoot:  { name: "Forgatás / fotózás", color: "var(--c1)", why: "A helyszínen töltött idő. Sokszor több take kell egy tökéletes, megszakítás nélküli repüléshez." },
  post:   { name: "Utómunka",           color: "var(--c2)", why: "A vágás, stabilizálás és színezés általában 2-3× annyi idő, mint maga a forgatás." },
  gear:   { name: "Felszerelés",        color: "var(--c4)", why: "A drón, akkuk, propellerek és kamera kopnak. Egy FPV drón egy ütközésnél tönkremehet, ennek a kockázatát is fedezni kell." },
  travel: { name: "Kiszállás",          color: "var(--c3)", why: "Üzemanyag és az utazással töltött idő." },
  other:  { name: "Egyéb",              color: "var(--c5)", why: "Zenelicenc, extra formátumok, javítási körök." },
};

// A kategóriák sorrendje az ajánlaton
const CAT_ORDER = ["prep", "shoot", "post", "gear", "travel", "other"];

// Sablonok. Egy sor: [kategória, megnevezés, magyarázat, mennyiség, egység, egységár]
const PRESETS = {
  "FPV house tour": [
    ["prep",  "Helyszínfelmérés és repülési útvonal", "Bejárás, akadályok felmérése, egyeztetés a tulajjal", 1, "alk.", 150],
    ["shoot", "FPV repülés", "Több take a folyamatos, egy snittes bejáráshoz", 2, "óra", 250],
    ["gear",  "Drón akkuciklus és kopás", "Akkuk, propellerek, alkatrészek amortizációja", 8, "akku", 15],
    ["post",  "Vágás és stabilizálás", "Gyroflow stabilizálás, snittek összevágása", 4, "óra", 100],
    ["post",  "Színkorrekció (color grading)", "Egységes, élénk, de természetes színek", 1, "videó", 150],
    ["post",  "Függőleges változat (Reels/TikTok)", "9:16 újravágás közösségi médiához", 1, "db", 100],
    ["other", "Jogtiszta zene licenc", "Kereskedelmi felhasználásra", 1, "db", 50],
  ],
  "Ingatlanfotó": [
    ["prep",  "Egyeztetés, helyszín előkészítés", "Fényviszonyok, időpont kiválasztása", 1, "alk.", 50],
    ["shoot", "Fotózás a helyszínen", "Belső és külső terek", 2, "óra", 150],
    ["post",  "Képszerkesztés (HDR, korrekció)", "Expozíció, egyenesítés, színek", 25, "kép", 15],
    ["gear",  "Felszerelés használat", "Váz, objektívek, állvány, vaku", 1, "alk.", 60],
  ],
  "Promóvideó": [
    ["prep",  "Koncepció és forgatókönyv", "Ötlet, snittlista, ütemterv", 3, "óra", 80],
    ["shoot", "Videóforgatás", "Kamera, hang, világítás", 4, "óra", 200],
    ["shoot", "Drón légifelvételek", "Normál (nem FPV) drón", 1, "óra", 200],
    ["gear",  "Felszerelés használat", "Kamera, gimbal, mikrofon, fények", 1, "nap", 150],
    ["post",  "Vágás", "1–2 perces végső videó", 8, "óra", 100],
    ["post",  "Színezés és hangkeverés", "", 1, "videó", 250],
    ["other", "Jogtiszta zene licenc", "", 1, "db", 50],
  ],
};
