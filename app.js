document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");
  const passwordSubmit = document.getElementById("passwordSubmit");
  const passwordError = document.getElementById("passwordError");
  const passwordScreen = document.getElementById("passwordScreen");

  const metaMaskScreen = document.getElementById("metaMaskScreen");
  const connectMetaMask = document.getElementById("connectMetaMask");
  const metaMaskError = document.getElementById("metaMaskError");

  const mainContent = document.getElementById("mainContent");
  const balanceDisplay = document.getElementById("balanceDisplay");

  // パスワード表示/非表示切替
  togglePassword.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    togglePassword.textContent = passwordInput.type === "password" ? "表示" : "非表示";
  });

  // パスワード認証
  passwordSubmit.addEventListener("click", () => {
    const password = passwordInput.value;
    const correctPassword = "つながってうれしいね"; // 設定するパスワード

    if (password === correctPassword) {
      passwordScreen.style.display = "none";
      metaMaskScreen.style.display = "block";
    } else {
      passwordError.style.display = "block";
    }
  });

  // MetaMask連携
  connectMetaMask.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      metaMaskError.textContent = "MetaMaskがインストールされていません。";
      metaMaskError.style.display = "block";
      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      metaMaskScreen.style.display = "none";
      mainContent.style.display = "block";
      fetchAndDisplayBalance(account);
      document.querySelectorAll(".small-icon").forEach(img => img.style.display = "block"); // 画像を表示
    } catch (error) {
      metaMaskError.textContent = "MetaMaskとの連携に失敗しました。";
      metaMaskError.style.display = "block";
    }
  });

  async function fetchAndDisplayBalance(account) {
    try {
      const web3 = new Web3(window.ethereum);
      const balanceWei = await web3.eth.getBalance(account);
      const balanceETH = web3.utils.fromWei(balanceWei, "ether");
      const prices = await fetchETHPrices();
      const balanceAUD = balanceETH * prices.aud;
      const balanceJPY = balanceETH * prices.jpy;
      
      balanceDisplay.innerHTML = `
        <p>💎 ETH: ${parseFloat(balanceETH).toFixed(4)}</p>
        <p>💰 AUD: ${parseFloat(balanceAUD).toFixed(2)}</p>
        <p>💴 JPY: ${parseFloat(balanceJPY).toFixed(2)}</p>
      `;
    } catch (error) {
      console.error("残高取得に失敗しました:", error);
    }
  }

  async function fetchETHPrices() {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=jpy,aud");
      const data = await response.json();
      return { jpy: data.ethereum.jpy, aud: data.ethereum.aud };
    } catch (error) {
      console.error("価格取得に失敗しました:", error);
      return { jpy: 0, aud: 0 };
    }
  }
  function updateDaysSinceLastMet() {
    const lastMetDate = new Date("2025-01-14");
    const today = new Date();
    const timeDiff = today - lastMetDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    document.getElementById("daysSinceLastMet").innerHTML = `💔 会えていない日数: <strong>${daysDiff}日</strong>`;
  }

  updateDaysSinceLastMet();
  setInterval(updateDaysSinceLastMet, 86400000); // 1日に1回更新
});
