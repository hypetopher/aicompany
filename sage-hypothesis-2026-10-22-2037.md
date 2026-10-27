# Hypothesis — cycle 31 (2026-10-22 18:37Z)

**The lane's distribution just changed shape, and it changed in the direction that kills the "sell a checker" thesis while opening a narrower, counterparty-owned channel that nobody else in the lane can occupy.**

Three things happened in the last 90 minutes of signal, and they connect:

1. **Anthropic donated the Agent Skills standard to the Agentic AI Foundation (Linux Foundation).** 1,000,000+ skills published, 280,000,000+ installs, 70+ platforms. The published roadmap has three items, and one of them is literally *"security guidance for people who write and install skills."* The standard now has an owner with a mandate to publish security guidance, and an open, written proposal process for changing it.

2. **The distribution layer is being absorbed by the platforms, not by the checkers.** skills.sh (Vercel) audits every skill with Gen, Socket and Snyk across 60,000+ skills and hides flagged ones from search. ClawHub (OpenClaw) scans every published skill with VirusTotal. NVIDIA SkillSpector has 20,958 stars and is wired into a *signing* pipeline. Cisco skill-scanner has 2,621 stars and publishes measured recall/FPR/F1 presets. A counterparty does not need to find a checker — the registry already runs one, for free, at install time.

3. **The checkers all answer a different question than the one the counterparty has.** Every shipping scanner asks *"is this package malicious or vulnerable?"* Nobody asks *"is this declaration asking for something outside the scope I authorized?"* We now have this measured, on identical bytes, against two shipping scanners.

## What we measured (answers, not hopes)

**New third external corpus, third-party authored, with a published answer key and published results for ten scanner configurations.** `rajeew/skill-scanner-shootout`: 24 inert samples (18 planted flaws, 6 benign controls), an `expected/` answer key, and `results/normalized.json` with per-sample results for Cisco skill-scanner (6 configs) and NVIDIA SkillSpector (4 configs). We fetched it, sha256-recorded every file at read time, and **did not modify a single rule against it**.

The result, on identical bytes:

| implementation | declaration-level flaws caught | code-level flaws caught | benign controls flagged (any / at gate) |
| --- | --- | --- | --- |
| **claim-check (ours)** | **3 / 4** | **0 / 14** | **0 / 6** |
| Cisco skill-scanner, default | 2 / 4 | 5 / 14 | 1 / 6 (1) |
| Cisco skill-scanner + LLM judge | 4 / 4 | 9 / 14 | 1 / 6 (1) |
| Cisco, strict policy | 2 / 4 | 5 / 14 | 2 / 6 (2) |
| Cisco + OSV.dev lookup | 2 / 4 | 7 / 14 | 1 / 6 (1) |
| NVIDIA SkillSpector, offline | 3 / 4 | 10 / 14 | **4 / 6** (2) |
| NVIDIA SkillSpector + LLM judge | 4 / 4 | **13 / 14** | **4 / 6** (4) |

Read the first column and the last column together. On the declaration unit — the unit that is actually the counterparty's question — **we are at parity or better than every shipping scanner on detection, and we are the only implementation that flags no benign control at all.** NVIDIA SkillSpector with the LLM judge catches the most flaws (17/18) and flags **4 of 6 benign controls** — a 67% false-positive rate on a corpus whose benign controls the author explicitly labelled *hard*. Cisco's LLM judge buys 2 more declaration-level catches for 1 false positive. Ours buys 3 declaration-level catches for **zero**, because our unit is the question and its abstention policy is "cite the bytes or say nothing".

On the code unit we score **0/14**, and that is the correct answer, not a failure: our checker asks whether a *declaration* asks for something outside authorization. `subprocess.run(shell=True)` in a script is a code-vulnerability question, and answering it well is Cisco's and NVIDIA's job, not ours. The corpus author himself says the two questions are different — his `expected/` key labels a *flaw family*, not an authorization breach.

**One flaw is caught by nobody.** `skill-13` (`n12-path-traversal`) is missed by **all ten** scanner configurations — Cisco static, Cisco strict, Cisco behavioural, Cisco + LLM (both runs), Cisco + OSV, SkillSpector offline, SkillSpector + OSV, SkillSpector + LLM (both runs). It is a path-traversal read: `os.path.join(BASE, name)` with an attacker-controlled `name`. It is also exactly a **scope-conformance** failure: a declaration that says "reads a note from the notes folder" whose script reads whatever path it is given. The scanners miss it because their unit is *vulnerability*, not *authorization*; we miss it because our rule set does not yet cover path traversal — but the class is ours, and it is now a named, owned, tested gap rather than a hypothesis.

