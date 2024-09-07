import { ApiResponse } from '../interfaces/response.interface';

export function createResponse<S>(
  ok: boolean,
  message: string,
  data: S,
): ApiResponse<S> {
  return {
    ok,
    message,
    data,
  };
}
