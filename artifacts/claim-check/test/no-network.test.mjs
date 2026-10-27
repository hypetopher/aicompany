// Proves the checker has no network and no model path.
// Poison every plausible egress global, run the full corpus, assert zero attempts.
// v0.5: extends coverage to the DECLARATION checker and the bundler path.
import { readFileSync, readdirSync, statSync } from "node:fs";

let attempts = [];
const poison = (name) => (...args) => { attempts.push(name); throw new Error(`EGRESS ATTEMPT: ${name} ${JSON.stringify(args)}`); };
globalThis.fetch = poison("fetch");
globalThis.XMLHttpRequest = poison("XMLHttpRequest");
globalThis.WebSocket = poison("WebSocket");
try { Object.defineProperty(globalThis, "navigator", { value: { sendBeacon: poison("sendBeacon") }, configurable: true }); } catch { /* navigator is getter-only in this runtime */ }
const net = await import("node:net");
net.Socket.prototype.connect = poison("net.connect");
const tls = await import("node:tls");
try { tls.default.connect = poison("tls.connect"); } catch { /* read-only module namespace */ }
const https = await import("node:https");
try { https.default.request = poison("https.request"); } catch { /* read-only module namespace */ }
const http = await import("node:http");
try { http.default.request = poison("http.request"); http.default.get = poison("http.get"); } catch { /* read-only module namespace */ }
const dns = await import("node:dns");
try { dns.promises.lookup = poison("dns.lookup"); dns.default.lookup = poison("dns.lookup"); } catch { /* read-only module namespace */ }

const { checkExchange } = await import("../src/check_exchange.mjs");
const owned = JSON.parse(readFileSync("corpus/own/exchanges.json", "utf8"));
let n = 0;
for (const ex of owned) { checkExchange(ex); n++; }

// v0.5: declaration checker, over the owned corpus AND the external corpus.
const { verdictForDeclaration } = await import("../src/check_declaration.mjs");
const decls = JSON.parse(readFileSync("corpus/own/declarations.json", "utf8"));
let d = 0;
for (const c of decls) { verdictForDeclaration(c.declaration); d++; }

const idx = JSON.parse(readFileSync("corpus/forge/index.json", "utf8"));
let f = 0;
for (const r of idx.rows) {
  const txt = readFileSync("corpus/forge/" + r.file.replace("corpus/forge/", ""), "utf8");
  verdictForDeclaration(txt);
  f++;
}

// v0.7: the THIRD external corpus (shootout) must not reach out either.
const shootIdx = JSON.parse(readFileSync("corpus/shootout/expected/index.json", "utf8"));
let sh = 0;
for (const e of shootIdx) {
  const dir = `corpus/shootout/corpus/${e.id}`;
  for (const f of readdirSync(dir, { recursive: true })) {
    const p = `${dir}/${f}`;
    if (!statSync(p).isFile()) continue;
    verdictForDeclaration(readFileSync(p, "utf8"));
    sh++;
  }
}

// v0.5: the bundler path must not reach out either.
const { buildBundle } = await import("../src/build_bundle.mjs");
const bundled = buildBundle();
if (!bundled.includes("verdictForDeclaration")) {
  console.error("FAIL: bundle is missing the declaration checker");
  process.exit(1);
}

if (attempts.length > 0) {
  console.error(`FAIL: ${attempts.length} egress attempt(s): ${attempts.join(", ")}`);
  process.exit(1);
}
console.log(`PASS: no-network - ${n} exchanges, ${d} owned declarations, ${f} forge declaration files, ${sh} shootout files, bundle ${bundled.length} bytes, 0 egress attempts`);
