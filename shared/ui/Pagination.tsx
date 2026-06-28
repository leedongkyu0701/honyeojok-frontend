import Button from "./Button";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        size="sm"
        aria-label="이전 페이지"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
      >
        이전
      </Button >
      <div className="text-sm text-neutral-600">
        {page} / {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        aria-label="다음 페이지"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
      >
        다음
      </Button>
    </div>
  );
}
