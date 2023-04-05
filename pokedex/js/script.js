let currentPokemonId = 1;

    function getPokemonInfo(id) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(response => response.json())
        .then(data => {
          const pokemonInfo = `
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">${data.name.toUpperCase()}</h5>
              <span class="badge">ID-${data.id}</span>
            </div>
            <div class="card-body">
              <img src="${data.sprites.other['official-artwork'].front_default}" class="img-fluid mb-3">
              <p class="card-text">
                <strong>Tipo:</strong> ${data.types.map(type => type.type.name).join(", ")}<br>
                <strong>Altura:</strong> ${data.height / 10}m<br>
                <strong>Peso:</strong> ${data.weight / 10}kg<br>
              </p>
            </div>
          </div>
        `;
          document.getElementById("pokemon-info").innerHTML = pokemonInfo;
        })
        .catch(error => {
          console.error(error);
        });
    }

    function updatePokemon() {
      getPokemonInfo(currentPokemonId);
    }

    function nextPokemon() {
      currentPokemonId++;
      updatePokemon();
    }

    function prevPokemon() {
      currentPokemonId--;
      updatePokemon();
    }

    document.getElementById("search-btn").addEventListener("click", () => {
      const pokemonName = document.getElementById("pokemon-input").value.toLowerCase();
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
        .then(response => response.json())
        .then(data => {
          currentPokemonId = data.id;
          updatePokemon();
        })
        .catch(error => {
          console.error(error);
        });
    });
    
    document.getElementById("next-btn").addEventListener("click", () => {
      nextPokemon();
    });
    
    document.getElementById("prev-btn").addEventListener("click", () => {
      prevPokemon();
    });

    updatePokemon();