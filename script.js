// =====================================================
//  AlexFPV Studio – a kalkulátor működése
//  1. A tételek egy "rows" tömbben vannak (minden tétel egy objektum).
//  2. Ha bármi változik, lefut az update(): újraszámol és újrarajzolja az ajánlatot.
//  3. A félkész ajánlatot elmenti a localStorage-be, így újranyitáskor megmarad.
//  4. A "Munkáim" közé mentett ajánlatok a Firebase-ben vannak (jobs.js + cloud.js).
//  5. Szövegek: t("…") = az app nyelvén, d("…") = az ajánlat nyelvén (i18n.js).
// =====================================================

const $ = (id) => document.getElementById(id); // rövidítés: $("me") = document.getElementById("me")

// Az egyszerű mezők azonosítói (ezeket mentjük el). A "doclang" az ajánlat nyelve.
const FIELDS = ["doclang", "me", "contact", "client", "project", "cur", "valid", "km", "kmrate", "rush", "disc", "note"];
const STORAGE_KEY = "arajanlat-v1";

// Az alapadataid: ha ezek a mezők üresek, maguktól kitöltődnek
const DEFAULTS = {
  me: "AlexFPV",
  contact: "alexcmedia1@gmail.com · 0755 283 900",
};

// A régi példaértékek: ha a böngésző ezeket mentette el, nem töltjük vissza őket
const OLD_EXAMPLES = {
  me: "Alex Media",
  contact: "alex@pelda.ro · 07xx xxx xxx",
  client: "Kovács Ingatlan",
  project: "FPV house tour – Marosvásárhely",
};

let rows = [];          // a tételek listája
let activePreset = "";  // melyik sablon van kiválasztva (az azonosítója, pl. "fpv")
// Ha egy elmentett munkát szerkesztünk, itt vannak az adatai: { id, number, createdAt, status }
// Ha null, akkor ez egy új, még el nem mentett ajánlat.
let current = null;

// Régebben a sablon nevét mentettük ("FPV house tour"), most az azonosítóját ("fpv")
function presetIdFrom(value) {
  const p = PRESETS.find((p) => p.id === value || LANGS.some((l) => p.name[l] === value));
  return p ? p.id : "";
}

// ---------- Mentés és betöltés ----------
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      rows = (saved.rows || []).filter((r) => !REMOVED_ITEMS.includes(r.name));
      fixOldTexts(rows);
      activePreset = presetIdFrom(saved.preset);
      current = saved.current || null;
      FIELDS.forEach((k) => {
        if (saved[k] === undefined || saved[k] === OLD_EXAMPLES[k]) return; // régi példa -> marad az új alap
        $(k).value = saved[k];
      });
      fillDefaults();
      return;
    }
  } catch (e) { /* ha a mentés hibás vagy nem elérhető, a sablonnal indulunk */ }
  applyPreset("fpv");
}

// A régi tételszövegek cseréje az újakra (data.js: TEXT_FIXES). Csak a pontosan egyező szöveget cseréli.
function fixOldTexts(list) {
  list.forEach((r) => ["name", "desc", "unit"].forEach((k) => {
    if (TEXT_FIXES[r[k]]) r[k] = TEXT_FIXES[r[k]];
  }));
}

// Ha a neved vagy az elérhetőséged üres, visszaírjuk az alapot
function fillDefaults() {
  Object.keys(DEFAULTS).forEach((k) => {
    if (!$(k).value.trim()) $(k).value = DEFAULTS[k];
  });
}

