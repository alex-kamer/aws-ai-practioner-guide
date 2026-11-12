(function () {
  "use strict";

  var WEIGHTS = { 1: 20, 2: 24, 3: 28, 4: 14, 5: 14 };
  var NAMES = {
    1: "AI and ML fundamentals",
    2: "Generative AI fundamentals",
    3: "Applications of foundation models",
    4: "Responsible AI",
    5: "Security, compliance, and governance"
  };
  var LETTERS = ["A", "B", "C", "D"];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function bank() { return window.MCQ || []; }
  function byDomain(d) { return bank().filter(function (q) { return q.d === d; }); }

  // ---------- Per-domain practice ----------
  function renderDomain(root) {
    var d = parseInt(root.getAttribute("data-domain"), 10);
    var qs = byDomain(d);
    var key = "mcq:d" + d;
    var saved = window.AIF.store(key) || {};

    function save() { window.AIF.store(key, saved); }

    function build() {
      var right = 0, answered = 0;
      qs.forEach(function (q, i) {
        if (saved[i] !== undefined) { answered++; if (saved[i] === q.a) right++; }
      });
      var html = '<div class="mcq-head"><span class="score">Score ' + right + " / " + qs.length +
        " · answered " + answered + '</span> <button class="mcq-reset">Reset</button></div>';
      html += '<ol class="mcq">';
      qs.forEach(function (q, i) {
        var done = saved[i] !== undefined;
        html += '<li data-i="' + i + '" class="' + (done ? (saved[i] === q.a ? "right" : "wrong") : "") + '">' +
          '<p class="mq"><span class="tag">' + esc(q.t) + "</span> " + esc(q.q) + "</p>" +
          '<div class="opts">';
        q.o.forEach(function (o, k) {
          var cls = "opt";
          if (done) {
            if (k === q.a) cls += " correct";
            else if (k === saved[i]) cls += " incorrect";
          }
          html += '<button class="' + cls + '" data-k="' + k + '"' + (done ? " disabled" : "") + ">" +
            "<b>" + LETTERS[k] + "</b><span>" + esc(o) + "</span></button>";
        });
        html += "</div>";
        if (done) html += '<div class="explain"><b>' + (saved[i] === q.a ? "Correct." : "Answer: " + LETTERS[q.a] + ".") + "</b> " + esc(q.e) + "</div>";
        html += "</li>";
      });
      html += "</ol>";
      root.innerHTML = html;
    }

    root.addEventListener("click", function (e) {
      var opt = e.target.closest(".opt");
      if (opt && !opt.disabled) {
        var li = opt.closest("li");
        saved[li.getAttribute("data-i")] = parseInt(opt.getAttribute("data-k"), 10);
        save();
        var y = li.getBoundingClientRect().top;
        build();
        var again = root.querySelector('li[data-i="' + li.getAttribute("data-i") + '"]');
        window.scrollBy(0, again.getBoundingClientRect().top - y);
        return;
      }
      if (e.target.closest(".mcq-reset") && confirm("Clear your answers for this domain?")) {
        saved = {}; save(); build();
      }
    });

    if (!qs.length) { root.innerHTML = '<p class="small">No questions loaded.</p>'; return; }
    build();
  }

  // ---------- Practice exam ----------
  function allocate(total) {
    // largest-remainder allocation by domain weight, capped by bank size
    var ids = [1, 2, 3, 4, 5], out = {}, used = 0, rem = [];
    ids.forEach(function (d) {
      var exact = total * WEIGHTS[d] / 100;
      out[d] = Math.min(Math.floor(exact), byDomain(d).length);
      used += out[d];
      rem.push([d, exact - Math.floor(exact)]);
    });
    rem.sort(function (a, b) { return b[1] - a[1]; });
    var i = 0;
    while (used < total && i < 50) {
      var d = rem[i % rem.length][0];
      if (out[d] < byDomain(d).length) { out[d]++; used++; }
      i++;
    }
    return out;
  }

  function renderExam(root) {
    var state = null;
    var timerId = null;
    var HIST = "exam:history";

    function history() { return window.AIF.store(HIST) || []; }

    function fmt(sec) {
      var m = Math.floor(sec / 60), s = sec % 60;
      return m + ":" + (s < 10 ? "0" : "") + s;
    }

    function start(total, minutes) {
      var alloc = allocate(total);
      var picked = [];
      [1, 2, 3, 4, 5].forEach(function (d) { picked = picked.concat(shuffle(byDomain(d)).slice(0, alloc[d])); });
      picked = shuffle(picked).map(function (q) {
        var order = shuffle([0, 1, 2, 3]);
        return { d: q.d, t: q.t, q: q.q, e: q.e, o: order.map(function (k) { return q.o[k]; }), a: order.indexOf(q.a) };
      });
      state = {
        qs: picked, ans: {}, flag: {}, cur: 0, done: false,
        limit: minutes ? minutes * 60 : 0, left: minutes ? minutes * 60 : 0,
        began: Date.now(), review: "all"
      };
      if (state.limit) {
        timerId = setInterval(function () {
          state.left--;
          var el = root.querySelector(".timer");
          if (el) el.textContent = fmt(Math.max(state.left, 0));
          if (state.left <= 0) finish();
        }, 1000);
      }
      window.onbeforeunload = function () { return "Exam in progress"; };
      renderQuestion();
    }

    function renderStart() {
      var have = [1, 2, 3, 4, 5].map(function (d) { return byDomain(d).length; });
      var total = have.reduce(function (a, b) { return a + b; }, 0);
      var h = history();
      var html = '<div class="callout"><p><b>Format:</b> single-answer multiple choice, drawn from a bank of ' + total +
        " questions and sampled by the official domain weights (20 / 24 / 28 / 14 / 14%). Options are shuffled each run. " +
        "The real exam has 65 questions (50 scored) and a 90-minute limit; passing is a scaled 700 / 1000, which is not simply 70%, " +
        "so treat the percentage as a rough guide.</p></div>" +
        '<div class="exam-modes">' +
        '<button class="primary" data-total="65" data-min="90">Full practice exam<br><small>65 questions · 90 min</small></button>' +
        '<button data-total="25" data-min="35">Half exam<br><small>25 questions · 35 min</small></button>' +
        '<button data-total="65" data-min="0">Full, untimed<br><small>65 questions · no timer</small></button>' +
        "</div>";
      if (h.length) {
        html += "<h2>Previous runs</h2><table><thead><tr><th>Date</th><th>Mode</th><th>Score</th><th>D1</th><th>D2</th><th>D3</th><th>D4</th><th>D5</th></tr></thead><tbody>";
        h.slice().reverse().slice(0, 10).forEach(function (r) {
          html += "<tr><td>" + esc(r.date) + "</td><td>" + esc(r.mode) + "</td><td><b>" + r.pct + "%</b> (" + r.correct + "/" + r.total + ")</td>";
          [1, 2, 3, 4, 5].forEach(function (d) { html += "<td>" + (r.dom[d] === null ? "-" : r.dom[d] + "%") + "</td>"; });
          html += "</tr>";
        });
        html += "</tbody></table>";
      }
      root.innerHTML = html;
    }

    function renderQuestion() {
      var q = state.qs[state.cur];
      var answeredN = Object.keys(state.ans).length;
      var html = '<div class="exam-bar"><span>Question <b>' + (state.cur + 1) + "</b> of " + state.qs.length +
        " · answered " + answeredN + "</span>" +
        (state.limit ? '<span class="timer-wrap">Time left <b class="timer">' + fmt(Math.max(state.left, 0)) + "</b></span>" : "") + "</div>";
      html += '<div class="palette">';
      state.qs.forEach(function (_, i) {
        var c = "pal";
        if (state.ans[i] !== undefined) c += " ans";
        if (state.flag[i]) c += " flag";
        if (i === state.cur) c += " cur";
        html += '<button class="' + c + '" data-go="' + i + '">' + (i + 1) + "</button>";
      });
      html += "</div>";
      html += '<div class="exam-q"><p class="mq">' + esc(q.q) + '</p><div class="opts">';
      q.o.forEach(function (o, k) {
        html += '<button class="opt' + (state.ans[state.cur] === k ? " picked" : "") + '" data-pick="' + k + '"><b>' + LETTERS[k] + "</b><span>" + esc(o) + "</span></button>";
      });
      html += "</div></div>";
      html += '<div class="exam-nav"><button data-nav="-1"' + (state.cur === 0 ? " disabled" : "") + ">Previous</button>" +
        '<button data-flag="1" class="' + (state.flag[state.cur] ? "on bad" : "") + '">' + (state.flag[state.cur] ? "Flagged" : "Flag for review") + "</button>" +
        (state.cur < state.qs.length - 1
          ? '<button class="primary" data-nav="1">Next</button>'
          : '<button class="primary" data-finish="1">Finish exam</button>') +
        '<button data-finish="1" class="ghost">Submit now</button></div>';
      root.innerHTML = html;
    }

    function finish() {
      if (state.done) return;
      state.done = true;
      clearInterval(timerId);
      window.onbeforeunload = null;
      var per = {}, correct = 0;
      [1, 2, 3, 4, 5].forEach(function (d) { per[d] = { n: 0, c: 0, missed: {} }; });
      state.qs.forEach(function (q, i) {
        var ok = state.ans[i] === q.a;
        per[q.d].n++;
        if (ok) { per[q.d].c++; correct++; } else per[q.d].missed[q.t] = (per[q.d].missed[q.t] || 0) + 1;
      });
      state.per = per; state.correct = correct;
      var dom = {};
      [1, 2, 3, 4, 5].forEach(function (d) { dom[d] = per[d].n ? Math.round(100 * per[d].c / per[d].n) : null; });
      var pct = Math.round(100 * correct / state.qs.length);
      var h = history();
      h.push({
        date: new Date().toISOString().slice(0, 10),
        mode: state.qs.length + "Q" + (state.limit ? " timed" : ""),
        pct: pct, correct: correct, total: state.qs.length, dom: dom
      });
      window.AIF.store(HIST, h.slice(-30));
      state.pct = pct; state.dom = dom;
      renderResults();
    }

    function saveToGapMap() {
      var data = window.AIF.store("gapmap");
      var rows = {};
      [1, 2, 3, 4, 5].forEach(function (d) {
        var miss = Object.keys(state.per[d].missed).sort().join(", ");
        rows[d] = { score: state.dom[d] === null ? "" : String(state.dom[d]), missed: miss ? "Task statements missed: " + miss : "", conf: "" };
      });
      var attempt = { id: String(Date.now()), name: "Practice exam " + new Date().toISOString().slice(0, 10), date: new Date().toISOString().slice(0, 10), rows: rows };
      if (!data || !data.attempts) data = { attempts: [] };
      data.attempts.push(attempt);
      data.current = attempt.id;
      window.AIF.store("gapmap", data);
    }

    function renderResults() {
      var html = '<div class="result-hero"><div class="big">' + state.pct + '%</div><div>' + state.correct + " of " + state.qs.length +
        " correct · " + fmt(Math.round((Date.now() - state.began) / 1000)) + " elapsed" +
        '<br><span class="small">Passing is a scaled 700 / 1000. A rough rule of thumb is to aim for 75%+ here before booking.</span></div></div>';
      html += "<h2>By domain</h2><table><thead><tr><th>Domain</th><th>Weight</th><th>Score</th><th>Missed task statements</th></tr></thead><tbody>";
      [1, 2, 3, 4, 5].forEach(function (d) {
        var p = state.per[d];
        var miss = Object.keys(p.missed).sort().map(function (t) { return t + " (" + p.missed[t] + ")"; }).join(", ") || "none";
        html += "<tr><td>" + d + " · " + esc(NAMES[d]) + "</td><td>" + WEIGHTS[d] + "%</td><td><b>" + (state.dom[d] === null ? "-" : state.dom[d] + "%") +
          "</b> (" + p.c + "/" + p.n + ")</td><td>" + esc(miss) + "</td></tr>";
      });
      html += "</tbody></table>";
      html += '<div class="exam-nav"><button class="primary" data-savegap="1">Save to gap map</button>' +
        '<a class="btnlink" href="../tracker/gap-map.html">Open gap map</a>' +
        '<button data-restart="1">Back to start</button></div><p class="small save-note"></p>';
      html += "<h2>Review</h2><div class=\"exam-nav\">" +
        '<button data-rev="all" class="' + (state.review === "all" ? "on good" : "") + '">All</button>' +
        '<button data-rev="wrong" class="' + (state.review === "wrong" ? "on good" : "") + '">Wrong or skipped</button>' +
        '<button data-rev="flag" class="' + (state.review === "flag" ? "on good" : "") + '">Flagged</button></div>';
      html += '<ol class="mcq">';
      state.qs.forEach(function (q, i) {
        var ok = state.ans[i] === q.a;
        if (state.review === "wrong" && ok) return;
        if (state.review === "flag" && !state.flag[i]) return;
        html += '<li class="' + (ok ? "right" : "wrong") + '" value="' + (i + 1) + '"><p class="mq"><span class="tag">' + esc(q.t) + "</span> " + esc(q.q) + '</p><div class="opts">';
        q.o.forEach(function (o, k) {
          var cls = "opt";
          if (k === q.a) cls += " correct"; else if (k === state.ans[i]) cls += " incorrect";
          html += '<button class="' + cls + '" disabled><b>' + LETTERS[k] + "</b><span>" + esc(o) + "</span></button>";
        });
        html += '</div><div class="explain"><b>' + (state.ans[i] === undefined ? "Skipped. " : ok ? "Correct. " : "Answer: " + LETTERS[q.a] + ". ") + "</b>" + esc(q.e) + "</div></li>";
      });
      html += "</ol>";
      root.innerHTML = html;
    }

    root.addEventListener("click", function (e) {
      var t = e.target.closest("button");
      if (!t || t.disabled) return;
      if (t.hasAttribute("data-total")) {
        start(parseInt(t.getAttribute("data-total"), 10), parseInt(t.getAttribute("data-min"), 10));
      } else if (!state) {
        return;
      } else if (t.hasAttribute("data-pick") && !state.done) {
        state.ans[state.cur] = parseInt(t.getAttribute("data-pick"), 10); renderQuestion();
      } else if (t.hasAttribute("data-go")) {
        state.cur = parseInt(t.getAttribute("data-go"), 10); renderQuestion();
      } else if (t.hasAttribute("data-nav")) {
        state.cur += parseInt(t.getAttribute("data-nav"), 10); renderQuestion();
      } else if (t.hasAttribute("data-flag")) {
        state.flag[state.cur] = !state.flag[state.cur]; renderQuestion();
      } else if (t.hasAttribute("data-finish")) {
        var open = state.qs.length - Object.keys(state.ans).length;
        if (!open || confirm(open + " question(s) unanswered. Submit anyway?")) finish();
      } else if (t.hasAttribute("data-rev")) {
        state.review = t.getAttribute("data-rev"); renderResults();
      } else if (t.hasAttribute("data-savegap")) {
        saveToGapMap();
        root.querySelector(".save-note").textContent = "Saved as a new attempt in the gap map.";
      } else if (t.hasAttribute("data-restart")) {
        state = null; renderStart();
      }
    });

    if (!bank().length) { root.innerHTML = '<p class="small">No questions loaded.</p>'; return; }
    renderStart();
  }

  // Runs after app.js has built the layout (both defer; app.js waits for DOMContentLoaded).
  document.addEventListener("DOMContentLoaded", function () {
    var dom = document.getElementById("mcq");
    if (dom) renderDomain(dom);
    var ex = document.getElementById("exam");
    if (ex) renderExam(ex);
  });
})();
