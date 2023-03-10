import { useAtomValue, useSetAtom } from "jotai";
import { datePickerAtom, dateRangeAtom, dateRangeString } from "src/atoms";

import { BackButton } from "@/components/Buttons/BackButton";
import Layout from "@/components/Layout";
import {
  CsvButtonUpload,
  TagFilterBadge,
  TradeDatePicker,
  TradePagination,
  TradeTable,
  useGetTrades,
} from "@/features/tradeHistory";
import { supabase } from "@/utils/supabaseClient";

const trades = ({ user }) => {
  const setTradeRange = useSetAtom(dateRangeAtom);
  const dateRangeStr = useAtomValue(dateRangeString);
  const dateRange = useAtomValue(datePickerAtom);
  const { data, isSuccess } = useGetTrades(dateRangeStr);

  const handleSelectDate = (value) => {
    setTradeRange(value);
  };

  return (
    <Layout>
      <div className="md:flex justify-between space-y-5 md:space-y-0  ">
        <div className="text-3xl font-bold text-white">Trade History</div>
        <div className="btn-group">
          <button className="btn btn-outline btn-info">Add Trade</button>
          <CsvButtonUpload user={user} />
        </div>
      </div>
      <div className="flex absolute top-36 items-center space-x-4">
        <BackButton />
        <TagFilterBadge />
      </div>
      <div className="absolute top-36 right-14 hidden md:inline-block">
        <TradeDatePicker value={dateRange} selectDate={handleSelectDate} />
      </div>

      <TradeTable />
      {isSuccess && <TradePagination totalTrades={data.length} />}
    </Layout>
  );
};

export default trades;

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
  return { props: { user } };
}
