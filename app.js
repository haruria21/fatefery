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

  const dateInput = document.getElementById("dateInput");
      const scoreInput = document.getElementById("scoreInput");
      const addScoreButton = document.getElementById("addScoreButton");
      const scoreList = document.getElementById("scoreList");
      

  // パスワード表示/非表示切替
  togglePassword.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    togglePassword.textContent = passwordInput.type === "password" ? "表示" : "非表示";
  });

  // パスワード認証
  passwordSubmit.addEventListener("click", () => {
    const password = passwordInput.value;
  const correctPassword = "制服ほしい"; // 設定するパスワード

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

  const quizContainer = document.getElementById("quiz");
  const submitButton = document.getElementById("submit");
  const closeButton = document.getElementById("closeQuiz");
  const resultContainer = document.getElementById("result");
  const scoreHistoryContainer = document.getElementById("scoreHistory");

    const quizData = [
        { 
            question: "はるのきげんは？？", 
            options: ["いい", "とてもいい", "すごくいい！"], 
            answer: "すごくいい！" 
        },
        { 
            question: "それはなぜ？", 
            options: ["よくねた", "きのううれしいがきもいいだったから", "いまりあとはなしてるから"], 
            answer: "きのううれしいがきもいいだったから" 
        },
        { 
            question: "はるはたんじょうびになにほしい", 
            options: ["りあがくれたもの", "ふつうのプレゼント", "くるま"], 
            answer: "ネギをいっぱい入れたうどん" 
        },
        { 
            question: "どれがいちばんすき", 
            options: ["せいふくとくろいの", "おいしいあさごはん", "よくねれたひ"], 
            answer: "せいふくとくろいの" 
        },
        { 
            question: "はるのすきなものは", 
            options: ["めいくをみてるとき", "いっしょにプリズンブレイクを全部見る", "あさおきてでんわしたらりあのこえがあるとき"], 
            answer: "あさおきてでんわしたらりあのこえがあるとき" 
        }
    ];

    function buildQuiz() {
        quizContainer.innerHTML = "";
        quizData.forEach((q, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("quiz-question");
            questionDiv.innerHTML = `<p><strong>${index + 1}. ${q.question}</strong></p>`;

            q.options.forEach(option => {
                const optionId = `q${index}_${option}`;
                const label = document.createElement("label");
                label.setAttribute("for", optionId);
                label.innerHTML = `<input type="radio" id="${optionId}" name="q${index}" value="${option}"> ${option}`;
                questionDiv.appendChild(label);
                questionDiv.appendChild(document.createElement("br")); // 改行
            });

            quizContainer.appendChild(questionDiv);
        });
    }

    const contractAddress = "0xd2c8dbfe2CBB067B1Da646D58BE6a8d9239bdBCF"; // HARU トークンのコントラクトアドレス
    const haruWallet = "0x073BAee27903de0EC8016CAf82F2EFD975168F1C"; // ここにHARUが入るウォレットアドレスを指定
    
    [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "initialOwner",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "allowance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_winner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_correctAnswers",
            "type": "uint256"
          }
        ],
        "name": "rewardWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "getUserScore",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "userScores",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
    

// 🔹 ウォレットのHARU残高を取得して表示





    function checkAnswers() {
      let correctAnswers = 0;
  
      quizData.forEach((q, index) => {
          const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
          if (selectedOption) {
              if (selectedOption.value === q.answer) {
                  correctAnswers++;
                  selectedOption.parentElement.style.color = "green"; // 正解は緑
              } else {
                  selectedOption.parentElement.style.color = "red"; // 不正解は赤
              }
              document.querySelectorAll(`input[name="q${index}"]`).forEach(input => {
                  input.disabled = true;
              });
          }
      });
  
      // 🔹 `rewardUser()` を実行（クイズ終了後にHARUを配布）
      if (typeof rewardUser === "function") {
          rewardUser(correctAnswers)
              .then(() => {
                  document.getElementById("distributedTotal").innerText = `こんかいもらう: ${correctAnswers} HARU`;
                  updateWalletBalance(); // 🔹 ウォレットのHARU残高を更新
              })
              .catch(error => {
                  console.error("❌ トークン送信エラー:", error);
              });
      } else {
          console.error("❌ `rewardUser()` が見つかりません！");
      }
  
      const formattedDate = `${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}/${new Date().getDate().toString().padStart(2, "0")}`;
      
      resultContainer.innerText = `あなたのスコア: ${correctAnswers}/${quizData.length}`;
      closeButton.style.display = "inline-block";
  }
  
    
      
        function addScoreToHistory(date, score) {
        const listItem = document.createElement("p");
        listItem.textContent = `${date}  ${score}点`;
        scoreHistoryContainer.appendChild(listItem);
    }
    function closeQuiz() {
      resultContainer.innerText = "";
      closeButton.style.display = "none"; // 🔹 「閉じる」ボタンを隠す
      scoreHistory.style.display = "block"; 
      
  }


    submitButton.addEventListener("click", checkAnswers);
    closeButton.addEventListener("click", closeQuiz);
    buildQuiz();
});

    submitButton.addEventListener("click", checkAnswers);
    buildQuiz();
  
    
  
      let scores = JSON.parse(localStorage.getItem("scores")) || [];
  
      function updateScoreList() {
          scoreList.innerHTML = "";
  
          scores.forEach((entry, index) => {
              const listItem = document.createElement("li");
              listItem.innerHTML = `
                  ${entry.date} - 🎯 ${entry.score}点
                  <button class="deleteButton" onclick="deleteScore(${index})">🗑️</button>
              `;
              scoreList.appendChild(listItem);
          });
  
          localStorage.setItem("scores", JSON.stringify(scores));
      }
  
      function addScore() {
          const date = dateInput.value;
          const score = parseInt(scoreInput.value, 10);
  
          if (!date || isNaN(score)) {
              alert("⚠️ 日付とスコアを入力してください！");
              return;
          }
  
          scores.push({ date, score });
  
          dateInput.value = "";
          scoreInput.value = "";
  
          updateScoreList();
      }
  
      window.deleteScore = (index) => {
          scores.splice(index, 1);
          updateScoreList();
      };
  
      addScoreButton.addEventListener("click", addScore);
      updateScoreList();
  ;
  
;
