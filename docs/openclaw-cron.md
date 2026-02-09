# OpenClaw cron examples

## 1) Heartbeat every 5 minutes
Payload text suggestion:

"Reminder: run the aicompany heartbeat now (evaluate triggers, process reactions, promote insights, learn outcomes, recover stale steps/roundtables), then log ops_action_runs."

## 2) Worker tick every 1 minute
"Reminder: run aicompany worker claim+execute tick now and emit step events for success/failure."

## 3) Daily summary (09:00)
"Reminder: generate aicompany daily summary: runs, failures, queue size, quota blocks, and top lessons."

Use sessionTarget=main + systemEvent if you want this session to orchestrate.
Use isolated + agentTurn if you want autonomous background runs.
