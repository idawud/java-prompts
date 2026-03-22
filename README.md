# TDD Agent Mode Prompt Toolkit

A complete one-shot prompting system for IntelliJ agent mode, covering TDD
workflows for Java developers.

---

## Contents

```
java-prompts/
├── PromptGenerator.jsx          React app — generates filled prompts in the browser
├── extract-signatures.groovy    IntelliJ scratch file — extracts class signatures to clipboard
├── prompts/
│   ├── tdd-new-feature.prompt   Standard: new feature (RED → GREEN → REFACTOR)
│   ├── tdd-refactor.prompt      Standard: safe refactoring with coverage audit
│   ├── tdd-improvement.prompt   Standard: non-functional improvements test-first
│   ├── tdd-bugfix.prompt        Standard: pin bug as failing test then fix
│   └── README.md
└── prompts-grill/
    ├── tdd-new-feature-grill.prompt   Grill: interrogate requirements before coding
    ├── tdd-refactor-grill.prompt      Grill: smell analysis + strategy sign-off
    ├── tdd-improvement-grill.prompt   Grill: sharpen goals + strategy confirmation
    ├── tdd-bugfix-grill.prompt        Grill: detective investigation before fix
    └── README.md
```

---

## Quick start

### Option A — React app (recommended)
Open `PromptGenerator.jsx` as an artifact in Claude.ai, or drop it into a
Vite/CRA project.  Fill in the form fields and copy the generated prompt.

### Option B — Raw templates
Open any `.prompt` file, replace `{{PLACEHOLDERS}}` manually, paste into
IntelliJ agent mode chat (reference with `@filename` or paste directly).

### Option C — Signature extraction
Open `extract-signatures.groovy` in IntelliJ as a scratch file.
Add FQNs to `TARGET_CLASSES`, run with "Run using IDE".
Output lands in clipboard — paste into the `{{PASTED_SIGNATURES}}` field.

---

## New features in this version

### Checkstyle integration
All templates accept a `{{CHECKSTYLE_PATH}}` (e.g. `config/checkstyle/checkstyle.xml`).
When provided, the agent is instructed to conform all generated code to that
config and note any rule that influenced a formatting or structural decision.
Grill templates add a dedicated checkstyle interrogation section.

### Build tool and Java binary paths
All templates accept `{{JAVA_PATH}}` and `{{BUILD_TOOL_PATH}}` for full path
specification (useful in CI or multi-JDK environments).
Every template's output includes an exact shell command using those paths.

### JVM args
`{{JVM_ARGS}}` is injected into both the context block and the build command.
Grill templates ask whether test-phase JVM args differ from build-phase args,
and flag any arg that could affect test behaviour or benchmark results.

### Multiple local libraries
The `{{LOCAL_LIBRARIES}}` slot now accepts a list (one entry per line with
`- ` prefix) rather than a comma-separated string. The React app renders this
as a dynamic list with add/remove rows. In the templates it formats cleanly
as a bullet list the agent can scan quickly.

### Auto class name derivation (new-feature only)
If `{{TARGET_CLASS}}` is left blank, a `{{CLASS_CREATION_NOTE}}` is injected
that instructs the agent to derive a class name from the feature description
and the project's `{{CLASS_NAMING_CONVENTION}}`. The agent states the derived
name and reasoning as Step 0 before writing any code. Grill mode adds a
dedicated section (section 0) that proposes 2–3 candidate names and asks for
developer confirmation before proceeding.

---

## Placeholder reference

### All templates
| Placeholder | Description | Required |
|---|---|---|
| `{{JAVA_PATH}}` | Full path to java binary | optional |
| `{{BUILD_TOOL_PATH}}` | Full path to mvn/gradle binary | optional |
| `{{BUILD_TOOL}}` | Build tool name | required |
| `{{JVM_ARGS}}` | JVM arguments for test runs | optional |
| `{{TARGET_CLASS}}` | Simple class name | required (optional for new-feature) |
| `{{PACKAGE}}` | Java package | required |
| `{{TEST_FRAMEWORK}}` | Test libraries | required |
| `{{NAMING_CONVENTION}}` | Test method naming style | required |
| `{{CHECKSTYLE_PATH}}` | Path to checkstyle.xml | optional |
| `{{LOCAL_LIBRARIES}}` | Local class FQNs (list) | optional |
| `{{PASTED_SIGNATURES}}` | Extracted method signatures | optional |
| `{{CONSTRAINTS}}` | Hard limits | optional |

### new-feature only
| Placeholder | Description |
|---|---|
| `{{CLASS_NAMING_CONVENTION}}` | Project class naming style (e.g. PascalCase service suffix) |
| `{{CLASS_CREATION_NOTE}}` | Auto-injected when TARGET_CLASS is blank |
| `{{DEPENDENCIES}}` | Already-injected collaborators |
| `{{FEATURE_DESCRIPTION}}` | What to build |
| `{{ACCEPTANCE_CRITERIA}}` | Observable outcomes |

### refactor only
| `{{SOURCE_CLASS}}` | Full source to refactor |
| `{{EXISTING_TESTS}}` | Existing test class source |
| `{{REFACTORING_GOALS}}` | Structural goals |

### improvement only
| `{{SOURCE_CLASS}}` | Full source to improve |
| `{{EXISTING_TESTS}}` | Existing test class source |
| `{{IMPROVEMENT_TYPE}}` | Category (performance, resilience, etc.) |
| `{{IMPROVEMENT_GOALS}}` | Measurable goals with baseline + target |

### bugfix only
| `{{SOURCE_CLASS}}` | Defective class source |
| `{{EXISTING_TESTS}}` | Existing test class source |
| `{{BUG_DESCRIPTION}}` | Input / actual / expected |
| `{{STACK_TRACE}}` | Error output verbatim |
| `{{REPRODUCTION_STEPS}}` | How to trigger the bug |
| `{{ROOT_CAUSE_HYPOTHESIS}}` | Your theory (or blank for agent diagnosis) |
