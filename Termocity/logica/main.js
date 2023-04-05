const apiKey = '7471f67d0c2aff318a8855c9ab187ebb';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
function getCidades() {
    const estado = document.getElementById("estado").value;
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`;

    fetch(url)
        .then(response => response.json())
        .then(cidades => {
            const selectCidade = document.getElementById("city-input");
            selectCidade.innerHTML = "<option value=''>Selecione uma cidade</option>";
            cidades.forEach(cidade => {
                const option = document.createElement("option");
                option.value = cidade.nome;
                option.innerText = cidade.nome;
                selectCidade.appendChild(option);
            });


        })
        .catch(error => console.error(error));
}
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityInput = document.querySelector('#city-input');
    const city = cityInput.value;
    const url = `${apiUrl}${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp;
            const conditions = data.weather[0].description;
            const location = data.name;
            document.querySelector('#temp').textContent = temp+'°C';
            document.querySelector('#conditions').textContent = conditions;
            document.querySelector('#location').textContent = location;
        })
        .catch(error => console.error(error));
});