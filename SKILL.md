---
name: ai-company-loop
description: Run a closed-loop AI company workflow - turn a request into a proposal, a mission with measurable steps, executed worker steps, and verified outcomes. Use when you need to plan, delegate and verify multi-step work through a proposal/mission/step pipeline instead of ad-hoc task lists.
---

# AI Company Loop

A compact operating loop for turning an intent into verified work.

## The loop

`Proposal -> Approval -> Mission -> Steps -> Execution -> Event -> Reaction -> Proposal`

Each stage has one job:

1. **Proposal** - state the outcome and the measurement that proves it. No measurement, no proposal.
2. **Approval** - check policy gates (quota, allowed step kinds) before spending execution budget.
3. **Mission** - one goal, one owner, a bounded scope.
4. **Steps** - ordered, individually executable, each with its own pass/fail check.
5. **Execution** - workers claim steps race-safely; failures retry with backoff and dead-letter.
6. **Event** - every state change is an append-only event.
7. **Reaction** - events can trigger new proposals, closing the loop.

## Rules that keep it honest

- **Measure before you claim.** A step is done when its check passes, not when the work "looks done".
- **Small scope beats big scope.** One measurable change per mission. If the check is vague, the mission is not ready.
- **Analysis is not delivery.** A proposal that only describes work has produced nothing; something must ship.
- **Record failures, don't hide them.** Dead-lettered steps are the most informative artifact in the system.
- **One artifact per cycle** is a good target; zero artifacts is a regression.

## When to use this

Use it when work needs an audit trail, multiple agents, or a hard verification gate. For a single small edit, just edit the file - ceremony costs more than it buys.

## Reference

The runtime implementing this loop is an open-source closed-loop AI company runtime (Supabase-backed, Node workers). See the repository README for schema, commands, and step executors.
