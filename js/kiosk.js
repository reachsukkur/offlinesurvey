// Kiosk Mode Logic
let selectedSurvey = null;
let countdownTimer = null;
let selectedSurveyId = null; // Store the survey ID for auto-reload

document.addEventListener('DOMContentLoaded', () => {
    loadPublishedSurveys();
    setupEventListeners();

    // Check if there's a survey ID in localStorage from previous session
    const savedSurveyId = localStorage.getItem('kioskModeSurveyId');
    if (savedSurveyId) {
        const survey = StorageManager.getSurvey(savedSurveyId);
        if (survey && survey.published) {
            // Auto-select and start the survey
            document.getElementById('surveySelector').value = savedSurveyId;
            selectedSurvey = survey;
            selectedSurveyId = savedSurveyId;
            showSurveyForm();
        }
    }
});

function setupEventListeners() {
    const surveySelector = document.getElementById('surveySelector');
    const startBtn = document.getElementById('startSurveyBtn');
    const cancelBtn = document.getElementById('cancelFormBtn');
    const surveyForm = document.getElementById('surveyForm');
    const adminLink = document.getElementById('adminLink');

    // Admin link with password protection
    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleAdminAccess();
    });

    surveySelector.addEventListener('change', (e) => {
        const surveyId = e.target.value;
        startBtn.disabled = !surveyId;

        if (surveyId) {
            selectedSurvey = StorageManager.getSurvey(surveyId);
            selectedSurveyId = surveyId;
            // Save survey ID for auto-reload after submissions
            localStorage.setItem('kioskModeSurveyId', surveyId);
        }
    });

    startBtn.addEventListener('click', () => {
        if (selectedSurvey) {
            showSurveyForm();
        }
    });

    cancelBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to restart the form?')) {
            // Restart the form by showing it again
            showSurveyForm();
        }
    });

    surveyForm.addEventListener('submit', handleSubmit);
}

