// Survey Builder Logic
let currentSurvey = null;
let currentView = 'list';

// Initialize the builder
document.addEventListener('DOMContentLoaded', () => {
    loadSurveyList();
    setupEventListeners();
    updateMasterPasswordButton(); // Check password status on load
    loadKioskSurveySelector(); // Load kiosk survey selector
    updateKioskSurveyStatus(); // Update kiosk status display
});

// Reload UI when language changes
window.addEventListener('languageChanged', () => {
    loadSurveyList();
    updateKioskSurveyStatus();
});

function setupEventListeners() {
    // View switching
    document.getElementById('createSurveyBtn').addEventListener('click', () => {
        createNewSurvey();
        switchView('editor');
    });

    document.getElementById('backToListBtn').addEventListener('click', () => {
        if (confirm('Are you sure? Any unsaved changes will be lost.')) {
            switchView('list');
            loadSurveyList();
        }
    });

    // Survey actions
    document.getElementById('saveSurveyBtn').addEventListener('click', saveSurvey);
    document.getElementById('deleteSurveyBtn').addEventListener('click', deleteSurvey);

    // Master password
    document.getElementById('masterPasswordBtn').addEventListener('click', setupMasterPassword);

    // Kiosk mode survey selection
    document.getElementById('setKioskSurveyBtn').addEventListener('click', setKioskSurvey);
    document.getElementById('clearKioskSurveyBtn').addEventListener('click', clearKioskSurvey);

    // Question type buttons
    document.querySelectorAll('.btn-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Use currentTarget instead of target to get the button element, not the clicked child
            const type = e.currentTarget.dataset.type;
            addQuestion(type);
        });
    });
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    if (view === 'list') {
        document.getElementById('surveyListView').classList.add('active');
    } else if (view === 'editor') {
        document.getElementById('surveyEditorView').classList.add('active');
    }
}

function loadSurveyList() {
    const surveys = StorageManager.getSurveys();
    const listContainer = document.getElementById('surveyList');

    if (surveys.length === 0) {
        listContainer.innerHTML = '<div class="empty-state">No surveys yet. Create your first survey!</div>';
        return;
    }

    listContainer.innerHTML = surveys.map(survey => `
        <div class="survey-card">
            <div class="survey-card-header">
                <h3>${escapeHtml(survey.title)}</h3>
                <span class="badge ${survey.published ? 'badge-success' : 'badge-secondary'}">
                    ${survey.published ? LanguageManager.t('published') : LanguageManager.t('draft')}
                </span>
            </div>
            <p class="survey-description">${escapeHtml(survey.description || '')}</p>
            <div class="survey-meta">
                <span>📝 ${survey.questions.length} ${LanguageManager.t('questions')}</span>
                <span>📅 ${new Date(survey.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="survey-actions">
                <button class="btn btn-primary" onclick="editSurvey('${survey.id}')">${LanguageManager.t('edit')}</button>
                <button class="btn btn-secondary" onclick="duplicateSurvey('${survey.id}')">${LanguageManager.t('duplicateSurvey')}</button>
                <button class="btn btn-danger" onclick="deleteSurveyFromList('${survey.id}')">${LanguageManager.t('delete')}</button>
            </div>
        </div>
    `).join('');
}

function createNewSurvey() {
    currentSurvey = {
        id: StorageManager.generateId(),
        title: '',
        description: '',
        published: false,
        password: '', // Add password field
        createdAt: new Date().toISOString(),
        questions: []
    };
    loadSurveyEditor();
}

function editSurvey(surveyId) {
    currentSurvey = StorageManager.getSurvey(surveyId);
    if (currentSurvey) {
        loadSurveyEditor();
        switchView('editor');
    }
}

function loadSurveyEditor() {
    document.getElementById('surveyTitle').value = currentSurvey.title;
    document.getElementById('surveyDescription').value = currentSurvey.description || '';
    document.getElementById('surveyPublished').checked = currentSurvey.published;
    document.getElementById('surveyPassword').value = currentSurvey.password || '';

    renderQuestions();
}

