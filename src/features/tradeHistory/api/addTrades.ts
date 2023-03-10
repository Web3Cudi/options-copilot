import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/components/toast/ToastMessage";
import { ManualTrade } from "@/interfaces/trade";
import { combineDailyTrades } from "@/utils/sort";
import { supabase } from "@/utils/supabaseClient";

const addTrade = async (data: ManualTrade | ManualTrade[]) => {
  const { data: trades, error: err } = await supabase
    .from("trade_records")
    .insert(data);

  if (err) {
    console.log("err", err);
    throw err;
  }

  return trades;
};

export const useAddTrades = () => {
  const queryClient = useQueryClient();

  return useMutation((data: ManualTrade | ManualTrade[]) => addTrade(data), {
    onSuccess: (data) => {
      queryClient.refetchQueries(["trades"]);
      notify(
        "success",
        `Success ${combineDailyTrades(data).length} Trades were Added!`
      );
    },
    onError: () => notify("error", "Error Importing Trades"),
  });
};
