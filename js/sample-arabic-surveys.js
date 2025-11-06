/**
 * Sample Arabic Survey Data
 * استبيان عينة بالعربية
 * 
 * You can copy this data and import it or manually create in the builder
 */

const sampleArabicSurvey = {
    "title": "استبيان رضا العملاء",
    "description": "شكراً لمشاركتكم في هذا الاستبيان. آراؤكم تساعدنا على تحسين خدماتنا.",
    "published": true,
    "questions": [
        {
            "type": "multipleChoice",
            "question": "كيف تقيم جودة الخدمة المقدمة؟",
            "required": true,
            "options": [
                "ممتاز",
                "جيد جداً",
                "جيد",
                "مقبول",
                "ضعيف"
            ]
        },
        {
            "type": "rating",
            "question": "على مقياس من 1 إلى 5، كم تقيم تجربتك معنا؟",
            "required": true,
            "maxRating": 5
        },
        {
            "type": "yesNo",
            "question": "هل توصي الآخرين بخدماتنا؟",
            "required": true
        },
        {
            "type": "checkbox",
            "question": "ما هي الخدمات التي استخدمتها؟ (يمكن اختيار أكثر من إجابة)",
            "required": false,
            "options": [
                "الاستشارات",
                "الدعم الفني",
                "التدريب",
                "التطوير",
                "الصيانة"
            ]
        },
        {
            "type": "text",
            "question": "ما هو اسم المدينة التي تقيم فيها؟",
            "required": false
        },
        {
            "type": "textarea",
            "question": "هل لديك أي اقتراحات أو ملاحظات إضافية؟",
            "required": false
        },
        {
            "type": "date",
            "question": "متى استخدمت خدماتنا لآخر مرة؟",
            "required": false
        }
    ]
};

/**
 * More Sample Surveys in Arabic
 */

const customerFeedbackSurvey = {
    "title": "استبيان آراء الزبائن",
    "description": "نقدر وقتكم في مشاركة آرائكم معنا",
    "published": true,
    "questions": [
        {
            "type": "multipleChoice",
            "question": "كيف سمعت عنا؟",
            "required": true,
            "options": [
                "وسائل التواصل الاجتماعي",
                "توصية من صديق",
                "محرك البحث جوجل",
                "الإعلانات",
                "أخرى"
            ]
        },
        {
            "type": "rating",
            "question": "ما مدى سهولة استخدام موقعنا الإلكتروني؟",
            "required": true,
            "maxRating": 10
        },
        {
            "type": "yesNo",
            "question": "هل ستتعامل معنا مرة أخرى؟",
            "required": true
        }
    ]
};

const employeeSurvey = {
    "title": "استبيان الموظفين",
    "description": "استبيان سري لتحسين بيئة العمل",
    "published": false,
    "questions": [
        {
            "type": "multipleChoice",
            "question": "ما مدى رضاك عن بيئة العمل؟",
            "required": true,
            "options": [
                "راضٍ جداً",
                "راضٍ",
                "محايد",
                "غير راضٍ",
                "غير راضٍ على الإطلاق"
            ]
        },
        {
            "type": "checkbox",
            "question": "ما هي المزايا التي تقدرها أكثر؟",
            "required": false,
            "options": [
                "المرونة في ساعات العمل",
                "التأمين الصحي",
                "فرص التطوير المهني",
                "بيئة العمل الإيجابية",
                "الراتب والحوافز"
            ]
        },
        {
            "type": "textarea",
            "question": "ما هي مقترحاتك لتحسين بيئة العمل؟",
            "required": false
        }
    ]
};

const eventFeedback = {
    "title": "تقييم الفعالية",
    "description": "شكراً لحضوركم، نرجو تقييم الفعالية",
    "published": true,
    "questions": [
        {
            "type": "rating",
            "question": "كيف تقيم محتوى الفعالية؟",
            "required": true,
            "maxRating": 5
        },
        {
            "type": "rating",
            "question": "كيف تقيم التنظيم؟",
            "required": true,
            "maxRating": 5
        },
        {
            "type": "multipleChoice",
            "question": "أي جلسة كانت الأفضل بالنسبة لك؟",
            "required": false,
            "options": [
                "الجلسة الافتتاحية",
                "ورشة العمل الأولى",
                "ورشة العمل الثانية",
                "النقاش الختامي"
            ]
        },
        {
            "type": "yesNo",
            "question": "هل تنصح الآخرين بحضور فعالياتنا المستقبلية؟",
            "required": true
        },
        {
            "type": "textarea",
            "question": "أي موضوعات ترغب أن نغطيها في الفعاليات القادمة؟",
            "required": false
        }
    ]
};

/**
 * Usage Instructions:
 * 
 * 1. Copy any survey object above
 * 2. Open browser console (F12)
 * 3. Paste this code:
 * 
 *    const survey = { ...sampleArabicSurvey, id: StorageManager.generateId(), createdAt: new Date().toISOString() };
 *    StorageManager.saveSurvey(survey);
 *    alert('تم إضافة الاستبيان بنجاح!');
 *    location.reload();
 * 
 * Or manually create surveys using the survey builder interface.
 */

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sampleArabicSurvey,
        customerFeedbackSurvey,
        employeeSurvey,
        eventFeedback
    };
}
