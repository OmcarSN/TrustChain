const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en.json');
const hiPath = path.join(__dirname, 'src', 'locales', 'hi.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

en.explorer = {
  "header": "TrustChain Explorer",
  "subHeader": "Verify credentials and traverse the trust graph.",
  "searchPlaceholder": "Search by Worker Name or ID...",
  "searchBtn": "Search & Verify",
  "searchBtnShort": "Search",
  "howToTitle": "How to verify a worker",
  "howToStep1": "Ask the worker for their TrustChain ID (Wallet Address) or Name.",
  "howToStep2": "Enter the ID in the search bar above.",
  "howToStep3": "View their on-chain soulbound credential and verify their reputation.",
  "noWorkers": "No Workers Found",
  "noWorkersSub": "Could not find any workers matching your search."
};

hi.explorer = {
  "header": "ट्रस्टचेन एक्सप्लोरर",
  "subHeader": "क्रेडेंशियल्स की पुष्टि करें और विश्वास ग्राफ़ को पार करें।",
  "searchPlaceholder": "कामगार के नाम या आईडी से खोजें...",
  "searchBtn": "खोजें और सत्यापित करें",
  "searchBtnShort": "खोजें",
  "howToTitle": "कामगार को कैसे सत्यापित करें",
  "howToStep1": "कामगार से उनका ट्रस्टचेन आईडी (वॉलेट एड्रेस) या नाम मांगें।",
  "howToStep2": "ऊपर दिए गए खोज बार में आईडी दर्ज करें।",
  "howToStep3": "उनके ऑन-चेन सॉलबाइंड क्रेडेंशियल को देखें और उनकी प्रतिष्ठा सत्यापित करें।",
  "noWorkers": "कोई कामगार नहीं मिला",
  "noWorkersSub": "आपकी खोज से मेल खाने वाला कोई कामगार नहीं मिला।"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2));

console.log('Explorer translations updated.');
