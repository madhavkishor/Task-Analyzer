// Enhanced JavaScript with new UI functionality
const API_BASE = 'http://localhost:8000/api';
let currentTasks = [];
let currentStrategy = 'smart_balance';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Form submission
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addTaskFromForm();
    });

    // Importance slider
    const importanceSlider = document.getElementById('importance');
    const importanceValue = document.getElementById('importance-value');
    
    importanceSlider.addEventListener('input', function() {
        importanceValue.textContent = this.value;
    });

    // Strategy cards
    document.querySelectorAll('.strategy-card').forEach(card => {
        card.addEventListener('click', function() {
            selectStrategy(this.dataset.strategy);
        });
    });

    // Load sample tasks on startup
    loadSampleTasks();
    updateStats();
}

// Tab switching
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Activate clicked button
    event.target.classList.add('active');
}

// Strategy selection
function selectStrategy(strategy) {
    currentStrategy = strategy;
    
    // Update UI
    document.querySelectorAll('.strategy-card').forEach(card => {
        card.classList.remove('active');
    });
    
    event.currentTarget.classList.add('active');
    
    // Update strategy badge text
    const strategyNames = {
        'smart_balance': 'Smart Balance',
        'fastest_wins': 'Fastest Wins',
        'high_impact': 'High Impact',
        'deadline_driven': 'Deadline Driven'
    };
    
    document.getElementById('current-strategy').textContent = strategyNames[strategy];
}

// Add task from form
function addTaskFromForm() {
    const form = document.getElementById('task-form');
    
    // Parse dependencies
    const depsInput = document.getElementById('dependencies').value;
    const dependencies = depsInput ? depsInput.split(',').map(dep => dep.trim()).filter(dep => dep) : [];
    
    const task = {
        title: document.getElementById('title').value,
        due_date: document.getElementById('due-date').value,
        estimated_hours: parseInt(document.getElementById('estimated-hours').value),
        importance: parseInt(document.getElementById('importance').value),
        dependencies: dependencies
    };
    
    currentTasks.push(task);
    updateTaskList();
    updateStats();
    form.reset();
    
    // Show success notification
    showNotification('Task added successfully!', 'success');
}

// Import bulk tasks
function importBulkTasks() {
    const jsonInput = document.getElementById('json-input').value.trim();
    
    if (!jsonInput) {
        showNotification('Please enter some JSON data', 'error');
        return;
    }
    
    try {
        const tasks = JSON.parse(jsonInput);
        
        if (!Array.isArray(tasks)) {
            throw new Error('Expected JSON array');
        }
        
        currentTasks = [...tasks];
        updateTaskList();
        updateStats();
        showNotification(`Successfully imported ${tasks.length} tasks`, 'success');
        
    } catch (e) {
        showNotification('Invalid JSON format', 'error');
    }
}

// Update task list display
function updateTaskList() {
    const container = document.getElementById('current-tasks');
    const taskCount = document.getElementById('task-count');
    
    container.innerHTML = '';
    taskCount.textContent = currentTasks.length;
    
    if (currentTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No tasks added yet</p>
            </div>
        `;
        return;
    }
    
    currentTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="task-info">
                <h4>${task.title}</h4>
                <div class="task-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date(task.due_date).toLocaleDateString()}</span>
                    <span><i class="fas fa-clock"></i> ${task.estimated_hours}h</span>
                    <span><i class="fas fa-star"></i> ${task.importance}/10</span>
                    ${task.dependencies.length > 0 ? 
                        `<span><i class="fas fa-link"></i> ${task.dependencies.join(', ')}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-remove" onclick="removeTask(${index})" title="Remove task">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        container.appendChild(taskElement);
    });
}

// Remove task
function removeTask(index) {
    currentTasks.splice(index, 1);
    updateTaskList();
    updateStats();
    showNotification('Task removed', 'warning');
}

