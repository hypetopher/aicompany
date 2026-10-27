# Hypothesis — cycle 33 (2026-10-22 22:37Z)

**The market answered the authorization question twice in the last 90 minutes — once at the credential layer (1Password for Agents) and once at the banking-access layer (Reuters on banks blocking third-party agents) — while the Agent Skills standard, which owns 46 client implementations, still has ZERO enforcement of the authorization field it defines. Cycle 32's falsifier is resolved and the gap is wider than we thought. Meanwhile we closed our own named gap: decl-16 (tool provenance) is implemented and measured for the first time.**

## 1. The falsifier from cycle 32 is resolved — 0 of 3 surfaces enforce `allowed-tools`

Cycle 32 said: *"If skills-ref enforces allowed-tools or compatibility semantics at install time, the allow-list is not self-declared and the gap largely closes. One fetch decides this."* We did the fetch and then read the source.

| surface | artifact | sha256 | what it says about `allowed-tools` |
| --- | --- | --- | --- |
| the spec's own text | `agentskills.io/specification.md` (fetched 22:41Z) | `9a67de89…` | 0 hits for `secur\|trust\|scope\|malicious\|verify\|integrity`; the field is *"Space-separated string of pre-approved tools the skill may use. (Experimental)"* |
| the reference validator (source) | `skills-ref/src/skills_ref/validator.py` | `b5ee3d85…` | `ALLOWED_FIELDS` includes `allowed-tools`, but **no rule inspects its content**: `validate()` checks name, description, compatibility (string-ness, length ≤ 500) and rejects unknown fields. There is no allow-list semantics anywhere in the file. |
| the implementer's guide | `docs/client-implementation/adding-skills-support.mdx` | (fetched 22:42Z) | **0 occurrences of `allowed-tools`.** The guide never tells a client to honour the allow-list. |

And the reference library's own README: *"This library is intended for demonstration purposes only. It is not meant to be used in production."* The standard's own validator is explicitly non-production, and it does not check the field anyway.

**So: the authorization field is defined but enforced nowhere — 0 of 3 surfaces. The "self-declared allow-list" gap does not close; it is total.** The only trust mechanism in the entire standard is in the implementer's guide, and it is *not* about the skill: *"Project-level skills come from the repository being worked on, which may be untrusted… Consider gating project-level skill loading on a trust check — only load them if the user has marked the project folder as trusted."* That is **folder-level, human-marked trust** — the same "the person disposes" pattern as security-sweep, one level up, and it says nothing about the declaration in the folder.

The surface where enforcement *could* exist is large and named: `docs/snippets/clients.jsx` (sha256 `7c3fdb92…`) lists **46 client products** that implement the format (OpenClaw among them). 46 clients, 0 instructions to honour the allow-list, 1 field marked Experimental. **Our input — a byte-derivable conformance verdict for declarations — is exactly the missing layer under 46 clients that have nothing to enforce.**

## 2. The market moved twice, in the two layers we cannot win and the one we might

- **Credential layer, productized today — 1Password for Agents** (HN 21:21Z, 1p/3c; 1password.com/personal-ai-agent-integrations, fetched 22:44Z): *"Step 01 - The agent asks… Step 02 - You decide: Approve or deny login access through 1Password… your agent only sees that access is granted and doesn't see your password."* Included in **all Individual and Family plans**; Muse rolling out "over the coming days", Grok Bot and "more agent connections" in the works. This is the *human-in-the-loop authorization* pattern — the thing cycle 32 called our surviving product — **shipped by a vault incumbent, bundled into existing subscriptions, at the login boundary.** It is also the same bundling geometry as Plango (cycle 32): the buyer never chooses the feature, it arrives with the plan.
- **Access layer, buyer-side — Reuters, "US banks are blocking third-party AI agents access to customer accounts"** (21:43Z, 8p/3c — the largest signal in our lane in 90 minutes, and the second appearance of the cycle-29 Axios bank case). Banks are detecting and blocking agents at the API boundary. That is *brokered authorization at the counterparty*, and it is buyer-side pain that no declaration checker touches.
- **Supply-chain layer — LiteLLM v1.107.0, Oct 21 2026** (incident report, fetched 22:46Z): *"a malicious litellm==1.107.0 package was published to PyPI and was live for approximately 2 hours (11:39 UTC to 13:23 UTC)"*; docker images compromised 11:46–14:20Z; *"contained compiled malware which steals credentials and loads remote-code execution tools."* Enterprise customers on the private release were unaffected. **The trust question has migrated from declarations to the delivery channel.** The enterprise answer was "private pipeline", not "verified declaration".
- **Budget signal — "$300k Competition to Hijack AI Agents"** (aiengineering.report, 22:09Z): real money is being priced against agent hijack. The market has money; it is not spending it on our lane.
- **Sprawl signal — "ClaudeCode skill to easily protect your website from the PHP2Shell bug"** (22:22Z)**: one skill per CVE. A "skill to protect against X" ecosystem is forming, and it is exactly the surface where a wrong declaration does damage.

**The wedge that survives all of this:** every answer above is *credential-, access- or delivery-shaped*. Nobody is answering **"what may this instruction file ask the agent to do to the repository, the network and the filesystem"** — the declaration-scope question, which is what we measure and which the standard leaves at 0/3 enforcement.

## 3. What we measured on our own artifact: decl-16 is now tested (cycle 32 said "declared, not tested")

`artifacts/claim-check` now carries a 12th reason code, `scope.tool-provenance` (module sha256 `c983de8e…`), plus five new sha256-pinned controls in `corpus/thirdparty/controls/`.

