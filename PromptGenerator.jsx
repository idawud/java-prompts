import { useState, useCallback, useEffect, useRef } from "react";

// ─── Template content (kept in JS for single-file portability) ──────────────

const T = {
  "new-feature": {
    standard: `# TDD New Feature
# Usage: Fill all {{PLACEHOLDERS}} before submitting to agent mode.
# ─────────────────────────────────────────────────────────────────────────────

## Role
You are a senior Java engineer practising strict TDD.
You write the failing test FIRST, then the minimal production code to make it
pass, then refactor — never the other way around.
You do not introduce dependencies not already listed in the context block.
You do not modify existing passing tests.

## Environment
- Java binary        : {{JAVA_PATH}}
- Build tool binary  : {{BUILD_TOOL_PATH}}
- Build tool         : {{BUILD_TOOL}}
- JVM args           : {{JVM_ARGS}}

## Context
- Target class       : {{TARGET_CLASS}}
{{CLASS_CREATION_NOTE}}- Package            : {{PACKAGE}}
- Class naming convention : {{CLASS_NAMING_CONVENTION}}
- Test framework     : {{TEST_FRAMEWORK}}
- Naming convention  : {{NAMING_CONVENTION}}
- Checkstyle config  : {{CHECKSTYLE_PATH}}
- Local libraries in scope:
{{LOCAL_LIBRARIES}}

### Relevant signatures from local codebase
\`\`\`java
{{PASTED_SIGNATURES}}
\`\`\`

### Existing collaborators / dependencies already injected
{{DEPENDENCIES}}

## Feature to implement
{{FEATURE_DESCRIPTION}}

## Acceptance criteria
{{ACCEPTANCE_CRITERIA}}

## Constraints
- {{CONSTRAINTS}}

## Output instructions — follow this exact sequence

### Step 0 — Class name derivation (only if TARGET_CLASS was not provided)
If no target class name was given, derive one from the feature description
and the project class naming convention ({{CLASS_NAMING_CONVENTION}}).
State the derived name and reasoning before proceeding.

### Step 1 — RED  (failing test)
Write the test class (or add to an existing one if specified).
- One test method per acceptance criterion.
- Each test method ≤ 20 lines.
- {{TEST_FRAMEWORK}} idioms only.
- Full class with package declaration and all imports.
- One-line comment above each test explaining WHAT it proves.
- Tests must NOT compile or pass yet.
- If checkstyle config provided ({{CHECKSTYLE_PATH}}), all code must conform.

### Step 2 — GREEN  (minimal implementation)
Minimal production code to make ALL Step 1 tests pass.
- No speculative generality.
- Full class with package declaration and imports.
- Conform to checkstyle if config provided.

### Step 3 — REFACTOR
Improve without changing observable behaviour.
- SRP, DRY, meaningful names. State any pattern applied and why.
- Show full refactored class and a diff-style summary.

### Step 4 — Build and run command
Exact shell command using the specified paths and JVM args:
  {{BUILD_TOOL_PATH}} test (with {{JVM_ARGS}} injected appropriately)

### Step 5 — Review notes
- If class name was derived: confirm it and flag if convention is ambiguous.
- Ambiguous acceptance criteria: state assumption made.
- Unsatisfiable constraints: explain why.
- Follow-up tests worth adding (list only — do not write them).`,

    grill: `# TDD New Feature — WITH GRILL
# Grill mode: interrogate first, code after confirmation.
# ─────────────────────────────────────────────────────────────────────────────

## Role
You are a senior Java engineer and a demanding technical lead.
You ask the sharpest question you can, not the most questions you can.
You do not write any code until the developer confirms.

## Environment
- Java binary        : {{JAVA_PATH}}
- Build tool binary  : {{BUILD_TOOL_PATH}}
- Build tool         : {{BUILD_TOOL}}
- JVM args           : {{JVM_ARGS}}

## Context
- Target class       : {{TARGET_CLASS}}
{{CLASS_CREATION_NOTE}}- Package            : {{PACKAGE}}
- Class naming convention : {{CLASS_NAMING_CONVENTION}}
- Test framework     : {{TEST_FRAMEWORK}}
- Naming convention  : {{NAMING_CONVENTION}}
- Checkstyle config  : {{CHECKSTYLE_PATH}}
- Local libraries in scope:
{{LOCAL_LIBRARIES}}

### Relevant signatures from local codebase
\`\`\`java
{{PASTED_SIGNATURES}}
\`\`\`

### Existing collaborators / dependencies already injected
{{DEPENDENCIES}}

## Feature to implement
{{FEATURE_DESCRIPTION}}

## Acceptance criteria (as understood so far)
{{ACCEPTANCE_CRITERIA}}

## Constraints (as understood so far)
{{CONSTRAINTS}}

─────────────────────────────────────────────────────────────────────────────
## GRILL PHASE — do this BEFORE any code

### 0. Class name proposal (only if TARGET_CLASS was not provided)
Propose 2–3 candidate names from the feature + naming convention ({{CLASS_NAMING_CONVENTION}}).
State reasoning for each. Ask developer to confirm one before proceeding.

### 1. Requirement clarity
Quote each ambiguous criterion. State what is unclear. Ask one sharp question.
Offer 2–3 concrete interpretations as labelled options.

### 2. Edge cases and failure modes
Cases NOT covered by acceptance criteria. Per case: describe scenario,
ask throw/sentinel/ignore/log, suggest most consistent option.

### 3. Design alternatives
2–3 approaches: name, description (2–3 sentences), trade-offs, recommendation.

### 4. Dependency and integration questions
Per uncertain collaborator: name + method, ask behaviour, offer 2 options.

### 5. Checkstyle / formatting questions
If checkstyle config provided ({{CHECKSTYLE_PATH}}): flag design decisions
shaped by rules. Ask confirmation if a rule forces a structural choice.

### 6. Build environment questions
Confirm whether test JVM args differ from build args.
Flag any arg affecting test behaviour.

### 7. Test strategy questions
Unit vs integration? @ParameterizedTest scenarios? Shared fixture opportunity?

### 8. Out-of-scope flag
Explicitly list what you will NOT implement and why.

─────────────────────────────────────────────────────────────────────────────
## CONFIRMATION GATE

---
**Ready to proceed?**
Answer the questions above (or confirm my suggested defaults).
Once you reply I will implement:
  Step 0 — Class name derivation (if needed)
  Step 1 — RED · Step 2 — GREEN · Step 3 — REFACTOR
  Step 4 — Build command · Step 5 — Review notes
---
Do NOT write any code until the developer replies.`,
  },

  "refactor": {
    standard: `# TDD Refactor
# ─────────────────────────────────────────────────────────────────────────────

## Role
You are a senior Java engineer specialising in safe, test-backed refactoring.
Every refactoring step must leave ALL existing tests green.
You do not change external behaviour. You do not add features.

## Environment
- Java binary        : {{JAVA_PATH}}
- Build tool binary  : {{BUILD_TOOL_PATH}}
- Build tool         : {{BUILD_TOOL}}
- JVM args           : {{JVM_ARGS}}

## Context
- Class under refactor : {{TARGET_CLASS}}
- Package              : {{PACKAGE}}
- Test framework       : {{TEST_FRAMEWORK}}
- Naming convention    : {{NAMING_CONVENTION}}
- Checkstyle config    : {{CHECKSTYLE_PATH}}
- Local libraries in scope:
{{LOCAL_LIBRARIES}}

### Source class to refactor
\`\`\`java
{{SOURCE_CLASS}}
\`\`\`

### Existing test class(es)
\`\`\`java
{{EXISTING_TESTS}}
\`\`\`

### Relevant signatures from collaborators
\`\`\`java
{{PASTED_SIGNATURES}}
\`\`\`

## Refactoring goals
{{REFACTORING_GOALS}}

## Hard constraints
- {{CONSTRAINTS}}

## Output instructions — follow this exact sequence

### Step 1 — Coverage audit
Every public/package-private method: covered or not?
Uncovered → write minimum tests (labelled "Coverage additions").
Must pass against CURRENT (pre-refactor) code.

### Step 2 — Refactoring plan
Sequence of atomic steps using standard names:
Extract Method, Extract Class, Replace Conditional with Polymorphism,
Introduce Parameter Object, Inline Variable, Move Method, etc.
State order and why it is safe.

### Step 3 — Refactored code
Full class(es). Each new class in its own labelled block.
Full package declarations and imports.
Checkstyle conformance required if config provided ({{CHECKSTYLE_PATH}}).

### Step 4 — Test update (if required)
Structural-only changes. No logic changes. No relaxed assertions.

### Step 5 — Build and run command
  {{BUILD_TOOL_PATH}} test (with {{JVM_ARGS}} injected appropriately)

### Step 6 — Diff summary
Per change: what, which mechanic, why it improves the code.

### Step 7 — Review notes
Unachieved goals. Follow-up refactorings.`,

    grill: `# TDD Refactor — WITH GRILL
# ─────────────────────────────────────────────────────────────────────────────

## Role
You are a senior Java engineer and an opinionated code reviewer.
You conduct a thorough smell analysis and propose strategies before touching code.
You do not write refactored code until the developer confirms the approach.

## Environment
- Java binary        : {{JAVA_PATH}}
- Build tool binary  : {{BUILD_TOOL_PATH}}
- Build tool         : {{BUILD_TOOL}}
- JVM args           : {{JVM_ARGS}}

## Context
- Class under refactor : {{TARGET_CLASS}}
- Package              : {{PACKAGE}}
- Test framework       : {{TEST_FRAMEWORK}}
- Naming convention    : {{NAMING_CONVENTION}}
- Checkstyle config    : {{CHECKSTYLE_PATH}}
- Local libraries in scope:
{{LOCAL_LIBRARIES}}

### Source class to refactor
\`\`\`java
{{SOURCE_CLASS}}
\`\`\`

### Existing test class(es)
\`\`\`java
{{EXISTING_TESTS}}
\`\`\`

### Relevant signatures from collaborators
\`\`\`java
{{PASTED_SIGNATURES}}
\`\`\`

## Refactoring goals (as understood so far)
{{REFACTORING_GOALS}}

## Hard constraints
{{CONSTRAINTS}}

─────────────────────────────────────────────────────────────────────────────
## GRILL PHASE — do this BEFORE any code

### 1. Code smell inventory
Name, offending lines/methods, severity (HIGH/MEDIUM/LOW), in/out of scope.

### 2. Coverage gap analysis
Uncovered methods + refactoring risk. Recommendation: add coverage first?

### 3. Checkstyle impact assessment
If config provided ({{CHECKSTYLE_PATH}}): flag refactorings shaped by rules.
Recommend whether to run checkstyle validation between each step.

### 4. Competing refactoring strategies
2–3: name, end-state (3–4 sentences), mechanics, scope, trade-offs, recommendation.

### 5. Caller impact assessment
Signatures that might change. Callers outside scope? Option A (stable) vs B (update).

### 6. Naming and convention questions
Misleading names → suggested replacements. Ask for confirmation.

### 7. Build environment questions
JVM args consistent across test and build? Flag any affecting safety.

### 8. What will NOT change

─────────────────────────────────────────────────────────────────────────────
## CONFIRMATION GATE

---
**Ready to proceed?**
Confirm: strategy · coverage first? · naming changes · caller impact · checkstyle validation.

Once confirmed I will implement:
  Step 1 — Coverage audit + additions
  Step 2 — Plan · Step 3 — Code · Step 4 — Test updates
  Step 5 — Build command · Step 6 — Diff · Step 7 — Review notes
---
Do NOT write any refactored code until the developer replies.`,
  },

  "improvement": {
    standard: `# TDD Improvement
# ─────────────────────────────────────────────────────────────────────────────

## Role
You are a senior Java engineer improving production code quality test-first.
For every improvement you first write a test that PROVES it is real and measurable.
You do not change external behaviour. You do not add features.

## Environment
- Java binary        : {{JAVA_PATH}}
- Build tool binary  : {{BUILD_TOOL_PATH}}
- Build tool         : {{BUILD_TOOL}}
- JVM args           : {{JVM_ARGS}}

## Context
- Target class(es)    : {{TARGET_CLASS}}
- Package             : {{PACKAGE}}
- Test framework      : {{TEST_FRAMEWORK}}
- Naming convention   : {{NAMING_CONVENTION}}
- Improvement type    : {{IMPROVEMENT_TYPE}}
- Checkstyle config   : {{CHECKSTYLE_PATH}}
- Local libraries in scope:
{{LOCAL_LIBRARIES}}

### Source class to improve
\`\`\`java
{{SOURCE_CLASS}}
\`\`\`

### Existing test class(es)
\`\`\`java
{{EXISTING_TESTS}}
\`\`\`

### Relevant signatures from collaborators / infrastructure
\`\`\`java
{{PASTED_SIGNATURES}}
\`\`\`

## Improvement goals
{{IMPROVEMENT_GOALS}}

## Hard constraints
- {{CONSTRAINTS}}

## Output instructions — follow this exact sequence

### Step 1 — Baseline characterisation
Per goal: offending lines, impact estimate, improvement hypothesis.

### Step 2 — Improvement tests (RED)
Fail on current code, pass after improvement.
Performance: timing assertion or JMH stub.
Resilience: Mockito transient failure stubs.
Observability: test appender / spy.
Readability: code-review checklist.
Checkstyle conformance required ({{CHECKSTYLE_PATH}}).

### Step 3 — Improved implementation (GREEN)
Full class. New helpers in labelled blocks. Checkstyle conformance.

### Step 4 — Verify existing tests still pass
Explicit inspection. Show structural-only test updates.

### Step 5 — Build and run command
  {{BUILD_TOOL_PATH}} test (with {{JVM_ARGS}} injected appropriately)

### Step 6 — Diff summary
What changed / why / trade-offs.

### Step 7 — Measurement guidance
Per goal: metric, tool, success threshold.

### Step 8 — Review notes
Unachieved goals. Trade-offs needing team discussion.`,

    grill: `# TDD Improvement — WITH GRILL
# ─────────────────────────────────────────────────────────────────────────────

## Role
You are a senior Java performance and quality engineer.
You turn vague goals into measurable hypotheses backed by source evidence.
You do not write implementation code until the developer confirms the strategy.

## Environment
- Java binary        : {{JAVA_PATH}}
- Build tool binary  : {{BUILD_TOOL_PATH}}
- Build tool         : {{BUILD_TOOL}}
- JVM args           : {{JVM_ARGS}}

## Context
- Target class(es)    : {{TARGET_CLASS}}
- Package             : {{PACKAGE}}
- Test framework      : {{TEST_FRAMEWORK}}
- Naming convention   : {{NAMING_CONVENTION}}
- Improvement type    : {{IMPROVEMENT_TYPE}}
- Checkstyle config   : {{CHECKSTYLE_PATH}}
- Local libraries in scope:
{{LOCAL_LIBRARIES}}

### Source class to improve
\`\`\`java
{{SOURCE_CLASS}}
\`\`\`

### Existing test class(es)
\`\`\`java
{{EXISTING_TESTS}}
\`\`\`

### Relevant signatures from collaborators / infrastructure
\`\`\`java
{{PASTED_SIGNATURES}}
\`\`\`

## Improvement goals (as understood so far)
{{IMPROVEMENT_GOALS}}

## Hard constraints
{{CONSTRAINTS}}

─────────────────────────────────────────────────────────────────────────────
## GRILL PHASE — do this BEFORE any code

### 1. Goal sharpening
Measurable? Restate as hypothesis with baseline + target.
Ask how baseline was measured. Propose minimum instrumentation if none exists.

### 2. Root cause / quality gap analysis
Lines/patterns causing the gap. WHY. Relative impact. Contradictions to goal.

### 3. Competing improvement strategies
2–3: name, what changes, expected improvement + mechanism, costs, library/JDK
assumptions, recommendation.

### 4. Checkstyle impact
If config provided ({{CHECKSTYLE_PATH}}): flag improvements shaped by rules.
Must improved code pass checkstyle on CI?

### 5. Build environment questions
Do JVM args ({{JVM_ARGS}}) affect benchmarking or test reliability?
Confirm performance test args match production JVM config.

### 6. Observability and verification
Existing metrics framework? Production verification plan? Chaos/fault-injection?

### 7. Risk and regression
Flaky tests after improvement. Callers outside scope affected? Deadlock risk?

### 8. What will NOT change

─────────────────────────────────────────────────────────────────────────────
## CONFIRMATION GATE

---
**Ready to proceed?**
Confirm: goals correct · strategy · success measurement · risk acceptance · checkstyle required?

Once confirmed I will implement:
  Step 1–8 of tdd-improvement sequence.
---
Do NOT write any implementation code until the developer replies.`,
  },

  "bugfix": {
    standard: `# TDD Bug Fix
# ─────────────────────────────────────────────────────────────────────────────

## Role
You are a senior Java engineer applying TDD discipline to bug fixing.
Process: reproduce as failing test → fix → confirm all tests green.
You do not fix anything unrelated to the described bug.

## Environment
- Java binary        : {{JAVA_PATH}}
- Build tool binary  : {{BUILD_TOOL_PATH}}
- Build tool         : {{BUILD_TOOL}}
- JVM args           : {{JVM_ARGS}}

## Context
- Defective class      : {{TARGET_CLASS}}
- Package              : {{PACKAGE}}
- Test framework       : {{TEST_FRAMEWORK}}
- Naming convention    : {{NAMING_CONVENTION}}
- Checkstyle config    : {{CHECKSTYLE_PATH}}
- Local libraries in scope:
{{LOCAL_LIBRARIES}}

### Source class containing the bug
\`\`\`java
{{SOURCE_CLASS}}
\`\`\`

### Existing test class(es)
\`\`\`java
{{EXISTING_TESTS}}
\`\`\`

### Relevant signatures from collaborators
\`\`\`java
{{PASTED_SIGNATURES}}
\`\`\`

## Bug description
{{BUG_DESCRIPTION}}

### Stack trace / error output (if available)
\`\`\`
{{STACK_TRACE}}
\`\`\`

### Steps to reproduce (if known)
{{REPRODUCTION_STEPS}}

## Root-cause hypothesis (agent will verify)
{{ROOT_CAUSE_HYPOTHESIS}}

## Hard constraints
- {{CONSTRAINTS}}

## Output instructions — follow this exact sequence

### Step 1 — Root cause analysis
Exact line(s) responsible. What assumption is violated? Single-site or pattern?

### Step 2 — Regression test (RED)
Reproduces the bug. Fails on current code. Will pass after fix.
Full class with package declaration and imports.
Checkstyle conformance required ({{CHECKSTYLE_PATH}}).

### Step 3 — Additional edge-case tests (RED)
Up to 3 related edge cases. "No additional edge cases identified." if none.

### Step 4 — Fix (GREEN)
Minimal fix. Full fixed class. Inline comment on each changed line.
Checkstyle conformance.

### Step 5 — Verify existing tests still pass
Explicit inspection. Flag any test passing for the wrong reason.

### Step 6 — Build and run command
  {{BUILD_TOOL_PATH}} test (with {{JVM_ARGS}} injected appropriately)

### Step 7 — Diff summary
Per changed line: file, what changed, why.

### Step 8 — Review notes
Isolated or wider pattern? Follow-up recommendations.`,

    grill: `# TDD Bug Fix — WITH GRILL
# ─────────────────────────────────────────────────────────────────────────────

## Role
You are a senior Java engineer and a relentless bug investigator.
You treat every bug report as a symptom, not a diagnosis.
You do not write any code until the developer has confirmed your findings.

## Environment
- Java binary        : {{JAVA_PATH}}
- Build tool binary  : {{BUILD_TOOL_PATH}}
- Build tool         : {{BUILD_TOOL}}
- JVM args           : {{JVM_ARGS}}

## Context
- Defective class      : {{TARGET_CLASS}}
- Package              : {{PACKAGE}}
- Test framework       : {{TEST_FRAMEWORK}}
- Naming convention    : {{NAMING_CONVENTION}}
- Checkstyle config    : {{CHECKSTYLE_PATH}}
- Local libraries in scope:
{{LOCAL_LIBRARIES}}

### Source class containing the bug
\`\`\`java
{{SOURCE_CLASS}}
\`\`\`

### Existing test class(es)
\`\`\`java
{{EXISTING_TESTS}}
\`\`\`

### Relevant signatures from collaborators
\`\`\`java
{{PASTED_SIGNATURES}}
\`\`\`

## Bug report
{{BUG_DESCRIPTION}}

### Stack trace / error output
\`\`\`
{{STACK_TRACE}}
\`\`\`

### Steps to reproduce
{{REPRODUCTION_STEPS}}

## Developer's root cause hypothesis
{{ROOT_CAUSE_HYPOTHESIS}}

## Hard constraints
{{CONSTRAINTS}}

─────────────────────────────────────────────────────────────────────────────
## GRILL PHASE — do this BEFORE any code

### 1. Bug report interrogation
Flag AMBIGUOUS / INCOMPLETE / POTENTIALLY MISDIAGNOSED.
Per flag: one sharp question + 2 interpretations as options.

### 2. Root cause analysis
Every code path producing the symptom. Confidence HIGH/MEDIUM/LOW.
Evaluate hypothesis: CONFIRMED / PARTIALLY CORRECT / INCORRECT.

### 3. Blast radius assessment
Other inputs/states triggering same path.
Per variant: COVERED / UNTESTED / IMPOSSIBLE.
Fix reported case only, or harden all?

### 4. Existing test gap analysis
Tests that SHOULD have caught this — quote name, explain miss.
False-positive tests (passing only because bug "helps") — flag explicitly.

### 5. Fix strategy options
2–3 approaches: change, scope, masking risk. Recommendation.

### 6. Checkstyle / formatting notes
If config provided ({{CHECKSTYLE_PATH}}): would the fix or regression test
violate any formatting rules? Note rules shaping the fix approach.

### 7. Build environment questions
Do JVM args affect reproducibility? (timezone, locale, assertions)
Confirm test runner uses the same binary path for consistency.

### 8. Regression risk
Tests most likely to fail after fix — and why.
Callers depending on the CURRENT (buggy) behaviour.

─────────────────────────────────────────────────────────────────────────────
## CONFIRMATION GATE

---
**Ready to proceed?**
Confirm: root cause · scope · fix strategy · test corrections · caller migration.

Once confirmed I will implement:
  Step 1–8 of tdd-bugfix sequence.
---
Do NOT write any code until the developer replies.`,
  },
};

