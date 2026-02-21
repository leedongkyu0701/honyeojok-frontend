"use client";

import CommunityTabsMobile from "./CommunitySidebarMobile";
import CommunitySidebarDesktop from "./CommunitySidebarDesktop";
import { useCommunityFilters } from "@/lib/useCommunityFilters";

export default function CommunityFilters() {
  const { state, setType, setProvince } = useCommunityFilters();

  return (
    <>
      {/* 모바일: 상단 탭 */}
      <CommunityTabsMobile value={state.type} onChange={setType} province={state.province} onChangeProvince={setProvince} />

      {/* 데스크탑: 좌측 패널 */}
      <CommunitySidebarDesktop value={state.type} onChange={setType} province={state.province} onChangeProvince={setProvince} />
    </>
  );
}