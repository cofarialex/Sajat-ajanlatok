// =====================================================
//  Felhő (Firebase): bejelentkezés és a "quotes" gyűjtemény kezelése
//  Itt csak a Firebase-zel való "beszélgetés" van, a kinézet a jobs.js-ben.
//
//  Az adatbázisban egy gyűjtemény van:
//    quotes – az elmentett árajánlataid (egy dokumentum = egy munka)
// =====================================================

const FIREBASE_VERSION = "10.12.2";

const Cloud = {
  enabled: typeof FIREBASE_CONFIG !== "undefined" && FIREBASE_CONFIG !== null,
  auth: null,
  db: null,
  user: null,
};

// Egy külső script betöltése (a Firebase-t csak akkor töltjük le, ha kell)
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Nem sikerült betölteni: " + src));
    document.head.appendChild(s);
  });
}

async function loadFirebase() {
  const base = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/`;
  if (!window.firebase) {
    await loadScript(base + "firebase-app-compat.js");
    await loadScript(base + "firebase-auth-compat.js");
    await loadScript(base + "firebase-firestore-compat.js");
  }
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
  Cloud.auth = firebase.auth();
  Cloud.db = firebase.firestore();
  // Offline mód: a munkák internet nélkül is látszanak, a változások később mennek fel
  try { await Cloud.db.enablePersistence({ synchronizeTabs: true }); } catch (e) {}
}

// Indítás: onUser(user) mindig lefut, ha be- vagy kijelentkezel
async function initCloud(onUser) {
  if (!Cloud.enabled) return onUser(null, "not-configured");
  try {
    await loadFirebase();
    Cloud.auth.onAuthStateChanged((user) => {
      Cloud.user = user;
      onUser(user);
    });
  } catch (e) {
    console.warn("[Árajánlat] A Firebase nem érhető el:", e.message);
    onUser(null, "offline");
  }
}

const cloudSignIn = (email, password) => Cloud.auth.signInWithEmailAndPassword(email, password);
const cloudSignOut = () => Cloud.auth.signOut();
const cloudResetPassword = (email) => Cloud.auth.sendPasswordResetEmail(email);

// Feliratkozás: ha bármelyik eszközön változik valami, azonnal megkapjuk a friss listát
function watchQuotes(onData, onError) {
  return Cloud.db.collection("quotes").orderBy("createdAt", "desc").onSnapshot(
    (snap) => onData(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))),
    onError
  );
}

// Mentés / módosítás / törlés.
// Nem várjuk meg a szervert: a Firebase azonnal frissíti a listát, és a háttérben feltölti.
const cloudSaveQuote = (quote) => Cloud.db.collection("quotes").doc(quote.id).set(quote);
const cloudUpdateQuote = (id, fields) => Cloud.db.collection("quotes").doc(id).update(fields);
const cloudDeleteQuote = (id) => Cloud.db.collection("quotes").doc(id).delete();
