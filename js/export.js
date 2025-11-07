// Export Functionality
const ExportManager = {
    // Export responses to CSV
    exportToCSV(surveyId) {
        const survey = StorageManager.getSurvey(surveyId);
        const responses = StorageManager.getResponsesBySurvey(surveyId);

        if (!survey || responses.length === 0) {
            alert('No data to export');
            return;
        }

        // Build CSV header
        const headers = ['Response ID', 'Submitted At'];
        survey.questions.forEach(q => {
            headers.push(this.sanitizeCSV(q.question));
        });

        // Build CSV rows
        const rows = [headers];

        responses.forEach(response => {
            const row = [
                response.id,
                new Date(response.submittedAt).toLocaleString()
            ];

            survey.questions.forEach(q => {
                const answer = response.answers[q.id];
                if (Array.isArray(answer)) {
                    row.push(this.sanitizeCSV(answer.join('; ')));
                } else {
                    row.push(this.sanitizeCSV(answer || ''));
                }
            });

            rows.push(row);
        });

        // Convert to CSV string
        const csvContent = rows.map(row =>
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        // Download
        const filename = `${this.sanitizeFilename(survey.title)}_responses_${this.getDateString()}.csv`;
        StorageManager.downloadFile(csvContent, filename, 'text/csv');
    },

    // Export responses to JSON
    exportToJSON(surveyId) {
        const survey = StorageManager.getSurvey(surveyId);
        const responses = StorageManager.getResponsesBySurvey(surveyId);

        if (!survey || responses.length === 0) {
            alert('No data to export');
            return;
        }

        const exportData = {
            survey: {
                id: survey.id,
                title: survey.title,
                description: survey.description,
                questions: survey.questions
            },
            responses: responses,
            exportedAt: new Date().toISOString(),
            totalResponses: responses.length
        };

        const filename = `${this.sanitizeFilename(survey.title)}_responses_${this.getDateString()}.json`;
        StorageManager.exportJSON(exportData, filename);
    },

    // Export survey structure (without responses)
    exportSurvey(surveyId) {
        const survey = StorageManager.getSurvey(surveyId);

        if (!survey) {
            alert('Survey not found');
            return;
        }

        const filename = `${this.sanitizeFilename(survey.title)}_survey_${this.getDateString()}.json`;
        StorageManager.exportJSON(survey, filename);
    },

    // Export a single survey as JSON (for sharing between devices)
    exportSurveyJSON(surveyId) {
        const survey = StorageManager.getSurvey(surveyId);

        if (!survey) {
            alert('Survey not found');
            return;
        }

        // Create a clean export object without responses
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            survey: {
                title: survey.title,
                description: survey.description || '',
                questions: survey.questions,
                // Don't export password, published status, or original ID
                // These should be set fresh on the importing device
            }
        };

        const filename = `${this.sanitizeFilename(survey.title)}_export_${this.getDateString()}.json`;
        StorageManager.exportJSON(exportData, filename);
    },

    // Import a survey from JSON file
    importSurveyJSON(fileInput) {
        const file = fileInput.files[0];
        
        if (!file) {
            alert('No file selected');
            return;
        }

        if (file.type !== 'application/json') {
            alert('Please select a JSON file');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Validate the imported data
                if (!importData.survey || !importData.survey.title || !importData.survey.questions) {
                    alert('Invalid survey file format. Missing required fields.');
                    return;
                }

                // Validate questions array
                if (!Array.isArray(importData.survey.questions) || importData.survey.questions.length === 0) {
                    alert('Invalid survey file format. Survey must have at least one question.');
                    return;
                }

                // Create a new survey with fresh ID
                const newSurvey = {
                    id: StorageManager.generateId(),
                    title: importData.survey.title + ' (Imported)',
                    description: importData.survey.description || '',
                    published: false, // Default to unpublished
                    password: '', // No password by default
                    createdAt: new Date().toISOString(),
                    questions: importData.survey.questions.map(q => ({
                        ...q,
                        id: StorageManager.generateId() // Generate new IDs for questions
                    }))
                };

                // Save the imported survey
                if (StorageManager.saveSurvey(newSurvey)) {
                    alert(`Survey "${newSurvey.title}" imported successfully!`);
                    
                    // Reload the survey list if we're on that page
                    if (typeof loadSurveyList === 'function') {
                        loadSurveyList();
                    }
                    
                    // Reload kiosk selector if available
                    if (typeof loadKioskSurveySelector === 'function') {
                        loadKioskSurveySelector();
                    }
                } else {
                    alert('Error saving imported survey');
                }
                
            } catch (error) {
                console.error('Import error:', error);
                alert('Error importing survey. The file may be corrupted or invalid.');
            }
        };

        reader.onerror = () => {
            alert('Error reading file');
        };

        reader.readAsText(file);
    },

    // Helper: Sanitize CSV values
    sanitizeCSV(value) {
        if (value === null || value === undefined) return '';
        return String(value).replace(/"/g, '""');
    },

    // Helper: Sanitize filename
    sanitizeFilename(name) {
        return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    },

    // Helper: Get date string for filenames
    getDateString() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }
};
