---
name: growth-intel
description: Run a measurable growth experiment cycle - detect opportunities and risks, pick one small hypothesis, ship an artifact, and read the resulting signal. Use when you need growth analysis that ends in a shipped, measurable change rather than a report.
---

# Growth Intel

A growth cycle ends in a shipped artifact with a number attached to it.

## The cycle

1. **Read the signal** - recent events, shipped artifacts, queue state, and the surfaces where users actually are. Numbers, not impressions.
2. **Name the risk** - what is the risk of doing nothing? If the honest answer is "nothing", skip the cycle; do not manufacture urgency.
3. **Pick one hypothesis** - one sentence, falsifiable, with a metric that moves if it is true.
4. **Ship one artifact** - small, in one commit or one PR. Analysis is not delivery.
5. **Measure** - the metric from step 3, plus a counter-metric so you can see if you traded one problem for another.

## Rules that keep it honest

- **One artifact per cycle.** Zero artifacts is a regression, not a quiet cycle.
- **No metric, no experiment.** If you cannot name the number that changes, you have a task, not an experiment.
- **Ship the boring version.** A small artifact that exists beats a large one that is planned.
- **Write down what you shipped.** A cycle that produced an artifact but no record teaches nobody anything.
- **When a cycle produces only analysis, the pipeline is the problem.** Fix the ability to ship, not the analysis.

## Anti-patterns

- Another report that restates the previous report.
- Measuring a surface nobody looks at.
- Shipping to a repo that is not yours without an explicit allowlist.
- Counting proposals as progress. Proposals are requests, artifacts are progress.

## Reference

Pairs with the `ai-company-loop` skill in the same plugin: growth decides what to ship, the loop decides how to ship it with a verification gate.
