import { nowSeconds } from './time.helper';

export function genRes(
  success: boolean,
  status: number,
  data: { [key: string]: any },
) {
  return {
    success: success,
    status: status,
    timestamp: nowSeconds(), // UTC,
    data: data,
  };
}
