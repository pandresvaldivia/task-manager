export interface HttpsRequest {
  version?: ApiVersion;
  headers?: Record<string, string>;
  endpoint: string;
}

export enum ApiVersion {
  V1 = 'v1',
}
