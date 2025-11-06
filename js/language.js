// Language Manager
const LanguageManager = {
    currentLang: localStorage.getItem('appLanguage') || 'en',
    
    translations: {
        en: {
            // Common
            loading: 'Loading...',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            back: 'Back',
            yes: 'Yes',
            no: 'No',
            
            // Survey Builder
            surveyBuilder: 'Survey Builder',
            createNewSurvey: 'Create New Survey',
            surveyTitle: 'Survey Title',
            surveyDescription: 'Survey Description',
            published: 'Published',
            unpublished: 'Unpublished',
            password: 'Password',
            masterPassword: 'Master Password',
            saveSurvey: 'Save Survey',
            deleteSurvey: 'Delete Survey',
            duplicateSurvey: 'Duplicate',
            questions: 'Questions',
            addQuestion: 'Add Question',
            questionText: 'Question Text',
            required: 'Required',
            optional: 'Optional',
            options: 'Options',
            addOption: 'Add Option',
            
            // Question Types
            textQuestion: 'Text',
            textareaQuestion: 'Long Text',
            multipleChoice: 'Multiple Choice',
            checkboxes: 'Checkboxes',
            rating: 'Rating',
            yesNo: 'Yes/No',
            dateQuestion: 'Date',
            
            // Kiosk Mode
            kioskMode: 'Kiosk Mode',
            surveyStation: 'Survey Station',
            welcome: 'Welcome!',
            selectSurvey: 'Please select a survey to begin:',
            startSurvey: 'Start Survey',
            submitSurvey: 'Submit Survey',
            thankYou: 'Thank You!',
            responseRecorded: 'Your response has been recorded successfully.',
            loadingNext: 'Loading next survey in',
            seconds: 'seconds...',
            admin: 'Admin',
            restart: 'Restart',
            
            // Kiosk Settings
            kioskSettings: 'Kiosk Mode Settings',
            selectKioskSurvey: 'Select which survey should run in kiosk mode:',
            setKioskSurvey: 'Set as Kiosk Survey',
            clearSelection: 'Clear Selection',
            kioskSetTo: 'Kiosk mode is set to:',
            
            // Analytics
            analytics: 'Analytics Dashboard',
            selectSurveyToView: 'Select a survey to view responses',
            totalResponses: 'Total Responses',
            viewResponses: 'View Responses',
            exportCSV: 'Export to CSV',
            exportJSON: 'Export to JSON',
            noResponses: 'No responses yet',
            responseDetails: 'Response Details',
            submittedAt: 'Submitted At',
            
            // Messages
            confirmDelete: 'Are you sure you want to delete this survey? This will also delete all responses.',
            confirmCancel: 'Are you sure you want to restart the form?',
            enterPassword: 'Enter password to access admin panel',
            incorrectPassword: 'Incorrect password',
            surveySaved: 'Survey saved successfully!',
            surveyDeleted: 'Survey deleted successfully',
            enterTitle: 'Please enter a survey title',
            addOneQuestion: 'Please add at least one question',
            masterPasswordSet: 'Master password set successfully!',
            kioskSurveySet: 'Kiosk survey set successfully! The kiosk mode will now use this survey.',
            kioskSurveyCleared: 'Kiosk survey cleared successfully!',
        },
        
        ar: {
            // Common
            loading: 'جاري التحميل...',
            save: 'حفظ',
            cancel: 'إلغاء',
            delete: 'حذف',
            edit: 'تعديل',
            back: 'رجوع',
            yes: 'نعم',
            no: 'لا',
            
            // Survey Builder
            surveyBuilder: 'منشئ الاستبيان',
            createNewSurvey: 'إنشاء استبيان جديد',
            surveyTitle: 'عنوان الاستبيان',
            surveyDescription: 'وصف الاستبيان',
            published: 'منشور',
            unpublished: 'غير منشور',
            password: 'كلمة المرور',
            masterPassword: 'كلمة المرور الرئيسية',
            saveSurvey: 'حفظ الاستبيان',
            deleteSurvey: 'حذف الاستبيان',
            duplicateSurvey: 'نسخ',
            questions: 'الأسئلة',
            addQuestion: 'إضافة سؤال',
            questionText: 'نص السؤال',
            required: 'مطلوب',
            optional: 'اختياري',
            options: 'الخيارات',
            addOption: 'إضافة خيار',
            
            // Question Types
            textQuestion: 'نص',
            textareaQuestion: 'نص طويل',
            multipleChoice: 'اختيار متعدد',
            checkboxes: 'مربعات اختيار',
            rating: 'تقييم',
            yesNo: 'نعم/لا',
            dateQuestion: 'تاريخ',
            
            // Kiosk Mode
            kioskMode: 'وضع الكشك',
            surveyStation: 'محطة الاستبيان',
            welcome: 'مرحباً!',
            selectSurvey: 'يرجى اختيار استبيان للبدء:',
            startSurvey: 'بدء الاستبيان',
            submitSurvey: 'إرسال الاستبيان',
            thankYou: 'شكراً لك!',
            responseRecorded: 'تم تسجيل إجابتك بنجاح.',
            loadingNext: 'تحميل الاستبيان التالي خلال',
            seconds: 'ثواني...',
            admin: 'الإدارة',
            restart: 'إعادة البدء',
            
            // Kiosk Settings
            kioskSettings: 'إعدادات وضع الكشك',
            selectKioskSurvey: 'اختر الاستبيان الذي سيعمل في وضع الكشك:',
            setKioskSurvey: 'تعيين كاستبيان الكشك',
            clearSelection: 'مسح الاختيار',
            kioskSetTo: 'تم تعيين وضع الكشك إلى:',
            
            // Analytics
            analytics: 'لوحة التحليلات',
            selectSurveyToView: 'اختر استبياناً لعرض الردود',
            totalResponses: 'إجمالي الردود',
            viewResponses: 'عرض الردود',
            exportCSV: 'تصدير إلى CSV',
            exportJSON: 'تصدير إلى JSON',
            noResponses: 'لا توجد ردود بعد',
            responseDetails: 'تفاصيل الرد',
            submittedAt: 'تم الإرسال في',
            
            // Messages
            confirmDelete: 'هل أنت متأكد من حذف هذا الاستبيان؟ سيتم حذف جميع الردود أيضاً.',
            confirmCancel: 'هل أنت متأكد من إعادة تشغيل النموذج؟',
            enterPassword: 'أدخل كلمة المرور للوصول إلى لوحة الإدارة',
            incorrectPassword: 'كلمة مرور غير صحيحة',
            surveySaved: 'تم حفظ الاستبيان بنجاح!',
            surveyDeleted: 'تم حذف الاستبيان بنجاح',
            enterTitle: 'يرجى إدخال عنوان الاستبيان',
            addOneQuestion: 'يرجى إضافة سؤال واحد على الأقل',
            masterPasswordSet: 'تم تعيين كلمة المرور الرئيسية بنجاح!',
            kioskSurveySet: 'تم تعيين استبيان الكشك بنجاح! سيستخدم وضع الكشك هذا الاستبيان الآن.',
            kioskSurveyCleared: 'تم مسح استبيان الكشك بنجاح!',
        }
    },
    
    // Get translation
    t(key) {
        return this.translations[this.currentLang][key] || key;
    },
    
    // Set language and update UI
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('appLanguage', lang);
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update all elements with data-i18n attribute
        this.updateUI();
        
        // Trigger custom event for components to refresh
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    },
    
    // Update all translatable elements
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // Update text or placeholder based on element type
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder) {
                    element.placeholder = translation;
                }
            } else {
                element.textContent = translation;
            }
        });
        
        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
    },
    
    // Initialize language on page load
    init() {
        // Set initial language
        const savedLang = localStorage.getItem('appLanguage') || 'en';
        this.setLanguage(savedLang);
        
        // Update the toggle switch if it exists
        const toggle = document.getElementById('languageToggle');
        if (toggle) {
            toggle.checked = savedLang === 'ar';
        }
    },
    
    // Create language toggle switch HTML
    createToggleHTML() {
        return `
            <div class="language-toggle">
                <span class="lang-label">EN</span>
                <label class="switch">
                    <input type="checkbox" id="languageToggle" ${this.currentLang === 'ar' ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <span class="lang-label">AR</span>
            </div>
        `;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LanguageManager.init());
} else {
    LanguageManager.init();
}
