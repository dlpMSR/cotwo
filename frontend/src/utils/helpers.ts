import dayjs from "dayjs"
import { trendDatum, trendDatumUnixtime } from "@/types"

export const timestampToUnixtime = (item: trendDatum): trendDatumUnixtime => {
  return {
    timestamp: dayjs(item.timestamp).unix(),
    value: item.value
  }
}
