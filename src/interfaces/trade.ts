export interface CsvData {
  UnderlyingSymbol: string;
  Description: string;
  DateTime: string;
  Conid: number;
  Quantity: number;
  TradePrice: number;
  FifoPnlRealized: number;
}

export interface CalendarTradeData {
  contract_id: number;
  user_id: string;
  pnl_realized: number;
  date_time: string;
  totalTrades: number;
}

export interface TradeData {
  contract_id: number;
  date_time: string;
  description: string;
  id: number;
  pnl_realized: number;
  quantity: number;
  symbol: string;
  trade_price: number;
  user_id: string;
}

export interface ManualTrade {
  symbol: string;
  strike: string;
  contractId: string;
  openDate: Date;
  closeDate: Date;
  openTradePrice: number;
  closeTradePrice: number;
  quantity: number;
}

export interface TradeTag {
  name?: string;
  value: string;
  label: string;
  tag_type: string;
  tag_id: number;
}

export interface ContractTag {
  contract_id: number;
  date: string;
  tag_id: number;
  user_id: string;
}

export interface TradeDetails {
  tradeData: {
    trades: TradeData[];
    count: number;
  };
  stockData: {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
  };
  allTags: {
    data: TradeTag[];
  };
  contractTags: {
    data: ContractTag[];
  };
}

export interface DeleteTagState {
  modalToggle: boolean;
  deleteTagId: null | number;
}