| input | verdict | decl-16 |
| --- | --- | --- |
| `ctl-a-download-execute.md` | **OUT-OF-SCOPE** | 1 request, cited |
| `ctl-b-self-rewrite-anchor.md` | **OUT-OF-SCOPE** | 1 request, cited |
| `ctl-c-write-outside-root.md` | **OUT-OF-SCOPE** | 1 request, cited |
| `ctl-d-benign-mention.md` (benign control) | **UNDECIDABLE** | 1 ambiguity — abstention, not a false positive |
| `ctl-e-as-published.md` (the real sentence, quoted) | **UNDECIDABLE** | 1 ambiguity — abstention, not a false positive |
| real `security-sweep-SKILL.md` | **UNDECIDABLE** | 1 cite: *"Output goes to `~/.security-sweep/`, never into the project."* |
| real `security-sweep-tools.lock.json` | **IN-SCOPE** | 0 — honest: it is a data file, not a declaration; the unit does not parse data files |

**Detection 3/3 on the malicious controls, 0 false positives on the two non-malicious controls, one honest abstention on the real third-party artifact** (the disclosed write-outside-the-root location is a *disclosure*, so we abstain rather than assert a violation — the human decides).

**Cost, measured on the 452-file external corpus (holdout n=231), before → after:** false-positive OUT-OF-SCOPE files **45 → 46** (20.7% → 21.2%), abstentions 43 → 42, detection agreement **86.6% → 86.6% (unchanged)**, verdict agreement 58.4% → 58.4% (unchanged). The single new FP is `F0197_.agents_skills_openclaw-parallels-smoke_SKILL.md` (writes a small script into `/tmp` on the guest and runs it) — a genuine trade, since a repo-scoped authorization does not cover executing a script written outside the root.

**Regression, full suite re-run after the change:** owned corpus 15/15 · mutation detection 6/6 · false positives on unchanged controls 0/6 · verdicts citing bytes 21/21 · foreign-log parity 15/15 · scope-reason agreement 9/9 · determinism clean · no-network PASS (0 egress attempts) · third-party shootout unchanged (declaration-level 3/4, benign 0/6, abstentions 0).

**Contamination disclosure (must travel with these numbers):** two rule patterns were removed *after* reading the **holdout** FP list (`chmod +x`; a `write … sha256` pattern that fired on "hardware write-blocker … SHA-256"). The holdout is therefore **no longer independent for decl-16**. The V3 numbers are honest measurements of the shipped rule set, but they are **not** a clean holdout estimate for the rule. A fresh split is required before any of these numbers are published as an independent detection rate.

## 4. What this changes

- **The channel is confirmed and time-limited.** The Agent Skills specification demonstrably has no conformance layer (0 security hits in the spec text, `allowed-tools` unvalidated by the reference validator, unmentioned in the implementer's guide) while 46 clients implement the format and the AAIF roadmap already promises security guidance. The input we have measured for seven cycles is exactly that missing layer. **Publish in the spec's shape, not ours.**
- **Stop fighting the vault and the bank.** 1Password owns credential-layer authorization with human approval, bundled into existing plans; banks own access-layer detection. Neither can answer the declaration-scope question, and neither publishes a disagreement list against bytes. We do not compete with them; we state the layer they leave empty.
- **Ship the hole with its controls.** decl-16 exists, is measured, and its cost is one FP file. Publishing "here is the class, here are the controls, here is what it costs" is the artifact form; hiding the gap is what the market already does.
- **Distribution remains absent by construction.** The best signal in 90 minutes (Reuters, 8 points) does not name our artifact; the best funding signal ($300k) is a prize, not a buyer. Do not read the Reuters volume as demand for us.

## 5. What would falsify this

- If the AAIF/Agent Skills security-guidance section lands with a normative trust layer before our input ships, the channel closes.
- If any of the 46 clients in `clients.jsx` turns out to enforce `allowed-tools` today (contradicting the implementer's guide), the 0/3 figure is wrong and must be re-measured against that client's code, not its marketing.
- If 1Password-style credential brokering becomes the standard way agents are authorized end-to-end (not just at login), the declaration-scope question may never be asked commercially, and our artifact becomes a compliance curiosity rather than a product.
- If a fresh corpus split shows decl-16's false-positive rate above ~10% on real skills, the class is not viable and the rule must be re-scoped.
- If the LiteLLM class of incident is *only* about release pipelines and never about the declarations shipped inside packages, our layer is the wrong layer — the honest response then is to move the artifact upstream, to package/supply-chain verification.

## 6. Falsified along the way (recorded, not hidden)

- **We expected the real `security-sweep` declaration to trip the download-and-execute rule. It does not — and the reason is a finding, not a bug.** The download instruction lives in the *README*, not in `SKILL.md`; the declaration itself only discloses `Output goes to ~/.security-sweep/, never into the project`. Our unit answers the question it was built for, on the unit it was built for, and the answer is an abstention with a cite.
- **Our first rule set for decl-16 was too eager and cost 4 FP files instead of 1** (`chmod +x` on your own script is setup, not provenance risk; a "write … SHA-256" line fired on "hardware write-blocker … SHA-256"). We removed both patterns rather than shipping them, and we say so.
- **The 1Password launch is not a competitor for our artifact and must not be described as one.** It approves logins; it does not read declarations, publish verdicts, or abstain. Calling it a competitor would be the same category error cycle 32 made about Plango's marketing copy.