// ─── Field schema ─────────────────────────────────────────────────────────────

const COMMON_ENV = [
  { key: "JAVA_PATH",       label: "Java binary path",      type: "text",   placeholder: "/usr/lib/jvm/java-21-openjdk/bin/java", group: "env", required: false },
  { key: "BUILD_TOOL_PATH", label: "Build tool binary path",type: "text",   placeholder: "/opt/maven/bin/mvn", group: "env", required: false },
  { key: "BUILD_TOOL",      label: "Build tool",            type: "select", options: ["Maven","Gradle","Gradle (Kotlin DSL)"], group: "env", required: true },
  { key: "JVM_ARGS",        label: "JVM args",              type: "text",   placeholder: "-Xmx512m -Dspring.profiles.active=test", group: "env", required: false },
];

const COMMON_CTX = [
  { key: "PACKAGE",           label: "Package",            type: "text",   placeholder: "com.example.pricing",         group: "ctx", required: true },
  { key: "TEST_FRAMEWORK",    label: "Test framework",     type: "text",   placeholder: "JUnit 5 + Mockito + AssertJ", group: "ctx", required: true },
  { key: "NAMING_CONVENTION", label: "Test naming",        type: "select", options: ["should_doX_when_Y","givenX_whenY_thenZ","descriptive sentence"], group: "ctx", required: true },
  { key: "CHECKSTYLE_PATH",   label: "Checkstyle XML path",type: "text",   placeholder: "config/checkstyle/checkstyle.xml", group: "ctx", required: false },
  { key: "PASTED_SIGNATURES", label: "Collaborator signatures", type: "code", placeholder: "// paste output from extract-signatures.groovy", group: "ctx", required: false },
];

