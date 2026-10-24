"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";

export function useRealtimeTable<T>(
  table: string,
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/mc/${table}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        if (Array.isArray(result)) {
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [table]);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setData((prev) => [payload.new as T, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setData((prev) =>
              prev.map((item) =>
                (item as { id: string }).id === (payload.new as T as { id: string }).id
                  ? payload.new as T
                  : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setData((prev) =>
              prev.filter(
                (item) =>
                  (item as { id: string }).id !==
                  (payload.old as T as { id: string }).id
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table]);

  const mutate = useCallback(async (
    action: "create" | "update" | "delete",
    payload: Partial<T> & { id?: string }
  ) => {
    try {
      const response = await fetch(`/api/mc/${table}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "delete"
            ? { id: payload.id }
            : { ...payload, ...(action === "create" && { created_at: new Date().toISOString() }) }
        ),
      });
      if (!response.ok) throw new Error("Failed to mutate");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [table]);

  return { data, setData, loading, error, mutate };
}
