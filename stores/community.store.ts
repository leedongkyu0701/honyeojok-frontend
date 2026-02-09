import { create } from "zustand";
import { CategoryType } from "@/types/post";

interface CommunityState {
  category: CategoryType;
  setCategory: (category: CategoryType) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  category: "ALL",
  setCategory: (category) => set({ category}),

}));
