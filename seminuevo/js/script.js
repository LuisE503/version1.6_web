document.addEventListener('DOMContentLoaded', async function() {
    // --- Elementos del DOM ---
    const normalHeader = document.getElementById('normal-header');
    const stickyHeader = document.getElementById('sticky-header');
    const mainContentPusher = document.getElementById('main-content-pusher');
    const whatsappFloatButton = document.getElementById('whatsapp-float-button');
    const backToTopButton = document.getElementById('back-to-top-button');

    const homeSection = document.getElementById('home-section');
    const productDetailSection = document.getElementById('product-detail-section');
    const searchResultsSection = document.getElementById('search-results-section');

    const backToCategoriesButton = document.getElementById('back-to-categories-button');
    const backToHomeFromSearchButton = document.getElementById('back-to-home-from-search-button'); // Corrected assignment

    const categoryNavLinks = document.getElementById('category-nav-links'); // Para el header normal
    const stickyCategoryNavLinks = document.getElementById('sticky-category-nav-links'); // Para el header sticky
    const footerCategoryLinks = document.getElementById('footer-category-links');
    const dynamicCategoryProductsContainer = document.getElementById('dynamic-category-products-container');

    const productDetailTitle = document.getElementById('product-detail-title');
    const productDetailImage = document.getElementById('product-detail-image');
    const productDetailPrice = document.getElementById('product-detail-price');
    const productDetailDescription = document.getElementById('product-detail-description');
    const productDetailSpecs = document.getElementById('product-detail-specs');
    const productWhatsappButton = document.getElementById('product-whatsapp-button');
    const productGallery = document.getElementById('product-gallery');

    const mainSearchInput = document.getElementById('main-search'); // Búsqueda en header normal
    const stickySearchInput = document.getElementById('sticky-search'); // Búsqueda en header sticky
    const mainSearchSuggestions = document.getElementById('main-search-suggestions');
    const stickySearchSuggestions = document.getElementById('sticky-search-suggestions');
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchQueryDisplay = document.getElementById('search-query-display');
    const noSearchResultsMessage = document.getElementById('no-search-results-message');

    // --- Variables de Estado ---
    let scrollThreshold = 0; // Se calculará dinámicamente
    let isStickyVisible = false;
    let allCategories = []; // Almacenará los datos de las categorías
    let allProducts = {};   // Almacenará los datos de los productos por ID

    // --- Funciones de Utilidad ---

    /**
     * Calculates and sets the top padding of the main content
     * to prevent it from being hidden under the header.
     * This function is crucial for ensuring the layout is correct on load and resize.
     */
    const setupLayout = () => {
        // Use getBoundingClientRect().height for accurate height including padding and border
        const normalHeaderHeight = normalHeader.getBoundingClientRect().height;
        // Update the CSS variable --header-height
        document.documentElement.style.setProperty('--header-height', `${normalHeaderHeight}px`);
        scrollThreshold = normalHeaderHeight; // The threshold for the sticky header is the height of the normal header
        console.log(`Header height calculated: ${normalHeaderHeight}px`);
    };

    /**
     * Handles the visibility of the sticky header and floating buttons on scroll.
     */
    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > scrollThreshold && !isStickyVisible) {
            isStickyVisible = true;
            stickyHeader.classList.add('visible'); // Add 'visible' class to show
            normalHeader.style.opacity = '0';
            normalHeader.style.pointerEvents = 'none'; // Disable mouse events on normal header
            
            whatsappFloatButton.classList.add('visible');
            backToTopButton.classList.add('visible');
        } else if (currentScrollY <= scrollThreshold && isStickyVisible) {
            isStickyVisible = false;
            stickyHeader.classList.remove('visible'); // Remove 'visible' class to hide
            normalHeader.style.opacity = '1';
            normalHeader.style.pointerEvents = 'auto'; // Enable mouse events on normal header

            whatsappFloatButton.classList.remove('visible');
            backToTopButton.classList.remove('visible');
        }
    };

    /**
     * Fetches category data from categories.json.
     * @returns {Array} An array of category objects.
     */
    const fetchCategories = async () => {
        try {
            const response = await fetch('data/categories.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    /**
     * Fetches data for a specific product from its JSON file.
     * @param {string} productId - The ID of the product.
     * @returns {Object|null} The product object or null if not found.
     */
    const fetchProduct = async (productId) => {
        try {
            const response = await fetch(`data/products/${productId}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
        }
    };

    /**
     * Renders category navigation links in headers and footer.
     */
    const renderCategoryNavLinks = () => {
        // Render for normal header
        if (categoryNavLinks) {
            categoryNavLinks.innerHTML = '';
            allCategories.forEach(category => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${category.id}-category`;
                link.classList.add('icon-category-link'); // Class for normal header
                
                let iconClass = category.icon;
                if (category.name === 'Equipos Completos') {
                    iconClass = 'fas fa-desktop';
                }
                link.innerHTML = `<i class="${iconClass}"></i><span>${category.name}</span>`;
                link.setAttribute('aria-label', `Ver categoría ${category.name}`);
                li.appendChild(link);
                categoryNavLinks.appendChild(li);
            });
        }

        // Render for sticky header
        if (stickyCategoryNavLinks) {
            stickyCategoryNavLinks.innerHTML = '';
            allCategories.forEach(category => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${category.id}-category`;
                link.classList.add('sticky-category-link'); // Class for sticky header
                
                let iconClass = category.icon;
                if (category.name === 'Equipos Completos') {
                    iconClass = 'fas fa-desktop';
                }
                link.innerHTML = `<i class="${iconClass}"></i><span>${category.name}</span>`;
                link.setAttribute('aria-label', `Ver categoría ${category.name}`);
                li.appendChild(link);
                stickyCategoryNavLinks.appendChild(li);
            });
        }

        // Render for footer
        if (footerCategoryLinks) {
            footerCategoryLinks.innerHTML = '';
            allCategories.forEach(category => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${category.id}-category`;
                link.classList.add('hover:text-light-blue', 'transition-colors', 'text-footer-text'); // Classes for footer
                link.textContent = category.name;
                link.setAttribute('aria-label', `Ver categoría ${category.name}`);
                li.appendChild(link);
                footerCategoryLinks.appendChild(li);
            });
        }
    };

    /**
     * Renders a product card.
     * @param {Object} product - Object with product information.
     * @returns {HTMLElement} The product card div element.
     */
    const createProductCard = (product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'cursor-pointer');
        productCard.setAttribute('data-product-id', product.id); // Save product ID

        // Use image1.webp or image2.webp for product image placeholders
        const placeholderImage = (product.id.charCodeAt(0) % 2 === 0) ? 'images/image1.webp' : 'images/image2.webp';

        productCard.innerHTML = `
            <img src="${product.images[0] || placeholderImage}" 
                 alt="${product.name}" 
                 class="product-card-image" loading="lazy" 
                 onerror="this.onerror=null;this.src='https://placehold.co/400x300/E0E0E0/133C55?text=No+Image';">
            <span class="product-card-title">${product.name}</span>
            <span class="product-card-price">$${product.price.toFixed(2)}</span>
            <button class="product-card-button">Ver Producto</button>
        `;

        // Add listener for the entire card, not just the button
        productCard.addEventListener('click', (event) => {
            // Prevent button click from propagating if it's the button
            if (event.target.tagName === 'BUTTON') {
                event.stopPropagation(); // Stop propagation to avoid double event
            }
            navigateToProductDetail(product.id);
        });

        return productCard;
    };

    /**
     * Renders all category sections with their products.
     */
    const renderCategorySections = async () => {
        dynamicCategoryProductsContainer.innerHTML = ''; // Clear existing content

        for (const category of allCategories) {
            const section = document.createElement('section');
            section.id = `${category.id}-category`;
            section.classList.add('bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'mb-12', 'transition-all', 'duration-300', 'hover:shadow-2xl');

            // Use the provided category banner image
            const categoryBannerImage = 'uploaded:image_0b7ea7.png-abf6de42-c09b-42fe-9487-2bcaf3ca5637'; 
            const bannerImageText = '400x300'; // Dimension text

            section.innerHTML = `
                <h3 class="text-2xl md:text-3xl font-extrabold text-center mb-4 text-dark-blue">${category.name}: ${category.tagline}</h3>
                <p class="text-center text-lg mb-8 text-medium-blue">${category.description}</p>
                <div class="flex flex-col lg:flex-row gap-6 category-row">
                    <div class="w-full lg:w-1/4 category-banner">
                        <img src="${categoryBannerImage}" alt="Banner de ${category.name} - ${bannerImageText}" class="w-full h-full object-cover rounded-xl" loading="lazy">
                        <div class="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-8 text-white">
                            <h2 class="text-2xl font-extrabold leading-tight">${bannerImageText}</h2>
                        </div>
                    </div>
                    <div class="w-full lg:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-4 category-products-grid" id="products-grid-${category.id}">
                        <!-- Products will be loaded here -->
                    </div>
                </div>
            `;
            dynamicCategoryProductsContainer.appendChild(section);

            const productsGrid = section.querySelector(`#products-grid-${category.id}`);
            if (category.productIds && category.productIds.length > 0) {
                // Limit to 4 products per category for preview on the main page
                const productsToDisplay = category.productIds.slice(0, 4); 
                for (const productId of productsToDisplay) {
                    const product = allProducts[productId]; // Get product from cache
                    if (product) {
                        productsGrid.appendChild(createProductCard(product));
                    } else {
                        console.warn(`Product with ID ${productId} not found.`);
                    }
                }
            } else {
                productsGrid.innerHTML = '<p class="col-span-full text-center text-medium-blue">No hay productos disponibles en esta categoría.</p>';
            }
        }
    };

    /**
     * Renders the product detail view.
     * @param {string} productId - The ID of the product to display.
     */
    const renderProductDetail = async (productId) => {
        const product = allProducts[productId]; // Get product from cache
        if (!product) {
            console.error(`Product with ID ${productId} not found.`);
            return;
        }

        // Hide other sections and show detail section
        homeSection.classList.add('hidden');
        searchResultsSection.classList.add('hidden');
        productDetailSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        productDetailTitle.textContent = product.name;
        productDetailImage.src = product.images[0] || 'https://placehold.co/800x600/E0E0E0/133C55?text=No+Image';
        productDetailImage.alt = product.name;
        productDetailPrice.textContent = `$${product.price.toFixed(2)}`;
        productDetailDescription.textContent = product.description;

        // Render specifications
        productDetailSpecs.innerHTML = '';
        if (product.specifications && product.specifications.length > 0) {
            product.specifications.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                productDetailSpecs.appendChild(li);
            });
        } else {
            productDetailSpecs.innerHTML = '<li>No hay especificaciones disponibles.</li>';
        }

        // Render image gallery
        productGallery.innerHTML = '';
        if (product.images && product.images.length > 0) {
            product.images.forEach((imgSrc, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = imgSrc;
                thumbnail.alt = `Miniatura ${index + 1} de ${product.name}`;
                thumbnail.classList.add('w-full', 'h-24', 'object-cover', 'rounded-md', 'shadow-sm', 'border-2', 'border-gray-300', 'hover:border-light-blue', 'transition-colors');
                if (index === 0) {
                    thumbnail.classList.add('active-thumbnail');
                }
                thumbnail.addEventListener('click', () => {
                    productDetailImage.src = imgSrc;
                    // Update active class on thumbnails
                    productGallery.querySelectorAll('img').forEach(img => img.classList.remove('active-thumbnail'));
                    thumbnail.classList.add('active-thumbnail');
                });
                productGallery.appendChild(thumbnail);
            });
        } else {
            productGallery.innerHTML = '<p class="col-span-full text-center text-medium-blue">No hay imágenes disponibles para la galería.</p>';
        }

        // Update WhatsApp link with product name
        productWhatsappButton.href = `https://wa.me/50378901234?text=Hola!%20Me%20interesa%20el%20producto:%20${encodeURIComponent(product.name)}%20(ID:%20${product.id})`;
    };

    /**
     * Navigates to the product detail view.
     * @param {string} productId - The ID of the product to display.
     */
    const navigateToProductDetail = (productId) => {
        window.location.hash = `product=${productId}`;
        renderProductDetail(productId);
    };

    /**
     * Navigates back to the main view (home).
     */
    const navigateToHome = () => {
        homeSection.classList.remove('hidden');
        productDetailSection.classList.add('hidden');
        searchResultsSection.classList.add('hidden');
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Displays the search results section and hides others.
     * @param {string} query - The search query.
     * @param {Array} results - Array of products to display.
     */
    const showSearchResults = (query, results) => {
        homeSection.classList.add('hidden');
        productDetailSection.classList.add('hidden');
        searchResultsSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        searchQueryDisplay.textContent = query;
        searchResultsContainer.innerHTML = '';
        noSearchResultsMessage.classList.add('hidden');

        if (results.length > 0) {
            results.forEach(product => {
                searchResultsContainer.appendChild(createProductCard(product));
            });
        } else {
            noSearchResultsMessage.classList.remove('hidden');
        }
    };

    /**
     * Handles URL hash changes for navigation.
     */
    const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash.startsWith('#product=')) {
            const productId = hash.substring('#product='.length);
            renderProductDetail(productId);
        } else if (hash.startsWith('#search=')) {
            const query = decodeURIComponent(hash.substring('#search='.length));
            performSearch(query);
        }
        else {
            navigateToHome();
        }
    };

    // --- Search Functionality ---
    const filterContent = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        const matchedProducts = Object.values(allProducts).filter(product =>
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.description.toLowerCase().includes(lowerCaseQuery) ||
            (product.specifications && product.specifications.some(spec => spec.toLowerCase().includes(lowerCaseQuery)))
        );

        const matchedCategories = allCategories.filter(category =>
            category.name.toLowerCase().includes(lowerCaseQuery) ||
            category.description.toLowerCase().includes(lowerCaseQuery) ||
            category.tagline.toLowerCase().includes(lowerCaseQuery)
        );
        return { matchedProducts, matchedCategories };
    };

    /**
     * Displays search suggestions for the active input.
     * @param {HTMLElement} inputElement - The search input element that triggered the event.
     * @param {HTMLElement} suggestionsContainer - Container for suggestions.
     * @param {Array} products - Matching products.
     * @param {Array} categories - Matching categories.
     */
    const displaySuggestions = (inputElement, suggestionsContainer, products, categories) => {
        suggestionsContainer.innerHTML = '';
        if (products.length === 0 && categories.length === 0) {
            suggestionsContainer.classList.add('hidden');
            return;
        }

        const ul = document.createElement('ul');
        ul.classList.add('search-suggestions-list');

        categories.slice(0, 3).forEach(category => {
            const li = document.createElement('li');
            li.textContent = `Categoría: ${category.name}`;
            li.addEventListener('click', () => {
                window.location.hash = `${category.id}-category`;
                suggestionsContainer.classList.add('hidden');
                inputElement.value = ''; // Clear the correct input
            });
            ul.appendChild(li);
        });

        products.slice(0, 5).forEach(product => {
            const li = document.createElement('li');
            li.textContent = product.name;
            li.addEventListener('click', () => {
                navigateToProductDetail(product.id);
                suggestionsContainer.classList.add('hidden');
                inputElement.value = ''; // Clear the correct input
            });
            ul.appendChild(li);
        });

        suggestionsContainer.appendChild(ul);
        suggestionsContainer.classList.remove('hidden');
    };

    /**
     * Performs the search and displays results.
     * @param {string} query - The search query.
     */
    const performSearch = (query) => {
        if (query.trim() === '') {
            navigateToHome();
            return;
        }
        const { matchedProducts } = filterContent(query);
        showSearchResults(query, matchedProducts);
        mainSearchSuggestions.classList.add('hidden');
        stickySearchSuggestions.classList.add('hidden'); // Ensure both are hidden
    };

    /**
     * Sets up listeners for search fields.
     */
    const setupSearch = () => {
        const handleInput = (event, suggestionsContainer) => {
            const query = event.target.value;
            if (query.length > 1) {
                const { matchedProducts, matchedCategories } = filterContent(query);
                displaySuggestions(event.target, suggestionsContainer, matchedProducts, matchedCategories); // Pass the input element
            } else {
                suggestionsContainer.classList.add('hidden');
            }
        };

        const handleEnter = (event) => {
            if (event.key === 'Enter') {
                const query = event.target.value;
                window.location.hash = `search=${encodeURIComponent(query)}`;
                performSearch(query);
                event.target.blur();
            }
        };

        // Event listeners for the main search field
        mainSearchInput.addEventListener('input', (e) => handleInput(e, mainSearchSuggestions));
        mainSearchInput.addEventListener('keydown', handleEnter);
        mainSearchInput.addEventListener('focus', (e) => handleInput(e, mainSearchSuggestions));
        mainSearchInput.addEventListener('blur', () => {
            setTimeout(() => mainSearchSuggestions.classList.add('hidden'), 200);
        });

        // Event listeners for the sticky search field
        stickySearchInput.addEventListener('input', (e) => handleInput(e, stickySearchSuggestions));
        stickySearchInput.addEventListener('keydown', handleEnter);
        stickySearchInput.addEventListener('focus', (e) => handleInput(e, stickySearchSuggestions));
        stickySearchInput.addEventListener('blur', () => {
            setTimeout(() => stickySearchSuggestions.classList.add('hidden'), 200);
        });

        backToHomeFromSearchButton.addEventListener('click', navigateToHome);
    };

    // --- Initialization ---
    const init = async () => {
        // Ensure layout is set up after all resources are loaded
        window.addEventListener('load', setupLayout);
        window.addEventListener('resize', setupLayout); // Recalculate on resize

        // Initial setup in case load event fires before DOMContentLoaded
        setupLayout(); 
        
        window.addEventListener('scroll', handleScroll, { passive: true });

        allCategories = await fetchCategories();
        const productPromises = allCategories.flatMap(category => 
            category.productIds ? category.productIds.map(productId => fetchProduct(productId)) : []
        );
        const fetchedProducts = await Promise.all(productPromises);
        fetchedProducts.forEach(product => {
            if (product) {
                allProducts[product.id] = product;
            }
        });

        renderCategoryNavLinks();
        renderCategorySections();

        // Removed setupSlider calls as requested

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.getElementById('current-year').textContent = new Date().getFullYear();

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#product=') || href.startsWith('#search=')) {
                    return;
                }

                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Get current header height (normal or sticky)
                    const currentHeaderHeight = isStickyVisible ? stickyHeader.offsetHeight : normalHeader.offsetHeight;
                    window.scrollTo({
                        top: targetElement.offsetTop - currentHeaderHeight,
                        behavior: 'smooth'
                    });
                } else if (targetId === 'home-section') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });

        setupSearch();

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);

        backToCategoriesButton.addEventListener('click', navigateToHome);
    };

    init();
});
