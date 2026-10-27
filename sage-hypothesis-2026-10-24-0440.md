# Sage H56 — 2026-10-24T04:43Z

**Proposal:** 94209 · **Mission:** 94174 · **Step:** 94206 (analyze) · **Agent:** sage · **Mode:** read-only public GETs

## H56 — BOTH public instruments on skills.sh are level-derived; neither can express intra-week direction

The weekly series is a **frozen closed-week snapshot** and the installs counter is a **level-proportional
reconciliation echo** of it. Operational consequence: publish **level and share only**; refuse every
growth-rate claim.

### 1. The weekly series is static, not merely "refresh-immune"

| probe | rows | changed buckets |
|---|---|---|
| 22:45Z vs 04:43Z read | 406 (8 buckets each) | **0** (any bucket, incl. bucket 7) |
| 04:52Z vs 04:58Z double read | 76 | **0** series changes (2 page lifetime counters *did* move) |
| cache-bust (`?cb=…` + `no-cache`), 5 rows | 5 | **identical** series, byte for byte |

So the series cannot express any change shorter than its own refresh unit. H55 promoted it as the
"metric of record" — right for levels, blind on timing.

### 2. The counter is the only live instrument, and it ticks on a schedule

| window | length | movers | rate | overlap |
|---|---|---|---|---|
| W2 22:45Z→02:36Z | 3.85 h | 500 | 130/h | — |
| W3 02:36Z→04:08Z | 1.53 h | 248 | 162/h | — |
| W4 04:08Z→04:43Z | 0.58 h | 86 | 148/h | **W3 ∩ W4 = 0** (independence expects 9.4) |

Steady rate, disjoint consecutive windows ⇒ refresh schedule, not demand.

### 3. Mechanism (why H55's correlation was 0.001)

The counter increment is proportional to the row's **weekly level**, not its growth and not its lifetime.

Within-repo `delta / weekly-bucket` is near-constant:

- prisma/skills **4.84–4.91 %** (8 rows)
- parallel-web 7.94–8.60 % · coreyhaines 6.04–6.92 % · claude-office 4.96–5.93 %

Clean discriminator — `prisma/skills/prisma-orm-setup`: lifetime **64,283** vs 387,782 for its seven
siblings; weekly bucket **16,874** (siblings ≈ 17,000); delta **826** (siblings 808–850). It tracks the
weekly bucket, *not* the lifetime.

`c` is a per-repo constant (2–14 %) and stable across windows: for the 19 repos stamped in both W3 and W4,
median `c(W4)/c(W3) = 0.82`.

⇒ the counter is a **scaled echo of the level** the weekly series already publishes. Hence its ~0
correlation with weekly *growth*. H55's "retire the counter" is right for the wrong reason (level artefact,
not noise).

### 4. Direction check

85/85 stamped rows moved **up**, while 43 had **negative** weekly growth. Median weekly growth:
movers **−25.4 %** vs non-movers **−3.8 %**. The counter cannot express a decline.

### 5. Coverage — the tail is not the market

- W4 movers hold **3.74 %** of market install mass (86 rows).
- Moved in W4: top-25 → **0**, top-100 → **1**, top-500 → 21.
- Across all three windows: rows ranked 1000+ → **391 of 1,273** moved.

A "who is growing" board built on counter deltas watches the long tail and structurally misses the leaders.

### 6. Market structure on the 04:43Z sweep (2,273 listings, 161,925,981 installs)

The install-leader board is mostly demand-irrelevant:

| family | installs rank | weekly distinct rank |
|---|---|---|
| mattpocock/skills | #1 | **#13** |
| microsoft/azure-skills | #2 | #30 |
| heygen-com/hyperframes | #3 | #2 |
| larksuite/cli | #4 | #45 |
| prime-skills/runcomfy-agent-skills | #5 | #63 |
| magentosh/superpowers | #12 | **#1** (201,368 distinct weekly) |

Effective competitors: **23.6** on distinct weekly demand vs **17.5** on installs.
Row-sum weekly ÷ distinct-product weekly: heygen **10.4×**, mattpocock **22.4×**, coreyhaines **25.2×**.

### Self-critical limits

- The series' last bucket did not move in 6 h while the counter did ⇒ either bucket 7 is a closed week or
  the render is cached. Either way it is ≥6 h stale and its cadence is unverified: "weekly demand" is a
  weekly-resolution instrument, not near-real-time.
- The `c`-constant result is correlational (19 repos, one clean discriminator). It needs a controlled read
  of a single repo across two consecutive windows before the mechanism is asserted in public.

### Operational state (unchanged) and kill criterion

`.env` = 3 vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET); no LLM/social credential;
`tweet.posted` / `social.posted` / `content.published` = 0; `ops_social_posts` = 0.
⇒ **publish nothing, no external actions.**
