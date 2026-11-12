(function () {
  "use strict";

  var ROOT = document.body.getAttribute("data-root") || "";
  var PAGE = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
  var NS = "aif:";

  var GROUPS = [
    ["Get started", [["Overview", "index.html"]]],
    ["Exam domains", [
      ["1 · AI and ML fundamentals", "domains/01-ai-ml-fundamentals.html", "20%"],
      ["2 · Generative AI fundamentals", "domains/02-generative-ai-fundamentals.html", "24%"],
      ["3 · Foundation model apps", "domains/03-foundation-model-applications.html", "28%"],
      ["4 · Responsible AI", "domains/04-responsible-ai.html", "14%"],
      ["5 · Security and governance", "domains/05-security-governance-compliance.html", "14%"]
    ]],
    ["Cheat-sheets", [
      ["AWS services", "cheatsheets/services.html"],
      ["Glossary", "cheatsheets/glossary.html"]
    ]],
    ["Hands-on labs", [
      ["Lab 1 · Prompting", "labs/01-prompting.html"],
      ["Lab 2 · Knowledge base (RAG)", "labs/02-knowledge-base-rag.html"],
      ["Lab 3 · Guardrails", "labs/03-guardrails.html"]
    ]],
    ["Practice", [["Practice exam", "practice/exam.html"]]],
    ["Tracker", [["Gap map", "tracker/gap-map.html"]]]
  ];

  var FLAT = [];
  GROUPS.forEach(function (g) { g[1].forEach(function (l) { FLAT.push(l); }); });

  function store(key, value) {
    try {
      if (value === undefined) {
        var raw = localStorage.getItem(NS + key);
        return raw ? JSON.parse(raw) : null;
      }
      localStorage.setItem(NS + key, JSON.stringify(value));
    } catch (e) {
      return null;
    }
    return value;
  }
  window.AIF = { store: store, root: ROOT, domains: GROUPS[1][1] };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function isCurrent(url) {
    return location.pathname.slice(-url.length) === url;
  }

  function slug(text, used) {
    var s = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    var out = s, n = 2;
    while (used[out]) out = s + "-" + n++;
    used[out] = true;
    return out;
  }

  function buildTopbar() {
    var header = document.createElement("header");
    header.className = "topbar";
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    header.innerHTML =
      '<div class="topbar-inner">' +
      '<button class="menu-btn" aria-label="Menu">&#9776;</button>' +
      '<a class="brand" href="' + ROOT + 'index.html"><span class="brand-mark">AI</span>AIF-C01 Study Guide</a>' +
      '<span class="spacer"></span>' +
      '<button class="search-btn" aria-label="Search"><span>&#128269;</span><span class="label">Search docs…</span>' +
      "<kbd>" + (isMac ? "⌘K" : "Ctrl K") + "</kbd></button></div>";
    document.body.insertBefore(header, document.body.firstChild);
    header.querySelector(".menu-btn").addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    header.querySelector(".search-btn").addEventListener("click", openSearch);
  }

  function buildLayout() {
    var main = document.querySelector("main");
    var layout = document.createElement("div");
    layout.className = "layout";

    var side = document.createElement("aside");
    side.className = "sidebar";
    side.innerHTML = GROUPS.map(function (g) {
      return "<h4>" + g[0] + "</h4>" + g[1].map(function (l) {
        return '<a href="' + ROOT + l[1] + '"' + (isCurrent(l[1]) ? ' class="active"' : "") + ">" +
          esc(l[0]) + (l[2] ? '<span class="w">' + l[2] + "</span>" : "") + "</a>";
      }).join("");
    }).join("");

    var toc = document.createElement("aside");
    toc.className = "toc";

    main.parentNode.insertBefore(layout, main);
    layout.appendChild(side);
    layout.appendChild(main);
    layout.appendChild(toc);

    side.addEventListener("click", function (e) {
      if (e.target.tagName === "A") document.body.classList.remove("nav-open");
    });

    buildToc(main, toc);
    buildPager(main);
  }

  function buildToc(main, toc) {
    var heads = Array.prototype.slice.call(main.querySelectorAll("h2, h3"));
    var used = {};
    heads.forEach(function (h) { if (h.id) used[h.id] = true; });
    var items = [];
    heads.forEach(function (h) {
      var clone = h.cloneNode(true);
      var chk = clone.querySelector(".task-check");
      if (chk) chk.remove();
      var text = clone.textContent.trim();
      if (!h.id) h.id = slug(text, used);
      items.push({ el: h, id: h.id, text: text, sub: h.tagName === "H3" });
    });
    if (items.length < 2) { toc.style.visibility = "hidden"; return; }

    toc.innerHTML = "<h5>On this page</h5>" + items.map(function (i) {
      return '<a href="#' + i.id + '"' + (i.sub ? ' class="sub"' : "") + ">" + esc(i.text) + "</a>";
    }).join("");

    var links = toc.querySelectorAll("a");
    function setActive(id) {
      links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); });
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
      }, { rootMargin: "-80px 0px -70% 0px" });
      items.forEach(function (i) { io.observe(i.el); });
    }
  }

  function buildPager(main) {
    var idx = -1;
    FLAT.forEach(function (l, i) { if (isCurrent(l[1])) idx = i; });
    if (idx === -1 || PAGE === "index") return;
    var prev = FLAT[idx - 1], next = FLAT[idx + 1];
    var el = document.createElement("nav");
    el.className = "pager";
    el.innerHTML =
      (prev ? '<a class="prev" href="' + ROOT + prev[1] + '"><small>Previous</small>' + esc(prev[0]) + "</a>" : "<span></span>") +
      (next ? '<a class="next" href="' + ROOT + next[1] + '"><small>Next</small>' + esc(next[0]) + "</a>" : "");
    main.appendChild(el);
  }

  /* Search dialog */
  var modal, input, results, hits = [], sel = 0;

  function buildSearch() {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = '<div class="dialog"><input type="search" placeholder="Search the study guide…" aria-label="Search">' +
      '<div class="results"></div></div>';
    document.body.appendChild(modal);
    input = modal.querySelector("input");
    results = modal.querySelector(".results");

    modal.addEventListener("mousedown", function (e) { if (e.target === modal) closeSearch(); });
    input.addEventListener("input", runSearch);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter" && hits[sel]) { location.href = ROOT + hits[sel].doc.url; }
    });
    document.addEventListener("keydown", function (e) {
      var tag = document.activeElement.tagName;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
      else if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); openSearch(); }
      else if (e.key === "Escape") closeSearch();
    });
    runSearch();
  }

  function openSearch() { modal.classList.add("open"); input.focus(); input.select(); }
  function closeSearch() { modal.classList.remove("open"); }

  function move(d) {
    if (!hits.length) return;
    sel = (sel + d + hits.length) % hits.length;
    var links = results.querySelectorAll("a");
    links.forEach(function (a, i) { a.classList.toggle("sel", i === sel); });
    links[sel].scrollIntoView({ block: "nearest" });
  }

  function runSearch() {
    var q = input.value.trim().toLowerCase();
    var index = window.SEARCH_INDEX || [];
    hits = []; sel = 0;
    if (!index.length) {
      results.innerHTML = '<div class="hint">Search index missing. Run <code>node tools/build-search-index.js</code></div>';
      return;
    }
    if (q.length < 2) {
      results.innerHTML = '<div class="hint">Type at least 2 characters. Try “temperature”, “RAG”, or “Macie”.</div>';
      return;
    }
    var terms = q.split(/\s+/);
    index.forEach(function (doc) {
      var hay = doc.text.toLowerCase(), title = doc.title.toLowerCase(), score = 0;
      var ok = terms.every(function (t) {
        var count = hay.split(t).length - 1, inTitle = title.indexOf(t) !== -1;
        if (!count && !inTitle) return false;
        score += (inTitle ? 10 : 0) + Math.min(5, count);
        return true;
      });
      if (ok) hits.push({ doc: doc, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    hits = hits.slice(0, 10);
    if (!hits.length) { results.innerHTML = '<div class="hint">No results for “' + esc(q) + "”</div>"; return; }
    results.innerHTML = hits.map(function (h, i) {
      var text = h.doc.text;
      var p = Math.max(0, text.toLowerCase().indexOf(terms[0]));
      var start = Math.max(0, p - 60);
      var snip = esc(text.slice(start, start + 170));
      terms.forEach(function (t) {
        snip = snip.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
      });
      return '<a href="' + ROOT + h.doc.url + '"' + (i === 0 ? ' class="sel"' : "") + '><div class="r-title">' +
        esc(h.doc.title) + '</div><div class="r-snippet">' + (start ? "…" : "") + snip + "…</div></a>";
    }).join("");
  }

  /* Quiz */
  function wireQuiz() {
    var quiz = document.querySelector("ol.quiz");
    if (!quiz) return;
    var key = "quiz:" + PAGE;
    var state = store(key) || {};
    var items = Array.prototype.slice.call(quiz.children);
    var scoreEl = document.querySelector(".score");

    function render() {
      var right = 0, wrong = 0;
      items.forEach(function (li, i) {
        li.classList.toggle("right", state[i] === 1);
        li.classList.toggle("wrong", state[i] === 0);
        li.querySelector("button.good").classList.toggle("on", state[i] === 1);
        li.querySelector("button.bad").classList.toggle("on", state[i] === 0);
        if (state[i] === 1) right++;
        if (state[i] === 0) wrong++;
      });
      if (scoreEl) {
        scoreEl.innerHTML = "Score <b>" + right + " / " + items.length + "</b> · answered " + (right + wrong);
      }
    }

    items.forEach(function (li, i) {
      var ctl = document.createElement("div");
      ctl.className = "btns";
      ctl.innerHTML =
        '<button class="primary reveal">Show answer</button>' +
        '<span class="marks"><button class="good">I got it</button><button class="bad">I missed it</button></span>';
      li.appendChild(ctl);
      ctl.querySelector(".reveal").addEventListener("click", function () {
        var open = li.classList.toggle("revealed");
        this.textContent = open ? "Hide answer" : "Show answer";
      });
      ctl.querySelector(".good").addEventListener("click", function () {
        if (state[i] === 1) delete state[i]; else state[i] = 1;
        store(key, state); render();
      });
      ctl.querySelector(".bad").addEventListener("click", function () {
        if (state[i] === 0) delete state[i]; else state[i] = 0;
        store(key, state); render();
      });
    });

    var reset = document.querySelector(".quiz-reset");
    if (reset) {
      reset.addEventListener("click", function () {
        state = {}; store(key, state);
        items.forEach(function (li) {
          li.classList.remove("revealed");
          li.querySelector(".reveal").textContent = "Show answer";
        });
        render();
      });
    }
    render();
  }

  /* Progress */
  function wireProgress() {
    var boxes = document.querySelectorAll("input[data-task]");
    if (!boxes.length) return;
    var key = "progress:" + PAGE;
    var state = store(key) || {};

    function updateSummary() {
      var done = 0;
      boxes.forEach(function (b) { if (b.checked) done++; });
      var el = document.querySelector(".progress-summary");
      if (el) el.textContent = done + " / " + boxes.length + " task statements studied";
    }

    boxes.forEach(function (box) {
      var id = box.getAttribute("data-task");
      box.checked = !!state[id];
      box.addEventListener("change", function () {
        state[id] = box.checked; store(key, state); updateSummary();
      });
    });
    updateSummary();
  }

  function wireHomeProgress() {
    document.querySelectorAll("[data-domain-page]").forEach(function (card) {
      var page = card.getAttribute("data-domain-page");
      var total = parseInt(card.getAttribute("data-tasks"), 10) || 1;
      var quizTotal = parseInt(card.getAttribute("data-questions"), 10) || 10;
      var prog = store("progress:" + page) || {};
      var quiz = store("quiz:" + page) || {};
      var done = Object.keys(prog).filter(function (k) { return prog[k]; }).length;
      var right = Object.keys(quiz).filter(function (k) { return quiz[k] === 1; }).length;
      card.querySelector(".bar > span").style.width = Math.round((done / total) * 100) + "%";
      card.querySelector(".stat").textContent =
        done + "/" + total + " studied · quiz " + right + "/" + quizTotal;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildTopbar();
    buildLayout();
    buildSearch();
    wireQuiz();
    wireProgress();
    wireHomeProgress();
  });
})();
