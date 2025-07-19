let pokemons = [];

const url = 'https://pokeapi.co/api/v2/pokemon?limit=20';
const baseUrlType = 'https://pokeapi.co/api/v2/type/';

// fetch pokemon name and id
async function loadAllPokemonNames() {
    let response = await fetch(url);
    let responseAsJson = await response.json();

    for (let i = 0; i < responseAsJson.results.length; i++) {
        pokemons.push({
            id: i + 1,
            name: responseAsJson.results[i].name,
            types: [],
            imageUrl: ''
        });
    }

    await loadPokemonImages();
    getAllTypes();
}

async function loadPokemonImages() {
  for (let i = 0; i < pokemons.length; i++) {
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

// fetch pokemon types
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