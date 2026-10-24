// =====================================================
//  PDF készítése – külső könyvtár nélkül
//
//  Miért kell ez? Telefonon (főleg ha a kezdőképernyőről nyitod meg) a böngésző
//  nem engedi a nyomtatás ablakot, így a "Mentés PDF-ként" sem érhető el.
//
//  Hogyan működik?
//  1. Az ajánlatot megrajzoljuk egy <canvas>-ra (mint egy rajzlapra), A4-es méretben.
//     Ha nem fér ki egy oldalra, új oldalt kezdünk.
//  2. Minden oldalból JPEG kép lesz.
//  3. A képekből saját kezűleg összerakunk egy PDF fájlt (a PDF belül egyszerű szöveg + a képek).
//  4. Telefonon megnyílik a megosztás menü (Fájlokba mentés, WhatsApp, e-mail…),
//     gépen pedig egyszerűen letöltődik.
// =====================================================

// ---- Méretek: a rajzolásnál "A4 papírt" képzelünk el 794 × 1123 egységben (ez 96 dpi) ----
const PAGE_W = 794, PAGE_H = 1123;
const MARGIN = 56;                 // kb. 15 mm
const CONTENT_W = PAGE_W - 2 * MARGIN;
const RES = 2.2;                   // ennyiszer nagyobb felbontással rajzolunk, hogy éles legyen

// A PDF mindig világos, akkor is, ha a telefon sötét módban van
const PDF = {
  ink: "#15191f", muted: "#5d6673", line: "#d3d8df", soft: "#e3ebff",
  cats: { prep: "#7a8494", shoot: "#1f5eff", post: "#f08a24", gear: "#9b51e0", travel: "#14a37f", other: "#e0455b" },
};
const F_BODY = '"IBM Plex Sans", -apple-system, system-ui, "Segoe UI", sans-serif';
const F_DISPLAY = '"Bricolage Grotesque", -apple-system, system-ui, "Segoe UI", sans-serif';
const F_MONO = '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace';

// A logó (előre betöltjük, hogy a PDF készítésekor már kész legyen)
const LOGO = new Image();
LOGO.src = "icon-192.png";

// ---------- Segédfüggvények a rajzoláshoz ----------

// Egy új, fehér oldal létrehozása
function newPage(pages) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PAGE_W * RES);
  canvas.height = Math.round(PAGE_H * RES);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(RES, RES);            // innentől 794 × 1123 egységben rajzolunk
  ctx.textBaseline = "alphabetic";
  pages.push(canvas);
  return ctx;
}