const SCHEMA = {
  "new-feature": [
    ...COMMON_ENV,
    { key: "TARGET_CLASS",          label: "Target class",               type: "text",     placeholder: "DiscountCalculator  (leave blank to auto-derive)", group: "ctx", required: false },
    { key: "CLASS_NAMING_CONVENTION",label:"Class naming convention",    type: "text",     placeholder: "PascalCase, service suffix (e.g. OrderService)", group: "ctx", required: false },
    ...COMMON_CTX,
    { key: "LOCAL_LIBRARIES",       label: "Local libraries",            type: "liblist",  placeholder: "com.example.pricing.PricingEngine", group: "ctx", required: false },
    { key: "DEPENDENCIES",          label: "Injected dependencies",      type: "text",     placeholder: "UserRepository userRepository, Clock clock", group: "ctx", required: false },
    { key: "FEATURE_DESCRIPTION",   label: "Feature description",        type: "textarea", placeholder: "Describe what needs to be built…", group: "task", required: true },
    { key: "ACCEPTANCE_CRITERIA",   label: "Acceptance criteria",        type: "textarea", placeholder: "- Given a zero amount, result must be 0\n- Given a negative amount, throw IllegalArgumentException", group: "task", required: true },
    { key: "CONSTRAINTS",           label: "Constraints",                type: "textarea", placeholder: "thread-safe, max cyclomatic complexity 5", group: "task", required: false },
  ],
  "refactor": [
    ...COMMON_ENV,
    { key: "TARGET_CLASS",      label: "Target class",         type: "text",     placeholder: "OrderProcessor",    group: "ctx", required: true },
    ...COMMON_CTX,
    { key: "LOCAL_LIBRARIES",   label: "Local libraries",      type: "liblist",  placeholder: "com.example.shared.Money", group: "ctx", required: false },
    { key: "SOURCE_CLASS",      label: "Source class",         type: "code",     placeholder: "// paste full Java source here", group: "ctx", required: true },
    { key: "EXISTING_TESTS",    label: "Existing tests",       type: "code",     placeholder: "// paste full test class here", group: "ctx", required: true },
    { key: "REFACTORING_GOALS", label: "Refactoring goals",    type: "textarea", placeholder: "- Extract fee-calculation into FeeCalculator strategy\n- Eliminate God class smell", group: "task", required: true },
    { key: "CONSTRAINTS",       label: "Hard constraints",     type: "textarea", placeholder: "must not change any public method signature", group: "task", required: false },
  ],
  "improvement": [
    ...COMMON_ENV,
    { key: "TARGET_CLASS",      label: "Target class",         type: "text",     placeholder: "PaymentService",    group: "ctx", required: true },
    { key: "IMPROVEMENT_TYPE",  label: "Improvement type",     type: "multiselect", options: ["performance","resilience","observability","readability","testability","memory","thread-safety"], group: "ctx", required: true },
    ...COMMON_CTX,
    { key: "LOCAL_LIBRARIES",   label: "Local libraries",      type: "liblist",  placeholder: "com.example.infra.MetricsClient", group: "ctx", required: false },
    { key: "SOURCE_CLASS",      label: "Source class",         type: "code",     placeholder: "// paste full Java source here", group: "ctx", required: true },
    { key: "EXISTING_TESTS",    label: "Existing tests",       type: "code",     placeholder: "// paste full test class here", group: "ctx", required: true },
    { key: "IMPROVEMENT_GOALS", label: "Improvement goals",    type: "textarea", placeholder: "- Reduce p99 latency of processOrder() from ~40ms to <5ms\n- Add MDC correlation ID logging", group: "task", required: true },
    { key: "CONSTRAINTS",       label: "Hard constraints",     type: "textarea", placeholder: "must not add Caffeine — use ConcurrentHashMap from JDK only", group: "task", required: false },
  ],
  "bugfix": [
    ...COMMON_ENV,
    { key: "TARGET_CLASS",          label: "Defective class",         type: "text",     placeholder: "PaymentProcessor",  group: "ctx", required: true },
    ...COMMON_CTX,
    { key: "LOCAL_LIBRARIES",       label: "Local libraries",         type: "liblist",  placeholder: "com.example.shared.Money", group: "ctx", required: false },
    { key: "SOURCE_CLASS",          label: "Source class",            type: "code",     placeholder: "// paste full Java source here", group: "ctx", required: true },
    { key: "EXISTING_TESTS",        label: "Existing tests",          type: "code",     placeholder: "// paste full test class here", group: "ctx", required: true },
    { key: "BUG_DESCRIPTION",       label: "Bug description",         type: "textarea", placeholder: "Input: order with negative amount\nActual: returns 0.00 silently\nExpected: throws IllegalArgumentException", group: "task", required: true },
    { key: "STACK_TRACE",           label: "Stack trace",             type: "code",     placeholder: "java.lang.NullPointerException\n\tat com.example...", group: "task", required: false },
    { key: "REPRODUCTION_STEPS",    label: "Reproduction steps",      type: "textarea", placeholder: "Call processPayment(order) where order.getAmount() is negative", group: "task", required: false },
    { key: "ROOT_CAUSE_HYPOTHESIS", label: "Root cause hypothesis",   type: "textarea", placeholder: "Leave blank to let agent diagnose, or state your theory…", group: "task", required: false },
    { key: "CONSTRAINTS",           label: "Hard constraints",        type: "textarea", placeholder: "fix must not change the public API", group: "task", required: false },
  ],
};

