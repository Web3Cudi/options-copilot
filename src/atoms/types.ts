export type SortType = {
  name: "symbol" | "date" | "quantity" | "trade_price" | "pnl_realized";
  ascending: boolean;
};

export type TagFilter = {
  name: null | string;
  data: { contract_id: any; date: any }[];
};
