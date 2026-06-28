"use client";

import { useEffect, useMemo, useRef } from "react";
import type { TripRouteItemResponse } from "@/features/trip-route/types/trip-routes";
import type { SpotMapResponse } from "@/features/spot/types/spots";
import { SpotCategory } from "@/features/spot/types/spots";
import { useKakaoMapLoader } from "@/shared/hooks/useKakaoMapLoader";
import { renderToString } from "react-dom/server";
import { Coffee, Martini, Utensils } from "lucide-react";

type Props = {
  items: TripRouteItemResponse[];
  nearbySpots?: SpotMapResponse[];
  region: string;
};

const INITIAL_CENTER = { lat: 35.5, lng: 127.5 };
const INITIAL_LEVEL = 13;

export default function TripRouteMapKakao({
  items,
  nearbySpots,
  region,
}: Props) {
  const ready = useKakaoMapLoader();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  // route drawings
  const lineRef = useRef<KakaoPolyline | null>(null);
  const markerRef = useRef<KakaoCustomOverlay[]>([]);
  const popupsRef = useRef<KakaoCustomOverlay[]>([]);

  // nearby drawings
  const nearbyMarkerRef = useRef<KakaoCustomOverlay[]>([]);
  const nearbyPopupsRef = useRef<KakaoCustomOverlay[]>([]);

  const sorted = useMemo(() => {
    return [...items]
      .filter(
        (i) =>
          typeof i.lat === "number" &&
          Number.isFinite(i.lat) &&
          typeof i.lng === "number" &&
          Number.isFinite(i.lng),
      )
      .sort((a, b) => a.order - b.order);
  }, [items]);

  const points = useMemo(() => {
    return sorted.map((i) => ({ lat: i.lat as number, lng: i.lng as number }));
  }, [sorted]);

  const nearbyValid = useMemo(() => {
    return (nearbySpots ?? []).filter(
      (s) =>
        typeof s.lat === "number" &&
        Number.isFinite(s.lat) &&
        typeof s.lng === "number" &&
        Number.isFinite(s.lng),
    );
  }, [nearbySpots]);

  function cleanupRouteDrawings() {
    lineRef.current?.setMap(null);
    lineRef.current = null;

    markerRef.current.forEach((marker) => marker.setMap(null));
    markerRef.current = [];

    popupsRef.current.forEach((popup) => popup.setMap(null));
    popupsRef.current = [];
  }

  function cleanupNearbyDrawings() {
    nearbyMarkerRef.current.forEach((marker) => marker.setMap(null));
    nearbyMarkerRef.current = [];

    nearbyPopupsRef.current.forEach((popup) => popup.setMap(null));
    nearbyPopupsRef.current = [];
  }

  useEffect(() => {
    if (!ready) return;
    if (!containerRef.current) return;
    if (mapRef.current) return;
    if (!window.kakao?.maps) return;

    const { maps } = window.kakao;

    const map = new maps.Map(containerRef.current, {
      center: new maps.LatLng(INITIAL_CENTER.lat, INITIAL_CENTER.lng),
      level: INITIAL_LEVEL,
    });

    mapRef.current = map;
    const zoomControl = new maps.ZoomControl();
    map.addControl(zoomControl, maps.ControlPosition.RIGHT);

    // 지도 클릭하면 모든 팝업 닫기 (루트 + nearby)
    maps.event.addListener(map, "click", () => {
      popupsRef.current.forEach((p) => p.setMap(null));
      nearbyPopupsRef.current.forEach((p) => p.setMap(null));
    });

    return () => {
      cleanupRouteDrawings();
      cleanupNearbyDrawings();
      mapRef.current = null;
    };
  }, [ready]);

  // 루트(items) 변경 시 루트만 다시 그리기
  useEffect(() => {
    if (!ready) return;
    if (!window.kakao?.maps) return;
    const map = mapRef.current;
    if (!map) return;

    const { maps } = window.kakao;

    cleanupRouteDrawings();

    // 루트 포인트 없으면 기본 위치(단, nearby가 있으면 nearby 기준으로 맞춰주기)
    if (!points.length) {
      if (nearbyValid.length) {
        const bounds = new maps.LatLngBounds();
        nearbyValid.forEach((s) =>
          bounds.extend(new maps.LatLng(s.lat as number, s.lng as number)),
        );
        map.setBounds(bounds, 60, 60, 60, 60);
      } else {
        map.setLevel(INITIAL_LEVEL);
        map.setCenter(new maps.LatLng(INITIAL_CENTER.lat, INITIAL_CENTER.lng));
      }
      return;
    }

    // bounds는 기본적으로 루트 기준
    const latLngs = points.map((p) => new maps.LatLng(p.lat, p.lng));

    if (latLngs.length === 1) {
      map.setLevel(6);
      map.setCenter(latLngs[0]);
    } else {
      const bounds = new maps.LatLngBounds();
      latLngs.forEach((ll) => bounds.extend(ll));
      map.setBounds(bounds, 60, 60, 60, 60);
    }

    // polyline
    if (latLngs.length >= 2) {
      const polyline = new maps.Polyline({
        path: latLngs,
        strokeWeight: 4,
        strokeOpacity: 0.9,
        strokeStyle: "solid",
      });
      polyline.setMap(map);
      lineRef.current = polyline;
    }

    // route markers + popups
    sorted.forEach((item) => {
      const pos = new maps.LatLng(item.lat as number, item.lng as number);

      const markerContent = buildNumberBadgeHtml(item.order);
      const marker = new maps.CustomOverlay({
        position: pos,
        content: markerContent,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: 3,
        clickable: true,
      });
      marker.setMap(map);
      markerRef.current.push(marker);

      const popupContent = buildRoutePopupHtml(item, region);
      const popup = new maps.CustomOverlay({
        position: pos,
        content: popupContent,
        xAnchor: 0.5,
        yAnchor: 1.35,
        zIndex: 4,
        clickable: true,
      });
      popupsRef.current.push(popup);

      const clickable = markerContent.querySelector<HTMLButtonElement>(
        "[data-route-marker]",
      );
      if (clickable) {
        clickable.style.pointerEvents = "auto";
        clickable.addEventListener("click", () => {
          const isOpen = popup.getMap() != null;
          popupsRef.current.forEach((p) => p.setMap(null));
          nearbyPopupsRef.current.forEach((p) => p.setMap(null));
          popup.setMap(isOpen ? null : map);
        });
      }

      const closeBtn =
        popupContent.querySelector<HTMLButtonElement>("[data-popup-close]");
      closeBtn?.addEventListener("click", () => popup.setMap(null));
    });
  }, [ready, sorted, region]);

  // nearbySpots 변경 시 nearby 마커만 다시 그리기 (버튼 토글 대응)
  useEffect(() => {
    if (!ready) return;
    if (!window.kakao?.maps) return;
    const map = mapRef.current;
    if (!map) return;

    const { maps } = window.kakao;

    cleanupNearbyDrawings();

    if (!nearbyValid.length) return;

    nearbyValid.forEach((spot) => {
      const pos = new maps.LatLng(spot.lat as number, spot.lng as number);

      const markerContent = buildNearbyBadgeHtml(spot.category);
      const marker = new maps.CustomOverlay({
        position: pos,
        content: markerContent,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: 2,
        clickable: true,
      });
      marker.setMap(map);
      nearbyMarkerRef.current.push(marker);

      const popupContent = buildNearbyPopupHtml(spot, region);
      const popup = new maps.CustomOverlay({
        position: pos,
        content: popupContent,
        xAnchor: 0.5,
        yAnchor: 1.35,
        zIndex: 5,
        clickable: true,
      });
      nearbyPopupsRef.current.push(popup);

      const clickable = markerContent.querySelector<HTMLButtonElement>(
        "[data-nearby-marker]",
      );
      if (clickable) {
        clickable.style.pointerEvents = "auto";
        clickable.addEventListener("click", () => {
          const isOpen = popup.getMap() != null;
          popupsRef.current.forEach((p) => p.setMap(null));
          nearbyPopupsRef.current.forEach((p) => p.setMap(null));
          popup.setMap(isOpen ? null : map);
        });
      }

      const closeBtn =
        popupContent.querySelector<HTMLButtonElement>("[data-popup-close]");
      closeBtn?.addEventListener("click", () => popup.setMap(null));
    });
  }, [ready, nearbyValid, region]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="h-80 sm:h-95 md:h-105">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      <div className="px-4 py-3 text-xs text-neutral-600">
        {sorted.length
          ? `총 ${sorted.length}개 스팟을 순서대로 연결했어요.`
          : nearbyValid.length
            ? `근처 추천 스팟을 지도에 표시했어요.`
            : "표시할 위치 데이터가 없어요."}
      </div>
    </div>
  );
}