const TEMPLATES_META = {
  "new-feature": { label: "New Feature",  icon: "✦", color: "#00e5a0" },
  "refactor":     { label: "Refactor",    icon: "⟳", color: "#4d9fff" },
  "improvement":  { label: "Improvement", icon: "⬆", color: "#ff9f43" },
  "bugfix":       { label: "Bug Fix",     icon: "⬡", color: "#ff5f70" },
};

// ─── Template fill ────────────────────────────────────────────────────────────

function fillTemplate(template, values, activeTemplate) {
  let result = template;

  // Handle LOCAL_LIBRARIES: format list nicely
  const libs = values["LOCAL_LIBRARIES"];
  const libStr = Array.isArray(libs) && libs.filter(Boolean).length > 0
    ? libs.filter(Boolean).map(l => `  - ${l}`).join("\n")
    : "  (none)";
  result = result.split("{{LOCAL_LIBRARIES}}").join(libStr);

  // Handle CLASS_CREATION_NOTE for new-feature
  if (activeTemplate === "new-feature") {
    const tc = values["TARGET_CLASS"];
    const note = (!tc || !tc.trim())
      ? "  → No class provided — agent will derive name from task and naming convention.\n"
      : "";
    result = result.split("{{CLASS_CREATION_NOTE}}").join(note);
  }

  // All other placeholders
  Object.entries(values).forEach(([key, val]) => {
    if (key === "LOCAL_LIBRARIES") return;
    const v = Array.isArray(val) ? val.join(", ") : (val || "");
    result = result.split(`{{${key}}}`).join(v);
  });

  // Leave any still-unfilled placeholders visible
  return result;
}