// Update statistics
function updateStats() {
    document.getElementById('total-tasks').textContent = currentTasks.length;
    
    // Calculate high priority tasks (importance >= 8 or due within 3 days)
    const today = new Date();
    const highPriorityCount = currentTasks.filter(task => {
        const dueDate = new Date(task.due_date);
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return task.importance >= 8 || daysUntilDue <= 3;
    }).length;
    
    document.getElementById('high-priority').textContent = highPriorityCount;
    
    // Calculate tasks due this week
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const dueSoonCount = currentTasks.filter(task => {
        const dueDate = new Date(task.due_date);
        return dueDate <= nextWeek;
    }).length;
    
    document.getElementById('due-soon').textContent = dueSoonCount;
}

// Load sample tasks
function loadSampleTasks() {
    const sampleTasks = [
        {
            title: 'Fix critical login authentication bug',
            due_date: '2025-11-20',
            estimated_hours: 4,
            importance: 9,
            dependencies: []
        },
        {
            title: 'Complete project documentation and user guides',
            due_date: '2025-11-25',
            estimated_hours: 3,
            importance: 7,
            dependencies: []
        },
        {
            title: 'Setup development and testing environment',
            due_date: '2025-11-30',
            estimated_hours: 2,
            importance: 6,
            dependencies: ['0']
        },
        {
            title: 'Implement user feedback system',
            due_date: '2025-12-05',
            estimated_hours: 6,
            importance: 8,
            dependencies: ['1']
        },
        {
            title: 'Optimize database queries for performance',
            due_date: '2025-12-10',
            estimated_hours: 5,
            importance: 7,
            dependencies: ['0']
        }
    ];
    
    currentTasks = sampleTasks;
    updateTaskList();
    updateStats();
    
    // Populate JSON input
    document.getElementById('json-input').value = JSON.stringify(sampleTasks, null, 2);
    
    showNotification('Sample tasks loaded successfully!', 'success');
}

// Clear all tasks
function clearAllTasks() {
    if (currentTasks.length === 0) {
        showNotification('No tasks to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all tasks?')) {
        currentTasks = [];
        updateTaskList();
        updateStats();
        showNotification('All tasks cleared', 'warning');
    }
}

// Analyze tasks
async function analyzeTasks() {
    if (currentTasks.length === 0) {
        showNotification('Please add some tasks first', 'error');
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`${API_BASE}/tasks/analyze/?strategy=${currentStrategy}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentTasks)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Analysis failed');
        }
        
        displayResults(data.tasks);
        showNotification(`Analysis complete! Processed ${data.tasks.length} tasks`, 'success');
        
    } catch (error) {
        showError('Analysis failed: ' + error.message);
        showNotification('Analysis failed', 'error');
    } finally {
        hideLoading();
    }
}

// Get suggestions
async function getSuggestions() {
    showLoading('suggestions');
    hideError();
    
    try {
        const response = await fetch(`${API_BASE}/tasks/suggest/?strategy=${currentStrategy}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get suggestions');
        }
        
        displaySuggestions(data);
        showNotification('Smart suggestions generated!', 'success');
        
    } catch (error) {
        showError('Failed to get suggestions: ' + error.message);
        showNotification('Failed to get suggestions', 'error');
    } finally {
        hideLoading('suggestions');
    }
}

// Display results
function displayResults(tasks) {
    const container = document.getElementById('results');
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No Results</h3>
                <p>No tasks to display</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="results-header">
            <h3>Prioritized Tasks (${tasks.length} total)</h3>
            <div class="priority-legend">
                <span class="legend-item"><span class="legend-color high"></span> High Priority</span>
                <span class="legend-item"><span class="legend-color medium"></span> Medium Priority</span>
                <span class="legend-item"><span class="legend-color low"></span> Low Priority</span>
            </div>
        </div>
    `;
    
    tasks.forEach((task, index) => {
        const priorityClass = getPriorityClass(task.priority_score);
        const priorityText = getPriorityText(task.priority_score);
        
        const taskElement = document.createElement('div');
        taskElement.className = `task-result ${priorityClass}`;
        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-title">
                    <span class="rank-badge">#${index + 1}</span>
                    ${task.title}
                </div>
                <div class="score-badge">
                    ${task.priority_score} pts
                </div>
            </div>
            
            <div class="task-details">
                <div class="detail-item">
                    <span class="detail-label">Due Date</span>
                    <span class="detail-value">${new Date(task.due_date).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Effort</span>
                    <span class="detail-value">${task.estimated_hours} hours</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Importance</span>
                    <span class="detail-value">${task.importance}/10</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Priority</span>
                    <span class="detail-value">${priorityText}</span>
                </div>
            </div>
            
            <div class="task-explanation">
                <strong>Analysis:</strong> ${task.score_explanation}
            </div>
        `;
        container.appendChild(taskElement);
    });
}

