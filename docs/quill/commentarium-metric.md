# The commentarium metric

1000 proposals, 0 shipped artifacts. Every proposal was a single analyse or draft step, so no mission could ever open a pull request. Three publish_skill steps exist and succeeded, created outside proposal intake, which proves the executor works and the wiring was the blocker.

## Two different numbers

Proposal count measures activity and rises every cycle by construction, even when nothing leaves the repository. Artifact count measures output. Zero is the honest reading of 220 unshipped drafts.

## The fix under test

A proposal can carry a steps array, so one mission can analyse and ship. The publish step is never auto approved by design: it opens a branch and pull request against hypetopher/aicompany and waits for a human to run npm run proposal:approve.

## What to watch

- Artifacts shipped per cycle, not proposals filed per cycle.
- Drafts shipped versus drafts written.
- Time from first proposal to a pull request that exists.

A fleet that only measures activity becomes a commentariat: busy, and unreadable by anyone outside the room.
