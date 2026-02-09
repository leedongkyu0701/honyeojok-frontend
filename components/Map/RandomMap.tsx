"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { DestinationMapVM } from "@/types/destinations";
import Link from "next/link";
import L from "leaflet";
import { useEffect } from "react";
import Button from "../common/Button";

const iconRetinaUrl = "/leaflet/marker-icon-2x.png";
const iconUrl = "/leaflet/marker-icon.png";
const shadowUrl = "/leaflet/marker-shadow.png";

type Props = {
  destination: DestinationMapVM | null;
};

export default function DestinationMap({ destination }: Props) {
  useEffect(() => {
    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
  }, []);
  function FlyTo({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo([latitude, longitude], 10, {
        duration: 2,
      });
    }, [latitude, longitude, map]);
    return null;
  }
  return (
    <div className="relative w-full h-[60vh]">
      <MapContainer
        center={[36.5, 127.5]} // 대한민국 중심
        zoom={7}
        minZoom={6}
        maxZoom={12}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        maxBounds={[
          [32.5, 123.5], // SW
          [40.5, 132.0], // ✅ NE: 북쪽 여백 확장 (38.5 → 40.5)
        ]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destination && (
          <>
            <FlyTo
              latitude={destination.latitude}
              longitude={destination.longitude}
            />
            <Marker
              key={destination.slug}
              position={[destination.latitude, destination.longitude]}
            >
              <Popup>
                <div className="w-56 space-y-3">
                  {/* 제목/별점 */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-neutral-900">
                        {destination.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600">
                        <span aria-hidden>⭐</span>
                        <span>{destination.score.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* 작은 뱃지 느낌 */}
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
                      지역
                    </span>
                  </div>

                  {/* 구분선 */}
                  <div className="h-px w-full bg-neutral-200" />

                  {/* CTA 버튼 */}
                  <Link href={`/destinations/${destination.slug}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      여행지 상세보기
                    </Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
