import { z } from "zod";
import axios from "axios";
import {  DashboardMetricsResponse } from "@/src/types/dashboard";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const dashboardMetricsSchema = z.object({
  total_projects: z.number(),
  active_projects: z.number(),
  pending_projects: z.number(),
  total_investors: z.number(),
  funds_raised: z.number(),
  upcoming_payouts: z.array(
    z.object({
      id: z.number(),
      project_id: z.number(),
      scheduled_date: z.string(),
      amount: z.number(),
      status: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })
  ),
});

export async function getDashboardMetrics(token: string): Promise<DashboardMetricsResponse> {
  try {
    const response = await axios.get(`${BASE_URL}/api/sponsor-dashboard/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    const result = response.data;

    // Handle different response structures
    let dataToValidate = result;
    if (result.data && typeof result.data === "object") {
      dataToValidate = result.data;
    }

    // Validate the response data
    const validatedData = dashboardMetricsSchema.safeParse(dataToValidate);

    if (!validatedData.success) {
      console.error("Validation failed:", validatedData.error);
      throw new Error("Invalid response data format");
    }

    return {
      data: validatedData.data,
      message: "Dashboard metrics retrieved successfully",
      status: "success",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout - please try again");
      }

      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error - please check your connection");
      }

      if (response?.status === 401) {
        throw new Error("Unauthorized access");
      }

      if (response?.status === 403) {
        throw new Error("Access forbidden");
      }

      if (response?.status === 404) {
        throw new Error("Dashboard metrics not found");
      }

      if (response?.status === 500) {
        throw new Error("Internal server error");
      }

      if (response?.status === 408 || response?.status === 504) {
        throw new Error("Request timeout - please try again");
      }

      throw new Error(response?.data?.message || "Failed to fetch dashboard metrics");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Something went wrong while fetching dashboard metrics");
  }
}
