import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { tagFilterAtom, tradeDataAtom } from "src/atoms";

import { combineDailyTrades } from "@/utils/sort";
import { supabase } from "@/utils/supabaseClient";

type TradeRange = {
  startDate: Date;
  endDate: Date;
};

export const useGetTrades = (tradeRange?: TradeRange) => {
  const user = supabase.auth.user();
  const setTrades = useSetAtom(tradeDataAtom);
  const tagFilter = useAtomValue(tagFilterAtom);

  const fetchTrades = async (tradeRange: TradeRange) => {
    const { data, error } = !!tradeRange
      ? await getTradesByRange(tradeRange)
      : await getAllTrades();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Trades not found");
    }

    return data;
  };

  const getAllTrades = async () => {
    let query = supabase.from("trade_records").select(`*`, { count: "exact" });

    if (tagFilter.data.length) {
      query = query.in(
        "contract_id",
        tagFilter.data.map((tag) => tag.contract_id)
      );
    }

    const { data, error } = await query;

    return { data, error };
  };

  const getTradesByRange = async (tradeRange: TradeRange) => {
    const { data, error } = await supabase
      .from("trade_records")
      .select(`*`, { count: "exact" })
      .eq("user_id", user.id)
      .gte("date_time", tradeRange.startDate.toLocaleString())
      .lte("date_time", tradeRange.endDate.toLocaleString());
    return { data, error };
  };

  return useQuery(["trades", tradeRange], () => fetchTrades(tradeRange), {
    refetchOnMount: true,
    keepPreviousData: true,
    select: (trades) => combineDailyTrades(trades),
    onSuccess: (trades) => {
      setTrades(trades);
    },
  });
};
