import { ApiVersion, HttpsRequest } from '../interfaces/services/http-request';
import { ApiError } from './api-error';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
const DEFAULT_VERSION = ApiVersion.V1;

export class HttpsRequestService implements HttpsRequest {
  constructor(
    public version = DEFAULT_VERSION,
    public headers: Record<string, string> = DEFAULT_HEADERS,
    public endpoint = ''
  ) {}

  protected configRequest(request: HttpsRequest): void {
    const {
      version = DEFAULT_VERSION,
      headers = DEFAULT_HEADERS,
      endpoint,
    } = request;

    this.version = version;
    this.headers = headers;
    this.endpoint = endpoint;
  }

  private urlBuilder(): string {
    return `/api/${this.version}/${this.endpoint}`;
  }

  protected async get<T>(): Promise<T> {
    return this.request<T>('GET');
  }

  protected post<T>(body: unknown): Promise<T> {
    return this.request<T>('POST', body);
  }

  protected put<T>(body: unknown): Promise<T> {
    return this.request<T>('PUT', body);
  }

  protected delete<T>(): Promise<T> {
    return this.request<T>('DELETE');
  }

  private async request<T>(method: string, body?: unknown): Promise<T> {
    const options: RequestInit = {
      method,
      headers: this.headers,
    };

    if (body) {
      options.body = JSON.stringify(body);

      if (!this.headers['Content-Type']) {
        this.headers['Content-Type'] = 'application/json';
      }
    }

    try {
      const response = await fetch(this.urlBuilder(), options);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (error) {
          // Fallback if the server didn't return valid JSON (for example: a crash HTML page)
          errorData = { message: (await response.text()) || 'Unknown error' };
        }

        throw new ApiError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      // No content response
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      this.logError(error);

      throw error;
    }
  }

  private logError(error: unknown): void {
    if (error instanceof ApiError) {
      console.error(
        `[API Error] ${error.status}: ${error.message}`,
        error.data
      );
    } else if (
      error instanceof TypeError &&
      error.message === 'Failed to fetch'
    ) {
      console.error('[Network Error]: Check your internet or CORS settings.');
    } else {
      console.error('[Unexpected Error]:', error);
    }
  }
}
