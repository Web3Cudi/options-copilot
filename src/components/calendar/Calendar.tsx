import { useState } from "react";

import {
  add,
  differenceInDays,
  endOfMonth,
  format,
  startOfMonth,
  sub,
  getDate,
} from "date-fns";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { dateRangeAtom } from "src/atoms";

import { useGetTrades } from "@/features/tradeHistory";
import { mergeTradesByDay } from "@/utils/helper";

import { Cell } from "./Cell";

const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const setTradeRange = useSetAtom(dateRangeAtom);
  const router = useRouter();

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();
  const { data, isSuccess } = useGetTrades({ startDate, endDate });

  const dailyTrades = mergeTradesByDay(data);

  const prevMonth = () => setCurrentDate(sub(currentDate, { months: 1 }));
  const nextMonth = () => setCurrentDate(add(currentDate, { months: 1 }));

  const handleClick = (data) => {
    setTradeRange(data);
    router.push("/trades");
  };

  return (
    <div className="w-[70rem] border-t border-l">
      <div
        data-theme="night"
        className="grid grid-cols-7 items-center justify-center text-center "
      >
        <div className="col-span-7 border-b border-r p-3 select-none text-white flex justify-between">
          <span className="cursor-pointer" onClick={() => prevMonth()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
          </span>
          {format(currentDate, "LLLL yyyy")}
          <span className="cursor-pointer" onClick={() => nextMonth()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </span>
        </div>
        {weeks.map((week) => (
          <div key={week} className="border-r border-b">
            {week}
          </div>
        ))}
        {isSuccess && (
          <>
            {Array.from({ length: prefixDays }).map((_, index) => (
              <Cell key={index} isDisabled />
            ))}

            {Array.from({ length: numDays }).map((_, index) => {
              if (index + 1 === getDate(new Date(dailyTrades[0]?.date_time))) {
                const trade = dailyTrades.shift();
                const highlightColor =
                  trade.pnl_realized > 0
                    ? "bg-success-content"
                    : trade.pnl_realized < 0
                    ? "bg-error-content"
                    : "";
                const tradeDate = trade.date_time;
                return (
                  <Cell
                    key={index}
                    highlightColor={highlightColor}
                    date={tradeDate}
                    handleClick={(data) => handleClick(data)}
                  >
                    {index + 1}
                    <span className="w-full text-right ml-9">
                      {trade.totalTrades} Trade {trade.pnl_realized.toFixed(2)}
                    </span>
                  </Cell>
                );
              } else
                return (
                  <Cell key={index} isDisabled>
                    {index + 1}
                  </Cell>
                );
            })}
            {Array.from({ length: suffixDays }).map((_, index) => (
              <Cell key={index} isDisabled />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
