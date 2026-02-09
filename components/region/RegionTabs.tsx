"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  label: string;
  value: string;
  content: React.ReactNode;
};

export default function DestinationTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.value);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={cn(
              "pb-3 text-sm font-medium text-neutral-500 transition",
              active === tab.value &&
                "border-b-2 border-neutral-900 text-neutral-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.map((tab) =>
          tab.value === active ? (
            <div key={tab.value}>{tab.content}</div>
          ) : null
        )}
      </div>
    </div>
  );
}
