// ── 要素の取得 ──
const passwordInput   = document.getElementById("passwordInput");
const togglePassword  = document.getElementById("togglePassword");
const passwordSubmit  = document.getElementById("passwordSubmit");
const passwordError   = document.getElementById("passwordError");
const passwordScreen  = document.getElementById("passwordScreen");

const metaMaskScreen  = document.getElementById("metaMaskScreen");
const connectMetaMask = document.getElementById("connectMetaMask");
const metaMaskError   = document.getElementById("metaMaskError");

const mainContent     = document.getElementById("mainContent");
const balanceDisplay  = document.getElementById("balanceDisplay");

// ── パスワード表示/非表示切替 ──
togglePassword.addEventListener("click", function() {
  const currentType = passwordInput.getAttribute("type");
  if (currentType === "text") {
    passwordInput.setAttribute("type", "password");
    togglePassword.textContent = "表示にする";
  } else {
    passwordInput.setAttribute("type", "text");
    togglePassword.textContent = "非表示にする";
  }
});

// ── パスワード認証 ──
passwordSubmit.addEventListener("click", function() {
  const enteredPassword = passwordInput.value;
  if (enteredPassword === "繋がってうれしいね") {
    // 正しいパスワードなら、パスワード画面を隠し、MetaMask連携画面を表示
    passwordScreen.style.display = "none";
    metaMaskScreen.style.display = "block";
  } else {
    passwordError.style.display = "block";
  }
});

// ── 許可された MetaMask アカウント管理 ──
// 初回連携時に連携したアカウントを allowedAccount として保存し、以降は同じアカウントのみ利用可能にします
let allowedAccount = localStorage.getItem("allowedAccount") || null;

// ── MetaMask連携 ──
connectMetaMask.addEventListener("click", async function() {
  metaMaskError.style.display = "none"; // エラー表示初期化

  if (typeof window.ethereum === 'undefined') {
    metaMaskError.textContent = "MetaMaskがインストールされていません。";
    metaMaskError.style.display = "block";
    return;
  }
  
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      metaMaskError.textContent = "アカウントが見つかりません。";
      metaMaskError.style.display = "block";
      return;
    }
    
    const connectedAccount = accounts[0];
    
    // 初回連携の場合は、連携したアカウントを許可アカウントとして記録
    if (!allowedAccount) {
      allowedAccount = connectedAccount;
      localStorage.setItem("allowedAccount", allowedAccount);
    }
    
    // 許可されたアカウントがあれば、接続されたアカウントと比較
    if (allowedAccount.toLowerCase() !== connectedAccount.toLowerCase()) {
      metaMaskError.textContent = "このアカウントは許可されていません。最初に連携したアカウントのみ利用可能です。";
      metaMaskError.style.display = "block";
      return;
    }
    
    // 連携成功なら、MetaMask連携画面を隠してメインコンテンツを表示
    metaMaskScreen.style.display = "none";
    mainContent.style.display = "block";
    
    // 連携されたアカウントの残高を取得して右上に表示
    fetchAndDisplayBalance(connectedAccount);
    
    // 日記エントリーを読み込み
    loadDiaryEntries();
    
  } catch (error) {
    metaMaskError.textContent = "MetaMaskとの連携に失敗しました。";
    metaMaskError.style.display = "block";
    console.error("MetaMask連携エラー:", error);
  }
});

// ── 残高表示 ──
// CoinGecko APIからETHのAUDおよびJPY換算レートを取得
async function fetchETHPrices() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=jpy,aud");
    const data = await response.json();
    return { jpy: data.ethereum.jpy, aud: data.ethereum.aud };
  } catch (error) {
    console.error("ETH価格取得エラー:", error);
    return { jpy: 0, aud: 0 };
  }
}

// 指定アカウントの残高を取得し、右上の balanceDisplay に表示する
async function fetchAndDisplayBalance(account) {
  try {
    const web3 = new Web3(window.ethereum);
    const balanceWei = await web3.eth.getBalance(account);
    const balanceETH = web3.utils.fromWei(balanceWei, 'ether');
    const prices = await fetchETHPrices();
    const balanceAUD = balanceETH * prices.aud;
    const balanceJPY = balanceETH * prices.jpy;
    
    balanceDisplay.innerHTML = `
      <p>💎 ETH: ${parseFloat(balanceETH).toFixed(4)}</p>
      <p>💰 AUD: ${parseFloat(balanceAUD).toFixed(2)}</p>
      <p>💴 JPY: ${parseFloat(balanceJPY).toFixed(2)}</p>
    `;
  } catch (error) {
    console.error("残高表示エラー:", error);
    balanceDisplay.innerText = "残高取得失敗";
  }
}

// ── 毎日の日記機能 ──

// 日記エントリーの読み込み
function loadDiaryEntries() {
  const diaryEntriesContainer = document.getElementById("diaryEntries");
  diaryEntriesContainer.innerHTML = "";
  const storedDiary = localStorage.getItem("diaryEntries");
  let diaryEntries = storedDiary ? JSON.parse(storedDiary) : [];
  
  diaryEntries.forEach((entry, index) => {
    const entryDiv = document.createElement("div");
    entryDiv.className = "diaryEntry";
    entryDiv.innerHTML = `
      <p><strong>${entry.date}</strong></p>
      <p>${entry.text}</p>
      <button class="deleteEntry" onclick="deleteDiaryEntry(${index})">消す</button>
    `;
    diaryEntriesContainer.appendChild(entryDiv);
  });
}

// 日記削除関数
function deleteDiaryEntry(index) {
  const storedDiary = localStorage.getItem("diaryEntries");
  let diaryEntries = storedDiary ? JSON.parse(storedDiary) : [];
  diaryEntries.splice(index, 1);
  localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  loadDiaryEntries();
}

// 日記保存ボタンの処理
document.getElementById("saveDiary").addEventListener("click", function() {
  const diaryText = document.getElementById("diaryEntry").value.trim();
  if (!diaryText) {
    alert("日記の内容を入力してください");
    return;
  }
  
  const newEntry = {
    date: new Date().toLocaleString(),
    text: diaryText
  };
  
  let diaryEntries = [];
  const storedDiary = localStorage.getItem("diaryEntries");
  if (storedDiary) {
    diaryEntries = JSON.parse(storedDiary);
  }
  
  diaryEntries.push(newEntry);
  localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  
  document.getElementById("diaryEntry").value = "";
  loadDiaryEntries();
});
