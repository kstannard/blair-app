"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface UseAutoSaveOptions {
  taskSlug: string;
  savedData: Record<string, unknown>;
  enabled?: boolean;
}

export function useAutoSave({
  taskSlug,
  savedData,
  enabled = true,
}: UseAutoSaveOptions) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>(JSON.stringify(savedData));
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const save = useCallback(
    async (data?: Record<string, unknown>) => {
      const dataToSave = data ?? savedData;
      const serialized = JSON.stringify(dataToSave);

      if (serialized === lastSavedRef.current) {
        setSaveStatus("saved");
        return;
      }

      setSaveStatus("saving");

      try {
        const res = await fetch(`/api/playbook/${taskSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ savedData: dataToSave }),
        });

        if (!res.ok) throw new Error("Save failed");

        lastSavedRef.current = serialized;
        if (isMountedRef.current) {
          setSaveStatus("saved");
        }
      } catch {
        if (isMountedRef.current) {
          setSaveStatus("error");
        }
      }
    },
    [taskSlug, savedData]
  );

  // Debounced auto-save
  useEffect(() => {
    if (!enabled) return;

    const serialized = JSON.stringify(savedData);
    if (serialized === lastSavedRef.current) return;

    setSaveStatus("unsaved");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      save(savedData);
    }, 1500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [savedData, save, enabled]);

  return { saveStatus, save };
}
