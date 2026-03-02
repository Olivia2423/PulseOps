import { api } from "@/lib/api";
import type { AuditLog } from "@/types/events";

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const res = await api.get<AuditLog[]>("/api/audit");
  return res.data;
}