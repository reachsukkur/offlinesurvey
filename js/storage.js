// Storage Manager - Handles all localStorage operations
const StorageManager = {
    // Storage keys
    KEYS: {
        SURVEYS: 'surveys',
        RESPONSES: 'responses',
        MASTER_PASSWORD: 'masterPassword'
    },

    // Get all surveys
    getSurveys() {
        try {
            const surveys = localStorage.getItem(this.KEYS.SURVEYS);
            return surveys ? JSON.parse(surveys) : [];
        } catch (error) {
            console.error('Error loading surveys:', error);
            return [];
        }
    },

    // Get a single survey by ID
    getSurvey(surveyId) {
        const surveys = this.getSurveys();
        return surveys.find(s => s.id === surveyId);
    },

    // Save surveys array
    saveSurveys(surveys) {
        try {
            localStorage.setItem(this.KEYS.SURVEYS, JSON.stringify(surveys));
            return true;
        } catch (error) {
            console.error('Error saving surveys:', error);
            alert('Error saving survey. Storage might be full.');
            return false;
        }
    },

    // Add or update a survey
    saveSurvey(survey) {
        const surveys = this.getSurveys();
        const index = surveys.findIndex(s => s.id === survey.id);

        if (index >= 0) {
            surveys[index] = survey;
        } else {
            surveys.push(survey);
        }

        return this.saveSurveys(surveys);
    },

    // Delete a survey and its responses
    deleteSurvey(surveyId) {
        const surveys = this.getSurveys();
        const filtered = surveys.filter(s => s.id !== surveyId);

        // Also delete all responses for this survey
        this.deleteResponsesBySurvey(surveyId);

        return this.saveSurveys(filtered);
    },

    // Get published surveys only
    getPublishedSurveys() {
        return this.getSurveys().filter(s => s.published);
    },

    // Get all responses
    getResponses() {
        try {
            const responses = localStorage.getItem(this.KEYS.RESPONSES);
            return responses ? JSON.parse(responses) : [];
        } catch (error) {
            console.error('Error loading responses:', error);
            return [];
        }
    },

    // Get responses for a specific survey
    getResponsesBySurvey(surveyId) {
        return this.getResponses().filter(r => r.surveyId === surveyId);
    },

    // Save responses array
    saveResponses(responses) {
        try {
            localStorage.setItem(this.KEYS.RESPONSES, JSON.stringify(responses));
            return true;
        } catch (error) {
            console.error('Error saving responses:', error);
            alert('Error saving response. Storage might be full.');
            return false;
        }
    },

    // Add a new response
    saveResponse(response) {
        const responses = this.getResponses();
        responses.push(response);
        return this.saveResponses(responses);
    },

    // Delete all responses for a survey
    deleteResponsesBySurvey(surveyId) {
        const responses = this.getResponses();
        const filtered = responses.filter(r => r.surveyId !== surveyId);
        return this.saveResponses(filtered);
    },

    // Clear all responses
    clearAllResponses() {
        return this.saveResponses([]);
    },

    // Generate unique ID
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Export data as JSON
    exportJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, filename, 'application/json');
    },

    // Download file helper
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Get storage usage info
    getStorageInfo() {
        const surveys = JSON.stringify(this.getSurveys()).length;
        const responses = JSON.stringify(this.getResponses()).length;
        const total = surveys + responses;

        return {
            surveys: surveys,
            responses: responses,
            total: total,
            totalKB: (total / 1024).toFixed(2),
            available: (5 * 1024 * 1024) - total // Assuming 5MB limit
        };
    },

    // Password Management
    setMasterPassword(password) {
        try {
            localStorage.setItem(this.KEYS.MASTER_PASSWORD, btoa(password));
            return true;
        } catch (error) {
            console.error('Error saving master password:', error);
            return false;
        }
    },

    getMasterPassword() {
        try {
            const encoded = localStorage.getItem(this.KEYS.MASTER_PASSWORD);
            return encoded ? atob(encoded) : null;
        } catch (error) {
            console.error('Error loading master password:', error);
            return null;
        }
    },

    hasMasterPassword() {
        return !!localStorage.getItem(this.KEYS.MASTER_PASSWORD);
    },

    verifyPassword(inputPassword, surveyPassword = null) {
        const masterPassword = this.getMasterPassword();

        // Check master password first
        if (masterPassword && inputPassword === masterPassword) {
            return true;
        }

        // Check survey-specific password if provided
        if (surveyPassword && inputPassword === surveyPassword) {
            return true;
        }

        return false;
    }
};
