// Sample plant data (in a real application, this would come from a backend)
const plants = [
    {
        id: 1,
        name: "Ashwagandha",
        scientificName: "Withania somnifera",
        image: "assets/plant1.jpg",
        medicinalSystem: "ayurveda",
        properties: ["immunity", "mental"],
        region: "north",
        type: "herb",
        description: "A powerful adaptogen known for its stress-relieving properties.",
        uses: "Used in traditional medicine for stress relief, immunity, and overall vitality.",
        cultivation: "Thrives in dry, subtropical regions with well-drained soil.",
        popularity: 95
    },
    // Add more plant data here
];

// State management
let currentView = 'grid';
let currentPage = 1;
let itemsPerPage = 12;
let filteredPlants = [...plants];

// DOM Elements
const plantsContainer = document.querySelector('.plants-container');
const gridViewBtn = document.querySelector('.grid-view');
const listViewBtn = document.querySelector('.list-view');
const searchInput = document.getElementById('searchInput');
const medicinalSystemSelect = document.getElementById('medicinalSystem');
const medicinalPropertiesSelect = document.getElementById('medicinalProperties');
const regionSelect = document.getElementById('region');
const plantTypeSelect = document.getElementById('plantType');
const sortBySelect = document.getElementById('sortBy');
const sortOrderSelect = document.getElementById('sortOrder');
const modal = document.getElementById('quickViewModal');
const closeModal = document.querySelector('.close-modal');

// View Toggle
gridViewBtn.addEventListener('click', () => {
    currentView = 'grid';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    plantsContainer.classList.remove('list-view');
    renderPlants();
});

listViewBtn.addEventListener('click', () => {
    currentView = 'list';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    plantsContainer.classList.add('list-view');
    renderPlants();
});

// Filter and Search
function filterPlants() {
    const searchTerm = searchInput.value.toLowerCase();
    const system = medicinalSystemSelect.value;
    const properties = medicinalPropertiesSelect.value;
    const region = regionSelect.value;
    const type = plantTypeSelect.value;

    filteredPlants = plants.filter(plant => {
        const matchesSearch = plant.name.toLowerCase().includes(searchTerm) ||
                            plant.scientificName.toLowerCase().includes(searchTerm);
        const matchesSystem = !system || plant.medicinalSystem === system;
        const matchesProperties = !properties || plant.properties.includes(properties);
        const matchesRegion = !region || plant.region === region;
        const matchesType = !type || plant.type === type;

        return matchesSearch && matchesSystem && matchesProperties && matchesRegion && matchesType;
    });

    // Apply sorting
    const sortBy = sortBySelect.value;
    const sortOrder = sortOrderSelect.value;

    filteredPlants.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'popularity':
                comparison = b.popularity - a.popularity;
                break;
            case 'region':
                comparison = a.region.localeCompare(b.region);
                break;
            case 'type':
                comparison = a.type.localeCompare(b.type);
                break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    currentPage = 1;
    renderPlants();
}

// Event listeners for filters
searchInput.addEventListener('input', filterPlants);
medicinalSystemSelect.addEventListener('change', filterPlants);
medicinalPropertiesSelect.addEventListener('change', filterPlants);
regionSelect.addEventListener('change', filterPlants);
plantTypeSelect.addEventListener('change', filterPlants);
sortBySelect.addEventListener('change', filterPlants);
sortOrderSelect.addEventListener('change', filterPlants);

// Render Plants
function renderPlants() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const plantsToShow = filteredPlants.slice(startIndex, endIndex);

    plantsContainer.innerHTML = plantsToShow.map(plant => `
        <div class="plant-card" data-id="${plant.id}">
            <img src="${plant.image}" alt="${plant.name}">
            <div class="plant-card-content">
                <h3>${plant.name}</h3>
                <p class="scientific-name">${plant.scientificName}</p>
                <div class="properties">
                    ${plant.properties.map(prop => `
                        <span class="property-tag">${prop}</span>
                    `).join('')}
                </div>
                <div class="quick-view">
                    <span class="region">${plant.region}</span>
                    <button onclick="showQuickView(${plant.id})">Quick View</button>
                </div>
            </div>
        </div>
    `).join('');

    updatePagination();
}

