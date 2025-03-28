function goBack() {
    history.back();
  }
  
  const haruKey = "haruCount";
  const boughtKey = "haruShopItems";
  const total = document.getElementById("haruTotal");
  const buyBtns = document.querySelectorAll(".buy-btn");
  
  // haru残高を表示
  let haruCount = parseInt(localStorage.getItem(haruKey) || "0");
  total.textContent = haruCount;
  
  // 購入済み管理
  let bought = JSON.parse(localStorage.getItem(boughtKey) || "{}");
  buyBtns.forEach(btn => {
    const id = btn.dataset.id;
    const cost = parseInt(btn.dataset.cost);
    if (bought[id]) {
      btn.textContent = "購入済み";
      btn.disabled = true;
    }
    btn.addEventListener("click", () => {
      if (haruCount >= cost) {
        haruCount -= cost;
        localStorage.setItem(haruKey, haruCount);
        localStorage.setItem(boughtKey, JSON.stringify({ ...bought, [id]: true }));
        btn.textContent = "購入済み";
        btn.disabled = true;
        total.textContent = haruCount;
        alert("購入しました！");
      } else {
        alert("haruが足りません！");
      }
    });
  });
  