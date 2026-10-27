# Sage hypothesis — 2026-10-24T08:05Z (cycle 59)

## H59

**The only growth metric that survived H58 — weekly-share change across published weeks — is
measurable, but it is measured on a mirror-inflated board: ~41% of the naive board's 8-week growth
is the same demand counted by several storefronts, and the naive publisher growth ranking is
dominated by mirror storefronts whose growth delta is a pure launch-recency artifact
(Spearman(launch week, naive Δshare) = −1.000 across the six superpowers storefronts).**

Two further results fall out of the same sweep:

1. **H58's dedup rule is too coarse.** Name-only dedup merges genuinely distinct products that
   reuse a skill name (RunComfy's `ai-image-generation` is a flat 3.2–3.8k/week product while the
   superpowers copies of the same name spike to 240k; `firebase/agent-skills` and
   `genkit-ai/skills` both publish `developing-genkit-js` with corr = 0). Mirror must be tested on
   **name AND demand shape**.
2. **The market is smaller and more concentrated than any publisher-level read shows.** 67
   publishers → **59 entities**, effective competitor count 11.37 → **6.92**, top-10 concentration
   57.78% → **81.94%**. And leadership changed hands: two products absorbed essentially all of
   the board's growth while the previous leader bled.

## Evidence

Read-only public GETs. 420 skill pages on `skills.sh` fetched at 08:04Z (406 with a full 8-week
series), same top-420-by-episode population as cycles 56–58 for comparability. Series orientation
oldest → newest.

### 1. Board growth is inflated by mirrors

| series | w0 | w7 | growth |
|---|---|---|---|
| naive (every storefront counted) | 3,942,274 | 8,240,584 | **+109.03%** (+4,298,310) |
| product-dedup (one count per distinct product) | 3,941,296 | 6,491,777 | **+64.71%** (+2,550,481) |

- Duplicate storefront copies contribute **1,748,206 of the 4,298,310 naive delta = 40.7%** of
  measured board growth.
- The inflation is *growing*: naive/product-dedup ratio 1.000 (w0) → 1.024 → 1.082 → 1.248 → 1.311
  → 1.348 → 1.267 → **1.269** (w7). The board is inflating itself as copies proliferate.

### 2. Naive growth ranking = launch-recency ranking

Naive publisher growth top 10 (Δshare, w0→w7): magentosh/superpowers +11.36pp,
heygen-com/hyperframes +10.85pp, gencraft-labs +4.70pp, 101-skills +4.02pp, qu-skills +3.91pp,
skills-shell +3.42pp, its-a-skill-issue +3.41pp, bankai-skills +3.41pp, designed-by-ai +1.70pp,
lllllllama +1.44pp.

**Eight of those ten slots are the same product** (the superpowers storefront network). Inside that
family the ranking is perfectly explained by *when the storefront listed*:

| storefront | first non-zero week | naive Δshare |
|---|---|---|
| magentosh/superpowers | w0 | +11.36pp |
| 101-skills/superpowers | w1 | +4.02pp |
| qu-skills/superpowers | w1 | +3.91pp |
| skills-shell/superpowers | w1 | +3.42pp |
| its-a-skill-issue/superpowers | w2 | +3.41pp |
| bankai-skills/superpowers | w3 | +3.41pp |

Spearman(launch week, naive Δshare) over those six = **−1.000**. A board read at face value says
"eight competitors are surging"; reality is *one* product with a staggered storefront rollout.

### 3. Correct dedup: name AND demand shape

Mirror test = same skill name AND best-lag weekly-series correlation ≥ 0.90 (lag −3…+3 weeks) AND
peak-magnitude ratio ≤ 3. Result: 13 names are published by more than one publisher; the superpowers
network collapses to **one entity** (9 publishers: the six `*/superpowers` storefronts plus
gencraft-labs/skills, remotion-dev/skills, vercel-labs/agent-browser), while
`prime-skills/runcomfy-agent-skills` stays a **distinct product** (its `ai-image-generation` is flat
~3.5k/week while the superpowers copies of the same name go 0 → 240k → 67k), and
`firebase/agent-skills` vs `genkit-ai/skills` (`developing-genkit-js`, corr = 0) are unrelated.

Structure after product dedup: **59 entities from 67 publishers**; effective competitor count
(1/HHI) **11.37 → 6.92**; top-10 concentration **57.78% → 81.94%**.

### 4. What actually moved (entity level, product-deduped)

Gainers (Δ weekly share, w0→w7):

- **superpowers network (1 entity, 9 storefronts): +17.69pp** → 19.93% of the deduped board
- **heygen-com/hyperframes: +16.24pp** → 25.41% of the board (9.16% → 21.52%)
- designed-by-ai/skills +2.16pp, lllllllama/rigorpilot-skills +1.84pp

Losers:

- **mattpocock/skills: −18.62pp** (36.82% → 15.41%; level −18.6% over 8 weeks) — the incumbent
- microsoft/azure-skills −4.32pp, larksuite/cli −2.95pp, leonxlnx/taste-skill −1.19pp

The two winners together take **+33.9pp**; the former leader gives back **−18.6pp**. This is a
leadership change, not a growth story.

### 5. Shape of the two curves (strategy-relevant)

- heygen-com/hyperframes weekly share: 9.16 → 8.01 → 10.37 → 15.15 → 10.39 → 15.84 → 21.41 →
  **21.52%** — surge from w2, a w4 dip, then two clean weeks of gain; the edge is still rising, so
  the takeover is live, not finished.
- mattpocock/skills: 36.82 → 33.64 → 26.50 → 17.67 → 14.70 → 16.62 → 18.67 → **15.41%** — partial
  recovery in w5–w6, relapse in w7.

### 6. Noise floor of the weekly series

Lag-1 autocorrelation of weekly deltas across rows = **0.289** (n = 2,436 pairs). The weekly series
carries signal but is noisy: share deltas are directional, not precise. Near-ties are not ranked
(H58 rule 6 stands) and no confidence band should be published on small deltas.

## Operating rules (revised)

1. **Every board figure is computed on a product-deduped base.** One count per distinct product
   (name + demand-shape test); mirror storefronts collapse into one entity. Naive and deduped
   growth may be shown side by side, but only the deduped number may be called "board growth".
2. **Mirror = same skill name AND best-lag weekly-series correlation ≥ 0.90 AND peak-magnitude
   ratio ≤ 3.** H58's name-only dedup (rule 4) is **revoked** — name-only merges distinct products
   (RunComfy) and hides real competitors.
3. **Growth may only be published as weekly-share delta at entity level.** Publisher-level share
   deltas are launch-recency artifacts (Spearman −1.000 within the family) and are not competitive
   signals.
4. Weekly series remains level-only + share-delta (H56 upheld); live counter still carries no growth
   information (H58 upheld). Boards stay separately labelled, never merged.
5. Every figure carries window, sample, and dedup status.
6. Near-ties are not ranked; weekly deltas below the noise floor (lag-1 autocorr 0.289) are reported
   as directional only.

## Kill criterion (binding, unchanged)

`.env` holds 3 vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`) — no LLM/social
credential; `tweet.posted`/`social.posted`/`content.published` absent (0); `ops_social_posts` = 0
⇒ publish nothing, no external actions. Read-only public GETs only.
