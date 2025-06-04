// Extract URL parameters for origin and destination
const urlParams = new URLSearchParams(window.location.search);
const initialOrigin = urlParams.get('origin');
const initialDestination = urlParams.get('destination');

setInterval(() => {
    slotMachineText.classList.add('fade');
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % words.length;
        slotMachineText.textContent = words[currentIndex];
        slotMachineText.classList.remove('fade');
    }, 500); // Match this duration to the CSS transition time
}, 2000);

// Fetch distinct companies, origins, and destinations and populate the filters
fetch('/api/countries')
    .then(response => response.json())
    .then(data => {
        const companyFilter = document.getElementById('company-filter');
        const originFilter = document.getElementById('origin-country-filter');
        const destinationFilter = document.getElementById('destination-country-filter');

        // Populate companies (from the 'companies' endpoint)
        fetch('/api/companies')
            .then(response => response.json())
            .then(companies => {
                const uniqueCompanies = [...new Set(companies.map(company => company.name))];
                uniqueCompanies.forEach(company => {
                    const option = document.createElement('option');
                    option.value = company;
                    option.textContent = company;
                    companyFilter.appendChild(option);
                });
            });

        // Populate origin countries
        data.origins.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            originFilter.appendChild(option);
        });

        // Populate destination countries
        data.destinations.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            destinationFilter.appendChild(option);
        });

        // Set initial values from URL parameters
        if (initialOrigin) originFilter.value = initialOrigin;
        if (initialDestination) destinationFilter.value = initialDestination;

        // Fetch initial data with the parameters
        fetchShipmentData(initialOrigin, initialDestination, '', 500);
    })
    .catch(error => console.error('Error fetching countries:', error));

// Function to fetch shipment data with optional filters
function fetchShipmentData(origin, destination, company, maxPrice) {
    let apiUrl = `/api/companies`;

    // Add query parameters if filters are provided
    const params = new URLSearchParams();
    if (origin) params.append('origin', origin);
    if (destination) params.append('destination', destination);
    if (company) params.append('company', company);

    if (params.toString()) {
        apiUrl += `?${params.toString()}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('shipment-options');
            container.innerHTML = ''; // Clear previous content

            // Loop through the data and create HTML elements for each company
            data.forEach(company => {
                // Apply price filter
                if (company.price <= maxPrice) {
                    const shipmentOption = document.createElement('div');
                    shipmentOption.className = 'shipment-option';

                    shipmentOption.innerHTML = `
                        <div class="company-logo">
                            <img src="${company.logo_url}" alt="${company.name} Logo">
                        </div>
                        <div class="shipment-details">
                            <h3>${company.name}</h3>
                            <p>${company.delivery_days} delivery</p>
                            <p>${company.service_type}</p>
                            <a href="${company.website_url}" target="_blank" class="more-info">More Info</a>
                        </div>
                        <div class="price-and-book">
                            <p class="price">${company.price.toFixed(2)}</p>
                            <button class="book-now">Book Now</button>
                        </div>
                    `;
                    container.appendChild(shipmentOption);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to apply filters and fetch data
function applyFilters() {
    const origin = document.getElementById('origin-country-filter').value;
    const destination = document.getElementById('destination-country-filter').value;
    const company = document.getElementById('company-filter').value;
    const maxPrice = document.getElementById('price-range').value;
    fetchShipmentData(origin, destination, company, maxPrice);
}

// Update the price range label
function updatePriceLabel(value) {
    document.getElementById('price-max').textContent = value;
}

// Initial fetch to display data when the page loads
fetchShipmentData(null, null, null, 500); // Default max price: 500
