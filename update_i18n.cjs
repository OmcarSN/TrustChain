const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en.json');
const hiPath = path.join(__dirname, 'src', 'locales', 'hi.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

// Apply Footer translations
en.footer = {
  "desc": "Revolutionizing informal economy credentials through on-chain verified identity.",
  "connect": "Connect & Explore",
  "tech": "Technology Stack",
  "builtOn": "Built on Stellar Testnet",
  "rights": "© 2026 TrustChain Protocol",
  "foundation": "Sovereign Identity Foundation",
  "live": "Stellar Testnet Live"
};
hi.footer = {
  "desc": "ऑन-चेन सत्यापित पहचान के माध्यम से अनौपचारिक अर्थव्यवस्था को डिजिटल रूप से सशक्त बनाना।",
  "connect": "जुड़ें और एक्सप्लोर करें",
  "tech": "तकनीकी स्टैक",
  "builtOn": "स्टेलर टेस्टनेट पर निर्मित",
  "rights": "© 2026 ट्रस्टचेन प्रोटोकॉल",
  "foundation": "सावरिन आइडेंटिटी फाउंडेशन",
  "live": "स्टेलर टेस्टनेट लाइव"
};

// Apply Landing translations
en.landing = {
  "badge": "The New Standard for Trust",
  "titleP1": "Your Work. Your Reputation.",
  "titleP2": "On-Chain Forever.",
  "desc": "A sovereign, portable credential system for informal economy workers — built on Stellar.",
  "btnWorker": "I'm a Worker",
  "btnFind": "Find Workers",
  "statsBar": "79 Total Interactions • 47 Active Wallets • Built on Stellar Testnet",
  "stat1Value": "2B+",
  "stat1Label": "Unbanked Workers",
  "stat2Value": "Zero-Cost",
  "stat2Label": "Credentials",
  "stat3Value": "Freighter",
  "stat3Label": "Powered",
  "howItWorks": "How It Works",
  "stepsTitleP1": "Three Steps to",
  "stepsTitleP2": "Verified Trust",
  "stepsDesc": "From registration to reputation — your journey on the decentralized trust layer.",
  "step1Title": "Register & Mint",
  "step1Desc": "Connect your Freighter wallet, fill your details, and mint a soulbound credential to Stellar.",
  "step2Title": "Get Endorsed",
  "step2Desc": "Employers submit on-chain endorsements with ratings and feedback — building your reputation.",
  "step3Title": "Verify & Share",
  "step3Desc": "Anyone can audit a worker's score and endorsement history through a tamper-proof profile.",
  "getStarted": "Get Started",
  "badge1": "Stellar Network",
  "badge2": "Soulbound Tokens",
  "badge3": "Testnet Live"
};
hi.landing = {
  "badge": "विश्वास का नया मानक",
  "titleP1": "आपका काम। आपकी प्रतिष्ठा।",
  "titleP2": "हमेशा के लिए ऑन-चेन।",
  "desc": "अनौपचारिक अर्थव्यवस्था के कामगारों के लिए एक संप्रभु, पोर्टेबल क्रेडेंशियल सिस्टम — स्टेलर पर निर्मित।",
  "btnWorker": "मैं एक कामगार हूँ",
  "btnFind": "कामगार खोजें",
  "statsBar": "79 कुल इंटरैक्शन • 47 सक्रिय वॉलेट • स्टेलर टेस्टनेट पर निर्मित",
  "stat1Value": "2B+",
  "stat1Label": "गैर-बैंकिंग कामगार",
  "stat2Value": "शून्य-लागत",
  "stat2Label": "क्रेडेंशियल",
  "stat3Value": "फ्रेइटर",
  "stat3Label": "द्वारा संचालित",
  "howItWorks": "यह कैसे काम करता है",
  "stepsTitleP1": "सत्यापित विश्वास के",
  "stepsTitleP2": "तीन कदम",
  "stepsDesc": "पंजीकरण से प्रतिष्ठा तक — विकेंद्रीकृत विश्वास परत पर आपकी यात्रा।",
  "step1Title": "रजिस्टर करें और मिंट करें",
  "step1Desc": "अपना फ्रेइटर वॉलेट कनेक्ट करें, विवरण भरें, और स्टेलर पर सॉलबाइंड क्रेडेंशियल को मिंट करें।",
  "step2Title": "एंडोर्समेंट प्राप्त करें",
  "step2Desc": "नियोक्ता रेटिंग और फीडबैक के साथ ऑन-चेन एंडोर्समेंट प्रस्तुत करते हैं — जिससे आपकी प्रतिष्ठा बनती है।",
  "step3Title": "सत्यापित करें और साझा करें",
  "step3Desc": "कोई भी अपरिवर्तनीय प्रोफ़ाइल के माध्यम से एक कार्यकर्ता के स्कोर और एंडोर्समेंट इतिहास का ऑडिट कर सकता है।",
  "getStarted": "शुरू करें",
  "badge1": "स्टेलर नेटवर्क",
  "badge2": "सॉलबाइंड टोकन",
  "badge3": "टेस्टनेट लाइव"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2));

console.log('Translations updated.');