// ─── Components ───────────────────────────────────────────────────────────────

const css = {
  input: {
    width: "100%", background: "#0d1117", border: "1px solid #30363d",
    borderRadius: "6px", color: "#e6edf3", padding: "8px 10px",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    fontSize: "13px", transition: "border-color 0.15s",
  },
  mono: { fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "12px" },
};

function LibListField({ value, onChange, placeholder }) {
  const libs = Array.isArray(value) ? value : [""];
  const update = (i, v) => { const n = [...libs]; n[i] = v; onChange(n); };
  const add = () => onChange([...libs, ""]);
  const remove = i => onChange(libs.filter((_, j) => j !== i));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {libs.map((lib, i) => (
        <div key={i} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <input value={lib} onChange={e => update(i, e.target.value)}
            placeholder={i === 0 ? placeholder : "com.example.another.Class"}
            style={{ ...css.input, ...css.mono, height: "34px", flex: 1 }} />
          {libs.length > 1 && (
            <button onClick={() => remove(i)} style={{
              width: "28px", height: "28px", borderRadius: "4px", border: "1px solid #30363d",
              background: "transparent", color: "#484f58", cursor: "pointer",
              fontSize: "14px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          )}
        </div>
      ))}
      <button onClick={add} style={{
        alignSelf: "flex-start", padding: "4px 12px", borderRadius: "5px",
        border: "1px dashed #30363d", background: "transparent",
        color: "#484f58", cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
        transition: "all 0.15s",
      }}>+ add library</button>
    </div>
  );
}

function Field({ field, value, onChange }) {
  const base = { ...css.input };
  if (field.type === "select") {
    return (
      <select value={value || ""} onChange={e => onChange(e.target.value)}
        style={{ ...base, height: "34px", cursor: "pointer" }}>
        <option value="">— select —</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (field.type === "multiselect") {
    const sel = Array.isArray(value) ? value : [];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {field.options.map(o => {
          const on = sel.includes(o);
          return (
            <button key={o} onClick={() => onChange(on ? sel.filter(x => x !== o) : [...sel, o])}
              style={{
                padding: "4px 10px", borderRadius: "20px", fontSize: "11px",
                border: `1px solid ${on ? "#4d9fff" : "#30363d"}`,
                background: on ? "rgba(77,159,255,0.15)" : "transparent",
                color: on ? "#4d9fff" : "#8b949e", cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.15s",
              }}>{o}</button>
          );
        })}
      </div>
    );
  }
  if (field.type === "liblist") return <LibListField value={value} onChange={onChange} placeholder={field.placeholder} />;
  if (field.type === "code") return (
    <textarea value={value || ""} onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder} rows={5}
      style={{ ...base, ...css.mono, resize: "vertical", lineHeight: "1.5" }} />
  );
  if (field.type === "textarea") return (
    <textarea value={value || ""} onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder} rows={4}
      style={{ ...base, resize: "vertical", lineHeight: "1.6" }} />
  );
  return (
    <input type="text" value={value || ""} onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder} style={{ ...base, height: "34px" }} />
  );
}

function CopyButton({ text, small }) {
  const [st, setSt] = useState("idle");
  const copy = () => navigator.clipboard.writeText(text).then(() => { setSt("copied"); setTimeout(() => setSt("idle"), 2000); });
  return (
    <button onClick={copy} style={{
      padding: small ? "5px 12px" : "7px 16px",
      borderRadius: "6px", fontSize: "12px",
      border: "1px solid #30363d",
      background: st === "copied" ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.05)",
      color: st === "copied" ? "#00e5a0" : "#8b949e",
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
      display: "flex", alignItems: "center", gap: "6px",
    }}>
      {st === "copied" ? "✓ Copied" : "Copy prompt"}
    </button>
  );
}

