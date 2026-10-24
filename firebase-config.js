// =====================================================
//  Firebase beállítások – az Árajánlat saját projektje (NEM a FoodShare-é)
//
//  (Ha FIREBASE_CONFIG = null lenne, a Munkáim rész nem működne, a kalkulátor és a PDF igen.)
//
//  A config-ot a Firebase konzolban találod:
//  Project settings (fogaskerék) -> General -> Your apps -> SDK setup and configuration -> Config
//  (Ez nem titkos jelszó – a weboldal kódjában amúgy is mindenki láthatja.
//   Az adataidat a firestore.rules szabályai védik.)
// =====================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBVlTImehBboOed6mNXzd6z4gTbPYokBFI",
  authDomain: "alexfpv-studio.firebaseapp.com",
  projectId: "alexfpv-studio",
  storageBucket: "alexfpv-studio.firebasestorage.app",
  messagingSenderId: "395177721432",
  appId: "1:395177721432:web:e0b4c2e6eb1dd7143b142d",
};

/* Kitöltve valahogy így néz ki:
const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "alexfpv-studio.firebaseapp.com",
  projectId: "alexfpv-studio",
  storageBucket: "alexfpv-studio.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123",
};
*/
