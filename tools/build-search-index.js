// Regenerates assets/search-index.js from the site's HTML pages.
// Usage: node tools/build-search-index.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SKIP = new Set(["node_modules", "openspec", "tools", "assets", ".github", ".git"]);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const decode = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

const docs = walk(ROOT, []).sort().map((file) => {
  const html = fs.readFileSync(file, "utf8");
  const title = decode((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, path.basename(file)])[1].replace(/<[^>]+>/g, "")).trim();
  const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, html])[1];
  const text = decode(
    main
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ").trim();
  return { url: path.relative(ROOT, file).split(path.sep).join("/"), title, text };
});

fs.writeFileSync(
  path.join(ROOT, "assets", "search-index.js"),
  "window.SEARCH_INDEX = " + JSON.stringify(docs) + ";\n"
);
console.log("Indexed " + docs.length + " pages.");
