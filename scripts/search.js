// Simple Live Search for Pokemon
let originalPokemons = [];
let isSearchActive = false;

// Initialize search
function initializeSearch() {
    const searchInput = document.querySelector('input[type="search"]');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Handle search input
function handleSearch(event) {
    const searchTerm = event.target?.value?.trim?.()?.toLowerCase?.() ?? '';
    
    if (searchTerm.length === 0) {
        // Clear search - show all Pokemon
        if (isSearchActive) {
            showAllPokemons();
        }
        return;
    }
    
    if (searchTerm.length >= 3) {
        performSearch(searchTerm);
    }
}

// Perform search
function performSearch(searchTerm) {
    if (!isSearchActive) {
        originalPokemons = [...(pokemons ?? [])];
        isSearchActive = true;
    }
    
    // Filter Pokemon
    const filteredPokemons = originalPokemons.filter(pokemon => {
        return pokemon?.name?.toLowerCase?.()?.includes?.(searchTerm) ?? false;
    });
    
    // Display results
    displayResults(filteredPokemons);
}

// Display search results
function displayResults(filteredPokemons) {
    const container = document.getElementById("pokedex-render-container");
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < (filteredPokemons?.length ?? 0); i++) {
        const originalIndex = originalPokemons.findIndex(p => p?.id === filteredPokemons?.[i]?.id);
        if (originalIndex !== -1) {
            container.innerHTML += getPokedexTemplate(originalIndex);
        }
    }
    
    // Add event listeners for filtered results
    addPokemonCardEventListeners();
}

// Show all Pokemon
function showAllPokemons() {
    const container = document.getElementById("pokedex-render-container");
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < (originalPokemons?.length ?? 0); i++) {
        container.innerHTML += getPokedexTemplate(i);
    }
    
    // Add event listeners
    addPokemonCardEventListeners();
    
    isSearchActive = false;
}

// Initialize search when page loads
window.addEventListener('load', function() {
    setTimeout(initializeSearch, 1000);
});
