// Analytics Dashboard Logic
let currentSurveyId = null;
let chartInstances = [];
let allResponses = [];
let filteredResponses = [];

document.addEventListener('DOMContentLoaded', () => {
    loadSurveyFilter();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('surveyFilter').addEventListener('change', (e) => {
        currentSurveyId = e.target.value;
        if (currentSurveyId) {
            loadAnalytics(currentSurveyId);
        } else {
            hideAnalytics();
        }
    });

    document.getElementById('exportCSVBtn').addEventListener('click', () => {
        if (currentSurveyId) {
            ExportManager.exportToCSV(currentSurveyId);
        }
    });

    document.getElementById('exportJSONBtn').addEventListener('click', () => {
        if (currentSurveyId) {
            ExportManager.exportToJSON(currentSurveyId);
        }
    });

    document.getElementById('clearResponsesBtn').addEventListener('click', () => {
        if (currentSurveyId && confirm('Are you sure you want to delete all responses for this survey? This cannot be undone.')) {
            StorageManager.deleteResponsesBySurvey(currentSurveyId);
            loadAnalytics(currentSurveyId);
            alert('All responses deleted');
        }
    });

    document.getElementById('filterBtn').addEventListener('click', applyDateFilter);
    document.getElementById('clearFilterBtn').addEventListener('click', clearDateFilter);
}

function loadSurveyFilter() {
    const surveys = StorageManager.getSurveys();
    const filter = document.getElementById('surveyFilter');

    filter.innerHTML = '<option value="">-- Select a Survey --</option>';

    surveys.forEach(survey => {
        const option = document.createElement('option');
        option.value = survey.id;
        option.textContent = survey.title;
        filter.appendChild(option);
    });
}

function hideAnalytics() {
    document.getElementById('analyticsContent').style.display = 'block';
    document.getElementById('analyticsDisplay').style.display = 'none';
    document.getElementById('exportCSVBtn').disabled = true;
    document.getElementById('exportJSONBtn').disabled = true;
    document.getElementById('clearResponsesBtn').disabled = true;
}

function loadAnalytics(surveyId) {
    const survey = StorageManager.getSurvey(surveyId);
    allResponses = StorageManager.getResponsesBySurvey(surveyId);
    filteredResponses = [...allResponses];

    if (!survey) {
        alert('Survey not found');
        return;
    }

    // Enable buttons
    document.getElementById('exportCSVBtn').disabled = false;
    document.getElementById('exportJSONBtn').disabled = false;
    document.getElementById('clearResponsesBtn').disabled = filteredResponses.length === 0;

    // Show analytics
    document.getElementById('analyticsContent').style.display = 'none';
    document.getElementById('analyticsDisplay').style.display = 'block';

    // Display stats
    displayStats();

    // Display charts
    displayCharts(survey);

    // Display responses table
    displayResponsesTable(survey);
}

function displayStats() {
    const totalEl = document.getElementById('totalResponses');
    const firstEl = document.getElementById('firstResponse');
    const latestEl = document.getElementById('latestResponse');
    const rateEl = document.getElementById('completionRate');

    totalEl.textContent = filteredResponses.length;

    if (filteredResponses.length > 0) {
        const dates = filteredResponses.map(r => new Date(r.submittedAt));
        const firstDate = new Date(Math.min(...dates));
        const latestDate = new Date(Math.max(...dates));

        firstEl.textContent = firstDate.toLocaleDateString();
        latestEl.textContent = latestDate.toLocaleDateString();
        rateEl.textContent = '100%'; // Since we only store completed surveys
    } else {
        firstEl.textContent = '-';
        latestEl.textContent = '-';
        rateEl.textContent = '-';
    }
}

function displayCharts(survey) {
    const container = document.getElementById('chartsContainer');

    // Destroy existing charts
    chartInstances.forEach(chart => chart.destroy());
    chartInstances = [];

    if (filteredResponses.length === 0) {
        container.innerHTML = '<div class="no-data">No responses to display</div>';
        return;
    }

    container.innerHTML = '';

    survey.questions.forEach((question, index) => {
        const chartData = analyzeQuestion(question, filteredResponses);

        if (chartData) {
            const chartDiv = document.createElement('div');
            chartDiv.className = 'chart-card';
            chartDiv.innerHTML = `
                <h3>${index + 1}. ${escapeHtml(question.question)}</h3>
                <canvas id="chart_${question.id}"></canvas>
            `;
            container.appendChild(chartDiv);

            // Create chart
            const ctx = document.getElementById(`chart_${question.id}`).getContext('2d');
            const chart = new Chart(ctx, chartData);
            chartInstances.push(chart);
        }
    });
}

function analyzeQuestion(question, responses) {
    const answers = responses.map(r => r.answers[question.id]);

    switch (question.type) {
        case 'multipleChoice':
        case 'yesNo':
            return createPieChart(question, answers);

        case 'checkbox':
            return createBarChart(question, answers);

        case 'rating':
            return createRatingChart(question, answers);

        case 'text':
        case 'textarea':
        case 'date':
            // These don't get charts, just listed in table
            return null;

        default:
            return null;
    }
}

function createPieChart(question, answers) {
    const counts = {};

    answers.forEach(answer => {
        if (answer) {
            counts[answer] = (counts[answer] || 0) + 1;
        }
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    };
}

function createBarChart(question, answers) {
    const counts = {};

    // Initialize all options with 0
    question.options.forEach(opt => {
        counts[opt] = 0;
    });

    // Count selections
    answers.forEach(answerArray => {
        if (Array.isArray(answerArray)) {
            answerArray.forEach(answer => {
                if (counts.hasOwnProperty(answer)) {
                    counts[answer]++;
                }
            });
        }
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of selections',
                data: data,
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
}

function createRatingChart(question, answers) {
    const maxRating = question.maxRating || 5;
    const counts = {};

    // Initialize all ratings with 0
    for (let i = 1; i <= maxRating; i++) {
        counts[i] = 0;
    }

    // Count ratings
    answers.forEach(answer => {
        const rating = parseInt(answer);
        if (rating && rating >= 1 && rating <= maxRating) {
            counts[rating]++;
        }
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    // Calculate average
    const total = answers.filter(a => a).length;
    const sum = answers.reduce((acc, val) => acc + (parseInt(val) || 0), 0);
    const average = total > 0 ? (sum / total).toFixed(2) : 0;

    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of responses',
                data: data,
                backgroundColor: '#4BC0C0'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: `Average Rating: ${average} / ${maxRating}`
                }
            }
        }
    };
}

function displayResponsesTable(survey) {
    const container = document.getElementById('responsesTable');

    if (filteredResponses.length === 0) {
        container.innerHTML = '<div class="no-data">No responses to display</div>';
        return;
    }

    // Create table
    let html = '<div class="table-wrapper"><table class="responses-table"><thead><tr>';
    html += '<th>Submitted At</th>';

    survey.questions.forEach((q, i) => {
        html += `<th>${i + 1}. ${escapeHtml(q.question)}</th>`;
    });

    html += '</tr></thead><tbody>';

    filteredResponses.forEach(response => {
        html += '<tr>';
        html += `<td>${new Date(response.submittedAt).toLocaleString()}</td>`;

        survey.questions.forEach(q => {
            const answer = response.answers[q.id];
            let displayValue = '';

            if (Array.isArray(answer)) {
                displayValue = answer.join(', ');
            } else {
                displayValue = answer || '-';
            }

            html += `<td>${escapeHtml(displayValue)}</td>`;
        });

        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function applyDateFilter() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    if (!dateFrom && !dateTo) {
        alert('Please select at least one date');
        return;
    }

    filteredResponses = allResponses.filter(response => {
        const responseDate = new Date(response.submittedAt).toISOString().split('T')[0];

        if (dateFrom && dateTo) {
            return responseDate >= dateFrom && responseDate <= dateTo;
        } else if (dateFrom) {
            return responseDate >= dateFrom;
        } else {
            return responseDate <= dateTo;
        }
    });

    const survey = StorageManager.getSurvey(currentSurveyId);
    displayStats();
    displayCharts(survey);
    displayResponsesTable(survey);
}

function clearDateFilter() {
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    filteredResponses = [...allResponses];

    const survey = StorageManager.getSurvey(currentSurveyId);
    displayStats();
    displayCharts(survey);
    displayResponsesTable(survey);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
