/* ========================================================== */
/* УПРАВЛЕНИЕ СОСТОЯНИЕМ ИГРЫ (game.state.js)                 */
/* ========================================================== */

class GameState {
    constructor() {
        this.players = [];          // Массив игроков [{name: "Игрок 1", score: 0}, ...]
        this.currentPlayerIndex = 0; // Индекс текущего игрока
        this.currentCategory = null; // Выбранная планета/категория ("saturn", "earth", etc.)
        this.currentPoints = 0;     // Выбранная сложность метеора (10, 20, 30, 40, 50)
    }

    // Добавить игрока
    addPlayer(name) {
        const trimmedName = name.trim();
        if (trimmedName) {
            this.players.push({ name: trimmedName, score: 0 });
        }
    }

    // Получить текущего игрока
    getCurrentPlayer() {
        if (this.players.length === 0) return { name: "Гость", score: 0 };
        return this.players[this.currentPlayerIndex];
    }

    // Перейти к следующему игроку
    nextPlayer() {
        if (this.players.length > 0) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
    }

    // Начислить очки текущему игроку
    addPointsToCurrent(points) {
        if (this.players.length > 0) {
            this.players[this.currentPlayerIndex].score += points;
        }
    }

    // Сбросить состояние для новой игры
    reset() {
        this.currentPlayerIndex = 0;
        this.currentCategory = null;
        this.currentPoints = 0;
        this.players.forEach(p => p.score = 0);
    }
}

// Создаем глобальный объект состояния игры, доступный для остальных скриптов
window.gameState = new GameState();