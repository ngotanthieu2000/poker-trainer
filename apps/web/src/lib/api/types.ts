import type { HandHistory, ProgressStats } from "@/types/domain";

export interface ApiResponse<T> {
  status: "ready" | "empty" | "error";
  data: T;
  message?: string;
}

export interface GetProgressStatsQuery {
  sessionId?: string;
  limit?: number;
}

export interface GetHandReviewQuery {
  handId: string;
}

export interface ApiClient {
  getProgressStats(query?: GetProgressStatsQuery): Promise<ApiResponse<ProgressStats>>;
  getHandReview(query: GetHandReviewQuery): Promise<ApiResponse<HandHistory>>;
}
