// src/types/kakao-maps.d.ts
export {};

declare global {
  interface Window {
    kakao?: KakaoNamespace;
  }

  interface KakaoNamespace {
    maps: KakaoMaps;
  }

  interface KakaoMaps {
    load(callback: () => void): void;

    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    LatLngBounds: new (sw?: KakaoLatLng, ne?: KakaoLatLng) => KakaoLatLngBounds;

    Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
    Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
    CustomOverlay: new (
      options: KakaoCustomOverlayOptions,
    ) => KakaoCustomOverlay;
    Polyline: new (options: KakaoPolylineOptions) => KakaoPolyline;
    ZoomControl: new () => KakaoZoomControl;
    ControlPosition: {
      TOPLEFT: number;
      TOPRIGHT: number;
      LEFT: number;
      RIGHT: number;
      BOTTOMLEFT: number;
      BOTTOMRIGHT: number;
    };

    event: {
      addListener(
        target: KakaoMap | KakaoMarker | KakaoCustomOverlay,
        type: string,
        handler: () => void,
      ): void;
      removeListener?(
        target: KakaoMap | KakaoMarker | KakaoCustomOverlay,
        type: string,
        handler: () => void,
      ): void;
    };
  }

  type KakaoLatLng = unknown;

  interface KakaoMapOptions {
    center: KakaoLatLng;
    level?: number;
  }

  interface KakaoLatLngBounds {
    extend(latlng: KakaoLatLng): void;
  }

  interface KakaoPolylineOptions {
    path: KakaoLatLng[];
    strokeWeight?: number;
    strokeOpacity?: number;
    strokeStyle?: string;
    strokeColor?: string;
  }

  interface KakaoPolyline {
    setMap(map: KakaoMap | null): void;
  }

  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void;
    setLevel(level: number): void;
    panTo(latlng: KakaoLatLng): void;

    setMinLevel?(level: number): void;
    setMaxLevel?(level: number): void;

    addControl(control: KakaoZoomControl, position: number): void;

    setBounds(
      bounds: KakaoLatLngBounds,
      paddingTop?: number,
      paddingRight?: number,
      paddingBottom?: number,
      paddingLeft?: number,
    ): void;
  }

  interface KakaoMarkerOptions {
    position: KakaoLatLng;
  }

  interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
    setPosition(latlng: KakaoLatLng): void;
    getMap(): KakaoMap | null;
  }

  interface KakaoCustomOverlayOptions {
    position: KakaoLatLng;
    content: HTMLElement;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }

  interface KakaoCustomOverlay {
    setMap(map: KakaoMap | null): void;
    setPosition(latlng: KakaoLatLng): void;
    setContent(content: HTMLElement): void;
    getMap(): KakaoMap | null;
  }
}
