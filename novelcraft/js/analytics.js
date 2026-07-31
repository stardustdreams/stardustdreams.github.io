/**
 * NovelCraft 公式サイト — 匿名ページビュー計測
 * Cookie不使用・永続IDなし・IPアドレスは送信しない。
 * ページのpath・referrerのみをサーバーに記録し、どのページがよく見られているかを把握するための最小限の計測。
 */
(function () {
  var API_BASE = 'https://server-graceful-dawn-28.fly.dev';
  var payload = JSON.stringify({
    path: location.pathname,
    referrer: document.referrer || null,
  });

  try {
    if (navigator.sendBeacon) {
      var blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(API_BASE + '/api/analytics/pageview', blob);
    } else {
      fetch(API_BASE + '/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(function () {});
    }
  } catch (e) {
    // 計測の失敗はページ表示に影響させない
  }
})();
