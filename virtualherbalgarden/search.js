document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const pagination = document.getElementById('pagination');

    // Example data for search results
    const plants = [
        { name: 'Tulsi (Holy Basil)', description: 'Known for its medicinal properties.', image: 'assets/plants/tulsi1.jpg', link: 'plant-detail.html' },
        { name: 'Neem', description: 'A versatile plant used in traditional medicine.', image: 'assets/plants/neem.jpg', link: 'plant-detail.html' },
        { name: 'Aloe Vera', description: 'Soothing and healing properties.', image: 'assets/plants/aloe-vera.jpg', link: 'plant-detail.html' },
        { name: 'Ashwagandha', description: 'Helps reduce stress and anxiety.', image: 'assets/plants/ashwagandha.jpg', link: 'plant-detail.html' },
        { name: 'Brahmi', description: 'Improves memory and brain function.', image: 'assets/plants/brahmi.jpg', link: 'plant-detail.html' },
        { name: 'Mint', description: 'Used for digestion and cooling effects.', image: 'assets/plants/mint.jpg', link: 'plant-detail.html' },
        { name: 'Turmeric', description: 'Anti-inflammatory and antioxidant.', image: 'assets/plants/turmeric.jpg', link: 'plant-detail.html' }
    ];

    const resultsPerPage = 3; // Number of results per page
    let currentPage = 1;

    // Function to display results for the current page
    const displayResults = (results) => {
        resultsGrid.innerHTML = ''; // Clear previous results
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const paginatedResults = results.slice(startIndex, endIndex);

        if (paginatedResults.length > 0) {
            noResults.style.display = 'none';
            paginatedResults.forEach(plant => {
                const card = document.createElement('div');
                card.classList.add('plant-card');
                card.innerHTML = `
                    <img src="${plant.image}" alt="${plant.name}">
                    <h3>${plant.name}</h3>
                    <p>${plant.description}</p>
                    <a href="${plant.link}" class="btn">View Details</a>
                `;
                resultsGrid.appendChild(card);
            });
        } else {
            noResults.style.display = 'block';
        }
    };

    // Function to create pagination controls
    const createPagination = (results) => {
        pagination.innerHTML = ''; // Clear previous pagination
        const totalPages = Math.ceil(results.length / resultsPerPage);

        // Previous Button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add(currentPage === 1 ? 'disabled' : '');
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayResults(results);
                createPagination(results);
            }
        });
        pagination.appendChild(prevButton);

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add(currentPage === i ? 'active' : '');
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayResults(results);
                createPagination(results);
            });
            pagination.appendChild(pageButton);
        }

        // Next Button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add(currentPage === totalPages ? 'disabled' : '');
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayResults(results);
                createPagination(results);
            }
        });
        pagination.appendChild(nextButton);
    };

    // Perform search and display results
    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        const filteredPlants = plants.filter(plant =>
            plant.name.toLowerCase().includes(query)
        );

        currentPage = 1; // Reset to the first page
        displayResults(filteredPlants);
        createPagination(filteredPlants);
    };

    // Event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Initial display (optional)
    displayResults(plants);
    createPagination(plants);
});