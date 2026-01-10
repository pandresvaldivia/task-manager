export type ApiResponse<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: unknown };

export const apiSuccess = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  error: null,
});

export const apiError = (error: unknown): ApiResponse<never> => ({
  success: false,
  data: null,
  error,
});

export interface ApiGenericResponse<T> {
  data: T;
}
