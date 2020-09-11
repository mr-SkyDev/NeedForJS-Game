const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div');

car.classList.add('car');

start.addEventListener('click', startGame); // Начинаем игру
document.addEventListener('keydown', startRun); // Начинаем движение авто
document.addEventListener('keyup', stopRun); // Прекращаем движение авто


const keys= {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    ' ': false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    nitro: false,
    traffic: 3
};


function getQuantityElements(heightElement) {
    return Math.round(document.documentElement.clientHeight / heightElement) + 1;
}

function startGame() {
    start.classList.add('hide');

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px'; // Расстояние между линиями. Зачем мы умнажаем на i? Сперва у нас i == 0, => расстояние от вершины будет 0. Далее i == 1, => расстояние от врешины будет 100. То есть мы каждый элемент(line), которых всего 20, расставляем на расстоянии 50px(100 - высота самой линии). Я это написал тк сам не сразу понял)
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    
    for (let i= 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.round((Math.random() * (gameArea.offsetWidth - 50))) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = "transparent url(image/enemy.png) center / cover no-repeat";
        gameArea.appendChild(enemy);
    }

    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft; // Те 125px в файле-css 
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        moveRoad();
        moveEnemy();

        if (keys.ArrowLeft && setting.x > 0) {
                setting.x -= setting.speed; // Если кнопка влево зажата, то поворачиваем влево
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
                setting.x += setting.speed; // Если кнопка вправо зажата, то поворачиваем вправо   
        }
        if (keys.ArrowUp && setting.y > 0) {
                if (keys[' ']) {
                    setting.y -= 2;
                } 
                setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            // if (setting.y > gameArea.style.height) {
            setting.y += setting.speed + 1;
            // }
        } 
        car.style.top = setting.y + 'px';
        car.style.left = setting.x + 'px'; // Меняем стили .car, точнее его растояние от левой границы(left)
        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    if(event.key !== 'F5' && event.key !== 'F12') {
        event.preventDefault();
        keys[event.key] = true;
    }
}

function stopRun(event) {
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach( line => {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= document.documentElement.clientHeight) { // Получаем высоту страницы
            line.y = -100; // Если линий уже не видно на странице, то мы их перенесем наверх
        }
    });
}

function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach( enemy => {
        enemy.y += setting.speed / 1.5;
        enemy.style.top = enemy.y + 'px';

        if (enemy.y >= document.documentElement.clientHeight) {
            enemy.y = -100 * setting.traffic;
            enemy.style.left = Math.round((Math.random() * (gameArea.offsetWidth - 50))) + 'px';
        }
    });
}
