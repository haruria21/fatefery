// ── パスワード認証および表示/非表示切替 ──
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const passwordSubmit = document.getElementById("passwordSubmit");
const passwordError = document.getElementById("passwordError");
const passwordScreen = document.getElementById("passwordScreen");
const mainContent = document.getElementById("mainContent");

// 初期状態ではパスワード入力欄は type="text" なので文字が見えます
// トグルボタンで type 属性を切り替えます
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

// 送信ボタン：正しいパスワードならメインコンテンツを表示
passwordSubmit.addEventListener("click", function() {
  const enteredPassword = passwordInput.value;
  if (enteredPassword === "あのホテルは高い") {
    passwordScreen.style.display = "none";
    mainContent.style.display = "block";
  } else {
    passwordError.style.display = "block";
  }
});

// ── MetaMask連携と残高・送金機能 ──
let ethPriceInJPY = 0;
let ethPriceInAUD = 0;

// CoinGecko APIからETH価格を取得
async function fetchETHPrices() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=jpy,aud");
    const data = await response.json();
    ethPriceInJPY = data.ethereum.jpy;
    ethPriceInAUD = data.ethereum.aud;
  } catch (error) {
    console.error("ETH価格取得エラー:", error);
  }
}
fetchETHPrices();

// MetaMaskに接続してアカウント情報と残高を取得
async function connectMetamask() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      document.getElementById("accountAddress").innerText = `接続中: ${account}`;
      // ログイン後の各ボタン表示
      document.getElementById("loginButton").style.display = "none";
      document.getElementById("logoutButton").style.display = "inline-block";
      document.getElementById("receiveButton").style.display = "inline-block";
      document.getElementById("sendButton").style.display = "inline-block";
      fetchBalance(account);
      return account;
    } catch (error) {
      console.error("MetaMask接続失敗:", error);
      alert("MetaMask接続に失敗しました");
    }
  } else {
    alert("MetaMaskがインストールされていません。");
  }
}

// ログインボタン押下でMetaMask接続
document.getElementById("loginButton").addEventListener("click", connectMetamask);

// ログアウト処理：表示内容をリセット
document.getElementById("logoutButton").addEventListener("click", function() {
  document.getElementById("accountAddress").innerText = "未接続";
  document.getElementById("loginButton").style.display = "inline-block";
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("receiveButton").style.display = "none";
  document.getElementById("sendButton").style.display = "none";
  document.getElementById("sendForm").style.display = "none";
});

// 指定アカウントの残高を取得して表示
async function fetchBalance(account) {
  const web3 = new Web3(window.ethereum);
  const balanceWei = await web3.eth.getBalance(account);
  const balanceETH = web3.utils.fromWei(balanceWei, 'ether');
  document.getElementById("ethBalance").innerText = `ETH: ${balanceETH}`;
  document.getElementById("audBalance").innerText = `AUD: ${(balanceETH * ethPriceInAUD).toFixed(2)}`;
  document.getElementById("jpyBalance").innerText = `JPY: ${(balanceETH * ethPriceInJPY).toFixed(2)}`;
}

// 「受け取る」ボタン押下時：入金アドレスをアラート表示
document.getElementById("receiveButton").addEventListener("click", async function() {
  const account = await connectMetamask();
  if (account) {
    alert(`入金アドレス: ${account}`);
  }
});

// 「送金」ボタンで送金フォームを表示
document.getElementById("sendButton").addEventListener("click", function() {
  document.getElementById("sendForm").style.display = "block";
});

// 送金フォームの送金実行処理
document.getElementById("confirmSend").addEventListener("click", async function() {
  const recipient = document.getElementById("recipientAddress").value;
  const amount = document.getElementById("sendAmount").value;
  if (!recipient || !amount) {
    alert("送金先アドレスとETH数量を入力してください");
    return;
  }
  const web3 = new Web3(window.ethereum);
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const sender = accounts[0];
  try {
    await web3.eth.sendTransaction({
      from: sender,
      to: recipient,
      value: web3.utils.toWei(amount, 'ether')
    });
    alert("送金成功！");
  } catch (error) {
    console.error("送金失敗:", error);
    alert("送金に失敗しました");
  }
});
