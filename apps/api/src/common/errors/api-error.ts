export interface ApiError {
  code: string;
  message: string;
}

export interface ApiErrorResponse extends ApiError {
  statusCode: number;
}
