// =====================================================
//  Adatok: kategóriák, egységek és kezdő sablonok – három nyelven (hu / ro / en)
//  Ha új sablont akarsz (pl. "Esküvői videó"), a PRESETS listához add hozzá.
//  A kategóriák neve és magyarázata (a "Miért ennyi?" szövegek) az i18n.js-ben van.
// =====================================================

const LANGS = ["hu", "ro", "en"];

// Kategóriák színei (a style.css változóiból) és sorrendjük az ajánlaton
const CATS = {
  prep:   { color: "var(--c6)" },
  shoot:  { color: "var(--c1)" },
  post:   { color: "var(--c2)" },
  gear:   { color: "var(--c4)" },
  travel: { color: "var(--c3)" },
  other:  { color: "var(--c5)" },
};
const CAT_ORDER = ["prep", "shoot", "post", "gear", "travel", "other"];

// Mértékegységek három nyelven
const UNITS = {
  visit: { hu: "alkalom", ro: "vizită",  en: "visit" },
  hour:  { hu: "óra",     ro: "h",       en: "h" },
  batt:  { hu: "akku",    ro: "baterii", en: "batteries" },
  pcs:   { hu: "db",      ro: "buc.",    en: "pcs" },
  video: { hu: "videó",   ro: "video",   en: "video" },
  photo: { hu: "kép",     ro: "foto",    en: "photos" },
  day:   { hu: "nap",     ro: "zi",      en: "day" },
};

// Sablonok. Egy tétel: [kategória, { hu: [megnevezés, magyarázat], ro: [...], en: [...] }, mennyiség, egység, egységár]
const PRESETS = [
  {
    id: "fpv",
    name: { hu: "FPV house tour", ro: "Tur FPV al casei", en: "FPV house tour" },
    items: [
      ["prep", {
        hu: ["Helyszínfelmérés és útvonaltervezés", "Bejárás, akadályok felmérése, egyeztetés a tulajdonossal"],
        ro: ["Vizită la locație și planificarea traseului", "Inspecție, identificarea obstacolelor, discuție cu proprietarul"],
        en: ["Site visit and flight planning", "Walkthrough, obstacle check, briefing with the owner"] }, 1, "visit", 150],
      ["shoot", {
        hu: ["FPV repülés", "Több felvétel, hogy a bejárás egyetlen folyamatos repülés legyen"],
        ro: ["Zbor FPV", "Mai multe încercări, pentru ca turul să fie un singur zbor continuu"],
        en: ["FPV flight", "Several takes so the tour is one continuous flight"] }, 2, "hour", 250],
      ["gear", {
        hu: ["Drón akkumulátorok és alkatrészek kopása", "Akkumulátorok, propellerek és alkatrészek elhasználódása"],
        ro: ["Uzura bateriilor și a pieselor dronei", "Uzura bateriilor, elicelor și a componentelor"],
        en: ["Drone battery and parts wear", "Wear on batteries, propellers and components"] }, 8, "batt", 15],
      ["post", {
        hu: ["Vágás és stabilizálás", "A remegés eltüntetése és a jelenetek összevágása"],
        ro: ["Montaj și stabilizare", "Eliminarea vibrațiilor și montajul cadrelor"],
        en: ["Editing and stabilisation", "Removing shake and cutting the shots together"] }, 4, "hour", 100],
      ["post", {
        hu: ["Színkorrekció", "Egységes, élénk, de természetes színek"],
        ro: ["Corecție de culoare", "Culori unitare, vii, dar naturale"],
        en: ["Colour correction", "Consistent, vivid but natural colours"] }, 1, "video", 150],
      ["post", {
        hu: ["Álló változat (Reels/TikTok)", "Telefonra (9:16) újravágott változat közösségi médiához"],
        ro: ["Versiune verticală (Reels/TikTok)", "Versiune remontată pentru telefon (9:16), pentru social media"],
        en: ["Vertical version (Reels/TikTok)", "Re-edited for phones (9:16) for social media"] }, 1, "pcs", 100],
    ],
  },
  {
    id: "photo",
    name: { hu: "Ingatlanfotó", ro: "Fotografie imobiliară", en: "Real estate photos" },
    items: [
      ["prep", {
        hu: ["Egyeztetés és előkészítés", "A fényviszonyok és a legjobb időpont kiválasztása"],
        ro: ["Consultare și pregătire", "Alegerea luminii și a celui mai bun moment"],
        en: ["Consultation and preparation", "Choosing the light and the best time"] }, 1, "visit", 50],
      ["shoot", {
        hu: ["Fotózás a helyszínen", "Belső és külső terek"],
        ro: ["Fotografiere la fața locului", "Spații interioare și exterioare"],
        en: ["On-site photography", "Interior and exterior spaces"] }, 2, "hour", 150],
      ["post", {
        hu: ["Képszerkesztés", "Fények, színek és egyenes vonalak javítása (HDR)"],
        ro: ["Editare foto", "Corectarea luminii, a culorilor și a liniilor drepte (HDR)"],
        en: ["Photo editing", "Light, colour and straight-line correction (HDR)"] }, 25, "photo", 15],
      ["gear", {
        hu: ["Felszerelés", "Fényképezőgép, objektívek, állvány, vaku"],
        ro: ["Echipament", "Aparat foto, obiective, trepied, blitz"],
        en: ["Equipment", "Camera, lenses, tripod, flash"] }, 1, "visit", 60],
    ],
  },
  {
    id: "promo",
    name: { hu: "Promóvideó", ro: "Video de prezentare", en: "Promo video" },
    items: [
      ["prep", {
        hu: ["Koncepció és forgatókönyv", "Ötlet, jelenetlista, ütemterv"],
        ro: ["Concept și scenariu", "Idee, listă de cadre, program"],
        en: ["Concept and script", "Idea, shot list, schedule"] }, 3, "hour", 80],
      ["shoot", {
        hu: ["Videóforgatás", "Kamera, hang, világítás"],
        ro: ["Filmare video", "Cameră, sunet, lumini"],
        en: ["Video shoot", "Camera, sound, lighting"] }, 4, "hour", 200],
      ["shoot", {
        hu: ["Drónos légifelvételek", "Hagyományos (nem FPV) drónnal"],
        ro: ["Filmări aeriene cu drona", "Cu dronă clasică (nu FPV)"],
        en: ["Aerial drone footage", "With a standard (non-FPV) drone"] }, 1, "hour", 200],
      ["gear", {
        hu: ["Felszerelés", "Kamera, stabilizátor (gimbal), mikrofon, lámpák"],
        ro: ["Echipament", "Cameră, stabilizator (gimbal), microfon, lumini"],
        en: ["Equipment", "Camera, stabiliser (gimbal), microphone, lights"] }, 1, "day", 150],
      ["post", {
        hu: ["Vágás", "1–2 perces kész videó"],
        ro: ["Montaj", "Video final de 1–2 minute"],
        en: ["Editing", "Finished 1–2 minute video"] }, 8, "hour", 100],
      ["post", {
        hu: ["Színkorrekció és hangkeverés", ""],
        ro: ["Corecție de culoare și mixaj audio", ""],
        en: ["Colour correction and sound mix", ""] }, 1, "video", 250],
    ],
  },
];

