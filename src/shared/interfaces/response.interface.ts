export interface ApiResponse<S> {
  ok: boolean;
  message: string;
  data: S;
}
