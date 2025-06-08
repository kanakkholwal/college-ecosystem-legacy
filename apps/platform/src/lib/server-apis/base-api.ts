import type { BetterFetch } from "@better-fetch/fetch";

export type fetchParams = Parameters<BetterFetch>;

export type HttpMethod = "GET" | "POST" | "DELETE" | "PUT" | "OPTIONS";
export type ApiConfigEntry<P, R> = {
    url: string;
    method: HttpMethod;
    transformParams?: (payload: P) => Record<string, string>;
    transformBody?: (payload: P) => any;
    transformResponse?: (res: unknown) => R;

} 

export type ApiConfigMap = Record<string, ApiConfigEntry<any, any>>;
// export type ApiConfigMap<Payload,Response> = Record<string, ApiConfigEntry<Payload, Response>>;

export function createApiInstance<T extends ApiConfigMap>(
    fetchInstance: BetterFetch,
    config: T
): {
        [K in keyof T]: (
            payload: T[K] extends ApiConfigEntry<infer P, any> ? P : never
        ) => Promise<T[K] extends ApiConfigEntry<any, infer R> ? R : never>;
    } {
    const api = {} as any;

    for (const key in config) {
        const { url, method, transformParams, transformBody, transformResponse } = config[key];

        api[key] = async (payload: any) => {
            let finalUrl = url;

            if (transformParams) {
                const params = transformParams(payload);
                finalUrl = finalUrl.replace(/:(\w+)/g, (_, key) =>
                    encodeURIComponent(params?.[key])
                );
            }

            const body =
                method !== "GET" && payload !== undefined
                    ? JSON.stringify(transformBody ? transformBody(payload) : payload)
                    : undefined;

            const rawRes = await fetchInstance(finalUrl, {
                method,
                ...((method === "PUT" || method !== "POST") ? {
                    ... (transformBody ? { body } : {}),
                } : {}),
            });

            return transformResponse ? transformResponse(rawRes) : rawRes;
        };
    }

    return api;
}




