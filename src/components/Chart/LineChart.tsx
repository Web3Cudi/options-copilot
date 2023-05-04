import React from "react";
import { useEffect, useRef } from "react";

import { sub } from "date-fns";
import { useAtomValue } from "jotai";
import { createChart, ColorType } from "lightweight-charts";

import { LAPTOP_BREAK_POINT, LAPTOP_LG_BREAK_POINT } from "@/constants/index";
import { useGetTrades } from "@/features/tradeHistory";
import { statsDateStringAtom } from "@/features/tradeStats/atoms";
import { useWindowSize } from "@/hooks/useWindowSize";
import { mergeTradesByDay } from "@/utils/helper";

const LineChart = () => {
  const windowSize = useWindowSize();

  const dateRangeStr = useAtomValue(statsDateStringAtom);
  const { data } = useGetTrades(dateRangeStr);

  const chartContainerRef = useRef<HTMLDivElement>();
  const toolTipRef = useRef<HTMLDivElement>();

  const lineDataPnl = mergeTradesByDay(data)?.map((d) => ({
    time: new Date(d.date_time).getTime() / 1000,
    value: d.pnl_realized,
  }));

  const initialPnl = data
    ? {
        time: sub(new Date(data[0]?.date_time), { days: 1 }).getTime() / 1000,
        value: 0,
      }
    : { time: 0, value: 0 };

  lineDataPnl?.unshift(initialPnl);

  const newLineData = lineDataPnl?.reduce((arr, data, index) => {
    if (index === 0) arr.push({ ...data });
    else {
      arr.push({
        time: data.time,
        value: Number((arr[index - 1].value + data.value).toFixed(2)),
      });
    }

    return arr;
  }, []);
  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width:
        windowSize.width >= LAPTOP_LG_BREAK_POINT
          ? 400
          : windowSize.width >= LAPTOP_BREAK_POINT
          ? 700
          : 450,
      height: 400,
      rightPriceScale: {
        autoScale: false,
      },

      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },

      layout: {
        textColor: "white",
        background: { type: ColorType.Solid, color: "#0f1526b5" },
      },
    });
    chart.timeScale().fitContent();

    const lastItem = newLineData
      ? newLineData[newLineData.length - 1]
      : {
          time: 0,
          value: 0,
        };
    const lineSeries = chart.addAreaSeries({
      lineColor: lastItem.value > 0 ? "#208B42" : "#9c163a",
      topColor: lastItem.value > 0 ? "#239447" : "#67182d",
      bottomColor:
        lastItem.value > 0
          ? "rgba(33, 85, 40, 0.366)"
          : "rgba(194, 39, 75, 0.366)",
    });

    if (newLineData?.length > 1) {
      lineSeries.setData(newLineData);
    }

    chart.subscribeCrosshairMove((param) => {
      if (param.point === undefined || !param.time) {
        toolTipRef.current.style.display = "none";
      } else {
        const hoveredTime = param.time;
        const { value: dailyPnl } = lineDataPnl.find(
          (data) => data.time === hoveredTime
        );

        const accountChangePercentage = (dailyPnl / 50000) * 100;
        toolTipRef.current.style.display = "block";

        toolTipRef.current.innerHTML =
          accountChangePercentage != 0
            ? `DailyPnL ${dailyPnl.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}\n${accountChangePercentage.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })} %`
            : ``;
      }
    });

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [newLineData]);

  return (
    <div className="flex" ref={chartContainerRef}>
      <div
        className="absolute top-10 ml-5 text-white z-10  whitespace-pre"
        ref={toolTipRef}
      />
    </div>
  );
};

export default LineChart;
