import { fetchClient } from "@/lib/fetchClient";
import { parseApiError } from "@/lib/parseApiError";
export type TagEntity = {
    id: number;
  slug: string;
  label: string;
};

export const fetchTags = async (): Promise<TagEntity[]> => {
    const response = await fetchClient('/tags',{
        skipAuth: true,
    });
    await parseApiError(response);
    return response.json();
}