function renderQuestions() {
    const container = document.getElementById('questionsList');

    if (currentSurvey.questions.length === 0) {
        container.innerHTML = '<div class="empty-state">No questions yet. Add questions using the buttons above.</div>';
        return;
    }

    container.innerHTML = currentSurvey.questions.map((q, index) => {
        return createQuestionHTML(q, index);
    }).join('');

    // Attach event listeners
    attachQuestionListeners();

    // Update translations for dynamically added content
    if (typeof LanguageManager !== 'undefined') {
        LanguageManager.updateUI();
    }
}

function createQuestionHTML(question, index) {
    // Helper function to safely escape HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Helper function to safely get translations
    const t = (key, fallback = key) => {
        if (typeof LanguageManager !== 'undefined' && LanguageManager.t) {
            const translation = LanguageManager.t(key);
            return translation || fallback;
        }
        return fallback;
    };

    const typeLabels = {
        text: `📝 ${t('textQuestion', 'Text')}`,
        textarea: `📄 ${t('textareaQuestion', 'Long Text')}`,
        multipleChoice: `☑️ ${t('multipleChoice', 'Multiple Choice')}`,
        checkbox: `✅ ${t('checkboxes', 'Checkboxes')}`,
        rating: `⭐ ${t('rating', 'Rating')}`,
        yesNo: `👍 ${t('yesNo', 'Yes/No')}`,
        date: `📅 ${t('dateQuestion', 'Date')}`
    };

    let optionsHTML = '';
    if (question.type === 'multipleChoice' || question.type === 'checkbox') {
        optionsHTML = `
            <div class="question-options">
                <label data-i18n="options">Options:</label>
                ${(question.options || []).map((opt, i) => `
                    <div class="option-item">
                        <input type="text" value="${escapeHtml(opt)}" 
                               data-question="${index}" data-option="${i}" 
                               class="option-input">
                        <button class="btn-icon" onclick="removeOption(${index}, ${i})">✕</button>
                    </div>
                `).join('')}
                <button class="btn btn-small" onclick="addOption(${index})">+ <span data-i18n="addOption">Add Option</span></button>
            </div>
        `;
    } else if (question.type === 'rating') {
        optionsHTML = `
            <div class="question-options">
                <label><span data-i18n="ratingScale">${t('ratingScale', 'Rating Scale')}</span>:</label>
                <select data-question="${index}" class="rating-scale">
                    <option value="5" ${question.maxRating === 5 ? 'selected' : ''}>1-5</option>
                    <option value="10" ${question.maxRating === 10 ? 'selected' : ''}>1-10</option>
                </select>
            </div>
        `;
    }

    return `
        <div class="question-card" data-question-index="${index}">
            <div class="question-header">
                <span class="question-type-badge">${typeLabels[question.type]}</span>
                <div class="question-actions">
                    <button class="btn-icon" onclick="moveQuestion(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn-icon" onclick="moveQuestion(${index}, 1)" ${index === currentSurvey.questions.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn-icon" onclick="deleteQuestion(${index})">🗑️</button>
                </div>
            </div>
            <div class="question-body">
                <div class="form-group">
                    <label data-i18n="questionText">Question Text *</label>
                    <input type="text" class="question-text" data-question="${index}" 
                           value="${escapeHtml(question.question)}" data-i18n-placeholder="enterQuestion" placeholder="Enter your question">
                </div>
                ${optionsHTML}
                <div class="form-group">
                    <label>
                        <input type="checkbox" class="question-required" data-question="${index}" 
                               ${question.required ? 'checked' : ''}>
                        <span data-i18n="required">Required</span>
                    </label>
                </div>
            </div>
        </div>
    `;
}

function attachQuestionListeners() {
    // Question text inputs
    document.querySelectorAll('.question-text').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.question);
            currentSurvey.questions[index].question = e.target.value;
        });
    });

    // Required checkboxes
    document.querySelectorAll('.question-required').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.question);
            currentSurvey.questions[index].required = e.target.checked;
        });
    });

    // Option inputs
    document.querySelectorAll('.option-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const qIndex = parseInt(e.target.dataset.question);
            const oIndex = parseInt(e.target.dataset.option);
            currentSurvey.questions[qIndex].options[oIndex] = e.target.value;
        });
    });

    // Rating scale
    document.querySelectorAll('.rating-scale').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.question);
            currentSurvey.questions[index].maxRating = parseInt(e.target.value);
        });
    });
}

