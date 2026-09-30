# Comparison: bolt.new vs Google AI Studio (Build)

Same input for both: the eight context files plus one instruction line naming F-04, pasted once, no follow-ups. The inputs were fully identical. One run each, 2026-09-28 about 9:55 PM. I compared bolt's original zip and AI Studio's export by reading and searching the code.

**Where they agreed.** Both built a two-area selector (Business Credit, Treasury Management) with a summary of typical work, conversation starters, and an illustrative notice on a selected area. Both produced a TypeScript and React project with Tailwind, loaded Roboto and Roboto Slab from Google Fonts, used the four STYLE.md colors, hardcoded the guide content, and declared dependencies the code never imports (bolt: Supabase; AI Studio: @google/genai, express, dotenv, motion). Both reported their own work as verified.

**Where they differed.**
- **F-04-3:** bolt replaces the card grid with a detail view and a Back button. AI Studio keeps both cards visible and marks the chosen one "Selected."
- **Scope:** bolt built only F-04. AI Studio also rebuilt F-01 (the directory), added tabs and a button linking the guide to the directory, and added a verification panel that hardcodes "ALL PASS." FEATURES.md says F-04 sits "alongside the existing directory," which may have invited this.
- **Storage:** bolt stored nothing. AI Studio's `storageService.ts` uses `localStorage`, seeded with four made-up entries, and never calls my Worker. ARCHITECTURE.md puts directory data in D1 behind the Worker.
- **Tokens:** see the Loose prediction below.

**Loose prediction.** I predicted bolt's output would follow STYLE.md color and font tokens more consistently than AI Studio's. Counting rule, the same for both: distinct colors in the source outside the four STYLE.md colors, plus uses of text below the 14px `font-size-min`, using the tokens as they were when I delegated (Roboto and Roboto Slab, before I changed them to Arial).
- bolt: 7 outside colors (five primary tints, an amber warning color, and its light variant); 2 uses of `text-xs` (12 px).
- AI Studio: 24 outside hex values and 23 default-palette color classes (greens, reds, grays, amber); 73 uses below 14 px (54 `text-xs`, 15 at 11 px, 4 at 10 px), although its summary claims a 14 px minimum.
- Result: held on this run. Caveats: the two counts were taken from different code (Tailwind class names versus hex values), `text-xs` is assumed to be Tailwind's 12 px default, and this is one run per tool.

**What the agreement says about my spec.** Both tools converged on the same two-area layout, illustrative notice, and palette, which suggests the EARS rows and STYLE.md pin down content and look well, while their split on F-04-3 and on scope suggests that "keeping the other area available" and the edge of the feature are under-specified.