// Display suggestions
function displaySuggestions(data) {
    const container = document.getElementById('suggestions');
    
    if (!data.suggested_tasks || data.suggested_tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-lightbulb"></i>
                <h3>No Suggestions</h3>
                <p>No task suggestions available</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="suggestions-header">
            <h3>${data.explanation}</h3>
            <p class="strategy-info">Using ${data.strategy.replace('_', ' ').title()} strategy</p>
        </div>
    `;
    
    data.suggested_tasks.forEach((task, index) => {
        const priorityClass = getPriorityClass(task.priority_score);
        
        const taskElement = document.createElement('div');
        taskElement.className = `task-result ${priorityClass}`;
        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-title">
                    <span class="rank-badge">${getRankEmoji(index + 1)}</span>
                    ${task.title}
                </div>
                <div class="score-badge">
                    ${task.priority_score} pts
                </div>
            </div>
            
            <div class="task-details">
                <div class="detail-item">
                    <span class="detail-label">Due Date</span>
                    <span class="detail-value">${new Date(task.due_date).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Effort</span>
                    <span class="detail-value">${task.estimated_hours} hours</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Importance</span>
                    <span class="detail-value">${task.importance}/10</span>
                </div>
            </div>
            
            <div class="task-explanation">
                <strong>Why start with this:</strong> ${task.score_explanation}
            </div>
        `;
        container.appendChild(taskElement);
    });
}

// Helper functions
function getPriorityClass(score) {
    if (score >= 70) return 'priority-high';
    if (score >= 50) return 'priority-medium';
    return 'priority-low';
}

function getPriorityText(score) {
    if (score >= 70) return 'High Priority';
    if (score >= 50) return 'Medium Priority';
    return 'Low Priority';
}

function getRankEmoji(rank) {
    const emojis = ['🥇', '🥈', '🥉'];
    return emojis[rank - 1] || '📌';
}

// UI state management
function showLoading(context = 'results') {
    const loadingElement = context === 'suggestions' 
        ? document.getElementById('suggestions-loading')
        : document.getElementById('loading');
    if (loadingElement) loadingElement.classList.remove('hidden');
}

function hideLoading(context = 'results') {
    const loadingElement = context === 'suggestions'
        ? document.getElementById('suggestions-loading')
        : document.getElementById('loading');
    if (loadingElement) loadingElement.classList.add('hidden');
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.classList.add('hidden');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        border-left: 4px solid;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    }
    
    .notification-success {
        border-left-color: var(--success);
    }
    
    .notification-error {
        border-left-color: var(--danger);
    }
    
    .notification-warning {
        border-left-color: var(--warning);
    }
    
    .notification-info {
        border-left-color: var(--primary);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--gray-600);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: var(--transition);
    }
    
    .notification-close:hover {
        background: var(--gray-200);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .priority-legend {
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }
    
    .legend-color.high { background: var(--danger); }
    .legend-color.medium { background: var(--warning); }
    .legend-color.low { background: var(--success); }
    
    .rank-badge {
        background: var(--primary);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-right: 0.5rem;
    }
    
    .results-header, .suggestions-header {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .strategy-info {
        color: var(--gray-600);
        font-size: 0.9rem;
        margin-top: 0.25rem;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);