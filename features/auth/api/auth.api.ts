import { fetchClient } from "@/shared/api/fetchClient";
import { parseApiError } from "@/shared/api/parseApiError";

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

export async function withdraw() {
    await fetchClient(`/auth/withdraw`, {
        method: "POST"
    });
    return;
}