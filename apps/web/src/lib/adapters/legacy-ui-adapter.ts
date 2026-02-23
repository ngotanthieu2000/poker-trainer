import type { HandHistory, ProgressStats } from "@/types/domain";

export async function renderLegacyTablePreview() {
  const legacy = (await import("../../../../../src/ui/table-ui.js")) as {
    createInitialUiState: (input?: Record<string, unknown>) => Record<string, unknown>;
    renderTableHtml: (state: Record<string, unknown>) => string;
  };

  const state = legacy.createInitialUiState({ level: "Beginner", viewStatus: "ready" });
  return legacy.renderTableHtml(state);
}

export async function buildLegacyReviewPreview(hand: HandHistory) {
  const legacy = (await import("../../../../../src/review/review-module.js")) as {
    buildHandReview: (history: HandHistory) => Record<string, unknown>;
    renderReviewText: (review: Record<string, unknown>) => string;
  };

  const review = legacy.buildHandReview(hand);
  return legacy.renderReviewText(review);
}

export async function computeLegacyProgressPreview(hands: HandHistory[]): Promise<ProgressStats> {
  const legacy = (await import("../../../../../src/progress/progress-metrics.js")) as {
    computeProgressStats: (input: HandHistory[]) => ProgressStats;
  };

  return legacy.computeProgressStats(hands);
}
