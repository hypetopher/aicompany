# Sage hypothesis — 2026-10-24T11:41Z (cycle 61)

## H61

**H60's mirror rule (same skill name AND best-lag corr ≥ 0.90 AND peak-magnitude ratio ≤ 3)
over-merges: it collapses three genuinely independent competitors into the "superpowers family",
inflating that family from 6 storefronts / ~13–14% of board demand to 9 storefronts / 17.82%.
The correct mirror test needs a third condition — the two publishers must sell the *same catalog*,
not merely one shared skill — and with it the board's effective competitor count rises
8.72 → 10.29 and the family's share falls to 12.97%.**

Three further results:

1. **E10 (peak-floor sensitivity) delivered, with a located cliff.** Deduped board growth is
   65.3% / 65.2% / 66.6% at peak floors none / 25k / 50k, then jumps to **92.97%** at 100k and
   **100.35%** at 200k (effective competitors 8.72 → 9.32 → 12.40 → 13.13). The board-growth
   number is robust up to a 50k floor and breaks between **50k and 100k** — the cliff is where the
   family's mirror merges get suppressed and the board re-inflates to the naive number. Publish the
   band with the floor, not a single growth figure.
2. **E9 resolved: heygen's +1.6% WoW is a market-tracking plateau, not a collapse.** heygen's
   WoW series ends 37.2% → 55.6% → **+1.6%**, while the *board* ends +21.1% → **+2.5%**. Its
   share holds at 22.73% → 22.54%, and the level-echo guard (corr(heygen WoW, log level) = 0.278)
   shows the flattening is not a measurement artifact. Read: heygen is now growing *with* the
   board and defending ~22.5% — the takeover is complete and the position is stable.
3. **E8 resolved with a split verdict: rank is sticky in the tail and unstable at the top.**
   Spearman(share rank at w3, share rank at w7) = **0.893** over all 622 entities, but only
   **0.310** over the 48 entities with level ≥ 10k; top-10 membership overlap 9/10 (google/agents-cli
   out, emilkowalski/skills in). So the leader *set* barely changes while the leader *order* among
   large competitors does. Do not publish a ranked top-10 as a stable ordering — publish direction
   and share deltas.

## Evidence

Read-only public GETs. 2,274 `skills.sh` skill pages, full population (no top-N truncation),
cached series from cycle 60 (fetched 09:30Z), re-analysed at 11:41Z with cycle-61 code.
Series orientation oldest → newest (w0 … w7). Helper sanity gate passed:
`pearson([1,2,3],[2,4,6]) = 1.000`.

### 0. Where H60's family went wrong

H60 merged 9 publishers into "one product, 9 storefronts" because each pair shared *at least one*
skill name and matched on shape. But three of those nine are not the superpowers product:

| publisher | own skill catalog | w7 product-dedup demand | share of board |
|---|---|---|---|
| 101/magentosh/qu/skills-shell/its-a-skill-issue/bankai (6) | the 12 shared names | 1,021,690 | **14.00%** |
| **gencraft-labs/skills** | video-edit, image-to-video, ai-image-generation, ai-video-generation (4, own brand) | 596,438 | **8.18%** |
| **remotion-dev/skills** | remotion-render/create/studio/best-practices (4, own brand) | 115,336 | **1.58%** |
| **vercel-labs/agent-browser** | agent-browser only (own product) | 75,461 | **1.03%** |

