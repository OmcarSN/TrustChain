const fs = require('fs');
let c = fs.readFileSync('README.md', 'utf8');
c = c.replace(/Level 6 Black Belt/g, 'Level 7 Master Belt');
c = c.replace(/Level 6/g, 'Level 7');
c = c.replace(
  '> **🧪 For Judges & Testers (Bypassing SMS):** \n> To test the worker registration flow without receiving an actual SMS, use the magic testing number: **`0000000000`** and enter **`000000`** as the OTP.',
  '> [!IMPORTANT]\n> **🧪 HOW TO BYPASS PHONE VERIFICATION FOR TESTING**\n> \n> To easily test the worker registration flow without receiving an actual SMS (or if Twilio blocks your region):\n> \n> 📞 **Phone Number:** `0000000000` (ten zeros)\n> 🔐 **OTP Code:** `000000` (six zeros)'
);
fs.writeFileSync('README.md', c, 'utf8');
