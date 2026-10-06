/* ==========================================================================
   icons.js — presentation.js-ийн ДАРАА ачаална.
   Слайд бүрийн kicker болон картуудад inline SVG икон нэмнэ.
   ========================================================================== */
(function () {
  const P = {
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    book: '<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>',
    cap: '<path d="M22 9L12 4 2 9l10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    scale:
      '<path d="M12 3v18M5 21h14M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.8 1.8 0 0 1 0 3.5h-3a1.8 1.8 0 0 0 0 3.5h4"/>',
    target:
      '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    heart:
      '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c1 1 1 2 1 3h6c0-1 0-2 1-3A6 6 0 0 0 12 3z"/>',
    building:
      '<rect x="5" y="3" width="14" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
    award:
      '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
    bird: '<path d="M20 4c-8 0-14 5-14 12l-3 4M20 4c0 8-5 14-12 14M20 4l-8 8"/>',
    dna: '<path d="M7 3c0 6 10 6 10 9s-10 3-10 9M17 3c0 6-10 6-10 9s10 3 10 9"/><path d="M8.5 6h7M8.5 18h7"/>',
  };

  // slide index -> { k: kicker icon, i: [icon per card, DOM дарааллаар] }
  const MAP = {
    0: { i: ["users", "cap", "cpu"] },
    1: { k: "target", i: ["users", "home", "building"] },
    2: { k: "users" },
    3: { k: "book", i: ["coin", "bulb"] },
    4: { k: "scale", i: ["dna", "users"] },
    5: { k: "globe", i: ["book", "scale"] },
    6: { k: "globe", i: ["users", "book"] },
    7: { k: "coin", i: ["heart", "coin"] },
    8: { k: "chart", i: ["cap"] },
    9: { k: "chart", i: ["cap"] },
    10: { k: "home", i: ["home"] },
    11: { k: "building", i: ["building"] },
    12: { k: "coin", i: ["coin"] },
    13: { k: "code", i: ["code"] },
    14: { k: "cpu", i: ["cpu"] },
    15: { k: "cap", i: ["award"] },
    16: { k: "code", i: ["bulb"] },
    17: { k: "bulb", i: ["bulb"] },
    18: { k: "heart", i: ["heart"] },
    19: { k: "users", i: ["users"] },
    20: { k: "target", i: ["home"] },
    21: { k: "target", i: ["users"] },
    22: { k: "target", i: ["book"] },
    23: { k: "bird", i: ["bird"] },
  };

  const CARD_SEL =
    ".stat-hero-box, .editorial-card, .metric-data-card, .pillar-card, " +
    ".tech-aspect-card, .myth-card, .comparison-item";

  const svg = (name, cls) =>
    '<svg class="' +
    (cls || "") +
    '" viewBox="0 0 24 24" aria-hidden="true">' +
    (P[name] || "") +
    "</svg>";

  function init() {
    document.querySelectorAll(".slide-section").forEach(function (slide) {
      const idx = Number(slide.dataset.slideIndex);
      const cfg = MAP[idx];
      if (!cfg) return;

      // Kicker икон
      if (cfg.k) {
        const kicker = slide.querySelector(".slide-kicker");
        if (kicker && !kicker.querySelector(".kicker-icon")) {
          kicker.insertAdjacentHTML("afterbegin", svg(cfg.k, "kicker-icon"));
        }
      }

      // Картуудын икон
      if (cfg.i) {
        const cards = slide.querySelectorAll(CARD_SEL);
        cards.forEach(function (card, n) {
          const name = cfg.i[n] || cfg.i[cfg.i.length - 1];
          if (!name || card.querySelector(".icon-chip")) return;
          card.classList.add("has-chip");
          card.insertAdjacentHTML(
            "afterbegin",
            '<span class="icon-chip">' + svg(name) + "</span>",
          );
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
