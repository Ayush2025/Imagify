// server/firebase.js
import admin from 'firebase-admin';

// Parse the entire JSON blob you stored in your VERCEL env-vars
// (make sure you named it FIREBASE_SERVICE_ACCOUNT)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize the Firebase Admin app (idempotent)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
