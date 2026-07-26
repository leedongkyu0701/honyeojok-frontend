"use client";

import { useCommunityFilters } from "@/features/community/hooks/useCommunityFilters";
import CommunitySidebarDesktop from "./CommunitySidebarDesktop";
import CommunityTabsMobile from "./CommunityTabsMobile";

export default function CommunityFilters() {
  const { state, setProvince, setType } = useCommunityFilters();

  return (
    <>
      <CommunityTabsMobile
        value={state.type}
        province={state.province}
        onChange={setType}
        onChangeProvince={setProvince}
      />
      <CommunitySidebarDesktop
        value={state.type}
        province={state.province}
        onChange={setType}
        onChangeProvince={setProvince}
      />
    </>
  );
}
