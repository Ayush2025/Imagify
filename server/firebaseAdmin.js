import { initializeApp, cert } from 'firebase-admin/app';

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT env var is missing. It should be the JSON string of your service account key.'
  );
}

// Parse the JSON blob you set in Vercel/GitHub Secrets
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
  credential: cert(serviceAccount),
});

console.log('✅ Firebase Admin initialized');
