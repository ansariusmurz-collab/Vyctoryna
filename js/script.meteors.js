/* ========================================================== */
/* ЛОГИКА ВЫБОРА ПЛАНЕТ, ПОЛЕТА РАКЕТЫ И МЕТЕОРОВ (script.meteors.js) */
/* ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const planetCards = document.querySelectorAll('.planet-card');
    const meteorElements = document.querySelectorAll('.meteor-wrapper');
    const currentPlanetTitle = document.getElementById('current-planet-title');
    const btnBackToPlanets = document.getElementById('btn-back-to-planets');
    const explosionEffect = document.getElementById('explosion-effect');
    const rocket = document.getElementById('space-rocket');
    const categoriesContainer = document.querySelector('.categories-container');

    let selectedCategoryKey = null;
    let isRocketFlying = false;

    // Названия планет для заголовков
    const planetTitles = {
        saturn: 'Сатурн — Русский язык',
        earth: 'Земля — Окружающий мир',
        venus: 'Венера — Литература',
        jupiter: 'Юпитер — Математика'
    };

    // 1. Клик по планете на экране космоса
    planetCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (isRocketFlying) return;
            isRocketFlying = true;

            selectedCategoryKey = card.getAttribute('data-category');
            window.gameState.currentCategory = selectedCategoryKey;

            // Вычисляем координаты планеты для прямого полета ракеты
            const cardRect = card.getBoundingClientRect();
            const containerRect = categoriesContainer.getBoundingClientRect();
            
            const targetX = cardRect.left + cardRect.width / 2 - containerRect.left;
            const targetY = containerRect.bottom - (cardRect.top + cardRect.height / 2);

            if (rocket) {
                rocket.style.setProperty('--target-x', `${targetX}px`);
                rocket.style.setProperty('--target-y', `${targetY}px`);

                rocket.classList.remove('hidden');
                rocket.classList.add('flying');
            }

            // Когда ракета долетела (через 1 сек) — запускаем приближение (зум) экрана
            setTimeout(() => {
                if (rocket) rocket.classList.remove('flying');
                if (categoriesContainer) categoriesContainer.classList.add('zoom-in');

                // Через 0.5 секунды зума — переключаем экран на выбор сложности
                setTimeout(() => {
                    if (categoriesContainer) categoriesContainer.classList.remove('zoom-in');
                    if (rocket) rocket.classList.add('hidden');
                    isRocketFlying = false;

                    if (currentPlanetTitle) {
                        currentPlanetTitle.textContent = `Приземление на планету: ${planetTitles[selectedCategoryKey] || 'Космос'}`;
                    }

                    window.switchScreen('screen-game');

                }, 500);

            }, 1000);
        });
    });

    // Кнопка возврата к выбору планет
    if (btnBackToPlanets) {
        btnBackToPlanets.addEventListener('click', () => {
            window.switchScreen('screen-categories');
        });
    }

    // 2. Клик по метеору сложности (10-50 очков)
    meteorElements.forEach(meteor => {
        meteor.addEventListener('click', () => {
            const points = parseInt(meteor.getAttribute('data-points')) || 10;

            if (explosionEffect) {
                explosionEffect.classList.remove('hidden');
            }

            const category = selectedCategoryKey || window.gameState.currentCategory;

            setTimeout(() => {
                if (explosionEffect) {
                    explosionEffect.classList.add('hidden');
                }

                if (typeof window.loadQuestion === 'function') {
                    window.loadQuestion(category, points);
                } else {
                    console.error('Ошибка: функция loadQuestion не найдена!');
                }

            }, 700);
        });
    });
});