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

## Run tests

```bash
npm test
```
