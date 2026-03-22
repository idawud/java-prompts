# Agent Mode Prompt Templates — WITH GRILL

Grill-mode variants of every TDD template.
The agent interrogates you FIRST and proposes alternatives — then waits for
your confirmation before writing a single line of code.

Store this directory alongside `/prompts` in your project root.

---

## Files

| File | Purpose |
|---|---|
| `tdd-new-feature-grill.prompt` | Interrogates requirements, surfaces edge cases, proposes design alternatives before implementing |
| `tdd-refactor-grill.prompt`    | Audits smells, proposes competing structural strategies, checks caller impact before touching code |
| `tdd-improvement-grill.prompt` | Sharpens vague goals into measurable hypotheses, diagnoses root cause, proposes competing strategies |
| `tdd-bugfix-grill.prompt`      | Challenges the bug report, identifies blast radius, evaluates root cause hypothesis before fixing |

---

## When to use grill vs standard

| Situation | Use |
|---|---|
| You know exactly what you want, context is clear | `prompts/` standard templates |
| Requirements have gaps you haven't fully thought through | `prompts-grill/` |
| The codebase is unfamiliar or large | `prompts-grill/` |
| You have a gut feeling the stated approach might be wrong | `prompts-grill/` |
| You are onboarding someone and want decisions documented | `prompts-grill/` |
| Time pressure, simple well-understood change | `prompts/` standard templates |

---

## How grill mode works

Every grill template has two phases:

**Phase 1 — GRILL**
The agent reads your context and works through a structured interrogation:
requirements clarity, edge cases, competing design strategies, dependency
questions, risk analysis.  It ends with a `Ready to proceed?` gate and
waits for your reply.

**Phase 2 — IMPLEMENT**
After you answer (confirming defaults, correcting assumptions, choosing a
strategy) the agent executes the same numbered steps as the standard template.

You get the discipline of one-shot prompting with the safety net of a
structured design review before any code is written.

---

## Workflow

### 1. Fill placeholders (same as standard templates)
The context block is identical to the standard templates.
You do NOT need to pre-answer all the questions the agent will ask — that's
the point of grill mode.  Fill what you know; the agent surfaces what you
don't.

### 2. Send to agent
Reference the file with `@` in IntelliJ agent mode chat, or paste the
content directly.

### 3. Answer the grill
The agent groups its questions under named headings.  You can:
  - Answer each question inline beneath it.
  - Say "use your recommendation" for any section you don't have a strong
    view on.
  - Correct any misdiagnosis or wrong assumption directly.

### 4. Confirm and implement
Once you send your answers, the agent proceeds to the full implementation
sequence from the standard template.

---

## Tips

- **"Use your recommendation" is a valid answer** to any grill question.
  The agent's recommendation is always stated — you don't have to decide
  everything.

- **The blast radius question in tdd-bugfix-grill is the most valuable one.**
  Bugs almost always have unreported siblings.  Letting the agent surface
  them before you commit the fix saves a second bug report next week.

- **The "what will NOT change" section is your scope contract.**
  Read it carefully.  If the agent is leaving something out that you wanted
  included, correct it before implementation starts.

- **Save your grill answers.**
  Paste the full grill exchange into a comment on the PR or story.
  It documents the design decisions that were considered and rejected, which
  is often more valuable than the code itself.

---

## Combining grill and standard

A common pattern for large features:

1. Run the **grill** template to do the design review and get alignment.
2. Take the confirmed answers and paste them into the equivalent **standard**
   template as pre-filled placeholders.
3. Run the standard template for the actual implementation — now it has
   full context and no ambiguity.

This gives you the discussion of grill mode and the clean deterministic
output of standard mode.
