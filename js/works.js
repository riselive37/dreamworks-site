// js/works.js
(async function () {
  const SERVICE_DOMAIN = "dreamworks";
  const API_KEY = "hirIBslQWigXATRGfz9aAwwH1RVtLxGNhcx4"; // ←改行なし1行
  const ENDPOINT = "blogs";

  // ---- 失敗しない土台作り：無ければ作る ----
  const worksSection = document.querySelector("#works .container") || document.getElementById("works") || document.body;
  let wrap = document.getElementById("works-list");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "works-list";
    wrap.textContent = "読み込み中…";
    worksSection.appendChild(wrap);
  }
  let errBox = document.getElementById("works-error");
  if (!errBox) {
    errBox = document.createElement("div");
    errBox.id = "works-error";
    errBox.hidden = true;
    errBox.innerHTML = '<p>読み込みエラー：<span id="works-error-text"></span></p>';
    worksSection.prepend(errBox);
  }

  try {
    const url =
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}` +
      `?limit=6&orders=-publishedAt&filters=isWork[equals]true`;

    const res = await fetch(url, { headers: { "X-MICROCMS-API-KEY": API_KEY } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const data = await res.json();

    if (!data.contents || data.contents.length === 0) {
      wrap.innerHTML = `<p>現在、施工事例は準備中です。</p>`;
      return;
    }

    const html = data.contents.map(c => {
      const d = new Date(c.publishedAt || c.createdAt).toLocaleDateString("ja-JP");
      const title = c.title ?? "（無題）";
      const eye = c.eyecatch?.url
        ? `<img src="${c.eyecatch.url}" alt="">`
        : `<div class="img-placeholder">${(c.category?.[0]?.name || "WORKS").toUpperCase()}</div>`;
      return `
        <article class="work-item" style="cursor:pointer"
                 onclick="location.href='blog-detail.html?id=${encodeURIComponent(c.id)}'">
          <div class="work-image">${eye}</div>
          <div class="work-info">
            <h3 class="work-title">${title}</h3>
            <time>${d}</time>
          </div>
        </article>`;
    }).join("");

    wrap.innerHTML = `<div class="works-track">${html}</div>`;
  } catch (e) {
    console.error(e);
    const t = document.getElementById("works-error-text");
    if (t) t.textContent = e.message || "不明なエラー";
    errBox.hidden = false;
    wrap.textContent = "読み込みエラー";
  }
})();