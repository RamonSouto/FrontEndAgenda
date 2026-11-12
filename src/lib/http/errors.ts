//src/lib/http/errors.ts
export interface ApiErrorPayload {
    status: number;
    message: string;
    details?: Record<string, string[]> | null;
}

export class ApiError extends Error {
    public readonly status: number;
    public readonly details: Record<string, string[]> | null;

    constructor({ status, message, details = null }: ApiErrorPayload) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }

    get isUnauthorized() {
        return this.status === 401
    }

    get isForbidden() {
        return this.status === 403;
    }

    get isValidation() {
        return this.status === 422 || this.status === 400;
    }
}