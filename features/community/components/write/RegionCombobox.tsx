"use client";

import { useEffect, useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { searchDestinations } from "@/features/destination/api/destination.api";
import type { WritePostFormValues } from "@/features/community/schemas/post-form.schema";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

export default function RegionCombobox({ disabled }: { disabled: boolean }) {
  const { setValue, clearErrors, formState: { errors } } =
    useFormContext<WritePostFormValues>();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const debouncedQuery = useDebouncedValue(query, 400);
  const regionsQuery = useQuery({
    queryKey: ["destinations", "search", debouncedQuery],
    queryFn: () => searchDestinations(debouncedQuery),
    enabled: isOpen && !disabled && debouncedQuery.trim().length >= 1,
  });
  const suggestions = regionsQuery.data ?? [];
  const canShowSuggestions = isOpen && query.trim().length >= 1 && !disabled;

  const selectRegion = (index: number) => {
    const region = suggestions[index];
    if (!region) return;

    setValue("regionSlug", region.slug, { shouldDirty: true, shouldValidate: true });
    clearErrors("regionSlug");
    setQuery(region.name);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="relative space-y-2">
      <label className="block text-sm font-semibold text-neutral-900">지역 검색</label>
      <input
        type="text"
        disabled={disabled}
        value={query}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={canShowSuggestions}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          setValue("regionSlug", "", { shouldDirty: true });
          clearErrors("regionSlug");
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => !disabled && setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 150);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
            setActiveIndex(-1);
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1));
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((current) => Math.max(current - 1, 0));
            return;
          }

          if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            selectRegion(activeIndex);
          }
        }}
        placeholder="예) 묵호, 서울, 강릉..."
        className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
      />

      {errors.regionSlug ? (
        <p className="text-xs text-red-600">{errors.regionSlug.message}</p>
      ) : null}

      {canShowSuggestions ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg"
        >
          {regionsQuery.isLoading ? (
            <div className="p-3 text-sm text-neutral-500">검색 중...</div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-64 overflow-auto">
              {suggestions.map((region, index) => (
                <li key={region.id}>
                  <button
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-50 aria-selected:bg-neutral-100"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectRegion(index);
                    }}
                  >
                    <span className="font-medium text-neutral-900">{region.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-neutral-500">검색 결과가 없어요.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
