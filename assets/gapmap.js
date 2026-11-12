(function () {
  "use strict";

  var DOMAINS = [
    { id: 1, name: "1 AI/ML fundamentals", weight: 20, links: [["Notes", "domains/01-ai-ml-fundamentals.html"], ["Glossary", "cheatsheets/glossary.html"]] },
    { id: 2, name: "2 Generative AI fundamentals", weight: 24, links: [["Notes", "domains/02-generative-ai-fundamentals.html"], ["Lab 1", "labs/01-prompting.html"]] },
    { id: 3, name: "3 FM applications", weight: 28, links: [["Notes", "domains/03-foundation-model-applications.html"], ["Lab 1", "labs/01-prompting.html"], ["Lab 2", "labs/02-knowledge-base-rag.html"]] },
    { id: 4, name: "4 Responsible AI", weight: 14, links: [["Notes", "domains/04-responsible-ai.html"], ["Lab 3", "labs/03-guardrails.html"]] },
    { id: 5, name: "5 Security and governance", weight: 14, links: [["Notes", "domains/05-security-governance-compliance.html"], ["Services", "cheatsheets/services.html"]] }
  ];

  var KEY = "gapmap";
  var ROOT = "../";
  var data = window.AIF.store(KEY) || null;

  function newAttempt(name) {
    var rows = {};
    DOMAINS.forEach(function (d) { rows[d.id] = { score: "", missed: "", conf: "" }; });
    return { id: String(Date.now()), name: name, date: new Date().toISOString().slice(0, 10), rows: rows };
  }

  function init() {
    if (!data || !data.attempts || !data.attempts.length) {
      var a = newAttempt("Attempt 1: practice exam");
      data = { attempts: [a], current: a.id };
    }
  }

  function save() { window.AIF.store(KEY, data); }
  function current() {
    return data.attempts.filter(function (a) { return a.id === data.current; })[0] || data.attempts[0];
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function compute(att) {
    var list = DOMAINS.map(function (d) {
      var r = att.rows[d.id];
      var has = r.score !== "" && !isNaN(Number(r.score));
      var pr = has ? Math.round((100 - Number(r.score)) * d.weight) : null;
      return { d: d, r: r, has: has, priority: pr };
    });
    var ranked = list.filter(function (x) { return x.has; }).sort(function (a, b) {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return (Number(a.r.conf) || 3) - (Number(b.r.conf) || 3);
    });
    ranked.forEach(function (x, i) { x.rank = i + 1; });
    return { list: list, ranked: ranked };
  }

  function renderSelect() {
    var sel = document.getElementById("attempt-select");
    sel.innerHTML = data.attempts.map(function (a) {
      return '<option value="' + a.id + '"' + (a.id === current().id ? " selected" : "") + ">" + esc(a.name) + " (" + a.date + ")</option>";
    }).join("");
  }

  function renderTable() {
    var att = current();
    var res = compute(att);
    var tbody = document.querySelector("#gap-table tbody");
    tbody.innerHTML = res.list.map(function (x) {
      var links = x.d.links.map(function (l) { return '<a href="' + ROOT + l[1] + '">' + l[0] + "</a>"; }).join(" · ");
      return "<tr data-id=\"" + x.d.id + "\">" +
        "<td><b>" + esc(x.d.name) + "</b></td>" +
        "<td>" + x.d.weight + "%</td>" +
        '<td><input type="number" min="0" max="100" data-f="score" value="' + esc(x.r.score) + '"></td>' +
        '<td><textarea data-f="missed" placeholder="e.g. RAG, ROUGE vs BLEU">' + esc(x.r.missed) + "</textarea></td>" +
        '<td><select data-f="conf"><option value="">-</option>' +
        [1, 2, 3, 4, 5].map(function (n) { return '<option value="' + n + '"' + (String(x.r.conf) === String(n) ? " selected" : "") + ">" + n + "</option>"; }).join("") +
        "</select></td>" +
        '<td class="p">' + (x.has ? x.priority : "–") + "</td>" +
        '<td class="rank' + (x.rank === 1 ? " rank-1" : "") + '">' + (x.has ? "#" + x.rank : "–") + "</td>" +
        '<td class="small">' + links + "</td></tr>";
    }).join("");
    renderOrder(res);
  }

  function renderOrder(res) {
    var out = document.getElementById("order-out");
    if (!res.ranked.length) {
      out.innerHTML = '<p class="small">Enter at least one score to see your ranking.</p>';
      return;
    }
    var scores = res.ranked.map(function (x) { return Number(x.r.score); });
    var avg = DOMAINS.reduce(function (s, d) {
      var r = current().rows[d.id];
      return s + (r.score !== "" ? Number(r.score) * d.weight : 0);
    }, 0);
    var wsum = DOMAINS.reduce(function (s, d) { return s + (current().rows[d.id].score !== "" ? d.weight : 0); }, 0);
    out.innerHTML = "<ol>" + res.ranked.map(function (x) {
      var links = x.d.links.map(function (l) { return '<a href="' + ROOT + l[1] + '">' + l[0] + "</a>"; }).join(" · ");
      return "<li><b>" + esc(x.d.name) + "</b> · score " + x.r.score + "% · priority " + x.priority +
        (x.r.missed ? "<br><span class=\"small\">Missed: " + esc(x.r.missed) + "</span>" : "") +
        "<br><span class=\"small\">" + links + "</span></li>";
    }).join("") + "</ol>" +
      '<p class="small">Weighted overall estimate (entered domains): <b>' + Math.round(avg / wsum) + "%</b>. Passing is about 70% (700/1000 scaled).</p>";
  }

  function bind() {
    document.querySelector("#gap-table tbody").addEventListener("input", function (e) {
      var f = e.target.getAttribute("data-f");
      if (!f) return;
      var id = e.target.closest("tr").getAttribute("data-id");
      current().rows[id][f] = e.target.value;
      save();
      if (f === "missed") return;
      var res = compute(current());
      renderTableCells(res);
      renderOrder(res);
    });
    document.getElementById("attempt-select").addEventListener("change", function (e) {
      data.current = e.target.value; save(); renderTable();
    });
    document.getElementById("add-attempt").addEventListener("click", function () {
      var name = prompt("Name for the new attempt:", "Attempt " + (data.attempts.length + 1));
      if (!name) return;
      var a = newAttempt(name);
      data.attempts.push(a); data.current = a.id; save(); renderSelect(); renderTable();
    });
    document.getElementById("rename-attempt").addEventListener("click", function () {
      var name = prompt("Rename attempt:", current().name);
      if (!name) return;
      current().name = name; save(); renderSelect();
    });
    document.getElementById("delete-attempt").addEventListener("click", function () {
      if (data.attempts.length < 2) { alert("Keep at least one attempt."); return; }
      if (!confirm("Delete \"" + current().name + "\"?")) return;
      data.attempts = data.attempts.filter(function (a) { return a.id !== current().id; });
      data.current = data.attempts[0].id; save(); renderSelect(); renderTable();
    });
    document.getElementById("export-btn").addEventListener("click", function () {
      var ta = document.getElementById("export-out");
      ta.style.display = "block"; ta.value = JSON.stringify(data, null, 2); ta.select();
    });
    document.getElementById("import-file").addEventListener("change", function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var parsed = JSON.parse(rd.result);
          if (!parsed.attempts || !parsed.attempts.length) throw new Error("bad");
          data = parsed; save(); renderSelect(); renderTable();
        } catch (err) { alert("That file isn't a valid gap map export."); }
      };
      rd.readAsText(file);
    });
  }

  // Update priority/rank cells in place so typing isn't interrupted by a full re-render.
  function renderTableCells(res) {
    res.list.forEach(function (x) {
      var tr = document.querySelector('#gap-table tr[data-id="' + x.d.id + '"]');
      tr.querySelector(".p").textContent = x.has ? x.priority : "–";
      var rk = tr.querySelector(".rank");
      rk.textContent = x.has ? "#" + x.rank : "–";
      rk.classList.toggle("rank-1", x.rank === 1);
    });
  }

  init();
  renderSelect();
  renderTable();
  bind();
})();
