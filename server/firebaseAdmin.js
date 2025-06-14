// server/firebaseAdmin.js
import admin from 'firebase-admin'

// Load your service-account JSON from an env var:
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON
)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const auth = admin.auth()
