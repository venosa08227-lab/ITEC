// =====================================
// SAVED DATA
// =====================================

let selectedCharacter =
    localStorage.getItem("selectedCharacter") || "character1";

let playerName =
    localStorage.getItem("playerName") || "";

let level =
    Number(localStorage.getItem("level")) || 1;


// =====================================
// SCREEN ELEMENTS
// =====================================

const mainMenu =
    document.getElementById("mainMenu");

const characterScreen =
    document.getElementById("characterScreen");

const gameScreen =
    document.getElementById("gameScreen");


// =====================================
// MAIN MENU
// =====================================

const characterButton =
    document.getElementById("characterButton");

const playButton =
    document.getElementById("playButton");

const playerNameInput =
    document.getElementById("playerName");


// =====================================
// CHARACTER SCREEN
// =====================================

const backButton =
    document.getElementById("backButton");

const selectedCharacterText =
    document.getElementById("selectedCharacterText");

const characterButtons =
    document.querySelectorAll(".character");


// =====================================
// GAME SCREEN
// =====================================

const playerNameDisplay =
    document.getElementById("playerNameDisplay");

const levelDisplay =
    document.getElementById("levelDisplay");

const typingInput =
    document.getElementById("typingInput");

const hpFill = document.getElementById("hpFill");
const hpBar = document.getElementById("hpBar");
const enemyContainer = document.getElementById("enemyContainer");
const gameOverPanel = document.getElementById("gameOverPanel");
const restartButton = document.getElementById("restartButton");


// =====================================
// SETTINGS
// =====================================

const settingsButton =
    document.getElementById("settingsButton");

const settingsPanel =
    document.getElementById("settingsPanel");

const soundButton =
    document.getElementById("soundButton");

const homeButton =
    document.getElementById("homeButton");


// =====================================
// SOUND
// =====================================

let soundOn =
    localStorage.getItem("soundOn") !== "false";


// =====================================
// TEMPORARY CHARACTERS
// =====================================

const characters = {
    character1: "🟣",
    character2: "🔵",
    character3: "🟢"
};


// =====================================
// LOAD SAVED NAME
// =====================================

playerNameInput.value = playerName;


// =====================================
// CHARACTER BUTTON
// =====================================

characterButton.addEventListener("click", function () {

    mainMenu.classList.add("hidden");

    characterScreen.classList.remove("hidden");

});


// =====================================
// CHARACTER SELECTION
// =====================================

characterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        selectedCharacter =
            button.dataset.character;

        localStorage.setItem(
            "selectedCharacter",
            selectedCharacter
        );

        const characterName =
            button.querySelector("span").textContent;

        selectedCharacterText.textContent =
            "Selected: " + characterName;

    });

});


// =====================================
// BACK BUTTON
// =====================================

backButton.addEventListener("click", function () {

    characterScreen.classList.add("hidden");

    mainMenu.classList.remove("hidden");

});


// =====================================
// PLAY BUTTON
// =====================================

playButton.addEventListener("click", function () {

    const enteredName =
        playerNameInput.value.trim();

    if (enteredName === "") {

        playerNameInput.focus();

        return;

    }

    playerName = enteredName;

    localStorage.setItem(
        "playerName",
        playerName
    );

    localStorage.setItem(
        "level",
        level
    );

    playerNameDisplay.textContent =
        playerName;

    levelDisplay.textContent =
        "Lv. " + level;

    mainMenu.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    startGame();

    typingInput.focus();

});


// =====================================
// TYPING GAME
// =====================================

// =====================================
// SOUND BUTTON
// =====================================

function updateSoundButton() {

    if (soundOn) {

        soundButton.textContent =
            "🔊 SOUND ON";

    } else {

        soundButton.textContent =
            "🔇 SOUND OFF";

    }

}


updateSoundButton();


soundButton.addEventListener("click", function () {

    soundOn = !soundOn;

    localStorage.setItem(
        "soundOn",
        soundOn
    );

    updateSoundButton();

});


// =====================================
// ENEMY SYSTEM (SATAN & ANGEL)
// =====================================

