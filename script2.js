// Simulação de uma base de dados de lojas
const stores = [
    { name: "Loja A", game: "Super Mario", city: "São Paulo", state: "SP", address: "Av. Paulista, 1000", location: { lat: -23.561684, lng: -46.655981 } },
    { name: "Loja B", game: "Super Mario", city: "Campinas", state: "SP", address: "Rua das Flores, 200", location: { lat: -22.908333, lng: -47.062634 } },
    { name: "Loja C", game: "The Legend of Zelda", city: "Rio de Janeiro", state: "RJ", address: "Rua do Mercado, 50", location: { lat: -22.9035, lng: -43.2096 } },
    { name: "Loja D", game: "Super Mario", city: "Belo Horizonte", state: "MG", address: "Av. Amazonas, 1500", location: { lat: -19.92083, lng: -43.93778 } },
];
// Lista completa de estados com algumas cidades para cada um como exemplo
const locations = {
    "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
    "AL": ["Maceió", "Arapiraca", "Palmeira dos Índios"],
    "AP": ["Macapá", "Santana", "Oiapoque"],
    "AM": ["Manaus", "Parintins", "Itacoatiara"],
    "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista"],
    "CE": ["Fortaleza", "Juazeiro do Norte", "Sobral"],
    "DF": ["Brasília"],
    "ES": ["Vitória", "Vila Velha", "Serra"],
    "GO": ["Goiânia", "Anápolis", "Aparecida de Goiânia"],
    "MA": ["São Luís", "Imperatriz", "Caxias"],
    "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis"],
    "MS": ["Campo Grande", "Dourados", "Três Lagoas"],
    "MG": ["Belo Horizonte", "Uberlândia", "Contagem"],
    "PA": ["Belém", "Ananindeua", "Marabá"],
    "PB": ["João Pessoa", "Campina Grande", "Patos"],
    "PR": ["Curitiba", "Londrina", "Maringá"],
    "PE": ["Recife", "Olinda", "Caruaru"],
    "PI": ["Teresina", "Parnaíba", "Picos"],
    "RJ": ["Rio de Janeiro", "Niterói", "Petrópolis"],
    "RN": ["Natal", "Mossoró", "Parnamirim"],
    "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas"],
    "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes"],
    "RR": ["Boa Vista"],
    "SC": ["Florianópolis", "Joinville", "Blumenau"],
    "SP": ["São Paulo", "Campinas", "Santos"],
    "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto"],
    "TO": ["Palmas", "Araguaína", "Gurupi"]
};

// Função para inicializar os seletores de estados e cidades
function initializeStateAndCitySelectors() {
    const stateInput = document.getElementById("state-input");
    const cityInput = document.getElementById("city-input");

    // Preenche os estados no campo de seleção
    for (let state in locations) {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateInput.appendChild(option);
    }

    // Atualiza as cidades ao selecionar um estado
    stateInput.addEventListener("change", () => {
        const selectedState = stateInput.value;
        cityInput.innerHTML = '<option value="">Selecione a cidade</option>';

        if (selectedState && locations[selectedState]) {
            locations[selectedState].forEach(city => {
                const option = document.createElement("option");
                option.value = city;
                option.textContent = city;
                cityInput.appendChild(option);
            });
        }
    });
}

// Chamamos a função para inicializar os seletores de estado e cidade
initializeStateAndCitySelectors();



// Função para inicializar o Google Maps
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: -14.235004, lng: -51.92528 }, // Centro do Brasil
    });
    window.map = map;
}

// Função para buscar lojas
document.getElementById('search-btn').addEventListener('click', () => {
    const game = document.getElementById('game-input').value.trim().toLowerCase();
    const state = document.getElementById('state-input').value.trim().toLowerCase();
    const city = document.getElementById('city-input').value.trim().toLowerCase();

    if (!game || !state) {
        alert('Por favor, insira o nome do jogo e o estado.');
        return;
    }

    searchStores(game, city, state);
});

function searchStores(game, city, state) {
    const resultsDiv = document.getElementById('store-list');
    resultsDiv.innerHTML = '';

    const filteredStores = stores.filter(store => store.game.toLowerCase() === game && store.state.toLowerCase() === state);

    let cityStores = filteredStores.filter(store => store.city.toLowerCase() === city);
    let stateStores = filteredStores.filter(store => store.city.toLowerCase() !== city);

    if (cityStores.length > 0) {
        displayStores(cityStores);
    } else if (stateStores.length > 0) {
        displayStores(stateStores, 'Nenhuma loja encontrada na cidade. Aqui estão algumas no estado:');
    } else {
        resultsDiv.innerHTML = '<p>Nenhuma loja encontrada no estado.</p>';
    }
}

// Função para exibir as lojas e colocar marcadores no mapa
function displayStores(stores, message) {
    const resultsDiv = document.getElementById('store-list');
    if (message) {
        const messageElement = document.createElement('li');
        messageElement.textContent = message;
        resultsDiv.appendChild(messageElement);
    }

    stores.forEach(store => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${store.name}</strong><br>${store.address}<br><a href="https://www.google.com/maps/search/?api=1&query=${store.location.lat},${store.location.lng}" target="_blank">Ver no Google Maps</a>`;
        resultsDiv.appendChild(li);

        addMarker(store.location, store.name);
    });
}

// Adiciona marcadores no Google Maps
function addMarker(location, title) {
    new google.maps.Marker({
        position: location,
        map: window.map,
        title: title,
    });

    // Centraliza o mapa no primeiro resultado
    window.map.setCenter(location);
}
