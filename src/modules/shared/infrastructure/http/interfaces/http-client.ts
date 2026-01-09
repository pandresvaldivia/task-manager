export interface HttpsRequest {
  version?: ApiVersion;
  headers?: Record<string, string>;
}

export enum ApiVersion {
  V1 = 'v1',
}
