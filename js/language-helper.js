// Optional Language Helper
// This file provides utilities for switching between LTR and RTL languages

const LanguageHelper = {
    // Detect if text contains Arabic characters
    isArabic(text) {
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        return arabicPattern.test(text);
    },

    // Detect if text contains Hebrew characters
    isHebrew(text) {
        const hebrewPattern = /[\u0590-\u05FF]/;
        return hebrewPattern.test(text);
    },

    // Check if text is RTL language
    isRTL(text) {
        return this.isArabic(text) || this.isHebrew(text);
    },

    // Set page direction
    setDirection(direction) {
        document.documentElement.setAttribute('dir', direction);
    },

    // Toggle between RTL and LTR
    toggleDirection() {
        const currentDir = document.documentElement.getAttribute('dir');
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        this.setDirection(newDir);
        localStorage.setItem('preferredDirection', newDir);
    },

    // Set language
    setLanguage(langCode) {
        document.documentElement.setAttribute('lang', langCode);

        // Auto-set direction for known RTL languages
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        if (rtlLanguages.includes(langCode)) {
            this.setDirection('rtl');
        } else {
            this.setDirection('ltr');
        }

        localStorage.setItem('preferredLanguage', langCode);
    },

    // Load saved preferences
    loadPreferences() {
        const savedDir = localStorage.getItem('preferredDirection');
        const savedLang = localStorage.getItem('preferredLanguage');

        if (savedDir) {
            this.setDirection(savedDir);
        }

        if (savedLang) {
            document.documentElement.setAttribute('lang', savedLang);
        }
    },

    // Auto-detect direction from input text
    autoDetectAndSetDirection(text) {
        if (this.isRTL(text)) {
            this.setDirection('rtl');
        } else {
            this.setDirection('ltr');
        }
    }
};

// Optionally load preferences on page load
// Uncomment the line below to enable automatic preference loading
// document.addEventListener('DOMContentLoaded', () => LanguageHelper.loadPreferences());
