/**
 * Public API types (DTOs)
 * These types define what data is safe to expose to the client
 */

export type {
  UserPublicDTO,
  UserProfileDTO,
  BadgeDTO,
  ProgressDTO,
  LeaderboardEntryDTO,
  ChallengeProgressDTO,
  ChallengeOverviewDTO,
  TenantPublicDTO,
  TenantAdminDTO,
} from '@/lib/utils/dto';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Action result types
export interface ActionResult {
  success: boolean;
  error?: string;
}

export interface RegisterTradeResult extends ActionResult {
  xpEarned?: number;
  newLevel?: number;
}

export interface CompleteDayResult extends ActionResult {
  xpEarned?: number;
}
