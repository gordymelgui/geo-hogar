const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with credentials if possible, or application default
const serviceAccountPath = path.join(__dirname, 'backend', 'service-account.json');
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  // Try default
  admin.initializeApp();
}

async function run() {
  const db = admin.firestore();
  console.log("Setting broker@test.com to PRO...");
  const usersSnapshot = await db.collection('users').where('email', '==', 'broker@test.com').get();
  
  if (usersSnapshot.empty) {
    console.log("Broker user not found.");
    return;
  }
  
  const doc = usersSnapshot.docs[0];
  await doc.ref.update({
    isPremium: true,
    userType: 'owner'
  });
  
  console.log(`Successfully set broker@test.com to PRO.`);
}

run().catch(console.error);
