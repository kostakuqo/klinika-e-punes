"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type EditorStatus = "loading" | "ready" | "saving" | "saved" | "error";

/**
 * Loads a piece of content, tracks unsaved changes and saves it.
 * Warns before leaving the page with unsaved changes.
 */
export function useAdminEditor<T>(load: () => Promise<T>, save: (value: T) => Promise<void>) {
  const [value, setValueState] = useState<T | null>(null);
  const [status, setStatus] = useState<EditorStatus>("loading");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef
      .current()
      .then((v) => {
        setValueState(v);
        setStatus("ready");
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Të dhënat nuk u ngarkuan.");
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setValue = useCallback((update: T | ((prev: T) => T)) => {
    setValueState((prev) => (typeof update === "function" ? (update as (p: T) => T)(prev as T) : update));
    setDirty(true);
    setStatus((s) => (s === "saved" || s === "error" ? "ready" : s));
  }, []);

  const onSave = useCallback(async () => {
    if (value === null) return;
    setStatus("saving");
    setError("");
    try {
      await save(value);
      setDirty(false);
      setStatus("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ruajtja dështoi.");
      setStatus("error");
    }
  }, [save, value]);

  return { value, setValue, status, error, dirty, onSave };
}
