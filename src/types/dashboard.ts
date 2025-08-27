export interface UpcomingPayout {
  id: number;
  project_id: number;
  scheduled_date: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  total_projects: number;
  active_projects: number;
  pending_projects: number;
  total_investors: number;
  funds_raised: number;
  upcoming_payouts: UpcomingPayout[];
}

export interface DashboardMetricsResponse {
  data: DashboardMetrics;
  message?: string;
  status?: string;
}
