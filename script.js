let pokemons = [];
let currentOffset = 0;
const pokemonPerPage = 20;

const baseUrlPokemon = 'https://pokeapi.co/api/v2/pokemon';
const baseUrlType = 'https://pokeapi.co/api/v2/type/';

// Loader anzeigen
function showLoader() {
  document.getElementById('loading-spinner').style.display = 'block';
}

// Loader verstecken
function hideLoader() {
  document.getElementById('loading-spinner').style.display = 'none';
}

// fetch pokemon name and id
async function loadAllPokemonNames() {
  showLoader(); // Loader beim ersten Laden anzeigen
  try {
    currentOffset = 0;
    await loadPokemonBatch(currentOffset, pokemonPerPage);
    currentOffset += pokemonPerPage;
  } catch (error) {
    console.error('Fehler beim Laden der Pokemon:', error);
  } finally {
    hideLoader(); // Loader verstecken, wenn fertig
  }
}

async function loadPokemonBatch(offset, limit) {
  const url = `${baseUrlPokemon}?limit=${limit}&offset=${offset}`;
  let response = await fetch(url);
  let responseAsJson = await response.json();

  const startIndex = pokemons.length;
  
  for (let i = 0; i < responseAsJson.results.length; i++) {
      pokemons.push({
          id: offset + i + 1,
          name: responseAsJson.results[i].name,
          types: [],
          imageUrl: ''
      });
  }

  await loadPokemonImages(startIndex);
  await getAllTypesForNewPokemons(startIndex);
  
  // Beim ersten Laden alle Pokémon rendern, sonst nur die neuen
  if (startIndex === 0) {
      renderPokemonContainer();
  } else {
      renderNewPokemons(startIndex);
  }
}

async function loadPokemonImages(startIndex = 0) {
  for (let i = startIndex; i < pokemons.length; i++) {
    try {
        let pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemons[i].id}/`;
        let response = await fetch(pokemonUrl);
        let pokemonData = await response.json();
        
        pokemons[i].imageUrl = pokemonData.sprites.other['official-artwork'].front_default;
        
        if (!pokemons[i].imageUrl) {
            pokemons[i].imageUrl = pokemonData.sprites.front_default;
        }
        
    } catch (error) {
        console.log(`Fehler beim Laden von Pokémon ${pokemons[i].name}:`, error);
        pokemons[i].imageUrl = 'assets/img/pokeball_bg.jpeg';
    }
  }
}

// fetch pokemon types for all pokemons (initial load)
async function getAllTypes() {
  for (let i = 0; i < 18; i++) {
      let typeUrl = baseUrlType + (i + 1);
      let response = await fetch(typeUrl);
      let responseAsJson = await response.json();

      const pokemonInType = responseAsJson.pokemon;
      
      for (let j = 0; j < pokemonInType.length; j++) {
          const pokemonUrl = pokemonInType[j].pokemon.url;
          const pokemonId = parseInt(pokemonUrl.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', ''));

          if (pokemonId <= pokemons.length && pokemons[pokemonId - 1]) {
              pokemons[pokemonId - 1].types.push(responseAsJson.name);
          }
      }
  }

  renderPokemonContainer();
}

// fetch pokemon types for newly loaded pokemons only
async function getAllTypesForNewPokemons(startIndex) {
  for (let i = 0; i < 18; i++) {
    let typeUrl = baseUrlType + (i + 1);
    let response = await fetch(typeUrl);
    let responseAsJson = await response.json();

    const pokemonInType = responseAsJson.pokemon;
    
    for (let j = 0; j < pokemonInType.length; j++) {
      const pokemonUrl = pokemonInType[j].pokemon.url;
      const pokemonId = parseInt(pokemonUrl.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', ''));

      // Nur für die neu geladenen Pokémon prüfen
      for (let k = startIndex; k < pokemons.length; k++) {
        if (pokemons[k].id === pokemonId) {
            pokemons[k].types.push(responseAsJson.name);
            break;
        }
      }
    }
  }
}

function scrollToTop() {
    document.documentElement.scrollTop = 0;
}

async function showMorePokemons() {
    // Button während des Ladens deaktivieren
    const showMoreBtn = document.querySelector('button[onclick="showMorePokemons()"]');
    const originalText = showMoreBtn.textContent;
    showMoreBtn.disabled = true;
    showMoreBtn.textContent = 'Loading...';
    
    // Optional: Kleinen Loader für "Show more" Button anzeigen
    showLoader();
    
    try {
        await loadPokemonBatch(currentOffset, pokemonPerPage);
        currentOffset += pokemonPerPage;
    } catch (error) {
        console.error('Fehler beim Laden weiterer Pokémon:', error);
    } finally {
        // Button wieder aktivieren und Loader verstecken
        hideLoader();
        showMoreBtn.disabled = false;
        showMoreBtn.textContent = originalText;
    }
}