const satanWords = [
    "pride",
    "fear",
    "anger",
    "greed",
    "idol"
];

const angelWords = [
    "hope",
    "love",
    "peace",
    "faith",
    "grace",
    "joy"
];

let activeEnemies = [];
const maxEnemies = 2;
const spawnLanes = ["20%", "50%"];

const startingHP = 3;
let hp = startingHP;
let gameRunning = false;
let nextEnemyTimer = null;


// =====================================
// FLOATING FEEDBACK
// =====================================

function showFloatingFeedback(text, type) {
    const feedback = document.createElement("div");
    feedback.className = `actionFeedback ${type}`;
    feedback.textContent = text;
    enemyContainer.appendChild(feedback);

    setTimeout(function () {
        feedback.remove();
    }, 900);
}


// =====================================
// ENEMY LIFECYCLE MANAGEMENT
// =====================================

function removeEnemy(enemy) {
    const index = activeEnemies.indexOf(enemy);
    if (index !== -1) {
        activeEnemies.splice(index, 1);
    }
    enemy.remove();
}

function clearAllEnemies() {
    activeEnemies.forEach(function (enemy) {
        enemy.remove();
    });
    activeEnemies = [];
}

function scheduleSpawn(delay = 1500) {
    clearTimeout(nextEnemyTimer);
    if (!gameRunning) return;

    nextEnemyTimer = setTimeout(function () {
        if (!gameRunning) return;

        if (activeEnemies.length < maxEnemies) {
            createEnemy();
        }

        // 여전히 자리가 남아있다면 다음 스폰 예약
        if (activeEnemies.length < maxEnemies) {
            scheduleSpawn(2000);
        }
    }, delay);
}


// =====================================
// CREATE ENEMY OR ANGEL
// =====================================

function createEnemy() {

    if (!gameRunning || activeEnemies.length >= maxEnemies) return;

    // 천사 등장 확률: 체력이 감소한 상태면 35%, 정상 상태면 25%
    const isAngel = Math.random() < (hp < startingHP ? 0.35 : 0.25);
    const entityType = isAngel ? "angel" : "satan";
    const wordPool = isAngel ? angelWords : satanWords;

    // 화면에 있는 적들의 단어와 겹치지 않게 선택
    const activeWords = activeEnemies.map(function (e) {
        return e.dataset.word.toLowerCase();
    });
    const availableWords = wordPool.filter(function (w) {
        return !activeWords.includes(w.toLowerCase());
    });
    const candidates = availableWords.length > 0 ? availableWords : wordPool;
    const selectedWord = candidates[Math.floor(Math.random() * candidates.length)];

    // 겹치지 않는 Y축 레인 선택
    const usedLanes = activeEnemies.map(function (e) {
        return e.dataset.lane;
    });
    const availableLanes = spawnLanes.filter(function (l) {
        return !usedLanes.includes(l);
    });
    const chosenLane = availableLanes.length > 0
        ? availableLanes[Math.floor(Math.random() * availableLanes.length)]
        : spawnLanes[Math.floor(Math.random() * spawnLanes.length)];

    const enemy = document.createElement("div");
    enemy.classList.add("enemy", entityType);

    enemy.dataset.type = entityType;
    enemy.dataset.word = selectedWord;
    enemy.dataset.lane = chosenLane;
    enemy.style.top = chosenLane;

    const characterEmoji = isAngel ? "👼" : "👿";

    enemy.innerHTML = `
        <div class="enemyWord">${selectedWord}</div>
        <div class="enemyCharacter">${characterEmoji}</div>
    `;

    enemyContainer.appendChild(enemy);
    activeEnemies.push(enemy);

    let hasDealtDamage = false;

    enemy.addEventListener("animationend", function () {
        if (!gameRunning || !activeEnemies.includes(enemy)) return;

        const currentType = enemy.dataset.type;
        removeEnemy(enemy);

        // 사탄이 플레이어에게 도착 시 1회만 HP 감소 (중복 데미지 방지)
        if (currentType === "satan" && !hasDealtDamage) {
            hasDealtDamage = true;
            reduceHP();
        }

        if (gameRunning) {
            scheduleSpawn(1200);
        }
    }, { once: true });

}