// Szöveg tördelése sorokra, hogy ne lógjon ki a megadott szélességből
function wrapText(ctx, text, maxWidth, firstLineWidth = maxWidth) {
  const lines = [];
  String(text).split("\n").forEach((paragraph) => {
    let line = "";
    paragraph.split(" ").forEach((word) => {
      const width = lines.length === 0 ? firstLineWidth : maxWidth;
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > width && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    lines.push(line);
  });
  return lines;
}

function setFont(ctx, size, family = F_BODY, weight = 400) {
  ctx.font = `${weight} ${size}px ${family}`;
}

// Kis, nagybetűs címke (pl. "MIRE MEGY A PÉNZ")
function label(ctx, text, x, y, align = "left") {
  setFont(ctx, 9.5, F_BODY, 600);
  ctx.fillStyle = PDF.muted;
  ctx.textAlign = align;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0.8px";
  ctx.fillText(text.toUpperCase(), x, y);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
}

function hline(ctx, y, width = 1, color = PDF.line, x1 = MARGIN, x2 = PAGE_W - MARGIN) {
  ctx.fillStyle = color;
  ctx.fillRect(x1, y, x2 - x1, width);
}

// ---------- Az ajánlat megrajzolása ----------
function drawQuote() {
  const c = compute();                       // a számolás a script.js-ből
  const lang = docLang();                    // az ajánlat nyelve (i18n.js)
  const used = CAT_ORDER.filter((k) => c.byCat[k] > 0);
  const pages = [];
  let ctx = newPage(pages);
  let y = MARGIN;

  // Ha a következő elem (h magasságú) nem fér ki, új oldal
  const ensure = (h) => {
    if (y + h > PAGE_H - MARGIN) {
      ctx = newPage(pages);
      y = MARGIN;
    }
  };

  // --- Fejléc: logó, márka, elérhetőség, dátumok ---
  let bx0 = MARGIN;
  if (LOGO.complete && LOGO.naturalWidth) {
    ctx.drawImage(LOGO, MARGIN, y, 48, 48);
    bx0 = MARGIN + 60;
  }
  setFont(ctx, 24, F_DISPLAY, 800);
  ctx.fillStyle = PDF.ink;
  ctx.fillText($("me").value || "", bx0, y + 22);
  setFont(ctx, 12);
  ctx.fillStyle = PDF.muted;
  ctx.fillText($("contact").value, bx0, y + 42);

  setFont(ctx, 10.5, F_MONO);
  ctx.textAlign = "right";
  [$("o-no").textContent, $("o-date").textContent, $("o-valid").textContent].forEach((t, i) => {
    ctx.fillText(t, PAGE_W - MARGIN, y + 12 + i * 15);
  });
  ctx.textAlign = "left";
  y += 60;
  hline(ctx, y, 2, PDF.ink);
  y += 34;

  // --- Cím és ügyfél ---
  setFont(ctx, 17, F_DISPLAY, 600);
  ctx.fillStyle = PDF.ink;
  ctx.fillText(d("title"), MARGIN, y);
  y += 22;
  setFont(ctx, 12.5);
  ctx.fillStyle = PDF.muted;
  const clientLabel = d("client") + ": ";
  ctx.fillText(clientLabel, MARGIN, y);
  let x = MARGIN + ctx.measureText(clientLabel).width;
  setFont(ctx, 12.5, F_BODY, 600);
  ctx.fillStyle = PDF.ink;
  const clientName = $("client").value || "—";
  ctx.fillText(clientName, x, y);
  x += ctx.measureText(clientName).width;
  if ($("project").value) {
    setFont(ctx, 12.5);
    ctx.fillStyle = PDF.muted;
    ctx.fillText(" · " + $("project").value, x, y);
  }
  y += 34;

  // --- Színes sáv: mire megy a pénz ---
  if (used.length) {
    label(ctx, d("dist"), MARGIN, y);
    y += 10;
    let bx = MARGIN;
    used.forEach((k) => {
      const w = (c.byCat[k] / c.subtotal) * CONTENT_W;
      ctx.fillStyle = PDF.cats[k];
      ctx.fillRect(bx, y, w, 12);
      bx += w;
    });
    y += 30;
    // jelmagyarázat, sorokba tördelve
    let lx = MARGIN;
    used.forEach((k) => {
      setFont(ctx, 11);
      const name = catName(k, lang) + " ";
      const pctText = Math.round((c.byCat[k] / c.subtotal) * 100) + "%";
      const nameW = ctx.measureText(name).width;
      setFont(ctx, 11, F_MONO, 500);
      const w = 16 + nameW + ctx.measureText(pctText).width + 18;
      if (lx + w > PAGE_W - MARGIN) { lx = MARGIN; y += 18; }
      ctx.fillStyle = PDF.cats[k];
      ctx.fillRect(lx, y - 9, 9, 9);
      setFont(ctx, 11);
      ctx.fillStyle = PDF.ink;
      ctx.fillText(name, lx + 15, y);
      setFont(ctx, 11, F_MONO, 500);
      ctx.fillText(pctText, lx + 15 + nameW, y);
      lx += w;
    });
    y += 32;
  }

  // --- Táblázat ---
  const COL_TOTAL = PAGE_W - MARGIN;          // az oszlopok jobb széle
  const COL_PRICE = COL_TOTAL - 105;
  const COL_QTY = COL_PRICE - 105;
  const NAME_W = COL_QTY - 80 - MARGIN;       // a megnevezés oszlop szélessége

  const tableHeader = () => {
    label(ctx, d("thItem"), MARGIN + 4, y);
    label(ctx, d("thQty"), COL_QTY, y, "right");
    label(ctx, d("thPrice"), COL_PRICE, y, "right");
    label(ctx, d("thTotal"), COL_TOTAL, y, "right");
    y += 8;
    hline(ctx, y);
    y += 6;
  };
  ensure(60);
  tableHeader();

  used.forEach((k) => {
    const items = c.items.filter((it) => it.cat === k);

    // kategória sor (+ legalább az első tétel férjen alá, ne maradjon árván az oldal alján)
    ensure(80);
    if (y === MARGIN) tableHeader();
    y += 22;
    ctx.fillStyle = PDF.cats[k];
    ctx.fillRect(MARGIN + 4, y - 8, 7, 7);
    setFont(ctx, 11.5, F_BODY, 600);
    ctx.fillStyle = PDF.ink;
    ctx.fillText(catName(k, lang), MARGIN + 18, y);
    setFont(ctx, 11.5, F_MONO, 600);
    ctx.textAlign = "right";
    ctx.fillText(fmt(c.byCat[k]), COL_TOTAL, y);
    ctx.textAlign = "left";
    y += 6;

    items.forEach((it) => {
      setFont(ctx, 12.5);
      const nameLines = wrapText(ctx, it.name, NAME_W);
      setFont(ctx, 10.5);
      const descLines = it.desc ? wrapText(ctx, it.desc, NAME_W) : [];
      const h = 14 + nameLines.length * 17 + descLines.length * 14 + 6;

      ensure(h);
      if (y === MARGIN) tableHeader();
      let ry = y + 20;

      setFont(ctx, 12.5);
      ctx.fillStyle = PDF.ink;
      nameLines.forEach((line, i) => ctx.fillText(line, MARGIN + 4, ry + i * 17));

      // számok az első sor magasságában
      setFont(ctx, 12, F_MONO);
      ctx.textAlign = "right";
      ctx.fillText(`${it.qty} ${it.unit}`, COL_QTY, ry);
      ctx.fillText(fmt(it.price), COL_PRICE, ry);
      ctx.fillText(fmt(it.total), COL_TOTAL, ry);
      ctx.textAlign = "left";

      ry += (nameLines.length - 1) * 17;
      setFont(ctx, 10.5);
      ctx.fillStyle = PDF.muted;
      descLines.forEach((line, i) => ctx.fillText(line, MARGIN + 4, ry + 16 + i * 14));

      y += h;
      hline(ctx, y);
    });
  });

  // --- Végösszeg ---
  const totalLines = [[d("subtotal"), fmt(c.subtotal)]];
  if (c.rush) totalLines.push([`${d("rush")} (+${num("rush")}%)`, fmt(c.rush)]);
  if (c.disc) totalLines.push([`${d("disc")} (−${num("disc")}%)`, "−" + fmt(c.disc)]);
  ensure(30 + totalLines.length * 20 + 50);
  y += 28;
  const TX = PAGE_W - MARGIN - 300;           // a végösszeg blokk bal széle
  totalLines.forEach(([a, b]) => {
    setFont(ctx, 12.5);
    ctx.fillStyle = PDF.ink;
    ctx.fillText(a, TX, y);
    setFont(ctx, 12.5, F_MONO);
    ctx.textAlign = "right";
    ctx.fillText(b, COL_TOTAL, y);
    ctx.textAlign = "left";
    y += 20;
  });
  hline(ctx, y - 6, 2, PDF.ink, TX, COL_TOTAL);
  y += 22;
  setFont(ctx, 21, F_DISPLAY, 800);
  ctx.fillStyle = PDF.ink;
  ctx.fillText(d("total"), TX, y);
  ctx.textAlign = "right";
  ctx.fillText(fmt(c.total), COL_TOTAL, y);
  ctx.textAlign = "left";
  y += 30;

  // --- "Miért ennyi?" doboz ---
  if (used.length) {
    const PAD = 16, innerW = CONTENT_W - 2 * PAD - 14;
    // előre kiszámoljuk a sorokat, hogy tudjuk a doboz magasságát
    const bullets = used.map((k) => {
      setFont(ctx, 11.5, F_BODY, 600);
      const boldText = catName(k, lang) + ": ";
      const boldW = ctx.measureText(boldText).width;
      setFont(ctx, 11.5);
      return { boldText, boldW, lines: wrapText(ctx, catWhy(k, lang), innerW, innerW - boldW) };
    });
    const boxH = PAD + 18 + bullets.reduce((s, b) => s + b.lines.length * 16 + 4, 0) + PAD - 4;
    ensure(boxH + 10);
    y += 10;
    ctx.fillStyle = PDF.soft;
    ctx.fillRect(MARGIN, y, CONTENT_W, boxH);
    let by = y + PAD + 10;
    setFont(ctx, 12.5, F_DISPLAY, 600);
    ctx.fillStyle = PDF.ink;
    ctx.fillText(d("why"), MARGIN + PAD, by);
    by += 20;
    bullets.forEach((b) => {
      const bx = MARGIN + PAD + 14;
      ctx.fillStyle = PDF.ink;
      setFont(ctx, 11.5);
      ctx.fillText("•", MARGIN + PAD + 2, by);
      setFont(ctx, 11.5, F_BODY, 600);
      ctx.fillText(b.boldText, bx, by);
      setFont(ctx, 11.5);
      b.lines.forEach((line, i) => ctx.fillText(line, i === 0 ? bx + b.boldW : bx, by + i * 16));
      by += b.lines.length * 16 + 4;
    });
    y += boxH + 22;
  }

  // --- Megjegyzés ---
  const note = $("note").value.trim();
  if (note) {
    setFont(ctx, 10.5);
    const lines = wrapText(ctx, note, CONTENT_W);
    lines.forEach((line) => {
      ensure(16);
      ctx.fillStyle = PDF.muted;
      setFont(ctx, 10.5);
      ctx.fillText(line, MARGIN, y);
      y += 15;
    });
  }

  return pages;
}

// ---------- PDF fájl összerakása a képekből ----------
// A PDF egy szöveges "tartalomjegyzékkel" leírt fájl: objektumok (katalógus, oldalak, képek),
// a végén pedig egy táblázat (xref), ami megmondja, melyik objektum hányadik bájtnál kezdődik.
function buildPdf(images) {
  const enc = new TextEncoder();
  const parts = [];
  const offsets = [];
  let length = 0;
  const push = (data) => {
    const bytes = typeof data === "string" ? enc.encode(data) : data;
    parts.push(bytes);
    length += bytes.length;
  };
  const obj = (id, writeBody) => {
    offsets[id] = length;
    push(`${id} 0 obj\n`);
    writeBody();
    push("\nendobj\n");
  };

  const W = 595.28, H = 841.89;  // A4 méret PDF egységben (pont)
  push("%PDF-1.4\n%âãÏÓ\n");
  obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
  const kids = images.map((_, i) => `${3 + i * 3} 0 R`).join(" ");
  obj(2, () => push(`<< /Type /Pages /Kids [${kids}] /Count ${images.length} >>`));

  images.forEach((img, i) => {
    const pageId = 3 + i * 3, imageId = pageId + 1, contentId = pageId + 2;
    obj(pageId, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im${i} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`));
    obj(imageId, () => {
      push(`<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`);
      push(img.bytes);
      push("\nendstream");
    });
    const draw = `q ${W} 0 0 ${H} 0 0 cm /Im${i} Do Q`;   // "rajzold ki a képet az egész oldalra"
    obj(contentId, () => push(`<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`));
  });

  const xrefStart = length;
  const count = 3 + images.length * 3;
  push(`xref\n0 ${count}\n0000000000 65535 f \n`);
  for (let id = 1; id < count; id++) push(String(offsets[id]).padStart(10, "0") + " 00000 n \n");
  push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);
  return new Blob(parts, { type: "application/pdf" });
}

// canvas -> JPEG bájtok
function canvasToJpeg(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      resolve({ bytes: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height: canvas.height });
    }, "image/jpeg", 0.92);
  });
}

// Fájlnév ékezetek nélkül, az ajánlat nyelvén: "Arajanlat-Kovacs-Ingatlan-20261024.pdf" / "Oferta-…" / "Quote-…"
function pdfFileName() {
  const slug = ($("client").value || d("noClient"))
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || d("noClient");
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `${d("file")}-${slug}-${day}.pdf`;
}

async function makePdfFile() {
  await document.fonts.ready;                // várjuk meg a betűtípusokat
  const pages = drawQuote();
  const images = [];
  for (const page of pages) images.push(await canvasToJpeg(page));
  return new File([buildPdf(images)], pdfFileName(), { type: "application/pdf" });
}

// ---------- Mentés / megosztás ----------
function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// Telefonon a megosztás menü (Fájlokba mentés, WhatsApp, Mail…), gépen letöltés
async function deliverPdf(file) {
  const isPhone = matchMedia("(pointer: coarse)").matches;
  if (isPhone && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: file.name });
      showToast(t("tPdfDone"));
      return;
    } catch (err) {
      if (err.name === "AbortError") { $("toast").textContent = ""; return; } // a felhasználó bezárta
      if (err.name === "NotAllowedError") {
        // iPhone néha csak közvetlen koppintásra engedi a megosztást: adunk egy második gombot
        showShareAgain(file);
        return;
      }
    }
  }
  downloadFile(file);
  showToast(t("tPdfDownloaded") + file.name);
}

function showShareAgain(file) {
  $("toast").textContent = "";
  const btn = document.createElement("button");
  btn.className = "primary";
  btn.textContent = t("tPdfTap");
  btn.onclick = async () => {
    btn.remove();
    try { await navigator.share({ files: [file], title: file.name }); }
    catch (e) { if (e.name !== "AbortError") downloadFile(file); }
  };
  $("toast").after(btn);
}

$("pdf").onclick = async () => {
  const button = $("pdf");
  button.disabled = true;
  $("toast").textContent = t("tPdfMaking");
  try {
    const file = await makePdfFile();
    await deliverPdf(file);
  } catch (err) {
    console.error(err);
    showToast(t("tPdfFail"));
  } finally {
    button.disabled = false;
  }
};
