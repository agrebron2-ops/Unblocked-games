// --- CONFIGURATION ---
// Add your games here. 
// Type 'html' expects a path to a folder/file.
// Type 'swf' expects a path to a .swf file.
const games = [
    { title: "Javascript Minecraft", type: "html", path: "minecraft.html", thumb: "thumbs/plat.jpg" },
    { title: "Fancy RPG", type: "html", path: "games/rpg/index.html", thumb: "thumbs/rpg.jpg" },
    { title: "Old School Flash", type: "swf", path: "games/flash/alien.swf", thumb: "thumbs/alien.jpg" },
    { title: "Stick Figure Fight", type: "swf", path: "games/flash/fight.swf", thumb: "thumbs/fight.jpg" },
    // You can add infinite games here...
];

const grid = document.getElementById('gameGrid');
const searchInput = document.getElementById('searchBar');
const modal = document.getElementById('gameModal');
const container = document.getElementById('playerContainer');
const modalTitle = document.getElementById('modalTitle');

// 1. Render Games to the Grid
function renderGames(filterText = "") {
    grid.innerHTML = ""; // Clear current grid
    
    const filtered = games.filter(g => 
        g.title.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        // Using a generic placeholder image if you don't have thumbs yet
        const img = game.thumb ? game.thumb : 'https://via.placeholder.com/200x120?text=Game';
        
        card.innerHTML = `
            <img src="${img}" class="game-thumb" alt="${game.title}">
            <h3>${game.title}</h3>
            <small>${game.type.toUpperCase()}</small>
        `;
        
        card.onclick = () => loadGame(game);
        grid.appendChild(card);
    });
}

// 2. Load Game (HTML or SWF)
function loadGame(game) {
    modalTitle.innerText = game.title;
    container.innerHTML = ""; // Clear previous game
    modal.classList.remove('hidden');

    if (game.type === 'html') {
        // Load HTML5 Game via Iframe
        const iframe = document.createElement('iframe');
        iframe.src = game.path;
        iframe.allow = "fullscreen; autoplay";
        container.appendChild(iframe);
    } else if (game.type === 'swf') {
        // Load Flash Game via Ruffle
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        container.appendChild(player);
        player.load(game.path);
    }
}

// 3. Close Game
function closeGame() {
    modal.classList.add('hidden');
    container.innerHTML = ""; // Stop the game from running in background
}

// 4. Shuffle Flash Games
function shuffleFlash() {
    const flashGames = games.filter(g => g.type === 'swf');
    if (flashGames.length > 0) {
        const randomGame = flashGames[Math.floor(Math.random() * flashGames.length)];
        loadGame(randomGame);
    } else {
        alert("No Flash games found in the list!");
    }
}

// 5. Fullscreen Logic
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Event Listeners
searchInput.addEventListener('input', (e) => renderGames(e.target.value));

// Initial Render
renderGames();
