import type { ApiClient, ApiResponse, GetHandReviewQuery, GetProgressStatsQuery } from "./types";
import type { HandHistory, ProgressStats } from "@/types/domain";

export interface ApiClientConfig {
  baseUrl: string;
  headers?: HeadersInit;
}

function toQueryString(query?: Record<string, unknown>) {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number") {
      params.set(key, String(value));
    }
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

async function request<T>(baseUrl: string, path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      status: "error",
      data: {} as T,
      message: `HTTP ${response.status}`,
    };
  }

  return (await response.json()) as ApiResponse<T>;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const { baseUrl } = config;

  return {
    getProgressStats(query?: GetProgressStatsQuery) {
      return request<ProgressStats>(baseUrl, `/api/progress${toQueryString(query ? { ...query } : undefined)}`);
    },
    getHandReview(query: GetHandReviewQuery) {
      return request<HandHistory>(baseUrl, `/api/review${toQueryString({ ...query })}`);
    },
  };
}
