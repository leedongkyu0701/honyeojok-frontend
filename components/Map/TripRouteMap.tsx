"use client";

import { useEffect, useMemo, useRef } from "react";
import type { TripRouteItemResponse } from "@/types/trip-routes";
import type { SpotMapResponse } from "@/types/spots";
import { SpotCategory } from "@/types/spots";
import { useKakaoMapLoader } from "@/lib/useKakaoMapLoader";

type Props = {
  items: TripRouteItemResponse[];
  nearbySpots?: SpotMapResponse[];
};

const INITIAL_CENTER = { lat: 35.5, lng: 127.5 };
const INITIAL_LEVEL = 12;

export default function TripRouteMapKakao({ items, nearbySpots }: Props) {
  const ready = useKakaoMapLoader();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  // route drawings
  const lineRef = useRef<KakaoPolyline | null>(null);
  const markerOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const popupsRef = useRef<KakaoCustomOverlay[]>([]);

  // nearby drawings
  const nearbyMarkerOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
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

  // 지도 1회 생성 + map click 1회 등록
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

    // ✅ 지도 클릭하면 모든 팝업 닫기 (루트 + nearby)
    maps.event.addListener(map, "click", () => {
      popupsRef.current.forEach((p) => p.setMap(null));
      nearbyPopupsRef.current.forEach((p) => p.setMap(null));
    });

    return () => {
      cleanupRouteDrawings();
      cleanupNearbyDrawings();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // ✅ 루트(items) 변경 시 루트만 다시 그리기
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

    // ✅ bounds는 기본적으로 루트 기준
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
      const markerOverlay = new maps.CustomOverlay({
        position: pos,
        content: markerContent,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: 3,
      });
      markerOverlay.setMap(map);
      markerOverlaysRef.current.push(markerOverlay);

      const popupContent = buildRoutePopupHtml(item);
      const popup = new maps.CustomOverlay({
        position: pos,
        content: popupContent,
        xAnchor: 0.5,
        yAnchor: 1.35,
        zIndex: 4,
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
  }, [ready, points, sorted]);

  // ✅ nearbySpots 변경 시 nearby 마커만 다시 그리기 (버튼 토글 대응)
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
      const markerOverlay = new maps.CustomOverlay({
        position: pos,
        content: markerContent,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: 2, // 루트보다 아래
      });
      markerOverlay.setMap(map);
      nearbyMarkerOverlaysRef.current.push(markerOverlay);

      const popupContent = buildNearbyPopupHtml(spot);
      const popup = new maps.CustomOverlay({
        position: pos,
        content: popupContent,
        xAnchor: 0.5,
        yAnchor: 1.35,
        zIndex: 5, // 팝업은 위로
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
  }, [ready, nearbyValid]);

  function cleanupRouteDrawings() {
    lineRef.current?.setMap(null);
    lineRef.current = null;

    markerOverlaysRef.current.forEach((o) => o.setMap(null));
    markerOverlaysRef.current = [];

    popupsRef.current.forEach((p) => p.setMap(null));
    popupsRef.current = [];
  }

  function cleanupNearbyDrawings() {
    nearbyMarkerOverlaysRef.current.forEach((o) => o.setMap(null));
    nearbyMarkerOverlaysRef.current = [];

    nearbyPopupsRef.current.forEach((p) => p.setMap(null));
    nearbyPopupsRef.current = [];
  }

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
      width:28px;height:28px;border-radius:9999px;
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

function buildNearbyBadgeHtml(category: SpotCategory) {
  const root = document.createElement("div");
  root.style.pointerEvents = "auto";
  root.style.transform = "translateZ(0)";

  const label =
    category === SpotCategory.FOOD
      ? "🍽"
      : category === SpotCategory.CAFE
        ? "☕"
        : "🍺";

  // 루트 마커보다 살짝 작게 + 테두리로 구분
  root.innerHTML = `
    <button type="button" data-nearby-marker style="
      all:unset;
      pointer-events:auto;
      width:26px;height:26px;border-radius:9999px;
      background:#fff;color:#111;
      display:flex;align-items:center;justify-content:center;
      font-size:13px;font-weight:800;
      box-shadow:0 10px 22px rgba(0,0,0,.12);
      border:2px solid rgba(0,0,0,.18);
      cursor:pointer;
      user-select:none;
    ">${label}</button>
  `;
  return root;
}

function buildRoutePopupHtml(item: TripRouteItemResponse) {
  const el = document.createElement("div");
  el.innerHTML = `
    <div style="
      pointer-events:auto;
      width:224px;
      background:#fff;
      border-radius:16px;
      padding:10px 12px;
      box-shadow:0 12px 30px rgba(0,0,0,.18);
      border:1px solid rgba(0,0,0,.08);
    ">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:8px;">
        <div style="min-width:0;">
          <div style="font-size:13px; font-weight:700; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(`${item.order}. ${item.title}`)}
          </div>
          ${
            item.address
              ? `<div style="margin-top:4px; font-size:12px; color:#666; line-height:1.3;">
                   ${escapeHtml(item.address)}
                 </div>`
              : ""
          }
        </div>
        <button data-popup-close style="
          border:0; background:transparent; cursor:pointer;
          font-size:14px; line-height:1; padding:2px 4px; color:#666;
        ">✕</button>
      </div>
    </div>
  `;
  return el;
}

function buildNearbyPopupHtml(spot: SpotMapResponse) {
  const el = document.createElement("div");

  const catLabel =
    spot.category === SpotCategory.FOOD
      ? "혼밥"
      : spot.category === SpotCategory.CAFE
        ? "카페"
        : "혼술";

  el.innerHTML = `
    <div style="
      pointer-events:auto;
      width:224px;
      background:#fff;
      border-radius:16px;
      padding:10px 12px;
      box-shadow:0 12px 30px rgba(0,0,0,.18);
      border:1px solid rgba(0,0,0,.08);
    ">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:8px;">
        <div style="min-width:0;">
          <div style="font-size:12px; font-weight:700; color:#666;">
            ${escapeHtml(catLabel)}
          </div>
          <div style="margin-top:2px; font-size:13px; font-weight:800; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(spot.name)}
          </div>
          ${
            spot.summary
              ? `<div style="margin-top:4px; font-size:12px; color:#666; line-height:1.3;">
                   ${escapeHtml(spot.summary)}
                 </div>`
              : ""
          }
        </div>
        <button data-popup-close style="
          border:0; background:transparent; cursor:pointer;
          font-size:14px; line-height:1; padding:2px 4px; color:#666;
        ">✕</button>
      </div>
    </div>
  `;
  return el;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