function buildNumberBadgeHtml(n: number) {
  const root = document.createElement("div");
  root.style.pointerEvents = "auto";
  root.style.transform = "translateZ(0)";

  root.innerHTML = `
    <button type="button" data-route-marker style="
      all:unset;
      pointer-events:auto;
      width:32px;height:32px;border-radius:9999px;
      background:#111;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:700;
      box-shadow:0 8px 20px rgba(0,0,0,.15);
      border:2px solid #fff;
      cursor:pointer;
      user-select:none;
    ">${n}</button>
  `;
  return root;
}

function getIconString(Icon: typeof Coffee | typeof Martini | typeof Utensils) {
  return renderToString(<Icon size={14} strokeWidth={2.5} />);
} 

function buildNearbyBadgeHtml(category: SpotCategory) {
  const root = document.createElement("div");
  root.style.pointerEvents = "auto";
  root.style.transform = "translateZ(0)";

  let iconHtml = "";
  let iconColor = "#111";
  const bgColor = "#fff";

 if (category === SpotCategory.FOOD) {
    iconHtml = getIconString(Utensils);
    iconColor = "#f97316";
  } else if (category === SpotCategory.CAFE) {
    iconHtml = getIconString(Coffee);
    iconColor = "#8b4513";
  } else if (category === SpotCategory.DRINK) {
    iconHtml = getIconString(Martini);
    iconColor = "#8b5cf6";
  }

  root.innerHTML = `
    <button type="button" data-nearby-marker style="
      all:unset;
      pointer-events:auto;
      width:28px;height:28px;border-radius:9999px;
      background:${bgColor};color:${iconColor};
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 10px 22px rgba(0,0,0,0.12);
      border:2px solid rgba(0,0,0,0.05);
      cursor:pointer;
      user-select:none;
      transition: all 0.2s ease;
    ">${iconHtml}</button>
  `;
  return root;
}

