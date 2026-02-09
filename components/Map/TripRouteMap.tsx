"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { TripRouteItemEntity } from "@/types/trip-routes";

function makeNumberIcon(n: number) {
  return L.divIcon({
    className: "route-marker",
    html: `
      <div style="
        width:28px;height:28px;border-radius:9999px;
        background:#111;color:#fff;
        display:flex;align-items:center;justify-content:center;
        font-size:12px;font-weight:700;
        box-shadow:0 8px 20px rgba(0,0,0,.15);
        border:2px solid #fff;
      ">${n}</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24],
  });
}

function FitToPoints({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    if (points.length === 1) {
      map.setView(points[0], 13, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

type Props = {
  items: TripRouteItemEntity[];
};

export default function TripRouteMap({ items }: Props) {
  // lat/lng 있는 것만 + order 순 정렬
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

  const points = useMemo<[number, number][]>(() => {
    return sorted.map((i) => [i.lat as number, i.lng as number]);
  }, [sorted]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="h-80 sm:h-95 md:h-105">
        <MapContainer
          center={[35.5, 127.5]}
          zoom={7}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <FitToPoints points={points} />

          {/* 라인 (order 순) */}
          {points.length >= 2 ? (
            <Polyline positions={points} pathOptions={{ weight: 4 }} />
          ) : null}

          {/* 마커 */}
          {sorted.map((item) => (
            <Marker
              key={item.id}
              position={[item.lat as number, item.lng as number]}
              icon={makeNumberIcon(item.order)}
            >
              <Popup>
                <div className="w-56">
                  <div className="text-sm font-semibold">
                    {item.order}. {item.title}
                  </div>
                  {item.address ? (
                    <div className="mt-1 text-xs text-neutral-600">
                      {item.address}
                    </div>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="px-4 py-3 text-xs text-neutral-600">
        {sorted.length
          ? `총 ${sorted.length}개 스팟을 순서대로 연결했어요.`
          : "표시할 위치 데이터가 없어요."}
      </div>
    </div>
  );
}
