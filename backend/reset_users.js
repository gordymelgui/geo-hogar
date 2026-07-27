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
  console.log("Resetting all users to standard...");
  const usersSnapshot = await db.collection('users').get();
  
  const batch = db.batch();
  let count = 0;
  
  usersSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.isPremium || data.userType !== 'standard') {
      batch.update(doc.ref, {
        isPremium: false,
        userType: 'standard'
      });
      count++;
    }
  });
  
  if (count > 0) {
    await batch.commit();
    console.log(`Successfully reset ${count} users to standard.`);
  } else {
    console.log("No users needed resetting.");
  }
}

run().catch(console.error);
