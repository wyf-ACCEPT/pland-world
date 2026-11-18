// Language switch for pland.world. The initial language is set by an inline snippet in <head>
// (before first paint); this file wires the EN / 中 buttons and keeps the choice per viewer.
(function () {
  var root = document.documentElement;
  function apply(lang) {
    root.dataset.lang = lang;
    root.lang = lang === 'zh' ? 'zh-CN' : 'en';
    var t = root.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === lang));
    });
    // A film in the hidden language must not keep playing behind the visible one.
    document.querySelectorAll('video').forEach(function (v) {
      if (!v.offsetParent && !v.paused) v.pause();
    });
  }
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.dataset.setLang;
      try { localStorage.setItem('lang', lang); } catch (e) {}
      apply(lang);
    });
  });
  apply(root.dataset.lang === 'zh' ? 'zh' : 'en');
})();
