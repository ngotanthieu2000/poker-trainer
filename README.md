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

## Run tests

```bash
npm test
```
