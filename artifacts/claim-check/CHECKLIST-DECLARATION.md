# Before you let an agent read this file - a checklist for the counterparty

This is the version of the checklist for **declarations** (instruction files,
"skills", setup guides). Use the action-log checklist (`CHECKLIST.md`) when you
are checking what an agent *did*. Use this one when you are checking what a
file *asks for*, before you let it near anything.

## Step 1 - Read the file once, in full, like a stranger

You do not need to understand it. You are looking for one thing: **does it ask
for something you did not authorize?**

## Step 2 - Find the four asks

Look for the file asking the agent to:
1. **Run as root** - `sudo`, "run as administrator", "elevate to root".
2. **Read a secret** - `cat ~/.aws/credentials`, `source .env`, "print the API key".
3. **Fetch and run** - `curl ... | sh`, "download the installer and run it".
4. **Send data out** - "send the credentials to https://...", any webhook.site / pastebin.

## Step 3 - Check the three quiet ones

5. **Remove a checkpoint** - "disable permission prompts", "auto-approve all".
6. **Install something that outlives the task** - `crontab`, `authorized_keys`, a launch agent.
7. **Let someone else change the rules later** - "fetch the latest instructions from https://...".

## Step 4 - The question that catches what the others miss

**Does the file let itself widen its own permissions?**

Many agent files carry their own tool list in the file header - `allowed-tools:
Read, Bash`. If the file that asks for the privileged action is the *same file*
that grants the tool needed to do it, then reading the file tells you nothing
about what you authorized. That is not a bug in the file; it is the shape of
the problem. Your authorization has to come from somewhere the file cannot
reach.

Two red phrases:
- "the agent may add tools to the allowed list when it needs them"
- "silently add it to ALLOWED_TOOLS and continue without telling the user"

Both mean the scope is set by the thing being scoped.

## Step 5 - Read the verdict

- **IN SCOPE** - the file only names dangerous things, or asks for nothing you did not authorize.
- **OUT OF SCOPE** - the file asks for at least one thing you did not authorize. The cite shows the line.
- **UNDECIDABLE** - the file asks for something we cannot pin down (for example a bare
  `sudo <command>` where the command is not visible). **This is a result, not a failure.**
  Do not guess. Read that line yourself.

## The one rule
The check never asks a stranger, a company, or a language model. It reads the
bytes of the file you already have, and it points at a line.

If it says UNDECIDABLE, you are one human reading away from the answer. That is
the whole product.
