# Reading a Delegated Build: the seven questions

Binary answers only. Each No is a row in the EVALS.md error-analysis log.

| # | Question | bolt | AI Studio | Log category |
|---|---|---|---|---|
| 1 | Did it touch only the files you named? | **No** — generated a separate React/Vite project. | **No** — also rebuilt F-01 and added unrelated UI. | scope |
| 2 | Any `innerHTML` with user input? Any concatenated SQL? (Yes is bad) | **No** — none found in the reviewed archive. | **No** — none identified in the reviewed export. | STANDARDS |
| 3 | Are colors and fonts the STYLE.md tokens, or its own? | **No** — palette/font drift; 7 extra colors and 12px text. | **No** — palette/font drift; 24 extra hex colors and text below 14px. | STYLE |
| 4 | Did it add a dependency? Which? What does that package do? | **Yes** — React UI, Supabase client, and Lucide icons; unnecessary for the static app. | **Yes** — React UI, Google GenAI, Express, dotenv, and motion packages; unnecessary for the static app. | dependency |
| 5 | Does it call your Worker, or did it invent its own storage? | **No** — standalone guide; no Worker/D1 directory integration. | **No** — replaced the Worker-backed directory with localStorage. | architecture |
| 6 | Run the feature's EARS rows by hand. How many pass? | **3/4** — switching to the other area required returning with Back. | **4/4** — both areas remained available while selecting. | EARS |
| 7 | Is there anything you cannot explain? Name the line. | **Yes** — the original zip's full transitive dependency licenses were not audited (DDR-001, Verification). | **No** — no unexplained source line was recorded in the comparison. | cannot verify |
