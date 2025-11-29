// js/works.js
document.addEventListener("DOMContentLoaded", async () => {
  const listEl = document.getElementById("works-feed");
  if (!listEl) return;

  const SERVICE_DOMAIN = "dreamworks";   // あなたのmicroCMSサブドメイン
  const ENDPOINT = "blogs";              // ブログAPI
  const API_KEY = "＜hirIBslQWigXATRGfz9aAwwH1RVtLxGNhcx4＞"; // ←必ず差し替え

  const qs = new URLSearchParams({
    limit: "5",
    orders: "-publishedAt",
    filters: "isWork[equals]true", // 施工事例だけ
  });

  const escapeHTML = (s = "") =>
    s.replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m]));

  try {
    const res = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}?${qs.toString()}`,
      { headers: { "X-MICROCMS-API-KEY": API_KEY } }
    );
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();

    const items = (data.contents || []).map((c) => {
      const title = c.title || "（無題）";
      const date = new Date(c.publishedAt || c.createdAt).toLocaleDateString("ja-JP");
      const img = c.eyecatch && c.eyecatch.url ? `${c.eyecatch.url}?w=900&h=500&fit=crop` : "";
      // category が参照型の場合は title を拾う
      const cat =
        Array.isArray(c.category) ? (c.category[0]?.title || "") :
        (typeof c.category === "object" && c.category) ? (c.category.title || "") : (c.category || "");

      return `
        <article class="work-item" data-id="${c.id}">
          <div class="work-image">
            ${img ? `<img src="${img}" alt="${escapeHTML(title)}">`
                  : `<div class="img-placeholder">NO IMAGE</div>`}
          </div>
          <div class="work-info">
            <div class="tags">
              ${cat ? `<span class="tag tag-car">${escapeHTML(cat)}</span>` : ""}
            </div>
            <h3 class="work-title">${escapeHTML(title)}</h3>
            <time>${date}</time>
          </div>
          <a class="cover-link" href="blog-detail.html?id=${encodeURIComponent(c.id)}" aria-label="${escapeHTML(title)}へ"></a>
        </article>
      `;
    });

    listEl.classList.remove("loading");
    listEl.innerHTML = items.length ? items.join("") : `<p class="empty">施工事例は準備中です。</p>`;

    // カードのどこをクリックしても詳細へ（オーバーレイの保険）
    listEl.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const card = e.target.closest(".work-item");
      if (card) location.href = `blog-detail.html?id=${encodeURIComponent(card.dataset.id)}`;
    });
  } catch (err) {
    console.error(err);
    listEl.classList.remove("loading");
    listEl.innerHTML = `<p class="empty">読み込みエラー</p>`;
  }
});