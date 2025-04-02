// Tour Guide Class
class TourGuide {
    constructor() {
        this.modal = document.getElementById('tourGuideModal');
        this.currentTour = null;
        this.currentStep = 0;
        this.audioPlayer = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tour card click handlers
        document.querySelectorAll('.tour-card').forEach(card => {
            card.querySelector('.btn-primary').addEventListener('click', () => {
                this.startTour(card.dataset.tour);
            });
        });

        // Navigation buttons
        document.getElementById('prevPlant').addEventListener('click', () => this.previousStep());
        document.getElementById('nextPlant').addEventListener('click', () => this.nextStep());

        // Close button
        this.modal.querySelector('.close-btn').addEventListener('click', () => this.closeTour());

        // Audio controls
        this.modal.querySelector('.audio-btn').addEventListener('click', () => this.toggleAudio());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.style.display === 'block') return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeTour();
                    break;
                case 'ArrowLeft':
                    this.previousStep();
                    break;
                case 'ArrowRight':
                    this.nextStep();
                    break;
            }
        });
    }

    startTour(tourId) {
        this.currentTour = tourId;
        this.currentStep = 0;
        this.loadTourData();
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeTour() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (this.audioPlayer) {
            this.audioPlayer.pause();
        }
    }

    async loadTourData() {
        try {
            // Here you would fetch tour data from your backend
            const response = await fetch(`/api/tours/${this.currentTour}`);
            const tourData = await response.json();
            this.updateTourContent(tourData);
        } catch (error) {
            console.error('Error loading tour data:', error);
        }
    }

    updateTourContent(data) {
        const plantViewer = this.modal.querySelector('.plant-viewer');
        const plantInfo = this.modal.querySelector('.plant-info');
        
        // Update plant information
        plantInfo.querySelector('h3').textContent = data.name;
        plantInfo.querySelector('.plant-description').textContent = data.description;

        // Update progress
        const currentStep = this.modal.querySelector('.current-step');
        const totalSteps = this.modal.querySelector('.total-steps');
        currentStep.textContent = this.currentStep + 1;
        totalSteps.textContent = `/ ${data.totalSteps}`;

        // Load audio
        this.loadAudio(data.audioUrl);

        // Update map
        this.updateMap(data.location);
    }

    loadAudio(audioUrl) {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
        }
        this.audioPlayer = new Audio(audioUrl);
        this.audioPlayer.addEventListener('timeupdate', () => this.updateAudioProgress());
    }

    toggleAudio() {
        if (!this.audioPlayer) return;

        const audioBtn = this.modal.querySelector('.audio-btn i');
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
            audioBtn.classList.replace('fa-play', 'fa-pause');
        } else {
            this.audioPlayer.pause();
            audioBtn.classList.replace('fa-pause', 'fa-play');
        }
    }

    updateAudioProgress() {
        const progressBar = this.modal.querySelector('.audio-progress .progress-bar');
        const timeDisplay = this.modal.querySelector('.audio-time');
        
        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        const minutes = Math.floor(this.audioPlayer.currentTime / 60);
        const seconds = Math.floor(this.audioPlayer.currentTime % 60);
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateMap(location) {
        // Here you would initialize and update your map
        // For example, using Leaflet.js or Google Maps
        console.log('Updating map with location:', location);
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.loadTourData();
        }
    }

    nextStep() {
        // Check if there are more steps in the tour
        const totalSteps = parseInt(this.modal.querySelector('.total-steps').textContent.slice(2));
        if (this.currentStep < totalSteps - 1) {
            this.currentStep++;
            this.loadTourData();
        } else {
            this.completeTour();
        }
    }

    completeTour() {
        // Update progress and show completion message
        const tourCard = document.querySelector(`[data-tour="${this.currentTour}"]`);
        const progressBar = tourCard.querySelector('.progress-bar');
        progressBar.style.width = '100%';
        
        // Show completion message
        alert('Congratulations! You have completed the tour.');
        this.closeTour();
    }

    initializeTabs() {
        const tabBtns = this.modal.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                this.modal.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                const tabId = btn.dataset.tab;
                this.modal.querySelector(`#${tabId}`).classList.add('active');
            });
        });
    }

    initializeNotes() {
        const notesBtn = this.modal.querySelector('[aria-label="Take notes"]');
        notesBtn.addEventListener('click', () => {
            const notesModal = document.createElement('div');
            notesModal.className = 'notes-modal';
            notesModal.innerHTML = `
                <h3>Your Notes</h3>
                <textarea placeholder="Write your notes here..."></textarea>
                <div class="modal-actions">
                    <button class="btn-primary">Save</button>
                    <button class="btn-secondary">Cancel</button>
                </div>
            `;
            document.body.appendChild(notesModal);
            
            // Load existing notes
            const existingNotes = localStorage.getItem(`notes_${this.currentTour}_${this.currentStep}`);
            if (existingNotes) {
                notesModal.querySelector('textarea').value = existingNotes;
            }
            
            // Save notes
            notesModal.querySelector('.btn-primary').addEventListener('click', () => {
                const notes = notesModal.querySelector('textarea').value;
                localStorage.setItem(`notes_${this.currentTour}_${this.currentStep}`, notes);
                notesModal.remove();
            });
            
            // Close modal
            notesModal.querySelector('.btn-secondary').addEventListener('click', () => {
                notesModal.remove();
            });
        });
    }

    toggleFavorite() {
        const favoriteBtn = this.modal.querySelector('[aria-label="Add to favorites"]');
        const isFavorite = localStorage.getItem(`favorite_${this.currentTour}_${this.currentStep}`);
        
        // Update button state
        if (isFavorite) {
            favoriteBtn.classList.add('active');
            favoriteBtn.querySelector('i').classList.replace('fa-heart', 'fa-heart-solid');
        }
        
        favoriteBtn.addEventListener('click', () => {
            const isCurrentlyFavorite = favoriteBtn.classList.contains('active');
            if (isCurrentlyFavorite) {
                localStorage.removeItem(`favorite_${this.currentTour}_${this.currentStep}`);
                favoriteBtn.classList.remove('active');
                favoriteBtn.querySelector('i').classList.replace('fa-heart-solid', 'fa-heart');
            } else {
                localStorage.setItem(`favorite_${this.currentTour}_${this.currentStep}`, 'true');
                favoriteBtn.classList.add('active');
                favoriteBtn.querySelector('i').classList.replace('fa-heart', 'fa-heart-solid');
            }
        });
    }
}

// Initialize tour guide when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const tourGuide = new TourGuide();
}); 