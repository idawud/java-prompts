# Agent Mode Prompt Templates

One-shot TDD prompt templates for IntelliJ agent mode.
Check this directory into version control so the whole team shares the same
prompts and benefits from improvements over time.

---

## Files

| File | Purpose |
|---|---|
| `tdd-new-feature.prompt` | Implement a brand-new feature test-first (RED → GREEN → REFACTOR) |
| `tdd-refactor.prompt`    | Safely restructure existing code backed by a coverage audit |
| `tdd-improvement.prompt` | Non-functional improvements: perf, resilience, observability, readability |
| `tdd-bugfix.prompt`      | Pin a bug as a failing test, then fix it |
| `extract-signatures.groovy` | IntelliJ scratch file — extracts class/method signatures to clipboard |

---

## Workflow

### 1. Extract signatures (optional but recommended)

Open `extract-signatures.groovy` as an IntelliJ scratch file.
Add the fully-qualified names of any local classes the agent needs to know
about into the `TARGET_CLASSES` list, then run with the IDE.
The formatted signatures are printed to the console and copied to clipboard.

### 2. Choose your template

Open the relevant `.prompt` file.
In IntelliJ agent mode chat, reference it with `@` — e.g. `@tdd-new-feature.prompt`.
Alternatively, copy the whole file content into the chat window.

### 3. Fill the placeholders

Replace every `{{PLACEHOLDER}}` before sending.  
The minimum required placeholders for each template:

**tdd-new-feature**
- `{{TARGET_CLASS}}` — simple class name, e.g. `DiscountCalculator`
- `{{PACKAGE}}` — e.g. `com.example.pricing`
- `{{TEST_FRAMEWORK}}` — e.g. `JUnit 5 + Mockito + AssertJ`
- `{{BUILD_TOOL}}` — e.g. `Maven`
- `{{NAMING_CONVENTION}}` — e.g. `should_doX_when_Y`
- `{{FEATURE_DESCRIPTION}}` — plain English description
- `{{ACCEPTANCE_CRITERIA}}` — bullet list of observable outcomes

**tdd-refactor**
- All context fields above
- `{{SOURCE_CLASS}}` — full Java source pasted verbatim
- `{{EXISTING_TESTS}}` — full test source pasted verbatim
- `{{REFACTORING_GOALS}}` — bullet list of what to improve structurally

**tdd-improvement**
- All context fields above
- `{{SOURCE_CLASS}}` — full Java source
- `{{EXISTING_TESTS}}` — full test source
- `{{IMPROVEMENT_TYPE}}` — one of: performance | resilience | observability | readability | testability | memory | thread-safety
- `{{IMPROVEMENT_GOALS}}` — measurable goals with baseline and target

**tdd-bugfix**
- All context fields above
- `{{SOURCE_CLASS}}` — full Java source
- `{{EXISTING_TESTS}}` — full test source
- `{{BUG_DESCRIPTION}}` — input, actual output, expected output
- `{{STACK_TRACE}}` — paste verbatim if available

### 4. Common optional fields

| Placeholder | When to fill |
|---|---|
| `{{LOCAL_LIBRARIES}}` | When the feature must use classes from your own codebase |
| `{{PASTED_SIGNATURES}}` | Paste output from `extract-signatures.groovy` |
| `{{DEPENDENCIES}}` | Collaborators already injected (constructor/field injection) |
| `{{CONSTRAINTS}}` | Hard limits: no new deps, API must not change, must be thread-safe |

---

## Tips for one-shot accuracy

- **Paste real signatures.** Hallucinated API usage is the single biggest
  failure mode. Running `extract-signatures.groovy` takes 10 seconds and
  eliminates it.
- **Be measurable in improvement goals.** "Make it faster" gives the agent
  latitude to do almost anything. "Reduce average latency of `processOrder()`
  from ~40 ms to < 5 ms" gives it a target and a scope.
- **One feature / one bug per prompt.** Compound tasks (two features + a
  refactor) degrade output quality significantly.
- **Specify your naming convention.** `should_doX_when_Y` vs
  `givenX_whenY_thenZ` vs descriptive sentences all produce very different
  test styles.
- **Log deviations.** See `PROMPT_CHANGELOG.md` below.

---

## PROMPT_CHANGELOG.md (maintain this)

Track every wording change that noticeably improved or degraded output.
Small changes have outsized effects.

```
YYYY-MM-DD | tdd-new-feature | Changed Step 1 instruction from "write a test"
           | to "write a test that must NOT compile yet" → agent stopped
           | writing tests that already passed on first run.

YYYY-MM-DD | tdd-bugfix | Added {{ROOT_CAUSE_HYPOTHESIS}} field → agent
           | validates or corrects the hypothesis instead of starting blind,
           | reduces back-and-forth by ~2 turns on average.
```