// Régi, kevésbé érthető szövegek -> új szövegek.
// Ha a böngésződben még a régi tételnevek vannak elmentve, induláskor ezekre cseréljük őket (az áraid maradnak).
const TEXT_FIXES = {
  "Helyszínfelmérés és repülési útvonal": "Helyszínfelmérés és útvonaltervezés",
  "Bejárás, akadályok felmérése, egyeztetés a tulajjal": "Bejárás, akadályok felmérése, egyeztetés a tulajdonossal",
  "alk.": "alkalom",
  "Több take a folyamatos, egy snittes bejáráshoz": "Több felvétel, hogy a bejárás egyetlen folyamatos repülés legyen",
  "Drón akkuciklus és kopás": "Drón akkumulátorok és alkatrészek kopása",
  "Akkuk, propellerek, alkatrészek amortizációja": "Akkumulátorok, propellerek és alkatrészek elhasználódása",
  "Gyroflow stabilizálás, snittek összevágása": "A remegés eltüntetése és a jelenetek összevágása",
  "Színkorrekció (color grading)": "Színkorrekció",
  "Függőleges változat (Reels/TikTok)": "Álló változat (Reels/TikTok)",
  "9:16 újravágás közösségi médiához": "Telefonra (9:16) újravágott változat közösségi médiához",
  "Egyeztetés, helyszín előkészítés": "Egyeztetés és előkészítés",
  "Fényviszonyok, időpont kiválasztása": "A fényviszonyok és a legjobb időpont kiválasztása",
  "Képszerkesztés (HDR, korrekció)": "Képszerkesztés",
  "Expozíció, egyenesítés, színek": "Fények, színek és egyenes vonalak javítása (HDR)",
  "Felszerelés használat": "Felszerelés",
  "Váz, objektívek, állvány, vaku": "Fényképezőgép, objektívek, állvány, vaku",
  "Kamera, gimbal, mikrofon, fények": "Kamera, stabilizátor (gimbal), mikrofon, lámpák",
  "1–2 perces végső videó": "1–2 perces kész videó",
  "Színezés és hangkeverés": "Színkorrekció és hangkeverés",
  "Drón légifelvételek": "Drónos légifelvételek",
  "Normál (nem FPV) drón": "Hagyományos (nem FPV) drónnal",
  "Ötlet, snittlista, ütemterv": "Ötlet, jelenetlista, ütemterv",
};

// Kivett tételek: ha a böngésződben még el vannak mentve, induláskor kivesszük őket a félkész ajánlatból
// (a Munkáim közé már elmentett ajánlatokhoz nem nyúlunk)
const REMOVED_ITEMS = ["Jogtiszta zene", "Jogtiszta zene licenc"];
