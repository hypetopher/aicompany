---
name: market-research-playbook
description: Run a small, measurable market-research cycle - scope the question, gather evidence from primary sources, size the opportunity, name the risks, and ship one testable conclusion with a number attached. Use for market research, competitive analysis, market intelligence, competitor teardown, or research-report work where the output must be evidence-backed rather than a summary.
---

# Market Research Playbook

A market research pass ends in a decision someone can act on, with the evidence attached.

## The cycle

1. **Frame one question** - "should we enter X?" is a decision. "What is the market for X?" is an infinite report. Write the question in one sentence and name the decision it changes.
2. **Bound the market** - define the buyer, the job they hire the category for, and the substitute they use today. Size the market from the bottom up (buyers x frequency x price) and sanity-check top-down. When the two disagree by more than 3x, the disagreement is the finding.
3. **Find the primary evidence** - pricing pages, install/usage counters, changelogs, job postings, repo activity. Third-party summaries are leads, not evidence; cite the source and its date next to every number.
4. **Name the risks that would kill it** - for each risk, name the leading indicator you can observe before the risk lands. A risk with no observable indicator is a worry, not a risk.
5. **Ship one conclusion** - one paragraph, one number, one recommendation, plus the one experiment that would falsify it.

## Rules that keep it honest

- **Every number names its unit and its source.** "40% of the market" is not a number; "40% of 312 surveyed maintainers, GitHub API, 2026-10-26" is.
- **Counter-metric or no decision.** Say what would get worse if the recommendation is right, so the reader can watch both sides.
- **Rank is not flow.** A listing that holds rank #1 with zero installs is a dead slot, not a win. Always pair rank with a movement series.
- **Check for clones before copying a name.** One copy of a name takes the traffic; the other copies get 0-1. A name with no owner yet is worth more than a proven name you would be the second copy of.
- **Prefer the distributed lane.** When one listing owns most of a lane's flow, that lane's traffic is upstream-derived and will not transfer to you.
- **Ship the boring version.** One page with a number beats a deck that says "market is large".

## Anti-patterns

- A landscape dump with no decision attached.
- Quoting one install counter as evidence of demand without the weekly series behind it.
- Treating a search rank as a growth channel.
- Recommending a move with no falsifying experiment.

## Reference

Pairs with the `growth-intel` skill in the same plugin: this playbook decides what is true about the market, growth-intel decides what to ship and how to measure it.