function addQuestion(type) {
    const question = {
        id: StorageManager.generateId(),
        type: type,
        question: '',
        required: false
    };

    if (type === 'multipleChoice' || type === 'checkbox') {
        question.options = ['Option 1', 'Option 2'];
    } else if (type === 'rating') {
        question.maxRating = 5;
    }

    currentSurvey.questions.push(question);
    renderQuestions();
}

function deleteQuestion(index) {
    if (confirm('Delete this question?')) {
        currentSurvey.questions.splice(index, 1);
        renderQuestions();
    }
}

function moveQuestion(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= currentSurvey.questions.length) return;

    const temp = currentSurvey.questions[index];
    currentSurvey.questions[index] = currentSurvey.questions[newIndex];
    currentSurvey.questions[newIndex] = temp;
    renderQuestions();
}

function addOption(questionIndex) {
    const question = currentSurvey.questions[questionIndex];
    question.options.push(`Option ${question.options.length + 1}`);
    renderQuestions();
}

function removeOption(questionIndex, optionIndex) {
    const question = currentSurvey.questions[questionIndex];
    if (question.options.length <= 2) {
        alert('You must have at least 2 options');
        return;
    }
    question.options.splice(optionIndex, 1);
    renderQuestions();
}

function saveSurvey() {
    // Get current values
    currentSurvey.title = document.getElementById('surveyTitle').value.trim();
    currentSurvey.description = document.getElementById('surveyDescription').value.trim();
    currentSurvey.published = document.getElementById('surveyPublished').checked;
    currentSurvey.password = document.getElementById('surveyPassword').value.trim();

    // Validate
    if (!currentSurvey.title) {
        alert('Please enter a survey title');
        return;
    }

    if (currentSurvey.questions.length === 0) {
        alert('Please add at least one question');
        return;
    }

    // Validate all questions have text
    for (let i = 0; i < currentSurvey.questions.length; i++) {
        if (!currentSurvey.questions[i].question.trim()) {
            alert(`Question ${i + 1} is missing question text`);
            return;
        }
    }

    // Save
    if (StorageManager.saveSurvey(currentSurvey)) {
        alert('Survey saved successfully!');
        switchView('list');
        loadSurveyList();
        loadKioskSurveySelector(); // Update kiosk selector
        updateKioskSurveyStatus(); // Update kiosk status
    }
}

function deleteSurvey() {
    if (!confirm('Are you sure you want to delete this survey? This will also delete all responses.')) {
        return;
    }

    if (StorageManager.deleteSurvey(currentSurvey.id)) {
        alert('Survey deleted successfully');
        switchView('list');
        loadSurveyList();
        loadKioskSurveySelector(); // Update kiosk selector
        updateKioskSurveyStatus(); // Update kiosk status
    }
}

function deleteSurveyFromList(surveyId) {
    if (!confirm('Are you sure you want to delete this survey? This will also delete all responses.')) {
        return;
    }

    if (StorageManager.deleteSurvey(surveyId)) {
        alert('Survey deleted successfully');
        loadSurveyList();
        loadKioskSurveySelector(); // Update kiosk selector
        updateKioskSurveyStatus(); // Update kiosk status
    }
}

function duplicateSurvey(surveyId) {
    const survey = StorageManager.getSurvey(surveyId);
    if (!survey) return;

    const duplicate = {
        ...survey,
        id: StorageManager.generateId(),
        title: survey.title + ' (Copy)',
        published: false,
        createdAt: new Date().toISOString()
    };

    if (StorageManager.saveSurvey(duplicate)) {
        alert('Survey duplicated successfully');
        loadSurveyList();
    }
}

