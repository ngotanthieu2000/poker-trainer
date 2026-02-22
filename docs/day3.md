# Day 3 - Engine State Machine Skeleton

## Scope

Implemented a lightweight hand-flow state machine for the engine layer.

- Initial street: `preflop`
- Ordered transitions only:
  `preflop -> flop -> turn -> river -> showdown`
- Basic guards:
  - reject invalid street names
  - reject out-of-order transitions
  - reject transitions from terminal state (`showdown`)
- Minimal action validation:
  - allowed actions: `fold`, `check`, `call`, `bet`, `raise`, `all_in`
  - `bet/raise/all_in` require positive `amount`
  - optional `amount` must be a non-negative number when present

## Tests

Unit tests cover:

1. Happy path street transitions to showdown
2. Invalid transition order rejection
3. Valid minimal action submission
4. Invalid action type rejection
5. Amount requirement for `bet/raise/all_in`
