import { atom } from "jotai";
import { tradeDataAtom } from "src/atoms";

import { getTradeRangeTime } from "@/utils/helper";

export const statsDateAtom = atom([]);

export const statsDateStringAtom = atom((get) => {
  const dateRange = get(statsDateAtom);
  if (!dateRange.length) {
    return null;
  }
  const { startDate, endDate } = getTradeRangeTime(dateRange);
  return { startDate, endDate };
});

export const tradeStatsAtom = atom((get) => {
  const trades = get(tradeDataAtom);

  return trades.reduce((accum, currentTrade) => {
    if (currentTrade.pnl_realized > 0)
      accum["win"] = (accum["win"] || 0) + currentTrade.pnl_realized;

    if (currentTrade.pnl_realized < 0)
      accum["loss"] = (accum["loss"] || 0) + currentTrade.pnl_realized;

    accum["totalPnL"] = (accum["totalPnL"] || 0) + currentTrade.pnl_realized;
    accum["totalTrades"] = (accum["totalTrades"] || 0) + 1;

    return accum;
  }, {});
});

export const dateStatPickerAtom = atom((get) => {
  const dateRange = get(statsDateAtom);

  if (!dateRange.length) {
    return null;
  }

  const formattedDateRange: [Date, Date] = [
    new Date(dateRange[0]),
    new Date(dateRange[1]),
  ];

  return formattedDateRange;
});
