const API_KEY = 'SUA_CHAVE_RAWG_API';
const API_URL = 'https://api.rawg.io/api/games';

document.getElementById('search-btn').addEventListener('click', () => {
    const genre = document.getElementById('genre-input').value.trim();
    const timeFilter = document.getElementById('time-filter').value;

    if (!genre) {
        alert('Por favor, insira um gênero de jogo.');
        return;
    }

    fetchGames(genre, timeFilter);
});

async function fetchGames(genre, timeFilter) {
    const currentYear = new Date().getFullYear();
    let dateFilter;

    if (timeFilter === 'retro') {
        dateFilter = `-2003-01-01,2003-12-31`; // Mais de 20 anos (considerando 2024)
    } else {
        dateFilter = `2004-01-01,${currentYear}-12-31`; // Menos de 20 anos
    }

    try {
        const response = await fetch(`${API_URL}?genres=${genre}&dates=${dateFilter}&key=${API_KEY}`);
        const data = await response.json();
        displayGames(data.results);
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
    }
}

function displayGames(games) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (games.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum jogo encontrado para os critérios selecionados.</p>';
        return;
    }

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        const gameImage = game.background_image 
            ? `<img src="${game.background_image}" alt="${game.name}">` 
            : `<div style="height: 200px; background-color: #ccc;"></div>`;

        gameCard.innerHTML = `
            ${gameImage}
            <h3>${game.name}</h3>
            <p>Lançado em: ${new Date(game.released).getFullYear()}</p>
        `;

        resultsDiv.appendChild(gameCard);
    });
}
