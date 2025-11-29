// js/works.js ー トップのWORKSをmicroCMSから自動表示（最新3件／isWork=true）
(async function () {
  const SERVICE_DOMAIN = "dreamworks";
  const API_KEY = "hirIBslQWigXATRGfz9aAwwH1RVtLxGNhcx4"; // 既に公開で使っているdefaultキー
  const ENDPOINT = "blogs";

  const track = document.getElementById("worksTrack");
  if (!track) return;

  try {
    const url =
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}` +
      `?limit=3&orders=-publishedAt&filters=isWork[equals]true&fields=id,title,eyecatch,publishedAt`;

    const res = await fetch(url, { headers: { "X-MICROCMS-API-KEY": API_KEY } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();

    if (!data.contents || data.contents.length === 0) {
      track.innerHTML = `<p style="color:#888;">施工事例はまだありません。</p>`;
      return;
    }

    track.innerHTML = data.contents
      .map((c) => {
        const img = c.eyecatch?.url || "";
        const date = new Date(c.publishedAt || Date.now()).toLocaleDateString("ja-JP");
        return `
          <article class="work-item" onclick="location.href='blog-detail.html?id=${encodeURIComponent(c.id)}'" style="cursor:pointer;">
            <div class="work-image">
              ${img ? `<img src="${img}" alt="${c.title}">` : `<div class="img-placeholder">${c.title}</div>`}
            </div>
            <div class="work-info">
              <h3 class="work-title">${c.title}</h3>
              <time>${date}</time>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (e) {
    console.error(e);
    track.innerHTML = `<p style="color:#c00;">施工事例の読み込みに失敗しました。</p>`;
  }
})();