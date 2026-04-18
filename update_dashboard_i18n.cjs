const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en.json');
const hiPath = path.join(__dirname, 'src', 'locales', 'hi.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

// Apply Dashboard translations
en.dashboard = {
  "commandCenter": "Command Center",
  "connectPrompt": "Connect wallet to access your dashboard.",
  "connectBtn": "Connect Wallet",
  "welcome": "Welcome Back",
  "identityHub": "Your on-chain identity hub",
  "credential": "Credential",
  "avgRating": "Avg Rating",
  "received": "Received",
  "given": "Given",
  "quickActions": "Quick Actions",
  "updateCred": "Update Credential",
  "mintCred": "Mint Credential",
  "workerPortal": "Worker Portal",
  "findWorkers": "Find Workers",
  "browseHire": "Browse & Hire",
  "endorseWorker": "Endorse Worker",
  "writeReview": "Write Review",
  "verifyWorker": "Verify Worker",
  "auditReputation": "Audit Reputation",
  "myProfile": "My Profile",
  "publicPage": "Public Page",
  "myCredential": "My Credential",
  "onChain": "On-Chain",
  "reputation": "Reputation",
  "review": "review",
  "reviews": "reviews",
  "activityFeed": "Activity Feed",
  "tabAll": "All",
  "tabReceived": "Received",
  "tabGiven": "Given",
  "noActivity": "No activity yet",
  "noActivitySub": "Endorsements you receive will appear here",
  "endorsementReceived": "Endorsement Received",
  "endorsementGiven": "Endorsement Given",
  "badge1": "Stellar Network",
  "badge2": "On-Chain Data",
  "badge3": "Live Testnet"
};

hi.dashboard = {
  "commandCenter": "कमांड सेंटर",
  "connectPrompt": "अपने डैशबोर्ड तक पहुँचने के लिए वॉलेट कनेक्ट करें।",
  "connectBtn": "वॉलेट कनेक्ट करें",
  "welcome": "वापसी पर स्वागत है",
  "identityHub": "आपका ऑन-चेन पहचान हब",
  "credential": "क्रेडेंशियल",
  "avgRating": "औसत रेटिंग",
  "received": "प्राप्त किया",
  "given": "दिया",
  "quickActions": "त्वरित क्रियाएँ",
  "updateCred": "क्रेडेंशियल अपडेट करें",
  "mintCred": "क्रेडेंशियल मिंट करें",
  "workerPortal": "कामगार पोर्टल",
  "findWorkers": "कामगार खोजें",
  "browseHire": "खोजें और किराए पर लें",
  "endorseWorker": "कामगार का समर्थन करें",
  "writeReview": "समीक्षा लिखें",
  "verifyWorker": "कामगार सत्यापित करें",
  "auditReputation": "प्रतिष्ठा ऑडिट",
  "myProfile": "मेरी प्रोफ़ाइल",
  "publicPage": "सार्वजनिक पृष्ठ",
  "myCredential": "मेरा क्रेडेंशियल",
  "onChain": "ऑन-चेन",
  "reputation": "प्रतिष्ठा",
  "review": "समीक्षा",
  "reviews": "समीक्षाएँ",
  "activityFeed": "गतिविधि फ़ीड",
  "tabAll": "सभी",
  "tabReceived": "प्राप्त",
  "tabGiven": "दिया",
  "noActivity": "अभी कोई गतिविधि नहीं",
  "noActivitySub": "आपको मिलने वाले समर्थन यहां दिखाई देंगे",
  "endorsementReceived": "समर्थन प्राप्त हुआ",
  "endorsementGiven": "समर्थन दिया गया",
  "badge1": "स्टेलर नेटवर्क",
  "badge2": "ऑन-चेन डेटा",
  "badge3": "लाइव टेस्टनेट"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2));

console.log('Dashboard translations updated.');