const GROUP_LABELS = { env: "Environment", ctx: "Context", task: "Task" };

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tplId, setTplId] = useState("new-feature");
  const [mode, setMode] = useState("standard");
  const [values, setValues] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({ env: false, ctx: true, task: true });
  const previewRef = useRef(null);

  const meta = TEMPLATES_META[tplId];
  const fields = SCHEMA[tplId];
  const rawTpl = T[tplId][mode];
  const generated = fillTemplate(rawTpl, values, tplId);

  const requiredFields = fields.filter(f => f.required);
  const requiredFilled = requiredFields.filter(f => {
    const v = values[f.key];
    return Array.isArray(v) ? v.length > 0 : v && String(v).trim();
  }).length;
  const allRequiredFilled = requiredFilled === requiredFields.length;

  const setField = useCallback((key, val) => setValues(p => ({ ...p, [key]: val })), []);

  useEffect(() => { setValues({}); setShowPreview(false); }, [tplId]);
  useEffect(() => {
    if (showPreview && previewRef.current) previewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showPreview]);

  const toggleGroup = g => setExpandedGroups(p => ({ ...p, [g]: !p[g] }));

  // Group fields
  const grouped = fields.reduce((acc, f) => { (acc[f.group] = acc[f.group] || []).push(f); return acc; }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#010409", color: "#e6edf3", fontFamily: "'IBM Plex Sans','Segoe UI',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #21262d", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "52px", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(1,4,9,0.96)", backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "6px",
            background: `${meta.color}18`, border: `1px solid ${meta.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", color: meta.color,
          }}>{meta.icon}</div>
          <span style={{ fontSize: "13px", fontWeight: 500 }}>TDD Prompt Generator</span>
          <span style={{ color: "#30363d" }}>/</span>
          <span style={{ fontSize: "12px", color: "#8b949e" }}>{meta.label}</span>
          {mode === "grill" && <span style={{ fontSize: "11px", color: "#ff9f43", background: "rgba(255,159,67,0.12)", border: "1px solid rgba(255,159,67,0.25)", borderRadius: "4px", padding: "1px 7px" }}>grill</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", color: "#484f58" }}>{requiredFilled}/{requiredFields.length} required</span>
          <div style={{ width: "72px", height: "3px", background: "#21262d", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "2px", transition: "width 0.3s, background 0.3s", width: `${requiredFields.length ? (requiredFilled / requiredFields.length) * 100 : 0}%`, background: allRequiredFilled ? "#00e5a0" : meta.color }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>

        {/* Sidebar */}
        <div style={{ borderRight: "1px solid #21262d", padding: "20px 0", position: "sticky", top: "52px", height: "calc(100vh - 52px)", overflowY: "auto" }}>
          <div style={{ padding: "0 14px 10px", fontSize: "10px", fontWeight: 600, color: "#484f58", letterSpacing: "0.1em", textTransform: "uppercase" }}>Template</div>
          {Object.entries(TEMPLATES_META).map(([id, t]) => {
            const active = tplId === id;
            return (
              <button key={id} onClick={() => setTplId(id)} style={{
                display: "flex", alignItems: "center", gap: "9px",
                width: "100%", padding: "7px 14px", border: "none",
                background: active ? `${t.color}10` : "transparent",
                borderLeft: `2px solid ${active ? t.color : "transparent"}`,
                color: active ? t.color : "#8b949e",
                fontSize: "12px", cursor: "pointer", textAlign: "left",
                transition: "all 0.15s", fontFamily: "inherit",
              }}>
                <span style={{ fontSize: "13px", width: "15px", textAlign: "center" }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}

          <div style={{ margin: "20px 14px 10px", borderTop: "1px solid #21262d", paddingTop: "16px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#484f58", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Mode</div>
            {[["standard","⚡","Standard"],["grill","🔥","Grill mode"]].map(([m, ic, lb]) => {
              const on = mode === m;
              return (
                <button key={m} onClick={() => setMode(m)} style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  width: "100%", padding: "6px 10px", borderRadius: "5px",
                  border: `1px solid ${on ? meta.color + "55" : "transparent"}`,
                  background: on ? `${meta.color}10` : "transparent",
                  color: on ? meta.color : "#484f58",
                  fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
                  marginBottom: "3px", transition: "all 0.15s", textAlign: "left",
                }}>
                  <span style={{ fontSize: "11px" }}>{ic}</span>{lb}
                </button>
              );
            })}
          </div>

          {mode === "grill" && (
            <div style={{ margin: "0 10px", padding: "9px 10px", borderRadius: "5px", background: "rgba(255,159,67,0.07)", border: "1px solid rgba(255,159,67,0.18)", fontSize: "10px", color: "#ff9f43", lineHeight: "1.5" }}>
              Agent interrogates first, codes after your confirmation.
            </div>
          )}

          <div style={{ margin: "20px 14px 10px", borderTop: "1px solid #21262d", paddingTop: "16px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#484f58", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Actions</div>
            <button onClick={() => setValues({})} style={{
              width: "100%", padding: "6px 10px", borderRadius: "5px",
              border: "1px solid #21262d", background: "transparent",
              color: "#484f58", fontSize: "12px", cursor: "pointer",
              fontFamily: "inherit", textAlign: "left",
            }}>Clear all fields</button>
          </div>
        </div>

        {/* Main */}
        <div style={{ padding: "28px 36px", maxWidth: "840px" }}>

          {/* Title */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "20px", color: meta.color }}>{meta.icon}</span>
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 500 }}>
                {meta.label}
                {mode === "grill" && <span style={{ color: "#ff9f43", marginLeft: "10px", fontSize: "13px", fontWeight: 400 }}>with grill</span>}
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#8b949e", lineHeight: "1.6" }}>
              {tplId === "new-feature" && "Implement a new feature test-first. Leave target class blank to have the agent derive a class name from your task."}
              {tplId === "refactor" && "Safely restructure existing code backed by a coverage audit."}
              {tplId === "improvement" && "Non-functional enhancements: performance, resilience, observability, readability."}
              {tplId === "bugfix" && "Pin a bug as a failing test, then apply the minimal fix."}
              {mode === "grill" && " The agent interrogates your requirements before writing any code."}
            </p>
          </div>

          {/* Grouped fields */}
          {Object.entries(grouped).map(([group, gFields]) => (
            <div key={group} style={{ marginBottom: "24px" }}>
              <button onClick={() => toggleGroup(group)} style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "none", border: "none", cursor: "pointer",
                color: "#8b949e", fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "0 0 10px", fontFamily: "inherit", width: "100%", textAlign: "left",
              }}>
                <span style={{ transition: "transform 0.2s", display: "inline-block", transform: expandedGroups[group] ? "rotate(90deg)" : "rotate(0deg)", fontSize: "9px" }}>▶</span>
                {GROUP_LABELS[group]}
                <span style={{ marginLeft: "auto", fontSize: "10px", color: "#30363d", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                  {gFields.filter(f => { const v = values[f.key]; return Array.isArray(v) ? v.filter(Boolean).length > 0 : v && String(v).trim(); }).length}/{gFields.length}
                </span>
              </button>

              {expandedGroups[group] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "14px", borderLeft: "1px solid #21262d" }}>
                  {gFields.map(field => (
                    <div key={field.key}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#cdd9e5", letterSpacing: "0.02em" }}>{field.label}</label>
                        {field.required
                          ? <span style={{ fontSize: "10px", color: meta.color, opacity: 0.75 }}>required</span>
                          : <span style={{ fontSize: "10px", color: "#30363d" }}>optional</span>
                        }
                        {field.key === "TARGET_CLASS" && tplId === "new-feature" && (
                          <span style={{ fontSize: "10px", color: "#484f58", marginLeft: "4px" }}>— blank = auto-derive</span>
                        )}
                        {field.key === "CHECKSTYLE_PATH" && (
                          <span style={{ fontSize: "10px", color: "#484f58", marginLeft: "4px" }}>— all generated code will conform</span>
                        )}
                      </div>
                      <Field field={field} value={values[field.key]} onChange={v => setField(field.key, v)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "18px 0", borderTop: "1px solid #21262d" }}>
            <button onClick={() => setShowPreview(v => !v)} style={{
              padding: "8px 18px", borderRadius: "6px", fontSize: "13px",
              border: `1px solid ${allRequiredFilled ? meta.color : "#30363d"}`,
              background: allRequiredFilled ? `${meta.color}15` : "transparent",
              color: allRequiredFilled ? meta.color : "#484f58",
              cursor: allRequiredFilled ? "pointer" : "not-allowed",
              fontFamily: "inherit", fontWeight: 500, transition: "all 0.2s",
            }}>
              {showPreview ? "Hide preview" : "Preview prompt"}
            </button>
            {showPreview && <CopyButton text={generated} />}
          </div>

          {/* Preview */}
          {showPreview && (
            <div ref={previewRef} style={{ borderRadius: "8px", border: "1px solid #21262d", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: "#0d1117", borderBottom: "1px solid #21262d" }}>
                <span style={{ fontSize: "11px", color: "#484f58", fontFamily: "monospace" }}>
                  {tplId}-{mode}.prompt
                </span>
                <CopyButton text={generated} small />
              </div>
              <pre style={{
                margin: 0, padding: "18px",
                background: "#0d1117",
                fontSize: "11px", lineHeight: "1.65",
                fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
                color: "#cdd9e5", whiteSpace: "pre-wrap", wordBreak: "break-word",
                maxHeight: "580px", overflowY: "auto",
              }}>
                {generated.split(/(\{\{[A-Z_]+\}\})/g).map((part, i) =>
                  part.match(/^\{\{[A-Z_]+\}\}$/)
                    ? <mark key={i} style={{ background: "rgba(255,95,112,0.18)", color: "#ff5f70", borderRadius: "3px", padding: "0 2px" }}>{part}</mark>
                    : <span key={i}>{part}</span>
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
