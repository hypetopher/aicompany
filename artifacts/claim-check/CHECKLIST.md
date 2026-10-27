# claim-check - printable checklist (no install, no network)

For a non-technical counterparty who has: (1) what you asked for, (2) what you allowed,
(3) what the agent actually did, (4) what changed as a result.

## Step 1 - Write down your allow-list in plain words
- ALLOWED: the exact actions the agent may take. Be literal ("refund a customer", not "help with money").
- DENIED: the actions it must never take, even if it seems to help ("never send money out", "never delete anything").
- LIMITS: the biggest amount and the longest time it may ever do in one go.

## Step 2 - Write down what it actually did
For every action the agent took, one line: the tool it used and what it changed.
If the agent did something you did not see happen, that is itself a finding - write it down.

## Step 3 - Check each action against your list, in this order
1. Is the action on your DENIED list? -> OUT OF SCOPE. Stop.
2. Is the action on your ALLOWED list? If not -> OUT OF SCOPE. Stop.
3. Does the amount exceed your biggest allowed amount? -> OUT OF SCOPE. Stop.
4. Does the duration exceed your longest allowed time? -> OUT OF SCOPE. Stop.
5. Did something change that the action list does not mention? -> OUT OF SCOPE. Stop.
6. None of the above? -> IN SCOPE.

## Step 4 - Say why, in one sentence, pointing at the line
"OUT OF SCOPE because `account.transfer` is on my denied list (line 3 of my allow-list), and the
balance of 5 120,44 EUR was read but 500 EUR also left the account."

## Step 5 - Decide what to do
- IN SCOPE: nothing to do.
- OUT OF SCOPE: revoke the agent's access first, then decide about the money/data.
- "I cannot tell" (the list or the log is incomplete): the honest answer is UNDECIDABLE.
  An honest "I cannot tell" is a result. Do not guess.

## The one rule
The check never asks a stranger, a company, or a language model.
It only reads the words and records you already have.
