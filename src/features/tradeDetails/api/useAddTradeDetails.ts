import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/components/toast/ToastMessage";
import { supabase } from "@/utils/supabaseClient";

const addTradeDetails = async (data) => {
  const { data: tradeDetails, error: err } = await supabase
    .from("trade_details_tags")
    .upsert(data, {
      ignoreDuplicates: true,
    });

  if (err) {
    console.log("err", err);
    throw err;
  }

  return tradeDetails;
};

export const useAddTradeDetails = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (
      data: {
        contract_id: number | string | string[];
        date: string;
        user_id: string;
        tag_id: number;
      }[]
    ) => addTradeDetails(data),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["tradeTags"]);
        notify("success", "Trade Details Updated");
      },
    }
  );
};
