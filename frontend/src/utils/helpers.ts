import dayjs from "dayjs";
import { trendDatum, trendDatumUnixtime } from "@/types";

export const timestampToUnixtime = (item: trendDatum): trendDatumUnixtime => {
  return {
    timestamp: dayjs(item.timestamp).unix(),
    value: item.value,
  };
};

export const rollTimeSeries = (
  target: trendDatumUnixtime[],
  newValue: trendDatumUnixtime
) => {
  // targetの先頭にnewValueを追加し、末尾の値を削除する
  if (target.length > 0) {
    target.unshift(newValue);
    target.pop();
  }

  return target;
};

export const calculateTrendMovingAverage = (
  target: trendDatumUnixtime[],
  n: number = 30
): trendDatumUnixtime[] => {
  // nが偶数だと面倒なので、1足して奇数とする
  if (n % 2 === 0) n = n + 1;

  // 対象のデータ数が不足している場合は例外を投げる
  if (target.length < n) {
    throw new Error("The number of data elements is too small.");
  }

  let sum = target.slice(0, n - 1).reduce((acc, cur) => acc + cur.value, 0);
  let ret: trendDatumUnixtime[] = [
    {
      timestamp: target[Math.floor(n / 2)].timestamp,
      value: sum / n,
    },
  ];
  for (let i = 1; true; i++) {
    if (target[i + n - 1] === undefined) break;
    sum = sum - target[i - 1].value + target[i + n - 1].value;
    ret.push({
      timestamp: target[Math.floor(i + n / 2)].timestamp,
      value: sum / n,
    });
  }

  return ret;
};