// =====================================
// TYPE WORD (SATAN OR ANGEL)
// =====================================

let isErrorAnimating = false;

function triggerTypingError() {
    if (isErrorAnimating) return;
    isErrorAnimating = true;

    typingInput.classList.add("inputError");

    setTimeout(function () {
        typingInput.value = "";
        typingInput.classList.remove("inputError");
        isErrorAnimating = false;
        if (gameRunning) {
            typingInput.focus();
        }
    }, 300);
}

typingInput.addEventListener("input", function () {

    if (!gameRunning || activeEnemies.length === 0 || isErrorAnimating) {
        return;
    }

    const typedWord =
        typingInput.value.trim().toLowerCase();

    // 활성화된 적 중 단어가 일치하는 대상 찾기
    const matchedEnemy = activeEnemies.find(function (e) {
        return e.dataset.word.toLowerCase() === typedWord;
    });

    if (matchedEnemy) {
        const entityType = matchedEnemy.dataset.type;

        removeEnemy(matchedEnemy);
        typingInput.value = "";

        if (entityType === "angel") {
            healHP(1);
            showFloatingFeedback("+1 HP HEALED! ✨", "heal");
        } else {
            showFloatingFeedback("DEFEATED! 💥", "defeat");
        }

        // 새로운 적 스폰 예약
        scheduleSpawn(1200);
    }

});

typingInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {
        e.preventDefault();

        if (!gameRunning || isErrorAnimating) {
            return;
        }

        const typedWord =
            typingInput.value.trim().toLowerCase();

        if (!typedWord) {
            return;
        }

        // 일치하는 적이 있는지 확인
        const matchedEnemy = activeEnemies.find(function (e) {
            return e.dataset.word.toLowerCase() === typedWord;
        });

        // 어떤 적과도 일치하지 않으면 빨간색 오타 피드백 후 지움
        if (!matchedEnemy) {
            triggerTypingError();
        }
    }

});


// =====================================
// GAME FLOW & HP
// =====================================

function updateHP() {
    hpFill.style.width = `${(hp / startingHP) * 100}%`;
    hpBar.setAttribute("aria-valuenow", String(hp));
    hpBar.setAttribute("aria-label", `HP ${hp} / ${startingHP}`);
    hpFill.classList.toggle("lowHP", hp === 1);
}

function healHP(amount = 1) {
    if (hp < startingHP) {
        hp = Math.min(startingHP, hp + amount);
        updateHP();
        hpBar.classList.add("healed");
        setTimeout(function () {
            hpBar.classList.remove("healed");
        }, 600);
    }
}

function startGame() {
    clearTimeout(nextEnemyTimer);
    clearAllEnemies();
    hp = startingHP;
    gameRunning = true;
    updateHP();
    gameOverPanel.classList.add("hidden");
    typingInput.disabled = false;
    isErrorAnimating = false;
    typingInput.classList.remove("inputError");
    typingInput.value = "";

    // 첫 번째 적 생성 후 잠시 뒤 두 번째 적 생성
    createEnemy();
    scheduleSpawn(2000);
}

function reduceHP() {
    hp = Math.max(0, hp - 1);
    updateHP();

    if (hp === 0) {
        gameRunning = false;
        clearTimeout(nextEnemyTimer);
        clearAllEnemies();
        typingInput.disabled = true;
        gameOverPanel.classList.remove("hidden");
        return;
    }
}

settingsButton.addEventListener("click", function () {
    settingsPanel.classList.toggle("hidden");
});

homeButton.addEventListener("click", function () {
    gameRunning = false;
    clearTimeout(nextEnemyTimer);
    clearAllEnemies();
    isErrorAnimating = false;
    typingInput.classList.remove("inputError");
    typingInput.value = "";
    gameScreen.classList.add("hidden");
    settingsPanel.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});

restartButton.addEventListener("click", function () {
    startGame();
    typingInput.focus();
});
