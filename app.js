let ethPriceInJPY = 0; // ETHの価格を保持
let ethPriceInAUD = 0; // AUDでのETHの価格も保持

// ETHの価格をCoinGeckoから取得する
async function fetchETHPrices() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=jpy,aud");
    const data = await response.json();
    ethPriceInJPY = data.ethereum.jpy;
    ethPriceInAUD = data.ethereum.aud;
}

// メタマスクとの接続
async function connectMetamask() {
    if (window.ethereum) {
        try {
            // メタマスクのアカウントをリクエスト
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0]; // 最初のアカウントを取得

            // ウェブサイトに接続されたアドレスを表示
            document.getElementById("accountAddress").innerText = `接続中のアドレス: ${account}`;

            return account;

        } catch (error) {
            console.error("MetaMask接続失敗:", error);
        }
    } else {
        alert("MetaMaskがインストールされていません。");
    }
}

// 受け取るボタンがクリックされたときの処理
document.getElementById("receiveButton").addEventListener("click", async function() {
    const account = await connectMetamask(); // メタマスクのアカウントを接続

    if (account) {
        // アドレスにETHの残高を取得
        const web3 = new Web3(window.ethereum);
        const balanceWei = await web3.eth.getBalance(account);
        const balanceETH = web3.utils.fromWei(balanceWei, 'ether'); // ETH単位に変換

        // 残高を表示
        document.getElementById("ethBalance").innerText = `残高: ${balanceETH} ETH`;
        document.getElementById("audBalance").innerText = `残高: ${balanceETH * ethPriceInAUD} AUD`;
        document.getElementById("jpyBalance").innerText = `残高: ${balanceETH * ethPriceInJPY} JPY`;

        // 「閉じる」ボタンを表示
        document.getElementById("closeButton").style.display = "block";
    }
});

// 閉じるボタンがクリックされたときの処理
document.getElementById("closeButton").addEventListener("click", function() {
    document.getElementById("accountAddress").innerText = ''; // アドレス非表示
    document.getElementById("ethBalance").innerText = ''; // ETH残高非表示
    document.getElementById("audBalance").innerText = ''; // AUD残高非表示
    document.getElementById("jpyBalance").innerText = ''; // JPY残高非表示

    // 「閉じる」ボタンを非表示
    document.getElementById("closeButton").style.display = "none";
});

// ページが読み込まれたときにETHの価格を取得
fetchETHPrices();
