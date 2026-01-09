import { apiError, ApiResponse, apiSuccess } from '../dto/api-response';
import { ApiError } from '../errors/api-error';
import { ApiVersion, HttpsRequest } from '../interfaces/http-client';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
const DEFAULT_VERSION = ApiVersion.V1;

interface RequestOptions {
  method: string;
  body?: unknown;
  endpoint: string;
}

export class HttpRequestService implements HttpsRequest {
  constructor(
    public version = DEFAULT_VERSION,
    public headers: Record<string, string> = DEFAULT_HEADERS
  ) {}

  protected configRequest(request: HttpsRequest): void {
    const { version = DEFAULT_VERSION, headers = DEFAULT_HEADERS } = request;

    this.version = version;
    this.headers = headers;
  }

  private urlBuilder(endpoint: string): string {
    return `/api/${this.version}/${endpoint}`;
  }

  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', endpoint });
  }

  protected post<T>(body: unknown, endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', body, endpoint });
  }

  protected put<T>(body: unknown, endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', body, endpoint });
  }

  protected delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', endpoint });
  }

  private async request<T>({
    method,
    body,
    endpoint,
  }: RequestOptions): Promise<ApiResponse<T>> {
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
      const response = await fetch(this.urlBuilder(endpoint), options);

      if (!response.ok) {
        const rawErrorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(rawErrorText);
        } catch (error) {
          errorData = { message: rawErrorText ?? 'Unknown error' };
        }

        throw new ApiError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      // No content response
      if (response.status === 204) {
        return apiSuccess<T>({} as T);
      }

      const data = await response.json();
      return apiSuccess<T>(data);
    } catch (error) {
      this.logError(error);

      return apiError(error);
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
