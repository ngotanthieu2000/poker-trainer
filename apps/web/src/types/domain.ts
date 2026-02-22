export type CoachGrade = "Good" | "Mistake" | "Major Mistake";

export interface CoachHint {
  messageVi: string;
  recommendedAction: string;
  distribution?: Record<string, number>;
  source?: string;
}

export interface DecisionEvent {
  type: "decision";
  index: number;
  street: "preflop" | "flop" | "turn" | "river";
  actor: string;
  action: string;
  grade: CoachGrade;
  messageVi: string;
  recommendedAction?: string;
  at?: string;
}

export interface HandHistory {
  handId: string;
  sessionId: string;
  startedAt?: string;
  context?: {
    position?: string;
    heroPosition?: string;
    toCall?: number;
  };
  timeline?: DecisionEvent[];
  coachLogs?: Array<Record<string, unknown>>;
}

export interface ProgressStats {
  summary: {
    totalHands: number;
    totalDecisions: number;
    placeholderStreetCoverage: string[];
  };
  accuracyByPosition: Record<string, { correct: number; total: number; accuracy: number | null }>;
  accuracyByStreet: Record<string, { correct: number; total: number; accuracy: number | null; status: string }>;
  topErrors: Array<{ key: string; street: string; action: string; recommendedAction: string; grade: string; count: number; messageVi: string }>;
  recentHands: Array<{ handId: string; sessionId: string; startedAt?: string; position: string; decisionCount: number; accuracy: number | null }>;
}
