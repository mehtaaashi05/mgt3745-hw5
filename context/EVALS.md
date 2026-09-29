# EVALS.md

The stake below was written  on 2026-09-28 at 20:40 EDT. 

## 1. RAT statement

The riskiest assumption in delegating F-04 is that concise descriptions of typical work by line of business help a hesitant intern choose which team to learn about; if they do not help the intern distinguish or choose a team, the feature has no value, which the feature-specific judgment questions will test.

## 2. Prediction Stake (2026-09-28, 20:40 EDT)

- **Tight:** At least 3 of 4 F-04 EARS rows will pass on bolt.new's first integrated output.
  - Resolution pending the first integrated bolt.new build.
- **Loose:** bolt.new's first output will follow STYLE.md color and font tokens more consistently than AI Studio's output.
  - Resolution pending review of both outputs against STYLE.md.
- **Open:** bolt.new will introduce a dependency or network call not requested in the prompt.
  - Resolves when I inspect the original zip, package.json, and output code.

## 3. Success criteria
| EARS row (feature) | Checked by | Where |
|---|---|---|
|WHEN an intern opens the guide, show Business Credit and Treasury Management| test | evals/f04-guide.test.js, "F-04-1 guide data lists Business Credit and Treasury Management" |
|WHEN an area is selected, show summary and at least one conversation starter|test (data) + judgement (display)|same file, "F-04-2 every are has a summary and at least one starter";  |
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

Walk every statement against the deployed page. PASS, FAIL, CANNOT TEST YET, or DEFERRED, with a reason.

HW4 validation rule: IF entry text is longer than 200 characters, THEN THE SYSTEM SHALL reject it and say that the maximum is 200 characters.

| Statement | HW3 verdict | HW4 verdict | Reason |
|---|---|---|---|
| Confirm a submitted conversation request within 2 seconds | PASS | PASS | The Live Server page displayed “Conversation request sent. This is informational and non-committal.” immediately after the request button was clicked. |
| Show manager notification and no negative flag after two conversations | CANNOT TEST YET | CANNOT TEST YET | Manager notification and performance-status tracking are outside this implementation. |
| Remove an opted-out employee from results within 1 minute | PASS | PASS | The page removes the entry after the successful save in HW3; the HW4 page waits for DELETE success and refreshes immediately. |
| Disable new requests by the day after an internship ends | DEFERRED | DEFERRED | The prototype has no identity or internship-lifecycle system; see the architecture decision. |
| Do not create a transfer request when an exploratory request completes | CANNOT TEST YET | PASS | The tested request interaction only displays the informational confirmation; it makes no transfer-request call and the Worker has no transfer-request route. |
| Return entries in order | PASS | PASS | Deployed `GET /entries` returned entries ordered by their creation IDs. |
| Store valid entry | PASS | PASS | Deployed `POST /entries` returned 201 and a follow-up GET returned the entry. |
| Reject missing text | *?* | PASS | Deployed POST with missing text returned 400 and `text required`; the page shows the response. |
| Survive cleared cache | — | PASS | This is a new HW4 requirement, not an HW3 acceptance statement. The entry remained available from the deployed API after browser site data was cleared and the page was reloaded. |
| Server unreachable | | CANNOT TEST YET | The page catches fetch failures and shows an error, but an outage still needs to be simulated. |
| Server returns 500 | | CANNOT TEST YET | The page handles a non-success response, but the deployed 500 path still needs to be exercised. |
| Server returns 400 for overlong text | | PASS | Deployed POST with more than 200 characters returned 400 and named the 200-character limit. |
| Second client writes to the same table | | DEFERRED | Shared storage is supported, but per-user identity and authorization are outside this HW4 scope; see ADR-002. |