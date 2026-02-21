"use client";

import { useEffect, useRef } from "react";
import type { DestinationMapResponse } from "@/types/destinations";
import { useKakaoMapLoader } from "@/lib/useKakaoMapLoader";

type Props = {
  destination: DestinationMapResponse | null;
};

const INITIAL_CENTER = { lat: 36.5, lng: 127.5 };
const INITIAL_LEVEL = 12;
const FOCUS_LEVEL = 7;

export default function DestinationMapKakao({ destination }: Props) {
  const ready = useKakaoMapLoader();

  const containerRef = useRef<HTMLDivElement | null>(null); // dom ref

  const mapRef = useRef<KakaoMap | null>(null); // 지도 객체 ref
  const markerRef = useRef<KakaoMarker | null>(null);
  const overlayRef = useRef<KakaoCustomOverlay | null>(null);
  const hasFocusedRef = useRef(false);

  // 오버레이 DOM은 1번만 만들어 재사용
  const overlayContentRef = useRef<HTMLDivElement | null>(null);

  // 1) 지도 최초 1회 생성
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

    // 언마운트 시 정리(지도/마커/오버레이 제거)
    return () => {
      markerRef.current?.setMap(null);
      overlayRef.current?.setMap(null);
      markerRef.current = null;
      overlayRef.current = null;
      mapRef.current = null;
    };
  }, [ready]);

  // 2) destination 변경 시: 이동 + 마커/오버레이 업데이트
  useEffect(() => {

    
    if (!ready) return;
    if (!window.kakao?.maps) return;

    const map = mapRef.current;
    if (!map) return;

    const { maps } = window.kakao;

    // destination 없음: 마커/오버레이 제거 + 초기 위치
    if (!destination) {
      markerRef.current?.setMap(null);
      overlayRef.current?.setMap(null);
      markerRef.current = null;
      overlayRef.current = null;
      map.setCenter(new maps.LatLng(INITIAL_CENTER.lat, INITIAL_CENTER.lng));
      map.setLevel(INITIAL_LEVEL);
      return;
    }

    const pos = new maps.LatLng(destination.latitude, destination.longitude);
    

    if (!hasFocusedRef.current) {
      map.setLevel(FOCUS_LEVEL);
      map.setCenter(pos);
      hasFocusedRef.current = true;
    }else{
      map.panTo(pos);
    }

    // 2-1) 마커
    if (!markerRef.current) {
      const marker = new maps.Marker({ position: pos });
      marker.setMap(map);
      markerRef.current = marker;

      maps.event.addListener(marker, "click", () => {
        const overlay = overlayRef.current;
        if (!overlay) return;
        overlay.setMap(overlay.getMap() ? null : map);
      });
    } else {
      markerRef.current.setPosition(pos);
      markerRef.current.setMap(map);
    }

    // 2-2) 오버레이 content 준비 (1회 생성 + 내용만 갱신)
    if (!overlayContentRef.current) {
      overlayContentRef.current = document.createElement("div");
      overlayContentRef.current.className = "w-64";
    }
    overlayContentRef.current.innerHTML = overlayHtml(destination);

    // 2-3) 오버레이
    if (!overlayRef.current) {
      const overlay = new maps.CustomOverlay({
        position: pos,
        content: overlayContentRef.current,
        yAnchor: 1.35,
        xAnchor: 0.5,
        clickable: true,
      });

      overlay.setMap(map);
      overlayRef.current = overlay;

      maps.event.addListener(map, "click", () => {
        overlayRef.current?.setMap(null);
      });
    } else {
      overlayRef.current.setPosition(pos);
      overlayRef.current.setContent(overlayContentRef.current);
      overlayRef.current.setMap(map);
    }

  }, [ready, destination]);

  return (
    <div className="relative w-full h-[60vh]">
      <div ref={containerRef} className="h-full w-full" />

      {!destination ? (
        <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
          <div className="rounded-full bg-white/80 px-3 py-1 text-xs text-neutral-700 shadow ring-1 ring-black/5 backdrop-blur">
            버튼을 눌러 랜덤 여행지를 뽑아보세요 👆
          </div>
        </div>
      ) : null}
    </div>
  );
}

function overlayHtml(destination: DestinationMapResponse) {
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
          랜덤 픽
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
