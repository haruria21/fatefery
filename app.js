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
  const correctPassword = "りあなにもできない"; // 設定するパスワード

    if (password === correctPassword) {
      passwordScreen.style.display = "none";
      metaMaskScreen.style.display = "block";
    } else {
      passwordError.style.display = "block";

    }
   

  updateDaysApart();
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

      updateSavingsGoal(balanceAUD);

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

   // 記念日カウントダウン
   function updateCountdown(targetDate, elementId) {
    const today = new Date();
    const target = new Date(today.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    if (today > target) {
      target.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById(elementId).textContent = diffDays;
  }

  updateCountdown(new Date(2024, 2, 1), "haruCountdown"); // 3月1日
  updateCountdown(new Date(2024, 5, 3), "riaCountdown"); // 6月3日

  // あってない期間計算
  function updateDaysApart() {
    const lastMetDate = new Date(2024, 0, 14); // 1月14日
    const today = new Date();
    const diffTime = today - lastMetDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById("daysApart").textContent = diffDays;
  }

  updateDaysSinceLastMet();
  setInterval(updateDaysSinceLastMet, 86400000); // 1日に1回更新
  function updateAnniversaryCountdown() {
    const today = new Date();
    const anniversaryDate = new Date(today.getFullYear(), 11, 7); // 12月7日 (月は0始まり)
  
    if (today > anniversaryDate) {
      // 今年の記念日が過ぎた場合、翌年の記念日を設定
      anniversaryDate.setFullYear(today.getFullYear() + 1);
    }
  
    const timeDiff = anniversaryDate - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    document.getElementById("anniversaryCountdown").textContent = `${daysRemaining}日`;
  }
  
  // ページ読み込み時に実行 & 1日ごとに更新
  updateAnniversaryCountdown();
  setInterval(updateAnniversaryCountdown, 86400000);
  function updateRelationshipDays() {
    const today = new Date();
    const startDate = new Date(2021, 11, 7); // 2021年12月7日 (月は0始まり)
  
    const timeDiff = today - startDate;
    const daysTogether = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
    document.getElementById("relationshipDays").textContent = `${daysTogether}`;
  }
  
  // ページ読み込み時に実行 & 1日ごとに更新
  updateRelationshipDays();
  setInterval(updateRelationshipDays, 86400000);

  function updateSavingsGoal(currentSavings) {
    const goalAmount = 1000; // 目標額（AUD）
    const remainingAUD = goalAmount - currentSavings;
    document.getElementById("currentSavings").textContent = currentSavings.toFixed(2); // 現在の貯金額

    // 目標額までの残り金額を表示
    document.getElementById("remainingSavings").textContent = remainingAUD > 0 ? remainingAUD.toFixed(2) : "達成 🎉";
  }

  // ページ読み込み時に実行
  if (typeof window.ethereum !== "undefined") {
    ethereum.request({ method: "eth_accounts" }).then(accounts => {
      if (accounts.length > 0) {
        fetchAndDisplayBalance(accounts[0]); 
  }
  
});
}
  
function updateNextMeetingCountdown() {
  const today = new Date();
  const nextMeetingDate = new Date(today.getFullYear(), 11, 7, 0, 0, 0); // 12月7日 0時

  if (today > nextMeetingDate) {
      // 今年の再会日が過ぎた場合、翌年の再会日を設定
      nextMeetingDate.setFullYear(today.getFullYear() + 1);
  }

  function updateCountdown() {
      const now = new Date();
      const timeDiff = nextMeetingDate - now;

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      document.getElementById("nextMeetingCountdown").textContent = `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000); // 1秒ごとに更新
}

// ページ読み込み時に実行
updateNextMeetingCountdown();

});
