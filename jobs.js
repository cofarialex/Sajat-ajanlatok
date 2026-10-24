// =====================================================
//  Munkáim – az elmentett ajánlatok listája
//  - fülek: "Új ajánlat" (szerkesztő) és "Munkáim" (lista)
//  - mentés, megnyitás, másolat, törlés, állapot váltása
//  - összesítő: befolyt pénz, fizetésre vár, nyitott ajánlatok
// =====================================================

// Egy munka állapotai (sorrendben). A "tone" a színt adja (style.css: .st-…)
// A nevük az app nyelvén: t("st_ajanlat") stb. (i18n.js)
const STATUSES = {
  ajanlat:    { tone: "neutral" },
  elfogadva:  { tone: "info" },
  kesz:       { tone: "warn" },
  fizetve:    { tone: "good" },
  elutasitva: { tone: "bad" },
};
const statusName = (k) => t("st_" + k);

const JOBS_CACHE_KEY = "arajanlat-jobs-cache";
let jobs = [];               // a munkák listája (a felhőből)
let jobsLoaded = false;
let confirmDeleteId = null;  // melyik munkánál kérdezzük, hogy "Biztos törlöd?"

// Gyors indulás: az utoljára látott lista a böngészőből (amíg a felhő válaszol)
try { jobs = JSON.parse(localStorage.getItem(JOBS_CACHE_KEY)) || []; } catch (e) {}

// ---------- Segédfüggvények ----------
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10).replaceAll("-", "");
}

// Sorszám: AJ-20261024-01, AJ-20261024-02 … (az aznapi munkák száma alapján)
function nextQuoteNumber() {
  const today = dayKey(Date.now());
  const sameDay = jobs.filter((j) => j.number && j.number.startsWith("AJ-" + today)).length;
  return `AJ-${today}-${String(sameDay + 1).padStart(2, "0")}`;
}

