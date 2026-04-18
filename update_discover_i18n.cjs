const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en.json');
const hiPath = path.join(__dirname, 'src', 'locales', 'hi.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

en.discover = {
  "headerBadge": "Public Directory",
  "titleP1": "Discover",
  "titleP2": "Verified Workers",
  "subtitle": "Browse the decentralized registry of authenticated informal economy professionals.",
  "statWorkers": "Registered Workers",
  "statAvgRating": "Avg Network Rating",
  "statEndorsements": "Total Endorsements",
  "filters": "Filters",
  "clearFilters": "Clear Filters",
  "searchPlaceholder": "Search by name or skill...",
  "filterSkill": "Filter by Skill",
  "filterCity": "Filter by City",
  "filterRating": "Minimum Rating",
  "results": "Workers Found",
  "noWorkers": "No workers found",
  "noWorkersSub": "Try adjusting your search criteria.",
  "viewProfile": "View Profile",
  "yrExp": "yr exp",
  "reviews": "reviews",
  "review": "review"
};

hi.discover = {
  "headerBadge": "सार्वजनिक निर्देशिका",
  "titleP1": "खोजें",
  "titleP2": "सत्यापित कामगार",
  "subtitle": "प्रमाणित अनौपचारिक अर्थव्यवस्था के पेशेवरों की विकेंद्रीकृत निर्देशिका ब्राउज़ करें।",
  "statWorkers": "पंजीकृत कामगार",
  "statAvgRating": "औसत नेटवर्क रेटिंग",
  "statEndorsements": "कुल एंडोर्समेंट",
  "filters": "फ़िल्टर",
  "clearFilters": "फ़िल्टर साफ़ करें",
  "searchPlaceholder": "नाम या कौशल से खोजें...",
  "filterSkill": "कौशल अनुसार फ़िल्टर करें",
  "filterCity": "शहर अनुसार फ़िल्टर करें",
  "filterRating": "न्यूनतम रेटिंग",
  "results": "कामगार मिले",
  "noWorkers": "कोई कामगार नहीं मिला",
  "noWorkersSub": "कृपया अपने खोज मापदंड को बदलें।",
  "viewProfile": "प्रोफ़ाइल देखें",
  "yrExp": "वर्ष का अनुभव",
  "reviews": "समीक्षाएँ",
  "review": "समीक्षा"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2));

console.log('Discover translations updated.');