function loadPublishedSurveys() {
    const surveys = StorageManager.getPublishedSurveys();
    const selector = document.getElementById('surveySelector');

    // Clear existing options except the first one
    selector.innerHTML = '<option value="">-- Select a Survey --</option>';

    if (surveys.length === 0) {
        selector.innerHTML += '<option value="" disabled>No published surveys available</option>';
        return;
    }

    surveys.forEach(survey => {
        const option = document.createElement('option');
        option.value = survey.id;
        option.textContent = survey.title;
        selector.appendChild(option);
    });
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function showSurveySelection() {
    showView('surveySelectionView');
    selectedSurvey = null;
    document.getElementById('surveySelector').value = '';
    document.getElementById('startSurveyBtn').disabled = true;
    loadPublishedSurveys(); // Refresh in case surveys were updated
}

function showSurveyForm() {
    if (!selectedSurvey) return;

    // Display survey info
    document.getElementById('surveyTitleDisplay').textContent = selectedSurvey.title;
    document.getElementById('surveyDescriptionDisplay').textContent = selectedSurvey.description || '';

    // Render questions
    const container = document.getElementById('formQuestions');
    container.innerHTML = selectedSurvey.questions.map((q, index) => {
        return renderQuestion(q, index);
    }).join('');

    showView('surveyFormView');
}

function renderQuestion(question, index) {
    const requiredMark = question.required ? '<span class="required">*</span>' : '';
    let inputHTML = '';

    switch (question.type) {
        case 'text':
            inputHTML = `<input type="text" name="q_${question.id}" class="form-input" ${question.required ? 'required' : ''}>`;
            break;

        case 'textarea':
            inputHTML = `<textarea name="q_${question.id}" class="form-textarea" rows="4" ${question.required ? 'required' : ''}></textarea>`;
            break;

        case 'multipleChoice':
            inputHTML = `
                <div class="radio-group">
                    ${question.options.map((opt, i) => `
                        <label class="radio-label">
                            <input type="radio" name="q_${question.id}" value="${escapeHtml(opt)}" ${question.required ? 'required' : ''}>
                            <span>${escapeHtml(opt)}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            break;

        case 'checkbox':
            inputHTML = `
                <div class="checkbox-group">
                    ${question.options.map((opt, i) => `
                        <label class="checkbox-label">
                            <input type="checkbox" name="q_${question.id}" value="${escapeHtml(opt)}">
                            <span>${escapeHtml(opt)}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            break;

        case 'rating':
            const maxRating = question.maxRating || 5;
            // Define smiley faces for different rating scales
            const smileys5 = ['😞', '😕', '😐', '🙂', '😄']; // 1-5 scale
            const smileys10 = ['😡', '😠', '😞', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩']; // 1-10 scale
            const smileySet = maxRating === 10 ? smileys10 : smileys5;
            
            inputHTML = `
                <div class="rating-group">
                    ${Array.from({ length: maxRating }, (_, i) => i + 1).map(num => {
                        const emoji = smileySet[num - 1] || num;
                        return `
                        <label class="rating-label" data-value="${num}">
                            <input type="radio" name="q_${question.id}" value="${num}" ${question.required ? 'required' : ''}>
                            <span class="rating-number">${emoji}</span>
                        </label>
                    `;
                    }).join('')}
                </div>
            `;
            break;

        case 'yesNo':
            inputHTML = `
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="q_${question.id}" value="Yes" ${question.required ? 'required' : ''}>
                        <span>👍 Yes</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="q_${question.id}" value="No" ${question.required ? 'required' : ''}>
                        <span>👎 No</span>
                    </label>
                </div>
            `;
            break;

        case 'date':
            inputHTML = `<input type="date" name="q_${question.id}" class="form-input" ${question.required ? 'required' : ''}>`;
            break;
    }

    return `
        <div class="form-question">
            <label class="question-label">
                ${index + 1}. ${escapeHtml(question.question)}${requiredMark}
            </label>
            ${inputHTML}
        </div>
    `;
}

function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const answers = {};

    // Collect all answers
    selectedSurvey.questions.forEach(question => {
        const name = `q_${question.id}`;

        if (question.type === 'checkbox') {
            // For checkboxes, get all checked values
            const values = formData.getAll(name);
            answers[question.id] = values;
        } else {
            answers[question.id] = formData.get(name) || '';
        }
    });

    // Create response object
    const response = {
        id: StorageManager.generateId(),
        surveyId: selectedSurvey.id,
        submittedAt: new Date().toISOString(),
        answers: answers
    };

    // Save response
    if (StorageManager.saveResponse(response)) {
        showThankYou();
    } else {
        alert('Error saving response. Please try again.');
    }
}

function showThankYou() {
    showView('thankYouView');

    // Reset form
    document.getElementById('surveyForm').reset();

    // Start countdown to auto-reload the same survey
    startCountdown();
}

function startCountdown() {
    let seconds = 5;
    const countdownElement = document.getElementById('countdown');

    countdownElement.textContent = seconds;

    countdownTimer = setInterval(() => {
        seconds--;
        countdownElement.textContent = seconds;

        if (seconds <= 0) {
            clearCountdown();
            // Reload the same survey instead of going back to selection
            reloadCurrentSurvey();
        }
    }, 1000);
}

function reloadCurrentSurvey() {
    // Check if we have a selected survey
    if (selectedSurveyId) {
        // Reload the survey to ensure we have latest data
        selectedSurvey = StorageManager.getSurvey(selectedSurveyId);
        if (selectedSurvey && selectedSurvey.published) {
            showSurveyForm();
        } else {
            // Survey no longer available or unpublished
            alert('Survey is no longer available. Please select another survey.');
            localStorage.removeItem('kioskModeSurveyId');
            showSurveySelection();
        }
    } else {
        // Fallback to selection view
        showSurveySelection();
    }
}

function clearCountdown() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Password protection for admin access
function handleAdminAccess() {
    // Check if master password is set
    const hasMasterPassword = StorageManager.hasMasterPassword();

    if (!hasMasterPassword && !selectedSurvey) {
        // No password set and no survey selected, allow access
        if (confirm('No password protection is set up. Would you like to access admin?')) {
            window.location.href = 'index.html';
        }
        return;
    }

    // Prompt for password
    const inputPassword = prompt('Enter password to access admin area:');

    if (!inputPassword) {
        return; // User cancelled
    }

    // Get survey password if a survey is selected
    const surveyPassword = selectedSurvey ? selectedSurvey.password : null;

    // Verify password
    if (StorageManager.verifyPassword(inputPassword, surveyPassword)) {
        window.location.href = 'index.html';
    } else {
        alert('Incorrect password. Access denied.');
    }
}
