// =====================================================
//  Fordítások (i18n = "internationalization")
//
//  Két külön nyelv van:
//   1. Az APP nyelve (gombok, menük)   -> UI szótár,  t("kulcs")
//   2. Az AJÁNLAT nyelve (amit az ügyfél lát, a PDF) -> DOC szótár, d("kulcs")
//
//  A HTML-ben a data-i18n="kulcs" jelölésű elemek szövegét az applyUI() cseréli ki,
//  a data-i18n-ph="kulcs" pedig a halvány súgószöveget (placeholder).
//  Szövegben a {n} jellegű helyekre érték kerül: t("paidJobs", { n: 3 })
// =====================================================

const UI = {
  hu: {
    splash: "AlexFPV Studio…",
    loginTitle: "Belépés", loginHint: "Eszközönként egyszer kell belépned, utána bent maradsz.",
    email: "E-mail", password: "Jelszó", loginBtn: "Belépés", forgot: "Elfelejtett jelszó",
    loggingIn: "Belépés…", resetSent: "Elküldtem a jelszó-visszaállító levelet. Nézd meg a postafiókodat (a spam mappát is).",
    tabEditor: "Új ajánlat", tabJobs: "Munkáim", install: "📲 Telepítés appként", appLang: "Az app nyelve",
    secBasics: "Alapadatok", fMe: "A te neved / márkád", fContact: "Elérhetőség", fClient: "Ügyfél", phClient: "Ügyfél neve",
    fProject: "Projekt", phProject: "pl. FPV house tour – helyszín", fCur: "Pénznem", fValid: "Ajánlat érvényes (nap)",
    fDocLang: "Ajánlat nyelve", hintDocLang: "Ezen a nyelven készül az ajánlat és a PDF. Váltáskor a sablontételek lefordulnak, a saját tételeidet neked kell átírnod.",
    secPresets: "Kezdő sablon", hintPresets: "A sablon lecseréli a tételeket. Utána bármit átírhatsz.",
    secItems: "Tételek", colCat: "Kategória", colName: "Megnevezés", colQty: "Menny.", colUnit: "Egység", colPrice: "Egységár",
    phName: "Megnevezés", phDesc: "Rövid magyarázat az ügyfélnek (nem kötelező)", addItem: "+ Új tétel", delItem: "Tétel törlése",
    secMods: "Kiszállás és módosítók", fKm: "Távolság oda-vissza (km)", fKmRate: "Díj / km", fRush: "Sürgős leadás felár (%)", fDisc: "Kedvezmény (%)",
    secNote: "Megjegyzés az ügyfélnek",
    btnSave: "💾 Mentés a munkáim közé", btnSaveChanges: "💾 Változások mentése", btnPdf: "📄 PDF mentése / küldése",
    btnPrint: "🖨️ Nyomtatás", btnCopy: "Másolás szövegként",
    editing: "✏️ Szerkeszted:", unnamed: "névtelen ügyfél", newInstead: "+ Új ajánlat helyette",
    tNewKept: "Új ajánlat. A régi munka megmaradt a Munkáim között.",
    tNotConfigured: "A Munkáim még nincs beállítva (FIREBASE-BEALLITAS.md).",
    tNeedLogin: "A mentéshez internet és belépés kell. Próbáld újra kicsit később.",
    tNeedClient: "Írd be az ügyfél nevét, hogy megtaláld a listában.",
    tSaved: "Mentve a munkáid közé.", tOpened: "Megnyitva. Javítsd, majd nyomd meg a „Változások mentése” gombot.",
    tDuplicated: "Másolat kész. Írd be az új ügyfelet, és mentsd el.",
    tCopied: "Kimásolva. Beillesztheted üzenetbe vagy e-mailbe.", tCopyFail: "Nem sikerült a másolás ezen az eszközön.",
    tPdfMaking: "PDF készül…", tPdfDone: "Kész.", tPdfDownloaded: "PDF letöltve: ", tPdfFail: "Nem sikerült a PDF készítése.",
    tPdfTap: "📤 PDF kész – koppints a megosztáshoz",
    statPaid: "Befolyt", paidJobs: "{n} fizetett munka", statWaiting: "Fizetésre vár", waitingJobs: "{n} elfogadott vagy kész munka",
    statOpen: "Nyitott ajánlat", openCount: "{n} db", openSub: "még nem jött rá válasz",
    phSearch: "Keresés ügyfélre vagy projektre…", allStatuses: "Minden állapot", jobsNew: "+ Új ajánlat",
    loggedIn: "Belépve: ", logout: "Kijelentkezés",
    loadingJobs: "Munkák betöltése…",
    noJobs: "<b>Még nincs elmentett munkád.</b><br>Készíts egy ajánlatot az „Új ajánlat” fülön, és nyomd meg a „💾 Mentés a munkáim közé” gombot.",
    noMatch: "Nincs a keresésnek megfelelő munka.",
    open: "Megnyitás", dup: "Másolat", del: "Törlés", confirmDel: "Biztos törlöd?", yesDel: "Igen, törlöm", cancel: "Mégse", status: "Állapot",
    st_ajanlat: "Ajánlat kiküldve", st_elfogadva: "Elfogadva", st_kesz: "Kész, fizetésre vár", st_fizetve: "Fizetve", st_elutasitva: "Elutasítva",
    eBadLogin: "Hibás e-mail vagy jelszó.", eNoUser: "Nincs ilyen felhasználó. Hozd létre a Firebase konzolban: Authentication → Users → Add user.",
    eTooMany: "Túl sok próbálkozás. Várj pár percet, és próbáld újra.", eNetwork: "Nincs internet. Próbáld újra, ha lesz kapcsolat.",
    ePermission: "A Firebase nem engedi: a szabályok (firestore.rules) még nincsenek beállítva, vagy nem a saját fiókoddal léptél be.",
    eGeneric: "Hiba történt: ",
    mNotConfigured: "A Munkáim még nincs beállítva. Kövesd a FIREBASE-BEALLITAS.md lépéseit.",
    mOffline: "Nincs internet, ezért a munkáid most nem tölthetők be. A kalkulátor és a PDF így is működik.",
    mSlow: "A felhő nem válaszol. A kalkulátor működik, a munkáid később töltődnek be.",
  },
  ro: {
    splash: "AlexFPV Studio…",
    loginTitle: "Autentificare", loginHint: "Te autentifici o singură dată pe fiecare dispozitiv, apoi rămâi conectat.",
    email: "E-mail", password: "Parolă", loginBtn: "Intră", forgot: "Am uitat parola",
    loggingIn: "Se conectează…", resetSent: "Am trimis e-mailul de resetare a parolei. Verifică-ți căsuța (și folderul spam).",
    tabEditor: "Ofertă nouă", tabJobs: "Lucrările mele", install: "📲 Instalează aplicația", appLang: "Limba aplicației",
    secBasics: "Date de bază", fMe: "Numele / brandul tău", fContact: "Contact", fClient: "Client", phClient: "Numele clientului",
    fProject: "Proiect", phProject: "ex. tur FPV – locație", fCur: "Monedă", fValid: "Ofertă valabilă (zile)",
    fDocLang: "Limba ofertei", hintDocLang: "Oferta și PDF-ul se fac în această limbă. La schimbare, elementele din șablon se traduc automat, pe cele scrise de tine trebuie să le traduci tu.",
    secPresets: "Șablon", hintPresets: "Șablonul înlocuiește elementele. Apoi poți modifica orice.",
    secItems: "Elemente", colCat: "Categorie", colName: "Denumire", colQty: "Cant.", colUnit: "Unitate", colPrice: "Preț unitar",
    phName: "Denumire", phDesc: "Scurtă explicație pentru client (opțional)", addItem: "+ Element nou", delItem: "Șterge elementul",
    secMods: "Deplasare și ajustări", fKm: "Distanță dus-întors (km)", fKmRate: "Tarif / km", fRush: "Supliment urgență (%)", fDisc: "Reducere (%)",
    secNote: "Notă pentru client",
    btnSave: "💾 Salvează în lucrările mele", btnSaveChanges: "💾 Salvează modificările", btnPdf: "📄 Salvează / trimite PDF",
    btnPrint: "🖨️ Printează", btnCopy: "Copiază ca text",
    editing: "✏️ Editezi:", unnamed: "client fără nume", newInstead: "+ Ofertă nouă în loc",
    tNewKept: "Ofertă nouă. Lucrarea veche a rămas în Lucrările mele.",
    tNotConfigured: "Lucrările mele nu sunt încă configurate (FIREBASE-BEALLITAS.md).",
    tNeedLogin: "Pentru salvare ai nevoie de internet și autentificare. Încearcă puțin mai târziu.",
    tNeedClient: "Scrie numele clientului, ca să-l găsești în listă.",
    tSaved: "Salvat în lucrările tale.", tOpened: "Deschis. Corectează, apoi apasă „Salvează modificările”.",
    tDuplicated: "Copie creată. Scrie noul client și salvează.",
    tCopied: "Copiat. Îl poți lipi într-un mesaj sau e-mail.", tCopyFail: "Copierea nu a reușit pe acest dispozitiv.",
    tPdfMaking: "Se creează PDF-ul…", tPdfDone: "Gata.", tPdfDownloaded: "PDF descărcat: ", tPdfFail: "Nu s-a putut crea PDF-ul.",
    tPdfTap: "📤 PDF gata – atinge pentru a-l trimite",
    statPaid: "Încasat", paidJobs: "{n} lucrări plătite", statWaiting: "De încasat", waitingJobs: "{n} lucrări acceptate sau finalizate",
    statOpen: "Oferte deschise", openCount: "{n}", openSub: "fără răspuns încă",
    phSearch: "Caută după client sau proiect…", allStatuses: "Toate stările", jobsNew: "+ Ofertă nouă",
    loggedIn: "Conectat: ", logout: "Deconectare",
    loadingJobs: "Se încarcă lucrările…",
    noJobs: "<b>Încă nu ai nicio lucrare salvată.</b><br>Fă o ofertă în fila „Ofertă nouă” și apasă „💾 Salvează în lucrările mele”.",
    noMatch: "Nicio lucrare nu corespunde căutării.",
    open: "Deschide", dup: "Duplică", del: "Șterge", confirmDel: "Sigur ștergi?", yesDel: "Da, șterge", cancel: "Anulează", status: "Stare",
    st_ajanlat: "Ofertă trimisă", st_elfogadva: "Acceptată", st_kesz: "Finalizată, de încasat", st_fizetve: "Plătită", st_elutasitva: "Refuzată",
    eBadLogin: "E-mail sau parolă greșită.", eNoUser: "Utilizatorul nu există. Creează-l în consola Firebase: Authentication → Users → Add user.",
    eTooMany: "Prea multe încercări. Așteaptă câteva minute și încearcă din nou.", eNetwork: "Nu există internet. Încearcă din nou când ai conexiune.",
    ePermission: "Firebase nu permite: regulile (firestore.rules) nu sunt încă setate sau nu te-ai conectat cu contul tău.",
    eGeneric: "A apărut o eroare: ",
    mNotConfigured: "Lucrările mele nu sunt încă configurate. Urmează pașii din FIREBASE-BEALLITAS.md.",
    mOffline: "Nu există internet, așa că lucrările nu pot fi încărcate acum. Calculatorul și PDF-ul funcționează.",
    mSlow: "Serverul nu răspunde. Calculatorul funcționează, lucrările se vor încărca mai târziu.",
  },
  en: {
    splash: "AlexFPV Studio…",
    loginTitle: "Sign in", loginHint: "You sign in once per device, then you stay signed in.",
    email: "Email", password: "Password", loginBtn: "Sign in", forgot: "Forgot password",
    loggingIn: "Signing in…", resetSent: "Password reset email sent. Check your inbox (and the spam folder).",
    tabEditor: "New quote", tabJobs: "My jobs", install: "📲 Install app", appLang: "App language",
    secBasics: "Basics", fMe: "Your name / brand", fContact: "Contact", fClient: "Client", phClient: "Client name",
    fProject: "Project", phProject: "e.g. FPV house tour – location", fCur: "Currency", fValid: "Quote valid (days)",
    fDocLang: "Quote language", hintDocLang: "The quote and PDF are made in this language. When you switch, template items are translated; items you wrote yourself need to be translated by you.",
    secPresets: "Template", hintPresets: "A template replaces the items. You can edit anything afterwards.",
    secItems: "Items", colCat: "Category", colName: "Name", colQty: "Qty", colUnit: "Unit", colPrice: "Unit price",
    phName: "Name", phDesc: "Short note for the client (optional)", addItem: "+ New item", delItem: "Delete item",
    secMods: "Travel and adjustments", fKm: "Round-trip distance (km)", fKmRate: "Rate / km", fRush: "Rush surcharge (%)", fDisc: "Discount (%)",
    secNote: "Note for the client",
    btnSave: "💾 Save to my jobs", btnSaveChanges: "💾 Save changes", btnPdf: "📄 Save / send PDF",
    btnPrint: "🖨️ Print", btnCopy: "Copy as text",
    editing: "✏️ Editing:", unnamed: "unnamed client", newInstead: "+ New quote instead",
    tNewKept: "New quote. The old job is still in My jobs.",
    tNotConfigured: "My jobs is not set up yet (FIREBASE-BEALLITAS.md).",
    tNeedLogin: "Saving needs internet and sign-in. Try again a bit later.",
    tNeedClient: "Enter the client's name so you can find it in the list.",
    tSaved: "Saved to your jobs.", tOpened: "Opened. Make your changes, then press “Save changes”.",
    tDuplicated: "Copy created. Enter the new client and save.",
    tCopied: "Copied. You can paste it into a message or email.", tCopyFail: "Copying didn't work on this device.",
    tPdfMaking: "Making PDF…", tPdfDone: "Done.", tPdfDownloaded: "PDF downloaded: ", tPdfFail: "Couldn't make the PDF.",
    tPdfTap: "📤 PDF ready – tap to share",
    statPaid: "Received", paidJobs: "{n} paid jobs", statWaiting: "Awaiting payment", waitingJobs: "{n} accepted or finished jobs",
    statOpen: "Open quotes", openCount: "{n}", openSub: "no reply yet",
    phSearch: "Search by client or project…", allStatuses: "All statuses", jobsNew: "+ New quote",
    loggedIn: "Signed in: ", logout: "Sign out",
    loadingJobs: "Loading jobs…",
    noJobs: "<b>No saved jobs yet.</b><br>Make a quote on the “New quote” tab and press “💾 Save to my jobs”.",
    noMatch: "No jobs match your search.",
    open: "Open", dup: "Duplicate", del: "Delete", confirmDel: "Delete this job?", yesDel: "Yes, delete", cancel: "Cancel", status: "Status",
    st_ajanlat: "Quote sent", st_elfogadva: "Accepted", st_kesz: "Done, awaiting payment", st_fizetve: "Paid", st_elutasitva: "Declined",
    eBadLogin: "Wrong email or password.", eNoUser: "No such user. Create it in the Firebase console: Authentication → Users → Add user.",
    eTooMany: "Too many attempts. Wait a few minutes and try again.", eNetwork: "No internet. Try again when you're connected.",
    ePermission: "Firebase refused: the rules (firestore.rules) aren't set up yet, or you're not signed in with your own account.",
    eGeneric: "Something went wrong: ",
    mNotConfigured: "My jobs is not set up yet. Follow the steps in FIREBASE-BEALLITAS.md.",
    mOffline: "No internet, so your jobs can't be loaded right now. The calculator and PDF still work.",
    mSlow: "The server isn't responding. The calculator works; your jobs will load later.",
  },
};

