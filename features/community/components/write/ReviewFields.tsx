"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { WritePostFormValues } from "@/features/community/schemas/post-form.schema";
import StarRating from "@/shared/ui/StarRating";
import RegionCombobox from "./RegionCombobox";

export default function ReviewFields() {
  const {
    control,
    register,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext<WritePostFormValues>();
  const skipRegion = useWatch({ control, name: "skipRegion" });
  const regionSlug = useWatch({ control, name: "regionSlug" });
  const skipRegionField = register("skipRegion");

  return (
    <div className="space-y-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <RegionCombobox
        key={skipRegion ? "skip-region" : "select-region"}
        disabled={skipRegion}
      />

      <div className="ml-2 flex items-center gap-2">
        <input
          id="skip-region"
          type="checkbox"
          {...skipRegionField}
          onChange={(event) => {
            skipRegionField.onChange(event);
            if (event.target.checked) {
              setValue("regionSlug", "");
              clearErrors("regionSlug");
            }
          }}
          className="h-4 w-4 accent-neutral-900"
        />
        <label htmlFor="skip-region" className="text-sm text-neutral-700">
          지역 선택 안 함
        </label>
      </div>

      <p className="text-xs text-neutral-500">
        {regionSlug
          ? `선택됨: ${regionSlug}`
          : "아직 지역이 없다면 제목에 지역을 포함후 지역 선택 안 함 체크박스를 클릭해주세요."}
      </p>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-900">평점</label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating
              value={field.value}
              onChange={(rating) => {
                field.onChange(rating);
                void trigger("rating");
              }}
            />
          )}
        />
        {errors.rating ? (
          <p className="text-xs text-red-600">{errors.rating.message}</p>
        ) : null}
        <p className="text-xs text-neutral-500">
          별을 클릭해서 1~5점으로 평가해주세요.
        </p>
      </div>
    </div>
  );
}
