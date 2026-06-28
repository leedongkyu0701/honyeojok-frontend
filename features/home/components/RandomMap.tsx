"use client";

import { useEffect, useRef } from "react";
import type { DestinationMapResponse } from "@/features/destination/types/destinations";
import { useKakaoMapLoader } from "@/shared/hooks/useKakaoMapLoader";

type Props = {
  destination: DestinationMapResponse | null;
};

const INITIAL_CENTER = { lat: 36.5, lng: 127.5 };
const INITIAL_LEVEL = 13;
const FOCUS_LEVEL = 8;

export default function DestinationMapKakao({ destination }: Props) {
  const ready = useKakaoMapLoader();

  const containerRef = useRef<HTMLDivElement | null>(null); // dom ref
  const mapRef = useRef<KakaoMap | null>(null); // 지도 객체 ref

  const markerRef = useRef<KakaoMarker | null>(null);
  const popupRef = useRef<KakaoCustomOverlay | null>(null);
  const hasFocusedRef = useRef(false); // 특정 여행지로 지도 위치를 이동했는지

  const popupContentRef = useRef<HTMLDivElement | null>(null);


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

    map.setMinLevel?.(6);
    map.setMaxLevel?.(13);

    mapRef.current = map;

    return () => {
      markerRef.current?.setMap(null);
      popupRef.current?.setMap(null);
      markerRef.current = null;
      popupRef.current = null;
      mapRef.current = null;
    };
  }, [ready]);

  // destination 변경 시 마커/팝업 갱신 + 지도 위치 이동
  useEffect(() => {
    if (!ready) return;
    if (!window.kakao?.maps) return;

    const map = mapRef.current;
    if (!map) return;

    const { maps } = window.kakao;

    if (!destination) {
      markerRef.current?.setMap(null);
      popupRef.current?.setMap(null);
      markerRef.current = null;
      popupRef.current = null;
      hasFocusedRef.current = false;
      map.setCenter(new maps.LatLng(INITIAL_CENTER.lat, INITIAL_CENTER.lng));
      map.setLevel(INITIAL_LEVEL);
      return;
    }

    const pos = new maps.LatLng(destination.latitude, destination.longitude);

    if (!hasFocusedRef.current) {
      map.setLevel(FOCUS_LEVEL);
      map.setCenter(pos);
      hasFocusedRef.current = true;
    } else {
      map.panTo(pos);
    }

    if (!markerRef.current) {
      const marker = new maps.Marker({ position: pos });
      marker.setMap(map);
      markerRef.current = marker;

      maps.event.addListener(marker, "click", () => {
        const popup = popupRef.current;
        if (!popup) return;
        popup.setMap(popup.getMap() ? null : map);
      });
    } else {
      markerRef.current.setPosition(pos);
      markerRef.current.setMap(map);
    }

    if (!popupContentRef.current) {
      popupContentRef.current = document.createElement("div");
      popupContentRef.current.className = "w-64";
    }
    popupContentRef.current.innerHTML = popupHtml(destination); // 매번 새로 생성하지 않고 내용만 업데이트

    if (!popupRef.current) {
      const popup = new maps.CustomOverlay({
        position: pos,
        content: popupContentRef.current,
        yAnchor: 1.2,
        xAnchor: 0.5,
        clickable: true,
      });

      popup.setMap(map);
      popupRef.current = popup;

      maps.event.addListener(map, "click", () => {
        popupRef.current?.setMap(null);
      });
    } else {
      popupRef.current.setPosition(pos);
      popupRef.current.setContent(popupContentRef.current);
      popupRef.current.setMap(map);
    }
  }, [ready, destination]);

  return (
    <div className="relative w-full h-[60vh]">
      <div ref={containerRef} className="h-full w-full" /> {/* 지도가 그려질 컨테이너 여기서 먼저 dom 생성*/}

      {!destination ? (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
          <div className="rounded-full bg-white/80 px-3 py-1 text-xs text-neutral-700 shadow ring-1 ring-black/5 backdrop-blur">
            버튼을 눌러 랜덤 여행지를 뽑아보세요!
          </div>
        </div>
      ) : null}
    </div>
  );
}

function popupHtml(destination: DestinationMapResponse) {
  return `
    <div class="space-y-3 rounded-2xl bg-white p-3 shadow ring-1 ring-black/5">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold text-neutral-900">${escapeHtml(destination.name)}</div>
          <div class="mt-1 flex items-center gap-1 text-xs text-neutral-600">
            <span aria-hidden>⭐</span>
            <span>${Number(destination.score).toFixed(1)}</span>
          </div>
        </div>
        <span class="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
          지역
        </span>
      </div>

      <p class="line-clamp-2 text-xs text-neutral-600">${escapeHtml(destination.summary ?? "")}</p>

      <div class="h-px w-full bg-neutral-200"></div>

      <a
        href="/destinations/${encodeURIComponent(destination.slug)}"
        class="block w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-50"
      >
        여행지 상세보기
      </a>
    </div>
  `;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
