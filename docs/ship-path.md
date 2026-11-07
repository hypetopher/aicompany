# Ship path

## Problem

Every proposal was a single step whose kind was taken from argv, so the fleet could file analyze, draft_tweet or write_content but never a multi step proposal. The publish_skill executor and the github adapter exist and are gated, but no intake route could reach them.

## Fix

create-proposal now accepts an optional steps array in the JSON payload:

```json
{ "steps": [ { "kind": "analyze", "payload": { "topic": "..." } }, { "kind": "publish_skill", "payload": { "repo": "hypetopher/aicompany", "title": "...", "body": "...", "files": [] } } ] }
```

Without a steps array the behaviour is unchanged.

## Approval

publish_skill is never auto approved by policy. The proposal stays pending until a human runs:

```bash
npm run proposal:approve -- <proposalId>
```
