export type Domain = 'gameplay' | 'coach' | 'review' | 'progress';

export type EventName =
  | 'gameplay.session.created'
  | 'gameplay.hand.started'
  | 'gameplay.action.submitted'
  | 'gameplay.hand.completed'
  | 'coach.recommendation.generated'
  | 'coach.feedback.submitted'
  | 'review.hand.queued'
  | 'review.hand.completed'
  | 'progress.snapshot.generated'
  | 'progress.milestone.reached';

export interface EventEnvelope<TPayload = Record<string, unknown>> {
  id: string;
  name: EventName;
  domain: Domain;
  version: 1;
  actorId?: string;
  userId: string;
  sessionId?: string;
  handId?: string;
  occurredAt: string; // ISO-8601
  correlationId?: string;
  causationId?: string;
  payload: TPayload;
}

export interface GameplayActionSubmittedPayload {
  action: 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'all_in';
  amount: number;
  street: 'preflop' | 'flop' | 'turn' | 'river';
  position: 'utg' | 'hj' | 'co' | 'btn' | 'sb' | 'bb';
}

export interface CoachRecommendationGeneratedPayload {
  recommendationId: string;
  suggestedAction: 'fold' | 'call' | 'raise';
  confidence: number;
  rationale: string[];
}

export interface ReviewHandCompletedPayload {
  score: number;
  mistakeTags: string[];
  reviewedAt: string;
}

export interface ProgressSnapshotGeneratedPayload {
  range: '7d' | '30d' | '90d';
  sessionsPlayed: number;
  handsReviewed: number;
  averageScore: number;
  leakTags: string[];
}
