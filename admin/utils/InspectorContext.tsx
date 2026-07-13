"use client";

import React, { createContext, useContext, useState } from "react";

export interface InspectedObject {
  type: string; // 'contest' | 'question' | 'participant' | 'finance' | 'agent' | 'system'
  title: string;
  subtitle?: string;
  metadata?: Record<string, any>;
  timeline?: Array<{ label: string; date: string; status?: string }>;
  raw?: any;
}

interface InspectorContextType {
  inspected: InspectedObject | null;
  inspect: (obj: InspectedObject | null) => void;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [inspected, setInspected] = useState<InspectedObject | null>(null);

  const inspect = (obj: InspectedObject | null) => {
    setInspected(obj);
  };

  return (
    <InspectorContext.Provider value={{ inspected, inspect }}>
      {children}
    </InspectorContext.Provider>
  );
}

export function useInspector() {
  const context = useContext(InspectorContext);
  return context || { inspected: null, inspect: () => {} };
}
