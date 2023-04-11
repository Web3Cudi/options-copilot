import React, { useEffect, useReducer, useRef, useState } from "react";

import { useAtom, useAtomValue } from "jotai";
import {
  createChart,
  SeriesMarker,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import {
  HANDLE_ERROR,
  HANDLE_INTERVAL_CHANGE,
  TOGGLE_MODAL,
} from "src/actions/actions";
import { timeFrameAtom } from "src/atoms";
import { timeFrameReducer } from "src/reducers/timeFrameModalReducer";

import { TIME_FRAMES } from "@/constants/index";
import { stockCandlesAtom, tradeByIdAtom } from "@/features/tradeDetails/atom";
import { timeToLocal } from "@/utils/helper";

import TimeFrameModal from "../Modals/TimeFrameModal";

const CandleStick = () => {
  const tradeData = useAtomValue(tradeByIdAtom);
  const candleData = useAtomValue(stockCandlesAtom);
  const [timeframe, setTimeFrame] = useAtom(timeFrameAtom);

  const chartRef = useRef<HTMLDivElement>();
  const [legend, setLegend] = useState("");
  const [{ isModalOpen, data, isError }, dispatch] = useReducer(
    timeFrameReducer,
    {
      isModalOpen: false,
      data: "",
      isError: false,
    }
  );

  const {
    ONE_MIN_TIMEFRAME,
    FIVE_MIN_TIMEFRAME,
    FIFTEEN_MIN_TIMEFRAME,
    SIXTY_SECOND_TIMEFRAME,
  } = TIME_FRAMES;

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: 1000,
      height: 715,
      crosshair: {
        mode: 0,
      },

      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#485158",
      },
    });

    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
    });
    const volumeData = candleData.map((candleStick) => {
      return {
        time: candleStick.time,
        value: candleStick.volume,
        color: candleStick.close > candleStick.open ? "#26a69a" : "#ef5350",
      };
    });

    volumeSeries.setData(volumeData);

    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(candleData);

    const markers: SeriesMarker<Time>[] = tradeData.map((trade) => ({
      time: (timeToLocal(new Date(trade.date_time).getTime() / 1000) -
        SIXTY_SECOND_TIMEFRAME * timeframe) as UTCTimestamp,
      position: trade.quantity > 0 ? "belowBar" : "aboveBar",
      color: trade.quantity > 0 ? "#071de09a" : "#ef5350",
      shape: trade.quantity > 0 ? "arrowUp" : "arrowDown",
      text:
        trade.quantity > 0
          ? `B ${trade.quantity} @ ${trade.trade_price}`
          : `S ${trade.quantity} @ ${trade.trade_price}`,
    }));

    candleSeries.setMarkers(markers);

    chart.subscribeCrosshairMove((param) => {
      if (!param.point) {
        return;
      }
      const chartHoverData = candleData.find((x) => x.time == param.time);
      if (chartHoverData) {
        const hoverStr = `O: ${chartHoverData.open.toFixed(
          2
        )} H: ${chartHoverData.high.toFixed(2)} L: ${chartHoverData.low.toFixed(
          2
        )} C: ${chartHoverData.close.toFixed(2)}`;
        setLegend(hoverStr);
      }
    });

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [candleData]);

  const handleKeyPress = () => {
    if (!isModalOpen) dispatch({ type: TOGGLE_MODAL });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      [ONE_MIN_TIMEFRAME, FIVE_MIN_TIMEFRAME, FIFTEEN_MIN_TIMEFRAME].some(
        (num) => num === parseInt(data)
      )
        ? handleSuccess()
        : dispatch({ type: HANDLE_ERROR });
    }
  };

  const handleSuccess = () => {
    setTimeFrame(parseInt(data)), dispatch({ type: TOGGLE_MODAL });
  };
  return (
    <div
      className="relative cursor-crosshair"
      ref={chartRef}
      onKeyDown={() => handleKeyPress()}
      tabIndex={1}
    >
      <div className="absolute top-4 ml-3 text-black z-10">{legend}</div>
      {isModalOpen && (
        <TimeFrameModal
          error={isError}
          data={data}
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({
              type: HANDLE_INTERVAL_CHANGE,
              payload: e.target.value,
            })
          }
          handleKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};

export default CandleStick;
