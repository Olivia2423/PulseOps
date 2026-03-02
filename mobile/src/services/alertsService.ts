import { api } from "@/lib/api";
import type { Alert } from "@/types/events";

export async function fetchAlerts(): Promise<Alert[]> {
  const res = await api.get<Alert[]>("/api/alerts");
  return res.data;
}

export async function ackAlert(id: string): Promise<Alert> {
  const res = await api.post<Alert>(`/api/alerts/${id}/ack`);
  return res.data;
}

export async function resolveAlert(id: string): Promise<Alert> {
  const res = await api.post<Alert>(`/api/alerts/${id}/resolve`);
  return res.data;
}