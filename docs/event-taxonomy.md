# Event Taxonomy (Day 2)

This document defines the baseline event naming and envelope contract for internal domain events.

## Naming Convention

`<domain>.<entity>.<verb>`

Examples:
- `gameplay.action.submitted`
- `coach.recommendation.generated`
- `review.hand.completed`
- `progress.snapshot.generated`

## Domains

- `gameplay`: real-time session/hand/action lifecycle
- `coach`: recommendations and user feedback loop
- `review`: post-session hand analysis
- `progress`: aggregate learning outcomes and milestones

## Envelope Fields

All events should include:

- `id` (UUID)
- `name` (event name from taxonomy)
- `domain` (gameplay|coach|review|progress)
- `version` (event schema version, starting at 1)
- `userId` (UUID)
- `occurredAt` (ISO timestamp)
- `payload` (event-specific object)

Recommended tracing fields:
- `sessionId`, `handId`
- `correlationId`, `causationId`
- `actorId`

## Initial Event Set

1. gameplay.session.created
2. gameplay.hand.started
3. gameplay.action.submitted
4. gameplay.hand.completed
5. coach.recommendation.generated
6. coach.feedback.submitted
7. review.hand.queued
8. review.hand.completed
9. progress.snapshot.generated
10. progress.milestone.reached

## Versioning

- Breaking changes -> new `version`
- Non-breaking additions -> same `version`, optional payload fields
- Keep old consumers compatible for at least one release cycle