// ---- Az ajánlat (dokumentum) szövegei ----
const DOC = {
  hu: {
    title: "Árajánlat", client: "Ügyfél", project: "Projekt", dist: "Mire megy a pénz",
    thItem: "Tétel", thQty: "Menny.", thPrice: "Egységár", thTotal: "Összeg",
    subtotal: "Részösszeg", rush: "Sürgős leadás", disc: "Kedvezmény", total: "Összesen", why: "Miért ennyi?",
    no: "Sz.", date: "Kelt", valid: "Érvényes", travel: "Kiszállás", travelDesc: "{km} km oda-vissza × {rate}/km",
    empty: "Adj hozzá tételeket.", file: "Arajanlat", textTitle: "ÁRAJÁNLAT", noClient: "ugyfel",
    note: "Az ár tartalmaz 1 javítási kört. A nyers felvételeket nem adom ki. Rossz idő (szél, eső) esetén a repülést új időpontra tesszük, felár nélkül.",
    cats: {
      prep:   ["Előkészítés", "Bejárom a helyszínt, megtervezem a repülés útvonalát és egyeztetek veled. Egy FPV-videó csak akkor lehet egyetlen, vágás nélküli repülés, ha az útvonalat előre begyakorlom."],
      shoot:  ["Forgatás / fotózás", "A helyszínen töltött idő. Egy hibátlan, megszakítás nélküli repüléshez általában több próbálkozás kell."],
      post:   ["Utómunka", "A vágás, a képstabilizálás és a színek beállítása általában 2–3-szor annyi ideig tart, mint maga a forgatás."],
      gear:   ["Felszerelés", "A drón, az akkumulátorok, a propellerek és a kamera használat közben kopnak. Egy FPV drón egy ütközéskor tönkre is mehet, ezért ennek a költségét is bele kell számolni."],
      travel: ["Kiszállás", "Az üzemanyag és az utazással töltött idő."],
      other:  ["Egyéb", "Például extra videóváltozatok vagy plusz javítási körök."],
    },
  },
  ro: {
    title: "Ofertă de preț", client: "Client", project: "Proiect", dist: "Structura costurilor",
    thItem: "Serviciu", thQty: "Cant.", thPrice: "Preț unitar", thTotal: "Valoare",
    subtotal: "Subtotal", rush: "Termen urgent", disc: "Reducere", total: "Total", why: "De ce acest preț?",
    no: "Nr.", date: "Data", valid: "Valabilă până la", travel: "Deplasare", travelDesc: "{km} km dus-întors × {rate}/km",
    empty: "Adaugă elemente.", file: "Oferta", textTitle: "OFERTĂ DE PREȚ", noClient: "client",
    note: "Prețul include o rundă de corecturi. Materialul brut nu se predă. În caz de vreme nefavorabilă (vânt, ploaie), zborul se reprogramează fără costuri suplimentare.",
    cats: {
      prep:   ["Pregătire", "Vizitez locația, planific traseul zborului și stabilesc detaliile cu tine. Un video FPV poate fi un singur zbor continuu, fără tăieturi, doar dacă traseul este exersat dinainte."],
      shoot:  ["Filmare / fotografie", "Timpul petrecut la fața locului. Pentru un zbor fără greșeli și fără întreruperi sunt de obicei necesare mai multe încercări."],
      post:   ["Post-producție", "Montajul, stabilizarea imaginii și corecția de culoare durează de obicei de 2–3 ori mai mult decât filmarea propriu-zisă."],
      gear:   ["Echipament", "Drona, bateriile, elicele și camera se uzează în timpul folosirii. O dronă FPV se poate distruge la o coliziune, așa că și acest cost trebuie inclus."],
      travel: ["Deplasare", "Combustibilul și timpul petrecut pe drum."],
      other:  ["Altele", "De exemplu versiuni video suplimentare sau runde de corecturi în plus."],
    },
  },
  en: {
    title: "Quote", client: "Client", project: "Project", dist: "Cost breakdown",
    thItem: "Item", thQty: "Qty", thPrice: "Unit price", thTotal: "Amount",
    subtotal: "Subtotal", rush: "Rush delivery", disc: "Discount", total: "Total", why: "Why this price?",
    no: "No.", date: "Date", valid: "Valid until", travel: "Travel", travelDesc: "{km} km round trip × {rate}/km",
    empty: "Add some items.", file: "Quote", textTitle: "QUOTE", noClient: "client",
    note: "The price includes one round of revisions. Raw footage is not included. In bad weather (wind, rain) the flight is rescheduled at no extra cost.",
    cats: {
      prep:   ["Preparation", "I visit the location, plan the flight path and agree the details with you. An FPV video can only be one continuous flight without cuts if the route is rehearsed in advance."],
      shoot:  ["Filming / photography", "Time spent on location. A flawless, uninterrupted flight usually takes several attempts."],
      post:   ["Post-production", "Editing, image stabilisation and colour correction usually take 2–3 times longer than the shoot itself."],
      gear:   ["Equipment", "The drone, batteries, propellers and camera wear out with use. An FPV drone can be destroyed in a crash, so that cost has to be included too."],
      travel: ["Travel", "Fuel and time spent on the road."],
      other:  ["Other", "For example extra video versions or additional revision rounds."],
    },
  },
};

