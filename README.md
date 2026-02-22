# Poker Trainer

Day 2 baseline scaffolding:

- API contracts: `docs/api/contracts.yaml`
- Event taxonomy: `docs/event-taxonomy.md`, `src/types/event-taxonomy.ts`
- PostgreSQL migration skeleton: `db/migrations/0001_core_entities.sql`

Day 3 additions:

- Engine hand-flow state machine skeleton: `src/engine/state-machine.js`
  - Ordered street flow: `preflop -> flop -> turn -> river -> showdown`
  - Basic transition guards to reject out-of-order transitions
  - Minimal action validation (`fold/check/call/bet/raise/all_in`, amount checks)
- Unit tests for valid and invalid transitions/actions: `tests/engine-state-machine.test.js`

Day 4 additions:

- Bot styles v1 (preflop heuristic): `nit`, `tag`, `lag`, `calling_station`
  - Strategy module: `src/bot/preflop-strategy.js`
- Engine integration to apply bot action into hand state:
  - `src/engine/bot-decision.js`
- Structured decision logging for bot actions:
  - `src/logging/decision-logger.js`
  - Log shape: `sessionId/handId/round/actor/action/reason/timestamp`
- Unit tests for profile behavior + logging output:
  - `tests/bot-preflop-strategy.test.js`
  - `tests/bot-decision-logging.test.js`
- Day 4 note: `docs/day4.md`

Day 5 additions:

- Data-driven precomputed GTO baseline (preflop):
  - `src/data/preflop-gto-baseline.json`
  - Mapping `spot -> hand -> action distribution`
- Coach-facing recommendation helper/service:
  - `src/coach/preflop-gto-baseline.js`
  - `src/coach/preflop-coach-service.js`
- Safe fallback when data is missing (never crash, always includes reason)
- Unit tests for baseline data hit, fallback path, and distribution validity:
  - `tests/preflop-gto-baseline.test.js`
- Day 5 note: `docs/day5.md`

Day 6 additions:

- Realtime coach v1:
  - `src/coach/realtime-coach-service.js`
  - Pre-action hint + post-action grading (`Good / Mistake / Major Mistake`)
  - Vietnamese short explanations for hints/grades
- Integration with Day 5 coach recommendation service:
  - uses `getCoachPreflopRecommendation` for baseline/fallback
- Minimal handler entry point:
  - `src/api/realtime-coach-handler.js`
- Unit tests:
  - `tests/realtime-coach-v1.test.js`
- Day 6 note: `docs/day6.md`

Day 7 additions:

- Table UI v1 (6-max basic view):
  - `src/ui/table-ui.js`
  - Seats/positions, pot, stack, minimal actions (`fold/call/raise`)
- Realtime coach panel UI + level behavior:
  - `Beginner / Intermediate / Pro`
  - Different hint visibility/detail by level
- End-to-end UI controller + local adapter:
  - `src/ui/poker-table-controller.js`
  - `src/ui/local-coach-adapter.js`
- Unit tests for render + level toggle + coach update flow:
  - `tests/day7-table-ui-coach.test.js`
- Day 7 note: `docs/day7.md`

Day 8 additions:

- Hand history timeline storage (in-memory, extensible hooks):
  - `src/review/hand-history-store.js`
- Review module to inspect decisions after hand:
  - `src/review/review-module.js`
  - grade marker mapping: `src/review/grade-marker.js`
  - EV loss field per decision (heuristic proxy, not solver EV)
- Gameplay + coach log wiring in table controller:
  - `getCurrentHandHistory()`
  - `getReview()`
  - `renderReview()`
- Unit/integration tests for Day 8 review flow:
  - `tests/day8-hand-history-review.test.js`
- Day 8 note: `docs/day8.md`

Day 9 additions:

- Progress tracking metrics module for dashboard:
  - `src/progress/progress-metrics.js`
  - Accuracy by position (`UTG/HJ/CO/BTN/SB/BB`)
  - Accuracy by street (`preflop` implemented, `flop/turn/river` explicit placeholders)
  - Top 3 frequent mistakes
  - Recent hands (up to latest 50)
- Minimal API handler for UI:
  - `src/api/progress-stats-handler.js`
- Context update to carry hero position for aggregation:
  - `src/ui/table-ui.js`
- Unit tests for metric computation + edge cases:
  - `tests/day9-progress-dashboard.test.js`
- Day 9 note: `docs/day9.md`

Day 10 additions:

- Vietnamese localization consistency for table/coach/review/progress:
  - `src/i18n/messages-vi.js`
  - `src/ui/table-ui.js`
  - `src/review/review-module.js`
  - `src/review/grade-marker.js`
  - `src/progress/progress-metrics.js`
- Poker glossary (Vietnamese):
  - `docs/glossary-vi.md`
- Day 10 note:
  - `docs/day10.md`
- Consistency tests for key labels/text:
  - `tests/day10-vi-localization-consistency.test.js`

## Run tests

```bash
npm test
```
