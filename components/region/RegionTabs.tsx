"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "../common/Button";

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
          <Button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            variant="tab"
            size="sm"
            role="tab"
            aria-selected={active === tab.value}
            className={cn(
              active === tab.value && "border-neutral-900 text-neutral-900",
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div>
        {tabs.map((tab) =>
          tab.value === active ? (
            <div key={tab.value}>{tab.content}</div>
          ) : null,
        )}
      </div>
    </div>
  );
}
