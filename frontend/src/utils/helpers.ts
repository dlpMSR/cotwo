import dayjs from "dayjs"
import { trendDatum, trendDatumUnixtime } from "@/types"

export const timestampToUnixtime = (item: trendDatum): trendDatumUnixtime => {
  return {
    timestamp: dayjs(item.timestamp).unix(),
    value: item.value
  }
}

export const rollTimeSeries = (target: trendDatumUnixtime[] ,newValue: trendDatumUnixtime) => {
  // targetの先頭にnewValueを追加し、末尾の値を削除する
  if (target.length > 0) {
    target.unshift(newValue);
    target.pop();
  }

  return target;
}
