const fs = require('fs');
const enPath = 'src/locales/en.json';
const hiPath = 'src/locales/hi.json';
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

en.dashboard.realTimeEvents = 'Real-time contract events';
en.dashboard.live = 'Live';
en.dashboard.noActivitySubFeed = 'Waiting for contract interactions on the Stellar Testnet...';

hi.dashboard.realTimeEvents = 'रीयल-टाइम अनुबंध ईवेंट';
hi.dashboard.live = 'लाइव';
hi.dashboard.noActivitySubFeed = 'स्टेलर टेस्टनेट पर अनुबंध इंटरैक्शन की प्रतीक्षा में...';

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2));

const compPath = 'src/components/ActivityFeed.jsx';
let comp = fs.readFileSync(compPath, 'utf8');

comp = comp.replace(/import \{ motion, AnimatePresence \} from 'framer-motion';/, "import { motion, AnimatePresence } from 'framer-motion';\nimport { useTranslation } from 'react-i18next';");
comp = comp.replace(/const ActivityFeed = \(\{ activities, loading \}\) => \{/, "const ActivityFeed = ({ activities, loading }) => {\n  const { t } = useTranslation();");

comp = comp.replace(/>Live Activity Feed</g, '>{t("dashboard.activityFeed")}<');
comp = comp.replace(/>Real-time contract events</g, '>{t("dashboard.realTimeEvents")}<');
comp = comp.replace(/>Live</g, '>{t("dashboard.live")}<');
comp = comp.replace(/>No Activity Yet</g, '>{t("dashboard.noActivity")}<');
comp = comp.replace(/>Waiting for contract interactions on the Stellar Testnet\.\.\.</g, '>{t("dashboard.noActivitySubFeed")}<');

fs.writeFileSync(compPath, comp);
console.log('Fixed ActivityFeed');
