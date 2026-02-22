# Day 4 — Bot styles v1 + decision logging

## Scope delivered

- Implemented preflop heuristic bot styles v1:
  - `nit`
  - `tag`
  - `lag`
  - `calling_station`
- Added engine integration entry point to apply bot decision into existing hand state skeleton.
- Added structured decision logging with fields:
  - `sessionId`
  - `handId`
  - `round`
  - `actor`
  - `action`
  - `reason`
  - `timestamp`
- Added unit tests for profile behavior differences and logging output.

## New modules

- `src/bot/preflop-strategy.js`
  - `decidePreflopAction(context)`
  - lightweight hand feature extraction and profile-specific thresholds
- `src/engine/bot-decision.js`
  - `applyBotPreflopDecision(state, context, options)`
  - plugs bot action into `submitAction` from day3 state-machine
- `src/logging/decision-logger.js`
  - `createDecisionLogEntry(payload)`
  - `createDecisionLogger(sink)`

## Test coverage highlights

- NIT folds weak offsuit hands facing action.
- TAG raises strong broadway range.
- LAG raises wider speculative/playable range.
- Calling Station calls wider facing bet.
- Bot integration appends action to state and emits structured log entry.
- Guard rail: bot v1 rejects non-preflop streets.
