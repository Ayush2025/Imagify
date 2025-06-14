// server/middleware/auth.js
import admin from 'firebase-admin';

//
// Initialize Firebase Admin SDK once
//
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const authUser = async (req, res, next) => {
  // Expect the Firebase ID Token in the `token` header
  const idToken = req.headers.token;
  if (!idToken) {
    return res.status(401).json({
      success: false,
      message: 'Not Authorized. No token provided.',
    });
  }

  try {
    // Verify & decode
    const decoded = await admin.auth().verifyIdToken(idToken);
    // Attach the Firebase UID as userId
    req.body.userId = decoded.uid;
    next();
  } catch (err) {
    console.error('Firebase auth error:', err);
    return res.status(401).json({
      success: false,
      message: 'Not Authorized. Invalid or expired token.',
    });
  }
};

export default authUser;