// Szám- és dátumformátum nyelvenként (1 530 / 1.530 / 1,530)
const LOCALES = { hu: "hu-HU", ro: "ro-RO", en: "en-GB" };

// ---------- Az app nyelve ----------
let uiLang = "hu";
try { if (LANGS.includes(localStorage.getItem("arajanlat-ui-lang"))) uiLang = localStorage.getItem("arajanlat-ui-lang"); } catch (e) {}

// t("kulcs", { n: 3 }) -> az app nyelvén
function t(key, vars = {}) {
  let s = (UI[uiLang] && UI[uiLang][key]) ?? UI.hu[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => (s = s.replace(`{${k}}`, v)));
  return s;
}

// A HTML-ben jelölt szövegek cseréje
function applyUI() {
  document.documentElement.lang = uiLang;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  document.querySelectorAll("#ui-langs button").forEach((b) => b.classList.toggle("on", b.dataset.lang === uiLang));
}

function setUiLang(lang) {
  uiLang = lang;
  try { localStorage.setItem("arajanlat-ui-lang", lang); } catch (e) {}
  applyUI();
  // a JS által rajzolt részek (sorok, sablonok, Munkáim) újrarajzolása
  if (typeof renderRows === "function") { renderRows(); renderPresets(); update(); }
  if (typeof renderJobs === "function") { renderJobs(); renderStatusFilter(); }
}

