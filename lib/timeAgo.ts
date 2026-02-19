import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function timeAgoOrDate(createdAt: string) {
  const d = new Date(createdAt);
  const diffMs = Date.now() - d.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  // ✅ 하루 이내면 "몇 시간 전/몇 분 전"
  if (diffMs < oneDay) {
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  }

  // ✅ 하루 지나면 날짜(한국형)
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
