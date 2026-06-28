import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function timeAgoOrDate(createdAt: string) {
  const d = new Date(createdAt);
  const diffMs = Date.now() - d.getTime();

  const oneMinute = 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;


  if (diffMs < oneMinute) {
    return "방금 전";
  }

  if (diffMs < oneDay) {
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  }

  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}