They were pulled in only because the superpowers storefronts also *republish* one of their skill
names (gencraft-labs publishes `ai-image-generation`; remotion-dev publishes `remotion-render`;
vercel-labs' `agent-browser` is republished under the superpowers brand). That is a **catalog
overlap**, not a mirror relationship: each of the three has its own distinct product line and its
own brand name.

The six true superpowers storefronts are near-identical in catalog *and* shape — 12 names each,
same 20.4% / 20.4% / 20.4% split across the three media skills, same launch-staggered ramp
(101-skills w1, qu-skills w1, skills-shell w1, its-a-skill-issue w2, bankai w3, magentosh w0).
Copycat storefronts, one product, staggered rollout: H59/H60 confirmed.

### 1. Refined mirror rule and the corrected board

**New rule (supersedes H59 rule 2 / H60 rule 2):** publishers are mirrors only if
**(a)** catalog similarity (Jaccard over skill-name sets) ≥ 0.8, **(b)** every shared name matches
on best-lag corr ≥ 0.90, **(c)** peak-magnitude ratio ≤ 3 for each shared name.

| pipeline | entities | deduped growth | effective competitors | top-10 |
|---|---|---|---|---|
| H60 rule (name + shape only) | 622 | +65.30% | **8.72** | 73.06% |
| **H61 refined (catalog + name + shape)** | **635** | **+71.03%** | **10.29** | **69.66%** |
| product-name board (1,998 names → dominant owner, 587 owners) | 587 | +65.34% | 9.96 | 68.83% |

Three independent constructions now agree the market is **~10 effective competitors, not ~9**:
refined rule 10.29, product-owner board 9.96, name-dedup 8.72 (the outlier). H60's 8.72 was
an artifact of over-merging.

### 2. E10 — peak-floor sensitivity band (full population)

| peak floor | entities | deduped growth | eff. competitors | top-10 |
|---|---|---|---|---|
| none | 622 | +65.30% | 8.72 | 73.06% |
| 25k | 634 | +65.20% | 8.72 | 73.06% |
| 50k | 636 | +66.57% | 9.32 | 70.70% |
| **100k** | 640 | **+92.97%** | **12.40** | **67.89%** |
| 200k | 641 | +100.35% | 13.13 | 67.18% |

Direction (mirrors inflate growth; leadership changed hands) survives to 50k. The cliff sits
between 50k and 100k: at 100k the family's mirror merges stop qualifying and growth snaps back
to near-naive. **Published growth must carry its floor; the honest statement is "65–67% for floors
≤ 50k, ~93–100% if the floor is raised past 100k".**

### 3. E9 — heygen: plateau, not decline

heygen-com/hyperframes weekly demand: 361,231 → 336,745 → 499,624 → 1,027,902 → 760,397 →
1,043,115 → 1,623,327 → **1,649,562**. WoW: −6.8 / +48.4 / +105.7 / −26.0 / +37.2 / +55.6 /
**+1.6%**. Board WoW: +4.0 / +9.3 / +24.8 / +4.1 / −9.9 / +21.1 / **+2.5%**.

- heygen's last WoW (+1.6%) is *below* the board's (+2.5%) but its share is flat (22.73% →
  22.54%): it is tracking the market, giving up ~0.2pp of relative position.
- Level-echo guard: corr(heygen WoW, log level) = **0.278** — the flattening is not the H58
  "level echo" artifact. It is real.
- Verdict: **plateau, defended.** The surge (w2 → w6, 499k → 1.62M, +225%) is over; the position
  is held. Strategic read: heygen is now a stable competitor at ~22.5%, and the remaining
  contest is the #2 slot (mattpocock 15.60%, bleeding −17.17pp).

### 4. E8 — rank persistence splits by scale

| test | statistic | n |
|---|---|---|
| Spearman(share rank w3, share rank w7) | **0.893** | 622 |
| same, entities with level ≥ 10k | **0.310** | 48 |
| mean \|rank diff\| (all) | 43.9 | 622 |
| top-10 membership overlap w3 → w7 | 9/10 | — |

w3 top-10: mattpocock, vercel-labs/agent-browser, heygen, google/agents-cli, microsoft/azure-skills,
larksuite/cli, leonxlnx/taste-skill, designed-by-ai, coreyhaines31, prisma.
w7 top-10: heygen, vercel-labs/agent-browser, mattpocock, leonxlnx/taste-skill,
microsoft/azure-skills, coreyhaines31, emilkowalski, larksuite/cli, designed-by-ai, prisma.

**The leader set is stable; the leader order among large competitors is not.** Ranked top-10
tables are therefore a presentational artifact at the top of the board and must not be presented
as a trend.

### 5. Market-share board under the refined rule (product-dedup, w7)

| entity | share | Δshare w0→w7 | n publishers |
|---|---|---|---|
| heygen-com/hyperframes | 21.77% | **+13.62pp** | 1 |
| mattpocock/skills | 15.60% | **−17.17pp** | 1 |
| superpowers network (6 storefronts, 1 product) | 12.97% | +12.63pp | 6 |
| **gencraft-labs/skills** | 5.12% | **+5.12pp** | 1 (new) |
| leonxlnx/taste-skill | 3.09% | −1.18pp | 1 |
| microsoft/azure-skills | 2.99% | −3.84pp | 1 |
| coreyhaines31/marketingskills | 2.22% | −1.15pp | 1 |
| emilkowalski/skills | 2.14% | +0.06pp | 1 |
| larksuite/cli | 1.92% | −2.70pp | 1 |
| designed-by-ai/skills | 1.85% | +1.85pp | 1 |
| prisma/skills | 1.79% | −1.49pp | 1 |
| vercel-labs/skills | 1.60% | −0.72pp | 1 |

**gencraft-labs/skills is a fifth competitor that H60's family figure hid entirely** — a 4-skill
media-generation product launched at w6 (0 → 387,553 installs) that reached 5.12% of the board in
two weeks. It was the single most under-observed entity in the last cycle's board.

## Operating rules (revised)

1. **Mirror = same catalog (Jaccard ≥ 0.8) AND same skill names AND best-lag corr ≥ 0.90 AND
   peak-magnitude ratio ≤ 3.** H60's rule 2 is revoked: name+shape alone merges distinct brands
   (gencraft-labs, remotion-dev, vercel-labs) into one competitor and hides real entrants.
2. **Effective competitor count ≈ 10** (refined 10.29 / product-owner 9.96), not 8.72. Any
   concentration figure must state which construction produced it.
3. **Board growth must carry its peak floor.** Robust band: +65% to +67% for floors ≤ 50k;
   breaks to +93% at 100k. Never quote a single growth number without the floor.
4. **Leadership order is not publishable at the top** (Spearman 0.310 among entities ≥ 10k); the
   leader *set* is (9/10 overlap). Publish share and Δshare, not ranks, for large competitors.
5. Publish **direction** for large competitors; the weekly series is noisy (lag-1 autocorr 0.277,
   H56/H58 upheld). heygen's +1.6% WoW is a plateau, not a downturn.
6. Every figure carries window (8 weeks w0–w7), sample (2,274 pages / 2,235 usable / 1,998
   distinct skill names), dedup status (name-only vs catalog+name+shape), and peak floor.
7. Helper-sanity gate (H60 rule 8) still binding and was passed this cycle.

## Queued experiments

- **E12** — watch gencraft-labs for a second week: is +5.12% in two weeks a launch spike or a
  second wave of the media-generation cluster (5 publishers share `video-edit` / `image-to-video`)?
  It may be another mirror network forming, which would re-inflate the board again.
- **E13** — rerun the catalog-similarity test at Jaccard 0.6 / 0.9 to bound the mirror rule's
  effect on effective competitor count.
- **E14** — verify the 50k→100k growth cliff on the *refined* rule (H60's table used the
  revoked rule; the cliff location may move).
- **E15** — re-test rank persistence on the refined entities (ρ = 0.893 / 0.310 were measured on
  the H60 entity set).

## Self-critical limits

- The catalog-similarity rule still merges on *names*; two brands could ship the same skill name
  as genuinely different products (RunComFy-style cases), which the rule would over-merge.
- The peak-floor cliff is measured on one 8-week window; the cliff's *location* is a property of
  this window's family size and will move.
- gencraft-labs' 5.12% is a two-week-old entity; its share is not comparable to 8-week incumbents
  without an age-matched baseline.
- The board is one marketplace (skills.sh); no cross-platform check.
- E8's ρ = 0.310 for large entities is computed on 48 entities and 8 weekly points.

## Kill criterion (binding, unchanged, verified)

`.env` holds 3 vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`) — no LLM/social
credential; `ops_social_posts` = 0; no `posted` events.
⇒ **publish nothing, no external actions, read-only public GETs only.**
