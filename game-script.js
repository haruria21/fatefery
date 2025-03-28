const player = document.getElementById("player");
const coins = document.querySelectorAll(".coin");
const goal = document.getElementById("goal");
const clearBox = document.getElementById("clearBox");
const memoryText = document.getElementById("memoryText");
const nextStageBtn = document.getElementById("nextStageBtn");
const introBox = document.getElementById("introBox");
const startBtn = document.getElementById("startBtn");
const haruCounter = document.getElementById("haruCounter");
const coinMessage = document.getElementById("coinMessage");


let collectedCoinIds = JSON.parse(localStorage.getItem("collectedCoins") || "[]");


// 最初にコインを非表示にする
coins.forEach(coin => {
  const coinId = coin.dataset.id;
  if (collectedCoinIds.includes(coinId)) {
    coin.classList.add("collected");
    coin.style.display = "none";
  }
});

// haruカウントをローカルから取得
let haruCount = parseInt(localStorage.getItem("haruCount") || "0");
if (haruCounter) {
  haruCounter.textContent = `haru: ${haruCount}`;
}

let x = 100;
let y = window.innerHeight / 2;
const speed = 5;
let gameStarted = false;


const keys = { w: false, a: false, s: false, d: false };

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false;
});

const stageMap = {
  "game.html": "game2.html",
  "game2.html": "game3.html",
  "game3.html": "game4.html",
  "game4.html": null
};

const memoryPerStage = {
  "game.html": "✈️ パースの空を初めて飛んだ！",
  "game2.html": "🇸🇬 シンガポールのビルの間をうまく抜けた！",
  "game3.html": "🛬 関西空港にうまく着地できた！",
  "game4.html": "🏙️ 大阪の空を気持ちよく飛べた！"
};

function getStageFilename() {
  const path = location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function getNextStage() {
  const file = getStageFilename();
  return stageMap[file] || null;
}

function showClearScreen() {
  gameStarted = false;
  const file = getStageFilename();
  const memory = memoryPerStage[file] || "このステージをクリアした！";
  memoryText.textContent = "僕の思い出：" + memory;
  clearBox.style.display = "flex";
  localStorage.setItem(file + "_cleared", "true");
}


nextStageBtn.addEventListener("click", () => {
  const next = getNextStage();
  if (next) {
    window.location.href = next;
  } else {
    alert("🎊 全ステージクリア！思い出をありがとう！");
  }
});

if (startBtn) {
  startBtn.addEventListener("click", () => {
    introBox.style.display = "none";
    gameStarted = true;
    gameLoop();
  });
}

function checkCollision(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function gameLoop() {
  if (!gameStarted) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // 仮の移動先を計算
  let nextX = x;
  let nextY = y;

  if (keys.w) nextY -= speed;
  if (keys.s) nextY += speed;
  if (keys.a) nextX -= speed;
  if (keys.d) nextX += speed;

  // 仮移動して判定
  player.style.left = nextX + "px";
  player.style.top = nextY + "px";
  const playerRect = player.getBoundingClientRect();

  // 障害物との衝突をチェック
  let blocked = false;
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach(ob => {
    const obsRect = ob.getBoundingClientRect();
    if (checkCollision(playerRect, obsRect)) {
      blocked = true;
    }
  });

  // 実移動（衝突がない場合）
  if (!blocked) {
    x = nextX;
    y = nextY;
  }

  // 表示更新
  player.style.left = x + "px";
  player.style.top = y + "px";

  // コイン取得処理
  coins.forEach((coin) => {
    const coinId = coin.dataset.id;
    const coinRect = coin.getBoundingClientRect();

    if (
      !coin.classList.contains("collected") &&
      !collectedCoinIds.includes(coinId) &&
      checkCollision(playerRect, coinRect)
    ) {
      coin.classList.add("collected");
      coin.style.display = "none";
      haruCount++;
      localStorage.setItem("haruCount", haruCount);
      haruCounter.textContent = `haru: ${haruCount}`;

      // IDを保存
      collectedCoinIds.push(coinId);
      localStorage.setItem("collectedCoins", JSON.stringify(collectedCoinIds));

      const memoryMsg = coin.dataset.memory;
      if (memoryMsg && coinMessageText && coinMessage) {
        coinMessageText.textContent = memoryMsg;
        coinMessage.style.display = "flex";
      }
    }
  });
  if (closeCoinMsg) {
    closeCoinMsg.addEventListener("click", () => {
      coinMessage.style.display = "none";
    });
  }

  function checkCollision(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }
  
  
  // ゴール出現条件
  const remainingCoins = document.querySelectorAll(".coin:not(.collected)");
  if (remainingCoins.length === 0) {
    goal.style.display = "block";
  }

  // ゴールとの衝突
  const goalRect = goal.getBoundingClientRect();
  if (goal.style.display === "block" && checkCollision(playerRect, goalRect)) {
    showClearScreen();
  }

  requestAnimationFrame(gameLoop);
}


if (goal) {
  goal.addEventListener("click", () => {
    if (goal.style.display === "block") {
      showClearScreen();
    }
  });
}


function goBackStage() {
  const file = getStageFilename();
  const backMap = {
    "game2.html": "game.html",
    "game3.html": "game2.html",
    "game4.html": "game3.html",
    "game.html": "index2.html" // 最初のステージはタイトルへ戻る
  };
  const back = backMap[file];
  if (back) {
    window.location.href = back;
  } else {
    alert("これ以上戻れません");
  }
}

function showClearScreen() {
  gameStarted = false;
  const file = getStageFilename();
  const memory = memoryPerStage[file] || "このステージをクリアした！";
  memoryText.textContent = "僕の思い出：" + memory;
  clearBox.style.display = "flex";

  // ✅ クリアフラグ保存
  localStorage.setItem(file + "_cleared", "true");
}


// 🔁 リセットボタンの機能
const resetBtn = document.getElementById("resetHaruBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (confirm("コインをリセットしますか？")) {
      localStorage.removeItem("haruCount");
      localStorage.removeItem("collectedCoins");
      location.reload(); // 再読み込みで反映
    }
  });
}
nextStageBtn.addEventListener("click", () => {
  const next = getNextStage();
  if (next) {
    window.location.href = next;
  } else {
    window.location.href = "ending.html"; // ← ここを追加
  }
});

