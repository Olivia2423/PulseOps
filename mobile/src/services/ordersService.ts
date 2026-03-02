import { api } from "@/lib/api";
import type { Order } from "@/types/events";

export async function fetchOrders(): Promise<Order[]> {
  const res = await api.get<Order[]>("/api/orders");
  return res.data;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const res = await api.get<Order>(`/api/orders/${id}`);
  return res.data;
}

export async function retryOrder(id: string): Promise<Order> {
  const res = await api.post<Order>(`/api/orders/${id}/retry`);
  return res.data;
}