// ---------- Az ajánlat nyelve ----------
// (az értéke a rejtett #doclang mezőben van, így a munkával együtt mentődik)
function docLang() {
  const el = document.getElementById("doclang");
  return el && LANGS.includes(el.value) ? el.value : "hu";
}

// d("kulcs", { km: 40 }) -> az ajánlat nyelvén
function d(key, vars = {}) {
  let s = DOC[docLang()][key] ?? DOC.hu[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => (s = String(s).replace(`{${k}}`, v)));
  return s;
}

// Kategória neve / magyarázata egy adott nyelven
const catName = (k, lang) => DOC[lang].cats[k][0];
const catWhy = (k, lang) => DOC[lang].cats[k][1];

// ---------- Tételek fordítása nyelvváltáskor ----------
// Összegyűjtjük, mely szövegek "ugyanazt jelentik" a három nyelven (sablonok, egységek, megjegyzés).
// Ha egy tétel szövege pontosan megegyezik valamelyikkel, lefordítjuk; ha te írtad át, marad.
const TRANSLATION_GROUPS = [];
PRESETS.forEach((preset) => preset.items.forEach(([, texts]) => {
  TRANSLATION_GROUPS.push({ hu: texts.hu[0], ro: texts.ro[0], en: texts.en[0] });
  if (texts.hu[1]) TRANSLATION_GROUPS.push({ hu: texts.hu[1], ro: texts.ro[1], en: texts.en[1] });
}));
Object.values(UNITS).forEach((u) => TRANSLATION_GROUPS.push(u));
TRANSLATION_GROUPS.push({ hu: DOC.hu.note, ro: DOC.ro.note, en: DOC.en.note });

function translateText(text, toLang) {
  if (!text) return text;
  const group = TRANSLATION_GROUPS.find((g) => LANGS.some((l) => g[l] === text));
  return group ? group[toLang] : text;
}
