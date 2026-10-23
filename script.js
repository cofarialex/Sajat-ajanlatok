// =====================================================
//  Árajánlat-kalkulátor – a működés
//  1. A tételek egy "rows" tömbben vannak (minden tétel egy objektum).
//  2. Ha bármi változik, lefut az update(): újraszámol és újrarajzolja az ajánlatot.
//  3. Mindent elment a localStorage-be, így újranyitáskor megmarad.
// =====================================================

const $ = (id) => document.getElementById(id); // rövidítés: $("me") = document.getElementById("me")

// Az egyszerű mezők azonosítói (ezeket mentjük el)
const FIELDS = ["me", "contact", "client", "project", "cur", "valid", "km", "kmrate", "rush", "disc", "note"];
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
let activePreset = "";  // melyik sablon van kiválasztva

// ---------- Mentés és betöltés ----------
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      rows = saved.rows || [];
      activePreset = saved.preset || "";
      FIELDS.forEach((k) => {
        if (saved[k] === undefined || saved[k] === OLD_EXAMPLES[k]) return; // régi példa -> marad az új alap
        $(k).value = saved[k];
      });
      fillDefaults();
      return;
    }
  } catch (e) { /* ha a mentés hibás vagy nem elérhető, a sablonnal indulunk */ }
  applyPreset("FPV house tour");
}

// Ha a neved vagy az elérhetőséged üres, visszaírjuk az alapot
function fillDefaults() {
  Object.keys(DEFAULTS).forEach((k) => {
    if (!$(k).value.trim()) $(k).value = DEFAULTS[k];
  });
}

function save() {
  try {
    const data = { rows, preset: activePreset };
    FIELDS.forEach((k) => (data[k] = $(k).value));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

// ---------- Sablonok ----------
function applyPreset(name) {
  activePreset = name;
  // a tömbökből objektumokat csinálunk, hogy könnyebb legyen velük dolgozni
  rows = PRESETS[name].map(([cat, name, desc, qty, unit, price]) => ({ cat, name, desc, qty, unit, price }));
  renderRows();
  renderPresets();
  update();
}

function renderPresets() {
  $("presets").innerHTML = "";
  Object.keys(PRESETS).forEach((name) => {
    const btn = document.createElement("button");
    btn.className = "preset" + (name === activePreset ? " on" : "");
    btn.textContent = name;
    btn.onclick = () => applyPreset(name);
    $("presets").appendChild(btn);
  });
}

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
    const options = CAT_ORDER.filter((k) => k !== "travel")
      .map((k) => `<option value="${k}" ${k === row.cat ? "selected" : ""}>${CATS[k].name}</option>`)
      .join("");

    el.innerHTML = `
      <select class="cat" aria-label="Kategória">${options}</select>
      <input class="name" value="${esc(row.name)}" placeholder="Megnevezés" aria-label="Megnevezés">
      <input class="qty" type="number" min="0" step="0.5" value="${row.qty}" aria-label="Mennyiség">
      <input class="unit" value="${esc(row.unit)}" aria-label="Egység">
      <input class="price" type="number" min="0" value="${row.price}" aria-label="Egységár">
      <button class="x" title="Törlés" aria-label="Tétel törlése">✕</button>
      <input class="desc" value="${esc(row.desc)}" placeholder="Rövid magyarázat az ügyfélnek (nem kötelező)" aria-label="Magyarázat">`;

    // ha a felhasználó gépel, frissítjük az adott tételt és az ajánlatot
    el.querySelector(".cat").onchange = (e) => { row.cat = e.target.value; update(); };
    el.querySelector(".name").oninput = (e) => { row.name = e.target.value; update(); };
    el.querySelector(".desc").oninput = (e) => { row.desc = e.target.value; update(); };
    el.querySelector(".qty").oninput = (e) => { row.qty = parseFloat(e.target.value) || 0; update(); };
    el.querySelector(".unit").oninput = (e) => { row.unit = e.target.value; update(); };
    el.querySelector(".price").oninput = (e) => { row.price = parseFloat(e.target.value) || 0; update(); };
    el.querySelector(".x").onclick = () => { rows.splice(i, 1); renderRows(); update(); };

    box.appendChild(el);
  });
}

// ---------- Számolás ----------
function num(id) { return parseFloat($(id).value) || 0; }

