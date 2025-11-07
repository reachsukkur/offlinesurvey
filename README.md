# 📋 Offline Survey Application

A comprehensive, iPad-optimized survey application that works completely offline using browser local storage. Perfect for kiosks, events, and offline data collection.

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

### 📝 Survey Builder
Create professional surveys with ease:
- **7 Question Types**: Text (short/long), Multiple Choice, Checkboxes, Rating Scale, Yes/No, Date/Time
- **Drag & Drop**: Reorder questions easily
- **Live Preview**: See surveys as respondents will see them
- **Publishing Control**: Publish/unpublish surveys instantly
- **Password Protection**: Set individual passwords per survey
- **Duplicate Surveys**: Clone existing surveys for quick setup
- **Export/Import**: Export surveys to JSON and import them on other devices (NEW!)

### 📤 Export/Import Feature
Share survey templates across devices:
- **Export Surveys**: Export survey structure (without responses) to JSON file
- **Import Surveys**: Import surveys from other devices
- **Cross-Device Deployment**: Deploy the same survey to multiple kiosks
- **Survey Backup**: Backup survey designs for safekeeping
- **Template Sharing**: Share survey templates with team members
- **Automatic Validation**: Import validation ensures data integrity

### 🖥️ Kiosk Mode
Dedicated interface for continuous data collection:
- **Auto-Reload**: Automatically restarts the same survey after each submission
- **Locked Survey**: Survey selection managed from builder (prevents unauthorized changes)
- **Clean Interface**: Distraction-free, touch-optimized design
- **Countdown Timer**: 5-second countdown before reload
- **Restart Option**: Cancel button to restart current form
- **Password-Protected Admin Access**: Secure exit from kiosk mode

### 🎯 Kiosk Mode Settings (Builder Page)
Centralized control for kiosk mode:
- **Survey Selection**: Choose which survey runs in kiosk mode
- **Visual Feedback**: See which survey is currently active
- **Quick Changes**: Switch kiosk surveys without leaving builder
- **Clear Selection**: Remove kiosk survey assignment

### 📊 Analytics Dashboard
Powerful data analysis tools:
- **Visual Charts**: Bar charts, pie charts, and trend analysis (Chart.js)
- **Response Statistics**: Total responses, completion rates, timestamps
- **Filter Options**: By survey, date range, question type
- **Detailed Reports**: Individual response viewing
- **Data Export**: Export to CSV or JSON formats

### 🔐 Security Features
Multi-layer password protection:
- **Master Password**: One-time setup, grants admin access to all surveys
- **Survey-Specific Passwords**: Individual passwords per survey
- **Admin Link Protection**: Password prompt when accessing admin from kiosk mode
- **Hidden Setup**: Master password button auto-hides after setup

### 🌍 Language Support
Full internationalization support:
- **UTF-8 Encoding**: Support for all Unicode languages
- **RTL Support**: Right-to-left languages (Arabic, Hebrew)
- **Arabic Demo**: Included demo survey in Arabic
- **Mixed Content**: Seamlessly mix languages in surveys

## 🚀 Quick Start

### Installation
1. **Download** or clone this repository
2. **Open** `index.html` in your browser (no server required!)
3. **Start creating** surveys immediately

### Creating Your First Survey
1. Open `index.html` in your browser
2. Click **"Create New Survey"**
3. Enter survey title and description
4. Add questions using the question type buttons
5. Configure each question (text, options, required status)
6. Click **"Save Survey"** to store locally
7. Check **"Published"** checkbox to make it available in kiosk mode

### Setting Up Kiosk Mode
1. **Set Master Password** (first-time only):
   - In Survey Builder, click **"🔐 Master Password"** button
   - Enter and confirm your password
   - Button will disappear after setup

2. **Configure Kiosk Survey**:
   - In Survey Builder, locate **"Kiosk Mode Settings"** card
   - Select a published survey from dropdown
   - Click **"Set as Kiosk Survey"**
   - Green confirmation will appear

3. **Launch Kiosk Mode**:
   - Open `kiosk.html` in your browser
   - Survey will automatically load
   - After each submission, survey reloads in 5 seconds

4. **Exit Kiosk Mode**:
   - Click **"Admin"** link in header
   - Enter master password or survey-specific password
   - Redirects to Survey Builder

### Viewing Analytics
1. Open `analytics.html` in your browser
2. Select a survey from dropdown
3. View charts, statistics, and detailed responses
4. Click **"Export to CSV"** or **"Export to JSON"** to download data

## 📱 iPad Kiosk Setup

For a true kiosk experience on iPad:

1. **Add to Home Screen**:
   - Open Safari and navigate to `kiosk.html`
   - Tap the Share button (square with arrow)
   - Select **"Add to Home Screen"**
   - Name it (e.g., "Survey Kiosk")

2. **Enable Guided Access** (locks to single app):
   - Go to **Settings > Accessibility > Guided Access**
   - Turn on Guided Access
   - Set a passcode
   - Open your kiosk web app
   - Triple-click home button to start Guided Access
   - Circle any areas to disable (or leave full screen)
   - Tap **"Start"** in top right

3. **Exit Guided Access**:
   - Triple-click home button
   - Enter Guided Access passcode
   - Tap **"End"**

## 🌐 Language Support

