export type ActionResult<TData> =
  | { success: true; data: TData }
  | { success: false; error: string };
