const fs = require('fs');

const missingEn = {
  "adminLogs": {
    "headerTitle": "System Logs",
    "headerSubtitle": "Internal monitoring dashboard mapping all LocalStorage captured exceptions and transactions.",
    "refreshBtn": "Refresh",
    "clearBtn": "Clear Logs",
    "txLogsTab": "Transaction Log",
    "errorLogsTab": "Exception Log"
  },
  "dashboard": {
    "searchPlaceholder": "Search or enter address..."
  },
  "endorse": {
    "headerTitle": "Endorse Excellence",
    "headerSubtitle": "Validate trusted workers on Stellar",
    "formTitle": "Write Endorsement",
    "selectJobType": "Select type...",
    "btnSubmit": "Sign & Seal Endorsement",
    "placeholderFeedback": "Describe work quality, professionalism, and reliability..."
  },
  "verify": {
    "headerTitle": "Verify Worker",
    "headerTitleHighlight": "Reputation",
    "headerSubtitle": "Search any Stellar address to audit on-chain credentials and reputation"
  }
};

const missingHi = {
  "adminLogs": {
    "headerTitle": "सिस्टम लॉग",
    "headerSubtitle": "स्थानीय भंडारण अपवादों और लेनदेन की निगरानी डैशबोर्ड।",
    "refreshBtn": "ताज़ा करें",
    "clearBtn": "लॉग साफ़ करें",
    "txLogsTab": "लेनदेन लॉग",
    "errorLogsTab": "अपवाद लॉग"
  },
  "dashboard": {
    "searchPlaceholder": "खोजें या पता दर्ज करें..."
  },
  "endorse": {
    "headerTitle": "उत्कृष्टता का समर्थन करें",
    "headerSubtitle": "स्टेलर पर विश्वसनीय कामगारों को मान्य करें",
    "formTitle": "समर्थन लिखें",
    "selectJobType": "प्रकार चुनें...",
    "btnSubmit": "हस्ताक्षर करें और समर्थन दर्ज करें",
    "placeholderFeedback": "काम की गुणवत्ता, व्यावसायिकता और विश्वसनीयता का वर्णन करें..."
  },
  "verify": {
    "headerTitle": "कामगार की पुष्टि करें",
    "headerTitleHighlight": "प्रतिष्ठा",
    "headerSubtitle": "ऑन-चेन क्रेडेंशियल और प्रतिष्ठा का ऑडिट करने के लिए किसी भी स्टेलर पते को खोजें"
  }
};

const mergeDeep = (target, source) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) {
      Object.assign(source[key], mergeDeep(target[key] || {}, source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
};

const enPath = './src/locales/en.json';
const hiPath = './src/locales/hi.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

mergeDeep(enData, missingEn);
mergeDeep(hiData, missingHi);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));

console.log("Updated en.json and hi.json");
