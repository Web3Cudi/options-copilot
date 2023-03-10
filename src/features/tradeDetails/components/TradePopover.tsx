import { useAtomValue } from "jotai";
import { Popover, Whisper } from "rsuite";

import { tradeByIdAtom } from "../atom";

export const TradePopover = () => {
  const selectedTrade = useAtomValue(tradeByIdAtom);

  return (
    <Whisper
      followCursor
      speaker={
        <Popover className="bg-black text-white">
          <ul>
            {selectedTrade.map((data) => (
              <div key={data.id}>{`${data.quantity > 0 ? "Buy" : "Sell"} ${
                data.quantity
              } x ${data.trade_price} @ ${data.date_time.slice(11)}`}</div>
            ))}
          </ul>
        </Popover>
      }
    >
      <p className="underline">Options Traded</p>
    </Whisper>
  );
};
