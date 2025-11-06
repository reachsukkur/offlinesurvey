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
