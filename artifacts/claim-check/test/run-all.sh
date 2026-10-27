#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
node src/run_corpus.mjs
node src/calibrate.mjs corpus/gittifacts
node test/declaration-corpus.test.mjs
node test/determinism.test.mjs
node test/no-network.test.mjs
node test/shootout.test.mjs
node --test test/sarif.test.mjs
node src/build_bundle.mjs
echo "--- declaration calibration (external corpus) ---"
node src/calibrate_declaration.mjs | head -40
echo "--- third external corpus: shootout, side by side with 10 third-party configs ---"
node src/calibrate_shootout.mjs

echo "--- frontmatter scope analysis ---"
node src/frontmatter_scope.mjs | head -25
