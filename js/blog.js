// js/blog.js（一覧はそのまま／カード全体をクリックで詳細へ）
(async function () {
  const SERVICE_DOMAIN = "dreamworks";                // そのまま
  const API_KEY = "hirIBslQWigXATRGfz9aAwwH1RVtLxGNhcx4"; // そのまま
  const ENDPOINT = "blogs";
  const listEl = document.getElementById("blog-list");

  try {
    const res = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}?limit=20&orders=-publishedAt`,
      { headers: { "X-MICROCMS-API-KEY": API_KEY } }
    );
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();

    if (!data.contents || data.contents.length === 0) {
      listEl.textContent = "記事がありません。";
      return;
    }

    const strip = (html) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html || "";
      return (tmp.textContent || "").replace(/\s+/g, " ").trim();
    };

    listEl.innerHTML = data.contents
      .map((c) => {
        const date = new Date(c.publishedAt || c.createdAt).toLocaleDateString("ja-JP");
        const excerpt = strip(c.content || c.body).slice(0, 70);
        return `
          <article class="card" data-id="${c.id}" style="cursor:pointer;">
            <div class="date">${date}</div>
            <h2 class="title">${c.title ?? "(無題)"}</h2>
            <p>${excerpt}…</p>
            <a class="readmore" href="blog-detail.html?id=${encodeURIComponent(c.id)}">続きを読む</a>
          </article>`;
      })
      .join("");

    // ▼カードのどこをクリックしても詳細へ（既存のリンクはそのまま動作）
    listEl.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;            // 「続きを読む」を押した時はこのまま
      const card = e.target.closest(".card");
      if (!card) return;
      const id = card.dataset.id;
      if (id) location.href = `blog-detail.html?id=${encodeURIComponent(id)}`;
    });

  } catch (e) {
    console.error(e);
    listEl.textContent = "読み込みエラー";
  }
})();