// Utility function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Master Password Setup
function setupMasterPassword() {
    const currentPassword = StorageManager.getMasterPassword();

    let message = currentPassword
        ? 'Master password is already set. Enter new password to change it (or leave blank to keep current):'
        : 'Set a master password that can be used to access admin from any survey in kiosk mode:';

    const newPassword = prompt(message);

    if (newPassword === null) {
        return; // User cancelled
    }

    if (newPassword.trim() === '' && currentPassword) {
        // User wants to keep current password
        alert('Master password unchanged.');
        return;
    }

    if (newPassword.trim() === '') {
        // User wants to remove password
        if (confirm('Remove master password? You can still use individual survey passwords.')) {
            localStorage.removeItem('masterPassword');
            alert('Master password removed.');
            updateMasterPasswordButton(); // Update button visibility
        }
        return;
    }

    // Confirm new password
    const confirmPassword = prompt('Confirm new master password:');

    if (confirmPassword !== newPassword) {
        alert('Passwords do not match. Master password not changed.');
        return;
    }

    if (StorageManager.setMasterPassword(newPassword)) {
        alert('Master password set successfully!');
        updateMasterPasswordButton(); // Update button visibility
    } else {
        alert('Error setting master password.');
    }
}

// Update master password button visibility and text
function updateMasterPasswordButton() {
    const btn = document.getElementById('masterPasswordBtn');
    const hasMasterPassword = StorageManager.hasMasterPassword();

    if (hasMasterPassword) {
        // Password is set - hide the button completely
        btn.style.display = 'none';
    } else {
        // No password set - show setup button
        btn.style.display = 'inline-block';
        btn.innerHTML = '🔐 Master Password';
        btn.title = 'Set a master password for admin access from kiosk mode';
    }
}

// Load kiosk survey selector dropdown
function loadKioskSurveySelector() {
    const selector = document.getElementById('kioskSurveySelector');
    if (!selector) return;

    // Get all published surveys
    const surveys = StorageManager.getSurveys().filter(s => s.published);

    // Clear existing options
    selector.innerHTML = '<option value="">Select a survey...</option>';

    // Add survey options
    surveys.forEach(survey => {
        const option = document.createElement('option');
        option.value = survey.id;
        option.textContent = survey.title;
        selector.appendChild(option);
    });

    // Set current selection if exists
    const currentKioskSurvey = localStorage.getItem('kioskModeSurveyId');
    if (currentKioskSurvey) {
        selector.value = currentKioskSurvey;
    }
}

// Update kiosk survey status display
function updateKioskSurveyStatus() {
    const statusDiv = document.getElementById('kioskSurveyStatus');
    if (!statusDiv) return;

    const currentKioskSurvey = localStorage.getItem('kioskModeSurveyId');

    if (currentKioskSurvey) {
        const survey = StorageManager.getSurveys().find(s => s.id === currentKioskSurvey);
        if (survey) {
            statusDiv.textContent = `✓ ${LanguageManager.t('kioskSetTo')} "${survey.title}"`;
            statusDiv.style.display = 'block';
            statusDiv.style.color = '#1e8449';
        } else {
            statusDiv.textContent = '⚠ Previously set survey not found';
            statusDiv.style.display = 'block';
            statusDiv.style.color = '#d35400';
        }
    } else {
        statusDiv.style.display = 'none';
    }
}

// Set kiosk survey
function setKioskSurvey() {
    const selector = document.getElementById('kioskSurveySelector');
    const selectedId = selector.value;

    if (!selectedId) {
        alert('Please select a survey from the dropdown');
        return;
    }

    localStorage.setItem('kioskModeSurveyId', selectedId);
    updateKioskSurveyStatus();
    alert('Kiosk survey set successfully! The kiosk mode will now use this survey.');
}

// Clear kiosk survey
function clearKioskSurvey() {
    if (confirm('Remove kiosk survey selection? The kiosk mode will show survey selection screen.')) {
        localStorage.removeItem('kioskModeSurveyId');
        document.getElementById('kioskSurveySelector').value = '';
        updateKioskSurveyStatus();
        alert('Kiosk survey cleared successfully!');
    }
}
