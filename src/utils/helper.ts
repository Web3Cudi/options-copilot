import { isSameDay } from "date-fns";

import { TradeData, CalendarTradeData } from "@/interfaces/trade";

import { PAGE_LIMIT } from "../constants";

export const getPagination = (page: number, limit = PAGE_LIMIT) => {
  const pageStart = page ? (page - 1) * limit : 0;

  const pageEnd = page ? page * limit - 1 : limit;

  return { pageStart, pageEnd };
};

/**
 * Returns Object containing two date values one being the time market opens which is 9:30 est
 * and the other being market close 4:00 est -> 16:00 MilitaryTime
 *
 * @param {Date[]} dateRange Array containg date fields
 * @return {startDate, endDate}
 */
export const getTradeRangeTime = (dateRange: Array<string | number | Date>) => {
  const marketHourOpen = 9;
  const marketMinuteOpen = 30;
  const marketHourClose = 16; // Militaray 24Hr Format
  const marketMinuteClose = 0;
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);

  startDate.setHours(marketHourOpen);
  startDate.setMinutes(marketMinuteOpen);
  endDate.setHours(marketHourClose);
  endDate.setMinutes(marketMinuteClose);

  return { startDate, endDate };
};

/**
 * Returns unix time stamp in utc default  GMT+0000 format for lightweight charts to display data.
 * Lightweight charts does not have a way of working with different timezones so this was one of the solutions discuseed
 * https://tradingview.github.io/lightweight-charts/docs/time-zones
 *
 * @param {Number} originalUnixTimeStamp timestamp containing local time
 * @return {utcDate: unixTimeStamp}
 */
export const timeToLocal = (originalTime: number) => {
  const utcDate = new Date(originalTime * 1000);
  return (
    Date.UTC(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate(),
      utcDate.getHours(),
      utcDate.getMinutes(),
      utcDate.getSeconds(),
      utcDate.getMilliseconds()
    ) / 1000
  );
};

export const mergeTradesByDay = (
  tradeArray: TradeData[]
): CalendarTradeData[] =>
  tradeArray?.reduce((accumulator, currentValue, currentIndex) => {
    if (currentIndex == 0)
      accumulator.push({
        contract_id: currentValue.contract_id,
        user_id: currentValue.user_id,
        pnl_realized: currentValue.pnl_realized,
        date_time: currentValue.date_time,
        totalTrades: 1,
      });
    else {
      if (
        isSameDay(
          new Date(currentValue.date_time),
          new Date(accumulator[accumulator.length - 1].date_time)
        )
      ) {
        let updatedPnlRealized =
          currentValue.pnl_realized +
          accumulator[accumulator.length - 1].pnl_realized;
        accumulator[accumulator.length - 1] = {
          ...accumulator[accumulator.length - 1],
          pnl_realized: updatedPnlRealized,
          totalTrades: accumulator[accumulator.length - 1].totalTrades + 1,
        };
      } else {
        accumulator.push({
          contract_id: currentValue.contract_id,
          user_id: currentValue.user_id,
          pnl_realized: currentValue.pnl_realized,
          date_time: currentValue.date_time,
          totalTrades: 1,
        });
      }
    }
    return accumulator;
  }, []);
