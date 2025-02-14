const contractAddress = "0xE3Bb748688ef32dD48cC7Aab37F1eBB234F982A8"; // HARU トークンのコントラクトアドレス

const abi = [
    {
        "inputs": [
            { "internalType": "address", "name": "_winner", "type": "address" },
            { "internalType": "uint256", "name": "_correctAnswers", "type": "uint256" }
        ],
        "name": "rewardWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];


async function rewardUser(correctAnswers) {
    if (!window.ethereum) {
        alert("MetaMaskをインストールしてください！");
        return;
    }

    console.log("✅ rewardUser() が実行されました！送信するスコア:", correctAnswers);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
        const userAddress = await signer.getAddress();
        console.log("🔹 ユーザーアドレス:", userAddress);
        console.log("🔹 コントラクトアドレス:", contractAddress);

        const tx = await contract.rewardWinner(userAddress, correctAnswers);
        await tx.wait();
        alert(`🎉 ${correctAnswers} HARU を受け取りました！`);
    } catch (error) {
        console.error("❌ トークン送信エラー:", error);
    }
}

