"use client";

import CommunityTabsMobile from "./CommunitySidebarMobile";
import CommunitySidebarDesktop from "./CommunitySidebarDesktop";
import { useCommunityFilters } from "@/features/community/hooks/useCommunityFilters";

export default function CommunityFilters() {
  const { state, setType, setProvince } = useCommunityFilters();

  return (
    <>

      <CommunityTabsMobile value={state.type} onChange={setType} province={state.province} onChangeProvince={setProvince} />

      <CommunitySidebarDesktop value={state.type} onChange={setType} province={state.province} onChangeProvince={setProvince} />
    </>
  );
}