import type { BetterFetch } from "@better-fetch/fetch";

export type FetchParams = Parameters<BetterFetch>;
export type HttpMethod = "GET" | "POST" | "DELETE" | "PUT" | "OPTIONS";

export interface ApiConfigEntry<P, R> {
    url: string;
    method: HttpMethod;
    transformParams?: (payload: P) => Record<string, string>;
    transformBody?: (payload: P) => any;
    transformResponse?: (res: unknown) => R;
    disabled?: boolean;
}

export type ApiConfigMap<T extends Record<string, ApiConfigEntry<any, any>>> = {
    [K in keyof T]: T[K];
};

export function createApiInstance<T extends Record<string, ApiConfigEntry<any, any>>>(
    fetchInstance: BetterFetch,
    config: T
): {
    [K in keyof T]: (
        payload: T[K] extends ApiConfigEntry<infer P, any> ? P : never
    ) => Promise<
        T[K] extends ApiConfigEntry<any, infer R> ? R : never
    >;
} {
    const api = {} as any;

    for (const key in config) {
        const { url, method, transformParams, transformBody, transformResponse } = config[key];

        api[key] = async (payload: any) => {
            let finalUrl = url;

            // Handle URL parameters
            if (transformParams) {
                const params = transformParams(payload);
                finalUrl = finalUrl.replace(/:(\w+)/g, (_, key) =>
                    encodeURIComponent(params?.[key])
                );
            }

            const body = method !== "GET" && payload !== undefined
                ? JSON.stringify(transformBody ? transformBody(payload) : payload)
                : undefined;

            const response = await fetchInstance(finalUrl, {
                method,
                ...(method !== "GET" && body ? { body } : {}),
            });

            // Handle JSON parsing consistently
            const _transformResponse = transformResponse || ((res: unknown) => res as any);

            return _transformResponse 
                ? _transformResponse(response.data) 
                : response.data;
        };
    }

    return api;
}