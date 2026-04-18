const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en.json');
const hiPath = path.join(__dirname, 'src', 'locales', 'hi.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

// Endorse
en.endorse = {
  header: "Endorse Worker",
  subHeader: "Submit an on-chain testimonial and rating.",
  searchLabel: "Search Worker (Address or Name)",
  searchPlaceholder: "e.g., GABCD... or 'John Worker'",
  walletLabel: "Worker Wallet Address",
  walletPlaceholder: "Enter 56-character Stellar Address",
  ratingLabel: "Rating (1-5)",
  commentLabel: "Detailed Comments",
  commentPlaceholder: "Describe the work completed...",
  submitBtn: "Submit Endorsement",
  submitting: "Submitting to Blockchain...",
  success: "Endorsement Submitted Successfully!",
  errorNoWallet: "Wallet not connected. Please connect wallet first."
};

hi.endorse = {
  header: "कामगार का समर्थन करें",
  subHeader: "ऑन-चेन प्रशंसापत्र और रेटिंग जमा करें।",
  searchLabel: "कामगार खोजें (पता या नाम)",
  searchPlaceholder: "जैसे, GABCD... या 'जॉन वर्कर'",
  walletLabel: "कामगार का वॉलेट पता",
  walletPlaceholder: "56-अक्षरीय स्टेलर पता दर्ज करें",
  ratingLabel: "रेटिंग (1-5)",
  commentLabel: "विस्तृत टिप्पणियाँ",
  commentPlaceholder: "किए गए कार्य का वर्णन करें...",
  submitBtn: "एंडोर्समेंट जमा करें",
  submitting: "ब्लॉकचेन पर जमा हो रहा है...",
  success: "एंडोर्समेंट सफलतापूर्वक जमा किया गया!",
  errorNoWallet: "वॉलेट कनेक्ट नहीं है। कृपया पहले वॉलेट कनेक्ट करें।"
};

// Registration
en.registration = {
  headerTitle: "Worker Identity Portal",
  headerSubtitle: "Create or manage your on-chain professional credential.",
  step1: "Personal Info",
  step2: "Professional Details",
  step3: "Location & Bio",
  btnNext: "Next Step",
  btnPrev: "Previous",
  btnSubmit: "Mint On-Chain Credential",
  btnMinting: "Minting Credential...",
  btnUpdate: "Update Credential",
  btnUpdating: "Updating Credential...",
  labelName: "Full Name",
  labelPhone: "Phone Number",
  labelSkill: "Primary Skill",
  skillSelect: "Select a Category",
  labelExp: "Years of Experience",
  labelCity: "City",
  labelBio: "Professional Bio",
  successTitle: "Credential Registered!",
  successDesc: "Your worker credential is now live on the Stellar network.",
  successBtn: "View Dashboard"
};

hi.registration = {
  headerTitle: "कामगार पहचान पोर्टल",
  headerSubtitle: "अपना ऑन-चेन पेशेवर क्रेडेंशियल बनाएं या प्रबंधित करें।",
  step1: "व्यक्तिगत जानकारी",
  step2: "पेशेवर विवरण",
  step3: "स्थान और विवरण",
  btnNext: "अगला कदम",
  btnPrev: "पिछला",
  btnSubmit: "ऑन-चेन क्रेडेंशियल मिंट करें",
  btnMinting: "क्रेडेंशियल मिंट हो रहा है...",
  btnUpdate: "क्रेडेंशियल अपडेट करें",
  btnUpdating: "क्रेडेंशियल अपडेट हो रहा है...",
  labelName: "पूरा नाम",
  labelPhone: "फ़ोन नंबर",
  labelSkill: "प्राथमिक कौशल",
  skillSelect: "एक श्रेणी चुनें",
  labelExp: "अनुभव के वर्ष",
  labelCity: "शहर",
  labelBio: "पेशेवर विवरण (बायो)",
  successTitle: "क्रेडेंशियल पंजीकृत!",
  successDesc: "आपका कामगार क्रेडेंशियल अब स्टेलर नेटवर्क पर लाइव है।",
  successBtn: "डैशबोर्ड देखें"
};

// Profile
en.profile = {
  loading: "Loading Profile...",
  notFound: "Profile Not Found",
  notFoundDesc: "The requested worker profile could not be found.",
  backBtn: "Back to Dashboard",
  badgeVerified: "Verified Worker",
  badgeUnverified: "Unverified Worker",
  tabOverview: "Overview",
  tabReviews: "Reviews",
  tabOnChain: "On-Chain Log",
  statJobs: "Jobs Completed",
  statRating: "Average Rating",
  statPoints: "Trust Points",
  aboutHeading: "About the Worker",
  detailsHeading: "Details",
  skillsHeading: "Skill Categories",
  endorseBtn: "Endorse Worker",
  hireBtn: "Contact / Hire",
  noReviews: "No reviews yet.",
  reviewsHeader: "Endorsements & Reviews",
  logHeader: "On-Chain Interaction Log",
  logEmpty: "No interactions found."
};

hi.profile = {
  loading: "प्रोफ़ाइल लोड हो रही है...",
  notFound: "प्रोफ़ाइल नहीं मिली",
  notFoundDesc: "अनुरोधित कामगार प्रोफ़ाइल नहीं मिल सकी।",
  backBtn: "डैशबोर्ड पर वापस जाएं",
  badgeVerified: "सत्यापित कामगार",
  badgeUnverified: "असत्यापित कामगार",
  tabOverview: "अवलोकन",
  tabReviews: "समीक्षाएँ",
  tabOnChain: "ऑन-चेन लॉग",
  statJobs: "नौकरियां पूरी कीं",
  statRating: "औसत रेटिंग",
  statPoints: "ट्रस्ट पॉइंट्स",
  aboutHeading: "कामगार के बारे में",
  detailsHeading: "विवरण",
  skillsHeading: "कौशल श्रेणियाँ",
  endorseBtn: "कामगार का समर्थन करें",
  hireBtn: "संपर्क करें / काम पर रखें",
  noReviews: "अभी तक कोई समीक्षा नहीं।",
  reviewsHeader: "समर्थन और समीक्षाएं",
  logHeader: "ऑन-चेन इंटरैक्शन लॉग",
  logEmpty: "कोई इंटरैक्शन नहीं मिला।"
};

// Analytics
en.analytics = {
  headerTitle: "Platform Analytics",
  headerSubtitle: "Network insights and activity on the TrustChain smart contracts.",
  statTotalUsers: "Total Registered",
  statCreds: "Active Credentials",
  statReviews: "Total Reviews",
  statFees: "Network Fees (XLM)",
  chartTitle: "System Growth Over Time",
  tableHeader: "Recent On-Chain Activity",
  tableType: "Tx Type",
  tableTime: "Timestamp",
  tableHash: "Hash / Ledger"
};

hi.analytics = {
  headerTitle: "प्लेटफ़ॉर्म एनालिटिक्स",
  headerSubtitle: "ट्रस्टचेन स्मार्ट कॉन्ट्रैक्ट्स पर नेटवर्क इनसाइट्स और गतिविधि।",
  statTotalUsers: "कुल पंजीकृत",
  statCreds: "सक्रिय क्रेडेंशियल्स",
  statReviews: "कुल समीक्षाएँ",
  statFees: "नेटवर्क शुल्क (XLM)",
  chartTitle: "समय के साथ प्रणाली का विकास",
  tableHeader: "हाल की ऑन-चेन गतिविधि",
  tableType: "लेनदेन प्रकार",
  tableTime: "समय-चिह्न",
  tableHash: "हैश / लेजर"
};

// Verify
en.verify = {
  header: "Instant Verification",
  subHeader: "Instantly check the authenticity of a worker's TrustChain ID.",
  inputPlaceholder: "Scan QR or Enter Worker ID",
  btnVerify: "Verify Now",
  verifiedResult: "Identity Verified!",
  verifiedText: "This worker holds a valid on-chain credential.",
  failedResult: "Verification Failed",
  failedText: "This ID is invalid or does not hold a credential."
};

hi.verify = {
  header: "त्वरित सत्यापन",
  subHeader: "कामगार के ट्रस्टचेन आईडी की प्रामाणिकता की तुरंत जांच करें।",
  inputPlaceholder: "QR स्कैन करें या कामगार ID दर्ज करें",
  btnVerify: "अभी सत्यापित करें",
  verifiedResult: "पहचान सत्यापित!",
  verifiedText: "इस कामगार के पास एक वैध ऑन-चेन क्रेडेंशियल है।",
  failedResult: "सत्यापन विफल",
  failedText: "यह ID अमान्य है या इसके पास कोई क्रेडेंशियल नहीं है।"
};

// Admin
en.admin = {
  header: "Admin Logs",
  subHeader: "Monitor advanced system events and errors.",
  tableEvent: "Event",
  tableDetails: "Details",
  tableModule: "Module",
  noLogs: "No admin logs collected yet."
};

hi.admin = {
  header: "व्यवस्थापक लॉग",
  subHeader: "उन्नत सिस्टम ईवेंट और त्रुटियों की निगरानी करें।",
  tableEvent: "ईवेंट",
  tableDetails: "विवरण",
  tableModule: "मॉड्यूल",
  noLogs: "अभी तक कोई व्यवस्थापक लॉग एकत्र नहीं किया गया।"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2));

console.log('All remaining translations updated.');
