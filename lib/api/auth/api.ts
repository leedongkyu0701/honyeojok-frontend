import { fetchClient } from "@/lib/fetchClient";
import { parseApiError } from "@/lib/parseApiError";

export async function logout() {
    await fetchClient(`/auth/logout`, {
        method: "POST"
    });
    return;
}


export async function refreshToken() {
    const response = await fetchClient(`/auth/refresh-token`, {
        method: "POST", skipAuth: true
    });
    await parseApiError(response);
    return response.json();
}
