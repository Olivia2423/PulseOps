import { api } from "@/lib/api";
import type { Alert } from "@/types/events";

export async function fetchAlerts(): Promise<Alert[]> {
  const res = await api.get<Alert[]>("/api/alerts");
  return res.data;
}