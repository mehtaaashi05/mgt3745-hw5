# EVALS.md

The stake below was written  on 2026-09-26 at 20:40 EDT. 

## 1. RAT statement

The riskiest assumption in delegating F-04 is that concise descriptions of typical work by line of business help a hesitant intern choose which team to learn about; if they do not help the intern distinguish or choose a team, the feature has no value, which the feature-specific judgment questions will test.

## 2. Prediction Stake (2026-09-26, 20:40 EDT)

- **Tight:** At least 3 of 4 F-04 EARS rows will pass on bolt.new's first integrated output.
  - Resolution pending the first integrated bolt.new build.
- **Loose:** bolt.new's first output will follow STYLE.md color and font tokens more consistently than AI Studio's output.
  - Resolution pending review of both outputs against STYLE.md.
- **Open:** bolt.new will introduce a dependency or network call not requested in the prompt.
  - Resolves when I inspect the original zip, package.json, and output code.

## 3. Success criteria
| EARS row (feature) | Checked by | Where |
|---|---|---|
| WHEN ..., THE SYSTEM SHALL ... | test | evals/worker.test.js, "..." |
| IF ..., THEN THE SYSTEM SHALL ... | judgment | docs/JUDGMENT.md #8 |
| THE SYSTEM SHALL ... | human | README, See It Work |

## 4. Error-analysis log
<!-- Every failure observed, a few words each, counted, sorted by count. -->
| Failure (a few words) | Count | Source | Category |
|---|---|---|---|
| Buttons used its own blue, not color-primary | 2 | bolt, AI Studio | STYLE |
| | | | |

## 5. Evals
- **Code:** `npm test` with `API=<worker url>`; _ tests, _ passing. Screenshot in README.
- **Judgment:** docs/JUDGMENT.md, _ questions, two graders, agreement _%.

## Verification table (carried from HW4)
<!-- Paste your HW4 verification table here; it is the ancestor of section 3. -->
