const typeColors = {
  'normal': '#BCBCAC',
  'fighting': '#BC5442',
  'flying': '#669AFF',
  'poison': '#AB549A',
  'ground': '#DEBC54',
  'rock': '#BCAC66',
  'bug': '#ABBC1C',
  'ghost': '#6666BC',
  'steel': '#ABACBC',
  'fire': '#FF421C',
  'water': '#2F9AFF',
  'grass': '#78CD54',
  'electric': '#FFCD30',
  'psychic': '#FF549A',
  'ice': '#78DEFF',
  'dragon': '#7866EF',
  'dark': '#785442',
  'fairy': '#FFACFF',
  'shadow': '#0E2E4C'
};

function renderPokemonContainer() {
  let contentRef = document.getElementById("pokedex-render-container");
    
  for(let index = 0; index < pokemons.length; index++) {
      contentRef.innerHTML +=  getPokedexTemplate(index);
  }
}

function renderNewPokemons(startIndex) {
  let contentRef = document.getElementById("pokedex-render-container");
  
  for(let index = startIndex; index < pokemons.length; index++) {
      contentRef.innerHTML += getPokedexTemplate(index);
  }
}

function getPokedexTemplate(index) {
  const pokemon = pokemons[index];
  
  let typesHtml = '';
  pokemon.types.forEach(type => {
    const typeColor = typeColors[type.toLowerCase()] || '#999999';
    typesHtml += `<div class="type-container" style="background-color: ${typeColor}">${type}</div>`;
  });

  return `
    <div class="pokemon-render-result-container container center column">
      <img class="search-pokemon-image" src="${pokemon.imageUrl}" alt="${pokemon.name}">
      <span class="bold font-size-12">Nr. ${pokemon.id}</span>
      <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
      <div class="row">
        ${typesHtml}
      </div>
  </div>
  `;
}