"use client";

import { useEffect, useState } from "react";
import Button from "@/shared/ui/Button";

type PostSearchFormProps = {
  query: string;
  isPending: boolean;
  onSearch: (query: string) => void;
};

export default function PostSearchForm({
  query,
  isPending,
  onSearch,
}: PostSearchFormProps) {
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(draft);
      }}
      className="flex flex-wrap gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
    >
      <div className="flex flex-1 items-center gap-2">
        <input
          value={draft}
          aria-label="검색어"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="검색어 입력"
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          type="submit"
          className="whitespace-nowrap px-4"
          disabled={isPending}
        >
          {isPending ? "검색 중..." : "검색"}
        </Button>
      </div>
    </form>
  );
}