function save() {
  try {
    const data = { rows, preset: activePreset, current };
    FIELDS.forEach((k) => (data[k] = $(k).value));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

// ---------- Az ajánlat adatai egy objektumban (a Munkáim mentéséhez) ----------
function getQuoteData() {
  const data = { rows: JSON.parse(JSON.stringify(rows)), preset: activePreset };
  FIELDS.forEach((k) => (data[k] = $(k).value));
  data.total = Math.round(compute().total * 100) / 100; // a listához, hogy ne kelljen újraszámolni
  return data;
}

// Egy elmentett munka betöltése a szerkesztőbe
function setQuoteData(q, meta) {
  rows = JSON.parse(JSON.stringify(q.rows || []));
  fixOldTexts(rows);
  activePreset = presetIdFrom(q.preset);
  FIELDS.forEach((k) => { if (q[k] !== undefined) $(k).value = q[k]; });
  $("doclang").value = q.doclang || "hu"; // a régi munkák magyarul készültek
  fillDefaults();
  current = meta;
  renderRows();
  renderPresets();
  renderDocLang();
  update();
}

// Új, üres ajánlat: a tételek és áraid maradnak, de az ügyfél adatai törlődnek
function startNewQuote() {
  current = null;
  ["client", "project"].forEach((k) => ($(k).value = ""));
  $("rush").value = 0;
  $("disc").value = 0;
  update();
}

// ---------- Sablonok ----------
function applyPreset(id) {
  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) return;
  activePreset = id;
  const lang = docLang();
  // a sablon tételei az ajánlat nyelvén
  rows = preset.items.map(([cat, texts, qty, unit, price]) => ({
    cat, name: texts[lang][0], desc: texts[lang][1], qty, unit: UNITS[unit][lang], price,
  }));
  renderRows();
  renderPresets();
  update();
}

function renderPresets() {
  $("presets").innerHTML = "";
  PRESETS.forEach((preset) => {
    const btn = document.createElement("button");
    btn.className = "preset" + (preset.id === activePreset ? " on" : "");
    btn.textContent = preset.name[uiLang];       // a gomb felirata az app nyelvén
    btn.onclick = () => applyPreset(preset.id);
    $("presets").appendChild(btn);
  });
}

// ---------- Nyelvválasztó gombok ----------
// Az app nyelve: HU / RO / EN gombok (a fejlécben és a belépő ablakban)
function renderLangButtons() {
  document.querySelectorAll("[data-langs]").forEach((box) => {
    box.innerHTML = LANGS.map((l) => `<button data-lang="${l}" class="${l === uiLang ? "on" : ""}">${l.toUpperCase()}</button>`).join("");
    box.querySelectorAll("button").forEach((b) => (b.onclick = (e) => { e.preventDefault(); setUiLang(b.dataset.lang); renderLangButtons(); }));
  });
}

// Az ajánlat nyelve: Magyar / Română / English
function renderDocLang() {
  document.querySelectorAll("#doclang-btns button").forEach((b) => b.classList.toggle("on", b.dataset.doclang === docLang()));
}

function setDocLang(lang) {
  if (lang === docLang()) return;
  // a sablonból jövő szövegeket (és a megjegyzést) lefordítjuk, a saját szövegeid maradnak
  rows.forEach((r) => ["name", "desc", "unit"].forEach((k) => (r[k] = translateText(r[k], lang))));
  $("note").value = translateText($("note").value, lang);
  $("doclang").value = lang;
  renderRows();
  renderDocLang();
  update();
}
document.querySelectorAll("#doclang-btns button").forEach((b) => (b.onclick = () => setDocLang(b.dataset.doclang)));

// Védelem: ha valaki pl. <b>-t ír egy mezőbe, ne HTML-ként jelenjen meg
function esc(text) {
  return String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// ---------- A bal oldali szerkeszthető sorok ----------
function renderRows() {
  const box = $("rows");
  box.innerHTML = "";

  rows.forEach((row, i) => {
    const el = document.createElement("div");
    el.className = "row";

    // a "Kiszállás" kategóriát kihagyjuk, mert azt a km mezők számolják
    // (a kategóriák nevei itt az app nyelvén vannak, mert ezt csak te látod)
    const options = CAT_ORDER.filter((k) => k !== "travel")
      .map((k) => `<option value="${k}" ${k === row.cat ? "selected" : ""}>${catName(k, uiLang)}</option>`)
      .join("");

    el.innerHTML = `
      <label class="mini cat"><span>${t("colCat")}</span><select>${options}</select></label>
      <input class="name" value="${esc(row.name)}" placeholder="${t("phName")}" aria-label="${t("colName")}">
      <label class="mini qty"><span>${t("colQty")}</span><input type="number" min="0" step="0.5" value="${row.qty}"></label>
      <label class="mini unit"><span>${t("colUnit")}</span><input value="${esc(row.unit)}"></label>
      <label class="mini price"><span>${t("colPrice")}</span><input type="number" min="0" value="${row.price}"></label>
      <button class="x" title="${t("delItem")}" aria-label="${t("delItem")}">✕</button>
      <input class="desc" value="${esc(row.desc)}" placeholder="${t("phDesc")}">`;

    // ha a felhasználó gépel, frissítjük az adott tételt és az ajánlatot
    el.querySelector(".cat select").onchange = (e) => { row.cat = e.target.value; update(); };
    el.querySelector(".name").oninput = (e) => { row.name = e.target.value; update(); };
    el.querySelector(".desc").oninput = (e) => { row.desc = e.target.value; update(); };
    el.querySelector(".qty input").oninput = (e) => { row.qty = parseFloat(e.target.value) || 0; update(); };
    el.querySelector(".unit input").oninput = (e) => { row.unit = e.target.value; update(); };
    el.querySelector(".price input").oninput = (e) => { row.price = parseFloat(e.target.value) || 0; update(); };
    el.querySelector(".x").onclick = () => { rows.splice(i, 1); renderRows(); update(); };

    box.appendChild(el);
  });
}

// ---------- Számolás ----------
function num(id) { return parseFloat($(id).value) || 0; }

// Pénz formázása az ajánlat nyelvén: 1530 -> "1 530 RON" / "1.530 RON" / "1,530 RON"
function fmt(n) {
  const cur = $("cur").value;
  const decimals = cur === "HUF" || Number.isInteger(n) ? 0 : 2;
  return n.toLocaleString(LOCALES[docLang()], { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + " " + cur;
}

function compute() {
  // minden tétel összege = mennyiség × egységár
  const items = rows
    .filter((r) => r.name.trim() || r.price)
    .map((r) => ({ ...r, total: r.qty * r.price }));

  // kiszállás külön tételként
  const km = num("km"), kmrate = num("kmrate");
  if (km * kmrate > 0) {
    items.push({ cat: "travel", name: d("travel"), desc: d("travelDesc", { km, rate: fmt(kmrate) }), qty: km, unit: "km", price: kmrate, total: km * kmrate });
  }

  const subtotal = items.reduce((sum, it) => sum + it.total, 0);
  const rush = subtotal * num("rush") / 100;          // felár a részösszegre
  const disc = (subtotal + rush) * num("disc") / 100; // kedvezmény a felár után
  const total = subtotal + rush - disc;

  // kategóriánkénti összeg (a színes sávhoz)
  const byCat = {};
  items.forEach((it) => (byCat[it.cat] = (byCat[it.cat] || 0) + it.total));

  return { items, subtotal, rush, disc, total, byCat };
}

// ---------- Az ajánlat kirajzolása (az ajánlat nyelvén) ----------
function update() {
  const c = compute();
  const lang = docLang();
  const loc = LOCALES[lang];
  // elmentett munkánál az eredeti dátum és sorszám marad
  const today = current ? new Date(current.createdAt) : new Date();
  const validUntil = new Date(today.getTime() + num("valid") * 24 * 60 * 60 * 1000);
  const number = current ? current.number
    : (typeof nextQuoteNumber === "function" ? nextQuoteNumber() : "AJ-" + today.toISOString().slice(0, 10).replaceAll("-", ""));

  $("o-me").textContent = $("me").value || "—";
  $("o-contact").textContent = $("contact").value;
  $("o-title").textContent = d("title");
  $("o-client-label").textContent = d("client");
  $("o-client").textContent = $("client").value || "—";
  $("o-project").textContent = $("project").value ? " · " + $("project").value : ""; // a pötty csak akkor kell, ha van projekt
  $("o-no").textContent = `${d("no")}: ${number}`;
  $("o-date").textContent = `${d("date")}: ${today.toLocaleDateString(loc)}`;
  $("o-valid").textContent = `${d("valid")}: ${validUntil.toLocaleDateString(loc)}`;
  $("o-note").textContent = $("note").value;
  $("o-dist").textContent = d("dist");
  $("o-th-item").textContent = d("thItem");
  $("o-th-qty").textContent = d("thQty");
  $("o-th-price").textContent = d("thPrice");
  $("o-th-total").textContent = d("thTotal");

  // csak azok a kategóriák, amikben van pénz
  const used = CAT_ORDER.filter((k) => c.byCat[k] > 0);
  const pct = (k) => (c.subtotal ? (c.byCat[k] / c.subtotal) * 100 : 0);

  // színes sáv + jelmagyarázat
  $("bar").innerHTML = used.map((k) => `<span style="width:${pct(k)}%;background:${CATS[k].color}" title="${catName(k, lang)}"></span>`).join("");
  $("legend").innerHTML = used.map((k) => `<span><i style="background:${CATS[k].color}"></i>${catName(k, lang)} <b>${Math.round(pct(k))}%</b></span>`).join("");

  // táblázat, kategóriánként csoportosítva
  let html = "";
  used.forEach((k) => {
    html += `<tr class="cat"><td><span class="sw" style="background:${CATS[k].color}"></span>${catName(k, lang)}</td><td></td><td></td><td class="n">${fmt(c.byCat[k])}</td></tr>`;
    c.items.filter((it) => it.cat === k).forEach((it) => {
      html += `<tr>
        <td>${esc(it.name)}${it.desc ? `<span class="d">${esc(it.desc)}</span>` : ""}</td>
        <td class="n">${it.qty} ${esc(it.unit)}</td>
        <td class="n">${fmt(it.price)}</td>
        <td class="n">${fmt(it.total)}</td></tr>`;
    });
  });
  $("tbody").innerHTML = html || `<tr><td colspan="4">${d("empty")}</td></tr>`;

  // végösszeg
  let tot = `<div><span>${d("subtotal")}</span><span>${fmt(c.subtotal)}</span></div>`;
  if (c.rush) tot += `<div><span>${d("rush")} (+${num("rush")}%)</span><span>${fmt(c.rush)}</span></div>`;
  if (c.disc) tot += `<div><span>${d("disc")} (−${num("disc")}%)</span><span>−${fmt(c.disc)}</span></div>`;
  tot += `<div class="grand"><span>${d("total")}</span><span>${fmt(c.total)}</span></div>`;
  $("totals").innerHTML = tot;

  // "Miért ennyi?" magyarázat
  $("why").innerHTML = `<h3>${d("why")}</h3><ul>${used.map((k) => `<li><strong>${catName(k, lang)}:</strong> ${catWhy(k, lang)}</li>`).join("")}</ul>`;
  $("why").classList.toggle("hidden", used.length === 0);

  // a böngésző fül neve is legyen beszédes
  document.title = $("client").value ? `${d("title")} – ${$("client").value} · AlexFPV Studio` : "AlexFPV Studio";

  if (typeof renderEditBar === "function") renderEditBar(); // jobs.js: "Szerkesztés alatt" sáv
  save();
}

// ---------- Szöveges változat (üzenetbe, e-mailbe) – az ajánlat nyelvén ----------
function asText() {
  const c = compute();
  const lang = docLang();
  let s = `${d("textTitle")} – ${$("me").value}\n${$("contact").value}\n${d("client")}: ${$("client").value}\n`;
  if ($("project").value) s += `${d("project")}: ${$("project").value}\n`;
  s += `${$("o-no").textContent} · ${$("o-date").textContent} · ${$("o-valid").textContent}\n\n`;
  CAT_ORDER.filter((k) => c.byCat[k]).forEach((k) => {
    s += `${catName(k, lang).toUpperCase()} (${fmt(c.byCat[k])})\n`;
    c.items.filter((it) => it.cat === k).forEach((it) => (s += `  • ${it.name}: ${it.qty} ${it.unit} × ${fmt(it.price)} = ${fmt(it.total)}\n`));
    s += "\n";
  });
  s += `${d("subtotal")}: ${fmt(c.subtotal)}\n`;
  if (c.rush) s += `${d("rush")}: ${fmt(c.rush)}\n`;
  if (c.disc) s += `${d("disc")}: −${fmt(c.disc)}\n`;
  s += `${d("total").toUpperCase()}: ${fmt(c.total)}\n\n${$("note").value}`;
  return s;
}

function showToast(msg) {
  $("toast").textContent = msg;
  setTimeout(() => ($("toast").textContent = ""), 3000);
}

// ---------- Gombok ----------
$("copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText(asText());
    showToast(t("tCopied"));
  } catch (e) {
    showToast(t("tCopyFail"));
  }
};

// Nyomtatás (gépen). Telefonon a "PDF mentése / küldése" gomb a biztos megoldás (pdf.js)
$("print").onclick = () => window.print();

$("add").onclick = () => {
  rows.push({ cat: "other", name: "", desc: "", qty: 1, unit: UNITS.pcs[docLang()], price: 0 });
  renderRows();
  update();
};

FIELDS.forEach((k) => $(k).addEventListener("input", update));

// ha kitörlöd a neved/elérhetőséged és kikattintasz a mezőből, visszajön az alap
Object.keys(DEFAULTS).forEach((k) => $(k).addEventListener("blur", () => { fillDefaults(); update(); }));

// ---------- Indítás ----------
applyUI();
renderLangButtons();
load();
renderDocLang();
renderRows();
renderPresets();
update();
