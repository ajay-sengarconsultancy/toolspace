"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

const STORAGE_KEY = "toolspace-owned-requests-v1";
const VOTER_KEY_STORAGE = "toolspace-voter-key-v1";
const RequestsContext = createContext(null);

export function RequestsProvider({ children }) {
  const [voterKey, setVoterKey] = useState("");

  useEffect(() => {
    let active = true;
    let currentVoterKey = "";
    try {
      currentVoterKey = window.localStorage.getItem(VOTER_KEY_STORAGE) || "";
      if (!currentVoterKey) {
        currentVoterKey = window.crypto?.randomUUID?.()
          ?? Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
        window.localStorage.setItem(VOTER_KEY_STORAGE, currentVoterKey);
      }
    } catch {
      currentVoterKey = window.crypto?.randomUUID?.() ?? `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    Promise.resolve().then(() => {
      if (!active) return;
      setVoterKey(currentVoterKey);
      });

    return () => { active = false; };
  }, []);

  const addRequest = useCallback(async (values) => {
    const { data } = await apiRequest("/requests", { method: "POST", body: values });
    try {
      const savedIds = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      const currentIds = Array.isArray(savedIds) ? savedIds.filter((id) => typeof id === "string") : [];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([data.id, ...currentIds.filter((id) => id !== data.id)]));
    } catch { /* The request is still created and the details page remains available in this session. */ }
    return data;
  }, []);

  return (
    <RequestsContext.Provider value={{ addRequest, voterKey }}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (!context) throw new Error("useRequests must be used inside RequestsProvider.");
  return context;
}
