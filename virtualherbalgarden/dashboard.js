// Dashboard State Management
const dashboardState = {
    activeSection: 'profile',
    userData: {
        name: 'John Doe',
        email: 'john@example.com',
        joinDate: 'January 2024',
        location: 'New York, USA',
        interests: ['Medicinal Plants', 'Herbal Remedies', 'Botany']
    },
    bookmarks: [],
    notes: [],
    progress: {
        completedTours: 0,
        totalTours: 10,
        learningHours: 0,
        achievements: []
    },
    collections: []
};

// DOM Elements
const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
const sections = document.querySelectorAll('.dashboard-section');
const searchInput = document.querySelector('.search-input');
const profileForm = document.querySelector('.profile-form');
const notesGrid = document.querySelector('.notes-grid');
const progressChart = document.querySelector('.progress-chart');
const historyTimeline = document.querySelector('.history-timeline');

// Navigation
function switchSection(sectionId) {
    // Update active section
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    // Update sidebar active state
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });

    // Update state
    dashboardState.activeSection = sectionId;
}

// Event Listeners for Navigation
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        switchSection(sectionId);
    });
});

// Profile Section
function updateProfile() {
    const formData = new FormData(profileForm);
    const updatedData = {
        name: formData.get('name'),
        email: formData.get('email'),
        location: formData.get('location'),
        interests: formData.get('interests').split(',').map(i => i.trim())
    };

    // Update state
    Object.assign(dashboardState.userData, updatedData);

    // Show success message
    showNotification('Profile updated successfully!');
}

// Bookmarks Section
function filterBookmarks(query) {
    const filteredBookmarks = dashboardState.bookmarks.filter(bookmark => 
        bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(query.toLowerCase())
    );

    updateBookmarksDisplay(filteredBookmarks);
}

function updateBookmarksDisplay(bookmarks) {
    const bookmarksGrid = document.querySelector('.bookmarks-grid');
    bookmarksGrid.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark-card">
            <img src="${bookmark.image}" alt="${bookmark.title}">
            <div class="bookmark-info">
                <h3>${bookmark.title}</h3>
                <p>${bookmark.description}</p>
            </div>
            <button class="remove-bookmark" data-id="${bookmark.id}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Notes Section
function addNote() {
    const noteForm = document.querySelector('.note-form');
    const formData = new FormData(noteForm);
    
    const newNote = {
        id: Date.now(),
        title: formData.get('title'),
        content: formData.get('content'),
        date: new Date().toLocaleDateString(),
        plantId: formData.get('plantId')
    };

    dashboardState.notes.push(newNote);
    updateNotesDisplay();
    noteForm.reset();
}

function updateNotesDisplay() {
    notesGrid.innerHTML = dashboardState.notes.map(note => `
        <div class="note-card">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-meta">
                <span>${note.date}</span>
                <div class="note-actions">
                    <button class="edit-note" data-id="${note.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-note" data-id="${note.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Progress Section
function updateProgressChart() {
    const ctx = progressChart.getContext('2d');
    const progress = (dashboardState.progress.completedTours / dashboardState.progress.totalTours) * 100;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [progress, 100 - progress],
                backgroundColor: ['var(--primary-color)', 'var(--light-gray)']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// History Section
function updateHistoryTimeline() {
    const history = [
        { date: '2024-03-15', action: 'Completed Tour: Medicinal Herbs Basics' },
        { date: '2024-03-10', action: 'Added Note: Benefits of Chamomile' },
        { date: '2024-03-05', action: 'Bookmarked: Lavender Plant Profile' }
    ];

    historyTimeline.innerHTML = history.map(item => `
        <div class="timeline-item">
            <div class="timeline-date">${new Date(item.date).toLocaleDateString()}</div>
            <div class="timeline-content">${item.action}</div>
        </div>
    `).join('');
}

// Collections Section
function createCollection() {
    const collectionForm = document.querySelector('.collection-form');
    const formData = new FormData(collectionForm);
    
    const newCollection = {
        id: Date.now(),
        name: formData.get('name'),
        description: formData.get('description'),
        plants: []
    };

    dashboardState.collections.push(newCollection);
    updateCollectionsDisplay();
    collectionForm.reset();
}

function updateCollectionsDisplay() {
    const collectionsGrid = document.querySelector('.collections-grid');
    collectionsGrid.innerHTML = dashboardState.collections.map(collection => `
        <div class="collection-card">
            <h3>${collection.name}</h3>
            <p>${collection.description}</p>
            <div class="collection-meta">
                <span>${collection.plants.length} plants</span>
                <div class="collection-actions">
                    <button class="edit-collection" data-id="${collection.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-collection" data-id="${collection.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize Dashboard
function initializeDashboard() {
    // Set initial active section
    switchSection('profile');
    
    // Initialize charts
    updateProgressChart();
    
    // Initialize history timeline
    updateHistoryTimeline();
    
    // Initialize collections display
    updateCollectionsDisplay();
    
    // Add event listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterBookmarks(e.target.value);
        });
    }
    
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateProfile();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard); 