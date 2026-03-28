"use client";

import { useState, useEffect, useCallback } from "react";
import { useAutoSave } from "./useAutoSave";

interface Task {
  id: string;
  slug: string;
  title: string;
  description: string;
  whyItMatters: string;
  order: number;
  taskType: string;
  timeEstimate: string | null;
  phaseId: string;
  totalTasksInPhase?: number;
}

interface Progress {
  id: string;
  status: "not_started" | "in_progress" | "done";
  savedData: Record<string, unknown>;
  startedAt: string | null;
  completedAt: string | null;
}

interface TaskProgressData {
  task: Task;
  progress: Progress;
  previousTask: { slug: string; title: string } | null;
  nextTask: { slug: string; title: string } | null;
  incompletePreviousTask: { slug: string; title: string } | null;
}

export function useTaskProgress(taskSlug: string) {
  const [data, setData] = useState<TaskProgressData | null>(null);
  const [savedData, setSavedData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { saveStatus, save } = useAutoSave({
    taskSlug,
    savedData,
    enabled: !!data,
  });

  // Fetch task + progress
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/playbook/${taskSlug}`);
        if (!res.ok) throw new Error("Failed to load task");
        const json = await res.json();
        setData(json);
        setSavedData(json.progress.savedData || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load task");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [taskSlug]);

  const updateField = useCallback(
    (field: string, value: unknown) => {
      setSavedData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateFields = useCallback(
    (fields: Record<string, unknown>) => {
      setSavedData(fields);
    },
    []
  );

  const markComplete = useCallback(async () => {
    try {
      const res = await fetch(`/api/playbook/${taskSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "done",
          savedData,
        }),
      });

      if (!res.ok) throw new Error("Failed to mark complete");

      const updated = await res.json();
      setData((prev) =>
        prev ? { ...prev, progress: { ...prev.progress, ...updated.progress } } : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark complete");
    }
  }, [taskSlug, savedData]);

  const undoComplete = useCallback(async () => {
    try {
      const res = await fetch(`/api/playbook/${taskSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "in_progress",
          savedData,
        }),
      });

      if (!res.ok) throw new Error("Failed to undo completion");

      const updated = await res.json();
      setData((prev) =>
        prev ? { ...prev, progress: { ...prev.progress, ...updated.progress } } : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to undo completion");
    }
  }, [taskSlug, savedData]);

  return {
    task: data?.task ?? null,
    progress: data?.progress ?? null,
    previousTask: data?.previousTask ?? null,
    nextTask: data?.nextTask ?? null,
    incompletePreviousTask: data?.incompletePreviousTask ?? null,
    savedData,
    updateField,
    updateFields,
    saveStatus,
    save,
    markComplete,
    undoComplete,
    isLoading,
    error,
  };
}
