/* ========================================================== */
/* ЛОГИКА ВОПРОСОВ, ОТВЕТОВ И НАЧИСЛЕНИЯ ОЧКОВ (script.question.js) */
/* ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const questionTextEl = document.getElementById('question-text');
    const answerButtons = document.querySelectorAll('.answer-btn');
    const questionPointsBadge = document.getElementById('q-points');
    const questionCategoryBadge = document.getElementById('question-category-badge');

    let currentQuestionData = null;
    let categoryQuestionsPool = {}; // Для отслеживания уже использованных вопросов по категориям

    // Функция загрузки и показа вопроса
    window.loadQuestion = function(category, points) {
        window.gameState.currentCategory = category;
        window.gameState.currentPoints = points;

        // Обновляем бейдж очков вверху вопроса
        if (questionPointsBadge) questionPointsBadge.textContent = points;
        if (questionCategoryBadge) {
            const titles = { saturn: 'Сатурн (Русский язык)', earth: 'Земля (Окр. мир)', venus: 'Венера (Литература)', jupiter: 'Юпитер (Математика)' };
            questionCategoryBadge.textContent = titles[category] || category;
        }

        // Берем пул вопросов из глобальной базы
        const allCatQuestions = window.quizQuestions[category] || [];
        
        // Выбираем случайный вопрос
        if (allCatQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * allCatQuestions.length);
            currentQuestionData = allCatQuestions[randomIndex];

            // Заполняем текст вопроса
            if (questionTextEl) questionTextEl.textContent = currentQuestionData.question;

            // Заполняем варианты ответов
            answerButtons.forEach((btn, index) => {
                btn.textContent = currentQuestionData.answers[index];
                btn.classList.remove('correct', 'wrong');
                btn.disabled = false;
            });
        } else {
            if (questionTextEl) questionTextEl.textContent = "Вопросы в этой категории закончились!";
        }

        // Переключаемся на экран вопроса
        window.switchScreen('screen-question');
    };

    // Обработка клика по варианту ответа
    answerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedIndex = parseInt(e.target.getAttribute('data-index'));
            const correctIndex = currentQuestionData.correct;

            // Отключаем все кнопки, чтобы нельзя было нажать повторно
            answerButtons.forEach(b => b.disabled = true);

            if (selectedIndex === correctIndex) {
                // Правильный ответ!
                e.target.classList.add('correct');
                window.gameState.addPointsToCurrent(window.gameState.currentPoints);
            } else {
                // Неправильный ответ
                e.target.classList.add('wrong');
                answerButtons[correctIndex].classList.add('correct'); // Подсвечиваем правильный
            }

            // Через 2 секунды переходим дальше
            setTimeout(() => {
                // Передаем ход следующему игроку
                window.gameState.nextPlayer();

                // Проверяем условие окончания игры (например, если все игроки сходили определенное число раз, или просто возвращаем к выбору планет)
                // Для учебной викторины после каждого вопроса возвращаем к выбору планет (или можно сделать проверку на конец игры)
                
                // Проверим, не пора ли на экран победы (например, после 8-12 раундов или по клику, но пока возвращаем к планетам)
                const totalScore = window.gameState.players.reduce((sum, p) => sum + p.score, 0);
                
                // Пример: если суммарно набрали много очков или сыграли достаточно — можно на экран победы. 
                // Для гибкости сделаем переход к победе через кнопку или когда пройдено много вопросов. 
                // А пока возвращаем на экран выбора планет:
                window.switchScreen('screen-categories');

            }, 2000);
        });
    });

    // Функция генерации таблицы лидеров на экране победы
    window.renderLeaderboard = function() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;

        leaderboardList.innerHTML = '';

        // Сортируем игроков по очкам (по убыванию)
        const sortedPlayers = [...window.gameState.players].sort((a, b) => b.score - a.score);

        sortedPlayers.forEach((player, index) => {
            const li = document.createElement('li');
            li.className = 'leaderboard-item';
            
            let rankIcon = `${index + 1}.`;
            if (index === 0) rankIcon = '🥇';
            if (index === 1) rankIcon = '🥈';
            if (index === 2) rankIcon = '🥉';

            li.innerHTML = `
                <span><b class="player-rank">${rankIcon}</b> ${player.name}</span>
                <span class="player-score-badge">${player.score} очков</span>
            `;
            leaderboardList.appendChild(li);
        });
    };
});