// Pénz formázása: 1250 -> "1 250 RON"
function fmt(n) {
  const cur = $("cur").value;
  const decimals = cur === "HUF" || Number.isInteger(n) ? 0 : 2;
  return n.toLocaleString("hu-HU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + " " + cur;
}

function compute() {
  // minden tétel összege = mennyiség × egységár
  const items = rows
    .filter((r) => r.name.trim() || r.price)
    .map((r) => ({ ...r, total: r.qty * r.price }));

  // kiszállás külön tételként
  const km = num("km"), kmrate = num("kmrate");
  if (km * kmrate > 0) {
    items.push({ cat: "travel", name: "Kiszállás", desc: `${km} km oda-vissza × ${fmt(kmrate)}/km`, qty: km, unit: "km", price: kmrate, total: km * kmrate });
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

// ---------- Az ajánlat kirajzolása ----------
function update() {
  const c = compute();
  const today = new Date();
  const validUntil = new Date(today.getTime() + num("valid") * 24 * 60 * 60 * 1000);

  $("o-me").textContent = $("me").value || "—";
  $("o-contact").textContent = $("contact").value;
  $("o-client").textContent = $("client").value || "—";
  $("o-project").textContent = $("project").value ? " · " + $("project").value : ""; // a pötty csak akkor kell, ha van projekt
  $("o-no").textContent = "Sz.: AJ-" + today.toISOString().slice(0, 10).replaceAll("-", "");
  $("o-date").textContent = "Kelt: " + today.toLocaleDateString("hu-HU");
  $("o-valid").textContent = "Érvényes: " + validUntil.toLocaleDateString("hu-HU");
  $("o-note").textContent = $("note").value;

  // csak azok a kategóriák, amikben van pénz
  const used = CAT_ORDER.filter((k) => c.byCat[k] > 0);
  const pct = (k) => (c.subtotal ? (c.byCat[k] / c.subtotal) * 100 : 0);

  // színes sáv + jelmagyarázat
  $("bar").innerHTML = used.map((k) => `<span style="width:${pct(k)}%;background:${CATS[k].color}" title="${CATS[k].name}"></span>`).join("");
  $("legend").innerHTML = used.map((k) => `<span><i style="background:${CATS[k].color}"></i>${CATS[k].name} <b>${Math.round(pct(k))}%</b></span>`).join("");

  // táblázat, kategóriánként csoportosítva
  let html = "";
  used.forEach((k) => {
    html += `<tr class="cat"><td><span class="sw" style="background:${CATS[k].color}"></span>${CATS[k].name}</td><td></td><td></td><td class="n">${fmt(c.byCat[k])}</td></tr>`;
    c.items.filter((it) => it.cat === k).forEach((it) => {
      html += `<tr>
        <td>${esc(it.name)}${it.desc ? `<span class="d">${esc(it.desc)}</span>` : ""}</td>
        <td class="n">${it.qty} ${esc(it.unit)}</td>
        <td class="n">${fmt(it.price)}</td>
        <td class="n">${fmt(it.total)}</td></tr>`;
    });
  });
  $("tbody").innerHTML = html || `<tr><td colspan="4">Adj hozzá tételeket.</td></tr>`;

  // végösszeg
  let t = `<div><span>Részösszeg</span><span>${fmt(c.subtotal)}</span></div>`;
  if (c.rush) t += `<div><span>Sürgős leadás (+${num("rush")}%)</span><span>${fmt(c.rush)}</span></div>`;
  if (c.disc) t += `<div><span>Kedvezmény (−${num("disc")}%)</span><span>−${fmt(c.disc)}</span></div>`;
  t += `<div class="grand"><span>Összesen</span><span>${fmt(c.total)}</span></div>`;
  $("totals").innerHTML = t;

  // "Miért ennyi?" magyarázat
  $("why").innerHTML = `<h3>Miért ennyi?</h3><ul>${used.map((k) => `<li><strong>${CATS[k].name}:</strong> ${CATS[k].why}</li>`).join("")}</ul>`;
  $("why").classList.toggle("hidden", used.length === 0);

  // a böngésző fül/PDF neve is legyen beszédes
  document.title = `Árajánlat – ${$("client").value || "ügyfél"}`;

  save();
}

// ---------- Szöveges változat (üzenetbe, e-mailbe) ----------
function asText() {
  const c = compute();
  let s = `ÁRAJÁNLAT – ${$("me").value}\n${$("contact").value}\nÜgyfél: ${$("client").value}\nProjekt: ${$("project").value}\n${$("o-date").textContent} · ${$("o-valid").textContent}\n\n`;
  CAT_ORDER.filter((k) => c.byCat[k]).forEach((k) => {
    s += `${CATS[k].name.toUpperCase()} (${fmt(c.byCat[k])})\n`;
    c.items.filter((it) => it.cat === k).forEach((it) => (s += `  • ${it.name}: ${it.qty} ${it.unit} × ${fmt(it.price)} = ${fmt(it.total)}\n`));
    s += "\n";
  });
  s += `Részösszeg: ${fmt(c.subtotal)}\n`;
  if (c.rush) s += `Sürgős felár: ${fmt(c.rush)}\n`;
  if (c.disc) s += `Kedvezmény: −${fmt(c.disc)}\n`;
  s += `ÖSSZESEN: ${fmt(c.total)}\n\n${$("note").value}`;
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
    showToast("Kimásolva. Beillesztheted üzenetbe vagy e-mailbe.");
  } catch (e) {
    showToast("Nem sikerült a másolás ezen az eszközön.");
  }
};

// Telefonon a nyomtatás ablakban választható a "Mentés PDF-ként" is
$("print").onclick = () => window.print();

$("add").onclick = () => {
  rows.push({ cat: "other", name: "", desc: "", qty: 1, unit: "db", price: 0 });
  renderRows();
  update();
};

FIELDS.forEach((k) => $(k).addEventListener("input", update));

// ha kitörlöd a neved/elérhetőséged és kikattintasz a mezőből, visszajön az alap
Object.keys(DEFAULTS).forEach((k) => $(k).addEventListener("blur", () => { fillDefaults(); update(); }));

// ---------- Indítás ----------
load();
renderRows();
renderPresets();
update();