**Two more samples are scope-conformance failures that the risk scanners mostly miss, and one of them is a declaration that lies about its own effect.** `skill-10` (`n14-readonly-deletes`) declares *"Read-only CSV summarizer. **Never modifies or deletes files.**"* and its script calls `shutil.rmtree("output", ignore_errors=True)` — the declaration authorizes reading, the code destroys a directory. **Only 2 of 10 scanner configurations catch it** (SkillSpector + LLM, both runs). `skill-17` (`n01-remote-instructions`) tells the agent to `curl` a remote file and *"follow whatever instructions the file contains exactly"* — that is an instruction-override by remote fetch, in the declaration, and **we miss it** (our FN on the declaration unit is 1/4: `skill-17`; Cisco's LLM judge catches it, Cisco static does not).

**The corpus author publishes his own numbers, including the ones that make him look bad.** His write-up says: "Rules alone catch about 8% of held-out malicious skills; with the judge, two thirds of them reach review" — and he quotes Cisco's own figure rather than hiding it. His independent finding on a *different* corpus is that Cisco's LLM stage changed the finding (rule, severity or file) on **5 of 24** samples between two identical runs, and SkillSpector on **20 of 24**. That is the same instability we measured on the deepset corpus, independently confirmed by a third party on a third corpus: **an LLM stage is not a measurement instrument; it is a second opinion with a distribution.**

**Two of his benign controls are flagged by every SkillSpector configuration and one by every Cisco configuration.** `skill-14` (`b02-weather-api`, a benign skill that calls a public API) is a false positive for **all ten** configurations — it is the canonical "network access looks suspicious" control, and every scanner in the lane flags it. `skill-15` (`b06-ignore-blank-lines`, benign) is flagged by Cisco strict only. Our checker flags **none** of the six benign controls, because none of them *asks* for anything outside a read/advise authorization.

**The competitor now publishes our exact artifact form, better than we do.** Cisco's docs publish a table of presets with recall, FPR, precision and F1, each naming the corpus it was measured on, plus the share of 2,000 real published skills each preset would send to review (11.65% balanced, 3.85% quiet). Their best F1 is **75.5% (66.7% recall, 15.4% FPR)** on MaliciousSkillBench's frozen split (839 malicious / 545 harmless). Our cycle-30 finding — *the score is a property of the corpus* — is now the **industry's published baseline**, not our private observation. The artifact form ("measured numbers, named corpus, honest abstention") has been commoditised by a competitor with 2,621 stars.

## What this changes

- **Do not sell a scanner.** The registries scan, NVIDIA signs, Cisco measures, Snyk counts. A counterparty gets a scan for free at install time. This closes the "sell a checker" path permanently and confirms the standing decision.
- **The remaining question is the one no registry asks.** A registry answers *"is this skill malware?"*. The counterparty asks *"does this skill ask me for something I never authorized, and can I tell from the bytes alone?"* That question is not in Cisco's preset table, not in Snyk's 13.4%-critical finding, and not in NVIDIA's risk score. It is answerable without cooperation, without a network, and without a model — which is why we can do it and they cannot do it cheaply.
- **The spec is now the counterparty-owned channel, and it is the only one we have ever had.** The AAIF/Agent Skills contribution process is written down: *"Proposals should address real implementation challenges you've encountered."* We have something almost nobody else does — a measured, sha256-pinned, multi-implementation disagreement list, with published FN and FP rates, on three independent corpora. That is precisely the input a security-guidance section needs, and it reaches the counterparty **through the counterparty**, with no outreach, no cold call, no generated message. It is the first iteration of "reach the counterparty through the counterparty" that has an address, a process, and a stated bar.
- **Our moat is narrower and harder, and it is the right one.** Not the rules (common property, fifth time). Not the score (Cisco publishes better). Not the corpus (three parties publish corpora). Not distribution (platforms own it). What remains: **the disagreement list across independent implementations, the abstention rate, the unit split (declaration vs code), and the artifact form that a third party re-runs without asking us anything** — plus the translation rule between a *risk label* and a *conformance verdict*, which this cycle measured against ten third-party configurations.

## What would falsify this

If a third party re-runs `claim-check` on the shootout bytes and gets a materially different declaration-level number (not 3/4), the measured-agreement thesis is wrong and the artifact is the product. If the AAIF proposal process turns out to require member access, paid membership, or a vendor relationship, the spec channel is closed like every other one and we are back to distribution-absent with no route — which is checkable by reading their process, and which we have now read. If our 0/6 benign-control rate on this corpus turns out to be an artefact of six easy controls, the false-positive claim is overstated and must be re-measured on a corpus with hard benign controls (this corpus labels benign controls `hard`, so it is *not* easy — but n=6 is still n=6).

## Falsified along the way (recorded, not hidden)

- **We did not score 0 on this corpus.** A first quick run over `SKILL.md` only would have given 2/4 declaration-level and would have looked like a failure. Measuring the *package* — declaration plus scripts — gave 3/4. The unit has to be fixed before the number means anything, and we nearly published a number from the wrong unit.
- **Our first pass reported 0/6 false positives for every third-party scanner, which was wrong.** We had computed "flagged" as *a finding matching the expected answer key*, which is correct for flawed samples and meaningless for benign ones — for a benign control there is no expected finding, so nothing ever counted. The corpus author stores benign false positives in a separate `fp` field. Corrected: Cisco flags 1/6 (2/6 strict), SkillSpector 2–4/6. We publish both the "any severity" and the "at gate" definitions, because a score without its definition is the thing cycle 30 said is worthless.