// Quick View Modal
function showQuickView(plantId) {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${plant.image}" alt="${plant.name}">
        </div>
        <div class="modal-info">
            <h2>${plant.name}</h2>
            <p class="scientific-name">${plant.scientificName}</p>
            <div class="details">
                <p><strong>Medicinal System:</strong> ${plant.medicinalSystem}</p>
                <p><strong>Region:</strong> ${plant.region}</p>
                <p><strong>Type:</strong> ${plant.type}</p>
            </div>
            <div class="properties">
                ${plant.properties.map(prop => `
                    <span class="property-tag">${prop}</span>
                `).join('')}
            </div>
            <div class="description">
                <h3>Description</h3>
                <p>${plant.description}</p>
            </div>
            <div class="uses">
                <h3>Medicinal Uses</h3>
                <p>${plant.uses}</p>
            </div>
            <div class="cultivation">
                <h3>Cultivation</h3>
                <p>${plant.cultivation}</p>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Close Modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
    const pageNumbers = document.querySelector('.page-numbers');
    
    let paginationHTML = '';
    
    // Previous page button
    document.querySelector('.prev-page').disabled = currentPage === 1;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="${i === currentPage ? 'active' : ''}" 
                        onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    // Next page button
    document.querySelector('.next-page').disabled = currentPage === totalPages;
    
    pageNumbers.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderPlants();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderPlants();
});

// 3D Model Viewer
class ModelViewer {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.className = 'model-viewer-modal';
        this.modal.innerHTML = `
            <div class="model-viewer-content">
                <button class="model-viewer-close" aria-label="Close 3D viewer">
                    <i class="fas fa-times"></i>
                </button>
                <div class="model-viewer-container">
                    <div class="model-viewer-toolbar">
                        <button class="rotate-btn" aria-label="Rotate model">
                            <i class="fas fa-sync"></i> Rotate
                        </button>
                        <button class="zoom-in-btn" aria-label="Zoom in">
                            <i class="fas fa-search-plus"></i> Zoom In
                        </button>
                        <button class="zoom-out-btn" aria-label="Zoom out">
                            <i class="fas fa-search-minus"></i> Zoom Out
                        </button>
                        <button class="reset-btn" aria-label="Reset view">
                            <i class="fas fa-undo"></i> Reset
                        </button>
                    </div>
                    <div class="model-viewer-canvas">
                        <!-- 3D model will be loaded here -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = this.modal.querySelector('.model-viewer-close');
        closeBtn.addEventListener('click', () => this.close());

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open(modelUrl) {
        this.modal.style.display = 'block';
        // Here you would initialize your 3D model viewer
        // For example, using Three.js or other 3D libraries
        console.log('Loading 3D model:', modelUrl);
    }

    close() {
        this.modal.style.display = 'none';
    }
}

// Initialize model viewer
const modelViewer = new ModelViewer();

// Plant Card Interactions
document.querySelectorAll('.plant-card').forEach(card => {
    // Quick view button
    const quickViewBtn = card.querySelector('.quick-view-btn');
    quickViewBtn.addEventListener('click', () => {
        // Implement quick view functionality
        console.log('Quick view clicked');
    });

    // Bookmark button
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', () => {
        bookmarkBtn.classList.toggle('active');
        // Implement bookmark functionality
        console.log('Bookmark clicked');
    });

    // 3D model button
    const modelBtn = card.querySelector('.model-view-btn');
    modelBtn.addEventListener('click', () => {
        const plantName = card.querySelector('h3').textContent;
        modelViewer.open(`models/${plantName.toLowerCase().replace(/\s+/g, '-')}.glb`);
    });

    // Share button
    const shareBtn = card.querySelector('.btn-secondary');
    shareBtn.addEventListener('click', () => {
        // Implement share functionality
        if (navigator.share) {
            navigator.share({
                title: card.querySelector('h3').textContent,
                text: card.querySelector('.plant-description').textContent,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            console.log('Share functionality not supported');
        }
    });
});

// Filter Functionality
document.querySelectorAll('.filter-option input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Implement filter functionality
        console.log('Filter changed:', checkbox.name, checkbox.value);
    });
});

// Sort Functionality
const sortSelect = document.querySelector('.sort-select');
sortSelect.addEventListener('change', () => {
    // Implement sort functionality
    console.log('Sort changed:', sortSelect.value);
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
});

function performSearch(query) {
    // Implement search functionality
    console.log('Searching for:', query);
}

// Pagination
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!btn.disabled) {
            // Implement pagination functionality
            console.log('Page changed:', btn.textContent);
        }
    });
}); 