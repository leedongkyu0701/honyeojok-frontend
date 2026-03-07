"use client";

import { useEffect, useState } from "react";

export function useKakaoMapLoader(libraries: string[] = []) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!key) {
      return;
    }

    if (window.kakao?.maps) {
      window.kakao.maps.load(() => setReady(true));
      return;
    }

    const scriptId = "kakao-map-sdk";
    if (document.getElementById(scriptId)) return;

    const libParam = libraries.length
      ? `&libraries=${libraries.join(",")}`
      : "";

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false${libParam}`;
    script.async = true;

    script.onload = () => {
      window.kakao?.maps.load(() => setReady(true));
    };

    document.head.appendChild(script);
  }, [libraries]);

  return ready;
}
