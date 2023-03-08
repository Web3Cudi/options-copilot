import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/utils/supabaseClient";

export const useGetTagsByType = (tagType: "setup" | "mistake" | "custom") => {
  const user = supabase.auth.user();

  const fetchTagsByType = async (tagType: string) => {
    const { data, error } = await supabase
      .from("trade_details_tags")
      .select("*,trade_tags!inner(tag_id,name)")
      .eq("trade_tags.tag_type", tagType)
      .eq("trade_tags.user_id", user.id)
      .order("tag_id", { ascending: true });

    if (error) console.log("error", error);
    else return data;
  };

  return useQuery(["tagsByType", tagType], () => fetchTagsByType(tagType), {
    refetchOnMount: true,
    keepPreviousData: true,
  });
};