// Pénz formázása a munka saját pénznemével (az app nyelvének számformátumával)
function money(n, cur) {
  const decimals = cur === "HUF" || Number.isInteger(n) ? 0 : 2;
  return Number(n || 0).toLocaleString(LOCALES[uiLang], { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + " " + cur;
}

// Több pénznem összeadása: { RON: 1500, EUR: 200 } -> "1 500 RON + 200 EUR"
function sumByCurrency(list) {
  const sums = {};
  list.forEach((j) => (sums[j.cur || "RON"] = (sums[j.cur || "RON"] || 0) + (j.total || 0)));
  const parts = Object.entries(sums).map(([cur, n]) => money(n, cur));
  return parts.length ? parts.join(" + ") : money(0, "RON");
}

function setMsg(id, text, isError = false) {
  $(id).textContent = text;
  $(id).classList.toggle("error", isError);
}

// A Firebase hibakódjait érthető mondatokra fordítjuk (az app nyelvén)
function errorText(err) {
  const code = (err && err.code) || "";
  if (code.includes("wrong-password") || code.includes("invalid-credential") || code.includes("invalid-login")) return t("eBadLogin");
  if (code.includes("user-not-found")) return t("eNoUser");
  if (code.includes("too-many-requests")) return t("eTooMany");
  if (code.includes("network")) return t("eNetwork");
  if (code.includes("permission-denied")) return t("ePermission");
  return t("eGeneric") + (err && err.message ? err.message : code);
}

// ---------- Fülek ----------
function showView(view) {
  $("view-editor").classList.toggle("hidden", view !== "editor");
  $("view-jobs").classList.toggle("hidden", view !== "jobs");
  $("tab-editor").classList.toggle("on", view === "editor");
  $("tab-jobs").classList.toggle("on", view === "jobs");
  window.scrollTo(0, 0);
  try { localStorage.setItem("arajanlat-view", view); } catch (e) {}
}
document.querySelectorAll(".tab").forEach((btn) => (btn.onclick = () => showView(btn.dataset.view)));

// ---------- Szerkesztés alatt sáv (a szerkesztő tetején) ----------
function renderEditBar() {
  const bar = $("editbar");
  if (!current) {
    bar.classList.add("hidden");
    $("save-job").textContent = t("btnSave");
    return;
  }
  bar.classList.remove("hidden");
  bar.innerHTML = `
    <span>${t("editing")} <strong>${esc($("client").value || t("unnamed"))}</strong> · ${esc(current.number)}</span>
    <button id="editbar-new">${t("newInstead")}</button>`;
  $("editbar-new").onclick = () => { startNewQuote(); showToast(t("tNewKept")); };
  $("save-job").textContent = t("btnSaveChanges");
}

// ---------- Mentés a Munkáim közé ----------
function saveJob() {
  if (!Cloud.enabled) {
    showToast(t("tNotConfigured"));
    return;
  }
  if (!Cloud.user) {
    showToast(t("tNeedLogin"));
    return;
  }
  if (!$("client").value.trim()) {
    showToast(t("tNeedClient"));
    $("client").focus();
    return;
  }

  const now = Date.now();
  const data = getQuoteData();
  let quote;
  if (current && current.id) {
    // meglévő munka frissítése: a sorszám, a dátum és az állapot marad
    quote = { ...data, id: current.id, number: current.number, createdAt: current.createdAt, status: current.status || "ajanlat", updatedAt: now };
  } else {
    quote = { ...data, id: newId(), number: nextQuoteNumber(), createdAt: now, status: "ajanlat", updatedAt: now };
  }

  current = { id: quote.id, number: quote.number, createdAt: quote.createdAt, status: quote.status };
  update();
  cloudSaveQuote(quote).catch((err) => showToast(errorText(err)));
  showToast(t("tSaved"));
}
$("save-job").onclick = saveJob;

// ---------- Munka megnyitása / másolása / törlése ----------
function openJob(job) {
  setQuoteData(job, { id: job.id, number: job.number, createdAt: job.createdAt, status: job.status });
  showView("editor");
  showToast(t("tOpened"));
}

function duplicateJob(job) {
  // ugyanazok a tételek és árak, de új munkaként, üres ügyféllel
  setQuoteData({ ...job, client: "", project: "" }, null);
  showView("editor");
  showToast(t("tDuplicated"));
}

function deleteJob(job) {
  cloudDeleteQuote(job.id).catch((err) => setMsg("jobs-msg", errorText(err), true));
  if (current && current.id === job.id) current = null; // ha épp ezt szerkesztetted
  confirmDeleteId = null;
  update();
}

function setStatus(job, status) {
  cloudUpdateQuote(job.id, { status, updatedAt: Date.now() }).catch((err) => setMsg("jobs-msg", errorText(err), true));
  if (current && current.id === job.id) current.status = status;
}

// ---------- A lista kirajzolása ----------
function renderJobs() {
  $("jobs-count").textContent = jobs.length ? jobs.length : "";
  if (Cloud.user) $("jobs-user").textContent = t("loggedIn") + Cloud.user.email;

  // összesítő
  const paid = jobs.filter((j) => j.status === "fizetve");
  const waiting = jobs.filter((j) => j.status === "elfogadva" || j.status === "kesz");
  const open = jobs.filter((j) => (j.status || "ajanlat") === "ajanlat");
  $("jobs-stats").innerHTML = `
    <div class="stat"><span class="label">${t("statPaid")}</span><b class="good-text">${sumByCurrency(paid)}</b><small>${t("paidJobs", { n: paid.length })}</small></div>
    <div class="stat"><span class="label">${t("statWaiting")}</span><b class="warn-text">${sumByCurrency(waiting)}</b><small>${t("waitingJobs", { n: waiting.length })}</small></div>
    <div class="stat"><span class="label">${t("statOpen")}</span><b>${t("openCount", { n: open.length })}</b><small>${t("openSub")}</small></div>`;

  // szűrés és keresés
  const q = $("jobs-search").value.trim().toLowerCase();
  const filter = $("jobs-filter").value;
  const list = jobs.filter((j) => {
    if (filter && (j.status || "ajanlat") !== filter) return false;
    if (!q) return true;
    return `${j.client} ${j.project} ${j.number}`.toLowerCase().includes(q);
  });

  if (!jobsLoaded && !jobs.length) {
    $("jobs-list").innerHTML = `<p class="empty">${t("loadingJobs")}</p>`;
    return;
  }
  if (!jobs.length) {
    $("jobs-list").innerHTML = `<div class="empty">${t("noJobs")}</div>`;
    return;
  }
  if (!list.length) {
    $("jobs-list").innerHTML = `<p class="empty">${t("noMatch")}</p>`;
    return;
  }

  $("jobs-list").innerHTML = "";
  list.forEach((job) => {
    const status = STATUSES[job.status] ? job.status : "ajanlat";
    const card = document.createElement("article");
    card.className = "job st-" + STATUSES[status].tone + (current && current.id === job.id ? " editing" : "");
    const options = Object.entries(STATUSES)
      .map(([k]) => `<option value="${k}" ${k === status ? "selected" : ""}>${statusName(k)}</option>`).join("");
    const lang = LANGS.includes(job.doclang) ? job.doclang : "hu";

    card.innerHTML = `
      <div class="job-main">
        <div class="job-title">${esc(job.client || t("unnamed"))} <span class="lang-badge" title="${t("fDocLang")}">${lang.toUpperCase()}</span></div>
        ${job.project ? `<div class="job-project">${esc(job.project)}</div>` : ""}
        <div class="job-meta">${esc(job.number || "")} · ${new Date(job.createdAt).toLocaleDateString(LOCALES[uiLang])}</div>
      </div>
      <div class="job-total">${money(job.total, job.cur || "RON")}</div>
      <div class="job-actions">
        <select class="job-status" aria-label="${t("status")}">${options}</select>
        ${confirmDeleteId === job.id
          ? `<span class="confirm">${t("confirmDel")} <button class="danger" data-act="del-yes">${t("yesDel")}</button><button data-act="del-no">${t("cancel")}</button></span>`
          : `<button data-act="open">${t("open")}</button><button data-act="dup">${t("dup")}</button><button data-act="del" class="ghost-danger">${t("del")}</button>`}
      </div>`;

    card.querySelector(".job-status").onchange = (e) => setStatus(job, e.target.value);
    card.querySelectorAll("[data-act]").forEach((btn) => {
      btn.onclick = () => {
        const act = btn.dataset.act;
        if (act === "open") openJob(job);
        if (act === "dup") duplicateJob(job);
        if (act === "del") { confirmDeleteId = job.id; renderJobs(); }
        if (act === "del-no") { confirmDeleteId = null; renderJobs(); }
        if (act === "del-yes") deleteJob(job);
      };
    });
    $("jobs-list").appendChild(card);
  });
}

// szűrő lenyíló feltöltése (nyelvváltáskor újra)
function renderStatusFilter() {
  const selected = $("jobs-filter").value;
  $("jobs-filter").innerHTML = `<option value="">${t("allStatuses")}</option>` +
    Object.keys(STATUSES).map((k) => `<option value="${k}" ${k === selected ? "selected" : ""}>${statusName(k)}</option>`).join("");
}
renderStatusFilter();
$("jobs-search").oninput = renderJobs;
$("jobs-filter").onchange = renderJobs;
$("jobs-new").onclick = () => { startNewQuote(); showView("editor"); };

// ---------- Belépés / kilépés ----------
$("login").onsubmit = async (e) => {
  e.preventDefault();
  setMsg("login-msg", t("loggingIn"));
  $("login-btn").disabled = true;
  try {
    await cloudSignIn($("login-email").value.trim(), $("login-pass").value);
    $("login-pass").value = "";
  } catch (err) {
    setMsg("login-msg", errorText(err), true);
  } finally {
    $("login-btn").disabled = false;
  }
};

$("login-reset").onclick = async () => {
  try {
    await cloudResetPassword($("login-email").value.trim());
    setMsg("login-msg", t("resetSent"));
  } catch (err) {
    setMsg("login-msg", errorText(err), true);
  }
};

$("logout").onclick = () => { cloudSignOut(); showView("editor"); };

// ---------- Indulás ----------
let stopWatching = null;

// Mi látszik: "loading" (töltés), "locked" (belépő ablak) vagy "" (az app)
function setScreen(mode) {
  document.body.classList.toggle("loading", mode === "loading");
  document.body.classList.toggle("locked", mode === "locked");
}

initCloud((user, problem) => {
  if (stopWatching) { stopWatching(); stopWatching = null; }

  if (problem === "not-configured") {
    setScreen("");
    $("jobs-main").classList.add("hidden");
    setMsg("jobs-msg", t("mNotConfigured"));
    return;
  }
  if (problem === "offline") {
    // ha nem tölthető be a Firebase (nincs net), a kalkulátor és a PDF azért működjön
    setScreen("");
    $("jobs-main").classList.add("hidden");
    setMsg("jobs-msg", t("mOffline"), true);
    return;
  }

  if (!user) {
    setScreen("locked");               // induláskor: belépő ablak
    $("login-pass").focus();
    return;
  }

  setScreen("");                       // be vagy lépve: jöhet az app
  setMsg("jobs-msg", "");
  setMsg("login-msg", "");
  $("jobs-main").classList.remove("hidden");
  $("jobs-user").textContent = t("loggedIn") + user.email;
  stopWatching = watchQuotes(
    (list) => {
      jobs = list;
      jobsLoaded = true;
      try { localStorage.setItem(JOBS_CACHE_KEY, JSON.stringify(jobs)); } catch (e) {}
      renderJobs();
      if (!current) update(); // a sorszám az új munkákhoz igazodik
    },
    (err) => setMsg("jobs-msg", errorText(err), true)
  );
});

// Ha a Firebase 8 mp alatt sem válaszol (nagyon lassú net), ne ragadjon be a töltőképernyő
setTimeout(() => {
  if (document.body.classList.contains("loading")) {
    setScreen("");
    setMsg("jobs-msg", t("mSlow"), true);
  }
}, 8000);

renderJobs();
renderEditBar();
try { if (localStorage.getItem("arajanlat-view") === "jobs") showView("jobs"); } catch (e) {}