function buildRoutePopupHtml(item: TripRouteItemResponse, region: string) {
  const root = document.createElement("div");
  root.className = "w-64 pointer-events-auto";

  const detailUrl = item.spot?.id ? `/spots/${region}/${item.spot.id}` : null;

  root.innerHTML = `
    <div class="space-y-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm font-bold text-neutral-900">
            ${item.order}. ${escapeHtml(item.title)}
          </div>
          <div class="mt-1 flex items-center gap-1 text-[11px] text-neutral-500">
            <span class="truncate">${escapeHtml(item.address ?? "주소 정보 없음")}</span>
          </div>
        </div>
        <button type="button" data-popup-close class="shrink-0 p-1 text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      ${
        item.description
          ? `
        <p class="line-clamp-2 text-xs leading-relaxed text-neutral-600 break-words whitespace-normal" 
           style="display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">
          ${escapeHtml(item.description)}
        </p>
      `
          : ""
      }

      <div class="h-px w-full bg-neutral-100"></div>

      ${
        detailUrl
          ? `
        <a href="${detailUrl}" class="block w-full rounded-xl bg-neutral-900 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-neutral-800">
          장소 상세보기
        </a>
      `
          : `
        <div class="py-1 text-center text-[10px] text-neutral-400 font-medium italic">
          등록된 상세 정보가 없습니다
        </div>
      `
      }
    </div>
  `;
  return root;
}

function buildNearbyPopupHtml(spot: SpotMapResponse, region: string) {
  const root = document.createElement("div");
  root.className = "w-64 pointer-events-auto whitespace-normal";

  const catLabel =
    spot.category === SpotCategory.FOOD
      ? "혼밥"
      : spot.category === SpotCategory.CAFE
        ? "카페"
        : "혼술";

  let iconHtml = "";
  let badgeColor = "text-neutral-500 bg-neutral-50";

  if (spot.category === SpotCategory.FOOD) {
    iconHtml = getIconString(Utensils);
    badgeColor = "text-orange-600 bg-orange-50";
  } else if (spot.category === SpotCategory.CAFE) {
    iconHtml = getIconString(Coffee);
    badgeColor = "text-amber-700 bg-amber-50";
  } else if (spot.category === SpotCategory.DRINK) {
    iconHtml = getIconString(Martini);
    badgeColor = "text-violet-600 bg-violet-50";
  }

  root.innerHTML = `
    <div class="space-y-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <div class="mb-1.5">
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${badgeColor}">
              ${catLabel}
            </span>
          </div>
          <div class="truncate text-sm font-bold text-neutral-900">
            ${escapeHtml(spot.name)}
          </div>
        </div>
        <button type="button" data-popup-close class="shrink-0 p-1 text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <p class="line-clamp-2 text-xs leading-relaxed text-neutral-600 break-words whitespace-normal"
         style="display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">
        ${escapeHtml(spot.summary ?? "추천 혼여 스팟입니다.")}
      </p>

      <div class="h-px w-full bg-neutral-100"></div>

      <a href="/spots/${region}/${spot.id}" 
         class="flex items-center justify-center gap-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-center text-xs font-bold text-neutral-900 transition-colors hover:bg-neutral-50 active:bg-neutral-100">
         <span class="flex items-center justify-center">${iconHtml}</span>
         <span>스팟 상세보기</span>
      </a>
    </div>
  `;
  return root;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
