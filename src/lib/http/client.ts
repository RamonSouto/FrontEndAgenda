//src/lib/http/client.ts
import { parseCookies } from 'nookies';
import { ApiError } from './errors';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface RequestOptions extends RequestInit {
    skipAuth?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth, headers, ...rest } = options;
    const cookies = parseCookies();
    const token = cookies['agenda.token'];

    const isFormData = rest.body instanceof FormData;

    const finalHeaders: HeadersInit = {
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
    };

    const response = await fetch(`${BASE_URL}${path}`, {
        ...rest,
        headers: finalHeaders,
    });

    const isJson = response.headers.get('Content-Type')?.includes('application/json');
    const body = isJson ? await response.json().catch(() => null) : null;

    if (!response.ok) {
        const mensagemErro =
            typeof body?.erro === 'string'
                ? body.erro
                : body?.mensagem ?? 'Erro inesperado na comunicação com o servidor';

        throw new ApiError({

            status: response.status,
            message: mensagemErro,
            details: body?.erro && typeof body.erro === 'object' ? body.erro : null,
        });
    }
    return body as T;
}

function montarBody(data: unknown): BodyInit | undefined {
    if (data === undefined || data === null) return undefined;
    if (data instanceof FormData) return data; // envia como está, sem stringify
    return JSON.stringify(data);
}
export const httpClient = {
    get: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
    post: <T>(path: string, data?: unknown, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'POST', body: montarBody(data) }),
    put: <T>(path: string, data?: unknown, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'PUT', body: montarBody(data) }),
    patch: <T>(path: string, data?: unknown, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'PATCH', body: montarBody(data) }),
    delete: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'DELETE' }),
    upload: <T>(path: string, formData: FormData, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'POST', body: formData }),
}