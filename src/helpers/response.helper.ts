export function genRes(
  success: boolean,
  status: number,
  data: { [key: string]: any },
) {
  return {
    success: success,
    status: status,
    timestamp: Date.now(), // UTC,
    data: data,
  };
}
