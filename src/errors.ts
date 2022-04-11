export class JsonLoggerCorruptedError extends Error { }

export class ServiceConnectionError extends Error { }

export class RedisCounterDatabaseError extends Error { }

export class InvalidValueError extends Error { }

export const UNEXPECTED_ERROR_MESSAGE = 'Sorry, there was an unexpected error';

export interface ErrorResponseData {
    errorType: string,
    message: string,
    status: number
}