### Using Arabic or RTL Languages
1. **See Demo**: Open `demo-arabic.html` for Arabic example
2. **Auto-Detection**: App automatically handles RTL text
3. **Manual RTL**: Change HTML tag to:
   ```html
   <html lang="ar" dir="rtl">
   ```
4. **All Features Work**: Builder, kiosk, and analytics support RTL

### Supported Languages
✅ English | ✅ Arabic (العربية) | ✅ Hebrew (עברית) | ✅ Chinese (中文) | ✅ Japanese (日本語) | ✅ All Unicode languages

## 📂 File Structure

```
offlinesurvey/
├── index.html              # Survey Builder interface
├── kiosk.html              # Kiosk mode interface
├── analytics.html          # Analytics dashboard
├── demo-arabic.html        # Arabic language demo
├── css/
│   ├── main.css           # Global styles and variables
│   ├── builder.css        # Survey Builder styles
│   ├── kiosk.css          # Kiosk mode styles
│   └── analytics.css      # Analytics dashboard styles
├── js/
│   ├── storage.js         # LocalStorage wrapper & password management
│   ├── builder.js         # Survey creation & editing logic
│   ├── kiosk.js           # Kiosk mode & auto-reload logic
│   ├── analytics.js       # Analytics, charts & reports
│   ├── export.js          # CSV/JSON export functionality
│   ├── language-helper.js # RTL detection utilities
│   └── sample-arabic-surveys.js # Arabic demo data
└── README.md              # This file
```

## 🔧 Technical Details

### Technology Stack
- **HTML5**: Semantic markup, mobile-optimized
- **CSS3**: Modern styling, flexbox, grid layouts
- **Vanilla JavaScript**: No frameworks, ES6+
- **LocalStorage API**: All data stored locally
- **Chart.js 4.4.0**: Data visualization

### Browser Compatibility
- ✅ iPad Safari (optimized)
- ✅ Chrome (desktop & mobile)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (desktop & mobile)
- ⚠️ Requires localStorage support

### Data Storage
- **Location**: Browser LocalStorage
- **Format**: JSON
- **Capacity**: ~5-10MB (varies by browser)
- **Persistence**: Data persists until manually cleared

## 📊 Data Structure

### Survey Object
```json
{
  "id": "survey_1699123456789",
  "title": "Customer Feedback Survey",
  "description": "Help us improve our service",
  "published": true,
  "password": "optional-password",
  "createdAt": "2025-11-06T12:00:00.000Z",
  "questions": [
    {
      "id": "q_1699123456790",
      "type": "text|textarea|multipleChoice|checkboxes|rating|yesNo|date",
      "question": "How satisfied are you with our service?",
      "required": true,
      "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
    }
  ]
}
```

### Response Object
```json
{
  "id": "response_1699123456791",
  "surveyId": "survey_1699123456789",
  "submittedAt": "2025-11-06T12:30:00.000Z",
  "answers": {
    "q_1699123456790": "Very Satisfied",
    "q_1699123456791": ["Option1", "Option2"]
  }
}
```

### LocalStorage Keys
- `surveys` - Array of all surveys
- `responses` - Array of all responses
- `masterPassword` - Base64 encoded master password
- `kioskModeSurveyId` - Currently active kiosk survey ID

## 🎨 Customization

### Changing Colors
Edit CSS variables in `css/main.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #27ae60;
    --danger-color: #e74c3c;
    --warning-color: #f39c12;
}
```

### Adding Question Types
1. Add type to `storage.js` question types
2. Create render function in `builder.js`
3. Add response handler in `kiosk.js`
4. Update analytics in `analytics.js`

## 🔐 Security Notes

### Password Storage
- Passwords are Base64 encoded (NOT encrypted)
- This provides **basic protection**, not military-grade security
- Suitable for preventing casual access
- **DO NOT** use for sensitive data requiring strong security

### Recommended Use Cases
✅ Event feedback collection  
✅ Kiosk surveys in controlled environments  
✅ Offline data collection  
✅ Internal team surveys  

❌ NOT recommended for:  
- Personal health information (PHI)
- Financial data
- Passwords or credentials
- Any sensitive/confidential data

## 🐛 Troubleshooting

### Survey Not Appearing in Kiosk Mode
- Ensure survey is marked as **"Published"**
- Check that survey is selected in **"Kiosk Mode Settings"**
- Verify localStorage is not full (check browser console)

### Data Not Saving
- Check browser's localStorage is enabled
- Check storage quota (5-10MB limit)
- Clear old data if storage is full
- Check browser console for errors

### Password Not Working
- Passwords are case-sensitive
- Ensure master password was set correctly
- Try using survey-specific password instead

### Charts Not Displaying
- Ensure Chart.js CDN is accessible (check browser console)
- Verify survey has responses
- Check that responses contain valid data

## 📦 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select branch and folder
4. Access via `https://reachsukkur.github.io/offlinesurvey/`

### Local Server
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### Static Hosting
Upload files to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - Free to use, modify, and distribute.

```
Copyright (c) 2025 Offline Survey Application

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 📞 Support

- **Documentation**: This README and inline code comments
- **Issues**: Check browser console for errors
- **Updates**: Watch this repository for updates

---

**Made with ❤️ for offline data collection**

*Last Updated: November 6, 2025*
